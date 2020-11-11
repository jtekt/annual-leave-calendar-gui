<template>
  <div class="calendar">

    <div
      class="month"
      v-for="month in 12"
      :class="{ellapsed: current_month > month, current: current_month === month}"
      :key="`month_${month}`">

      <div class="month_header">
        {{month}}月
      </div>

      <div class="entries_container">
        <router-link
          class="entry"
          :class="{taken: entry.taken}"
          v-for="entry in entries_of_month(month)"
          :key="entry._id"
          :to="{ name: 'entry', params: {id: entry._id} }">
          {{day_of_entry(entry)}}
          <span v-if="entry.am && !entry.pm">AM</span>
          <span v-if="entry.pm && !entry.am">PM</span>
        </router-link>
      </div>

    </div>

    <div class="total">
      <div class="">
        Total
      </div>
      <div class="">
         {{total_taken}} / {{total_yotei}}
      </div>


    </div>

  </div>
</template>

<script>
// @ is an alias to /src

export default {
  name: 'Calendar',
  props: {
    entries: Array
  },
  methods: {

    entries_of_month(month){
      return this.entries.filter(entry => {
        return new Date(entry.date).getMonth() + 1 === month
      })
    },
    day_of_entry(entry){
      return new Date(entry.date).getDate()
    },
  },
  computed: {

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

<style scoped>
.calendar {
  display: flex;
}

.month {
  flex-grow: 1;
  flex-shrink: 0;
  flex-basis: 0;

  border: 1px solid #444444;
  border-radius: 5px;
  margin: 0.25em;
  padding: 0.25em;
  text-align: center;
}

.month.ellapsed {
  background-color: #eeeeee;
}
.month.current {
  background-color: #ffdddd;
}

.entries_container {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.entry {
  text-decoration: none;
  color: #c00000;
  font-weight: bold;
  padding: 0.1em;
}

.entry:hover {
  text-decoration: underline;
}

.month_header {
  color: #444444;
}

.entry.taken {
  color: #00c000;
}

.total {
  border: 1px solid #444444;
  margin: 0.25em;
  padding: 0.25em;
  flex-grow: 1;
  flex-shrink: 0;
  flex-basis: 0;
  background-color: #ddddff;
  text-align: center;
}
</style>
