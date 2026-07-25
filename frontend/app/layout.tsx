import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Mutual NDA Creator",
  description: "Generate a Common Paper Mutual Non-Disclosure Agreement",
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
