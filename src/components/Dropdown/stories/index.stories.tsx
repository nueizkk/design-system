import type { Meta, StoryObj } from '@storybook/react-vite';

import { Dropdown } from '..';
import { DropdownOptionType } from '../config';
import { Button } from '../../Button';
import * as Icon from '../../../icons';

const meta: Meta<typeof Dropdown> = {
  title: 'components/Dropdown',
  component: Dropdown,
};

export default meta;

type Story = StoryObj<typeof Dropdown>;

const options: DropdownOptionType[][] = [
  [
    { value: 'en', label: 'English', leftIcon: Icon.Eng, onClick: () => {} },
    { value: 'ko', label: '한국어', leftIcon: Icon.Kor, onClick: () => {} },
  ],
  [
    { value: 'edit', label: '수정하기', onClick: () => {} },
    { value: 'archive', label: '보관하기', disabled: true, onClick: () => {} },
  ],
  [{ value: 'delete', label: '삭제하기', negative: true, onClick: () => {} }],
];

export const Basic: Story = {
  render: () => (
    <div style={{ paddingBottom: 200, paddingLeft: 300 }}>
      <Dropdown options={options}>
        <Dropdown.Trigger>
          <Button size="md" variant="secondary" onClick={() => {}}>
            메뉴 열기
          </Button>
        </Dropdown.Trigger>
      </Dropdown>
    </div>
  ),
};

export const RepositionOnScroll: Story = {
  render: () => (
    <div style={{ height: 4000, paddingTop: 1500, paddingLeft: 300 }}>
      <p style={{ marginBottom: 8, fontSize: 12, color: '#888' }}>
        열고 나서 페이지를 스크롤해보세요 — 패널이 트리거를 따라 움직이고,
        트리거가 화면 밖으로 완전히 나가면 자동으로 닫힙니다.
      </p>
      <Dropdown options={options}>
        <Dropdown.Trigger>
          <Button size="md" variant="secondary" onClick={() => {}}>
            스크롤해보세요
          </Button>
        </Dropdown.Trigger>
      </Dropdown>
    </div>
  ),
};
