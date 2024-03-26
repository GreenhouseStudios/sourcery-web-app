import type { Commit, ActionTree, MutationTree } from 'vuex'
import { User as SourceryUser } from '~/models/User'
import { Repository } from '~/models/Repository'
import { Status } from '~/models/Status'
import { Request } from '~/models/Request'
import { RequestsProspective } from '~/models/RequestsProspective'
import { IntegrationData } from '~/models/IntegrationData'
import { PricingSummary } from '~/models/PricingSummary'
import { notify, prospective } from '~/plugins/sourcery-functions'
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
        clientName: '',
        clientEmail: '',
        location: ''
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
        if ( state.client && state.client.email ) {
            return state.client.email
        }
        return state.clientEmail
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
    },
    isCustom(state: SupabaseCreateState) {
        return (typeof state.repository === 'string') ? true : false
    },
    location(state: SupabaseCreateState) {
        return state.location
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
    setRepository(state: SupabaseCreateState, value: Repository | string) {
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
    setClientEmail(state: SupabaseCreateState, value: string) {
        state.clientEmail = value
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
    setLocation(state: SupabaseCreateState, value: string) {
        state.location = value
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
        state.location = initial.location
        state.clientEmail = initial.clientEmail
    }
}

export const actions: ActionTree<SupabaseCreateState, SupabaseCreateState> = {
    async insert({ state, commit, getters, rootGetters }: { state: SupabaseCreateState, commit: Commit, getters: any, rootGetters: any }) {

        console.log('inserting')

        // If the request is to a custom prospective repository
        if ( getters.isCustom && typeof state.repository === 'string' ) {
            console.log('Trying to insert custom!', getters.isCustom)
            if ( !state.repository || !state.client || !state.client.id) {
                console.log('Was missing essential information to create a request.', state)
                return null
            }

            const request_prospective = new RequestsProspective({
                user_id: state.client.id,
                title: state.label,
                description: state.citation,
                repository_name: state.repository,
                repository_location: state.location
            })

            const r = await request_prospective.insert()

            console.log(r)

            if ( r ) {
                // Successful insert
                let new_rp = new RequestsProspective(r)
                const prospective_data = {
                    ...new_rp.toSpreadsheetJSON()
                }

                if ( new_rp && new_rp.id ) {

                    console.log('insert was successful lets try and do our functions')

                    if ( prospective_data.id !== null ) {
                        try {
                            console.log('supabaseCreate prospective_data', prospective_data)
                            await prospective(prospective_data)
                        } catch (e) {
                            // This is a google auth error probably
                            console.log(e)
                        }
                    }
                    
    
                    const prospective_notify_payload = {
                        user_id: state.client.id,
                        rp_id: new_rp.id,
                        action: 'npi_request_to_requester'
                    }
                    try {
                        await notify(prospective_notify_payload)
                    } catch (e) {
                        // This is likely a 'too many within a short period' errors, shouldn't affect the front-end.
                        console.log(e)
                    }
                }
                

                commit('reset')
            }
            return r
        }
        
        // If the request is for a registered repository
        else {
            console.log('Trying to insert not custom!', getters.isCustom)
            const submittedStatus = await Status.getByName('Submitted')

            if ( submittedStatus ) {
                commit('setStatus', submittedStatus)
            }

            if (
                !submittedStatus ||
                !state.status ||
                !state.status.id ||
                !state.repository ||
                !(state.repository instanceof Repository) ||
                !state.repository.id || !state.client || !state.client.id
            ) {
                console.log( 'Was missing essential information to create a request.' )
                return null
            }

            const request = new Request({
                repository_id: state.repository.id,
                citation: state.citation,
                pages: state.pages,
                status_id: state.status.id,
                user_id: state.client.id,
                id: null,
                created_at: null,
                updated_at: null,
                archive_citation: null,
                archive_notes: null
            })

            const r = await request.insert()

            if (r) {
                // Successful insert.
                if (Array.isArray(r) && r.length > 0) {
    
                    // Lets update the request client.
                    const new_request = await Request.getById(r[0].id)
                    const id = r[0].id
    
                    if ( new_request ) {
                        const updated_request_client_info = await RequestClient.updateById(id, { 
                            label: state.label,
                            name: state.clientName
                        })
                        const updated_request_vendor_info = await RequestVendor.updateById(id, { 
                            label: state.label
                        })
    
                        if ( updated_request_client_info && updated_request_vendor_info ) {
                            console.log('Updated both client/vendor references!')
                        } else {
                            console.log('Did not update both references.', updated_request_client_info, updated_request_vendor_info)
                        }
                    }
    
                    
                    const notify_payload = {
                        user_id: state.client.id,
                        request_id: id,
                        action: 'request_submitted_to_your_org'
                    }
                    try {
                        await notify(notify_payload)
                    } catch (e) {
                        // This is likely a 'too many within a short period' errors, shouldn't affect the front-end.
                        console.log(e)
                    }
    
                }
    
                commit('reset')
            }

            return r
        }
    }
}