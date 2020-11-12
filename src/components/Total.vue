<template>
  <div class="total">
    <div class="yotei">
      予定: {{total_yotei}}
    </div>
    <div class="taken">
      取得した: {{total_taken}}
    </div>

  </div>

</template>

<script>
// @ is an alias to /src

export default {
  name: 'Total',
  components: {

  },
  props: {
    entries: Array
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
  }


}
</script>

<style scoped>
.total {

}

.total > * {
  margin: 0.25em 0;
}
.yotei {
  color: #c00000;
}

.taken {
  color: #00c000;
}
</style>
