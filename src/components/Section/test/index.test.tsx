import { screen } from '@testing-library/react';
import { useRender } from 'test-util';

import { Section } from '..';

describe('기본 동작', () => {
  it('size=sm이면 rounded-sm p-6 클래스를 적용한다.', async () => {
    await useRender({ component: <Section size="sm">content</Section> });

    expect(screen.getByText('content')).toHaveClass('rounded-sm', 'p-6');
  });

  it('size 미지정 시 기본값 lg(rounded-lg p-10)를 적용한다.', async () => {
    await useRender({ component: <Section>content</Section> });

    expect(screen.getByText('content')).toHaveClass('rounded-lg', 'p-10');
  });
});
