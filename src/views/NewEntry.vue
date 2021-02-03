<template>
  <div class="new_entry">
    <h1>予定追加</h1>

    <form class="" @submit.prevent="submit()">
      <input type="date" v-model="date">

      <div class="">
        <label>AM</label>
        <input type="checkbox" v-model="am">
      </div>
      <div class="">
        <label>PM</label>
        <input type="checkbox" v-model="pm">
      </div>

      <input type="submit" :disabled="submit_disabled">
    </form>





  </div>
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
      am: true,
      pm: true,
    }
  },
  methods: {
    submit(){
      const user_id = 'self'
      const url = `${process.env.VUE_APP_API_URL}/users/${user_id}/entries`
      const body = {
        date: this.date,
        am: this.am,
        pm: this.pm,
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
      return !this.date || (!this.am && !this.pm)
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
