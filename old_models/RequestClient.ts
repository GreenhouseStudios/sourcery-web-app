import { supabase } from '~/plugins/supabase'

const TABLE_NAME = 'request_clients'

export type CreateRequestClient = {
    request_id: number,
    label: string,
    name: string | null,
    has_unread?: boolean 
}

export class RequestClient {
    request_id: number
    label: string
    name: string | null
    has_unread?: boolean

    constructor({
        request_id,
        label,
        name,
        has_unread = false
    }: CreateRequestClient) {
        this.request_id = request_id
        this.label = label
        this.name = name
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

    async updateName(name: string | null) {
        const { data: updated, error } = await supabase.from(TABLE_NAME)
            .update({ name: name })
            .eq('request_id', this.request_id)

        if ( error ) {
            console.log(error)
            return false
        }

        this.name = name
        return true
    }

    async updateAll( { label, name } : { label: string, name: string} ) {
        const { data: updated, error } = await supabase.from(TABLE_NAME)
            .update({
                label,
                name
            })
            .eq('request_id', this.request_id)

        if ( error ) {
            console.log(error)
            return false
        }
        return true
    }

    static async updateById(id: number, { label, name } : { label: string, name: string }) {
        const rc = new RequestClient({ request_id: id, label, name })
        return await rc.updateAll({ label, name })
    }

    // This can statically update a record even if we have not initialized it yet, for the purposes of message insert
    static async updateUnreadById(id: number,has_unread: boolean ) {
        const rc = new RequestClient({ request_id: id, label: '', name: '' })
        return await rc.updateHasUnread(has_unread)
    }
}