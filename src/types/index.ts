export interface User {
  _id?: string
  properties?: { _id: string; name?: string }
  identity?: { low: number } | number
  display_name?: string
  avatar_src?: string
  name_kanji?: string
  entries?: Entry[]
}

export interface Entry {
  _id: string
  date: string
  type: string
  user_id: string
  refresh?: boolean
  reserve?: boolean
  am?: boolean
  pm?: boolean
}

export interface AllocationData {
  carried_over: number
  current_year_grants: number
}

export interface Allocations {
  leaves: AllocationData
  reserve: AllocationData
}

export interface Group {
  _id?: string
  properties: {
    name: string
    _id?: string
  }
}

export interface GroupItem {
  user: User
  entries: Entry[]
  allocations?: Allocations
}
