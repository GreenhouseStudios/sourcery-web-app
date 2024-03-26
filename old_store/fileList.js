import { v4 as uuidv4 } from 'uuid'

/**
 * A simple store to manage the state of the
 * FileList object across multiple file-* components
 */
const initialState = () => {
    return {
        files: []
    }
}

export const state = initialState

export const getters = {
    // func (state) {
    //     return state.sometin
    // }
}

export const mutations = {
    add (state, file) {
        /**
         * Made a custom object here bc Vue 2 doesn't support
         * Map() reactivity. Nor will it.
         * @link https://github.com/vuejs/vue/issues/6644#issuecomment-434806014
         */
        state.files.push({
            key: uuidv4(),
            value: file,
            active: true
        })
    },
    /**
     * Won't actually remove the element bc that
     * will eff up our indexes on the array.
     */
    remove (state, key) {
        state.files.forEach((item, index) => {
            if (item.key === key) {
                item.active = false
            }
        })
    },
    reset (state) {
        state = initialState
    }
}

export const actions = {
    addAll ({ commit }, fileList) {
        for (const f of fileList) {
            commit('add', f)
        }
    }
    // async tbd ({ state, commit, dispatch, rootGetters }) {

    // }
}
