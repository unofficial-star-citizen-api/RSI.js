export type FundingGoalsData = {
  readonly success: number
  readonly code: string
  readonly msg: string
  readonly data: Data
}

export type Data = {
  readonly chart: { [key: string]: Chart }
  readonly fans: number
  readonly funds: number
  readonly fleet: null
  readonly alpha_slots_left: number
}

export type Chart = {
  readonly gross: string
  readonly axis: string
}
