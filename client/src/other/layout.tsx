import { Outlet } from "react-router-dom";
import Header from "./header";
import Footer from "./footer";

function Layout() {
  return (
    <>
      <div className="min-h-screen min-w-[280px] flex flex-col mx-4">
        <Header />
        <Outlet />
        <Footer />
      </div>
    </>
  )
}

export default Layout;
