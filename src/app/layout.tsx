import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider"
import { QueryProvider } from "@/components/query-provider"
import { ErrorBoundary } from "@/components/error-boundary"
import { ServiceWorkerProvider } from "@/components/service-worker"

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    template: '%s | OneFeed TH',
    default: 'OneFeed TH - ศูนย์รวมข่าวสารไทยจากทุกแหล่ง RSS',
  },
  description: 'รวบรวมข่าวสารล่าสุดจากทุกสำนักข่าวไทย อ่านข่าวการเมือง เศรษฐกิจ กีฬา บันเทิง เทคโนโลยี และไลฟ์สไตล์ในที่เดียว',
  keywords: ['ข่าวไทย', 'รวมข่าว', 'RSS ข่าว', 'ข่าวล่าสุด', 'Thai news', 'news aggregator'],
  openGraph: {
    type: 'website',
    locale: 'th_TH',
    alternateLocale: 'en_US',
    siteName: 'OneFeed TH',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'OneFeed TH - ศูนย์รวมข่าวสารไทย',
    description: 'อ่านข่าวล่าสุดจากทุกสำนักข่าวไทยในที่เดียว',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="th" suppressHydrationWarning>
      <body
        className={`${inter.variable} font-sans antialiased`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <ErrorBoundary>
            <QueryProvider>
              <ServiceWorkerProvider />
              {children}
            </QueryProvider>
          </ErrorBoundary>
        </ThemeProvider>
      </body>
    </html>
  );
}
