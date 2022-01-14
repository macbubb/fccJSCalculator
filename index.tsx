import { useState, useReducer, useEffect } from 'react';
import React = require('react');
import { render } from 'react-dom';
import './style.scss';
import { CalculationState, Pad, PadProps, ActionKind, Action } from './Types';
import {
  numberPads,
  operatorPads,
  miscPads,
  initialCalculationState,
} from './constants';
import { Display } from './Display';
import { DisplayPads } from './DisplayPads';
import { calculationStateReducer } from './calculationStateReducer';

const App = () => {
  const [calculationState, dispatch] = useReducer(
    calculationStateReducer,
    initialCalculationState
  );

  const handleClick = (pad: Pad) => {
    if (pad.type !== ActionKind.Digit) {
      let displayElement = document.getElementById('display');
      displayElement.setAttribute('class', 'display flash');
      setTimeout(() => {
        displayElement.setAttribute('class', 'display');
      }, 100);
      dispatch({ type: pad.type, payload: pad });
    } else {
      dispatch({ type: pad.type, payload: pad });
    }
  };

  useEffect(() => {
    let length: number = calculationState.displayValue.length;
    let heading: HTMLElement = document.getElementById('display-text');
    if (heading) heading.setAttribute('class', `length-${length}`);
  }, [calculationState.displayValue]);

  useEffect(() => {
    if (calculationState.priorAction !== null && calculationState.priorAction !== ActionKind.Digit) {
      // attempts to highlight last operation
      for (let index in operatorPads) {
        let operator: string = operatorPads[index].id;
        let element: HTMLElement = document.getElementById(operator);
        if (element != null && operator === calculationState.priorAction) {
          element.setAttribute('class', 'last-action');
        } else if (element) {
          element.setAttribute('class', '');
        }
      }
    }
  }, [calculationState.priorAction]);

  return (
    <div>
      <div className="calculator-face">
        <Display displayValue={calculationState.displayValue} />
        <div className="controls">
          <div className="left-side">
            <DisplayPads
              handleClick={handleClick}
              pads={miscPads}
              className="misc"
              priorAction={calculationState.priorAction}
            />
            <DisplayPads
              handleClick={handleClick}
              pads={numberPads}
              className="numbers"
            />
          </div>
          <div className="right-side">
            <DisplayPads
              handleClick={handleClick}
              pads={operatorPads}
              className="operations"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

render(<App />, document.getElementById('root'));
