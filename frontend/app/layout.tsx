import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "prelegal-demo",
  description: "This is for some prelegal documents",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
