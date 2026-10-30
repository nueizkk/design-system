import { useDrawer } from "./context";
import * as Icon from '../../icons';
import { Text } from "../Text";

interface IDrawerHeaderProps {
  title: string;
  subTitle?: string;
}

export function DrawerHeader({ title, subTitle }: IDrawerHeaderProps) {
  const { onClose } = useDrawer();

  return (
    <div className="flex shrink-0 flex-col gap-8 items-end">
      <Icon.XMark size="lg" cursor="pointer" onClick={onClose} />
      <div className="flex flex-col gap-1 w-full">
        <Text variant="subtitle-2" weight="semibold" color="label-strong">
          {title}
        </Text>
        {subTitle && (
          <Text variant="caption-1" color="label-alternative">
            {subTitle}
          </Text>
        )}
      </div>
    </div>
  );
}
