import type { Metadata } from "next";
import { Mada, Madimi_One, IBM_Plex_Sans } from "next/font/google";
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

// Regular upright for the article text, light italic for the bio and contact
// blocks on the front page.
const ibmPlexSans = IBM_Plex_Sans({
  weight: ["300", "400", "700"],
  style: ["normal", "italic"],
  subsets: ["latin"],
  variable: "--font-plex-sans",
});

export const metadata: Metadata = {
  title: "Caecilie Lidèn Bode",
  description:
    "Design portfolio of Caecilie Lidèn Bode - Digital Design & Interactive Technologies",
  openGraph: {
    title: "Caecilie Lidèn Bode",
    description:
      "Design portfolio of Caecilie Lidèn Bode - Digital Design & Interactive Technologies",
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
    description:
      "Design portfolio of Caecilie Lidèn Bode - Digital Design & Interactive Technologies",
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
      <body
        className={`${mada.variable} ${madimiOne.variable} ${ibmPlexSans.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
