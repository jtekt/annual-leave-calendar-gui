<template>
  <div class="total">
    <template
      v-if="allocations?.current_year_grants || allocations?.carried_over"
    >
      <v-tooltip top color="rgba(79, 195, 247)">
        <template v-slot:activator="{ on, attrs }">
          <div
            v-bind="attrs"
            v-on="on"
            class="carriedOver allocation bar"
            :style="{ width: `${carriedOverPercent}%` }"
          >
            {{ allocations.carried_over }}
          </div>
        </template>
        <span> 繰越日数 </span>
      </v-tooltip>

      <v-tooltip top color="rgba(3, 155, 229)">
        <template v-slot:activator="{ on, attrs }">
          <div
            v-bind="attrs"
            v-on="on"
            class="currentYear allocation bar"
            :style="{ width: `${100 - carriedOverPercent}%` }"
          >
            {{ allocations.current_year_grants }}
          </div>
        </template>
        <span> 当年度付与日数 </span>
      </v-tooltip>

      <!-- Remaining -->
      <v-tooltip bottom color="#777777">
        <template v-slot:activator="{ on, attrs }">
          <div
            v-bind="attrs"
            v-on="on"
            class="remaining leaves bar"
            :style="{
              width: `${100 - takenPercent - yoteiPercent}%`,
            }"
          >
            {{
              allocations.current_year_grants +
              allocations.carried_over -
              total_yotei -
              total_taken
            }}
          </div>
        </template>
        <span> 残り </span>
      </v-tooltip>
    </template>

    <template v-if="total_taken + total_yotei">
      <v-tooltip bottom color="#00c000">
        <template v-slot:activator="{ on, attrs }">
          <div
            v-bind="attrs"
            v-on="on"
            class="taken leaves bar"
            :style="{ width: `${takenPercent}%` }"
          >
            {{ total_taken }}
          </div>
        </template>
        <span> 当年度取得日数 </span>
      </v-tooltip>

      <!-- Yotei -->
      <v-tooltip bottom color="#3f663f">
        <template v-slot:activator="{ on, attrs }">
          <div
            v-bind="attrs"
            v-on="on"
            class="yotei leaves bar"
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
    </template>

    <div v-if="!allocations?.current_year_grants && !entries.length">
      データなし
    </div>
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
        }
        return total
      }, 0)
    },
    total_taken() {
      return this.entries.reduce((total, { type, date }) => {
        if (new Date(date) < new Date()) {
          if (type === "有休") return total + 1
          else if (type === "前半休" || type === "後半休") return total + 0.5
        }
        return total
      }, 0)
    },
    total_allocations() {
      return (
        this.allocations.current_year_grants + this.allocations.carried_over
      )
    },
    carriedOverPercent() {
      return (this.allocations.carried_over / this.total_allocations) * 100
    },

    takenPercent() {
      if (
        !this.allocations?.current_year_grants &&
        !this.allocations?.carried_over
      )
        return (this.total_taken / (this.total_yotei + this.total_taken)) * 100
      return (this.total_taken / this.total_allocations) * 100
    },
    yoteiPercent() {
      if (
        !this.allocations?.current_year_grants &&
        !this.allocations?.carried_over
      )
        return (this.total_yotei / (this.total_yotei + this.total_taken)) * 100
      return (
        (this.total_yotei /
          (this.allocations.carried_over +
            this.allocations.current_year_grants)) *
        100
      )
    },
  },
}
</script>

<style scoped>
.total {
  position: relative;
  height: 3em;
  text-align: center;
}

.bar {
  color: white;
}

.allocation {
  position: absolute;
  top: 0;
  bottom: 0;
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

.leaves {
  position: absolute;
  top: 50%;
  bottom: 0;

  overflow: hidden;
}
.taken {
  left: 0;
  background-color: #00c000bb;
}

.yotei {
  background-color: #3f663fbb;
}

.remaining {
  right: 0;
  color: white;
  background-color: #44444444;
}
</style>
