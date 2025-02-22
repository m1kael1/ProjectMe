import type { Metadata } from "next";
import { GeistSans } from "geist/font/sans";
import "./globals.css";
import { ThemeProvider } from "@/providers/theme-provider";
import dynamic from "next/dynamic";

const AuthWrapper = dynamic(() => import("@/providers/auth-provider"), { ssr: false });

// export const metadata: Metadata = {
//   metadataBase: new URL(
//     process.env.APP_URL
//       ? `${process.env.APP_URL}`
//       : process.env.VERCEL_URL
//         ? `https://${process.env.VERCEL_URL}`
//         : `http://localhost:${process.env.PORT || 3000}`
//   ),
//   title: "shadcn/ui sidebar",
//   description:
//     "A stunning and functional retractable sidebar for Next.js built on top of shadcn/ui complete with desktop and mobile responsiveness.",
//   alternates: {
//     canonical: "/"
//   },
//   openGraph: {
//     url: "/",
//     title: "project-management",
//     description:
//       "A easy and powerful project management tool built with Next.js, React, and shadcn/ui.",
//     type: "website"
//   },
//   twitter: {
//     card: "summary_large_image",
//     title: "project-management",
//     description:
//       "A easy and powerful project management tool built with Next.js, React, and shadcn/ui."
//   }
// };

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {


  return (

    < html lang="en" suppressHydrationWarning>
      <body className={GeistSans.className}>
        <AuthWrapper>
          <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
            {children}
          </ThemeProvider>
        </AuthWrapper>
      </body>
    </html >
  );
}
