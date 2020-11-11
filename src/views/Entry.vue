<template>
  <div class="entry">
    <h1>Entry</h1>

    <p class="">
      <input
        type="date"
        v-model="entry.date"
        @change="update_entry()">
    </p>

    <div class="" v-if="user">
      <span>User: </span><User :user="user" />
    </div>

    <p class="">
      <label>取った: </label>
      <input
        type="checkbox"
        v-model="entry.taken"
        @change="update_entry()">
    </p>

    <p class="">
      <label>Refresh: </label>
      <input
        type="checkbox"
        v-model="entry.refresh"
        @change="update_entry()">
    </p>

    <p class="">
      <label>AM: </label>
      <input
        type="checkbox"
        v-model="entry.am"
        @change="update_entry()">
    </p>
    <p class="">
      <label>PM: </label>
      <input
        type="checkbox"
        v-model="entry.pm"
        @change="update_entry()">
    </p>



    <p class="">
      <button type="button" @click="delete_entry()">
        delete
      </button>
    </p>



  </div>
</template>

<script>
// @ is an alias to /src
import User from '@/components/User.vue'
export default {
  name: 'Entry',
  components: {
    User
  },
  data() {
    return {
      entry: {},
      user: null
    }
  },
  mounted(){
    this.get_entry()

  },
  methods: {
    get_entry(){
      const entry_id = this.$route.params.id
      const url = `${process.env.VUE_APP_API_URL}/entries/${entry_id}`
      this.axios.get(url)
      .then(response => {
        this.entry = response.data
        this.get_user(this.entry.user_id)
      })
      .catch(error => {
        console.error(error)
      })
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
    },
    update_entry(){
      const entry_id = this.$route.params.id
      const url = `${process.env.VUE_APP_API_URL}/entries/${entry_id}`
      this.axios.put(url, this.entry)
      .then(() => {})
      .catch(error => {
        console.error(error)
      })
    },
    delete_entry(){
      const entry_id = this.$route.params.id
      const url = `${process.env.VUE_APP_API_URL}/entries/${entry_id}`
      this.axios.delete(url)
      .then(() => {
        this.$router.push({name: 'user_entries', params: {id: 'self'}})
      })
      .catch(error => {
        console.error(error)
      })
    },
  }
}
</script>

<style scoped>
.entry{
  text-align: center;
}
</style>
