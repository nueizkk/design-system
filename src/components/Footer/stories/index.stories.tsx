import type { Meta, StoryObj } from '@storybook/react-vite';

import { Footer } from '..';

const meta: Meta<typeof Footer> = {
  title: 'components/Footer',
  component: Footer,
  args: {
    info: [
      { label: '고객센터', value: 'cs@0529th.com' },
      { value: '서울특별시 강남구 테헤란로 38길 5, 2층' },
    ],
  },
};

export default meta;

type Story = StoryObj<typeof Footer>;

/** 라벨도 누르면 할 일도 소비앱이 정한다 — DS는 순서대로 그릴 뿐이다. */
export const Default: Story = {
  args: {
    actions: [
      { label: '이용약관', onClick: () => console.log('이용약관') },
      {
        label: '개인정보처리방침',
        onClick: () => console.log('개인정보처리방침'),
        bold: true,
      },
    ],
  },
};

/** 안 넘기면 그 줄 자체가 없다. */
export const WithoutActions: Story = {};

/** 두 개로 고정이 아니다. 늘려도 DS는 손댈 게 없다. */
export const ManyActions: Story = {
  args: {
    actions: [
      { label: '이용약관', onClick: () => {} },
      { label: '개인정보처리방침', onClick: () => {}, bold: true },
      { label: '위치기반서비스 약관', onClick: () => {} },
      { label: '공지사항', onClick: () => {} },
    ],
  },
};

/** 회사 정보도 목록이라 늘릴 수 있다. 사이에 구분선이 들어간다. */
export const ManyInfo: Story = {
  args: {
    actions: [
      { label: '이용약관', onClick: () => {} },
      { label: '개인정보처리방침', onClick: () => {}, bold: true },
    ],
    info: [
      { label: '고객센터', value: 'cs@0529th.com' },
      { label: '사업자등록번호', value: '123-45-67890' },
      { value: '서울특별시 강남구 테헤란로 38길 5, 2층' },
    ],
  },
};

/** 영문. 라벨·주소까지 전부 소비앱이 넘기므로 DS는 문자열을 들고 있지 않다. */
export const English: Story = {
  args: {
    actions: [
      { label: 'Terms of Use', onClick: () => {} },
      { label: 'Privacy Policy', onClick: () => {}, bold: true },
    ],
    info: [
      { label: 'CS', value: 'cs@0529th.com' },
      { value: '2Fl., 5, Teheran-ro 38-gil, Gangnam-gu, Seoul, Korea' },
    ],
  },
};
