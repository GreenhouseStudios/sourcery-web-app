<template>
  <div>
    <h3>Import Repositories</h3>
    <v-btn @click="runImport">
      Run Import
    </v-btn>

    <h5 v-if="records.length">
      Importing...
    </h5>
    <ol>
      <li v-for="(record, index) in records">
        {{ record }}
      </li>
    </ol>
  </div>
</template>

<script>

import items from '~/assets/csvjson.json'

export default {
    name: 'Import',
    auth: false,
    data () {
        return {
            records: []
        }
    },
    methods: {
        runImport () {
            const that = this
            items.forEach((item) => {
                if (item.name !== '') {
                    this.$fire.firestore.collection('repositories').add({
                        address1: item.address1,
                        address2: item.address2,
                        city: item.city,
                        country_code: item.country_code,
                        geo: new this.$fireModule.firestore.GeoPoint(item.lat, item.long),
                        institution: item.institution,
                        name: item.name,
                        postal_code: item.postal_code,
                        secondary_location: item.secondary_location,
                        state: item.state
                    })
                        .then(function () {
                            console.log(`Imported "${item.name}"`)
                            that.records.push(item.name)
                        })
                        .catch(function (error) {
                            console.error(error)
                        })
                }
            })
        }
    }
}
</script>

<style scoped>

</style>
