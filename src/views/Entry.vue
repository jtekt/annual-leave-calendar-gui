<template>
  <v-card max-width="30rem" class="mx-auto" :loading="entry_loading">
    <template v-if="entry">
      <v-container fluid>
        <v-row align="baseline">
          <v-col>
            <v-toolbar-title>{{ format_date(entry.date) }}</v-toolbar-title>
          </v-col>
          <v-spacer />

          <v-col cols="auto" v-if="editable">
            <v-btn color="#c00000" dark @click="delete_entry()">
              <v-icon>mdi-delete</v-icon>
              <span class="ml-2">予定削除</span>
            </v-btn>
          </v-col>
        </v-row>
      </v-container>
      <v-divider />

      <v-card-text>
        <!-- user info -->

        <v-row align="baseline">
          <v-col cols="auto"> User: </v-col>
          <v-col>
            <Loader v-if="user_loading">Loading user info</Loader>
            <User v-else-if="user" :user="user" />
            <router-link
              v-else
              :to="{ name: 'user_entries', params: { id: entry.user_id } }"
            >
              {{ entry.user_id }}
            </router-link>
          </v-col>
        </v-row>

        <p class="">
          <v-checkbox
            :label="$t('Taken')"
            :disabled="!editable"
            v-model="entry.taken"
            @change="update_entry()"
          />
        </p>

        <p>
          <v-select
            :disabled="!editable"
            :items="types"
            v-model="entry.type"
            :label="$t('Type')"
            @change="update_entry()"
          />
        </p>

        <p class="">
          <v-checkbox
            label="Refresh"
            :disabled="!editable"
            v-model="entry.refresh"
            @change="update_entry()"
          />
        </p>
      </v-card-text>
    </template>

    <v-snackbar v-model="snackbar.show" :color="snackbar.color">
      {{ snackbar.message }}
    </v-snackbar>
  </v-card>
</template>

<script>
// @ is an alias to /src
import User from "@/components/User.vue"
import IdUtils from "@/mixins/IdUtils.js"

export default {
  name: "Entry",
  components: {
    User,
  },
  mixins: [IdUtils],
  data() {
    return {
      entry: null,
      entry_loading: false,
      user: null,
      user_loading: false,
      snackbar: {
        show: false,
        message: null,
        color: "red",
      },
    }
  },
  mounted() {
    this.get_entry()
  },
  methods: {
    get_entry() {
      this.entry_loading = true
      const entry_id = this.$route.params.id
      const url = `/entries/${entry_id}`
      this.axios
        .get(url)
        .then((response) => {
          this.entry = response.data
          this.get_user(this.entry.user_id)
        })
        .catch((error) => {
          alert(`Error while getting the entry`)
          console.error(error)
        })
        .finally(() => {
          this.entry_loading = false
        })
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
    update_entry() {
      this.entry_loading = true
      const entry_id = this.entry._id
      const url = `/entries/${entry_id}`
      this.axios
        .put(url, this.entry)
        .then(() => {
          this.snackbar.show = true
          this.snackbar.message = "Entry saved"
          this.snackbar.color = "green"
        })
        .catch((error) => {
          console.error(error)
          alert(`Error while updating the entry`)
        })
        .finally(() => {
          this.entry_loading = false
        })
    },
    format_date(date) {
      const options = { year: "2-digit", month: "2-digit", day: "2-digit" }
      return new Date(date).toLocaleString("ja-JP", options)
    },
    delete_entry() {
      if (!confirm("ホンマに？")) return
      const entry_id = this.entry._id
      const url = `/entries/${entry_id}`
      this.axios
        .delete(url)
        .then(() => {
          this.$router.push({
            name: "user_entries",
            params: { id: this.entry.user_id },
          })
        })
        .catch((error) => {
          alert(`Error while deleting the entry`)
          console.error(error)
        })
    },
  },
  computed: {
    editable() {
      const user_id = this.entry.user_id.toString()
      return user_id === this.current_user_id
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
.entry {
  text-align: center;
}
</style>
