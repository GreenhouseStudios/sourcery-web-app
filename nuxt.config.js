export default {
    target: 'static',
    ssr: false,

    // @url https://nuxtjs.org/blog/moving-from-nuxtjs-dotenv-to-runtime-config/
    publicRuntimeConfig: {
        /**
         * Paths that don't require authentication
         */
        publicPaths: [
            '/login',
            '/login/redirect',
            '/about',
            '/',
            '/register',
            '/password',
            '/resetpassword',
            '/index-new',
            '/terms',
            '/privacy',
            '/cookies-notice',
            '/team',
            '/dashboard',
            '/request/create',
            '/archiveSpace',
            '/archiveSpace/',
            '/join-us',
            '/roadmap',
            '/email/reset',
            '/brand-resources'
        ],

        /**
         * Max upload size in bytes
         */
        maxUploadBytes: parseInt(process.env.MAX_BYTES) || 52428800,

        /**
         * Define necessary public env vars.
         */
        BASE_URL: process.env.BASE_URL || 'http://localhost:3000',
        SUPABASE_URL: process.env.SUPABASE_URL || 'http://localhost:54321',
        SUPABASE_KEY: process.env.SUPABASE_KEY,
        SOURCERY_ENV: process.env.SOURCERY_ENV || 'development'
    },

    env: {
        BASE_URL: process.env.BASE_URL || 'http://localhost:3000',
        SUPABASE_URL: process.env.SUPABASE_URL || 'http://localhost:54321',
        SUPABASE_KEY: process.env.SUPABASE_KEY,
        SOURCERY_ENV: process.env.SOURCERY_ENV || 'development'
    },

    /*
     ** Headers of the page
     */
    head: {
        title: 'Sourcery',
        meta: [
            { charset: 'utf-8' },
            { 'http-equiv': 'x-ua-compatible', content: 'ie=edge' },
            { name: 'viewport', content: 'width=device-width, initial-scale=1' }
        ],
        link: [
            {
                rel: 'stylesheet',
                href:
                    'https://fonts.googleapis.com/css?family=Barlow:500,600,700,800&display=swap'
            },
            {
                rel: 'stylesheet',
                href:
                    'https://fonts.googleapis.com/css?family=Roboto:300,400,500,700&display=swap'
            },
            { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
            { rel: 'apple-touch-icon', href: '/apple-icon.png' },
            {
                rel: 'manifest',
                href: '/manifest.json',
                crossorigin: 'use-credentials'
            }
            // {rel: 'stylesheet', type: 'text/css', href: '~/assets/styles/addtohomescreen.css'}
        ],
        script: [
            // Service worker registration
            { src: '/js/sw-registration.js' },

            // Add to homescreen popup
            { src: '/js/addtohomescreen.js' }
        ]
    },

    /*
     ** Global CSS Files
     */
    css: [
        '~/assets/styles/sourcery.css',
        // 'material-design-icons-iconfont/dist/material-design-icons.css',
        'paymentfont/css/paymentfont.min.css',
        '~/assets/styles/addtohomescreen.css',
        '~/assets/styles/chat.css'
    ],

    /*
     ** Plugins
     */
    plugins: [
        '~/plugins/vue-instantsearch',

        // Custom utilities for Sourcery
        '~/plugins/utils',

        // Sourcery Form Rules
        '~/plugins/sourcery-forms',

        { src: '~/plugins/vuetify.ts', ssr: false },

        '~/plugins/supabase',

        '~/plugins/sourcery-functions.ts',

        '~/plugins/filesize',

        '~/plugins/filters',

        '~/plugins/sorting',

        '~/plugins/jsonld-export'

    ],

    /** pwa: {
        // configure the workbox plugin
        workboxPluginMode: 'InjectManifest',
        workboxOptions: {
          swSrc: "~/firebase-messaging-sw.js"
        }
      },**/

    /**
     * Customize the loading bar
     * @url https://nuxtjs.org/api/configuration-loading/
     */
    loading: {
        color: '#654EA3',
        height: '5px'
    },

    /*
     ** Router
     */
    router: {
        middleware: [
            'reset-password',
            'auth-guard',
            'archiveSpace'
        ]
    },

    modules: [
        [
            '@nuxtjs/google-analytics',
            {
                id: process.env.GOOGLE_ANALYTICS_ID,
                dev: false // don't use in dev mode
            }
        ],
        // '@nuxtjs/pwa',
        '@nuxtjs/toast',
        '@nuxtjs/sentry'
    ],

    /**
     * Sentry Error Logging
     * @url https://sentry.nuxtjs.org/guide/setup
     */
    sentry: {
        dsn: process.env.SENTRY_DSN
    },

    /**
     * Settings for @nuxtjs/vuetify
     * @url https://github.com/nuxt-community/vuetify-module/
     */
    vuetify: {
        theme: {
            option: {
                customProperties: true
            },
            themes: {
                light: {
                    primary: '#654EA3',
                    secondary: '#4E4B51',
                    accent: '#53AFAC',
                    error: '#b71c1c'
                },
                dark: {
                    primary: '#c5aeef',
                    secondary: '#2f2740'
                }
            }
        },
        options: {
            customProperties: true
        },
        defaultAssets: {
            font: {
                family: 'Barlow'
            },
            icons: 'mdi'
        },
        treeShake: true,
        customVariables: ['~/assets/variables.scss']
    },

    /**
     * Nuxt Toasted
     * @url https://github.com/nuxt-community/modules/tree/master/packages/toast#toast
     *
     * Options
     * @url https://github.com/shakee93/vue-toasted
     */
    toast: {
        theme: 'toasted-primary', // ['toasted-primary', 'outline', 'bubble']
        position: 'bottom-center',
        duration: 5000,
        keepOnHover: false,
        action: null,
        fullWidth: false,
        fitToScreen: false,
        className: null,
        containerClass: null,
        iconPack: 'material', // ['material', 'fontawesome', 'mdi', 'custom-class', 'callback']
        Icon: null, // Material icon name as string. explained here
        type: 'default', // Type of the Toast ['success', 'info', 'error']
        onComplete: null,
        closeOnSwipe: true,
        singleton: false
    },

    // Auto import components (https://go.nuxtjs.dev/config-components)
    components: true,

    // Modules for dev and build (recommended) (https://go.nuxtjs.dev/config-modules)
    buildModules: [
        // https://go.nuxtjs.dev/eslint
        '@nuxtjs/eslint-module',
        // https://go.nuxtjs.dev/vuetify
        '@nuxtjs/vuetify'
    ],

    // Required to read .ts files in other nuxt files.
    extensions: ['ts', 'tsx'],

    // Build Configuration (https://go.nuxtjs.dev/config-build)
    build: {
        // Fix for this bug: https://github.com/babel/babel/issues/11622
        babel: {
            plugins: [
                ['@babel/plugin-proposal-private-methods', { loose: true }]
            ]
        },
        additionalExtensions: ['ts', 'tsx'],
        extend (config, { isDev }) {
            // Extend only webpack config for client-bundle
            if (isDev) {
                config.devtool = 'source-map'
                // Locally, nuxt might have issues serving chunks greater than this size.
                config.optimization.splitChunks.maxSize = 40000
            }

            // Fix during development
            config.module.rules.push({
                enforce: 'pre',
                test: /\.(js|vue)$/,
                loader: 'eslint-loader',
                exclude: /(node_modules)/,
                options: {
                    fix: true
                }
            })

            // Support for typescript imports from js files
            config.resolve.extensions.push('.ts', '.tsx')
            config.module.rules.push({
                test: /\.ts(x?)$/,
                exclude: /node_modules/,
                loader: 'ts-loader'
            })
        },

        // Disable Console messages in production builds
        terser: {
            terserOptions: {
                compress: {
                    drop_console: true
                }
            }
        }
    }
}
