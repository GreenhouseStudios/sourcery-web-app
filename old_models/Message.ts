import { supabase } from '~/plugins/supabase'

import { Repository } from '~/models/Repository'
import { FeaturedImage } from '~/models/FeaturedImage'

const TABLE_NAME = 'messages'

export class Message {
    id: number | null
    to_user_id: string
    subject: string
    dynamic_data: object
    sent: boolean
    created_at: string | null
    template_name: string

    constructor({
        id = null,
        to_user_id,
        subject,
        dynamic_data,
        sent,
        created_at = null,
        template_name
    }: Message) {
        this.id = id,
        this.to_user_id = to_user_id
        this.subject = subject
        this.dynamic_data = dynamic_data
        this.sent = sent
        this.created_at = created_at
        this.template_name = template_name
    }

    public static async getLastForUser(user_id: string, template_name: string) {
        let { data: messages, error } = await supabase.from(TABLE_NAME)
            .select(`*`)
            .order('created_at', { ascending: false })
            .eq('to_user_id', user_id)
            .eq('template_name', template_name)

        if ( Array.isArray(messages) && messages.length > 0 ) {
            return new Message(messages[0])
        }

        return null
    }
}