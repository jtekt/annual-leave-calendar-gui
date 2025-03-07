<template>
  <div class="calendar">
    <div
      class="month"
      v-for="month in 12"
      :class="{
        ellapsed: current_month > month || current_year > year,
        current: current_month === month && current_year === year,
      }"
      :key="`month_${month}`"
    >
      <div class="month_header">{{ month }}月</div>

      <div class="entries_container">
        <router-link
          class="entry"
          :class="{ taken: passed_date(entry), refresh: entry.refresh }"
          :style="{
            color: passed_date(entry)
              ? colors.leaves.taken
              : colors.leaves.yotei,
            opacity: passed_date(entry) ? 1 : 1,
          }"
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
import { colors, notTakenOpacity } from "../config"

export default {
  name: "Calendar",
  props: {
    entries: Array,
  },
  data() {
    return {
      colors,
      notTakenOpacity,
    }
  },
  methods: {
    entries_of_month(month) {
      return this.entries.filter(({ date, type }) => {
        return (
          new Date(date).getMonth() + 1 === month &&
          ["有休", "前半休", "後半休"].includes(type)
        )
      })
    },
    day_of_entry(entry) {
      return new Date(entry.date).getDate()
    },
    passed_date(entry) {
      return new Date(entry.date) < new Date()
    },
  },
  computed: {
    current_month() {
      return new Date().getMonth() + 1
    },
    current_year() {
      return new Date().getFullYear()
    },
    year() {
      return Number(this.$route.query.year) || new Date().getFullYear()
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

.entry.refresh {
  border: 2px solid rgb(0, 119, 255);
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
