<template>
  <v-card>
    <template>
      <v-container fluid>
        <v-row align="baseline">
          <v-col>
            <v-toolbar-title v-if="group">{{
              group.properties.name
            }}</v-toolbar-title>
            <v-toolbar-title v-else>{{ group_id }}</v-toolbar-title>
          </v-col>
          <v-col cols="auto"> ({{ total }}人) </v-col>
          <v-spacer />
          <v-col cols="auto">
            <v-select
              :items="
                Array.from(Array(10).keys()).map(
                  (x) => new Date().getFullYear() + x - 5
                )
              "
              v-model="year"
              label="Year"
            />
          </v-col>
          <v-col cols="auto">
            <ExcelExportButton :group_id="this.group_id" :year="this.year" />
          </v-col>
        </v-row>
      </v-container>
      <v-divider />

      <v-card-text>
        <div
          class="user_calendar_wrapper"
          v-for="(item, index) in items"
          :key="`user_${index}`"
        >
          <!-- top: user and total -->
          <div class="user_wrapper">
            <User :user="item.user" />
            <span class="spacer" />
            <Total :entries="item.entries" />
          </div>

          <!-- bottom: calendar view -->
          <Calendar :entries="item.entries" />
        </div>
        <infinite-loading :identifier="year" @infinite="get_entries">
          <span slot="no-more"></span>
          <span slot="no-results"></span>
        </infinite-loading>
      </v-card-text>
    </template>
  </v-card>
</template>

<script>
// @ is an alias to /src
import Calendar from "@/components/Calendar.vue"
import User from "@/components/User.vue"
import Total from "@/components/Total.vue"
import ExcelExportButton from "@/components/ExcelExportButton.vue"
import InfiniteLoading from "vue-infinite-loading"

export default {
  name: "GroupEntries",
  components: {
    Calendar,
    User,
    Total,
    ExcelExportButton,
    InfiniteLoading,
  },
  data() {
    return {
      year: Number(this.$route.query.year) || new Date().getFullYear(),
      items: [],
      total: 0,
      group: null,
      group_loading: false,
      loading: false,
    }
  },
  mounted() {
    this.get_group()
  },
  watch: {
    group_id() {
      this.reset()
    },
    year(newVal) {
      this.$router.replace({ query: { ...this.$route.query, year: newVal } })
      this.reset()
    },
  },
  methods: {
    reset() {
      this.items = []
      this.total = 0
    },
    get_group() {
      const url = `${process.env.VUE_APP_GROUP_MANAGER_API_URL}/groups/${this.group_id}`
      this.axios
        .get(url)
        .then((response) => {
          this.group = response.data
        })
        .catch((error) => {
          if (error.response) console.error(error.response.data)
          else console.error(error)
        })
    },
    get_entries($state) {
      const url = `/groups/${this.group_id}/entries`
      const params = { year: this.year, limit: 10, skip: this.items.length }

      this.axios
        .get(url, { params })
        .then(({ data }) => {
          this.items = this.items.concat(data.items)
          this.total = data.total

          if (this.items.length < this.total) {
            $state.loaded()
          } else {
            $state.complete()
          }
        })
        .catch((error) => {
          console.error(error)
          $state.complete()
        })
    },
  },
  computed: {
    group_id() {
      return this.$route.params.id
    },
  },
}
</script>

<style scoped>
.user_calendar_wrapper {
  margin: 1em 0;
  padding: 1em 0;
}

.user_calendar_wrapper:not(:last-child) {
  border-bottom: 1px solid #dddddd;
}

.user_calendar_wrapper > .user_wrapper {
  display: flex;
  align-items: center;
  flex-basis: 150px;
  flex-grow: 1;
  flex-shrink: 0;

  text-align: left;

  padding: 0.25em;
}

.spacer {
  flex-grow: 1;
}

.user_calendar_wrapper > .calendar {
  margin-top: 0.5em;
  flex-grow: 1;
}
</style>
