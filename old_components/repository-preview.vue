<template>
  <div v-show="!!repository" class="repository-preview mb-6 mt-2">
    <span class="repository-preview-name">{{ repositoryName }}</span>
    <v-btn icon small color="white" @click="unselect">
      <v-icon>mdi-close</v-icon>
    </v-btn>
  </div>
</template>

<script>
export default {
    props: {
        repository: {
            type: [String, Object],
            default: () => {}
        }
    },
    computed: {
        repositoryName () {
            if (!this.repository) {
                return 'None Selected'
            }

            return this.$utils.repositoryDisplayText(this.repository)
        }
    },
    methods: {
        unselect () {
            this.$emit('unselect')
        }
    }
}
</script>

<style lang="scss" scoped>
.repository-preview {
  background-color: #654EA3;
  padding: 8px 16px;
  border-radius: 5px;
  font-size: 15px;
  display: inline-flex;
  align-items: center;
  column-gap: 20px;
  font-weight: 600;
}
</style>

<style>
.theme--light .repository-preview {
  color: white;
}
</style>
