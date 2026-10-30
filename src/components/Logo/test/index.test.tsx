import { screen } from '@testing-library/react';
import { useRender } from 'test-util';

import { Logo } from '..';

describe('기본 동작', () => {
  it('type 미지정 시 기본값 basic을 렌더링한다.', async () => {
    await useRender({ component: <Logo /> });

    const clipPath = screen
      .getByTestId('logo')
      .querySelector('g')
      ?.getAttribute('clip-path');
    expect(clipPath).toMatch(/^url\(#clip0_logo_basic-/);
  });

  it('type=white면 white 버전을 렌더링한다.', async () => {
    await useRender({ component: <Logo type="white" /> });

    const clipPath = screen
      .getByTestId('logo')
      .querySelector('g')
      ?.getAttribute('clip-path');
    expect(clipPath).toMatch(/^url\(#clip0_logo_white-/);
  });

  it('여러 개를 동시에 렌더링해도 clipPath id가 서로 겹치지 않는다.', async () => {
    await useRender({
      component: (
        <>
          <Logo />
          <Logo />
        </>
      ),
    });

    const [firstClipPath, secondClipPath] = screen
      .getAllByTestId('logo')
      .map((svg) => svg.querySelector('g')?.getAttribute('clip-path'));

    expect(firstClipPath).not.toBe(secondClipPath);
  });
});
