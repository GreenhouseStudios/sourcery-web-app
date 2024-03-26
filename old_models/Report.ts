import { supabase } from '~/plugins/supabase'
import type { Request } from '~/models/Request'

const TABLE_NAME = 'reports'

export type CreateReport = {
    id: number | null
    request_id: number
    user_id: string
}

export class Report {
    id: number | null
    request_id: number
    user_id: string
    requests?: Request[]

    constructor({
        id = null,
        request_id,
        user_id
    } : CreateReport) {
        this.id = id
        this.request_id = request_id
        this.user_id = user_id
    }

    toInsertJSON() {
        return {
            request_id: this.request_id,
            user_id: this.user_id
        }
    }

    public static async getReports(user_id: string, request_id: number) {
        const query = supabase.from(TABLE_NAME)
            .select(`
                *,
                user(*),
                request:requests(*)
            `)
            .order('created_at', { ascending: false })
            .eq('user_id', user_id)
            .eq('request_id', request_id)

        let { data: reports, error } = await query

        if ( Array.isArray(reports) ) {
            const rps = reports.map(x => {
                return new Report(x)
            })
            return rps
        }

        return []
    }

    async insert() {
        const { data: report, error } = await supabase.from(TABLE_NAME)
            .insert([
                this.toInsertJSON()
            ])
        
        if ( error ) {
            console.log(error)
            return null
        }

        return report
    }
}