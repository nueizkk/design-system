import { act, screen } from '@testing-library/react';
import { useRender } from 'test-util';

import { Accordion } from '..';
import { AccordionSectionType } from '..';

const sections: AccordionSectionType[] = [
  {
    label: '섹션 A',
    value: 'a',
    options: [
      { label: '옵션 A1', value: 'a1' },
      { label: '옵션 A2', value: 'a2' },
    ],
  },
  {
    label: '섹션 B',
    value: 'b',
    options: [{ label: '옵션 B1', value: 'b1' }],
  },
];

describe('기본 동작', () => {
  it('기본적으로 전부 닫혀 있다.', async () => {
    await useRender({ component: <Accordion sections={sections} /> });

    expect(screen.queryByText('옵션 A1')).not.toBeInTheDocument();
    expect(screen.queryByText('옵션 B1')).not.toBeInTheDocument();
  });

  it('defaultOpenValue로 특정 섹션만 열어둘 수 있다.', async () => {
    await useRender({
      component: <Accordion sections={sections} defaultOpenValue="a" />,
    });

    expect(screen.getByText('옵션 A1')).toBeInTheDocument();
    expect(screen.queryByText('옵션 B1')).not.toBeInTheDocument();
  });

  it('헤더 클릭 시 그 섹션이 열리고, 다른 섹션을 열면 이전 섹션은 닫힌다.', async () => {
    const { user } = await useRender({
      component: <Accordion sections={sections} />,
    });

    await act(async () => {
      await user.click(screen.getByText('섹션 A'));
    });
    expect(screen.getByText('옵션 A1')).toBeInTheDocument();

    await act(async () => {
      await user.click(screen.getByText('섹션 B'));
    });
    expect(screen.queryByText('옵션 A1')).not.toBeInTheDocument();
    expect(screen.getByText('옵션 B1')).toBeInTheDocument();
  });

  it('헤더 클릭 시 onOpenChange가 호출된다.', async () => {
    const onOpenChange = jest.fn();
    const { user } = await useRender({
      component: <Accordion sections={sections} onOpenChange={onOpenChange} />,
    });

    await act(async () => {
      await user.click(screen.getByText('섹션 A'));
    });

    expect(onOpenChange).toHaveBeenCalledWith('a');
  });

  it('옵션 클릭 시 onSelect가 호출되고, 선택은 헤더로 번지지 않은 채 유지된다.', async () => {
    const onSelect = jest.fn();
    const { user } = await useRender({
      component: (
        <Accordion
          sections={sections}
          defaultOpenValue="a"
          onSelect={onSelect}
        />
      ),
    });

    await act(async () => {
      await user.click(screen.getByText('옵션 A1'));
    });
    expect(onSelect).toHaveBeenCalledWith('a', 'a1');

    await act(async () => {
      await user.click(screen.getByText('섹션 B'));
    });

    expect(screen.getByText('옵션 B1')).toBeInTheDocument();
    // 하위 옵션이 선택돼도 그 헤더는 활성되지 않는다.
    expect(screen.getByText('섹션 A')).not.toHaveClass('text-primary-normal');
    expect(screen.getByText('섹션 B')).not.toHaveClass('text-primary-normal');

    // 선택 자체는 유지된다 — 섹션 A를 다시 열면 옵션 A1이 그대로 활성이다.
    await act(async () => {
      await user.click(screen.getByText('섹션 A'));
    });
    expect(screen.getByText('옵션 A1')).toHaveClass('text-primary-normal');
  });
});
