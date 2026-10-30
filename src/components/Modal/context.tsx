import { createContext, useContext } from 'react';

export type Size = 'md' | 'lg' | 'xl';

interface IModalProviderProps {
  children: React.ReactNode;
  size: Size;
}

interface IModalState {
  size: Size;
}

const ModalContext = createContext<IModalState | undefined>(undefined);

export const ModalProvider = ({ size, children }: IModalProviderProps) => {
  const modalState = { size };

  return (
    <ModalContext.Provider value={modalState}>{children}</ModalContext.Provider>
  );
};

export const useModal = () => {
  const context = useContext(ModalContext);
  if (context === undefined) throw new Error('Modal 하위에서만 사용할 수 있습니다.');
  return context;
};
