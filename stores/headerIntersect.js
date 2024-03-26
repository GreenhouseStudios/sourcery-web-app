/**
 * Defines an incredibly simple store for maintaining the state of the window intersecting with a trigger.
 * Useful in showing/hiding the top navigation/callout on the homepage.
 */
export const useHeaderIntersectStore = defineStore('headerIntersect', () => {
    const headerIntersect = ref(false)

    function setHeaderIntersect(value) {
        headerIntersect.value = value
    }

    return {
        headerIntersect,
        setHeaderIntersect
    }
})