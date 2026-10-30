import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useRender } from 'test-util';

import { Sidebar } from '..';
import * as Icon from '../../../icons';

const MENUS = [
  { value: '/', label: '대시보드', icon: Icon.Dashboard },
  {
    value: '/support',
    label: '고객센터',
    icon: Icon.Support,
    items: [
      { value: '/support/notice', label: '공지사항' },
      { value: '/support/faq', label: '자주 묻는 질문' },
    ],
  },
];

const renderSidebar = (props: Partial<Parameters<typeof Sidebar>[0]> = {}) =>
  useRender({
    component: (
      <Sidebar
        items={MENUS}
        open
        onOpenChange={jest.fn()}
        onSelect={jest.fn()}
        {...props}
      />
    ),
  });

describe('Sidebar', () => {
  it('주입받은 메뉴를 그대로 그린다', async () => {
    await renderSidebar();

    expect(screen.getByText('대시보드')).toBeInTheDocument();
    expect(screen.getByText('고객센터')).toBeInTheDocument();
  });

  it('하위 항목이 있는 메뉴는 아코디언으로 접혀 있다', async () => {
    await renderSidebar();

    expect(screen.queryByText('공지사항')).not.toBeInTheDocument();

    await userEvent.click(screen.getByText('고객센터'));

    expect(screen.getByText('공지사항')).toBeInTheDocument();
  });

  it('단일 메뉴를 누르면 그 value로 onSelect가 불린다', async () => {
    const onSelect = jest.fn();
    await renderSidebar({ onSelect });

    await userEvent.click(screen.getByText('대시보드'));

    expect(onSelect).toHaveBeenCalledWith('/');
  });

  it('하위 항목을 누르면 하위 value로 onSelect가 불린다', async () => {
    const onSelect = jest.fn();
    await renderSidebar({ onSelect });

    await userEvent.click(screen.getByText('고객센터'));
    await userEvent.click(screen.getByText('공지사항'));

    expect(onSelect).toHaveBeenCalledWith('/support/notice');
  });

  it('activeValue가 하위 항목이면 그 아코디언이 열린 채로 시작한다', async () => {
    await renderSidebar({ value: '/support/faq' });

    expect(screen.getByText('자주 묻는 질문')).toBeInTheDocument();
  });

  it('하위 항목이 선택돼도 상위 메뉴 헤더는 활성되지 않는다', async () => {
    await renderSidebar({ value: '/support/faq' });

    expect(screen.getByText('자주 묻는 질문')).toHaveClass('text-primary-normal');
    expect(screen.getByText('고객센터')).not.toHaveClass('text-primary-normal');
  });

  it('접히면 라벨이 사라지고 아이콘만 남는다', async () => {
    await renderSidebar({ open: false });

    expect(screen.queryByText('대시보드')).not.toBeInTheDocument();
    expect(screen.getByLabelText('대시보드')).toBeInTheDocument();
  });

  it('접힌 상태에서 하위가 있는 메뉴를 누르면 선택 대신 rail이 펼쳐진다', async () => {
    const onOpenChange = jest.fn();
    const onSelect = jest.fn();
    await renderSidebar({ open: false, onOpenChange, onSelect });

    await userEvent.click(screen.getByLabelText('고객센터'));

    expect(onOpenChange).toHaveBeenCalledWith(true);
    expect(onSelect).not.toHaveBeenCalled();
  });

  it('접힌 상태에서 하위가 없는 메뉴는 바로 선택된다', async () => {
    const onSelect = jest.fn();
    await renderSidebar({ open: false, onSelect });

    await userEvent.click(screen.getByLabelText('대시보드'));

    expect(onSelect).toHaveBeenCalledWith('/');
  });

  it('펼친 상태의 메뉴 영역은 폭이 고정이다 — 전환 중 눌리지 않는다', async () => {
    const { container } = await renderSidebar({ open: true });

    const menuArea = container.querySelector('.overflow-y-auto');
    expect(menuArea).toHaveClass('w-[220px]');
  });

  it('footer를 넘기지 않으면 푸터가 없다', async () => {
    await renderSidebar();

    expect(screen.queryByText('DS Organization')).not.toBeInTheDocument();
  });

  it('접히면 회사 이름이 사라지고 로고만 남는다', async () => {
    await renderSidebar({
      open: false,
      footer: { companyName: 'DS Organization' },
    });

    expect(screen.queryByText('DS Organization')).not.toBeInTheDocument();
    expect(screen.getByText('D')).toBeInTheDocument();
  });

  it('하단에 회사 이름을 보여준다', async () => {
    await renderSidebar({ footer: { companyName: 'DS Organization' } });

    expect(screen.getByText('DS Organization')).toBeInTheDocument();
  });

  it('로고 URL이 없으면 회사명 머리글자로 대체한다', async () => {
    await renderSidebar({ footer: { companyName: 'Acme' } });

    expect(screen.getByText('A')).toBeInTheDocument();
  });
});
