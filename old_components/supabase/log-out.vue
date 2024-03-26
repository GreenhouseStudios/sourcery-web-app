<template>
  <v-btn :loading="loading" @click="logout">
    Log Out
  </v-btn>
</template>

<script>
import { mapMutations } from 'vuex'
import { supabase } from '~/plugins/supabase'

export default {
    data () {
        return {
            loading: false
        }
    },
    methods: {
        ...mapMutations({
            clearAuth: 'supabaseAuth/clear'
        }),
        async logout () {
            try {
                this.loading = true
                const { error } = await supabase.auth.signOut()
                if (error) {
                    throw error
                }
            } catch (e) {
                console.log(e)
            } finally {
                this.loading = false
            }
        }
    }
}
</script>
