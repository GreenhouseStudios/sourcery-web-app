import { createClient } from '@supabase/supabase-js'
import { PostgrestClient } from '@supabase/postgrest-js'

export const supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_KEY
)

export const postgrest = new PostgrestClient(process.env.SUPABASE_URL)

export default async function setStore ({ store, app: { router } }) {
    console.log('setting supabase store from plugin')
    store.commit('supabaseAuth/setAuthUser', supabase.auth.user())
    await store.dispatch('supabaseAuth/fetchUserMeta')
    await store.dispatch('supabaseAuth/fetchUserOrganizations')
    await store.dispatch('supabaseAuth/fetchUserHasPassword')

    supabase.auth.onAuthStateChange(async (_, session) => {
        console.log(_, session)
        if (_ === 'SIGNED_OUT') {
            console.log('registered signed out')
            store.commit('supabaseAuth/clear')
            router.push('/login')
            return
        }

        if (_ === 'TOKEN_REFRESHED') {
            return
        }

        // Currently handling registration in the page, so this is excluded.
        if (session && session.user) {
            console.log('registered sign in')
            store.commit('supabaseAuth/setAuthUser', session.user)
            if (!store.getters['supabaseAuth/justRegistered']) {
                await store.dispatch('supabaseAuth/fetchUserMeta')
                await store.dispatch('supabaseAuth/fetchUserOrganizations')
                await store.dispatch('supabaseAuth/fetchUserHasPassword')

                const inProgressRequest = JSON.parse(localStorage.getItem('sourceryInProgressRequest'))
                console.log('inProgressRequest', inProgressRequest)

                const hasInProgressRequest = inProgressRequest && inProgressRequest.request

                if (hasInProgressRequest) {
                    router.push('/request/create')
                } else {
                    router.push('/dashboard')
                }
            }
        }
    })
}