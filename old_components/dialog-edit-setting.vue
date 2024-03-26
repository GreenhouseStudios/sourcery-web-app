<template>
  <v-list-item>
    <v-list-item-avatar
      :class="$vuetify.theme.dark ? 'secondary' : 'deep-purple lighten-5'"
    >
      <v-icon
        :class="$vuetify.theme.dark ? 'primary--text text--lighten-2' : 'primary--text text--darken-2'"
      >
        {{ icon }}
      </v-icon>
    </v-list-item-avatar>
    <v-list-item-content>
      <v-list-item-title v-text="title" />
      <v-list-item-subtitle v-text="initialValue" />
    </v-list-item-content>
    <v-list-item-action>
      <v-dialog
        v-model="open"
        scrollable
        persistent
        :overlay="false"
        max-width="320px"
        transition="dialog-transition"
      >
        <template #activator="{ on, attrs }">
          <v-btn
            color="primary"
            text
            v-bind="attrs"
            v-on="on"
          >
            Change
          </v-btn>
        </template>
        <v-card>
          <v-card-title
            :class="$vuetify.theme.dark ? 'primary--text text--lighten-2 secondary' : 'primary--text text--darken-2 deep-purple lighten-5'"
          >
            Change {{ title }}
          </v-card-title>
          <v-divider />
          <v-form ref="detailsForm" @submit.prevent="updateDetails">
            <v-card-text>
              <v-text-field
                :id="`display${propertyName}`"
                v-model.lazy="editValue"
                type="text"
                :label="label"
                :name="`display${propertyName}`"
                :rules="rules"
                outlined
                hide-details="auto"
              />
            </v-card-text>
            <v-card-actions>
              <v-spacer />
              <v-btn
                text
                @click="cancel()"
              >
                Cancel
              </v-btn>
              <v-btn
                type="submit"
                color="primary"
                text
              >
                Save
              </v-btn>
            </v-card-actions>
          </v-form>
        </v-card>
      </v-dialog>
    </v-list-item-action>
  </v-list-item>
</template>

<script>
export default {
    props: {
        title: {
            type: String,
            required: true
        },
        label: {
            type: String,
            required: true
        },
        propertyName: {
            type: String,
            required: true
        },
        icon: {
            type: String,
            default: 'mdi-account'
        },
        rules: {
            type: Array,
            default: () => []
        },
        vuexRoot: {
            type: String,
            required: true
        },
        vuexAction: {
            type: String,
            required: true
        },
        toastSuccess: {
            type: String,
            default: 'Setting saved successfully.'
        },
        password: {
            type: Boolean,
            default: false
        }
    },
    data () {
        return {
            open: false,
            initialValue: this.$store.getters[this.vuexRoot][this.propertyName] || null,
            editValue: this.$store.getters[this.vuexRoot][this.propertyName] || null
        }
    },
    methods: {
        async updateDetails () {
            if (this.$refs.detailsForm.validate()) {
                await this.$store.dispatch(this.vuexAction, { keyName: this.propertyName, keyValue: this.editValue })
                this.updateEditValue()
                this.$toast.success(this.toastSuccess)
                this.open = false
            }
        },
        updateEditValue () {
            this.initialValue = this.$store.getters[this.vuexRoot][this.propertyName] || null
            this.editValue = this.$store.getters[this.vuexRoot][this.propertyName] || null
        },
        cancel () {
            this.open = false
            this.updateEditValue()
        }
    }
}
</script>
