import { colors } from './palette';

/**
 * @deprecated 팔레트 키를 직접 받는 모드. 외부는 시맨틱 컬러만 소비하는 방향이라
 * isHex: true 로 hex 문자열을 넘기는 사용만 남긴다.
 */
type ColorType = {
  isHex: false;
  color: keyof typeof colors;
};

type HexColorType = {
  isHex: true;
  color: string;
};

type GetRgbaPropsType = (ColorType | HexColorType) & {
  opacity?: string | number;
};

export const getRgba = ({
  color,
  isHex,
  opacity,
}: GetRgbaPropsType): string => {
  // 이미 rgba 되어있는 경우
  if (color.startsWith('rgba')) return color;

  const strOpacity = opacity ?? 1;

  const innerColor = isHex ? color : colors[color];

  // 각 자리를 얻어내 16진수를 10진수로 변환
  const red = parseInt(innerColor.slice(1, 3), 16);
  const green = parseInt(innerColor.slice(3, 5), 16);
  const blue = parseInt(innerColor.slice(5, 7), 16);

  const rgba = `rgba(${red}, ${green}, ${blue}, ${strOpacity})`;
  return rgba;
};
