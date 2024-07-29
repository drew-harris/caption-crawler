import { Outlet } from "@tanstack/react-router";
import { ReactNode } from "react";
import { Navbar } from "~/client/Navbar";

export const Layout = ({ children }: { children: ReactNode }) => {
  return (
    <div className="p-5 md:p-8">
      <Navbar />
      <Outlet />
    </div>
  );
};
