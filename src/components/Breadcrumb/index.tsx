import { Fragment } from 'react';

import * as Icon from '../../icons';
import { Text } from '../Text';

interface IBreadcrumbProps {
  /** 앞에서 뒤로 경로 순서. 마지막 항목이 현재 위치라 글자색이 진하다. */
  items: string[];
}

/**
 * 현재 위치를 경로로 보여준다.
 *
 * `className`을 받지 않는다 — 시각 스펙을 밖에서 덮는 통로라 Figma 완전싱크와
 * 충돌한다. 바깥 여백이 필요하면 감싸는 쪽이 정한다.
 */
export const Breadcrumb = ({ items }: IBreadcrumbProps) => {
  return (
    /** 높이 18은 `caption-1`의 줄높이이자 Figma 인스턴스 실측(36603:13617)이다. */
    <div className="flex h-[18px] items-center gap-2">
      {items.map((title, idx) => (
        <Fragment key={idx}>
          {idx > 0 && (
            <Icon.ChevronRight
              color="label-assistive"
              size="xs"
            />
          )}
          <Text
            variant="caption-1"
            color={
              idx === items.length - 1 ? 'label-neutral' : 'label-assistive'
            }
          >
            {title}
          </Text>
        </Fragment>
      ))}
    </div>
  );
};
