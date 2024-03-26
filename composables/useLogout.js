/**
 * Allows an easy way to logout of the application.
 */
export const useLogout = () => {
    const supabase = useSupabaseClient()

    const logout = async () => {
        await supabase.auth.signOut()
        navigateTo('/login')
    }

    return { logout }
}