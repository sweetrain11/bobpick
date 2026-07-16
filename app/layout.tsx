import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.VERCEL_PROJECT_PRODUCTION_URL
      ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
      : "http://localhost:3000",
  ),
  title: "밥픽 | 오늘 뭐 먹지?",
  description: "식당을 찾고 다섯 가지 랜덤 게임으로 오늘의 메뉴를 재미있게 결정해 보세요.",
  icons: { icon: "/favicon.svg", shortcut: "/favicon.svg" },
  openGraph: {
    title: "밥픽 | 오늘 뭐 먹지?",
    description: "고민 말고, 게임으로 한 끼 결정",
    images: [{ url: "/og.png", width: 1200, height: 630, alt: "밥픽 메뉴 추천 게임" }],
  },
  twitter: { card: "summary_large_image", images: ["/og.png"] },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="ko"><body>{children}</body></html>;
}
