# ds 사용설명서

`@0529th/ds` — React 컴포넌트 + 디자인 토큰 + 아이콘을 제공하는 디자인 시스템 패키지.

## 설치

```bash
pnpm add @0529th/ds
```

peerDependencies: `react@^18.2 || ^19`, `react-dom@^18.2 || ^19`

## 스타일 불러오기

앱 진입점에서 CSS를 한 번 불러온다.

```ts
import '@0529th/ds/styles.css';
```

Tailwind를 쓰는 앱이라면 preset을 연결하면 디자인 토큰이 Tailwind 유틸리티로 풀린다.

```ts
// tailwind.config.ts
import dsPreset from '@0529th/ds/tailwind';

export default {
  presets: [dsPreset],
  // ...
};
```

## 컴포넌트

```tsx
import { Button, Text, Modal } from '@0529th/ds';

<Button onClick={...}>확인</Button>
```

제공 컴포넌트:

Accordion · BarSpinner · Breadcrumb · Button · Calendar · Card · Checkbox ·
DateInput · Dim · Drawer · Dropdown · ErrorMessage · FileInput ·
Footer · Header · Info · Input · Layout · LoadingBar · Logo · Modal ·
Pagination · Radio · Scroll · Section · SelectBox · SelectChips · Sidebar ·
Skeleton · Status · Symbol · Tab · Table · Tabs · TailSpinner · Text ·
Textarea · Toast(`useToast` · `ToastContainer`) · Toggle · Tooltip

각 컴포넌트의 props와 사용 예시는 Storybook(`pnpm storybook`)에서 확인한다.

## 토큰

색·타이포·간격 등 디자인 토큰은 `/tokens` subpath로 제공한다.

```ts
import { lightSemanticColors } from '@0529th/ds/tokens';
```

## 아이콘

아이콘은 `/icons` subpath에서 네임스페이스로 가져다 쓴다.

```tsx
import * as Icon from '@0529th/ds/icons';

<Icon.Star size="md" />
```

네임스페이스 import + 정적 멤버 접근(`Icon.Star`)이라야 번들러가 안 쓰는
아이콘을 트리셰이킹한다. `Icon[name]`처럼 변수로 접근하면 전체 아이콘이
번들에 남는다.

## 로고

- `<Logo type="basic" | "white" />` — 워드마크 로고 (124×20)
- `<Symbol size="md" | "lg" | "xl" />` — 심볼 마크 (16 / 24 / 28px)

사이드바 하단 회사 정보는 `Sidebar`의 `footer` prop(`companyName`,
`logoUrl`)으로 소비 앱이 주입한다.

## 개발

```bash
pnpm install
pnpm storybook   # 컴포넌트 문서
pnpm test        # vitest
pnpm build       # tsup 번들
```
