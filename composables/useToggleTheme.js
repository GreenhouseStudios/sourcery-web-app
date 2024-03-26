import { useTheme } from 'vuetify'
/**
 * This composable is a wrapper around the vuetify theme, saving preference to local storage, that can be used anywhere the theme is changed.
 * @returns 
 */
export default function useToggleTheme() {
    const theme = useTheme()

    function toggleTheme() {
        const new_theme = theme.global.current.value.dark ? 'light' : 'dark'
        theme.global.name.value = new_theme
        localStorage.setItem('dark_theme', new_theme === 'dark')
    }

    function setTheme(themeName) {
        theme.global.name.value = themeName
        localStorage.setItem('dark_theme', themeName === 'dark')
    }

    function setDark(val = true) {
        theme.global.name.value = val ? 'dark' : 'light'
        localStorage.setItem('dark_theme', val)
    }

    return {
        toggleTheme,
        setTheme,
        setDark
    }

}