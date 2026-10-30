import { useState } from 'react';

import type { Meta, StoryObj } from '@storybook/react-vite';

import { Button } from '../../components/Button';
import { Drawer } from '../../components/Drawer';
import { Dropdown } from '../../components/Dropdown';
import { Modal } from '../../components/Modal';
import { ToastContainer } from '../../components/Toast/Container';
import { useToast } from '../../components/Toast/useToast';

const meta: Meta = { title: 'tokens/zIndex' };
export default meta;

type Story = StoryObj;

const OPTIONS = [
  [
    { value: 'a', label: '옵션 A', onClick: () => {} },
    { value: 'b', label: '옵션 B', onClick: () => {} },
  ],
];

/**
 * 실제 겹침 검증. 전부 켠 상태에서 위에서부터 toast > popover > modal > drawer가
 * 보여야 한다. Modal은 이번에 처음 z-index를 갖게 된 레이어라 특히 중요하다.
 */
const ScenarioDemo = () => {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const showToast = useToast();

  return (
    <div style={{ padding: 24 }}>
      <ToastContainer />
      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
        <Button size="md" onClick={() => setDrawerOpen(true)}>
          1. Drawer 열기
        </Button>
        <Button size="md" onClick={() => setModalOpen(true)}>
          2. Modal 열기
        </Button>
        <Button
          size="md"
          onClick={() => showToast({ type: 'success', description: 'toast가 제일 위' })}
        >
          3. Toast 띄우기
        </Button>
      </div>

      <Drawer isOpen={drawerOpen} onClose={() => setDrawerOpen(false)}>
        <Drawer.Header title="Drawer · 1400" />
        <Drawer.Body>
          <p>drawer · 1400</p>
        </Drawer.Body>
      </Drawer>

      {modalOpen && (
        <Modal size="md">
          <Modal.Header title="Modal · 1500" onClose={() => setModalOpen(false)} />
          <Modal.Body>
            <p className="typo-body-2 text-label-normal">
              모달 안에서 Dropdown을 열어 popover(1600)가 모달 위로 나오는지 본다.
            </p>
            <div style={{ paddingTop: 12 }}>
              <Dropdown options={OPTIONS}>
                <Dropdown.Trigger>
                  <Button variant="secondary" size="sm">
                    Dropdown 열기
                  </Button>
                </Dropdown.Trigger>
              </Dropdown>
            </div>
          </Modal.Body>
        </Modal>
      )}
    </div>
  );
};

export const Scenario: Story = { render: () => <ScenarioDemo /> };
