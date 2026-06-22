export function reduceTotal(period: "all" | "past" | "future" = "all") {
  return (total: number, { type, date }) => {
    const isToCount =
      (period === "past" && new Date() > new Date(date)) ||
      (period === "future" && new Date() < new Date(date)) ||
      period === "all"
    if (isToCount) {
      if (["前半休", "後半休"].includes(type)) return total + 0.5
      else return total + 1
    } else return total
  }
}
