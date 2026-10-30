import React from 'react';

interface IModalBodyProps {
  children: React.ReactNode;
}

function ModalBody({ children }: IModalBodyProps) {
  return (
    <div className="max-h-[600px] w-full overflow-y-auto px-9 py-4">
      {children}
    </div>
  );
}

export default ModalBody;
