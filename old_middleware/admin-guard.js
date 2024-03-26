export default function ({ store, error }) {
    const isAdmin = store.getters['supabaseAuth/isAdmin']

    if (!isAdmin) {
        error('Forbidden')
    }
}
