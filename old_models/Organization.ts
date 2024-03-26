import { supabase } from '~/plugins/supabase'

import { Repository } from '~/models/Repository'
import { FeaturedImage } from '~/models/FeaturedImage'

const TABLE_NAME = 'organizations'

export class Organization {
    id: number | null
    address: string
    name: string
    slug: string
    owner_id: string
    featured_image_id: number | null
    created_at: string | null
    repositories?: Repository[]
    featured_image?: FeaturedImage

    constructor({
        id = null,
        address,
        name,
        slug,
        owner_id,
        featured_image_id = null,
        created_at = null,
        repositories = undefined,
        featured_image = undefined
    }: Organization) {
        this.id = id,
        this.address = address
        this.name = name
        this.slug = slug
        this.owner_id = owner_id
        this.featured_image_id = featured_image_id
        this.created_at = created_at

        if ( repositories ) {
            this.repositories = repositories.map(x => new Repository(x))
        }

        if ( featured_image ) {
            this.featured_image = featured_image
        }

    }

    public static async getByOwner(user_id: string) {
        let { data: organizations, error } = await supabase.from('organizations')
            .select(`
                *,
                repositories(*)
            `)
            .eq('owner_id', user_id)

        if ( Array.isArray(organizations) && organizations.length > 0 && organizations[0] ) {
            const orgs = organizations.map(x => new Organization(x))
            return orgs
        }
        return []
    }

    public static async getById(id: string | number) {
        let { data: org, error } = await supabase.from(TABLE_NAME)
            .select(`
                *,
                repositories (*)
            `)
            .eq('id', id)
            .limit(1)
            .single()

        if ( org ) {
            return new Organization(org)
        }
        return null
    }

    public static async getBySlug(slug: string) {
        let { data: org, error } = await supabase.from(TABLE_NAME)
            .select(`
                *,
                repositories (
                    *,
                    featured_image:featured_images!repositories_featured_image_id_fkey (*)
                ),
                featured_image:featured_images!organizations_featured_image_id_fkey (*)
            `)
            .eq('slug', slug)
            .limit(1)
            .single()

        if ( org ) {
            console.log(org)
            return new Organization(org)
        }

        if ( error ) {
            console.log(error)
        }

        return null
    }

    public static async getAll() {
        const { data: organizations, error } = await supabase.from(TABLE_NAME)
            .select(`
                *,
                repositories(*)
            `)

        if ( Array.isArray(organizations) && organizations.length > 0 ) {
            const orgs = organizations.map(x => new Organization(x))
            return orgs
        }

        return []
    }

    async saveImage(featured_image : FeaturedImage) {
        const { data: replaced, error } = await supabase.from(TABLE_NAME)
            .update({ featured_image_id: featured_image.id })
            .eq('id', this.id)

        if ( error ) {
            console.log(error)
            return false
        }
        return true
    }

    public static async getAverageTurnaroundTime(id : Number) {
        const { data, error } = await supabase.rpc('get_average_time_for_requests', { org_id: id })

        if ( data && data.length > 0 ) {
            return data[0]
        }

        console.log(error)
        return false
    }
}