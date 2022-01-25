<template>
  <div class="entry">

    <h1 v-if="entry_loading">
      <loader>Loading</loader>
    </h1>

    <template v-else-if="entry">

      <!-- date as header -->
      <h1>{{format_date(entry.date)}}</h1>

      <!-- user info -->
      <p v-if="user_loading">
        <Loader>Loading user info</loader>
      </p>
      <p v-else-if="user">
        <User :user="user" />
      </p>

      <p v-else>
        ユーザー: <router-link :to="{ name: 'user_entries', params: {id: entry.user_id} }">
          {{entry.user_id}}
        </router-link>
      </p>

      <p class="">
        <label>取得した: </label>
        <input
          type="checkbox"
          v-model="entry.taken"
          @change="update_entry()"
          :disabled="!editable">
      </p>

      <!--
      <p class="">
        <label>AM: </label>
        <input
          type="checkbox"
          v-model="entry.am"
          @change="update_entry()"
          :disabled="!editable">
      </p>
      <p class="">
        <label>PM: </label>
        <input
          type="checkbox"
          v-model="entry.pm"
          @change="update_entry()"
          :disabled="!editable">
      </p>
      -->

      <p>
        <select
          @change="update_entry()"
          v-model="entry.type">
          <option value="有休">有休 / All day</option>
          <option value="前半休">前半休 / Morning</option>
          <option value="後半休">後半休 / Afternoon</option>
        </select>
      </p>

      <p class="">
        <label>Refresh: </label>
        <input
          type="checkbox"
          v-model="entry.refresh"
          @change="update_entry()"
          :disabled="!editable">
      </p>



      <p class="">
        <button
          type="button"
          @click="delete_entry()"
          v-if="editable">
          <delete-icon/>
          <span>予定削除</span>
        </button>
      </p>
    </template>





  </div>
</template>

<script>
// @ is an alias to /src
import User from '@/components/User.vue'
import IdUtils from '@/mixins/IdUtils.js'

export default {
  name: 'Entry',
  components: {
    User
  },
  mixins: [IdUtils],
  data() {
    return {
      entry: null,
      entry_loading: false,
      user: null,
      user_loading: false,
    }
  },
  mounted(){
    this.get_entry()

  },
  methods: {
    get_entry(){
      this.entry_loading = true
      const entry_id = this.$route.params.id
      const url = `${process.env.VUE_APP_API_URL}/entries/${entry_id}`
      this.axios.get(url)
      .then(response => {
        this.entry = response.data
        this.get_user(this.entry.user_id)
      })
      .catch(error => {
        alert(`Error while getting the entry`)
        console.error(error)
      })
      .finally( () => {this.entry_loading = false})
    },
    get_user(user_id){
      this.user_loading = true
      const url = `${process.env.VUE_APP_USER_MANAGER_API_URL}/v3/employees/${user_id}`
      this.axios.get(url)
      .then( ({data}) => {
        this.user = data
      })
      .catch(error => {
        console.error(error)
      })
      .finally( () => {this.user_loading = false})
    },
    update_entry(){
      const entry_id = this.entry._id
      const url = `${process.env.VUE_APP_API_URL}/entries/${entry_id}`
      this.axios.put(url, this.entry)
      .then(() => {})
      .catch(error => {
        console.error(error)
        alert(`Error while updating the entry`)
      })
    },
    format_date(date){
      const options = {year: '2-digit', month: '2-digit', day: '2-digit' };
      return new Date(date).toLocaleString('ja-JP', options)
    },
    delete_entry(){
      if(!confirm('ホンマに？')) return
      const entry_id = this.entry._id
      const url = `${process.env.VUE_APP_API_URL}/entries/${entry_id}`
      this.axios.delete(url)
      .then(() => {
        this.$router.push({name: 'user_entries', params: {id: this.entry.user_id}})
      })
      .catch(error => {
        alert(`Error while deleting the entry`)
        console.error(error)
      })
    },
  },
  computed:{
    editable(){
      const user_id = this.entry.user_id.toString()
      return user_id === this.current_user_id
    }
  },
}
</script>

<style scoped>
.entry{
  text-align: center;
}
</style>
