import { screen } from '@testing-library/react';
import { useRender } from 'test-util';

import { Pagination } from '../..';

describe('기본 동작', () => {
  it('right 아이콘 버튼을 클릭 시 현재 페이지 1 증가', async () => {
    const spy = jest.fn();
    const currentPage = 1;

    const { user } = await useRender({
      component: (
        <Pagination
          page={currentPage}
          totalItems={10}
          pageSize={3}
          onPageChange={spy}
        />
      ),
    });

    const nextPageButton = screen.getByTestId('right');
    await user.click(nextPageButton);

    expect(spy).toHaveBeenCalledWith(currentPage + 1);
  });

  it('마지막 페이지일 경우 right 아이콘 버튼을 클릭해도 페이지가 이동하지 않는다(함수가 호출되지 않는다)', async () => {
    const spy = jest.fn();
    /** 두 페이지 이상이어야 그려지므로 마지막 페이지(2)에서 본다. */
    const currentPage = 2;

    const { user } = await useRender({
      component: (
        <Pagination
          page={currentPage}
          totalItems={6}
          pageSize={3}
          onPageChange={spy}
        />
      ),
    });

    const nextPageButton = screen.getByTestId('right');
    await user.click(nextPageButton);

    expect(spy).not.toHaveBeenCalled();
  });

  it('left 아이콘 버튼을 클릭 시 한 페이지가 감소하면서 이동한다', async () => {
    const spy = jest.fn();
    const currentPage = 2;

    const { user } = await useRender({
      component: (
        <Pagination
          page={currentPage}
          totalItems={10}
          pageSize={3}
          onPageChange={spy}
        />
      ),
    });

    const prevPageButton = screen.getByTestId('left');
    await user.click(prevPageButton);

    expect(spy).toHaveBeenCalledWith(currentPage - 1);
  });

  it('첫 페이지일 경우 left 아이콘 버튼을 클릭해도 페이지가 이동하지 않는다', async () => {
    const spy = jest.fn();
    const currentPage = 1;

    const { user } = await useRender({
      component: (
        <Pagination
          page={currentPage}
          totalItems={10}
          pageSize={3}
          onPageChange={spy}
        />
      ),
    });

    const prevPageButton = screen.getByTestId('left');
    await user.click(prevPageButton);

    expect(spy).not.toHaveBeenCalled();
  });

  it('전체 페이지가 10 페이지 이하라면 doubleRight 아이콘 버튼을 클릭해도 페이지가 이동하지 않는다', async () => {
    const spy = jest.fn();
    const currentPage = 1;

    const { user } = await useRender({
      component: (
        <Pagination
          page={currentPage}
          totalItems={10}
          pageSize={3}
          onPageChange={spy}
        />
      ),
    });

    const nextStepButton = screen.getByTestId('doubleRight');
    await user.click(nextStepButton);

    expect(spy).not.toHaveBeenCalled();
  });

  it('전체 페이지가 11 페이지 이상이고 현재 페이지가 10 페이지 이하일 경우 doubleRight 아이콘 클릭 시 함수가 호출된다', async () => {
    const spy = jest.fn();
    const currentPage = 9;

    const { user } = await useRender({
      component: (
        <Pagination
          page={currentPage}
          totalItems={50}
          pageSize={3}
          onPageChange={spy}
        />
      ),
    });

    const nextStepButton = screen.getByTestId('doubleRight');
    await user.click(nextStepButton);

    expect(spy).toHaveBeenCalledWith(11);
  });

  it('전체 페이지가 10이상 20이하일 때 현재 페이지가 10~20 사이일 경우 doubleRight 버튼을 클릭해도 함수를 호출하지 않는다', async () => {
    const spy = jest.fn();
    const currentPage = 12;

    const { user } = await useRender({
      component: (
        <Pagination
          page={currentPage}
          totalItems={50}
          pageSize={3}
          onPageChange={spy}
        />
      ),
    });

    const nextStepButton = screen.getByTestId('doubleRight');
    await user.click(nextStepButton);

    expect(spy).not.toHaveBeenCalled();
  });

  it('전체 페이지가 10 페이지 이하라면 doubleLeft 아이콘 버튼을 클릭해도 함수를 호출하지 않는다', async () => {
    const spy = jest.fn();
    const currentPage = 9;

    const { user } = await useRender({
      component: (
        <Pagination
          page={currentPage}
          totalItems={50}
          pageSize={3}
          onPageChange={spy}
        />
      ),
    });

    const prevStepButton = screen.getByTestId('doubleLeft');
    await user.click(prevStepButton);

    expect(spy).not.toHaveBeenCalled();
  });

  it('현재 페이지가 11~20일 때 doubleLeft를 누르면 이전 묶음의 첫 페이지(1)로 이동한다', async () => {
    const spy = jest.fn();
    const currentPage = 12;

    const { user } = await useRender({
      component: (
        <Pagination
          page={currentPage}
          totalItems={50}
          pageSize={3}
          onPageChange={spy}
        />
      ),
    });

    const prevStepButton = screen.getByTestId('doubleLeft');
    await user.click(prevStepButton);

    expect(spy).toHaveBeenCalledWith(1);
  });
});

