<template>
  <v-card :loading="items_loading">
    <template v-if="!items_loading">
      <v-container fluid>
        <v-row align="baseline">
          <v-col>
            <v-toolbar-title v-if="group">{{
              group.properties.name
            }}</v-toolbar-title>
            <v-toolbar-title v-else>{{ group_id }}</v-toolbar-title>
          </v-col>
          <v-spacer />
          <v-col cols="auto">
            <v-select
              :items="Array.from(Array(50).keys()).map((x) => x + 2015)"
              v-model="year"
              label="Year"
            />
          </v-col>
          <v-col cols="auto">
            <v-btn @click="excel_export()">
              <v-icon>mdi-download</v-icon>
              <span class="ml-2">{{ $t("Export") }}</span>
            </v-btn>
          </v-col>
        </v-row>
      </v-container>
      <v-divider />

      <v-card-text>
        <div
          class="user_calendar_wrapper"
          v-for="(item, index) in items"
          :key="`user_${index}`"
        >
          <!-- top: user and total -->
          <div class="user_wrapper">
            <User :user="item.user" />
            <span class="spacer" />
            <Total :entries="item.entries" />
          </div>

          <!-- bottom: calendar view -->
          <Calendar :entries="item.entries" />
        </div>
      </v-card-text>

      <ExcelExportTable :items="items" />
    </template>
  </v-card>
</template>

<script>
// @ is an alias to /src
import Calendar from "@/components/Calendar.vue"
import User from "@/components/User.vue"
import Total from "@/components/Total.vue"
import ExcelExportTable from "@/components/ExcelExportTable.vue"
// import XLSX from 'xlsx'
import { utils, writeFile } from "xlsx"

export default {
  name: "GroupEntries",
  components: {
    Calendar,
    User,
    Total,
    ExcelExportTable,
  },
  data() {
    return {
      year: new Date().getFullYear(),
      items: [],
      items_loading: false,
      group: null,
      group_loading: false,
      loading: false,
    }
  },
  mounted() {
    this.get_entries()
    this.get_group()
  },
  watch: {
    group_id() {
      this.get_entries()
    },
    year() {
      this.get_entries()
    },
  },
  methods: {
    get_entries() {
      this.items_loading = true
      const url = `/groups/${this.group_id}/entries`
      const params = { year: this.year }
      this.axios
        .get(url, { params })
        .then(({ data }) => {
          this.items = data
        })
        .catch((error) => {
          console.error(error)
        })
        .finally(() => {
          this.items_loading = false
        })
    },
    get_group() {
      const url = `${process.env.VUE_APP_GROUP_MANAGER_API_URL}/groups/${this.group_id}`
      this.axios
        .get(url)
        .then((response) => {
          this.group = response.data
        })
        .catch((error) => {
          if (error.response) console.error(error.response.data)
          else console.error(error)
        })
    },
    excel_export() {
      var workbook = utils.book_new()
      var ws1 = utils.table_to_sheet(document.getElementById("export_table"))
      utils.book_append_sheet(workbook, ws1, "Sheet1")
      writeFile(workbook, `nenkyuu_calendar_${this.group_id}_export.xlsx`)

      //alert(`エクセルはそのためではありません。正しいツール使わない人たちが他の社員に迷惑かけます。ITリテラシーを直してください。`)
    },
  },
  computed: {
    group_id() {
      return this.$route.params.id
    },
  },
}
</script>

<style scoped>
.user_calendar_wrapper {
  margin: 1em 0;
  padding: 1em 0;
}

.user_calendar_wrapper:not(:last-child) {
  border-bottom: 1px solid #dddddd;
}

.user_calendar_wrapper > .user_wrapper {
  display: flex;
  align-items: center;
  flex-basis: 150px;
  flex-grow: 1;
  flex-shrink: 0;

  text-align: left;

  padding: 0.25em;
}

.spacer {
  flex-grow: 1;
}

.user_calendar_wrapper > .calendar {
  margin-top: 0.5em;
  flex-grow: 1;
}
</style>
