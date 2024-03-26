import { supabase } from '~/plugins/supabase'

const TABLE_NAME = 'featured_images'

interface SourceryFeaturedImage {
    id?: number | null
    user_id: string
    url: string
    label: string
    created_at?: string | null
}

export class FeaturedImage {
    id?: number | null
    user_id: string
    url: string
    label: string
    created_at?: string | null

    constructor({
        id = null,
        user_id,
        url,
        label,
        created_at = null
    }: SourceryFeaturedImage) {
        this.id = id,
        this.user_id = user_id
        this.url = url
        this.label = label
        this.created_at = created_at
    }

    toInsertJSON() {
        return {
            user_id: this.user_id,
            url: this.url,
            label: this.label
        }
    }

    async insert() {
        const { data: image, error } = await supabase.from(TABLE_NAME)
            .insert(this.toInsertJSON())
            .select()

        if ( error ) {
            console.log(error)
        }

        if ( image && Array.isArray(image) && image.length > 0 ) {
            return new FeaturedImage(image[0])
        }

        return false
    }
}