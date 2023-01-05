import type { Commit, Dispatch, ActionTree, GetterTree, MutationTree } from 'vuex'
import { Attachment } from '~/models/Attachment'
import { User as SourceryUser } from '~/models/User'
import { Repository } from '~/models/Repository'
import { Status } from '~/models/Status'
import { Request } from '~/models/Request'
import { IntegrationData } from '~/models/IntegrationData'
import { PricingSummary } from '~/models/PricingSummary'
import { notify } from '~/plugins/sourcery-functions'
import { getToken } from '~/plugins/supabase'
import { RequestClient } from '~/models/RequestClient'
import { RequestVendor } from '~/models/RequestVendor'

export const initialState = () => {
    return {
        client: null as SourceryUser | null,
        citation: '',
        repository: null as Repository | string | null,
        pages: 0,
        label: '',
        status: null as Status | null,
        integrationData: null as IntegrationData | null,
        pricing: null as PricingSummary | null,
        clientName: ''
    }
}

export type SupabaseCreateState = ReturnType<typeof initialState>

export const state = initialState

export const getters = {
    citation(state: SupabaseCreateState) {
        return state.citation
    },
    clientName(state: SupabaseCreateState) {
        return state.clientName
    },
    clientEmail(state: SupabaseCreateState) {
        return state.client?.email
    },
    client(state: SupabaseCreateState) {
        return state.client
    },
    label(state: SupabaseCreateState) {
        return state.label
    },
    pages(state: SupabaseCreateState) {
        return state.pages
    },
    repository(state: SupabaseCreateState) {
        return state.repository
    },
    repositoryName(state: SupabaseCreateState) {
        if (typeof state.repository !== 'string' && state.repository) {
            let name = state.repository.name
            if (state.repository.organization) {
                name += ` - ${state.repository.organization.name}`
            }
            return name
        }
        return ''
    },
    repositoryId(state: SupabaseCreateState) {
        if (typeof state.repository !== 'string' && state.repository) {
            return state.repository.id
        }
        return null
    },
    hasRepository(state: SupabaseCreateState) {
        return !!state.repository
    },
    pricing(state: SupabaseCreateState) {
        return state.pricing
    },
    integrationData(state: SupabaseCreateState) {
        return state.integrationData
    },
    hasIntegrationData(state: SupabaseCreateState) {
        return !!state.integrationData
    }
}

export const mutations: MutationTree<SupabaseCreateState> = {
    setCitation(state: SupabaseCreateState, value: string) {
        state.citation = value
    },
    setClientName(state: SupabaseCreateState, value: string) {
        state.clientName = value
    },
    setPages(state: SupabaseCreateState, value: number) {
        state.pages = value
    },
    setRepository(state: SupabaseCreateState, value: Repository) {
        state.repository = value
    },
    setLabel(state: SupabaseCreateState, value: string) {
        // const match = state.citation.match(/^(\w(\s|\.|\(|\))*)+/)
        // if (match && match.length > 0) {
        //     state.label = match[0].trim()
        // }
        state.label = value
    },
    setClient(state: SupabaseCreateState, value: SourceryUser) {
        state.client = value
    },
    setStatus(state: SupabaseCreateState, value: Status) {
        state.status = value
    },
    setIntegrationData(state: SupabaseCreateState, value: IntegrationData) {
        state.integrationData = value
    },
    setPricing(state: SupabaseCreateState, value: PricingSummary) {
        state.pricing = value
    },
    reset(state: SupabaseCreateState) {
        const initial = initialState()
        state.client = initial.client
        state.citation = initial.citation
        state.repository = initial.repository
        state.pages = initial.pages
        state.label = initial.label
        state.status = initial.status
        state.integrationData = initial.integrationData
        state.pricing = initial.pricing
        state.clientName = initial.clientName
    }
}

export const actions: ActionTree<SupabaseCreateState, SupabaseCreateState> = {
    async insert({ state, commit, rootGetters }: { state: SupabaseCreateState, commit: Commit, rootGetters: any }) {

        return
        // const submittedStatus = await Status.getByName('Submitted')

        // if (!submittedStatus) {
        //     console.log('Was not able to receive a status.')
        //     return null
        // }

        // commit('setStatus', submittedStatus)

        // if (!state.status || !state.status.id || !state.repository || !state.repository.id || !state.client || !state.client.id) {
        //     console.log('Was missing essential information to create a request.', state)
        //     return null
        // }

        // const request = new Request({
        //     repository_id: state.repository.id,
        //     citation: state.citation,
        //     pages: state.pages,
        //     status_id: state.status.id,
        //     user_id: state.client.id,
        //     id: null,
        //     created_at: null,
        //     updated_at: null,
        //     archive_citation: null,
        //     archive_notes: null
        // })

        // const r = await request.insert()

        // if (r) {
        //     // Successful insert.
        //     if (Array.isArray(r) && r.length > 0) {

        //         // Lets update the request client.
        //         const new_request = await Request.getById(r[0].id)
        //         const id = r[0].id

        //         if ( new_request ) {
        //             const updated_request_client_info = await RequestClient.updateById(id, { 
        //                 label: state.label,
        //                 name: state.clientName
        //             })
        //             const updated_request_vendor_info = await RequestVendor.updateById(id, { 
        //                 label: state.label
        //             })

        //             if ( updated_request_client_info && updated_request_vendor_info ) {
        //                 console.log('Updated both client/vendor references!')
        //             } else {
        //                 console.log('Did not update both references.', updated_request_client_info, updated_request_vendor_info)
        //             }
        //         }

                
        //         const notify_payload = {
        //             user_id: state.client.id,
        //             request_id: id,
        //             action: 'request_submitted_to_your_org',
        //             token: await getToken(),
        //             message_text: null
        //         }
        //         try {
        //             await notify(notify_payload)
        //         } catch (e) {
        //             // This is likely a 'too many within a short period' errors, shouldn't affect the front-end.
        //             console.log(e)
        //         }

        //     }

        //     commit('reset')
        // }

        // return r
    }
}