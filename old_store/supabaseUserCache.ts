import { User } from '~/models/User'
import type { Commit, Dispatch, ActionTree, GetterTree, MutationTree } from 'vuex'
import type { VuexActionParams } from '~/types/store'

export const initialState = () => {
    return {
        users: [] as Array<User>
    }
}

export type SupabaseUserCacheState = ReturnType<typeof initialState>

export const state = initialState

export const getters = {
    unique_user_ids(state: SupabaseUserCacheState) {
        let ids = state.users.map(x => x.id)
        return ids.filter((val, index, arr) => {
            return arr.indexOf(val) === index
        })
    },
    users(state: SupabaseUserCacheState) {
        return state.users
    }
}

export const mutations: MutationTree<SupabaseUserCacheState> = {
    add(state: SupabaseUserCacheState, user: User) {
        state.users.push(user)
    }
}

export const actions: ActionTree<SupabaseUserCacheState, SupabaseUserCacheState> = {
    add_user({ commit, rootGetters }: VuexActionParams<SupabaseUserCacheState>, user: User) {
        if ( !rootGetters['supabaseUserCache/unique_user_ids'].includes(user.id) ) {
            commit('add', user)
        }
    },
    add_users({ dispatch }: VuexActionParams<SupabaseUserCacheState>, users: Array<User>) {
        users.forEach(u => {
            dispatch('add_user', u)
        })
    },
    async get_user({ state, dispatch, rootGetters }: VuexActionParams<SupabaseUserCacheState>, id: string) {
        if (rootGetters['supabaseUserCache/unique_user_ids'].includes(id)) {
            return state.users.find(x => x.id === id)
        } else {
            let u = await User.getById(id)
            if ( u ) {
                dispatch('add_user', u)
                return u
            }
        }
        return null
    },
    async sync_users({ dispatch, rootGetters } : VuexActionParams<SupabaseUserCacheState>, user_ids : Array<string>) {
        const does_not_have_match = user_ids.some(r => !rootGetters['supabaseUserCache/unique_user_ids'].includes(r))
        if ( does_not_have_match ) {
            const users = await User.getByIds(user_ids)
            dispatch('add_users', users)
        }
        return true
    }
}