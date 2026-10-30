import type { Meta, StoryObj } from '@storybook/react-vite';

import { Modal } from '..';
import { Size } from '../context';
import { Button } from '../../Button';
import * as Icon from '../../../icons';

const meta: Meta<typeof Modal> = {
  title: 'components/Modal',
  component: Modal,
  args: {
    size: 'md',
  },
  argTypes: {
    size: {
      control: 'radio',
      options: ['md', 'lg', 'xl'],
    },
  },
};

export default meta;

type Story = StoryObj<typeof Modal>;

interface IModalDemoProps {
  size: Size;
}

const ModalDemo = ({ size }: IModalDemoProps) => (
  <Modal size={size}>
    <Modal.Header title="제목" subtext="부제 텍스트" onClose={() => {}} />
    <Modal.Body>
      <p className="typo-body-2 text-label-normal">
        Modal 본문 영역입니다. size에 따라 폭이 600(md)/800(lg)/1248(xl)px로
        바뀝니다.
      </p>
    </Modal.Body>
    {/** 버튼 배치는 호출부 몫이다 — Footer는 여백만 쥔다. */}
    <Modal.Footer>
      <div className="flex justify-end gap-4">
        <Button variant="secondary" size="md">
          취소
        </Button>
        <Button variant="primary" size="md">
          확인
        </Button>
      </div>
    </Modal.Footer>
  </Modal>
);

export const Sizes: Story = {
  render: (args) => <ModalDemo size={args.size as Size} />,
};

export const WithIcon: Story = {
  render: () => (
    <Modal size="md">
      <Modal.Header
        title="완료됐습니다"
        subtext="변경 사항이 저장됐어요."
        icon={Icon.CircleCheckSolid}
        iconColor="status-main-positive"
        onClose={() => {}}
      />
      <Modal.Body>
        <p className="typo-body-2 text-label-normal">
          icon prop이 있으면 Figma 스펙대로 제목·부제가 가운데 정렬됩니다.
        </p>
      </Modal.Body>
      <Modal.Footer>
        <div className="flex justify-end">
          <Button variant="primary" size="md">
            확인
          </Button>
        </div>
      </Modal.Footer>
    </Modal>
  ),
};
