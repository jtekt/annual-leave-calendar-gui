<template>
  <v-card
    max-width="30rem"
    class="mx-auto">

    <v-card-title>
      {{ $t('Create entry') }}
    </v-card-title>
    <v-divider />

    <v-card-text>
      <v-form @submit.prevent="submit()">
        <v-row>
          <v-col>
            <v-date-picker 
              elevation="1"
              v-model="date" />
          </v-col>
        </v-row>
        <v-row>
          <v-col>
            <v-select
              :items="types"
              v-model="type"
              :label="$t('Type')" />
          </v-col>
        </v-row>
        <v-row>
          <v-col>
            <v-btn 
              :disabled="submit_disabled"
              type="submit">
              <v-icon>mdi-plus</v-icon>
              <span class="ml-2">{{$t('Create entry')}}</span>
            </v-btn>
          </v-col>
        </v-row>
      </v-form>
    </v-card-text>

    

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
    types(){
      return [
        {text: this.$t('All day'), value: '有休'},
        {text: this.$t('Morning'), value: '前半休'},
        {text: this.$t('Afternoon'), value: '後半休',}
      ]
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
