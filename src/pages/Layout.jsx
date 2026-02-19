import { Outlet, useNavigate } from "react-router-dom";
import { useState } from "react";
import { SignIn, useUser } from "@clerk/clerk-react";
import Navbar from "../components/Navbar";

const Layout = () => {
  const { user, isLoaded } = useUser();
  const [sidebar, setSidebar] = useState(false);

  if (!isLoaded) return null; // Wait for Clerk to load

  return user ? (
    <div className="flex flex-col h-screen">
      {/* Navbar is fixed inside the component or globally */}
      <Navbar />
      
      <div className="flex flex-1 pt-16"> {/* pt-16 accounts for fixed navbar height */}
        {/* If you have a Sidebar component, it goes here */}
        {/* <Sidebar sidebar={sidebar} setSidebar={setSidebar} /> */}
        
        <main className="flex-1 bg-[#F4F7FB] overflow-y-auto p-6">
          <Outlet />
        </main>
      </div>
    </div>
  ) : (
    <div className="flex items-center justify-center h-screen">
      <SignIn />
    </div>
  );
};

export default Layout;