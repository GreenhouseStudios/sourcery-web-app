import { createClient } from '@supabase/supabase-js'
import { PostgrestClient } from '@supabase/postgrest-js'

export const supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_KEY,
    {
        multiTab: false
    }
)

export const postgrest = new PostgrestClient(process.env.SUPABASE_URL)

export default async function setStore ({ store, route, app: { router } }) {
    const { data: { user } } = await supabase.auth.getUser()
    store.commit('supabaseAuth/setAuthUser', user)
    await store.dispatch('supabaseAuth/fetchUserMeta')
    await store.dispatch('supabaseAuth/fetchUserOrganizations')

    supabase.auth.onAuthStateChange(async (_, session) => {
        const hasPasswordResetToken = store.getters['supabaseAuth/resetAccessToken']

        // console.log(_, session)

        if (_ === 'SIGNED_OUT') {
            store.commit('supabaseChat/clear')
            store.commit('supabaseAuth/clear')
            router.push('/login')
            return
        }

        // One issue with token refresh is that it will immediately SIGNED_IN right after
        if (_ === 'TOKEN_REFRESHED') {
            return
        }

        if (_ === 'PASSWORD_RECOVERY') {
            console.log('password recovery detected!')
            return router.push('/resetpassword')
        }

        // This is probably more complicated than it needs to be but
        // There is no excellent way to await all user data being saved to state in a view
        // so we use store to trigger the redirect.
        // Essentially any view can just set redirectHome on the auth state and it will once login status changes
        if (_ === 'SIGNED_IN') {
            if (hasPasswordResetToken) {
                store.commit('supabaseAuth/setAuthUser', session.user)
                store.dispatch('supabaseAuth/fetchUserMeta')
                store.dispatch('supabaseAuth/fetchUserOrganizations')
                return
            }

            if (session && session.user) {
                store.commit('supabaseAuth/setAuthUser', session.user)
                if (!store.getters['supabaseAuth/justRegistered']) {
                    await store.dispatch('supabaseAuth/fetchUserMeta')
                    await store.dispatch('supabaseAuth/fetchUserOrganizations')

                    const inProgressRequest = JSON.parse(localStorage.getItem('sourceryInProgressRequest'))
                    console.log('inProgressRequest', inProgressRequest)

                    const hasInProgressRequest = inProgressRequest && inProgressRequest.request

                    await store.dispatch('supabaseAuth/checkHasSignUpEmail')

                    if (hasInProgressRequest) {
                        router.push('/request/create')
                    } else if (store.getters['supabaseAuth/shouldRedirectHome']) {
                        store.commit('supabaseAuth/setRedirectHome', false)
                        router.push('/dashboard')
                    }
                }
            }
        }
    })
}
