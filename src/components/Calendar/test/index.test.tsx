import { screen } from '@testing-library/react';
import { advanceTo, clear } from 'jest-date-mock';
import { useRender } from 'test-util';

import { Calendar } from '..';

describe('내부 동작', () => {
  it('date 없을 때 시스템 시간 사용하여 달력 그려진다', async () => {
    const testDate = new Date(2002, 9, 11);
    advanceTo(testDate);

    await useRender({
      component: (
        <Calendar
          startDate={null}
          endDate={null}
          setStartDate={() => {}}
          setEndDate={() => {}}
        />
      ),
    });

    const currentMonthYear = screen.getByText('October 2002');
    expect(currentMonthYear).toBeInTheDocument();
  });

  it('start date 값을 설정하면 start date 값의 달과 연도가 올바르게 텍스트로 표시된다', async () => {
    await useRender({
      component: (
        <Calendar
          startDate={'2020-05-11'}
          endDate={null}
          setStartDate={() => {}}
          setEndDate={() => {}}
        />
      ),
    });

    const currentMonthYear = screen.getByText('May 2020');
    expect(currentMonthYear).toBeInTheDocument();
  });

  it('start date 값 없이 end date 값을 설정하면 end date 값의 달과 연도가 올바르게 텍스트로 표시된다', async () => {
    await useRender({
      component: (
        <Calendar
          startDate={null}
          endDate={'2021-11-14'}
          setStartDate={() => {}}
          setEndDate={() => {}}
        />
      ),
    });

    const currentMonthYear = screen.getByText('November 2021');
    expect(currentMonthYear).toBeInTheDocument();
  });

  it('설정된 시작 날짜, 끝 날짜, 사이 날짜의 배경색이 알맞게 들어간다', async () => {
    await useRender({
      component: (
        <Calendar
          startDate={'2020-05-11'}
          endDate={'2020-05-18'}
          setStartDate={() => {}}
          setEndDate={() => {}}
        />
      ),
    });

    const startDate = screen.getByTestId('2020-05-11');
    const endDate = screen.getByTestId('2020-05-18');
    const betweenDate = screen.getByTestId('2020-05-14');
    expect(startDate).toHaveClass('bg-primary-normal');
    expect(endDate).toHaveClass('bg-primary-normal');
    expect(betweenDate).toHaveClass('bg-interaction-active');
  });
});

