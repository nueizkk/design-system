import { toast } from 'react-toastify';

import { ToastVariantType } from './config';
import { Toast } from '.';

interface IShowParams {
  description?: string;
  type?: ToastVariantType;
}

export const useToast = () => {
  const show = ({ description, type }: IShowParams) => {
    toast(
      ({ closeToast }) => (
        <Toast description={description} type={type} closeToast={closeToast} />
      ),
      { autoClose: 5000 },
    );
  };

  return show;
};
