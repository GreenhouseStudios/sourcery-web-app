import { Organization } from "~/models/Organization"
import { FeaturedImage } from "~/models/FeaturedImage"
import type { Commit, Dispatch, ActionTree, MutationTree } from 'vuex'
import { v4 as uuidv4 } from 'uuid'
import mime from 'mime-types'
import { supabase } from "~/plugins/supabase"
import { Repository } from "~/models/Repository"

export const initialState = () => {
    return {
        organization: null as Organization | null
    }
}

export type SupabaseManageState = ReturnType<typeof initialState>

interface UpdateRepoPhotoParams {
    file: File,
    repository: Repository
}

export const state = initialState

export const getters = {
    organization(state: SupabaseManageState) {
        return state.organization
    }
}

export const mutations : MutationTree<SupabaseManageState> = {
    setOrg(state: SupabaseManageState, value: Organization) {
        state.organization = value
    },
    clear(state: SupabaseManageState) {
        const initial = initialState()
        state.organization = initial.organization
    }
}

export const actions : ActionTree<SupabaseManageState, SupabaseManageState> = {
    async getOrgBySlug({ commit }: { commit: Commit }, slug : string) {
        const organization = await Organization.getBySlug(slug)
        commit('setOrg', organization)
        return true
    },
    async updateOrgPhoto({ state, dispatch, rootGetters } : { state: SupabaseManageState, dispatch: Dispatch, rootGetters: any}, file : File) {
        const fileName = `${uuidv4()}.${mime.extension(file.type)}`

        if ( !state.organization ) {
            return false
        }

        try {
            const filePath = `featured_images/${state.organization.id}/${fileName}`

            const { data, error } = await supabase.storage
                .from('attachments')
                .upload(filePath, file)

            if ( error ) {
                throw error
            }

            const { data: publicURLData } = supabase.storage
                .from('attachments')
                .getPublicUrl(filePath)

            if ( !publicURLData || !publicURLData.publicUrl ) {
                throw new Error('Could not get public URL.')
            }

            const featured_image = new FeaturedImage({
                user_id: rootGetters['supabaseAuth/authUser'].id,
                url: publicURLData.publicUrl,
                label: ''
            })

            const image = await featured_image.insert()

            if ( image === false ) {
                throw 'Featured image was not saved successfully.'
            }

            const status = await state.organization.saveImage(image)
            await dispatch('getOrgBySlug', state.organization.slug)

            if ( status === false ) {
                throw 'Organization reference to image could not be saved.'
            }

            return true
        } catch (error) {
            console.log(error)
            return false
        }
    },
    async updateRepoPhoto({ state, dispatch, rootGetters } : { state: SupabaseManageState, dispatch: Dispatch, rootGetters: any }, params : UpdateRepoPhotoParams) {
        const file = params.file
        const repository = params.repository

        const fileName = `${uuidv4()}.${mime.extension(file.type)}`

        if ( !state.organization ) {
            return false
        }

        try {
            const filePath = `featured_images/repo-${repository.id}/${fileName}`

            const { data, error } = await supabase.storage
                .from('attachments')
                .upload(filePath, file)

            if ( error ) {
                throw error
            }

            const { data: publicURLData } = supabase.storage
                .from('attachments')
                .getPublicUrl(filePath)

            if ( !publicURLData || !publicURLData.publicUrl ) {
                throw new Error('Could not get public URL.')
            }

            const featured_image = new FeaturedImage({
                user_id: rootGetters['supabaseAuth/authUser'].id,
                url: publicURLData.publicUrl,
                label: ''
            })

            const image = await featured_image.insert()

            if ( image === false ) {
                throw 'Featured image was not saved successfully.'
            }

            const status = await repository.saveImage(image)
            await dispatch('getOrgBySlug', state.organization.slug)

            if ( status === false ) {
                throw 'Repository reference to image could not be saved.'
            }

            return true
        } catch (error) {
            console.log(error)
            return false
        }
    }
}