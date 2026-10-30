import { getCheckedState, type IStatusOption } from './config';
import { Checkbox } from '../../../Checkbox';
import { Status } from '../../../Status';
import { Text } from '../../../Text';
import { cn } from '../../../utils/cn';

interface IStatusOptionNodeProps {
  option: IStatusOption;
  /**
   * StatusFilter의 value와 같은 "체크된 말단 값 목록"이다. 이 컴포넌트엔
   * option.value(노드 자신의 id)가 따로 있어 헷갈리지 않게 구분한 이름이다.
   */
  checkedValues: string[];
  onToggle: (option: IStatusOption) => void;
}

/**
 * 옵션 트리를 깊이 제한 없이 재귀적으로 그린다. 한 단계 내려갈 때마다
 * pl-6(24px)씩 들여쓰고, 상위 노드는 자기 행과 하위 목록을 gap-3으로,
 * 같은 단계의 형제끼리는 gap-2.5로 벌린다(Figma node 8427:21316).
 */
export const StatusOptionNode = ({
  option,
  checkedValues,
  onToggle,
}: IStatusOptionNodeProps) => {
  const hasChildren = Boolean(option.children?.length);

  return (
    <div className={cn('flex flex-col', hasChildren && 'gap-3')}>
      <label className="flex w-fit cursor-pointer items-center gap-2">
        <Checkbox
          checked={getCheckedState(option, checkedValues)}
          onChange={() => onToggle(option)}
        />
        {option.type ? (
          <Status type={option.type} label={option.label} />
        ) : (
          <Text variant="body-2" color="label-normal">
            {option.label}
          </Text>
        )}
      </label>
      {hasChildren && (
        <div className="flex flex-col gap-2.5 pl-6">
          {option.children?.map((child) => (
            <StatusOptionNode
              key={child.value}
              option={child}
              checkedValues={checkedValues}
              onToggle={onToggle}
            />
          ))}
        </div>
      )}
    </div>
  );
};
