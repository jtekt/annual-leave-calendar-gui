<template>
  <div>
    <v-row align="center" dense justify="space-around">
      <v-col cols="auto"> 年休 </v-col>

      <v-col cols="auto"> 積休 </v-col>
    </v-row>
    <v-row dense align="center">
      <!-- <v-col cols="auto"> 年休 </v-col> -->
      <v-col>
        <EntriesAllocationsIndicator
          :entries="leaves"
          :allocations="allocations?.leaves"
        />
      </v-col>
      <!-- <v-col cols="auto"> 積休 </v-col> -->
      <v-col>
        <EntriesAllocationsIndicator
          :entries="reserve"
          :allocations="allocations?.reserve"
        />
      </v-col>
    </v-row>
  </div>
</template>

<script>
import EntriesAllocationsIndicator from "@/components/EntriesAllocationsIndicator.vue"
export default {
  name: "Total",
  components: { EntriesAllocationsIndicator },
  props: {
    entries: Array,
    allocations: Object,
  },
  computed: {
    leaves() {
      return this.entries.filter((l) => !l.reserve)
    },
    reserve() {
      return this.entries.filter((l) => l.reserve)
    },
  },
}
</script>

<style scoped>
.totalBar {
  display: flex;
  position: relative;
  height: 3em;
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
