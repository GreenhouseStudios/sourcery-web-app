import { supabase } from '~/plugins/supabase'
import { Status } from '~/models/Status'
import { Repository } from '~/models/Repository'
import { RequestClient } from '~/models/RequestClient'
import { RequestVendor } from '~/models/RequestVendor'
import { Attachment } from '~/models/Attachment'

const TABLE_NAME = 'requests'

export type CreateRequest = {
    id: number | null
    repository_id: number
    citation: string
    pages: number
    status_id: number
    user_id: string
    created_at: string | null
    updated_at: string | null
    status?: Status
    repository?: Repository
    request_clients?: RequestClient[]
    request_client?: RequestClient
    request_vendors?: RequestVendor[]
    request_vendor?: RequestVendor
    attachments?: Attachment[]
}

export class Request {
    id: number | null
    repository_id: number
    citation: string
    pages: number
    status_id: number
    user_id: string
    created_at: string | null
    updated_at: string | null
    status?: Status
    repository?: Repository
    request_clients?: RequestClient[]
    request_client?: RequestClient
    request_vendors?: RequestVendor[]
    request_vendor?: RequestVendor
    attachments?: Attachment[]

    constructor({
        id = null,
        repository_id,
        citation,
        pages,
        status_id,
        user_id,
        created_at = null,
        updated_at = null,
        status = undefined,
        repository = undefined,
        request_clients = undefined,
        request_vendors = undefined,
        attachments = undefined
    }: CreateRequest) {
        this.id = id,
        this.repository_id = repository_id
        this.citation = citation
        this.pages = pages
        this.status_id = status_id
        this.user_id = user_id
        this.created_at = created_at
        this.updated_at = updated_at

        if ( status ) {
            this.status = new Status(status)
        }

        if ( repository ) {
            this.repository = new Repository(repository)
        }

        if ( request_clients && request_clients.length > 0 ) {
            this.request_client = new RequestClient(request_clients[0])
        }

        if ( request_vendors && request_vendors.length > 0 ) {
            this.request_vendor = new RequestVendor(request_vendors[0])
        }

        if ( attachments ) {
            this.attachments = attachments.map(x => new Attachment(x))
        }
    }

    toInsertJSON() {
        return {
            repository_id: this.repository_id,
            citation: this.citation,
            pages: this.pages,
            status_id: this.status_id,
            user_id: this.user_id
        }
    }

    /**
     * Return requests created by a user_id, and optionally remove those with an 'Archived' status.
     * @param user_id 
     * @param includeArchived 
     * @returns Request[]
     */
    public static async getForCreator(user_id : string, status = []) {

        if ( status.length < 1 ) {
            return []
        }

        const query = supabase.from(TABLE_NAME)
            .select(`
                *,
                status!requests_status_id_fkey (*),
                repository:repositories (*),
                request_clients (*)
            `)
            .order('created_at', { ascending: false })
            .eq('user_id', user_id)
            .in('status.name', status)

        let { data: requests, error } = await query

        if ( Array.isArray(requests) ) {
            console.log(requests[0])
            const rs = requests.map(x => new Request(x))
                .filter(x => x.status)
            return rs
        }

        return []
    }

    /**
     * Return requests that are requested to the repositories given.
     * @param repositories 
     * @param includeArchived 
     * @returns Request[]
     */
    public static async getForRepositories(repositories : Repository[], status = []) {

        if ( status.length < 1 ) {
            return []
        }

        const repository_ids = repositories.map(x => x.id)
        const query = supabase.from(TABLE_NAME)
            .select(`
                *,
                status!requests_status_id_fkey (*),
                repository:repositories (*),
                request_vendors (*)
            `)
            .order('created_at', { ascending: false })
            .in('repository_id', repository_ids)
            .in('status.name', status)

        let { data: requests, error } = await query

        if ( Array.isArray(requests) ) {
            console.log(requests[0])
            const rs = requests.map(x => new Request(x))
                .filter(x => x.status)
            return rs
        }

        return []
    }

    /**
     * Returns a request with the Primary ID of given.
     * @param id Primary ID
     * @returns Request | null
     */
    public static async getById(id: string) {
        let { data: request, error } = await supabase.from(TABLE_NAME)
            .select(`
                *,
                status!requests_status_id_fkey (*),
                repository:repositories (*),
                request_clients (*),
                request_vendors (*),
                attachments (*)
            `)
            .eq('id', id)
            .limit(1)
            .single()

        if ( request ) {
            return new Request(request)
        }
        return null
    }

    /**
     * Deletes the current request from persistant storage.
     * @returns Request | null
     */
    async delete() {
        const { data: request, error } = await supabase.from(TABLE_NAME)
            .delete()
            .eq('id', this.id)

        if ( error ) {
            console.log(error)
        }

        return request
    }

    /**
     * Archives the current request.
     * @returns Boolean Status of archiving.
     */
    async archive() {
        const archive_status = await Status.getByName('Archived')
        if ( archive_status ) {
            const { data: replaced, error } = await supabase.from(TABLE_NAME)
                .update({ status_id: archive_status.id })
                .eq('id', this.id)

            if ( error ) {
                console.log(error)
            }
            this.status_id = archive_status.id
            return true
        }
        return false
    }

    async cancel() {
        const cancel_status = await Status.getByName('Cancelled')
        if ( cancel_status ) {
            const { data: replaced, error } = await supabase.from(TABLE_NAME)
                .update({ status_id: cancel_status.id })
                .eq('id', this.id)

            if ( error ) {
                console.log(error)
            }

            this.status_id = cancel_status.id
            return true
        }
        return false
    }

    async complete() {
        const complete_status = await Status.getByName('Complete')
        if ( complete_status ) {
            const { data: replaced, error } = await supabase.from(TABLE_NAME)
                .update({ status_id: complete_status.id })
                .eq('id', this.id)

            if ( error ) {
                console.log(error)
            }
            this.status_id = complete_status.id
            return true
        }
        return false
    }

    async insert() {
        const { data: request, error } = await supabase.from(TABLE_NAME)
            .insert([
                this.toInsertJSON()
            ])
        
        if ( error ) {
            console.log(error)
            return null
        }

        return request
    }
}