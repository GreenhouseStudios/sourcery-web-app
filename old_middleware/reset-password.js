export default function ({ store, redirect, route, $config }) {
    const vars = {}
    // REGEX to match hash and query params (#= and &=)
    // See /login/redirect page, /email/reset page for other ways to do this in future.
    route.fullPath.replace(/[?&|?#]+([^=&]+)=([^&]*)/gi, function (m, key, value) {
        vars[key] = value
    })

    if (vars.type && vars.type === 'recovery' && vars.access_token) {
        store.commit('supabaseAuth/setResetAccessToken', vars.access_token)
        return redirect('/resetpassword')
    }
}
