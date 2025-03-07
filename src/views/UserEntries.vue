<template>
  <v-card :loading="entries_loading">
    <template v-if="!entries_loading">
      <v-container fluid>
        <v-row align="baseline">
          <v-col>
            <v-toolbar-title v-if="user">
              {{ user.display_name }}
            </v-toolbar-title>
            <v-toolbar-title v-else>{{ user_id }}</v-toolbar-title>
          </v-col>
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
          <v-col
            cols="auto"
            v-if="current_user_id === user_id || user_id === 'self'"
          >
            <v-btn :to="{ name: 'new_entry' }" color="primary">
              <v-icon left>mdi-plus</v-icon>
              <span>{{ $t("Create entry") }}</span>
            </v-btn>
          </v-col>
        </v-row>
      </v-container>
      <v-divider />

      <v-card-text>
        <p>
          <Total :entries="entries" :allocations="allocations" />
        </p>

        <Calendar :entries="entries" />
      </v-card-text>
    </template>
  </v-card>
</template>

<script>
// @ is an alias to /src
import Calendar from "@/components/Calendar.vue"
import Total from "@/components/Total.vue"
import IdUtils from "@/mixins/IdUtils.js"

export default {
  name: "UserEntries",
  components: {
    Calendar,
    Total,
  },
  mixins: [IdUtils],
  data() {
    return {
      year: Number(this.$route.query.year) || new Date().getFullYear(),
      entries: [],
      entries_loading: false,
      user: null,
      user_loading: false,
      allocations: null,
    }
  },
  mounted() {
    this.get_entries()
    this.get_user(this.user_id)
  },
  watch: {
    user_id() {
      this.get_entries()
      this.get_user(this.user_id)
    },
    year(newVal) {
      this.$router.replace({ query: { ...this.$route.query, year: newVal } })
      this.get_entries()
    },
  },
  methods: {
    get_entries() {
      this.entries_loading = true
      const url = `/v2/users/${this.user_id}/entries`
      const params = { year: this.year }
      this.axios
        .get(url, { params })
        .then(({ data }) => {
          this.allocations = data.allocations
          this.entries = data.entries
        })
        .catch((error) => {
          alert(`Failed to query items`)
          console.error(error)
        })
        .finally(() => {
          this.entries_loading = false
        })
    },

    entries_of_month(month) {
      return this.entries.filter((entry) => {
        // NOTE: month start at 0
        return new Date(entry.date).getMonth() + 1 === month
      })
    },
    day_of_entry(entry) {
      return new Date(entry.date).getDate()
    },
    get_user(user_id) {
      this.user_loading = true
      const url = `${process.env.VUE_APP_USER_MANAGER_API_URL}/v3/employees/${user_id}`
      this.axios
        .get(url)
        .then(({ data }) => {
          this.user = data
        })
        .catch((error) => {
          console.error(error)
        })
        .finally(() => {
          this.user_loading = false
        })
    },
  },
  computed: {
    user_id() {
      return this.$route.params.id
    },
  },
}
</script>
