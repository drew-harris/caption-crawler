import { Link, Outlet } from "@tanstack/react-router";
import { ReactNode } from "react";
import { Navbar } from "~/client/Navbar";

export const Layout = ({ children }: { children: ReactNode }) => {
  return (
    <div className="p-5 !pb-3 min-h-screen flex flex-col md:p-8">
      <div className="grow">
        <Navbar />
        <Outlet />
      </div>
      <div className="mx-auto opacity-70 text-center text-sm w-full">
        Support for channels and single videos coming soon.
      </div>
    </div>
  );
};
