import { supabase } from '~/plugins/supabase'

const TABLE_NAME = 'request_vendors'

export type CreateRequestVendor = {
    request_id: number,
    label: string,
    has_unread?: boolean
}

export class RequestVendor {
    request_id: number
    label: string
    has_unread?: boolean

    constructor({
        request_id,
        label,
        has_unread = false
    }: CreateRequestVendor) {
        this.request_id = request_id
        this.label = label
        this.has_unread = has_unread
    }

    async update(label: string) {
        const { data: updated, error } = await supabase.from(TABLE_NAME)
            .update({ label: label })
            .eq('request_id', this.request_id)

        if ( error ) {
            console.log(error)
            return false
        }

        this.label = label
        return true
    }

    async updateHasUnread(has_unread: boolean) {
        const { data: updated, error } = await supabase.from(TABLE_NAME)
            .update({ has_unread: has_unread })
            .eq('request_id', this.request_id)

        if ( error ) {
            console.log(error)
            return false
        }

        this.has_unread = has_unread
        return true
    }

    static async updateById(id: number, { label } : { label: string }) {
        const rv = new RequestVendor({ request_id: id, label })
        return await rv.update(label)
    }

    static async updateUnreadById(id: number, has_unread: boolean ) {
        const rv = new RequestVendor({ request_id: id, label: '' })
        return await rv.updateHasUnread(has_unread)
    }
}