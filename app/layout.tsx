import type { Metadata } from "next";
import { Inter, Poppins } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: 'swap',
});

const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: 'swap',
});

export const metadata: Metadata = {
  title: {
    default: "DASA - Department of Accounting Students Association",
    template: "%s | DASA"
  },
  description: "The central hub for academic excellence, professional growth, and departmental innovation at the University of Professional Studies, Accra.",
  keywords: ["DASA", "Department of Accounting", "Student Association", "Ghana Accounting students", "University of Professional Studies"],
  openGraph: {
    type: 'website',
    locale: 'en_GH',
    url: 'https://dasaupsa.com',
    siteName: 'DASA UPSA',
    images: [{
      url: '/dasa-logo.jpg',
      width: 1200,
      height: 630,
      alt: 'DASA - Department of Accounting Students Association'
    }]
  },
  twitter: {
    card: 'summary_large_image',
    title: 'DASA - Department of Accounting Students Association',
    description: 'Empowering Accounting Excellence at UPSA.',
    images: ['/dasa-logo.jpg'],
  },
  icons: {
    icon: "/dasa-logo.jpg",
    apple: "/dasa-logo.jpg",
  },
  themeColor: '#FF8C61',
};

import ConditionalLayout from '@/components/layout/ConditionalLayout'

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning={true}>
      <body
        className={`${inter.variable} ${poppins.variable} antialiased`}
        suppressHydrationWarning={true}
      >
        <ConditionalLayout>{children}</ConditionalLayout>
      </body>
    </html>
  );
}




