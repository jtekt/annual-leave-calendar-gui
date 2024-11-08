<template>
  <div>
    <v-tooltip bottom :disabled="!export_disabled">
      <template v-slot:activator="{ on }">
        <span v-on="on">
          <v-btn
            :disabled="export_disabled"
            :loading="excel_exporting"
            @click="excel_export()"
          >
            <v-icon>mdi-download</v-icon>
            <span class="ml-2">{{ $t("Export") }}</span>
          </v-btn>
        </span>
      </template>
      <span>max: 500 people</span>
    </v-tooltip>

    <table id="export_table">
      <tr>
        <th>No</th>
        <th>名前</th>
        <th>Type</th>
        <th>Previous year</th>
        <th>1-6月r</th>
        <th>7-12月r</th>
        <th>1-6月r</th>
        <th>7-12月r</th>

        <template v-for="month in 12">
          <th :key="`table_month_header_${month}`">{{ month }}月</th>

          <th
            v-if="month === 5 || month === 8"
            :key="`5_days_taken_${month}_header`"
          >
            5日以上
          </th>
        </template>
      </tr>
      <template v-for="(item, index) in items">
        <tr :key="`user_${index}_yotei`">
          <!-- INDEX -->
          <td rowspan="3">{{ index + 1 }}</td>
          <!-- User name -->
          <td rowspan="3">{{ item.user.display_name }}</td>

          <!-- User rank -->
          <td rowspan="3"></td>

          <!-- Previous year -->
          <td rowspan="3"></td>

          <!-- Refresh 1-6 -->
          <td rowspan="3">
            {{
              refresh_entries_first_semester(item.user)
                .map((entry) => {
                  return `${month_of_entry(entry)}/${day_of_entry(entry)}`
                })
                .join(", ")
            }}
          </td>

          <!-- Refresh 1-6 -->
          <td rowspan="3">
            {{
              refresh_entries_second_semester(item.user)
                .map((entry) => {
                  return `${month_of_entry(entry)}/${day_of_entry(entry)}`
                })
                .join(", ")
            }}
          </td>

          <!-- Consecutive 1-6 -->
          <td rowspan="3"></td>

          <!-- Consecutive 1-6 -->
          <td rowspan="3"></td>

          <template v-for="month in 12">
            <td v-bind:key="`user_${index}_yotei_${month}`">
              {{
                entries_of_month(item, month)
                  .filter((entry) => {
                    return entry.taken
                  })
                  .map(day_of_entry)
                  .join(", ")
              }}
            </td>
            <td
              v-if="month === 5"
              rowspan="3"
              :key="`user_${index}_5_days_taken_${month}`"
            >
              {{ five_days_taken(item, month) }}
            </td>
            <td
              v-if="month === 8"
              rowspan="3"
              :key="`user_${index}_5_days_taken_${month}`"
            >
              {{ five_days_taken(item, month) }}
            </td>
          </template>
        </tr>

        <tr :key="`user_${index}_taken`">
          <!-- First item: user name -->

          <template v-for="month in 12">
            <td :key="`user_${index}_taken_${month}`">
              {{ entries_of_month(item, month).map(day_of_entry).join(", ") }}
            </td>
          </template>
        </tr>

        <tr :key="`user_${index}_bottom`">
          <template v-for="month in 12">
            <td :key="`user_${index}_bottom_${month}`">
              <!-- The originaql calendar has a progress bar here -->
            </td>
          </template>
        </tr>
      </template>
    </table>
  </div>
</template>

<script>
// @ is an alias to /src
import { utils, writeFile } from "xlsx"

export default {
  name: "ExcelExportTable",
  props: {
    total: Number,
    group_id: String,
    year: Number,
  },
  data() {
    return {
      items: [],
      excel_exporting: false,
    }
  },
  methods: {
    entries_of_month(item, month) {
      return item.entries.filter((entry) => {
        return new Date(entry.date).getMonth() + 1 === month
      })
    },
    day_of_entry(entry) {
      let output = new Date(entry.date).getDate()
      if (entry.am && !entry.pm) output = `${output}AM`
      else if (!entry.am && entry.pm) output = `${output}PM`
      return output
    },
    month_of_entry(entry) {
      return new Date(entry.date).getMonth() + 1
    },
    refresh_entries_first_semester(item) {
      return item.entries
        .filter((entry) => {
          return entry.refresh
        })
        .filter((entry) => {
          return this.month_of_entry(entry) <= 6
        })
    },
    refresh_entries_second_semester(item) {
      return item.entries
        .filter((entry) => {
          return entry.refresh
        })
        .filter((entry) => {
          return this.month_of_entry(entry) > 6
        })
    },
    five_days_taken(item, month) {
      let count = item.entries
        .filter((entry) => this.month_of_entry(entry) <= month)
        .reduce(
          (total, entry) =>
            total + (0.5 * entry.am + 0.5 * entry.pm) * entry.taken,
          0
        )

      if (count > 5) return "〇"
      else return "✖"
    },
    excel_export() {
      this.excel_exporting = true

      const url = `/groups/${this.group_id}/entries`
      const params = { year: this.year }
      this.axios
        .get(url, { params })
        .then(({ data }) => {
          if (data.total !== data.items.length)
            throw new Error(
              "The number of people for Excel exporting is limited to 500."
            )

          this.items = data.items

          setTimeout(() => {
            var workbook = utils.book_new()
            var ws1 = utils.table_to_sheet(
              document.getElementById("export_table")
            )
            utils.book_append_sheet(workbook, ws1, "Sheet1")
            writeFile(workbook, `nenkyuu_calendar_${this.group_id}_export.xlsx`)
            this.excel_exporting = false
          }, 100)
        })
        .catch((error) => {
          console.error(error)
          alert(error)
          this.excel_exporting = false
        })
    },
  },
  computed: {
    export_disabled() {
      return this.total === 0 || 500 < this.total
    },
  },
}
</script>

<style scoped>
table {
  display: none;
  border-collapse: collapse;
  table-layout: fixed;
}

th,
td {
  border: 1px solid black;
}
</style>
