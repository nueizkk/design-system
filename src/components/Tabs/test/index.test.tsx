import { screen } from '@testing-library/react';
import { useRender } from 'test-util';

import { Tabs } from '..';
import { Tab } from '../Tab';

describe('Tab', () => {
  it('active면 굵은 글씨와 밑줄(border-b-2)을 적용한다.', async () => {
    await useRender({
      component: <Tab label="탭1" active onClick={jest.fn()} />,
    });

    expect(screen.getByText('탭1')).toHaveClass('font-bold', 'border-b-2');
  });

  it('active가 아니면 밑줄이 없다.', async () => {
    await useRender({
      component: <Tab label="탭1" active={false} onClick={jest.fn()} />,
    });

    expect(screen.getByText('탭1')).not.toHaveClass('border-b-2');
  });

  it('150px 이상 텍스트는 말줄임표 처리 클래스를 적용한다.', async () => {
    await useRender({
      component: <Tab label="아주 긴 라벨" active={false} onClick={jest.fn()} />,
    });

    expect(screen.getByText('아주 긴 라벨')).toHaveClass(
      'max-w-[150px]',
      'truncate',
    );
  });
});

describe('Tabs', () => {
  it('items를 순서대로 렌더링한다.', async () => {
    await useRender({
      component: (
        <Tabs
          items={[
            { label: 'A', active: true, onClick: jest.fn() },
            { label: 'B', active: false, onClick: jest.fn() },
          ]}
        />
      ),
    });

    expect(screen.getByText('A')).toBeInTheDocument();
    expect(screen.getByText('B')).toBeInTheDocument();
  });
});
