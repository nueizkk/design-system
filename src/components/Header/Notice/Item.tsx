import { useState } from 'react';
import dayjs from 'dayjs';


import { usePopover } from '../../Popover/context';
import { Text } from '../../Text';
import { cn } from '../../utils/cn';
import { DATE_FORMAT } from '../../utils/date';
import { useStrings } from '../../../i18n';

export interface INotice {
  /** 눌렀을 때 `onSelect`로 돌려줄 식별자. uuid인지 숫자인지는 서비스 사정이다. */
  id: string;
  title: string;
  /** 날짜로 그린다(`YYYY-MM-DD`). dayjs가 파싱할 수 있는 값이면 된다. */
  createdAt: string;
  /** 안 읽었으면 제목 옆과 공지 칩에 파란 `N`이 붙는다. */
  isRead: boolean;
  /** `중요`(파랑) / `일반`(회색) 배지를 가른다. 정렬은 DS가 하지 않는다. */
  isImportant: boolean;
}

interface INoticeItemProps {
  notice: INotice;
  onClickNotice?: (id: string) => void;
}

const NoticeItem = ({ notice, onClickNotice }: INoticeItemProps) => {
  const strings = useStrings();
  const [isHovered, setIsHovered] = useState(false);

  const { toggle } = usePopover();
  return (
    <div
      className="flex cursor-pointer flex-col gap-2"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={() => {
        onClickNotice?.(notice.id);
        toggle();
      }}
    >
      <div className="flex items-center gap-2">
        <div
          /**
           * `flex`가 없으면 높이가 28이 된다 — 안쪽 글자는 `caption-2`(줄높이 16)인데
           * 칩 자신은 블록이라 루트의 줄높이 24를 따르기 때문이다. Figma는 20이다.
           */
          className={cn(
            'flex items-center rounded-md px-2.5 py-0.5',
            notice.isImportant ? 'bg-primary-normal' : 'bg-fill-normal',
          )}
        >
          <Text
            variant="caption-2"
            weight="bold"
            color={notice.isImportant ? 'static-white' : 'label-neutral'}
          >
            {notice.isImportant ? strings['important'] : strings['general']}
          </Text>
        </div>
        <Text variant="caption-2" color="label-alternative">
          {dayjs(notice.createdAt).format(DATE_FORMAT)}
        </Text>
      </div>
      <div className="flex gap-1">
        <Text
          variant="body-2"
          className="overflow-hidden text-ellipsis whitespace-nowrap"
          color={isHovered ? 'label-alternative' : 'label-normal'}
        >
          {notice.title}
        </Text>
        {!notice.isRead && (
          <Text variant="caption-2" weight="bold" color="status-main-standby">
            N
          </Text>
        )}
      </div>
    </div>
  );
};

export default NoticeItem;
