import { ReactElement } from 'react';
import { render, RenderOptions } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

type RenderProps = RenderOptions & { component: ReactElement };

export const useRender = ({ component, ...options }: RenderProps) => ({
  user: userEvent.setup(),
  ...render(component, options),
});
