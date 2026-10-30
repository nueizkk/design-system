import { screen } from '@testing-library/react';
import { useRender } from 'test-util';

import { Radio } from '..';

describe('기본 동작', () => {
  it('기본값은 선택되지 않은 상태다.', async () => {
    await useRender({ component: <Radio name="test" /> });

    expect(screen.getByRole('radio')).not.toBeChecked();
  });

  it('defaultChecked면 선택된 상태로 시작한다.', async () => {
    await useRender({ component: <Radio name="test" defaultChecked /> });

    expect(screen.getByRole('radio')).toBeChecked();
  });

  it('클릭하면 선택된다.', async () => {
    const { user } = await useRender({ component: <Radio name="test" /> });

    await user.click(screen.getByRole('radio'));

    expect(screen.getByRole('radio')).toBeChecked();
  });

  it('선택된 항목을 다시 클릭해도 해제되지 않는다.', async () => {
    const { user } = await useRender({
      component: <Radio name="test" defaultChecked />,
    });

    await user.click(screen.getByRole('radio'));

    expect(screen.getByRole('radio')).toBeChecked();
  });

  it('disabled면 클릭해도 선택되지 않는다.', async () => {
    const { user } = await useRender({
      component: <Radio name="test" disabled />,
    });

    await user.click(screen.getByRole('radio'));

    expect(screen.getByRole('radio')).not.toBeChecked();
  });
});
