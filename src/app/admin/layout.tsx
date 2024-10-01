"use client";

import Sidebar from "./components/Sidebar";
import { SessionProvider } from "next-auth/react";
const AdminLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="flex">
      <Sidebar />
      <div className="flex-1">
        <SessionProvider>
          {" "}
          {/* <Header /> */}
        </SessionProvider>
        <main className="p-4">{children}</main>
      </div>
    </div>
  );
};

export default AdminLayout;
