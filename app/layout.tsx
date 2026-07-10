import type { Metadata } from "next";
import "@mantine/core/styles.css";
import "@mantine/tiptap/styles.css";
import "@mantine/dates/styles.css";
import "@mantine/notifications/styles.css";
import "./globals.css";
import {
  AppShell,
  AppShellHeader,
  AppShellMain,
  ColorSchemeScript,
  Container,
  createTheme,
  mantineHtmlProps,
  MantineProvider,
} from "@mantine/core";
import { AppHeader } from "@/lib/components/AppHeader";
import { Cormorant_Garamond, Lora, Noto_Sans } from "next/font/google";
import localFont from "next/font/local";
import { AppFooter } from "@/lib/components/AppFooter";
import { Notifications } from "@mantine/notifications";

const cormorantGaramond = Cormorant_Garamond({
  subsets: ["latin"],
  variable: "--font-cormorant-garamond",
});

const lora = Lora({
  subsets: ["latin"],
  variable: "--font-lora",
});

const notoSans = Noto_Sans({
  subsets: ["latin"],
  variable: "--font-noto-sans",
});

const cmu = localFont({
  src: "../fonts/cmunrm.ttf",
  variable: "--font-cmu",
});

export const metadata: Metadata = {
  title: "QED Online",
  description: "Zusätzliche digitale Medien zur QED Schülerzeitung",
};

const theme = createTheme({
  fontFamily: `var(--font-lora), serif`,
  headings: {
    fontFamily: `var(--font-cmu), serif`,
    fontWeight: "400",
  },

  black: "black",
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="de"
      {...mantineHtmlProps}
      className={`${lora.variable} ${cormorantGaramond.variable} ${notoSans.variable} ${cmu.variable}`}
    >
      <head>
        <ColorSchemeScript />
      </head>
      <body>
        <MantineProvider defaultColorScheme="auto" theme={theme}>
          <Notifications />
          <AppShell padding="md" header={{ height: 60 }}>
            <AppShellHeader>
              <AppHeader />
            </AppShellHeader>
            <AppShellMain mih={"calc(100cqh - var(--app-shell-header-offset))"}>
              <Container>{children}</Container>
            </AppShellMain>
            <AppFooter />
          </AppShell>
        </MantineProvider>
      </body>
    </html>
  );
}
