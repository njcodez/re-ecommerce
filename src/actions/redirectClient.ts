"use server";

import { redirect } from "next/navigation";

export const redirectClient = (url: string) => {
  return redirect(url);
};