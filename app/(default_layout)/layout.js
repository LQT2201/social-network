import Header from "@/app/_components/Header";

export default function DefaultLayout({ children }) {
  return (
    <>
      <Header />
      <div className="max-w-screen w-7xl mx-auto px-20 pt-7 bg-baby-powder">
        {children}
      </div>
    </>
  );
}
