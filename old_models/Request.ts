import { supabase } from '~/plugins/supabase'
import { Status } from '~/models/Status'
import { Repository } from '~/models/Repository'
import { RequestClient } from '~/models/RequestClient'
import { RequestVendor } from '~/models/RequestVendor'
import { RequestComment } from '~/models/RequestComment'
import { Attachment } from '~/models/Attachment'
import { User } from '~/models/User'

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
    archive_citation: string | null
    archive_notes: string | null
    status?: Status
    repository?: Repository
    request_clients?: RequestClient[] | RequestClient
    request_client?: RequestClient
    request_vendors?: RequestVendor[] | RequestVendor
    request_vendor?: RequestVendor
    request_comments?: RequestComment[]
    attachments?: Attachment[]
    user?: User
}

export type UpdateRequestInProgress = {
    [key: string]: string | null | undefined
    archive_citation?: string | null
    archive_notes?: string | null
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
    archive_citation: string | null
    archive_notes: string | null
    status?: Status
    repository?: Repository
    request_clients?: RequestClient[]
    request_client?: RequestClient
    request_vendors?: RequestVendor[]
    request_vendor?: RequestVendor
    request_comments?: RequestComment[]
    attachments?: Attachment[]
    user?: User

    constructor({
        id = null,
        repository_id,
        citation,
        pages,
        status_id,
        user_id,
        user = undefined,
        created_at = null,
        updated_at = null,
        archive_citation = null,
        archive_notes = null,
        status = undefined,
        repository = undefined,
        request_clients = undefined,
        request_vendors = undefined,
        request_vendor = undefined,
        request_client = undefined,
        request_comments = undefined,
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

        if (status) {
            this.status = new Status(status)
        }

        if (repository) {
            this.repository = new Repository(repository)
        }

        if (request_clients) {
            if ( Array.isArray(request_clients) && request_clients.length > 0 ) {
                this.request_client = new RequestClient(request_clients[0])
            } else {
                this.request_client = new RequestClient(request_clients as RequestClient)
            }
        } else if (request_client) {
            console.log('setting request client')
            this.request_client = new RequestClient(request_client)
        }

        if (request_vendors) {
            if ( Array.isArray(request_vendors) && request_vendors.length > 0 ) {
                this.request_vendor = new RequestVendor(request_vendors[0])
            } else {
                this.request_vendor = new RequestVendor(request_vendors as RequestVendor)
            }
        } else if (request_vendor) {
            this.request_vendor = new RequestVendor(request_vendor)
        }

        if (attachments) {
            this.attachments = attachments.map(x => new Attachment(x))
        }

        if (user) {
            this.user = new User(user)
        }

        this.archive_citation = archive_citation
        this.archive_notes = archive_notes

        if (request_comments) {
            this.request_comments = request_comments
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
     * @param status string[] 
     * @param offset number
     * @returns Request[]
     */
    public static async getForCreator(user_id: string, status : Array<string> = [], offset = 0) {

        if (status.length < 1) {
            status = Status.get_all_status_names()
        }

        const query = supabase.from(TABLE_NAME)
            .select(`
                *,
                status!requests_status_id_fkey (*),
                repository:repositories (*),
                request_clients (*),
                request_vendors (*)
            `)
            .order('created_at', { ascending: false })
            .eq('user_id', user_id)
            .in('status.name', status)
            .range(offset, 100)

        let { data: requests, error } = await query

        if (Array.isArray(requests)) {
            const rs = requests.map(x => new Request(x))
                .filter(x => x.status)
                console.log(rs)
            return rs
        }

        return []
    }

    /**
     * Return requests that are requested to the repositories given.
     * @param repositories 
     * @param status String[]
     * @returns Request[]
     */
    public static async getForRepositories(repositories: Repository[], status : Array<string> = [], offset = 0) {

        if (status.length < 1) {
            status = Status.get_all_status_names()
        }

        const repository_ids = repositories.map(x => x.id)
        const query = supabase.from(TABLE_NAME)
            .select(`
                *,
                status!requests_status_id_fkey (*),
                repository:repositories (*),
                request_vendors (*),
                request_clients (*)
            `)
            .order('created_at', { ascending: false })
            .in('repository_id', repository_ids)
            .in('status.name', status)
            .range(offset, 100)

        let { data: requests, error } = await query

        if (Array.isArray(requests)) {
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
                repository:repositories (
                    *,
                    featured_image:featured_images (*),
                    organization:organizations (*)
                ),
                request_clients (*),
                request_vendors (*),
                attachments (*),
                user!requests_user_id_fkey (id, email),
                request_comments (
                    *,
                    user!request_comments_user_id_fkey (id, email)
                )
            `)
            .eq('id', id)
            .limit(1)
            .single()

        if (request) {
            return new Request(request)
        }
        return null
    }

    async pickUp() {
        const in_progress_status = await Status.getByName('In Progress')
        if (in_progress_status) {
            const { data: request, error } = await supabase.from(TABLE_NAME)
                .update({ status_id: in_progress_status.id })
                .eq('id', this.id)

            if (error) {
                console.log(error)
            }

            this.sendRequestRPC('event_status_changed')
            return true
        }
        return false
    }

    /**
     * Deletes the current request from persistant storage.
     * @returns Request | null
     */
    async delete() {
        const { data: request, error } = await supabase.from(TABLE_NAME)
            .delete()
            .eq('id', this.id)

        if (error) {
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
        if (archive_status) {
            const { data: replaced, error } = await supabase.from(TABLE_NAME)
                .update({ status_id: archive_status.id })
                .eq('id', this.id)

            if (error) {
                console.log(error)
            }

            this.sendRequestRPC('event_status_changed')
            return true
        }
        return false
    }

    async cancel() {
        const cancel_status = await Status.getByName('Cancelled')
        if (cancel_status) {
            const { data: replaced, error } = await supabase.from(TABLE_NAME)
                .update({ status_id: cancel_status.id })
                .eq('id', this.id)

            if (error) {
                console.log(error)
            }

            this.sendRequestRPC('event_status_changed')
            return true
        }
        return false
    }

    async complete( meta : {
        archive_notes?: string | null
    }) {
        const update_obj = {
            archive_notes: meta.archive_notes ? meta.archive_notes : this.archive_notes,
            status_id: this.status_id
        }
        const complete_status = await Status.getByName('Complete')
        if (complete_status) {
            update_obj.status_id = complete_status.id
            const { data: replaced, error } = await supabase.from(TABLE_NAME)
                .update(update_obj)
                .eq('id', this.id)

            if (error) {
                console.log(error)
            }

            this.sendRequestRPC('event_status_changed')
            return true
        }
        return false
    }

    async insert() : Promise<CreateRequest | null> {
        const { data: request, error } = await supabase.from(TABLE_NAME)
            .insert([
                this.toInsertJSON()
            ])

        if (error) {
            console.log(error)
            return null
        }

        return request
    }

    async saveLabel(client = true, label: string) {
        let status = false
        if (client) {
            status = await this.request_client?.update(label) || false
        } else {
            status = await this.request_vendor?.update(label) || false
        }
        this.sendRequestRPC('event_request_edited')
        return status
    }

    async update(updateObject : UpdateRequestInProgress) {
        const approved = ['archive_notes', 'archive_citation']
        const ks = Object.keys(updateObject)
        ks.forEach(x => {
            if ( !approved.includes(x) ) {
                delete updateObject[x]
            }
        })
        const { data: updated, error } = await supabase.from(TABLE_NAME)
            .update(updateObject)
            .eq('id', this.id)

        if (error) {
            console.log(error)
            return false
        }
        this.sendRequestRPC('event_request_edited')
        return true
    }


    /**
     * Creates a request comment on this request if there is not one already in order for it to show on the messages page.
     */
    async initializeChat(user_id : string, vendor = false) {
        if ( !this.id ) { return false }
        const fresh = await Request.getById(`${this.id}`)
        if ( fresh ) {
            if ( fresh.request_comments && fresh.request_comments.length > 0 ) {
                return true
            } else {
                const rc = new RequestComment({
                    request_id: this.id,
                    user_id: user_id,
                    content: 'Request chat created.',
                    vendor: vendor,
                    id: null,
                    created_at: null
                })
                const status = await rc.insert()
                if ( status ) {
                    return true
                }
            }
        }
        return false
    }

    /**
     * Sends a request event track to the BaaS.
     * 
     * @param eventName The name of the RPC function being called.
     * @returns int8 ID if successful insert, NULL if rate limited, FALSE if error.
     */
    async sendRequestRPC(eventName : string) {
        const { data: { user } } = await supabase.auth.getUser()
        if ( !user ) {
            return false
        }

        const { data: insert_id, error } = await supabase.rpc(eventName, {
            request_id: this.id,
            user_id: user.id
        })

        if ( error ) {
            console.log(`Error saving request_event: ${eventName}`)
            return false
        }
        return insert_id
    }


    static async getRequestsWithMessages() {
        const { data: { user } } = await supabase.auth.getUser()
        if ( !user ) {
            return false
        }

        const event_name = 'get_requests_with_last_comment'

        const { data, error } = await supabase.rpc(event_name, {
            user_id_input: user.id
        })

        console.log(data)

        if ( error ) {
            console.log(`Error saving request_event: ${event_name}`)
            return false
        }
        
        return data
    }


    /**
     * A bunch of static methods for status checks and stuff
     */
    static isComplete(request : Request | null) {
        return request?.status?.name === 'Complete'
    }
    
    static isPickedUp (request : Request | null) {
        return request?.status?.name === 'In Progress'
    }
    
    static isSubmitted (request : Request | null) {
        return request?.status?.name === 'Submitted'
    }
    
    static isArchived (request : Request | null) {
        return request?.status?.name === 'Archived'
    }
    
    static isCancelled (request : Request | null) {
        return request?.status?.name === 'Cancelled'
    }

    isOwner(user_id : string) {
        return this.user_id === user_id
    }

    static isOwner (user_id : string, request : Request | null) {
        return user_id === request?.user_id
    }

    canManage(repositories: Repository[]) {
        return repositories
            .map(x => x.id)
            .includes(this.repository_id)
    }

    static canManage (repositories : Repository[], request : Request | null) {
        return repositories
            .map(x => x.id)
            .includes(request ? request.repository_id : null)
    }
}