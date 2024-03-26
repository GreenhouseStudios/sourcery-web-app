import { supabase } from '~/plugins/supabase'
import { get_or_create_user } from '~/plugins/sourcery-functions'

const TABLE_NAME = 'user'

export class User {
    id: string
    name: string
    email: string
    created_at: string
    phone: string
    admin: boolean

    constructor({ id, name, email, created_at, phone, admin = false }: User) {
        this.id = id
        this.name = name
        this.email = email
        this.created_at = created_at
        this.phone = phone
        this.admin = admin
    }

    public toJSON() {
        return {
            id: this.id,
            name: this.name,
            email: this.email,
            created_at: this.created_at,
            phone: this.phone,
            admin: this.admin
        }
    }

    public toUpdateJSON() {
        return {
            name: this.name,
            phone: this.phone
        }
    }

    public async save() {
        if ( this.id ) {
            console.log('Property has an ID, update')
            return await supabase.from(TABLE_NAME)
                .update(this.toUpdateJSON())
                .eq('id', this.id)
        } else {
            throw Error('User object must contain an ID before saving.')
        }
    }

    public static async getById(user_id : string) {
        let { data: user, error } = await supabase.from('user').select('*').eq('id', user_id)
        type SupabaseUser = typeof user
        if ( Array.isArray(user) && user.length > 0 && user[0] && user[0].id ) {
            const u = new User(user[0])
            return u
        }
        return null
    }

    public static async getByIds(user_ids: Array<string>) {
        let { data: users, error } = await supabase.from('user').select('*').in('id', user_ids)
        if ( Array.isArray(users) && users.length > 0 ) {
            return users.map(x => new User(x))
        }
        return []
    }

    public static async getOrSignUp(email : string) {
        // Note - this can only be called successfully by admins or org owners.
        const result = await get_or_create_user({ email })

        if ( result && result.status === 'success' && result.data ) {
            return result.data
        }

        return false
    }
}