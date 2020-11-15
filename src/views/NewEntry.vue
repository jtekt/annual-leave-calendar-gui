<template>
  <div class="new_entry">
    <h1>新しい予定</h1>

    <form class="" @submit.prevent="submit()">
      <input type="date" v-model="date">
      <input type="submit" :disabled="!date">
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
    }
  },
  methods: {
    submit(){
      const user_id = 'self'
      const url = `${process.env.VUE_APP_API_URL}/users/${user_id}/entries`
      const body = {date: this.date}
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

}

form > * {

}

input {
  font-size: 100%;
  padding: 0.5em;
  margin: 0.5em;
}

</style>
