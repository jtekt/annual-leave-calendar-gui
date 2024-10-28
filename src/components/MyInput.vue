<template>
  <div>
    <label>My Input: </label>
    <input type="text" v-model="bananaComputed" />
    <span>Internal: {{ bananaComputed }}, Prop: {{ value }}</span>
  </div>
</template>

<script>
export default {
  props: {
    value: String,
  },
  emits: ["input"],
  data() {
    return {}
  },
  computed: {
    bananaComputed: {
      get() {
        return this.value
      },
      set(newVal) {
        this.$emit("input", newVal)
      },
    },
  },
}
</script>
