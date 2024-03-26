import type { Commit, ActionTree, MutationTree } from 'vuex'
import { RequestsProspective } from '~/models/RequestsProspective'

export function initialState() {
    return {
        prospective_requests: [] as Array<RequestsProspective>,
        count: 0
    }
}

export type SupabaseProspectiveState = ReturnType<typeof initialState>

export const state = initialState

export const getters = {
    requests(state: SupabaseProspectiveState) {
        return state.prospective_requests
    },
    requestCount(state: SupabaseProspectiveState) {
        return state.count
    }
}

export const mutations: MutationTree<SupabaseProspectiveState> = {
    setRequests(state: SupabaseProspectiveState, value: Array<RequestsProspective>) {
        state.prospective_requests = value
    },
    setRequestCount(state: SupabaseProspectiveState, value: number) {
        state.count = value
    },
    clear(state: SupabaseProspectiveState) {
        const initial = initialState()
        state.prospective_requests = initial.prospective_requests
    }
}

export const actions: ActionTree<SupabaseProspectiveState, SupabaseProspectiveState> = {
    async getForUser({ commit, rootGetters } : { commit: Commit, rootGetters: any }, user_id?: string) {
        let user_id_to_use = user_id ? user_id : rootGetters['supabaseAuth/authUser'].id
        const requests = await RequestsProspective.getForUser(user_id_to_use)
        commit('setRequests', requests)
    },

    async countForUser({ commit, rootGetters } : { commit: Commit, rootGetters: any }, user_id?: string) {
        let user_id_to_use = user_id ? user_id : rootGetters['supabaseAuth/authUser'].id
        const count = await RequestsProspective.countForUser(user_id_to_use)
        commit('setRequestCount', count)
    }
}