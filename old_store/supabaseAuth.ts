import type { User } from "@supabase/supabase-js"
import { PaymentAssociation } from '~/models/PaymentAssociation'
import { User as SourceryUser } from '~/models/User'
import { Organization } from '~/models/Organization'
import { Message } from '~/models/Message'
import { Commit, GetterTree, MutationTree, ActionTree, Dispatch } from 'vuex'
import { supabase } from "~/plugins/supabase"
import { notify } from "~/plugins/sourcery-functions"


// Initialize state.
const initialState = () => {
    return {
        authUser: null as User | null,
        authUserMeta: null as SourceryUser | null,
        authUserHasPassword: false,
        authUserPaymentAssociation: null as PaymentAssociation | null,
        authUserOrganizations: [] as Organization[],
        resetAccessToken: '',
        justRegistered: false,
        redirectHome: false
    }
}

export type SupabaseState = ReturnType<typeof initialState>

export const state = initialState

export const getters: GetterTree<SupabaseState, SupabaseState> = {
    authUser(state: SupabaseState) {
        return state.authUser
    },
    authUserMeta(state: SupabaseState) {
        return state.authUserMeta
    },
    isAuthenticated(state: SupabaseState) {
        return state.authUser && state.authUser.aud === "authenticated"
    },
    authUserPaymentAssociation(state: SupabaseState) {
        return state.authUserPaymentAssociation
    },
    ownsAnOrganization(state: SupabaseState) {
        return state.authUserOrganizations.length > 0
    },
    userOrganizations(state: SupabaseState) {
        return state.authUserOrganizations
    },
    userOrganizationIds(state: SupabaseState) {
        return state.authUserOrganizations.map(x => x.id)
    },
    userRepositories(state: SupabaseState) {
        return state.authUserOrganizations.map(x => x.repositories).flat()
    },
    hasPassword(state: SupabaseState) {
        return state.authUserHasPassword
    },
    isLoggedIn(state: SupabaseState) {
        return !!state.authUser
    },
    isAdmin(state: SupabaseState) {
        return state.authUserMeta?.admin
    },
    resetAccessToken(state: SupabaseState) {
        return state.resetAccessToken
    },
    justRegistered(state: SupabaseState) {
        return state.justRegistered
    },
    shouldRedirectHome(state: SupabaseState) {
        return state.redirectHome
    }
}

export const mutations: MutationTree<SupabaseState> = {
    setAuthUser(state: SupabaseState, value: User) {
        state.authUser = value
    },
    setAuthUserPaymentAssociation(state: SupabaseState, value: PaymentAssociation) {
        state.authUserPaymentAssociation = value
    },
    setAuthUserMeta(state: SupabaseState, value: SourceryUser) {
        state.authUserMeta = value
    },
    setAuthUserOrganizations(state: SupabaseState, value: Organization[]) {
        state.authUserOrganizations = value
    },
    setAuthUserHasPassword(state: SupabaseState, value: boolean) {
        state.authUserHasPassword = value
    },
    setResetAccessToken(state: SupabaseState, value: string) {
        state.resetAccessToken = value
    },
    setJustRegistered(state: SupabaseState, value: boolean) {
        state.justRegistered = value
    },
    setRedirectHome(state: SupabaseState, value: boolean) {
        state.redirectHome = value
    },
    clear(state: SupabaseState) {
        localStorage.removeItem('sourceryInProgressRequest')
        const initial = initialState()
        state.authUser = initial.authUser
        state.authUserMeta = initial.authUserMeta
        state.authUserHasPassword = initial.authUserHasPassword
        state.authUserPaymentAssociation = initial.authUserPaymentAssociation
        state.authUserOrganizations = initial.authUserOrganizations
        state.resetAccessToken = initial.resetAccessToken
        state.justRegistered = initial.justRegistered
        state.redirectHome = initial.redirectHome
    }
}

export const actions: ActionTree<SupabaseState, SupabaseState> = {
    async saveAuthUserPaymentAssociation({ commit }: { commit: Commit }, paymentAssociation: PaymentAssociation) {
        const pa = new PaymentAssociation(paymentAssociation)
        const success = await pa.save()
        if (success) {
            commit('setAuthUserPaymentAssociation', pa.toJSON())
        }
        return success
    },
    async fetchAuthUserPaymentAssociation({ state, commit }: { state: SupabaseState, commit: Commit }) {
        if (state.authUser) {
            const pa = await PaymentAssociation.getFromUser(state.authUser)
            if (pa && pa.id) {
                commit('setAuthUserPaymentAssociation', pa.toJSON())
                return true
            }
        }
        return false
    },
    async fetchUserMeta({ state, commit, dispatch }: { state: SupabaseState, commit: Commit, dispatch: Dispatch }) {
        if (state.authUser) {
            const meta = await SourceryUser.getById(state.authUser.id)
            if (meta) {
                commit('setAuthUserMeta', meta.toJSON())
                dispatch('supabaseUserCache/add_user', meta, { root: true })
                return true
            }
        }
        return false
    },
    async fetchUserOrganizations({ state, commit }: { state: SupabaseState, commit: Commit }) {
        if (state.authUser) {
            const orgs = await Organization.getByOwner(state.authUser.id)
            if (orgs) {
                commit('setAuthUserOrganizations', orgs)
                return true
            }
        }
        return false
    },
    async updateMeta({ state, commit }: { state: SupabaseState, commit: Commit }, { keyName, keyValue }: { keyName: string, keyValue: string }) {
        if (state.authUserMeta) {
            const meta = new SourceryUser(state.authUserMeta)
            switch (keyName) {
                case 'name':
                    meta.name = keyValue
                    break
                case 'phone':
                    meta.phone = keyValue
                    break
                default:
                    return false
            }
            const s = await meta.save()
            commit('setAuthUserMeta', meta.toJSON())
            return s
        }

        return false
    },
    async changePassword({ state }: { state: SupabaseState }, newPass: string) {
        if (state.authUser) {
            const { data: user, error } = await supabase.auth.updateUser({
                password: newPass
            })
            console.log(user)
            console.log(error)
            if (error) {
                return false
            }
            return true
        }
        return false
    },
    async checkHasSignUpEmail({ state }: { state: SupabaseState }) {
        if (state.authUser) {
            const creation_date = new Date(state.authUser.created_at)
            const cutoff = new Date('2022-05-05T00:00:45.973116Z')
            if (creation_date < cutoff) {
                return
            }
            const message = await Message.getLastForUser(state.authUser.id, 'signed_up')
            if (message) {
                return
            }
            await notify({
                user_id: state.authUser.id,
                action: 'signed_up'
            })
        }
    }
}
