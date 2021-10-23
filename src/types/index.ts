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

export enum Face {
  smiled = '😊',
  scared = '😨',
  lost = '😰',
  won = '😃',
}
