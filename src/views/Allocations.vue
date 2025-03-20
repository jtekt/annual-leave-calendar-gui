<template>
  <v-card :loading="allocations_loading">
    <template v-if="!allocations_loading">
      <v-container fluid>
        <v-row align="center">
          <v-col>
            <v-toolbar-title v-if="user">
              {{ user.display_name }}
            </v-toolbar-title>
            <v-toolbar-title v-else>{{ user_id }}</v-toolbar-title>
          </v-col>
          <v-spacer />
          <v-col>
            <v-select
              :items="
                Array.from(Array(10).keys()).map(
                  (x) => new Date().getFullYear() + x - 5
                )
              "
              v-model="year"
              :label="$t('Year')"
            />
          </v-col>
          <v-col
            cols="auto"
            v-if="current_user_id === user_id || user_id === 'self'"
          >
          </v-col>
          <v-col cols="auto">
            <CreateAllocation
              :user_id="user_id"
              :year="year"
              @createAllocation="get_entries(year)"
            />
          </v-col>
        </v-row>
      </v-container>
      <v-divider />

      <v-card-text>
        <v-simple-table>
          <template>
            <thead>
              <tr>
                <th>{{ $t("Type") }}</th>
                <th>{{ $t("Carried over") }}</th>
                <th>{{ $t("Current year grants") }}</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>{{ $t("Leaves") }}</td>
                <td>{{ allocations?.leaves?.carried_over }}</td>
                <td>
                  {{ allocations?.leaves?.current_year_grants }}
                </td>
              </tr>
              <tr>
                <td>{{ $t("Reserve") }}</td>
                <td>{{ allocations?.reserve?.carried_over }}</td>
                <td>
                  {{ allocations?.reserve?.current_year_grants }}
                </td>
              </tr>
            </tbody>
          </template>
        </v-simple-table>
      </v-card-text>
    </template>
  </v-card>
</template>

<script>
import IdUtils from "@/mixins/IdUtils.js"
import CreateAllocation from "../components/CreateAllocation.vue"

export default {
  name: "Allocations",
  mixins: [IdUtils],
  components: { CreateAllocation },
  data() {
    return {
      year: Number(this.$route.query.year) || new Date().getFullYear(),
      allocations_loading: false,
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
    get_entries() {
      this.entries_loading = true
      const url = `/v2/users/${this.user_id}/entries`
      const params = { year: this.year }
      this.axios
        .get(url, { params })
        .then(({ data }) => {
          this.allocations = data.allocations
        })
        .catch((error) => console.error(error))
        .finally(() => (this.entries_loading = false))
    },
  },
  computed: {
    user_id() {
      return (
        this.$store.state.current_user.properties._id || this.$route.params.id
      )
    },
  },
}
</script>
