import * as Icon from '../../../icons';
import { Text } from '../../Text';
import { useStrings } from '../../../i18n';

interface INoticeTriggerProps {
  /** 안 읽은 공지가 있는지. 아이콘 좌상단에 파란 `N`이 붙는다. */
  hasUpdate?: boolean;
}

const NoticeTrigger = ({ hasUpdate }: INoticeTriggerProps) => {
  const strings = useStrings();

  return (
    <div className="interaction flex cursor-pointer items-center gap-1 rounded-lg px-2 py-1 after:rounded-lg">
      {/**
        * 아이콘을 한 겹 감싸 배지를 **손자로** 내린다. `.interaction`이 직계 자식
        * 전부에 `relative`를 걸기 때문에, 배지를 칩 바로 아래 두면 기준점이 칩이
        * 아니라 형제 요소가 되어 엉뚱한 자리로 간다.
        */}
      <span className="relative">
        <Icon.Notice />
        {hasUpdate && (
          /**
           * Figma `Header/Notice`의 `update` 프레임(`16793:50257`). 칩 기준
           * `(6, 6)`에 10×10인데, 칩의 `px-2`·`py-1`을 빼면 아이콘 기준 `(-2, 2)`다.
           *
           * 글자 8px은 타이포 스케일에 없는 값이다(가장 작은 `caption-2`가 10px).
           * 배지 지름이 10px이라 스케일 안에서는 담기지 않아 실측값을 쓴다.
           */
          <span className="bg-status-main-standby absolute left-[-2px] top-[2px] flex size-[10px] items-center justify-center rounded-sm">
            <span className="text-static-white text-[8px] font-bold leading-none">
              N
            </span>
          </span>
        )}
      </span>
      <Text variant="body-2" color="label-normal">
        {strings['notice']}
      </Text>
    </div>
  );
};

export default NoticeTrigger;
