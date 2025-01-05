import { Link, Outlet } from "@tanstack/react-router";
import { ReactNode } from "react";
import { Navbar } from "~/client/Navbar";

export const Layout = ({ children }: { children: ReactNode }) => {
  return (
    <div className="p-5 !pb-4 min-h-screen flex flex-col md:p-8">
      <div className="grow pb-6">
        <Navbar />
        <Outlet />
      </div>
      <Link
        to={"/feedback"}
        className="mx-auto text-xs opacity-70 text-center md:text-sm w-full"
      >
        Submit Feedback
      </Link>
    </div>
  );
};
