import { ComponentProps, ReactElement, ReactNode } from 'react';

/**
 * 슬롯 타입을 `ReactNode` 대신 해당 컴포넌트의 엘리먼트로 적는다. 무엇을 넣어야
 * 하는지 시그니처만 보고 알 수 있게 하려는 것이다.
 *
 * **강제력은 없다.** TSX가 만드는 엘리먼트는 `JSX.Element = ReactElement<any, any>`라
 * `any`가 무엇에든 대입된다 — 사이드바 자리에 `<Footer />`나 `<div />`를 꽂아도
 * 컴파일은 통과한다(실측 확인). 타입이 막아준다고 믿으면 안 된다.
 *
 * `import type`이라 번들에는 들어가지 않는다.
 */
import type { Footer } from '../Footer';
import type { Header } from '../Header';
import type { Sidebar } from '../Sidebar';

interface ILayoutProps {
  /**
   * 왼쪽 세로 영역. 보통 `<Sidebar />`를 넣는다.
   *
   * 폭은 넣은 쪽이 정한다 — `Layout`은 사이드바가 몇 px인지 모른다. 본문 컬럼이
   * `flex-1`로 남는 공간을 가져가므로, 사이드바가 접히고 펴져도 따라온다.
   */
  sidebar?: ReactElement<ComponentProps<typeof Sidebar>>;
  /** 본문 위 가로 영역. 보통 `<Header />`를 넣는다. */
  header?: ReactElement<ComponentProps<typeof Header>>;
  /**
   * 본문 아래 가로 영역. 보통 `<Footer />`를 넣는다.
   *
   * 본문과 달리 **1248px 상한이 걸리지 않는다** — Figma에서도 푸터는 헤더와 같은
   * 폭으로 컬럼을 꽉 채우고, 안쪽 내용만 가운데 모은다(`12058:2438`).
   *
   * 본문이 짧아도 화면 아래에 붙는다(`main`이 `flex-1`이라 남는 높이를 가져간다).
   */
  footer?: ReactElement<ComponentProps<typeof Footer>>;
  children: ReactNode;
}

/**
 * 사이드바·헤더·본문을 배치하는 뼈대(Figma `12058:2438`).
 *
 * **재료가 아니라 완성된 컴포넌트를 받는다.** 전에 있던 `Grid`는 하위 컴포넌트의
 * prop을 전부 다시 선언해 통과시키느라 prop이 30개였고, Header에 prop이 하나
 * 늘 때마다 함께 고쳐야 했다. 여기서는 받은 것을 자리에 꽂기만 한다.
 *
 * 앱 사정도 알지 않는다 — `Grid`는 `localStorage` 키와 `process.env`, `window.open`을
 * 직접 집어가고 있었다.
 *
 * ```tsx
 * <Layout
 *   sidebar={<Sidebar items={menus} open={open} onOpenChange={setOpen} />}
 *   header={<Header login session={session} />}
 *   footer={<Footer items={links} email={email} address={address} />}
 * >
 *   {children}
 * </Layout>
 * ```
 */
export const Layout = ({ sidebar, header, footer, children }: ILayoutProps) => (
  /**
   * `min-w-0`이 빠지면 본문이 길 때 컬럼이 줄어들지 않아 사이드바를 밀어낸다 —
   * flex 자식의 `min-width` 기본값이 `auto`라서다. 틀리기 쉬운 자리라 여기에 가둔다.
   */
  <div className="flex min-h-screen">
    {sidebar}
    <div className="flex min-w-0 flex-1 flex-col">
      {header}
      {/**
        * 여백은 바깥 상자가, 폭은 `main`이 가진다.
        *
        * 패딩을 `max-w` 안쪽에 두면 상한이 글자 폭이 아니게 된다 — border-box라
        * 1248에서 좌우 40씩을 깎아 1168만 남았다. Figma에서 본문 프레임은 1248
        * **그 자체**이고 양옆 210px은 가운데 정렬의 결과다(`12289:6300`,
        * 컬럼 1668 · 본문 x=462 w=1248).
        *
        * 좌우 `px-10`은 헤더·푸터와 같은 값이다. 컬럼이 1328보다 좁아지면 상한이
        * 걸리지 않으므로, 이때부터 본문 글자가 헤더 글자와 같은 세로줄에 선다.
        *
        * 위아래도 같은 노드의 실측이다 — 헤더 아래 20px, 푸터 위 112px. `pb-28`은
        * 푸터가 **없을 때도** 유지한다. 본문 끝과 화면 끝 사이의 여백이 푸터
        * 유무로 달라질 이유가 없다.
        */}
      <div className="flex-1 px-10 pt-5 pb-28">
        {/**
          * 1248은 Figma Grid 페이지(`11785:6255`)에 **"콘텐츠 영역 1248px"으로
          * 주석이 달려 있는 값**이고, 레포도 이미 쓰고 있다 — `Table`·`SimpleTable`의
          * `max-w-[1248px]`, `Modal`의 xl 사이즈. 그것들이 선언한 폭을 부모가 깎지
          * 않도록 여기서도 같은 값을 그대로 둔다.
          */}
        <main className="mx-auto w-full max-w-[1248px]">{children}</main>
      </div>
      {footer}
    </div>
  </div>
);
