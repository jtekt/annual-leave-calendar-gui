<template>
  <div class="about">

    <h1 v-if="user">{{user.properties.display_name}}の予定</h1>
    <h1 v-else>Entries of {{user_id}}</h1>

    <p>
      <router-link :to="{ name: 'new_entry'}">
        新しい予定
      </router-link>
    </p>

    <Calendar :entries="entries"/>


  </div>
</template>

<script>
// @ is an alias to /src
import Calendar from '@/components/Calendar.vue'

export default {
  name: 'UserEntries',
  components: {
    Calendar,
  },
  data() {
    return {
      entries: [],
      user: null,
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
      const url = `${process.env.VUE_APP_API_URL}/users/${this.user_id}/entries`
      this.axios.get(url)
      .then(response => {
        this.entries = []
        response.data.forEach((entry) => {
          this.entries.push(entry)
        })

      })
      .catch(error => {
        console.error(error)
      })
    },
    entries_of_month(month){
      return this.entries.filter(entry => {
        return new Date(entry.date).getMonth() + 1 === month
      })
    },
    day_of_entry(entry){
      return new Date(entry.date).getDate()
    },
    get_user(user_id){
      const url = `${process.env.VUE_APP_USER_MANAGER_API_URL}/employees/${user_id}`
      this.axios.get(url)
      .then(response => {
        const record = response.data[0]
        this.user = record._fields[record._fieldLookup.employee]
      })
      .catch(error => {
        console.error(error)
      })
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
