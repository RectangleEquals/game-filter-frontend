import { createContext, useContext, useState } from 'react';
import ScavengerHunt from '../Dialogs/Aria/ScavengerHunt';

export const AriaContext = createContext();

const _riddles = [
  "You're about to have an eventful day... Find a secret code where time ticks away",
  "(next riddle goes here)",
  "(next riddle goes here)",
  "(next riddle goes here)",
  "(next riddle goes here)",
  "(next riddle goes here)",
  "(next riddle goes here)",
  "(next riddle goes here)",
  "(next riddle goes here)"
];

const _finalMessage = "The end of your search is coming in hot... Search in the backyard where \"X marks the spot\"";

const _secrets = [
  'ticktock',
  'b',
  'c',
  'd',
  'e',
  'f',
  'g',
  'h',
  'i',
];

export function AriaProvider({ children })
{
  const [shown, setShown] = useState(false);
  const [step, setStep] = useState(0);
  const [solved, setSolved] = useState(false);
  const [riddles, setRiddles] = useState(_riddles);
  const [finalMessage, setFinalMessage] = useState(_finalMessage);
  const [secrets, setSecrets] = useState(_secrets);

  return (
    <AriaContext.Provider
      value={{
        shown,
        step,
        solved,
        riddles,
        finalMessage,
        secrets,
        setShown,
        setStep,
        setSolved,
        setRiddles,
        setFinalMessage,
        setSecrets
      }}
    >
      {children}
      {<ScavengerHunt shown={shown} />}
    </AriaContext.Provider>
  );
}

export const useAriaContext = () => useContext(AriaContext);
export default useAriaContext;