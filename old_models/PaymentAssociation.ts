import { supabase } from '~/plugins/supabase'
import { User } from '@supabase/supabase-js'

const TABLE_NAME = 'payment_associations'

export class PaymentAssociation {
    id: number | null
    stripe_access_token: string
    stripe_livemode: Boolean
    stripe_refresh_token: string
    stripe_scope: string
    stripe_publishable_key: string
    stripe_user_id: string
    stripe_token_type: string
    stripe_customer_id: string
    user_id: string
    created_at: string | null

    constructor({ 
        id = null,
        stripe_access_token,
        stripe_livemode,
        stripe_refresh_token,
        stripe_scope,
        stripe_publishable_key,
        stripe_user_id,
        stripe_token_type,
        stripe_customer_id,
        user_id,
        created_at = null
    }: PaymentAssociation) {
        this.id = id
        this.stripe_access_token = stripe_access_token
        this.stripe_livemode = stripe_livemode
        this.stripe_refresh_token = stripe_refresh_token
        this.stripe_scope = stripe_scope
        this.stripe_publishable_key = stripe_publishable_key
        this.stripe_user_id = stripe_user_id
        this.stripe_token_type = stripe_token_type
        this.stripe_customer_id = stripe_customer_id
        this.user_id = user_id
        this.created_at = created_at
    }

    public toJSON() {
        return {
            id: this.id,
            stripe_access_token: this.stripe_access_token,
            stripe_livemode: this.stripe_livemode,
            stripe_refresh_token: this.stripe_refresh_token,
            stripe_scope: this.stripe_scope,
            stripe_publishable_key: this.stripe_publishable_key,
            stripe_user_id: this.stripe_user_id,
            stripe_token_type: this.stripe_token_type,
            stripe_customer_id: this.stripe_customer_id,
            user_id: this.user_id,
            created_at: this.created_at
        }
    }

    public toUpdateJSON() {
        return {
            stripe_access_token: this.stripe_access_token,
            stripe_livemode: this.stripe_livemode,
            stripe_refresh_token: this.stripe_refresh_token,
            stripe_scope: this.stripe_scope,
            stripe_publishable_key: this.stripe_publishable_key,
            stripe_user_id: this.stripe_user_id,
            stripe_token_type: this.stripe_token_type,
            stripe_customer_id: this.stripe_customer_id,
            user_id: this.user_id
        }
    }


    public static async getFromUser(user : User|string) {
        let id = ''
        if ( typeof user === 'string' ) {
            id = user
        } else {
            id = user.id
        }
        
        try {
            let { data: payment_associations, error } = await supabase
                .from(TABLE_NAME)
                .select("*")
                .eq('user_id', id)

            const payment_associations_empty = Array.isArray(payment_associations) && payment_associations.length === 0

            if ( error ) {
                throw error
            }

            if ( !payment_associations || payment_associations_empty ) {
                throw 'No payment associations'
            }

            return new PaymentAssociation(payment_associations[0])
        } catch( error ) {
            console.log(error)
            return false
        }
    }

    public async save() {
        try {
            let data,error
            if ( this.id ) {
                ( { error } = await supabase
                        .from(TABLE_NAME)
                        .update( this.toUpdateJSON() )
                        .eq('id', this.id)
                )
            } else {
                ( { data, error } = await supabase
                    .from(TABLE_NAME)
                    .insert(
                        [ this.toUpdateJSON() ]
                    )
                )
                console.log('data from payment_association insert', data)
            }
            if ( error ) {
                throw error
            }

            return true
        } catch( error ) {
            console.log(error)
            return false
        }
    }
}