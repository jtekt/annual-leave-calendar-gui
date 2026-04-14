<template>
  <v-card>
    <v-card-text>
      <v-row dense density="compact">
        <v-col cols="auto" v-if="user">
          <UserChip :user="user" />
        </v-col>
        <v-spacer></v-spacer>
        <v-col>
          <Total :entries="entries" :allocations="allocations" />
        </v-col>
      </v-row>
      <v-row dense density="compact">
        <v-col>
          <Calendar :entries="entries" />
        </v-col>
      </v-row>
    </v-card-text>
  </v-card>
</template>
<script setup lang="ts">
import type { Allocations, Entry, User } from "@/types"
import Total from "./Total.vue"
import Calendar from "./Calendar.vue"
import UserChip from "./UserChip.vue"

const props = defineProps<{
  user?: User
  entries: Entry[]
  allocations: Allocations | null
}>()
</script>
