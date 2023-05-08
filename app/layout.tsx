import { ReactElement } from "react";
import "../styles/globals.css";
import { NextAuthProvider } from "./providers";
export const metadata = {
  title: "Test",
  description: "Test",
};

export default function RootLayout({ children }: { children: ReactElement }) {
  return (
    <html lang="en">
      <body>
        <NextAuthProvider>{children}</NextAuthProvider>
      </body>
    </html>
  );
}
