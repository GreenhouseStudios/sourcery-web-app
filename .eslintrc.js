module.exports = {
    root: true,
    globals: {
        process: true
    },
    env: {
        browser: true,
        node: true
    },
    parserOptions: {
        parser: 'babel-eslint'
    },
    extends: [
        '@nuxtjs',
        'plugin:vue/base',
        'plugin:nuxt/base'
    ],
    plugins: [
        'vuetify'
    ],
    // add your custom rules here
    rules: {
        indent: ['error', 4],
        'no-import-assign': 'warn',
        'no-console': 'off',
        eqeqeq: ['error', 'smart'],
        camelcase: 'off', // TODO Enforce camelcase naming
        'vue/no-v-html': 'off',
        'vue/attribute-hyphenation': 'off',
        'vuetify/no-deprecated-classes': 'error',
        'vue/valid-v-slot': ['error', {
            allowModifiers: true
        }],
        'vue/script-setup-uses-vars': 'off' // This is not in eslint anymore apparently and breaks IDE
    },
    ignorePatterns: ['/tests/', '/static/', '/public/', '**/*.ts'] // Disable these for now
}
