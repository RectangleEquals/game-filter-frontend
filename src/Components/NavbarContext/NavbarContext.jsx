import { createContext, useContext, useEffect, useRef, useState } from 'react';

export const NavbarContext = createContext();

export function NavbarProvider({ children })
{
  const ref = useRef(null);
  const [height, setHeight] = useState(66);
  const [expanded, setExpanded] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      if (ref.current) {
        setHeight(ref.current.offsetHeight);
        setTimeout(() => setHeight(ref.current.offsetHeight), 0);
      }
    };

    handleResize();

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <NavbarContext.Provider
      value={{
        ref,
        height,
        expanded,
        setExpanded
      }} >
      {children}
    </NavbarContext.Provider>
  );
};

export const useNavbarContext = () => useContext(NavbarContext);
export default useNavbarContext;