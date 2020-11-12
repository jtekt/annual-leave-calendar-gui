<template>
  <div class="entry">



    <template v-if="entry">

      <h1>{{format_date(entry.date)}}</h1>

      <p v-if="user">
        ユーザー: <User :user="user" />
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
        <label>Refresh: </label>
        <input
          type="checkbox"
          v-model="entry.refresh"
          @change="update_entry()">
      </p>



      <p class="">
        <button type="button" @click="delete_entry()">
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
export default {
  name: 'Entry',
  components: {
    User
  },
  data() {
    return {
      entry: null,
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
        alert(`Error while getting the entry`)
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

      var options = {year: '2-digit', month: '2-digit', day: '2-digit' };
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
  }
}
</script>

<style scoped>
.entry{
  text-align: center;
}
</style>
