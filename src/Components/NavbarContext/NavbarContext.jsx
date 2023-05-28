import { createContext, useContext, useState } from 'react';

export const NavbarContext = createContext();

export function NavbarProvider({ children })
{
  const [isCollapsed, setIsCollapsed] = useState(true);
  const [navbarHeight, setNavbarHeight] = useState(0);
  const [navbarOffsetHeight, setNavbarOffsetHeight] = useState(0);
  const [collapsibleContentOffsetHeight, setCollapsibleContentOffsetHeight] = useState(0);

  const updateOffsetHeight = (navbarHeight, collapsibleContentHeight) => {
    const offsetHeight = isCollapsed ? navbarHeight : navbarOffsetHeight + collapsibleContentHeight;
    setNavbarOffsetHeight(navbarHeight);
    setCollapsibleContentOffsetHeight(collapsibleContentHeight);
    setNavbarHeight(offsetHeight);
  }

  return (
    <NavbarContext.Provider
      value={{
        isCollapsed,
        setIsCollapsed,
        navbarHeight,
        navbarOffsetHeight,
        collapsibleContentOffsetHeight,
        updateOffsetHeight
      }} >
      {children}
    </NavbarContext.Provider>
  );
};

const useNavbarContext = () => useContext(NavbarContext);
export default useNavbarContext;