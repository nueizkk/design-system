import { Text } from '../../Text';
import { useStrings } from '../../../i18n';
import { TableSizeType } from '../types';

/**
 * 데이터 행 영역 전체를 대체하는 빈 상태(Figma `NoData` 36926:20207).
 *
 * 높이가 `size`에서 나온다 — 전에는 호출부가 `emptyClass`로 매번 적었고(22곳),
 * `!h-[248px]`처럼 `!important`까지 붙은 곳이 넷 있었다.
 */
const HEIGHT: Record<TableSizeType, string> = {
  sm: 'h-[240px]',
  lg: 'h-[400px]',
};

export function NoDataRow({ size = 'lg' }: { size?: TableSizeType }) {
  const strings = useStrings();

  return (
    <div className={`flex w-full items-center justify-center ${HEIGHT[size]}`}>
      <Text variant="body-1" color="label-normal">
        {strings['no_data']}
      </Text>
    </div>
  );
}

export default NoDataRow;
