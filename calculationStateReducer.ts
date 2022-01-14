import { Action, CalculationState, ActionKind } from './Types';
import {
  initialCalculationState,
  operatorPads,
  fourOperations,
  fourMisc,
  additiveOperations,
  multiplicativeOperations,
  twoMiscOperations,
} from './constants';
import { format } from 'mathjs';

const changeOperation = (
  operation: ActionKind,
  calculationState: CalculationState
): CalculationState => {
  //using JSON to create a deep copy of array, just because
  let newUnresolvedActions: ActionKind[] = JSON.parse(
    JSON.stringify(calculationState.unresolvedActions)
  );
  newUnresolvedActions.pop();
  newUnresolvedActions.push(operation);
  // in case user pressed an operation before a digit
  if (calculationState.displayValue === '0') {
    let newPriorNumHist: number[] = [0];
    return {
      ...calculationState,
      unresolvedActions: newUnresolvedActions,
      priorAction: operation,
      priorNumHist: newPriorNumHist,
    };
  }
  return {
    ...calculationState,
    unresolvedActions: newUnresolvedActions,
    priorAction: operation,
  };
};

const conditionNumber = (number: number): string => {
  return format(number, { precision: 10 });
};

const resolveAction = (
  num1: number,
  num2: number,
  action: ActionKind
): number => {
  let computation: number;
  if (action === ActionKind.Add) {
    computation = num1 + num2;
  } else if (action === ActionKind.Subtract) {
    computation = num1 - num2;
  } else if (action === ActionKind.Multiply) {
    computation = num1 * num2;
  } else if (action === ActionKind.Divide) {
    computation = num1 / num2;
  }
  return computation;
};

const appendAction = (
  calculationState: CalculationState,
  currentAction: ActionKind
): CalculationState => {
  const { unresolvedActions, priorNumHist, numberEntry, priorAction } =
    calculationState;
  if (unresolvedActions.length === 0) {
    // if operation is the first
    let newUnresolvedActions: ActionKind[] = [currentAction];
    let newPriorNumHist: number[] = [...priorNumHist, Number(numberEntry)];
    return {
      ...calculationState,
      numberEntry: '',
      unresolvedActions: newUnresolvedActions,
      priorAction: currentAction,
      priorNumHist: newPriorNumHist,
    };
  }
};

