import { screen } from '@testing-library/react';
import { useRender } from 'test-util';

import { Status } from '..';

describe('기본 동작', () => {
  it('label을 표시한다.', async () => {
    await useRender({ component: <Status type="positive" label="완료" /> });

    expect(screen.getByText('완료')).toBeInTheDocument();
  });

  it.each(['positive', 'ongoing', 'off', 'cautionary', 'negative'] as const)(
    'type=%s여도 label을 표시한다.',
    async (type) => {
      await useRender({ component: <Status type={type} label="text" /> });

      expect(screen.getByText('text')).toBeInTheDocument();
    },
  );
});
