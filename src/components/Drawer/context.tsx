import { createContext, ReactNode, useContext } from 'react';

interface IDrawerState {
  onClose: () => void;
}

const DrawerContext = createContext<IDrawerState | undefined>(undefined);

export const DrawerProvider = ({
  onClose,
  children,
}: {
  onClose: () => void;
  children: ReactNode;
}) => (
  <DrawerContext.Provider value={{ onClose }}>
    {children}
  </DrawerContext.Provider>
);

export const useDrawer = () => {
  const context = useContext(DrawerContext);
  if (context === undefined) throw new Error('Drawer 하위에서만 사용할 수 있습니다.');
  return context;
};
