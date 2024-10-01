"use client";

import { SessionProvider } from "next-auth/react";
import { Product } from "./_components/Product";



const Page = () => (
  <SessionProvider>
    <Product />
  </SessionProvider>
);

export default Page;
