import { ToastContainer as Container } from 'react-toastify';

import './style.css';
import { useGetIsDarkMode } from '../utils/useGetIsDarkMode';

export const ToastContainer = () => {
  const isDarkMode = useGetIsDarkMode();

  return (
    <Container
      position="top-right"
      className="rounded-sm"
      autoClose={5000}
      hideProgressBar={true}
      newestOnTop={false}
      closeOnClick={false}
      rtl={false}
      draggable
      closeButton={false}
      toastStyle={{ padding: 0 }}
      theme={isDarkMode ? 'dark' : 'light'}
    />
  );
};
