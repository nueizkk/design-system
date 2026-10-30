import { render, screen } from '@testing-library/react';

import { DesignSystemProvider, useStrings } from '..';

const Probe = () => <span>{useStrings()['no_data']}</span>;

describe('i18n', () => {
  it('Provider 없이도 한국어로 동작한다 — 주입에 실패해도 깨지지 않는다.', () => {
    render(<Probe />);

    expect(screen.getByText('데이터가 없습니다.')).toBeInTheDocument();
  });

  it('language="en"이면 영어로 바뀐다.', () => {
    render(
      <DesignSystemProvider language="en">
        <Probe />
      </DesignSystemProvider>,
    );

    expect(screen.getByText('No data to display')).toBeInTheDocument();
  });

  it('language를 생략하면 한국어다.', () => {
    render(
      <DesignSystemProvider>
        <Probe />
      </DesignSystemProvider>,
    );

    expect(screen.getByText('데이터가 없습니다.')).toBeInTheDocument();
  });
});
