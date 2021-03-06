
/**
 * Finish the onboarding process, if not yet complete.
 */
export default function ({ store, redirect, route, error, req }) {
    const routeName = 'register-complete'

    if (store.getters['auth/activeUser'] && (route.name !== routeName) && ((store.getters['meta/isResearcher'] || store.getters['meta/isSourcerer']) && !(store.getters['meta/onboardingComplete']))) {
        return redirect({ name: routeName })
    }
}
