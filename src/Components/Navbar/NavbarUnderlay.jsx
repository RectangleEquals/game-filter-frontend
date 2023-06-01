import { useNavbarContext } from "contexts/NavbarContext";

export function NavbarUnderlay() {
  const { height } = useNavbarContext();

  return (
    <div
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        height: height,
        backgroundColor: '#888888',
        zIndex: -10000
      }}
    />
  );
}

export default NavbarUnderlay;