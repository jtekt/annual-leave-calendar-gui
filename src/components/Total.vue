<template>
  <div class="totalBar">
    <template v-if="allocations">
      <v-tooltip top color="rgba(79, 195, 247)">
        <template v-slot:activator="{ on, attrs }">
          <div
            v-bind="attrs"
            v-on="on"
            class="carriedOver allocationBar"
            :style="{ width: `${carriedOverPercent}%` }"
          >
            {{ allocations.leaves.carried_over }}
          </div>
        </template>
        <span> 繰越日数 </span>
      </v-tooltip>

      <v-tooltip top color="rgba(3, 155, 229)">
        <template v-slot:activator="{ on, attrs }">
          <div
            v-bind="attrs"
            v-on="on"
            class="currentYear allocationBar"
            :style="{ width: `${100 - carriedOverPercent}%` }"
          >
            {{ allocations.leaves.current_year_grants }}
          </div>
        </template>
        <span> 当年度付与日数 </span>
      </v-tooltip>
    </template>

    <v-tooltip bottom color="#00c000">
      <template v-slot:activator="{ on, attrs }">
        <div
          v-bind="attrs"
          v-on="on"
          class="taken leavesBar"
          :style="{ width: `${takenPercent}%` }"
        >
          {{ total_taken }}
        </div>
      </template>
      <span> 当年度取得日数 </span>
    </v-tooltip>

    <v-tooltip bottom color="#91b691">
      <template v-slot:activator="{ on, attrs }">
        <div
          v-bind="attrs"
          v-on="on"
          class="yotei leavesBar"
          :style="{
            width: `${yoteiPercent}%`,
            left: `${takenPercent}%`,
          }"
        >
          {{ total_yotei }}
        </div>
      </template>
      <span> 当年度予定日数 </span>
    </v-tooltip>
  </div>
</template>

<script>
export default {
  name: "Total",
  components: {},
  props: {
    entries: Array,
    allocations: Object,
  },
  computed: {
    total_yotei() {
      return this.entries.reduce((total, { type, date }) => {
        if (new Date(date) > new Date()) {
          if (type === "有休") return total + 1
          else if (type === "前半休" || type === "後半休") return total + 0.5
          else return total
        } else return total
      }, 0)
    },
    total_taken() {
      return this.entries.reduce((total, { type, date }) => {
        if (new Date(date) < new Date()) {
          if (type === "有休") return total + 1
          else if (type === "前半休" || type === "後半休") return total + 0.5
          else return total
        } else return total
      }, 0)
    },
    carriedOverPercent() {
      return (
        (this.allocations.leaves.carried_over /
          (this.allocations.leaves.current_year_grants +
            this.allocations.leaves.current_year_grants)) *
        100
      )
    },
    takenPercent() {
      if (this.allocations)
        return (
          (this.total_taken /
            (this.allocations.leaves.carried_over +
              this.allocations.leaves.current_year_grants)) *
          100
        )
      else
        return (this.total_taken / (this.total_yotei + this.total_taken)) * 100
    },
    yoteiPercent() {
      if (this.allocations)
        return (
          (this.total_yotei /
            (this.allocations.leaves.carried_over +
              this.allocations.leaves.current_year_grants)) *
          100
        )
      else
        return (this.total_yotei / (this.total_yotei + this.total_taken)) * 100
    },
  },
}
</script>

<style scoped>
.totalBar {
  display: flex;
  position: relative;
  height: auto;
  color: white;
}

.allocationBar {
  position: absolute;
  top: 0;
  bottom: 0;
  text-align: center;
  overflow: hidden;
}

.carriedOver {
  left: 0;
  background-color: rgba(79, 195, 247);
}

.currentYear {
  right: 0;
  background-color: rgba(3, 155, 229);
}

.leavesBar {
  position: absolute;
  top: 50%;
  bottom: 0;
  text-align: center;
  overflow: hidden;
}
.taken {
  left: 0;
  background-color: #00c000dd;
}

.yotei {
  background-color: #91b691dd;
}
</style>
