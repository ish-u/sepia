import Background from "../app_components/Background";
import NavBar from "../app_components/Navbar";
import Player from "../components/Player";
import "../styles/globals.css";
import { NextAuthProvider } from "./provider";
export default function RootLayout({
  // Layouts must accept a children prop.
  // This will be populated with nested layouts or pages
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <NextAuthProvider>
          <Background />
          <NavBar />
          <div className="mx-32">{children}</div>
          <Player />
        </NextAuthProvider>
      </body>
    </html>
  );
}
