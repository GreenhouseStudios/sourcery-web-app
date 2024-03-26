<template>
  <v-list-item class="repository-list-item" two-line :input-value="selected" :disabled="disabled" @click="selectRepository">
    <v-list-item-content>
      <v-list-item-title>
        {{ titleText }}
      </v-list-item-title>
      <v-list-item-subtitle>
        {{ subText }}
      </v-list-item-subtitle>
    </v-list-item-content>
  </v-list-item>
</template>

<script>
export default {
    props: {
        repository: {
            type: Object,
            required: true,
            default: () => {}
        }
    },
    data () {
        return {
            selected: false,
            shortlistDisabled: ['unt']
        }
    },
    computed: {
        titleText () {
            return this.repository?.organization?.name
        },
        subText () {
            return this.repository?.name
        },
        disabled () {
            return this.shortlistDisabled.includes(this.repository?.organization?.slug)
        }
    },
    created () {
        this.$nuxt.$on('repositoryListItemSelected', (id) => {
            if (id !== this.repository.id) {
                this.selected = false
            }
        })
    },
    methods: {
        selectRepository () {
            this.selected = true
            this.$emit('selected', this.repository)
            this.$nuxt.$emit('repositoryListItemSelected', this.repository.id)
        }
    }
}
</script>

<style lang="scss">
.theme--light {
    .repository-list-item.v-list-item--active {
        color: white;
        background-color: rgba(101, 78, 163, 1);
        .v-list-item__subtitle {
            color: white;
        }
    }
}

.repository-list-item.v-list-item {
    border-radius: 5px;
}

.repository-list-item.v-list-item--active {
    background-color: rgba(101, 78, 163, .62);
}

.repository-list-item.v-list-item::before {
    opacity: 0;
}
</style>
