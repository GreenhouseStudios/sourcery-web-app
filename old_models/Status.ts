import { supabase } from '~/plugins/supabase'

const TABLE_NAME = 'public.status'

export class Status {
    id: number
    name: string

    constructor({ id, name }: Status) {
        this.id = id,
        this.name = name
    }

    static get_all_status_names() {
        return ['Submitted', 'In Progress', 'Complete', 'Archived', 'Cancelled']
    }

    public toJSON() {
        return {
            id: this.id,
            name: this.name
        }
    }

    public static async getById(id: number) {
        let { data: status, error } = await supabase.from('status')
            .select('*')
            .eq('id', id)
        if ( Array.isArray(status) && status.length > 0 && status[0] && status[0].id ) {
            const s = new Status(status[0])
            return s
        }
        return null
    }


    public static async getByName(name : string) {
        let { data: status, error } = await supabase.from('status')
            .select('*')
            .eq('name', name)
            .limit(1)
            .single()

        if ( status && status.name ) {
            const s = new Status(status)
            return s
        }

        return null
    }

    public static async getAll() {
        let { data: statuses, error } = await supabase.from('status')
            .select('*')
            .order('id')

        if ( statuses ) {
            return statuses.map(x => new Status(x))
        }
        return []
    }
}