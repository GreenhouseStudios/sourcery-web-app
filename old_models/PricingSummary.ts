import { supabase } from '~/plugins/supabase'


const TABLE_NAME = 'pricing_summaries'

export type PricingSummaryProps = {
    id: number | null
    request_id: number | null
    base_fee: Number
    service_fee: Number
    total: Number
    created_at: string | null
}

export class PricingSummary {
    id: number | null
    request_id: number | null
    base_fee: Number
    service_fee: Number
    total: Number
    created_at: string | null

    constructor({
        id = null,
        request_id = null,
        base_fee = 0,
        service_fee = 0,
        total = 0,
        created_at = null
    }: PricingSummaryProps) {
        this.id = id,
        this.request_id = request_id
        this.base_fee = base_fee
        this.service_fee = service_fee
        this.total = total
        this.created_at = created_at
    }

    public static createNull() {
        return new PricingSummary({
            id: null,
            request_id: null,
            base_fee: 0,
            service_fee: 0,
            total: 0,
            created_at: null
        })
    }
}