describe('사용자 동작 - 날짜 클릭', () => {
  it('maxDate 이후 날짜 클릭 불가하다', async () => {
    const testDate = new Date(2002, 9, 11);
    advanceTo(testDate);

    const setStartDate = jest.fn();
    const setEndDate = jest.fn();

    const { user } = await useRender({
      component: (
        <Calendar
          startDate={null}
          endDate={null}
          setStartDate={setStartDate}
          setEndDate={setEndDate}
          maxDate="2002-10-11"
        />
      ),
    });

    const afterMaxDate = screen.getByTestId('2002-10-15');
    await user.click(afterMaxDate);

    expect(setStartDate).not.toHaveBeenCalled();
    expect(setEndDate).not.toHaveBeenCalled();

    clear();
  });

  it('설정한 start date, end date 없을 때 date 클릭 시 해당 date 넣어서 setStartDate 호출한다', async () => {
    const testDate = new Date(2002, 9, 11);
    advanceTo(testDate);

    const setStartDate = jest.fn();
    const setEndDate = jest.fn();

    const { user } = await useRender({
      component: (
        <Calendar
          startDate={null}
          endDate={null}
          setStartDate={setStartDate}
          setEndDate={setEndDate}
        />
      ),
    });

    const beStartDate = screen.getByTestId('2002-10-11');
    await user.click(beStartDate);

    expect(setStartDate).toHaveBeenCalledWith('2002-10-11');
    expect(setEndDate).not.toHaveBeenCalled();

    clear();
  });

  it('설정한 start date 있고 end date 없을 때 start date 이전 날짜 클릭 시 해당 date 넣어서 setStartDate 호출한다', async () => {
    const setStartDate = jest.fn();
    const setEndDate = jest.fn();

    const { user } = await useRender({
      component: (
        <Calendar
          startDate={'2002-10-05'}
          endDate={null}
          setStartDate={setStartDate}
          setEndDate={setEndDate}
        />
      ),
    });

    const beEndDate = screen.getByTestId('2002-10-01');
    await user.click(beEndDate);

    expect(setStartDate).toHaveBeenCalledWith('2002-10-01');
    expect(setEndDate).not.toHaveBeenCalled();
  });

  it('설정한 start date 있고 end date 없을 때 start date 이후 날짜 클릭 시 해당 date 넣어서 setEndDate 호출한다', async () => {
    const setStartDate = jest.fn();
    const setEndDate = jest.fn();

    const { user } = await useRender({
      component: (
        <Calendar
          startDate={'2002-10-05'}
          endDate={null}
          setStartDate={setStartDate}
          setEndDate={setEndDate}
        />
      ),
    });

    const beEndDate = screen.getByTestId('2002-10-11');
    await user.click(beEndDate);

    expect(setStartDate).not.toHaveBeenCalled();
    expect(setEndDate).toHaveBeenCalledWith('2002-10-11');
  });

  it('설정한 start date 없고 end date 있을 때 end date 이전 날짜 클릭 시 해당 date 넣어서 setStartDate 호출한다', async () => {
    const setStartDate = jest.fn();
    const setEndDate = jest.fn();

    const { user } = await useRender({
      component: (
        <Calendar
          startDate={null}
          endDate={'2002-10-20'}
          setStartDate={setStartDate}
          setEndDate={setEndDate}
        />
      ),
    });

    const beStartDate = screen.getByTestId('2002-10-11');
    await user.click(beStartDate);

    expect(setStartDate).toHaveBeenCalledWith('2002-10-11');
    expect(setEndDate).not.toHaveBeenCalled();
  });

  it('설정한 start date 없고 end date 있을 때 end date 이후 날짜 클릭 시 해당 date 넣어서 setStartDate 호출하고, null 넣어서 setEndDate 호출한다', async () => {
    const setStartDate = jest.fn();
    const setEndDate = jest.fn();

    const { user } = await useRender({
      component: (
        <Calendar
          startDate={null}
          endDate={'2002-10-20'}
          setStartDate={setStartDate}
          setEndDate={setEndDate}
        />
      ),
    });

    const beStartDate = screen.getByTestId('2002-10-25');
    await user.click(beStartDate);

    expect(setStartDate).toHaveBeenCalledWith('2002-10-25');
    expect(setEndDate).toHaveBeenCalledWith(null);
  });
});

