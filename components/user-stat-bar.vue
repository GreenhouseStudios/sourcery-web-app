<template>
  <div class="user-stat-bar mb-6">
    <v-card class="pt-1 pb-1 pr-3 pl-2">
      <v-card-text>
        <div class="user-stat-bar-row d-flex align-stretch flex-wrap flex-md-nowrap">
          <div v-for="label in labels" :key="`l-${label.key}`" class="split-border text-center user-stat-bar-stat pl-4 pr-4">
            <p class="mb-1 stat-label">
              {{ label.name }}
            </p>
            <div class="align-center-row d-flex flex-column justify-center pt-1 pb-1">
              <span class="stat-large">{{ stats[label.key] }}</span>
            </div>
          </div>
        </div>
      </v-card-text>
    </v-card>
  </div>
</template>

<script>
export default {
    props: {
        newCount: {
            type: Number,
            default: 0
        },
        progressCount: {
            type: Number,
            default: 0
        },
        completedCount: {
            type: Number,
            default: 0
        }
    },
    data () {
        return {
            labels: [
                {
                    name: 'New',
                    key: 'new'
                },
                {
                    name: 'In-Progress',
                    key: 'progress'
                },
                {
                    name: 'Completed',
                    key: 'completed'
                }
            ]
        }
    },
    computed: {
        stats () {
            return {
                new: this.newCount,
                progress: this.progressCount,
                completed: this.completedCount
            }
        }
    }
}
</script>

  <style scoped>
  .user-stat-bar-stat {
      width: 100%;
  }

  .align-center-row {
      height: 80%;
  }

  .stat-large {
      font-size: 2.6em;
      font-weight: bold;
      line-height: 1.1;
  }

  .split-border:nth-child(even) {
      border-left: 2px solid rgba(255, 255, 255, 0.7);
  }
  </style>

  <style lang="scss" scoped>
  @import '~vuetify/src/styles/settings/_variables';

  @media #{map-get($display-breakpoints, 'sm-and-down')} {
      .user-stat-bar-stat {
          width: 50%;
          margin-bottom: 16px;
      }
  }

  @media #{map-get($display-breakpoints, 'md-and-up')} {
      .split-border:not(:first-child) {
          border-left: 2px solid rgba(255, 255, 255, 0.7);
      }
  }
  </style>

  <style>
  .theme--light.v-card .split-border {
      border-color: black;
  }

  .theme--light .stat-large, .theme--light .stat-label {
      color: var(--sourcery-500);
  }
  </style>
