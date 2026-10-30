import { Fragment } from 'react';

import { Text } from '../Text';

export interface IFooterAction {
  /** **이미 번역된** 라벨. DS는 i18n 키를 받지 않는다. */
  label: string;
  /** 눌렀을 때. 새 탭으로 열지 라우팅할지는 소비앱이 정한다. */
  onClick: () => void;
  /** Figma는 `개인정보처리방침`만 굵다. 어느 것을 강조할지는 소비앱이 정한다. */
  bold?: boolean;
}

export interface IFooterInfo {
  /** 값 앞에 붙는 설명. `고객센터`처럼. 없으면 값만 그린다. */
  label?: string;
  value: string;
}

interface IFooterProps {
  /**
   * 눌러서 뭔가 일어나는 줄. 순서대로 그린다 — DS는 라벨의 뜻도 목적지도 모른다.
   *
   * `links`가 아니라 `actions`인 이유: `onClick`만 받으므로 꼭 이동이 아닐 수도
   * 있다(모달을 열 수도 있다). 아래 `info`와 "누르는 것 / 읽는 것"으로 갈린다.
   *
   * 전에는 `url: { terms, privacy }`로 두 개를 이름으로 못 박아 받고 라벨은 DS의
   * i18n에서 꺼냈다. 링크를 늘리거나 문구를 바꾸려면 DS를 고쳐야 했다.
   */
  actions?: IFooterAction[];
  /**
   * 하단 회사 정보. 세로 구분선으로 이어 그린다.
   *
   * 전에는 `email`·`address` 두 개를 이름으로 못 박아 받고 `고객센터` 라벨만 DS의
   * i18n에서 꺼냈다. 사업자등록번호처럼 항목이 늘면 DS를 고쳐야 했다.
   */
  info?: IFooterInfo[];
}

/**
 * 서비스 하단 정보(Figma `11632:1189`, 문서 `33744:1594`).
 *
 * 폭은 부모 콘텐츠 영역을 채우고 내용은 가운데 정렬이다. 높이는 내용에 맡긴다 —
 * 문서의 157px은 기본 내용 기준의 결과값이지 고정값이 아니다.
 */
export const Footer = ({ actions, info }: IFooterProps) => {
  return (
    <div className="w-full px-10 py-9">
      <hr className="bg-line-neutral mb-6 h-px border-none" />
      <div className="flex flex-col items-center gap-6">
        {actions && actions.length > 0 && (
          <div className="flex gap-11">
            {actions.map(({ label, onClick, bold }) => (
              <Text
                key={label}
                variant="caption-1"
                weight={bold ? 'bold' : 'regular'}
                color="label-neutral"
                className="cursor-pointer"
                onClick={onClick}
              >
                {label}
              </Text>
            ))}
          </div>
        )}
        {info && info.length > 0 && (
          <div className="flex items-center gap-2.5">
            {info.map(({ label, value }, i) => (
              <Fragment key={`${label ?? ''}${value}`}>
                {i > 0 && <div className="bg-line-strong h-[10px] w-px" />}
                <div className="flex items-center gap-1">
                  {label && (
                    <Text
                      variant="caption-1"
                      weight="light"
                      color="label-assistive"
                    >
                      {label}
                    </Text>
                  )}
                  <Text
                    variant="caption-1"
                    weight="light"
                    color="label-assistive"
                  >
                    {value}
                  </Text>
                </div>
              </Fragment>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
