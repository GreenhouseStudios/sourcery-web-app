import { supabase } from '~/plugins/supabase'
import type { Request } from '~/models/Request'
import { RequestClient } from '~/models/RequestClient'
import { RequestVendor } from '~/models/RequestVendor'

const TABLE_NAME = 'request_comments'

export type CreateRequestComment = {
    id: number | null
    request_id: number
    user_id: string
    content: string
    created_at: string | null
    vendor: boolean
}

export class RequestComment {
    id: number | null
    request_id: number
    user_id: string
    content: string
    created_at: string | null
    vendor: boolean

    constructor({
        id = null,
        request_id,
        user_id,
        content,
        created_at = null,
        vendor = false
    }: CreateRequestComment) {
        this.id = id,
        this.request_id = request_id
        this.user_id = user_id
        this.content = content
        this.created_at = created_at
        this.vendor = vendor
    }

    toInsertJSON() {
        return {
            request_id: this.request_id,
            user_id: this.user_id,
            content: this.content,
            vendor: this.vendor
        }
    }

    public static async getForRequest(request: Request | null) {
        if ( !request || !request.id ) {
            return []
        }

        const query = supabase.from(TABLE_NAME)
            .select(`
                *
            `)
            .order('created_at', { ascending: false })
            .eq('request_id', request.id)

        let { data, error } = await query
        console.log(data)
        if ( Array.isArray(data) ) {
            const rms = data.map(x => new RequestComment(x))
            return rms
        }

        return []
    }

    public static async countForRequest(request: Request | null) {
        if ( !request || !request.id ) {
            return 0
        }

        const query = supabase.from(TABLE_NAME)
            .select('request_id', { count: 'exact' })
            .eq('request_id', request.id)

        let { data, error, count } = await query

        return count
    }

    async insert() {
        const { data: requestComment, error } = await supabase.from(TABLE_NAME)
            .insert([this.toInsertJSON()])
            .select()
        
        if ( error ) {
            console.log(error)
            return null
        }

        // Successful insert
        if ( Array.isArray(requestComment) && requestComment.length > 0 ) {

            // Non async let's update the request client or vendor entry to have unread
            if ( this.vendor ) {
                RequestClient.updateUnreadById(this.request_id, true)
            } else {
                RequestVendor.updateUnreadById(this.request_id, true)
            }

            // Return the successfully inserted comment
            return new RequestComment(requestComment[0])
        }

        return null
    }
}
