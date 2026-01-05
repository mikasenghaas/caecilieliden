import type { Metadata } from "next";
import { Mada, Madimi_One } from "next/font/google";
import "./globals.css";

const mada = Mada({
  subsets: ["latin"],
  variable: "--font-mada",
});

const madimiOne = Madimi_One({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-madimi",
});

export const metadata: Metadata = {
  title: "Caecilie Lidèn Bode",
  description: "Design portfolio of Caecilie Lidèn Bode - Digital Design & Interactive Technologies",
  openGraph: {
    title: "Caecilie Lidèn Bode",
    description: "Design portfolio of Caecilie Lidèn Bode - Digital Design & Interactive Technologies",
    url: "https://caecilieliden.com",
    type: "website",
    images: [
      {
        url: "https://caecilieliden.com/og-image.png",
        width: 1200,
        height: 630,
        alt: "Caecilie Lidèn Bode - Design Portfolio",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Caecilie Lidèn Bode",
    description: "Design portfolio of Caecilie Lidèn Bode - Digital Design & Interactive Technologies",
    images: ["https://caecilieliden.com/og-image.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${mada.variable} ${madimiOne.variable} antialiased`}>
        {children}
      </body>
    </html>
  );
}
