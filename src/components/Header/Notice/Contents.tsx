
import NoticeItem, { INotice } from './Item';
import * as Icon from '../../../icons';
import { Text } from '../../Text';
import { useStrings } from '../../../i18n';

interface INoticeContentsProps {
  onClickMore?: () => void;
  onClickNotice?: (id: string) => void;
  notices?: INotice[];
}

const NoticeContents = ({
  onClickMore,
  onClickNotice,
  notices,
}: INoticeContentsProps) => {
  const strings = useStrings();
  return (
    <div className="shadow-300 bg-background-elevated rounded-sm flex w-[360px] flex-col gap-6 p-4">
      <div className="flex items-center justify-between">
        <Text variant="body-1" weight="bold">
          {strings['notice']}
        </Text>
        <div
          className="flex cursor-pointer items-center gap-0.5"
          onClick={onClickMore}
        >
          <Text variant="caption-2" color="status-main-standby">
            {strings['see_more']}
          </Text>
          <Icon.ChevronRight color="status-main-standby" size="xs" />
        </div>
      </div>
      <div className="flex flex-col gap-4">
        {notices &&
          notices.map((notice) => (
            <NoticeItem
              key={notice.id}
              notice={notice}
              onClickNotice={onClickNotice}
            />
          ))}
      </div>
    </div>
  );
};

export default NoticeContents;
