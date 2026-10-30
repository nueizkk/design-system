import { act, fireEvent, screen, waitFor } from '@testing-library/react';
import { useRender } from 'test-util';

import { Tooltip } from '..';

function Demo({ label }: { label: string }) {
  return (
    <Tooltip label={label}>
      <Tooltip.Trigger>
        <button type="button">target</button>
      </Tooltip.Trigger>
    </Tooltip>
  );
}

const hoverWrapper = () =>
  screen.getByText('target').parentElement!.parentElement!;

describe('Tooltip', () => {
  it('hover 전에는 뜨지 않는다.', async () => {
    await useRender({ component: <Demo label="도움말" /> });

    expect(screen.queryByText('도움말')).not.toBeInTheDocument();
  });

  it('트리거에 hover하면 label을 보여주고, 벗어나면 닫힌다.', async () => {
    await useRender({ component: <Demo label="도움말" /> });

    await act(async () => {
      fireEvent.mouseEnter(hoverWrapper());
    });
    expect(screen.getByText('도움말')).toBeInTheDocument();

    await act(async () => {
      fireEvent.mouseLeave(hoverWrapper());
    });
    await waitFor(() => {
      expect(screen.queryByText('도움말')).not.toBeInTheDocument();
    });
  });

  it('클릭은 관여하지 않는다 — 열린 채로 눌러도 닫히지 않는다.', async () => {
    const { user } = await useRender({ component: <Demo label="도움말" /> });

    await act(async () => {
      fireEvent.mouseEnter(hoverWrapper());
    });
    await act(async () => {
      await user.click(screen.getByText('target'));
    });

    expect(screen.getByText('도움말')).toBeInTheDocument();
  });
});
