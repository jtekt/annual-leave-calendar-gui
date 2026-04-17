<template>
  <div>
    <v-tooltip location="bottom" :disabled="!export_disabled">
      <template v-slot:activator="{ props: tooltipProps }">
        <span v-bind="tooltipProps">
          <v-btn
            :disabled="export_disabled"
            :loading="excel_exporting"
            @click="excel_export"
          >
            <v-icon>mdi-download</v-icon>
            <span class="ml-2">{{ t("Export") }}</span>
          </v-btn>
        </span>
      </template>
      <span>{{ t("Max export limit") }}</span>
    </v-tooltip>

    <table id="export_table">
      <thead>
        <tr>
          <th>No</th>
          <th>名前</th>
          <th>1-6月r</th>
          <th>7-12月r</th>
          <template v-for="month in 12" :key="`header_${month}`">
            <th>{{ month }}月</th>
            <th v-if="month === 5 || month === 8">5日以上</th>
          </template>
        </tr>
      </thead>
      <tbody>
        <template v-for="(item, index) in items" :key="`user_${index}`">
          <tr>
            <td>{{ index + 1 }}</td>
            <td>{{ item.user.display_name }}</td>
            <td>
              {{
                refresh_entries_first_semester(item)
                  .map((e) => `${month_of_entry(e)}/${day_of_entry(e)}`)
                  .join(", ")
              }}
            </td>
            <td>
              {{
                refresh_entries_second_semester(item)
                  .map((e) => `${month_of_entry(e)}/${day_of_entry(e)}`)
                  .join(", ")
              }}
            </td>
            <template v-for="month in 12" :key="`user_${index}_month_${month}`">
              <td>
                {{ entries_of_month(item, month).map(day_of_entry).join(", ") }}
              </td>
              <td v-if="month === 5">{{ five_days_taken(item, month) }}</td>
              <td v-if="month === 8">{{ five_days_taken(item, month) }}</td>
            </template>
          </tr>
        </template>
      </tbody>
    </table>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from "vue"
import { useI18n } from "vue-i18n"
import axios from "axios"
import { utils, writeFile } from "xlsx"
import type { GroupItem, Entry } from "@/types"
import { useYear } from "@/composables/useYear"

const props = defineProps<{
  total: number
  group_id: string
}>()

const { year } = useYear()

const { t } = useI18n()
const items = ref<GroupItem[]>([])
const excel_exporting = ref(false)

const export_disabled = computed(() => props.total === 0 || props.total > 500)

function entries_of_month(item: GroupItem, month: number): Entry[] {
  return item.entries.filter(({ date, type }) => {
    return (
      new Date(date).getMonth() + 1 === month &&
      ["有休", "前半休", "後半休"].includes(type)
    )
  })
}

function day_of_entry(entry: Entry): string | number {
  const day = new Date(entry.date).getDate()
  if (entry.type === "前半休") return `${day}am`
  if (entry.type === "後半休") return `${day}pm`
  return day
}

function month_of_entry(entry: Entry): number {
  return new Date(entry.date).getMonth() + 1
}

function refresh_entries_first_semester(item: GroupItem): Entry[] {
  return item.entries
    .filter((e) => e.refresh)
    .filter((e) => month_of_entry(e) <= 6)
}

function refresh_entries_second_semester(item: GroupItem): Entry[] {
  return item.entries
    .filter((e) => e.refresh)
    .filter((e) => month_of_entry(e) > 6)
}

function five_days_taken(item: GroupItem, month: number): string {
  const count = item.entries
    .filter((e) => month_of_entry(e) <= month)
    .reduce((total, { type }) => {
      if (type === "有休") return total + 1
      if (type === "前半休" || type === "後半休") return total + 0.5
      return total
    }, 0)
  return count > 5 ? "〇" : "×"
}

async function excel_export() {
  try {
    excel_exporting.value = true
    const params = { year: year.value }
    const { data } = await axios.get<{ items: GroupItem[]; total: number }>(
      `/groups/${props.group_id}/entries`,
      { params }
    )
    if (data.total !== data.items.length) {
      throw new Error(
        "The number of people for Excel exporting is limited to 500."
      )
    }
    items.value = data.items
    setTimeout(() => {
      const workbook = utils.book_new()
      const ws = utils.table_to_sheet(
        document.getElementById("export_table")!,
        { raw: true }
      )
      utils.book_append_sheet(workbook, ws, "Sheet1")
      writeFile(workbook, `nenkyuu_calendar_${props.group_id}_export.xlsx`)
      excel_exporting.value = false
    }, 100)
  } catch (error) {
    console.error(error)
    alert(error?.message ?? t("Failed to load data"))
    excel_exporting.value = false
  }
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
