import React = require('react');
import { CalculationState } from './Types';

export const Display = ({ displayValue }: CalculationState) => {
  return (
    <div id="display" className="display">
      {/* {displayValue} for FCC*/}
      <h1 id="display-text">{displayValue}</h1>
    </div>
  );
};
