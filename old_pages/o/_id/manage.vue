<template>
  <v-layout class="manage-org-page">
    <v-flex xs12 sm8 xl6 offset-sm2 offset-xl3>
      <h1 class="mb-4">
        Manage Organization
      </h1>

      <sourcery-card title="Change Organization Image" icon="mdi-file-image">
        <figure v-if="orgHasFeaturedImage" class="mb-3">
          <v-img
            :src="orgFeaturedImageUrl"
            height="300"
            class="grey lighten-2"
          />
        </figure>
        <p v-else class="ml-3 mt-3">
          No featured image yet.
        </p>
        <v-form ref="orgUploadForm" enctype="multipart/form-data" novalidate @submit.prevent="saveOrgPhoto()">
          <input
            ref="orgUpload"
            type="file"
            name="orgUploadFileField"
            :disabled="isSaving"
            accept="image/*"
            class="input-file"
          >
          <v-btn type="submit" :loading="isSaving" :disabled="isSaving" color="primary">
            Upload
          </v-btn>
        </v-form>
      </sourcery-card>

      <sourcery-card v-for="repo in organization.repositories" :title="`Change ${repo.name} Image`" icon="mdi-image-multiple">
        <figure v-if="repoHasImage(repo)" class="mb-3">
          <v-img
            :src="repoImageUrl(repo)"
            height="300"
            class="grey lighten-2"
          />
        </figure>
        <p v-else class="ml-3 mt-3">
          No featured image yet.
        </p>
        <v-form :ref="`repoUploadForm-${repo.id}`" enctype="multipart/form-data" novalidate @submit.prevent="saveRepoPhoto(repo)">
          <input
            :ref="`repoUpload-${repo.id}`"
            type="file"
            :name="`repoUploadFileField-${repo.id}`"
            accept="image/*"
            class="input-file"
          >
          <v-btn type="submit" :loading="isSaving" :disabled="isSaving" color="primary">
            Upload
          </v-btn>
        </v-form>
      </sourcery-card>
    </v-flex>
  </v-layout>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import SourceryCard from '~/components/card-with-header.vue'

export default {
    components: {
        SourceryCard
    },
    middleware: 'admin-guard',
    async asyncData ({ params, store }) {
        await store.dispatch('supabaseManage/getOrgBySlug', params.id)
        return {}
    },
    data () {
        return {
            isSaving: false
        }
    },
    computed: {
        ...mapGetters({
            organization: 'supabaseManage/organization'
        }),
        orgHasFeaturedImage () {
            return !!this.organization?.featured_image
        },
        orgFeaturedImageUrl () {
            return this.organization?.featured_image?.url
        }
    },
    methods: {
        ...mapActions({
            updateOrgPhoto: 'supabaseManage/updateOrgPhoto',
            updateRepoPhoto: 'supabaseManage/updateRepoPhoto'
        }),
        repoHasImage (repo) {
            return !!repo.featured_image
        },
        repoImageUrl (repo) {
            return repo.featured_image?.url
        },
        async saveOrgPhoto () {
            this.isSaving = true
            const files = Array.from(this.$refs.orgUpload.files)
            console.log(files)

            if (files.length > 0) {
                const status = await this.updateOrgPhoto(files[0])
                this.isSaving = false
                return status
            }

            console.log('Couldn\'t find files for reference.  Is the upload field set correctly?')
            this.isSaving = false
            return false
        },

        async saveRepoPhoto (repo) {
            this.isSaving = true
            const files = Array.from(this.$refs[`repoUpload-${repo.id}`][0].files)
            if (files.length > 0) {
                const status = await this.updateRepoPhoto({
                    file: files[0],
                    repository: repo
                })
                this.isSaving = false
                return status
            }
            this.isSaving = false
            return false
        }
    }
}
</script>

<style>
.theme--dark .manage-org-page .input-file::-webkit-file-upload-button {
  color: black;
}
</style>
