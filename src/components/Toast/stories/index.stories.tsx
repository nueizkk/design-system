import type { Meta, StoryObj } from "@storybook/react-vite";

import { Toast } from "..";
import { ToastContainer } from "../Container";
import { useToast } from "../useToast";

const meta: Meta<typeof Toast> = {
  title: "components/Toast",
  component: Toast,
};

export default meta;

type Story = StoryObj<typeof Toast>;

export const AllTypes: Story = {
  render: () => (
    <div style={{ display: "flex", flexDirection: "column", gap: 10, width: 320, paddingTop: 40 }}>
      <Toast type="success" description="text" />
      <Toast type="error" description="text" />
    </div>
  ),
};

/** `\n`이 줄바꿈으로 보이는지 확인한다. 긴 줄은 그대로 폭에 맞춰 접힌다. */
export const MultilineDescription: Story = {
  render: () => (
    <div style={{ display: "flex", flexDirection: "column", gap: 10, width: 320, paddingTop: 40 }}>
      <Toast
        type="error"
        description={"출금 요청이 거절되었습니다.\n사유: 일일 한도 초과"}
      />
      <Toast
        type="success"
        description={"저장했습니다.\n변경 내용은 다음 로그인부터 적용됩니다. 긴 줄은 폭에 맞춰 접힙니다."}
      />
    </div>
  ),
};

const UseToastDemo = () => {
  const showToast = useToast();

  return (
    <>
      <ToastContainer />
      <div style={{ display: "flex", gap: 8, paddingTop: 40 }}>
        <button onClick={() => showToast({ type: "success", description: "성공 토스트입니다" })}>
          success 띄우기
        </button>
        <button onClick={() => showToast({ type: "error", description: "실패 토스트입니다" })}>
          error 띄우기
        </button>
      </div>
    </>
  );
};

export const WithUseToast: Story = {
  render: () => <UseToastDemo />,
};
