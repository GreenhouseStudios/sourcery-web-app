import { supabase } from '~/plugins/supabase'
import { Organization } from '~/models/Organization'
import { FeaturedImage } from './FeaturedImage'

const TABLE_NAME = 'repositories'

export class Repository {
    id: number | null
    name: string
    address1: string
    address2: string
    city: string
    state: string
    postal_code: string
    country_code: string
    geography: string
    active: boolean
    organization_id: number
    featured_image_id: number | null
    created_at: string | null
    organization?: Organization
    featured_image?: FeaturedImage | null

    constructor({
        id = null,
        name,
        address1,
        address2,
        city,
        state,
        postal_code,
        country_code,
        geography,
        active,
        organization_id,
        featured_image_id = null,
        created_at = null,
        organization = undefined,
        featured_image = undefined
    }: Repository) {
        this.id = id,
        this.name = name
        this.address1 = address1
        this.address2 = address2
        this.city = city
        this.state = state
        this.postal_code = postal_code
        this.country_code = country_code
        this.geography = geography
        this.active = active
        this.organization_id = organization_id
        this.featured_image_id = featured_image_id
        this.created_at = created_at

        if ( organization ) {
            this.organization = organization
        }

        if ( featured_image ) {
            this.featured_image = featured_image
        } else {
            this.featured_image = null
        }
    }

    public static async getActive() {
        const { data: repositories, error } = await supabase.from(TABLE_NAME)
            .select(`
                *,
                organization:organizations (*),
                featured_image:featured_images (*)
            `)
            .order('name')
            .eq('active', true)

        if ( error ) {
            console.log(error)
            return []
        }

        if ( Array.isArray(repositories) ) {
            const reps = repositories.map(x => new Repository(x))
            return reps
        }
        return []
    }

    public static async getGhost() {
        const { data: repositories, error } = await supabase.from(TABLE_NAME)
            .select(`
                *,
                organization:organizations (*),
                featured_image:featured_images (*)
            `)
            .order('name')
            .in('organization.slug', ['sourcery', 'sourcery-test'])

        if ( error ) {
            console.log(error)
            return []
        }

        if ( Array.isArray(repositories) ) {
            const reps = repositories.filter(x => ['sourcery', 'sourcery-test'].includes(x.organization?.slug))
            const reps_objs = reps.map(x => new Repository(x))
            return reps_objs
        }
        return []
    }

    public static async getById(id : number) {
        const { data: repositories, error } = await supabase.from(TABLE_NAME)
            .select(`
                *,
                organization:organizations (*),
                featured_image:featured_images (*)
            `)
            .eq('id', id)

        if ( error ) {
            console.log(error)
            return []
        }

        if ( Array.isArray(repositories) && repositories.length > 0 ) {
            return new Repository(repositories[0])
        }
        return false
    }

    public static async getOwned(orgIds : String[]) {
        const { data: repositories, error } = await supabase.from(TABLE_NAME)
            .select(`
                *,
                organization:organizations (*),
                featured_image:featured_images (*)
            `)
            .order('name')
            .in('organization_id', orgIds)
            .eq('active', false)
        
        if ( Array.isArray(repositories) ) {
            const reps_objs = repositories.map(x => new Repository(x))
            return reps_objs
        }
        return []
    }

    async saveImage(image : FeaturedImage) {
        const { data: replaced, error } = await supabase.from(TABLE_NAME)
            .update({ featured_image_id : image.id })
            .eq('id', this.id)

        if ( error ) {
            console.log(error)
            return false
        }

        return true
    }
}
