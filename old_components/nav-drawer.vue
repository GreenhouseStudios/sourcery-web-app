<template>
  <v-navigation-drawer
    v-model="open"
    app
    bottom
    :class="$vuetify.breakpoint.mobile ? 'sourcery-nav-drawer rounded-t-xl' : 'sourcery-nav-drawer'"
  >
    <v-list
      style="background: rgb(146, 79, 190); background: linear-gradient(135deg, rgba(146, 79, 190, 1) 0%, rgba(111, 77, 170, 1) 50%);"
      dark
    >
      <v-list-item>
        <v-list-item-avatar>
          <img v-if="user" :src="gravatar">
          <img v-else src="https://www.gravatar.com/avatar/?d=mp">
        </v-list-item-avatar>
      </v-list-item>
      <v-list-item two-line>
        <v-list-item-content>
          <v-list-item-title v-if="userMeta" class="text-h6">
            {{ userMeta.name }}
          </v-list-item-title>
          <v-list-item-title v-else class="text-h6">
            Logged Out
          </v-list-item-title>
          <v-list-item-subtitle v-if="user">
            {{ user.email }}
          </v-list-item-subtitle>
          <v-list-item-subtitle v-if="isOrgMember">
            Institutional Account
          </v-list-item-subtitle>
          <v-list-item-subtitle v-if="!user">
            Log in for access to all features.
          </v-list-item-subtitle>
        </v-list-item-content>
      </v-list-item>
    </v-list>

    <v-divider v-if="user" />

    <v-list dense nav>
      <v-list-item-group
        color="primary"
      >
        <v-list-item
          v-for="item in items1"
          :to="item.link"
          nuxt
          exact
        >
          <v-list-item-icon>
            <v-icon>{{ item.icon }}</v-icon>
          </v-list-item-icon>

          <v-list-item-content>
            <v-list-item-title class="text-subtitle-2">
              {{ item.title }}
            </v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list-item-group>
      <v-divider v-if="user" class="my-2" />
      <v-list-item-group
        v-if="user"
        color="primary"
      >
        <v-list-item
          v-for="item in items2"
          :to="item.link"
          nuxt
          exact
        >
          <v-list-item-icon>
            <v-icon>{{ item.icon }}</v-icon>
          </v-list-item-icon>

          <v-list-item-content>
            <v-list-item-title class="text-subtitle-2">
              {{ item.title }}
            </v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list-item-group>

      <v-divider
        v-if="user && isAdmin"
        class="my-2"
      />
      <v-subheader v-if="user && isAdmin">
        DEV ONLY
      </v-subheader>

      <v-list-item-group
        v-if="user && isAdmin"
        color="primary"
      >
        <v-list-item
          v-for="item in devItems"
          :to="item.link"
          nuxt
          exact
        >
          <v-list-item-icon>
            <v-icon>{{ item.icon }}</v-icon>
          </v-list-item-icon>

          <v-list-item-content>
            <v-list-item-title class="text-subtitle-2">
              {{ item.title }}
            </v-list-item-title>
          </v-list-item-content>
        </v-list-item>
        <v-list-item @click="toggleDark()">
          <v-list-item-icon>
            <v-icon>
              mdi-theme-light-dark
            </v-icon>
          </v-list-item-icon>
          <v-list-item-content>
            <v-list-item-title class="text-subtitle-2">
              Toggle Dark Mode
            </v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list-item-group>

      <v-divider
        class="my-2"
      />

      <v-list-item v-if="user" nuxt active-class @click="dialog=true">
        <v-list-item-action>
          <v-icon>mdi-logout</v-icon>
        </v-list-item-action>
        <v-list-item-content>
          <v-list-item-title class="text-subtitle-2">
            Log Out
          </v-list-item-title>
        </v-list-item-content>
      </v-list-item>

      <v-list-item v-if="!user" nuxt active-class to="/login">
        <v-list-item-action>
          <v-icon>mdi-login</v-icon>
        </v-list-item-action>
        <v-list-item-content>
          <v-list-item-title class="text-subtitle-2">
            Log In
          </v-list-item-title>
        </v-list-item-content>
      </v-list-item>
    </v-list>
    <template #append>
      <v-list nav dense>
        <v-list-item-group color="primary">
          <v-list-item
            v-for="item in bottomItems"
            :to="item.link"
            nuxt
            exact
            style="min-height: 18px;"
          >
            <v-list-item-content>
              <v-list-item-title>
                {{ item.title }}
              </v-list-item-title>
            </v-list-item-content>
          </v-list-item>
        </v-list-item-group>
      </v-list>
    </template>

    <v-dialog
      v-model="dialog"
      max-width="400"
    >
      <v-card>
        <v-card-title>
          Are you sure you want to log out?
        </v-card-title>

        <v-card-actions>
          <v-spacer />

          <v-btn
            text
            @click="dialog = false"
          >
            Cancel
          </v-btn>
          <v-btn
            color="error"
            nuxt
            text
            @click="logout()"
          >
            Log Out
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-navigation-drawer>
</template>

