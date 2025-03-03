import "@/app/_styles/global.css";

export const metadata = {
  title:{
    template: "%s / The Pet",
    default: "Welcome to The Pet"
  }, 
  description: "The Pet is a social network for pets",
  keywords: "pets, social network, cute animals",
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      
      <body>{children}</body>
    </html>
  )
}
