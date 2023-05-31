import { createContext, useContext } from 'react';

export const UtilityContext = createContext();

export function UtilityProvider({ children })
{
  const simulateResizeEvent = () => {
    const event = new Event('resize');
    window.dispatchEvent(event);
  };

  return (
    <UtilityContext.Provider
      value={{
        simulateResizeEvent
      }}
    >
      {children}
    </UtilityContext.Provider>
  );
}

export const useUtilityContext = () => useContext(UtilityContext);
export default useUtilityContext;