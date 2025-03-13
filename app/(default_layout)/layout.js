import "@/app/_styles/global.css";
import { Readex_Pro } from "next/font/google";
import { TooltipProvider } from "@/components/ui/tooltip";
import Header from "../_components/Header";

const readex_pro = Readex_Pro({ subsets: ["vietnamese", "latin"] });

export const metadata = {
  title: {
    template: "%s / The Pet",
    default: "Welcome to The Pet",
  },
  description: "The Pet is a social network for pets",
  keywords: "pets, social network, cute animals",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${readex_pro.className}`}>
        <TooltipProvider>
          <Header />
          <div className="max-w-screen w-7xl mx-auto px-20 pt-7 bg-baby-powder">
            {children}
          </div>
        </TooltipProvider>
      </body>
    </html>
  );
}
