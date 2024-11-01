
export type validColors = "BLUE"| "RED"| "YELLOW" |"GREEN"

export type ReverseCard = {
    readonly type: 'REVERSE'
    readonly color: validColors
    readonly  value: 20
  }

export type SkipCard = {
   readonly type: 'SKIP'
   readonly color: validColors
   readonly  value: 20
   }

export type Draw2Card = {
  readonly type: 'DRAW2'
  readonly color:  validColors
  readonly  value: 20
  }

export type WildCard = {
  readonly  type: 'WILD'
  readonly color: "all"
  readonly  value: 50
   }

export type Draw4Card = {
  readonly  type: 'DRAW4'
  readonly  color: "all"
  readonly  value: 50
   }

export type SpecialCard = ReverseCard | SkipCard | Draw2Card | WildCard | Draw4Card

export type NormalCard = {
  readonly  type: 'NUMBERED'
  readonly  color:  validColors
  readonly  value: number
}