describe('범위 밖 page 방어', () => {
  const renderWith = (page: number, spy: jest.Mock) =>
    useRender({
      component: (
        <Pagination
          page={page}
          totalItems={130}
          pageSize={10}
          onPageChange={spy}
        />
      ),
    });

  it('숫자가 아니면 1페이지로 접고 그 사실을 알린다', async () => {
    const spy = jest.fn();
    await renderWith(Number('fdafsd'), spy);

    expect(screen.getByText('1')).toHaveClass('text-primary-normal');
    expect(spy).toHaveBeenCalledWith(1);
  });

  it('전체 페이지를 넘으면 마지막 페이지로 접는다', async () => {
    const spy = jest.fn();
    await renderWith(999, spy);

    expect(screen.getByText('13')).toHaveClass('text-primary-normal');
    expect(spy).toHaveBeenCalledWith(13);
  });

  it('0 이하면 1페이지로 접는다', async () => {
    const spy = jest.fn();
    await renderWith(0, spy);

    expect(spy).toHaveBeenCalledWith(1);
  });

  it('범위 안이면 아무것도 알리지 않는다', async () => {
    const spy = jest.fn();
    await renderWith(7, spy);

    expect(spy).not.toHaveBeenCalled();
  });
});

describe('그리지 않는 경우', () => {
  it('0건이면 아무것도 그리지 않는다', async () => {
    await useRender({
      component: (
        <Pagination page={1} totalItems={0} pageSize={10} onPageChange={jest.fn()} />
      ),
    });

    expect(screen.queryByTestId('left')).not.toBeInTheDocument();
  });

  it('0건이면 페이지를 접지도, 밖에 알리지도 않는다', async () => {
    const spy = jest.fn();
    await useRender({
      component: (
        <Pagination page={1} totalItems={0} pageSize={10} onPageChange={spy} />
      ),
    });

    expect(spy).not.toHaveBeenCalled();
  });

  it('한 페이지뿐이면 그리지 않는다', async () => {
    await useRender({
      component: (
        <Pagination page={1} totalItems={7} pageSize={10} onPageChange={jest.fn()} />
      ),
    });

    expect(screen.queryByTestId('left')).not.toBeInTheDocument();
  });

  it('두 페이지부터 그린다', async () => {
    await useRender({
      component: (
        <Pagination page={1} totalItems={11} pageSize={10} onPageChange={jest.fn()} />
      ),
    });

    expect(screen.getByTestId('left')).toBeInTheDocument();
  });

  it('아직 모르면(undefined) 그리지 않는다', async () => {
    await useRender({
      component: (
        <Pagination
          page={1}
          totalItems={undefined}
          pageSize={10}
          onPageChange={jest.fn()}
        />
      ),
    });

    expect(screen.queryByTestId('left')).not.toBeInTheDocument();
  });
});

describe('총 건수를 잠시 모르게 될 때', () => {
  function Switcher({ totalItems }: { totalItems: number | undefined }) {
    return (
      <Pagination
        page={2}
        totalItems={totalItems}
        pageSize={10}
        onPageChange={jest.fn()}
      />
    );
  }

  it('한 번 받은 뒤 undefined가 와도 사라지지 않는다', async () => {
    const { rerender } = await useRender({
      component: <Switcher totalItems={130} />,
    });
    expect(screen.getByTestId('left')).toBeInTheDocument();

    /** suspense 없이 페이지를 넘기면 data가 잠시 undefined가 되는 상황. */
    rerender(<Switcher totalItems={undefined} />);

    expect(screen.getByTestId('left')).toBeInTheDocument();
  });

  it('새로 올라오면 기억이 없다 — 첫 로딩에는 그리지 않는다', async () => {
    const { rerender } = await useRender({
      component: <Switcher totalItems={130} />,
    });
    expect(screen.getByTestId('left')).toBeInTheDocument();

    /** key가 바뀌면 다시 올라온다 — 다른 화면에 갔다 돌아오는 것과 같다. */
    rerender(<Switcher key="remount" totalItems={undefined} />);

    expect(screen.queryByTestId('left')).not.toBeInTheDocument();
  });

  it('0건은 기억하지 않는다 — 결과가 없다는 확정이므로 사라진다', async () => {
    const { rerender } = await useRender({
      component: <Switcher totalItems={130} />,
    });

    rerender(<Switcher totalItems={0} />);

    expect(screen.queryByTestId('left')).not.toBeInTheDocument();
  });
});
