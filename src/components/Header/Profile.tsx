import { Dropdown } from '../Dropdown';
import { DropdownOptionType } from '../Dropdown/config';
import * as Icon from '../../icons';
import { Text } from '../Text';
import { useStrings } from '../../i18n';

export interface IHeaderProfile {
  /**
   * 화면에 그대로 찍히는 표시 이름. `'홍길동님'`처럼 **완성해서** 넘긴다.
   *
   * 전에는 이름만 받고 DS가 `님`을 붙였는데(`header_name`), 영어 로케일에서는 그
   * 키가 빈 문자열이었다 — 경어 규칙을 디자인 시스템이 알 이유가 없다.
   */
  name?: string;
  /**
   * 이름을 눌렀을 때 뜨는 메뉴. 그룹마다 구분선이 들어간다.
   *
   * 라벨도 동작도 소비앱이 정한다 — `마이페이지`·`로그아웃`이 모든 서비스의 메뉴일
   * 이유가 없고, 조직 전환 같은 항목이 늘 수도 있다. 되돌릴 수 없는 항목은
   * `negative: true`로 경고색을 준다(Figma `38020:2581`의 로그아웃).
   *
   * 안 넘기면 드롭다운 없이 이름만 보인다.
   */
  menu?: DropdownOptionType[][];
  /** 비로그인 표시를 눌렀을 때. */
  onClickLogin?: () => void;
}

interface IProfileProps extends IHeaderProfile {
  /** 로그인 여부. Figma `Header/Profile`의 `login` variant와 같은 축이다. */
  login: boolean;
}

/**
 * 헤더의 사용자 영역(Figma `Header/Profile` 12505:13363).
 *
 * 로그인 상태는 이름 칩과 드롭다운, 비로그인은 흐린 "로그인" 표시다. 둘은 Figma에서
 * 한 컴포넌트의 두 variant라 여기서도 한 파일로 둔다.
 */
function Profile({ login, name = '', menu, onClickLogin }: IProfileProps) {
  const strings = useStrings();

  if (!login) {
    return (
      /**
       * 비로그인 표시(Figma 12505:13364, 81x32). 다른 칩과 모양은 같되 배경
       * (`fill-normal`)만 없어 로그인 상태의 이름 칩과 구분된다.
       *
       * 항상 누를 수 있다 — Figma에 호버 상태가 하나뿐이고, 로그인 화면으로 가는
       * 입구다.
       */
      <div
        className="interaction flex cursor-pointer items-center gap-1 rounded-lg px-2 py-1 after:rounded-lg"
        onClick={onClickLogin}
      >
        <Icon.Profile color="label-disable" cursor="pointer" />
        <Text color="label-disable" variant="body-2" weight="regular">
          {strings['header_login']}
        </Text>
      </div>
    );
  }

  const chip = (
    <div className="interaction bg-fill-normal flex items-center gap-1 rounded-lg px-2 py-1 after:rounded-lg">
      <Icon.Profile color="label-normal" />
      <Text variant="body-2" color="label-normal">
        {name}
      </Text>
    </div>
  );

  /** 메뉴가 없으면 누를 것도 없으므로 드롭다운으로 감싸지 않는다. */
  if (!menu || menu.length === 0) return chip;

  return (
    <Dropdown align="end" options={menu}>
      <Dropdown.Trigger>{chip}</Dropdown.Trigger>
    </Dropdown>
  );
}

export default Profile;
