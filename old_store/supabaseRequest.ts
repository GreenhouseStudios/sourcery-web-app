import { Request } from '~/models/Request'
import type { UpdateRequestInProgress } from '~/models/Request'
import type { Commit, Dispatch, ActionTree, GetterTree, MutationTree } from 'vuex'
import { v4 as uuidv4 } from 'uuid'
import mime from 'mime-types'
import { Attachment } from '~/models/Attachment'
import { supabase } from '~/plugins/supabase'
import { notify } from "~/plugins/sourcery-functions"

// https://typescript.nuxtjs.org/cookbook/store/#vanilla <-- Helpful for inheriting other nuxt modules such as firebase into your actions/etc.

export const initialState = () => {
    return {
        request: null as Request | null
    }
}

export type SupabaseRequestState = ReturnType<typeof initialState>

export const state = initialState

export const getters = {
    request(state: SupabaseRequestState) {
        return state.request
    },
    id(state: SupabaseRequestState) {
        return (state.request) ? state.request.id : null
    },
    isComplete(state: SupabaseRequestState) {
        return Request.isComplete(state.request)
    },
    isPickedUp(state: SupabaseRequestState) {
        return Request.isPickedUp(state.request)
    },
    isSubmitted(state: SupabaseRequestState) {
        return Request.isSubmitted(state.request)
    },
    isArchived(state: SupabaseRequestState) {
        return Request.isArchived(state.request)
    },
    isCancelled(state: SupabaseRequestState) {
        return Request.isCancelled(state.request)
    },
    prettyStatus(state: SupabaseRequestState) {
        return (state.request?.status?.name) ? state.request.status.name : 'Unknown'
    }
}


export const mutations: MutationTree<SupabaseRequestState> = {
    set(state: SupabaseRequestState, value: Request) {
        state.request = value
    },
    setClientLabel(state: SupabaseRequestState, value: string) {
        if ( state.request?.request_client ) {
            state.request.request_client.label = value
        }
    },
    setVendorLabel(state: SupabaseRequestState, value: string) {
        if ( state.request?.request_vendor ) {
            state.request.request_vendor.label = value
        }
    },
    setArchiveNotes(state: SupabaseRequestState, value: string) {
        if ( state.request ) {
            state.request.archive_notes = value
        }
    },
    setArchiveCitation(state: SupabaseRequestState, value: string) {
        if ( state.request ) {
            state.request.archive_citation = value
        }
    },
    setUpdateProps(state: SupabaseRequestState, value: UpdateRequestInProgress) {
        if ( state.request ) {
            if ( value.archive_citation !== undefined ) {
                state.request.archive_citation = value.archive_citation
            }
            if ( value.archive_notes !== undefined ) {
                state.request.archive_notes = value.archive_notes
            }
        }
    },
    clear(state: SupabaseRequestState) {
        const initial = initialState()
        state.request = initial.request
    }
}

