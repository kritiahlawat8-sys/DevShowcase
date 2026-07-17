import Providers from "./providers";
import "./globals.css";
export default function Rootlayout({ children }) {
  return (
    <html lang="en">
    <body>
    <Providers>{children}</Providers></body></html>
  );
}