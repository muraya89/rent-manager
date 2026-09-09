import type { Metadata } from "next";
import { Manrope, Inter, Poppins, Plus_Jakarta_Sans, Outfit, Space_Grotesk } from "next/font/google";
import "bootstrap/dist/css/bootstrap.min.css";
import "./globals.css";

// Choose ONE of these fonts by uncommenting it and commenting out the others:

// Option 1: Manrope (Modern, clean, slightly rounded)
// const manrope = Manrope({
//   variable: "--font-manrope",
//   subsets: ["latin"],
//   weight: ["400", "500", "600", "700", "800"],
// });

// Option 2: Inter (Very popular, clean, highly readable)
const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

// Option 3: Poppins (Geometric, friendly, modern)
// const poppins = Poppins({
//   variable: "--font-poppins",
//   subsets: ["latin"],
//   weight: ["400", "500", "600", "700"],
// });

// Option 4: Plus Jakarta Sans (Modern, tech-focused, clean)
// const jakarta = Plus_Jakarta_Sans({
//   variable: "--font-jakarta",
//   subsets: ["latin"],
//   weight: ["400", "500", "600", "700", "800"],
// });

// Option 5: Outfit (Modern, slightly quirky, distinctive)
// const outfit = Outfit({
//   variable: "--font-outfit",
//   subsets: ["latin"],
//   weight: ["400", "500", "600", "700", "800"],
// });

// Option 6: Space Grotesk (Modern, tech, futuristic)
// const spaceGrotesk = Space_Grotesk({
//   variable: "--font-space-grotesk",
//   subsets: ["latin"],
//   weight: ["400", "500", "600", "700"],
// });

export const metadata: Metadata = {
  title: "Rentwise | Rent management",
  description: "Manage properties, tenants, and rent payments in one place.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${inter.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col font-sans">{children}</body>
    </html>
  );
}
