import React = require('react');
import { ActionKind, Pad, PadProps } from './Types';

export const DisplayPads = ({ pads, className, handleClick, priorAction }: PadProps) => {
  return (
    <div className={className}>
      {pads.map((pad: Pad) => {
        if (pad.id === 'clear' && (priorAction === null || priorAction === ActionKind.Clear)) {
          return (
            <button onClick={() => handleClick(pad)} id={pad.id}>
               {pad.value}
            </button>
          );
        } else if (pad.id === 'clear') { 
          return (
            <button onClick={() => handleClick(pad)} id={pad.id}>
               C
            </button>
          );
        } else {
          return (
            <button onClick={() => handleClick(pad)} id={pad.id}>
              {pad.value}
            </button>
          );
        }
      })}
    </div>
  );
};
