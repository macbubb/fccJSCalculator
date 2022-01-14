export interface AppProps {}
export interface Pad {
  id: string;
  value?: number | string | null;
  type: ActionKind;
}

export interface PadProps {
  pads: Pad[];
  className: string;
  handleClick: any;
  priorAction?: ActionKind;
}

export enum ActionKind {
  Add = 'add',
  Subtract = 'subtract',
  Multiply = 'multiply',
  Divide = 'divide',
  Clear = 'clear',
  Evaluate = 'equals',
  Digit = 'digit',
  Percent = 'percent',
  PlusMinus = 'plusminus',
}

export type Action = {
  type: ActionKind;
  payload: Pad;
};

export interface CalculationState {
  unresolvedActions: ActionKind[];
  displayValue: string;
  priorNumHist: number[];
  numberEntry: string;
  priorAction: ActionKind;
}
