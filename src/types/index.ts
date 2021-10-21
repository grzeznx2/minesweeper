export enum CellValue {
  none,
  one,
  two,
  three,
  four,
  five,
  six,
  seven,
  eight,
  nine,
  bomb,
}

export enum CellState {
  untouched,
  touched,
  flagged,
}

export interface ICell {
  value: CellValue
  state: CellState
}
