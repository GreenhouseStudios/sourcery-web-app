/**
 * This middleware is used to redirect a user to dashboard if they are already authenticated.
 * Useful on pages like "login" or "register".
 */
export default defineNuxtRouteMiddleware((to, from) => {
    const user = useSupabaseUser()

    if ( user.value ) {
        return navigateTo('/dashboard')
    }
})