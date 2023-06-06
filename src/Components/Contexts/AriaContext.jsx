import { createContext, useContext, useState } from 'react';
import ScavengerHunt from '../Dialogs/Aria/ScavengerHunt';

export const AriaContext = createContext();

const _riddles = [
  "Search where time ticks and tocks, find the code inside the clock",
  "In a cozy corner where stories are read, find me hiding near the place where you rest your head",
  "Where clothes are washed and socks are spun, seek me where the laundry is done",
  "Look for me where food is stored, among the shelves where pots are bored",
  "Where water flows and bubbles rise, find me near the sink's disguise",
  "Toasty warmth and crackling fire, seek me where flames climb higher",
  "In a room of dreams and peaceful sleep, find me where secrets you shall keep",
  "Amongst toys and games galore, search for me on the playroom floor",
  "Where creativity blooms and colors unite, seek me where brushes take flight"
];

const _finalMessage = "The final place to search is buried not too far beneath the earth...";

const _secrets = [
  'a',
  'b',
  'c',
  'd',
  'e',
  'f',
  'g',
  'h',
  'i',
  'j',
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