export const actions: ActionTree<SupabaseRequestState, SupabaseRequestState> = {
    async getById({ commit }: { commit: Commit }, id: string) {
        const r = await Request.getById(id)
        commit('set', r)
        return true
    },
    async pickUp({ state, dispatch, rootGetters }: { state: SupabaseRequestState, dispatch: Dispatch, rootGetters: any }) {
        if (state.request) {
            const in_progress = await state.request.pickUp()
            if (in_progress && state.request.id) {
                await dispatch('getById', state.request.id)
                await notify({
                    user_id: rootGetters['supabaseAuth/authUser'].id,
                    request_id: state.request.id,
                    action: 'request_you_submitted_picked_up'
                })
                return true
            }
        }
        return false
    },
    async cancel({ state, commit, dispatch }: { state: SupabaseRequestState, commit: Commit, dispatch: Dispatch }) {
        if (state.request) {
            const deleted = await state.request.cancel()
            if (deleted) {
                commit('clear')
                return true
            }
        }
        return false
    },
    async archive({ state, dispatch }: { state: SupabaseRequestState, dispatch: Dispatch }) {
        if (state.request) {
            const archived = await state.request.archive()
            if (archived) {
                await dispatch('getById', state.request.id)
                return true
            }
        }
        return false
    },
    async complete(
        { state, dispatch, rootGetters }: { state: SupabaseRequestState, dispatch: Dispatch, rootGetters: any }) {
        if (state.request) {
            const completed = await state.request.complete({
                archive_notes: state.request.archive_notes
            })
            if (completed && state.request.id) {
                await dispatch('getById', state.request.id)
                await notify({
                    user_id: rootGetters['supabaseAuth/authUser'].id,
                    request_id: state.request.id,
                    action: 'request_you_submitted_complete'
                })
                return true
            }
        }
        return false
    },
    async update( { state, commit }: { state: SupabaseRequestState, commit: Commit}, updateObj : UpdateRequestInProgress) {
        if ( state.request ) {
            const r = new Request(state.request)
            const result = await r.update(updateObj)

            if ( result ) {
                // Successful update of properties, commit them
                commit('setUpdateProps', updateObj)
            }

            return result
        }
        return false
    },
    async setLabel({ state, commit }: { state: SupabaseRequestState, commit: Commit }, {
        client, label
    } : { client: boolean, label: string }) {
        if ( state.request ) {
            const r = new Request(state.request)
            const result = await r.saveLabel(client, label)

            if ( result ) {
                if ( client ) {
                    commit('setClientLabel', label)
                } else {
                    commit('setVendorLabel', label)
                }
                return result
            }
        }
        return false
    },
    async addAttachment({ state, dispatch, rootGetters }: { state: SupabaseRequestState, dispatch: Dispatch, rootGetters: any }, file: File) {
        // Default number of pages for an attachment
        let pages = 1

        // Stored Filename will become UUID.extension
        const storedFileName = `${uuidv4()}.${mime.extension(file.type)}`

        // If it's a PDF, we need to count the number of pages
        if (file.type === 'application/pdf') {
            pages = await countPages(file)
        }

        if (!state.request || !state.request.id) {
            return false
        }


        try {
            const filePath = `jobs/${state.request.id}/${storedFileName}`

            const { data, error } = await supabase.storage
                .from('attachments')
                .upload(filePath, file)

            if (error) {
                throw error
            }

            const { data : publicURL } = supabase.storage
                .from('attachments')
                .getPublicUrl(filePath)

            if (!publicURL) {
                throw new Error('Could not get public URL for attachment.')
            }

            if (state.request && state.request.id) {
                const { data: publicURLData } = await supabase.storage
                    .from('attachments')
                    .getPublicUrl(filePath)

                if (!publicURLData || !publicURLData.publicUrl) {
                    throw new Error('Could not get public URL for attachment.')
                }

                const newAttachment = new Attachment({
                    request_id: state.request.id,
                    user_id: rootGetters['supabaseAuth/authUser'].id,
                    url: publicURLData.publicUrl, // Access the publicUrl property
                    mime: file.type,
                    pages: pages,
                    label: storedFileName,
                    size: file.size
                })
                const status = await newAttachment.insert()

                // Add an event for attachment added.
                await dispatch('sendRequestEventRPC', 'event_add_attachment')

                await dispatch('getById', state.request.id)
            }

            return true
        } catch (error) {
            console.log(error)
            return false
        }
    },
    async deleteAttachment({ state, commit, dispatch, rootGetters }, attachment) {
        // Get the filename from the Google Storage URL
        const url = new URL(attachment.url)
        const path = decodeURIComponent(url.pathname)
        const filename = path.replace(/.*\//, '')

        if (!state.request || !state.request.id) {
            return false
        }

        const filePath = `jobs/${state.request.id}/${filename}`

        try {

            const { data, error } = await supabase.storage
                .from('attachments')
                .remove([filePath])

            if (error) {
                throw error
            }

            const result = await attachment.delete()

            await dispatch('sendRequestEventRPC', 'event_remove_attachment')

            if (result === false) {
                throw 'attachment was deleted but record was not.'
            }

            await dispatch('getById', state.request.id)
            return true
        } catch (error) {
            console.log(error)
            return false
        }
    },

    /**
     * Sends a request event track to the BaaS.
     * 
     * @param eventName The name of the RPC function being called.
     * @returns int8 ID if successful insert, null if error or rate limited.
     */
    async sendRequestEventRPC({ state, rootGetters } : { state: SupabaseRequestState, rootGetters: any }, eventName : string) {
        if ( state.request ) {
            const { data: insert_id, error } = await supabase.rpc(eventName, {
                request_id: state.request.id,
                user_id: rootGetters['supabaseAuth/authUser'].id
            })

            if ( error ) {
                console.log(`Error saving request_event: ${eventName}`)
            }

            return insert_id
        }
        return null
    }
}

/**
 * Counts the pages of a PDF file
 */
const countPages = (pdf: File): Promise<number> => {
    const reader = new FileReader()

    return new Promise((resolve, reject) => {
        reader.onerror = () => {
            reader.abort()
            reject(new DOMException('Problem parsing input file.'))
        }

        reader.onloadend = () => {
            if (reader && reader.result && reader.result! instanceof ArrayBuffer) {
                let result = new String(reader.result)
                const matches = result.match(/\/Type[\s]*\/Page[^s]/g)
                if (matches !== null) {
                    resolve(matches.length)
                }
            }
            resolve(1)

        }
        reader.readAsText(pdf)
    })
}