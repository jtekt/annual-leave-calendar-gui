<template>
  <v-card>
    <h1>予定追加</h1>

    <form class="" @submit.prevent="submit()">
      <input type="date" v-model="date">

      <!--
      <div class="">
        <label>AM</label>
        <input type="checkbox" v-model="am">
      </div>
      <div class="">
        <label>PM</label>
        <input type="checkbox" v-model="pm">
      </div>
      -->

      <select v-model="type">
        <option value="有休">有休 / All day</option>
        <option value="前半休">前半休 / Morning</option>
        <option value="後半休">後半休 / Afternoon</option>
      </select>

      <input type="submit" :disabled="submit_disabled">
    </form>





  </v-card>
</template>

<script>
// @ is an alias to /src

export default {
  name: 'Entry',
  components: {

  },
  data() {
    return {
      date: null,
      type: "有休",
    }
  },
  methods: {
    submit(){
      const user_id = 'self'
      const url = `${process.env.VUE_APP_API_URL}/users/${user_id}/entries`
      const body = {
        date: this.date,
        type: this.type,
      }
      this.axios.post(url,body)
      .then(response => { this.$router.push({name: 'entry', params: {id: response.data._id}}) })
      .catch(error => {
        if(!error.response) {
          alert(`Error while creating 予定`)
          console.error(error)
          return
        }

        alert(error.response.data)

      })
    }
  },
  computed: {
    submit_disabled(){
      return !this.date
    },
  }
}
</script>

<style scoped>
.new_entry {
  text-align: center;
}

h1 {

}

form {
  display: flex;
  flex-direction: column;
  align-items: center;
}

form > * {

}

input {
  font-size: 100%;
  padding: 0.5em;
  margin: 0.5em;
}

</style>
