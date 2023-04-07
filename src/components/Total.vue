<template>
  <div class="total">
    <div class="yotei">予定: {{ total_yotei }}</div>
    <div class="taken">取得した: {{ total_taken }}</div>
  </div>
</template>

<script>
// @ is an alias to /src

export default {
  name: "Total",
  components: {},
  props: {
    entries: Array,
  },
  computed: {
    total_yotei() {
      return this.entries.reduce((total, { type }) => {
        if (type === "有休") return total + 1;
        else if (type === "前半休" || type === "後半休") return total + 0.5;
        else return total;
      }, 0);
    },
    total_taken() {
      return this.entries.reduce((total, { taken, type }) => {
        if (taken) {
          if (type === "有休") return total + 1;
          else if (type === "前半休" || type === "後半休") {
            return total + 0.5;
          } else return total;
        } else return total;
      }, 0);
    },
  },
};
</script>

<style scoped>
.total {
  display: inline-flex;
  font-weight: bold;
}

.total > * {
  margin: 0.25em;
}
.yotei {
  color: #c00000;
}

.taken {
  color: #00c000;
}
</style>
