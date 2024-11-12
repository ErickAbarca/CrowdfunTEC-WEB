
import "./globals.css";



export const metadata = {
  title: "CrowdfunTEC",
  description: "Generated by create next app",
};

export default function RootLayout({ children }) {
  return (
    <html lang="es">
      <body>
        {children}
      </body>
    </html>
  );
}