import { supabase } from '~/plugins/supabase'
import { Status } from '~/models/Status'
import { User } from '~/models/User'

const TABLE_NAME = 'request_events'

export type CreateRequestEvent = {
    id: number | null
    request_id: number
    user_id: string
    description: string
    status_id: number | null
    created_at: string | null
    status?: Status
    user?: User
}

export class RequestEvent {
    id: number | null
    request_id: number
    user_id: string
    description: string
    status_id: number | null
    created_at: string | null
    status?: Status
    user?: User

    constructor({
        id = null,
        request_id,
        user_id,
        description,
        status_id = null,
        created_at = null,
        status = undefined,
        user = undefined
    }: CreateRequestEvent) {
        this.id = id,
        this.request_id = request_id
        this.user_id = user_id
        this.description = description
        this.status_id = status_id
        this.created_at = created_at

        if (status) {
            this.status = new Status(status)
        }

        if (user) {
            this.user = new User(user)
        }
    }

    static async getForRequestId(id : number) {
        const query = supabase.from(TABLE_NAME)
            .select(`
                *,
                status (*),
                user (
                    id,
                    name
                )
            `)
            .order('created_at', { ascending: true })
            .eq('request_id', id)

        let { data, error } = await query

        if ( Array.isArray(data) ) {
            const request_events = data.map(x => new RequestEvent(x))
            return request_events
        }

        return []
    }

    async insert() {
        const query = supabase.rpc('event_add_internal', {
            request_id: this.request_id,
            user_id: this.user_id,
            message: this.description
        })

        let { data: insert_id, error } = await query

        if ( error ) {
            console.log(error)
            return false
        }

        return insert_id
    } 
}
