import { ToastVariantType, typeStyle } from "./config";
import * as Icon from '../../icons';
import { Text } from "../Text";

interface IToastProps {
  closeToast?: () => void;
  description?: string;
  type?: ToastVariantType;
}

export const Toast = ({
  closeToast,
  description,
  type = "success",
}: IToastProps) => {
  const { Icon: ToastIcon } = typeStyle[type];

  return (
    <div className="bg-background-elevated text-label-normal shadow-300 flex w-full items-start gap-4 rounded-sm px-6 py-4">
      <ToastIcon
        color={typeStyle[type].color}
        size="sm"
        className="shrink-0"
      />
      <div className="flex min-w-0 flex-1 flex-col gap-0.5">
        <Text variant="body-2" weight="bold">
          {typeStyle[type].title}
        </Text>
        {/** 문구에 \n이 들어오면 줄바꿈으로 보여준다. Modal 설명과 같은 처리다. */}
        <Text variant="caption-1" className="whitespace-pre-line">
          {description}
        </Text>
      </div>
      <Icon.XMark
        size={"xs"}
        onClick={closeToast}
        cursor="pointer"
      />
    </div>
  );
};
