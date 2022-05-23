<template>
  <v-card
    :loading="entries_loading">

    <h1 v-if="entries_loading">
      <Loader>Loading entries</loader>
    </h1>

    <template v-else>

      <v-container fluid>
        <v-row align="baseline">
          <v-col>
            <v-toolbar-title v-if="user">{{user.display_name}}さんの予定</v-toolbar-title>
            <v-toolbar-title v-else>ユーザー{{user_id}}の予定</v-toolbar-title>
          </v-col>
          <v-spacer />
          <v-col
            cols="auto">
            <v-select
              :items="Array.from(Array(50).keys()).map(x => x+2015)"
              v-model="year"
              label="Year"
            ></v-select>
          </v-col>
          <v-col
            cols="auto"
            v-if=" current_user_id === user_id || user_id === 'self' ">
            <v-btn
              :to="{ name: 'new_entry'}">
              <v-icon>mdi-plus</v-icon>
              <span class="ml-2">予定追加</span>
            </v-btn>
          </v-col>
        </v-row>
        
      </v-container>
      <v-divider/>

      <v-card-text>
        <p>
          <Total :entries="entries" />
        </p>

        <Calendar :entries="entries"/>
      </v-card-text>


      
    </template>


  </v-card>
</template>

<script>
// @ is an alias to /src
import Calendar from '@/components/Calendar.vue'
import Total from '@/components/Total.vue'
import IdUtils from '@/mixins/IdUtils.js'

export default {
  name: 'UserEntries',
  components: {
    Calendar,
    Total,
  },
  mixins: [IdUtils],
  data() {
    return {
      year: new Date().getYear() + 1900,
      entries: [],
      entries_loading: false,
      user: null,
      user_loading: false,
    }
  },
  mounted(){
    this.get_entries()
    this.get_user(this.user_id)
  },
  watch: {
    user_id(){
      this.get_entries()
      this.get_user(this.user_id)
    }
  },
  methods: {
    get_entries(){
      this.entries_loading = true
      const url = `${process.env.VUE_APP_API_URL}/users/${this.user_id}/entries`
      const params = {year: this.year}
      this.axios.get(url, {params})
      .then(response => {
        this.entries = []
        response.data.forEach((entry) => { this.entries.push(entry) })
      })
      .catch(error => {
        alert(`Failed to query items`)
        console.error(error)
       })
      .finally(() => {this.entries_loading = false})
    },
    entries_of_month(month){
      return this.entries.filter(entry => {
        // NOTE: month start at 0
        return new Date(entry.date).getMonth() + 1 === month
      })
    },
    day_of_entry(entry){
      return new Date(entry.date).getDate()
    },
    get_user(user_id){
      this.user_loading = true
      const url = `${process.env.VUE_APP_USER_MANAGER_API_URL}/v3/employees/${user_id}`
      this.axios.get(url)
      .then( ({data}) => { this.user = data })
      .catch(error => { console.error(error) })
      .finally(() => {this.user_loading = false})
    }
  },
  computed: {
    user_id(){
      return this.$route.params.id
    },
    total_yotei(){
      return this.entries.reduce( (total, entry) => {
        return  total + 0.5*entry.am + 0.5*entry.pm
      }, 0)
    },
    total_taken(){
      return this.entries.reduce( (total, entry) => {
        return  total + (0.5*entry.am + 0.5*entry.pm)*entry.taken
      }, 0)
    },
    current_month(){
      return new Date().getMonth() + 1
    }
  }
}
</script>
