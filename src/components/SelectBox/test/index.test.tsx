import { act, screen } from '@testing-library/react';
import { useRender } from 'test-util';

import { SelectBox } from '..';
import { SelectBoxOptionType } from '../types';

const options: SelectBoxOptionType[] = [
  { label: '전체', value: 'all' },
  { label: '완료', value: 'done' },
];

describe('기본 동작', () => {
  it('선택된 값이 없으면 placeholder를 보여준다.', async () => {
    await useRender({
      component: <SelectBox size="sm" options={options} placeholder="선택" />,
    });

    expect(screen.getByText('선택')).toBeInTheDocument();
  });

  it('트리거 클릭 시 옵션 목록이 열린다.', async () => {
    const { user } = await useRender({
      component: <SelectBox size="sm" options={options} placeholder="선택" />,
    });

    expect(screen.queryByText('완료')).not.toBeInTheDocument();

    await act(async () => {
      await user.click(screen.getByText('선택'));
    });

    expect(screen.getByText('완료')).toBeInTheDocument();
  });

  it('옵션 클릭 시 onChange가 호출되고 트리거 값이 바뀌며 닫힌다.', async () => {
    const onChange = jest.fn();
    const { user } = await useRender({
      component: (
        <SelectBox
          size="sm"
          options={options}
          placeholder="선택"
          onChange={onChange}
        />
      ),
    });

    await act(async () => {
      await user.click(screen.getByText('선택'));
    });
    await act(async () => {
      await user.click(screen.getByText('완료'));
    });

    expect(onChange).toHaveBeenCalledWith('done');
    expect(screen.getAllByText('완료')).toHaveLength(1);
    expect(screen.queryByText('전체')).not.toBeInTheDocument();
  });

  it('disabled면 클릭해도 열리지 않는다.', async () => {
    const { user } = await useRender({
      component: (
        <SelectBox size="sm" options={options} placeholder="선택" disabled />
      ),
    });

    await act(async () => {
      await user.click(screen.getByText('선택'));
    });

    expect(screen.queryByText('완료')).not.toBeInTheDocument();
  });

  it('error·errorMessage를 넘기면 에러 메시지가 보인다.', async () => {
    await useRender({
      component: (
        <SelectBox
          size="sm"
          options={options}
          placeholder="선택"
          error
          errorMessage="필수 항목입니다"
        />
      ),
    });

    expect(screen.getByText('필수 항목입니다')).toBeInTheDocument();
  });

  it('fieldLabel을 넘기면 트리거 위에 캡션으로 보인다.', async () => {
    await useRender({
      component: (
        <SelectBox
          size="sm"
          options={options}
          placeholder="선택"
          fieldLabel="직업"
        />
      ),
    });

    expect(screen.getByText('직업')).toBeInTheDocument();
  });

  it('바깥을 클릭하면 닫힌다.', async () => {
    const { user } = await useRender({
      component: (
        <div>
          <SelectBox size="sm" options={options} placeholder="선택" />
          <button type="button">outside</button>
        </div>
      ),
    });

    await act(async () => {
      await user.click(screen.getByText('선택'));
    });
    expect(screen.getByText('완료')).toBeInTheDocument();

    await act(async () => {
      await user.click(screen.getByText('outside'));
    });
    expect(screen.queryByText('완료')).not.toBeInTheDocument();
  });
});
