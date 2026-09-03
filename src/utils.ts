import { leaveDayValue } from "@/leaveTypes"

export function reduceTotal(period: "all" | "past" | "future" = "all") {
  return (total: number, { type, date }) => {
    const isToCount =
      (period === "past" && new Date() > new Date(date)) ||
      (period === "future" && new Date() < new Date(date)) ||
      period === "all"
    if (isToCount) return total + leaveDayValue(type)
    else return total
  }
}
