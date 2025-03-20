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
                step="0.5"
                v-model.number="leaves.carried_over"
                :hint="$t('Carried over')"
                persistent-hint
              />
            </v-col>
            <v-col>
              <v-text-field
                :label="$t('Leaves')"
                type="number"
                min="0"
                step="0.5"
                v-model.number="leaves.current_year_grants"
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
                step="0.5"
                v-model.number="reserve.carried_over"
                :hint="$t('Carried over')"
                persistent-hint
              />
            </v-col>
            <v-col>
              <v-text-field
                :label="$t('Reserve')"
                type="number"
                min="0"
                step="0.5"
                v-model.number="reserve.current_year_grants"
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
    year: Number,
  },
  data() {
    return {
      loading: false,
      dialog: false,
      leaves: {
        carried_over: 0,
        current_year_grants: 0,
      },
      reserve: {
        carried_over: 0,
        current_year_grants: 0,
      },
    }
  },
  methods: {
    submit() {
      this.loading = true
      const url = `/v1/users/${this.user_id}/allocations`
      const body = {
        year: this.year,
        leaves: {
          carried_over: this.leaves.carried_over,
          current_year_grants: this.leaves.current_year_grants,
        },
        reserve: {
          carried_over: this.reserve.carried_over,
          current_year_grants: this.reserve.current_year_grants,
        },
      }
      this.axios
        .post(url, body)
        .then(() => this.$emit("createAllocation"))
        .catch((error) => {
          console.error(error)
          alert(`Error while creating`)
        })
        .finally(() => {
          this.loading = false
          this.leaves.carried_over = null
          this.leaves.current_year_grants = null
          this.reserve.carried_over = null
          this.reserve.current_year_grants = null
          this.dialog = false
        })
    },
  },
}
</script>