export const calculationStateReducer = (
  calculationState: CalculationState,
  action: Action
): CalculationState => {
  const {
    unresolvedActions,
    displayValue,
    priorNumHist,
    numberEntry,
    priorAction,
  } = calculationState;

  console.log(action.type, calculationState);

  const { id, value } = action.payload;

  // in case plus minus or percent was used after an operation, and operation is repeated by the evaluate action
  if (
    twoMiscOperations.includes(priorAction) &&
    action.type !== ActionKind.Evaluate &&
    !twoMiscOperations.includes(action.type)
  ) {
    return {
      ...calculationState,
      numberEntry: '',
      unresolvedActions: [action.type],
      priorAction: action.type,
    };
  } else if (
    fourOperations.includes(action.type) &&
    fourOperations.includes(priorAction)
  ) {
    // if user is changing operation
    console.log('changing operation');
    // to fullfill FCC code challenge requirements, if last sign is subtract it should be considered a negative sign
    // if (action.type === ActionKind.Subtract) {
    //   // apply negative sign
    //   return {
    //     ...calculationState,
    //     unresolvedActions: [priorAction],
    //     numberEntry: '-',
    //     displayValue: '-',
    //   };
    // } else if (numberEntry === '-') {
    //   return {
    //     ...calculationState,
    //     numberEntry: '',
    //     displayValue: '0',
    //     unresolvedActions: [action.type],
    //   };
    // }

    return changeOperation(action.type, calculationState);
  } else if (unresolvedActions.length === 1) {
    if (fourMisc.includes(action.type)) {
    } else if (
      additiveOperations.includes(unresolvedActions[0]) &&
      multiplicativeOperations.includes(action.type)
    ) {
      console.log('need to follow order of operations');

      let newUnresolvedActions: ActionKind[] = JSON.parse(
        JSON.stringify(calculationState.unresolvedActions)
      );
      newUnresolvedActions.push(action.type);
      priorNumHist[1] = Number(numberEntry);
      return {
        ...calculationState,
        unresolvedActions: newUnresolvedActions,
        priorNumHist: priorNumHist,
        numberEntry: '',
      };
    } else {
      console.log('just going left to right');
      let computation: number = resolveAction(
        priorNumHist[0],
        Number(numberEntry),
        unresolvedActions[0]
      );
      //need to store prior action if current action is evaluate, never want unresolvedAction to equal evaluate
      let newPriorAction: ActionKind =
        action.type === ActionKind.Evaluate
          ? unresolvedActions[0]
          : action.type;

      let conditionedComputation: string = conditionNumber(computation);

      return {
        ...calculationState,
        unresolvedActions: [newPriorAction],
        displayValue: conditionedComputation,
        priorAction: newPriorAction,
        priorNumHist: [Number(conditionedComputation)],
      };
    }
  } else if (
    unresolvedActions.length === 2 &&
    action.type !== ActionKind.Digit
  ) {
    let firstComputation: number = resolveAction(
      priorNumHist[1],
      Number(numberEntry),
      unresolvedActions[1]
    );
    let secondComputation: number = resolveAction(
      priorNumHist[0],
      firstComputation,
      unresolvedActions[0]
    );
    let conditionedComputation: string = conditionNumber(secondComputation);
    // if calculation is triggered by equals, user wants to reuse the x or / operation
    let newUnresolvedActions: ActionKind[] =
      action.type === ActionKind.Evaluate
        ? [unresolvedActions[1]]
        : [action.type];
    return {
      ...calculationState,
      priorAction: action.type,
      priorNumHist: [Number(conditionedComputation)],
      displayValue: conditionedComputation,
      unresolvedActions: newUnresolvedActions,
    };
  }

  switch (action.type) {
    default: {
      return calculationState;
    }
    case ActionKind.Digit: {
      //stop user from entering numbers with more than 15 digits
      if (numberEntry.length > 14) {
        return { ...calculationState };
      }
      if (value === '.' && displayValue === '0') {
        return {
          ...calculationState,
          displayValue: '0.',
          numberEntry: '0.',
          priorAction: ActionKind.Digit,
        };
      } else if (value === '.' && numberEntry.includes('.')) {
        return calculationState;
      }
      // for FCC subtract as negative sign requirement
      // if (numberEntry === '-') {
      //   let newNumberEntry: number = Number(value) * -1;
      //   return {
      //     ...calculationState,
      //     numberEntry: String(newNumberEntry),
      //     displayValue: String(newNumberEntry),
      //   };
      // }
      if (numberEntry === '' && value != 0) {
        // first digit of a new number
        let newNumberEntry: string = String(value);
        return {
          ...calculationState,
          displayValue: newNumberEntry,
          numberEntry: newNumberEntry,
          priorAction: ActionKind.Digit,
        };
      } else if (numberEntry === '' && value === 0) {
        // restrict first digit to a nonzero
        return calculationState;
      } else if (priorAction !== ActionKind.Digit) {
        let newNumberEntry = String(value);
        return {
          ...calculationState,
          displayValue: newNumberEntry,
          numberEntry: newNumberEntry,
          priorAction: ActionKind.Digit,
        };
      } else {
        // for digits other than the first
        let newNumberEntry: string = numberEntry + String(value);
        return {
          ...calculationState,
          displayValue: newNumberEntry,
          numberEntry: newNumberEntry,
          priorAction: ActionKind.Digit,
        };
      }
    }
    case ActionKind.Add: {
      return appendAction(calculationState, ActionKind.Add);
    }
    case ActionKind.Subtract: {
      return appendAction(calculationState, ActionKind.Subtract);
    }

    case ActionKind.Divide: {
      return appendAction(calculationState, ActionKind.Divide);
    }
    case ActionKind.Multiply: {
      return appendAction(calculationState, ActionKind.Multiply);
    }
    case ActionKind.PlusMinus: {
      let reversedValue: number = Number(displayValue) * -1;
      return {
        ...calculationState,
        displayValue: String(reversedValue),
        priorNumHist: [reversedValue],
        priorAction: ActionKind.PlusMinus,
        // numberEntry: String(reversedValue),
      };
    }
    case ActionKind.Percent: {
      let percentValue: number = Number(displayValue) * 0.01;
      return {
        ...calculationState,
        displayValue: conditionNumber(percentValue),
        priorNumHist: [percentValue],
        priorAction: ActionKind.Percent,
      };
    }
    case ActionKind.Clear: {
      if (priorAction === ActionKind.Digit) {
        return {
          ...calculationState,
          numberEntry: '',
          displayValue: '0',
          priorAction: ActionKind.Clear,
        };
      }
      for (let index in operatorPads) {
        let operator: string = operatorPads[index].id;
        let element: HTMLElement = document.getElementById(operator);
        element.setAttribute('class', '');
      }

      return initialCalculationState;
    }
  }
};
