import vuetify, { transformAssetUrls } from 'vite-plugin-vuetify'

const publicPaths = [
    '/login',
    '/login/otp',
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
]

export default defineNuxtConfig({
    bridge: {
        typescript: false,
        nitro: true,
        vite: true
    },
    target: 'static',
    ssr: false,

    runtimeConfig: {
        // @url https://nuxtjs.org/blog/moving-from-nuxtjs-dotenv-to-runtime-config/
        public: {
            /**
             * Paths that don't require authentication
             */
            publicPaths,

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
    },

    

    env: {
        BASE_URL: process.env.BASE_URL || 'http://localhost:3000',
        SUPABASE_URL: process.env.SUPABASE_URL || 'http://localhost:54321',
        SUPABASE_KEY: process.env.SUPABASE_KEY,
        SOURCERY_ENV: process.env.SOURCERY_ENV || 'development'
    },

    /*
     ** Configuration for the <head> element of the page.  Also configurable per layout/page/component.
     */
    app: {
        head: {
            title: 'Sourcery',
            meta: [
                { charset: 'utf-8' },
                { 'http-equiv': 'x-ua-compatible', content: 'ie=edge' },
                { name: 'viewport', content: 'width=device-width, initial-scale=1' }
            ],
            link: [
                // Google Fonts
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
            ],
            script: [
                // Service worker registration
                { src: '/js/sw-registration.js' },

                // Add to homescreen popup
                { src: '/js/addtohomescreen.js' }
            ],
        }
    },

    /*
     ** Global CSS Files
     */
    css: [
        '~/assets/styles/sourcery.css',
        // 'material-design-icons-iconfont/dist/material-design-icons.css',
        'paymentfont/css/paymentfont.min.css',
        '~/assets/styles/addtohomescreen.css',
        '~/assets/styles/chat.css',
        '~/assets/src/scss/main.scss'
    ],

    /*
     ** Plugins
     */
    plugins: [
        // Custom utilities for Sourcery
        '~/plugins/utils',

        // Sourcery Form Rules
        '~/plugins/sourcery-forms',

        { src: '~/plugins/vuetify.ts', ssr: false },

        // '~/plugins/sourcery-functions.ts',

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
    // router: {
    //     middleware: [
    //         'reset-password',
    //         'auth-guard',
    //         'archiveSpace'
    //     ]
    // },

    modules: [
        (_options, nuxt) => {
            nuxt.hooks.hook('vite:extendConfig', (config) => {
                // @ts-expect-error
                config.plugins.push(vuetify({ 
                    styles: {
                        configFile: 'assets/src/scss/vuetify-settings.scss'
                    },
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
                    autoImport: true
                }))
            })
        },
        'nuxt-gtag',
        '@nuxtjs/supabase',
        '@pinia/nuxt'
    ],

    build: {
        transpile: ['vuetify']
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

    // Required to read .ts files in other nuxt files.
    extensions: ['ts', 'tsx'],

    vite: {
        vue: {
            template: {
                transformAssetUrls,
            },
        },
    },

    // Only included this because of the current issue with vite-plugin-vuetify
    sourcemap: {
        server: false,
        client: false
    },

    /**
     * Supabase Configuration
     * https://supabase.nuxtjs.org/get-started
     */
    supabase: {
        redirectOptions: {
            exclude: publicPaths
        }
    }
})
