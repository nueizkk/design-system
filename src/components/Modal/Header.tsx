import { TokenSemanticColorType } from 'tokens';

import * as Icon from '../../icons';
import { IconComponentType } from '../../icons';
import { cn } from '../utils/cn';

interface IModalHeaderProps {
  title: string;
  subtext?: string;
  /** Figma는 56px(`3xl`) 자리만 예약하고 어떤 아이콘인지는 정하지 않는다. */
  icon?: IconComponentType;
  /** 성공/경고처럼 의미에 따라 달라지므로 호출부가 정한다. 기본은 label-normal. */
  iconColor?: TokenSemanticColorType;
  onClose?: () => void;
  closeDisabled?: boolean;
}

function ModalHeader({
  title,
  subtext,
  icon: HeaderIcon,
  iconColor,
  onClose,
  closeDisabled = false,
}: IModalHeaderProps) {
  return (
    <div className="w-full flex items-start gap-2.5 rounded-t-lg px-9 pt-9 pb-4">
      <div
        className={cn(
          'flex flex-1 flex-col gap-3',
          HeaderIcon ? 'items-center text-center' : 'items-start text-start',
        )}
      >
        {HeaderIcon && <HeaderIcon size="3xl" color={iconColor} />}
        <h6 className="typo-subtitle-2 text-label-normal whitespace-pre-wrap font-semibold">
          {title}
        </h6>
        {subtext && (
          <p className="typo-body-2 text-label-alternative whitespace-pre-line">
            {subtext}
          </p>
        )}
      </div>
      {onClose && (
        <Icon.XMark
          cursor={closeDisabled ? 'not-allowed' : 'pointer'}
          onClick={() => {
            !closeDisabled && onClose();
          }}
        />
      )}
    </div>
  );
}

export default ModalHeader;
