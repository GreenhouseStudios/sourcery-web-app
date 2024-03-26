/**
 * Determines whether this user originated from archiveSpace
 */
export default function ({ store, redirect, route }) {
    // Check for param in link and update store
    if (route.query.archiveOrigin) {
        console.log('Originating from ArchiveSpace')

        const requestInfo = {
            organization_id: parseInt(route.query.organization_id),
            record_uri: route.query.record_uri,
            record_cite: route.query.record_cite,
            record_name: route.query.record_display_string,
            record_repo: route.query.record_resolved_repo,
            origin: 'archivesspace'
        }

        console.log('archivespace integration:', requestInfo)

        store.commit('supabaseCreate/setIntegrationData', requestInfo)

        // if logged in, redirect to create request, otherwise redirect to login
        const isLoggedIn = store.getters['supabaseAuth/isLoggedIn']
        if (!isLoggedIn) {
            return redirect('/login')
        } else {
            return redirect('/request/create')
        }
    }
}
