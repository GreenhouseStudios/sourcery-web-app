<template>
  <v-list-item>
    <v-list-item-content>
      <v-list-item-title>{{ organization.name }}</v-list-item-title>
      <v-list-item-subtitle>{{ organization.address }}</v-list-item-subtitle>
    </v-list-item-content>
    <v-list-item-action>
      <v-btn
        color="primary"
        text
        :to="to"
      >
        View
      </v-btn>
    </v-list-item-action>
  </v-list-item>
</template>

<script>
export default {
    name: 'OrganizationListItem',
    props: {
        organization: {
            type: Object,
            required: true
        }
    },
    computed: {
        to () {
            if (this.organization.slug) {
                return '/o/' + this.organization.slug
            }
            return '/o/' + this.organization.id
        }
    }
}
</script>
