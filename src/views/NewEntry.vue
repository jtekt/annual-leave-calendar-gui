<template>
  <v-card max-width="30rem" class="mx-auto" :loading="entries_loading">
    <v-card-title>
      {{ $t("Create entry") }}
    </v-card-title>
    <v-divider />

    <v-card-text>
      <v-form @submit.prevent="submit()">
        <v-row>
          <v-col>
            <v-date-picker
              color="black"
              elevation="1"
              v-model="date"
              :events="entries"
              event-color="primary"
            />
          </v-col>
        </v-row>
        <v-row>
          <v-col>
            <v-select :items="types" v-model="type" :label="$t('Type')" />
          </v-col>
        </v-row>
        <v-row>
          <v-col>
            <v-checkbox :label="$t('Reserve')" v-model="reserve" />
          </v-col>
        </v-row>
        <v-row>
          <v-col>
            <v-btn
              :disabled="submit_disabled"
              type="submit"
              :loading="allocations_loading"
            >
              <v-icon>mdi-plus</v-icon>
              <span class="ml-2">{{ $t("Create entry") }}</span>
            </v-btn>
          </v-col>
        </v-row>
      </v-form>
    </v-card-text>
  </v-card>
</template>

<script>
export default {
  name: "Entry",
  components: {},
  data() {
    return {
      date: null,
      type: "有休",
      entries: [],
      entries_loading: false,
      reserve: false,
      allocations_loading: false,
      allocations: null,
    }
  },
  mounted() {
    this.get_entries()
  },
  methods: {
    get_entries() {
      this.entries_loading = true
      const url = `/users/self/entries`
      const params = { year: this.year }
      this.axios
        .get(url, { params })
        .then(({ data }) => {
          this.entries = data.map((e) =>
            new Date(e.date).toISOString().substr(0, 10)
          )
        })
        .catch((error) => {
          alert(`Failed to query items`)
          console.error(error)
        })
        .finally(() => {
          this.entries_loading = false
        })
    },
    submit() {
      const url = `/users/self/entries`
      const body = {
        date: this.date,
        type: this.type,
      }
      this.create_allocations()
      this.axios
        .post(url, body)
        .then((response) => {
          this.$router.push({
            name: "entry",
            params: { id: response.data._id },
          })
        })
        .catch((error) => {
          if (!error.response) {
            alert(`Error while creating 予定`)
            console.error(error)
            return
          }

          alert(error.response.data)
        })
    },
    create_allocations() {
      this.allocations_loading = true
      const entries_url = `/v2/users/${this.user_id}/entries`
      this.axios
        .get(entries_url)
        .then(({ data }) => (this.allocations = data.allocations))
        .catch((error) => console.error(error))
        .finally(() => (this.loading = false))
      console.log(this.allocations)
      if (!this.allocations) return
      const allocations_url = `/v1/users/${this.user_id}/allocations`
      this.axios
        .post(allocations_url, this.allocations)
        .catch((error) => {
          console.error(error)
        })
        .finally(() => {
          this.allocations_loading = false
        })
    },
  },
  computed: {
    submit_disabled() {
      return !this.date
    },
    types() {
      return [
        { text: this.$t("All day"), value: "有休" },
        { text: this.$t("Morning"), value: "前半休" },
        { text: this.$t("Afternoon"), value: "後半休" },
      ]
    },
  },
}
</script>

<style scoped>
.new_entry {
  text-align: center;
}

form {
  display: flex;
  flex-direction: column;
  align-items: center;
}

input {
  font-size: 100%;
  padding: 0.5em;
  margin: 0.5em;
}
</style>