<script>
import { mapGetters, mapMutations } from 'vuex'
import md5 from 'md5'
import { supabase } from '~/plugins/supabase'

export default {
    name: 'NavigationDrawer',
    data () {
        return {
            dialog: false,
            items1: [
                { title: 'Dashboard', icon: 'mdi-view-dashboard', link: '/dashboard' },
                { title: 'Create Request', icon: 'mdi-plus-circle', link: '/request/create' }
            ],
            items2: [
                { title: 'Messages', icon: 'mdi-message', link: '/messages' },
                { title: 'History', icon: 'mdi-history', link: '/request/history' },
                { title: 'Settings', icon: 'mdi-cog', link: '/settings' },
                { title: 'FAQ', icon: 'mdi-frequently-asked-questions', link: '/faq' },
                { title: 'Feedback & Support', icon: 'mdi-comment-quote', link: '/settings/feedback' }
            ],
            bottomItems: [
                { title: 'Brand Resources', link: '/brand-resources' },
                { title: 'Privacy Policy', link: '/privacy' },
                { title: 'Terms and Conditions', link: '/terms' }
            ],
            open: !(this.$vuetify.breakpoint.mobile)
        }
    },
    computed: {
        gravatar () {
            return `https://www.gravatar.com/avatar/${md5(this.user.email || '')}?d=mp`
        },
        ...mapGetters({
            isOrgMember: 'supabaseAuth/ownsAnOrganization',
            user: 'supabaseAuth/authUser',
            userMeta: 'supabaseAuth/authUserMeta',
            supabaseIsAuthenticated: 'supabaseAuth/isAuthenticated',
            isAdmin: 'supabaseAuth/isAdmin'
        }),
        devItems () {
            const items = [
                { title: 'Organizations', icon: 'mdi-domain', link: '/o' },
                { title: 'Unregistered Institution Requests', icon: 'mdi-domain', link: '/uri' }
            ]
            return items
        }
    },
    created () {
        this.$nuxt.$on('toggle-nav-drawer', this.toggle)
    },
    methods: {
        ...mapMutations({
            clearAuth: 'supabaseAuth/clear',
            clearCreate: 'supabaseCreate/reset'
        }),
        async logout () {
            try {
                this.clearAuth()
                this.clearCreate()
                const { error } = await supabase.auth.signOut()
                this.dialog = false
                if (error) {
                    throw error
                }
                // this.$router.replace('/login')
            } catch (error) {
                console.log(error)
            }
        },
        toggleDark () {
            this.$vuetify.theme.dark = !this.$vuetify.theme.dark
            localStorage.setItem('dark_theme', this.$vuetify.theme.dark.toString())
        },
        toggle () {
            this.open = !this.open
        }
    }
}
</script>

<style scoped>
.v-list-item__title, .v-list-item__subtitle {
  white-space: wrap;
}
.v-list-item--dense .v-list-item__content, .v-list--dense .v-list-item .v-list-item__content {
  padding: 4px 0;
}
</style>

<style>
@media print {
    nav {
      display: none!important;
    }
}
</style>
