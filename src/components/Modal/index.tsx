import React, { ElementType, HTMLAttributes } from 'react';

import { cva } from 'class-variance-authority';

import ModalBody from './Body';
import { ModalProvider, Size, useModal } from './context';
import ModalFooter from './Footer';
import ModalHeader from './Header';

/**
 * `className`을 받지 않는다. 시각 스펙을 밖에서 덮는 통로라 Figma 완전싱크와
 * 충돌한다 — 레포의 다른 컴포넌트도 같은 이유로 막아뒀다.
 */
interface IModalContextProps
  extends Omit<HTMLAttributes<HTMLDivElement>, 'className'> {
  as?: ElementType;
  children: React.ReactNode;
  size?: Size;
}

interface IModalProps extends Omit<HTMLAttributes<HTMLDivElement>, 'className'> {
  as?: ElementType;
  children: React.ReactNode;
}

const ModalContexntContainer = ({
  as,
  children,
  size = 'md',
  ...props
}: IModalContextProps) => {
  return (
    <ModalProvider size={size}>
      <ModalMain as={as} {...props}>
        {children}
      </ModalMain>
    </ModalProvider>
  );
};

function ModalMain({ children, as = 'div', ...props }: IModalProps) {
  const DynamicTag = as;
  const { size } = useModal();

  return (
    <DynamicTag id="modal-main" className={mainStyle({ size })} {...props}>
      {children}
    </DynamicTag>
  );
}

export const Modal = Object.assign(ModalContexntContainer, {
  Header: ModalHeader,
  Body: ModalBody,
  Footer: ModalFooter,
});

/** Figma Anatomy: `radius lg(16)` · `Background/Overlay` · `shadow/400`. */
const mainStyle = cva(
  'fixed left-1/2 top-1/2 z-modal -translate-x-1/2 -translate-y-1/2 rounded-lg bg-background-overlay shadow-400',
  {
    variants: {
      size: {
        md: 'w-[600px]',
        lg: 'w-[800px]',
        xl: 'w-[1248px]',
      },
    },
  },
);
