/**
 * Leave entry type configuration.
 *
 * Each category is a comma-separated list of type names, so a deployment can map
 * several of its own names onto the same behaviour. Values default to the
 * Japanese names used by the original deployment but can be overridden per
 * company through environment variables so the app stays generic.
 */

import runtimeEnv from "@/runtimeEnv"

const DEFAULT_FULL_DAY = "有休"
const DEFAULT_MORNING = "前半休"
const DEFAULT_AFTERNOON = "後半休"
const DEFAULT_EXCLUDED = "振休"

/** Splits a comma-separated env var into a trimmed, non-empty list. */
function envList(raw: string | undefined, fallback: string): string[] {
  return (raw || fallback)
    .split(",")
    .map((type) => type.trim())
    .filter(Boolean)
}

const {
  VITE_LEAVE_TYPES_FULL_DAY,
  VITE_LEAVE_TYPES_MORNING,
  VITE_LEAVE_TYPES_AFTERNOON,
  VITE_LEAVE_TYPES_EXCLUDED,
} = runtimeEnv

/** Type names that count as a full leave day. */
export const fullDayLeaveTypes = envList(
  VITE_LEAVE_TYPES_FULL_DAY,
  DEFAULT_FULL_DAY
)

/** Type names that count as a morning / first-half day (0.5, rendered AM). */
export const morningLeaveTypes = envList(VITE_LEAVE_TYPES_MORNING, DEFAULT_MORNING)

/** Type names that count as an afternoon / second-half day (0.5, rendered PM). */
export const afternoonLeaveTypes = envList(
  VITE_LEAVE_TYPES_AFTERNOON,
  DEFAULT_AFTERNOON
)

/**
 * Type names that do not count towards leave totals at all, e.g. substitute
 * holidays (振休).
 */
export const excludedLeaveTypes = envList(
  VITE_LEAVE_TYPES_EXCLUDED,
  DEFAULT_EXCLUDED
)

/**
 * Every configured type name, offered in the create / edit entry dropdown, in
 * order and de-duplicated (full-day, then morning, then afternoon, then
 * non-counting types such as 振休).
 */
export const selectableLeaveTypes = [
  ...new Set([
    ...fullDayLeaveTypes,
    ...morningLeaveTypes,
    ...afternoonLeaveTypes,
    ...excludedLeaveTypes,
  ]),
]

/** Whether an entry of the given type counts towards leave totals. */
export function isCountedLeaveType(type: string): boolean {
  return !excludedLeaveTypes.includes(type)
}

/** Whether an entry of the given type is a non-counting type, e.g. 振休. */
export function isExcludedLeaveType(type: string): boolean {
  return excludedLeaveTypes.includes(type)
}

/**
 * Half-day designation of a type, for AM/PM rendering; undefined for full-day
 * and non-counting types.
 */
export function leaveTypeHalf(type: string): "am" | "pm" | undefined {
  if (morningLeaveTypes.includes(type)) return "am"
  if (afternoonLeaveTypes.includes(type)) return "pm"
  return undefined
}

/**
 * Number of leave days an entry of the given type counts for: excluded types
 * count as 0, half-day types as 0.5, and anything else as a full day.
 */
export function leaveDayValue(type: string): number {
  if (excludedLeaveTypes.includes(type)) return 0
  if (leaveTypeHalf(type)) return 0.5
  return 1
}