describe('사용자 동작 - 월/연 클릭', () => {
  it('이전 달 이동 클릭 시 지난 달로 이동하여 텍스트에 표시된다', async () => {
    const testDate = new Date(2002, 9, 11);
    advanceTo(testDate);

    const { user } = await useRender({
      component: (
        <Calendar
          startDate={null}
          endDate={null}
          setStartDate={() => {}}
          setEndDate={() => {}}
        />
      ),
    });

    const previousMonthButton = screen.getByTestId('previousMonth');
    await user.click(previousMonthButton);

    const currentMonthYear = screen.getByText('September 2002');
    expect(currentMonthYear).toBeInTheDocument();

    clear();
  });

  it('다음 달 이동 클릭 시 다음 달로 이동하여 텍스트에 표시된다', async () => {
    const testDate = new Date(2002, 9, 11);
    advanceTo(testDate);

    const { user } = await useRender({
      component: (
        <Calendar
          startDate={null}
          endDate={null}
          setStartDate={() => {}}
          setEndDate={() => {}}
        />
      ),
    });

    const nextMonthButton = screen.getByTestId('nextMonth');
    await user.click(nextMonthButton);

    const currentMonthYear = screen.getByText('November 2002');
    expect(currentMonthYear).toBeInTheDocument();

    clear();
  });

  it('상단 버튼을 눌러 navigation을 열고 클릭 후 나오면 클릭한 연도와 달로 이동한여 텍스트에 표시된다', async () => {
    const testDate = new Date(2015, 9, 11);
    advanceTo(testDate);

    const { user } = await useRender({
      component: (
        <Calendar
          startDate={null}
          endDate={null}
          setStartDate={() => {}}
          setEndDate={() => {}}
        />
      ),
    });

    const navigationButton = screen.getByText('October 2015');
    await user.click(navigationButton);

    const year = screen.getByText('2008');
    const month = screen.getByText('May');

    await user.click(year);
    await user.click(month);

    const headerPreview = screen.getByText('May 2008');
    await user.click(headerPreview);

    const currentMonthYear = screen.getByText('May 2008');
    expect(currentMonthYear).toBeInTheDocument();
  });

  it('navigation 화면에서 이전/다음 버튼을 누르면 미리보기 월이 바뀐다', async () => {
    const testDate = new Date(2002, 9, 11);
    advanceTo(testDate);

    const { user } = await useRender({
      component: (
        <Calendar
          startDate={null}
          endDate={null}
          setStartDate={() => {}}
          setEndDate={() => {}}
        />
      ),
    });

    await user.click(screen.getByText('October 2002'));
    expect(screen.getByText('October 2002')).toBeInTheDocument();

    await user.click(screen.getByTestId('previousMonth'));
    expect(screen.getByText('September 2002')).toBeInTheDocument();

    await user.click(screen.getByTestId('nextMonth'));
    await user.click(screen.getByTestId('nextMonth'));
    expect(screen.getByText('November 2002')).toBeInTheDocument();

    clear();
  });

  it('navigation 화면에서 Today를 누르면 미리보기가 오늘이 보이는 달로 돌아온다', async () => {
    const testDate = new Date(2002, 9, 11);
    advanceTo(testDate);

    const { user } = await useRender({
      component: (
        <Calendar
          startDate={null}
          endDate={null}
          setStartDate={() => {}}
          setEndDate={() => {}}
        />
      ),
    });

    await user.click(screen.getByText('October 2002'));
    await user.click(screen.getByTestId('previousMonth'));
    expect(screen.getByText('September 2002')).toBeInTheDocument();

    await user.click(screen.getByText('오늘'));
    expect(screen.getByText('October 2002')).toBeInTheDocument();

    clear();
  });

  it('Today 클릭 시 오늘이 보이는 달로 돌아온다', async () => {
    const testDate = new Date(2002, 9, 11);
    advanceTo(testDate);

    const { user } = await useRender({
      component: (
        <Calendar
          startDate={null}
          endDate={null}
          setStartDate={() => {}}
          setEndDate={() => {}}
        />
      ),
    });

    const nextMonthButton = screen.getByTestId('nextMonth');
    await user.click(nextMonthButton);
    expect(screen.getByText('November 2002')).toBeInTheDocument();

    await user.click(screen.getByText('오늘'));

    expect(screen.getByText('October 2002')).toBeInTheDocument();

    clear();
  });
});

describe('오늘 날짜 표시', () => {
  it('오늘 날짜엔 항상 원형 테두리가 적용된다', async () => {
    const testDate = new Date(2002, 9, 11);
    advanceTo(testDate);

    await useRender({
      component: (
        <Calendar
          startDate={null}
          endDate={null}
          setStartDate={() => {}}
          setEndDate={() => {}}
        />
      ),
    });

    const todayCell = screen.getByTestId('2002-10-11');
    expect(todayCell).toHaveClass('border-primary-normal', 'rounded-full');

    clear();
  });
});
