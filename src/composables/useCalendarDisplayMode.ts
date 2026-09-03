import { ref, watch } from "vue"
import { localStorageKeys } from "@/constants"

export type CalendarDisplayMode = "grid" | "dates"

const isCalendarDisplayMode = (value: unknown): value is CalendarDisplayMode =>
  value === "grid" || value === "dates"

const stored = localStorage.getItem(localStorageKeys.calendarDisplayMode)

const mode = ref<CalendarDisplayMode>(
  isCalendarDisplayMode(stored) ? stored : "grid"
)

watch(mode, (value) => {
  localStorage.setItem(localStorageKeys.calendarDisplayMode, value)
})

export function useCalendarDisplayMode() {
  return { mode }
}
