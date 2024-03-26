import { supabase } from '~/plugins/supabase'


const TABLE_NAME = 'attachments'
const STORAGE_BUCKET_NAME = 'attachments'

interface SourceryAttachment {
    id?: number | null
    request_id: number
    user_id: string
    url: string
    mime: string | null
    size: Number | null
    label: string
    pages: Number
    created_at?: string | null
}

export class Attachment implements SourceryAttachment {
    id?: number | null
    request_id: number
    user_id: string
    url: string
    mime: string | null
    size: Number | null
    label: string
    pages: Number
    created_at?: string | null

    constructor({
        id = null,
        request_id,
        user_id,
        url,
        mime,
        size,
        label,
        pages,
        created_at = null
    }: SourceryAttachment) {
        this.id = id,
        this.request_id = request_id
        this.user_id = user_id
        this.url = url
        this.mime = mime
        this.size = size
        this.label = label
        this.pages = pages
        this.created_at = created_at
    }

    toInsertJSON() {
        return {
            request_id: this.request_id,
            user_id: this.user_id,
            url: this.url,
            mime: this.mime,
            size: this.size,
            label: this.label,
            pages: this.pages
        }
    }

    isPDF() {
        return this.url.includes('.pdf')
    }

    async insert() {
        // Include the ID in `row` if it exists
        const row = this.id ? { ...{ id: this.id }, ...this.toInsertJSON() } : this.toInsertJSON()
        const { data: attachment, error } = await supabase.from(TABLE_NAME)
            .upsert([
                row
            ])

        if ( error ) {
            console.log(error)
        }

        if ( attachment ) {
            return true
        }

        return false
    }

    async delete() {
        const { data: attachment, error } = await supabase.from(TABLE_NAME)
            .delete()
            .eq('id', this.id)

        if ( error ) {
            console.log(error)
            return false
        }

        return attachment
    }

    getFileNamePathAndExtension() {
        return this.url.replace(`${process.env.SUPABASE_URL}/storage/v1/object/public/attachments/`, '')
    }

    getFileNameAndExtension() {
        return this.url.substring( this.url.lastIndexOf("/") + 1 )
    }

    /**
     * Currently only supported for supabase files.  Firebase blobs are not supported at this time.
     * @returns 
     */
    async getDownloadBlob() {
        if ( this.url.includes('supabase') ) {
            const { data, error } = await supabase.storage.from(STORAGE_BUCKET_NAME)
                .download(this.getFileNamePathAndExtension())

            if ( error ) {
                console.error('There has been an issue downloading this file.', this)
                return false
            }

            return data
        }

        return false
    }
}