import { Pad, ActionKind, CalculationState } from './Types';

export const numberPads: Pad[] = [
  { type: ActionKind.Digit, id: 'seven', value: 7 },
  { type: ActionKind.Digit, id: 'eight', value: 8 },
  { type: ActionKind.Digit, id: 'nine', value: 9 },
  { type: ActionKind.Digit, id: 'four', value: 4 },
  { type: ActionKind.Digit, id: 'five', value: 5 },
  { type: ActionKind.Digit, id: 'six', value: 6 },
  { type: ActionKind.Digit, id: 'one', value: 1 },
  { type: ActionKind.Digit, id: 'two', value: 2 },
  { type: ActionKind.Digit, id: 'three', value: 3 },
  { type: ActionKind.Digit, id: 'zero', value: 0 },
  { type: ActionKind.Digit, id: 'decimal', value: '.' },
];

export const miscPads: Pad[] = [
  { type: ActionKind.Clear, id: 'clear', value: 'AC' },
  { type: ActionKind.PlusMinus, id: 'plusMinus', value: '±' },
  { type: ActionKind.Percent, id: 'percent', value: '%' },
];

export const operatorPads: Pad[] = [
  { type: ActionKind.Divide, id: 'divide', value: '÷' },
  { type: ActionKind.Multiply, id: 'multiply', value: '×' },
  { type: ActionKind.Subtract, id: 'subtract', value: '−' },
  { type: ActionKind.Add, id: 'add', value: '+' },
  { type: ActionKind.Evaluate, id: 'equals', value: '=' },
];

export const initialCalculationState: CalculationState = {
  unresolvedActions: [],
  displayValue: '0',
  priorNumHist: [],
  numberEntry: '',
  priorAction: null,
};

export const fourOperations: ActionKind[] = [
  ActionKind.Add,
  ActionKind.Subtract,
  ActionKind.Multiply,
  ActionKind.Divide,
];

export const fourMisc: ActionKind[] = [
  ActionKind.Digit,
  ActionKind.Clear,
  ActionKind.Percent,
  ActionKind.PlusMinus,
];
export const additiveOperations: ActionKind[] = [
  ActionKind.Add,
  ActionKind.Subtract,
];
export const multiplicativeOperations: ActionKind[] = [
  ActionKind.Multiply,
  ActionKind.Divide,
];
export const twoMiscOperations: ActionKind[] = [
  ActionKind.PlusMinus,
  ActionKind.Percent,
];
