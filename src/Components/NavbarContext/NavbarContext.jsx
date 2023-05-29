import { createContext, useContext, useState } from 'react';

export const NavbarContext = createContext();

export function NavbarProvider({ children })
{
  const [isCollapsed, setIsCollapsed] = useState(true);
  const [navbarHeight, setNavbarHeight] = useState(0);
  const [navbarOffsetHeight, setNavbarOffsetHeight] = useState(0);
  const [collapsibleContentOffsetHeight, setCollapsibleContentOffsetHeight] = useState(0);

  const updateOffsetHeight = (newNavbarHeight, newCollapsibleContentHeight) => {
    const offsetHeight = isCollapsed ? (newNavbarHeight || navbarHeight) : navbarOffsetHeight + (newCollapsibleContentHeight || collapsibleContentOffsetHeight);
    setNavbarOffsetHeight(newNavbarHeight);
    setCollapsibleContentOffsetHeight(newCollapsibleContentHeight);
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