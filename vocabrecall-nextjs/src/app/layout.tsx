import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "./util/navbar/Navbar";
import { ToastContainer } from "react-toastify";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "VocabRecall",
  description: "",
};

const themeKeys = [
  '--background',
  '--text',
  '--text-secondary',
  '--panel',
  '--panel-h',
  '--outline',
  '--primary'
]
const themeInitScript = `
  (function() {
    try {
      const theme = localStorage.getItem('theme') || 'dark';
      const variables = ${JSON.stringify(themeKeys)};
      const root = document.documentElement;

      variables.forEach(function(key) {
        if (key.startsWith('--')) {
          const value = localStorage.getItem(key);
          if(value){ root.style.setProperty(key, value); }
        }
      });
    } catch (e) {}
  })();
`;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
      </head>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <Navbar/>
        {children}
        <ToastContainer/>
      </body>
    </html>
  );
}
