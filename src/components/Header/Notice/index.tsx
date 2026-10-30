
import NoticeContents from './Contents';
import { INotice } from './Item';
import NoticeTrigger from './Trigger';
import { Popover } from '../../Popover';

export interface IHeaderNotice {
  /**
   * 공지 목록. 빈 배열이면 기능은 있으나 0건이라는 뜻이라 트리거는 남는다.
   *
   * 공지 칩 자체의 노출은 `Header`의 `notice` prop 유무로 정한다 — 안 넘기면
   * 이 서비스에 공지 기능이 없다는 뜻이다(admin이 그렇다).
   */
  items?: INotice[];
  /** 목록의 한 건을 눌렀을 때. */
  onSelect?: (id: string) => void;
  /** "더보기"를 눌렀을 때. */
  onClickMore?: () => void;
}

function Notice({ items, onSelect, onClickMore }: IHeaderNotice) {
  /**
   * 목록에 `N`이 하나라도 있으면 칩에도 붙인다. 안 읽은 공지가 목록에는 표시돼
   * 있는데 칩은 조용한 상태가 생기지 않도록, 같은 `isRead` 하나에서 판단한다.
   */
  const hasUpdate = items?.some(({ isRead }) => !isRead);

  return (
    <Popover align="end">
      <Popover.Trigger>
        <NoticeTrigger hasUpdate={hasUpdate} />
      </Popover.Trigger>
      <NoticeContents
        onClickMore={onClickMore}
        onClickNotice={onSelect}
        notices={items}
      />
    </Popover>
  );
}

export default Notice;
