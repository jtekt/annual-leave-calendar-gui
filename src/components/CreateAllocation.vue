<template>
  <v-dialog v-model="dialog" max-width="30rem">
    <template v-slot:activator="{ props }">
      <v-btn v-bind="props" color="primary" @click="dialog = true">
        <v-icon left>mdi-plus</v-icon>
        <span>{{ $t("Create allocation") }}</span>
      </v-btn>
    </template>
    <v-form @submit.prevent="submit()">
      <v-card>
        <v-card-title>{{ $t("Create allocation") }}</v-card-title>
        <v-card-text>
          <v-row>
            <v-col>
              <v-text-field
                :label="$t('Leaves')"
                type="number"
                min="0"
                v-model="carried_over_leaves"
                :hint="$t('Carried over')"
                persistent-hint
              />
            </v-col>
            <v-col>
              <v-text-field
                :label="$t('Leaves')"
                type="number"
                min="0"
                v-model="current_year_leaves"
                :hint="$t('Current year grants')"
                persistent-hint
              />
            </v-col>
          </v-row>
          <v-row>
            <v-col>
              <v-text-field
                :label="$t('Reserve')"
                type="number"
                min="0"
                v-model="carried_over_reserve"
                :hint="$t('Carried over')"
                persistent-hint
              />
            </v-col>
            <v-col>
              <v-text-field
                :label="$t('Reserve')"
                type="number"
                min="0"
                v-model="current_year_reserve"
                :hint="$t('Current year grants')"
                persistent-hint
              />
            </v-col>
          </v-row>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn text color="primary" type="submit">{{
            $t("Create allocation")
          }}</v-btn>
          <v-btn text @click="dialog = false">{{ $t("Cancel") }}</v-btn>
        </v-card-actions>
      </v-card>
    </v-form>
  </v-dialog>
</template>
<script>
export default {
  name: "CreateAllocation",
  props: {
    user_id: String,
  },
  data() {
    return {
      loading: false,
      dialog: false,
      current_year_leaves: null,
      carried_over_leaves: null,
      current_year_reserve: null,
      carried_over_reserve: null,
    }
  },
  methods: {
    submit() {
      this.loading = true
      const url = `/v1/users/${this.user_id}/allocations`
      const allocations = {
        leaves: {
          current_year_grants: this.current_year_leaves,
          carried_over: this.carried_over_leaves,
        },
        reserve: {
          current_year_grants: this.current_year_reserve,
          carried_over: this.carried_over_reserve,
        },
      }
      this.axios
        .put(url, allocations)
        .catch((error) => {
          console.error(error)
        })
        .finally(() => {
          this.loading = false
        })
    },
  },
}
</script>
