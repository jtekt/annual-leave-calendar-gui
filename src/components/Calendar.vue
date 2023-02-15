<template>
  <div class="calendar">
    <div
      class="month"
      v-for="month in 12"
      :class="{
        ellapsed: current_month > month,
        current: current_month === month,
      }"
      :key="`month_${month}`"
    >
      <div class="month_header">{{ month }}月</div>

      <div class="entries_container">
        <router-link
          class="entry"
          :class="{ taken: entry.taken, refresh: entry.refresh }"
          v-for="entry in entries_of_month(month)"
          :key="entry._id"
          :to="{ name: 'entry', params: { id: entry._id } }"
        >
          {{ day_of_entry(entry) }}
          <span
            class="half_indicator"
            v-if="(entry.am && !entry.pm) || entry.type === '前半休'"
            >am</span
          >
          <span
            class="half_indicator"
            v-if="(entry.pm && !entry.am) || entry.type === '後半休'"
            >pm</span
          >
        </router-link>
      </div>
    </div>
  </div>
</template>

<script>
// @ is an alias to /src

export default {
  name: "Calendar",
  props: {
    entries: Array,
  },
  methods: {
    entries_of_month(month) {
      return this.entries.filter((entry) => {
        return new Date(entry.date).getMonth() + 1 === month
      })
    },
    day_of_entry(entry) {
      return new Date(entry.date).getDate()
    },
  },
  computed: {
    current_month() {
      return new Date().getMonth() + 1
    },
  },
}
</script>

<style scoped>
.calendar {
  display: flex;
  overflow-x: auto;
}

.month {
  flex-grow: 1;
  flex-shrink: 0;
  flex-basis: 50px;
  min-height: 50px;

  border: 1px solid #aaaaaa;
  border-radius: 5px;
  margin: 0.25em;
  padding: 0.25em;
  text-align: center;
}

.month.ellapsed {
  background-color: #eeeeee;
}
.month.current {
  border-color: #444444;
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
  padding: 0.25em;
  display: inline-flex;
  align-items: flex-start;
  border: 1px solid transparent;
  border-radius: 0.25em;
}

.month_header {
  text-align: left;
  color: #aaaaaa;
  font-size: 80%;
}

.entry.taken {
  color: #00c000;
}

.entry.refresh {
  border: 2px solid red;
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

.half_indicator {
  font-size: 75%;
  margin-left: 0.25em;
}
</style>
