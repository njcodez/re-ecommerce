"use client"
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuLabel, DropdownMenuItem, DropdownMenuSeparator } from "@radix-ui/react-dropdown-menu";
import { ColumnDef } from "@tanstack/react-table";
import { MoreHorizontal } from "lucide-react";
import { Button } from "~/components/ui/button";
import { api } from "~/trpc/react";
import RowActions from "./RowActions";


export const productColumns: ColumnDef<Product>[] = 

[
  {
    accessorKey: "name",
    header: "Name",
  },
  {
    accessorKey: "brandName",
    header: "Brand",
  },
  {
    accessorKey: "price",
    header: "Price",
  },
  {
    accessorKey: "status",
    header: "Status",
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const product = row.original
 
      return (
        <>
          <RowActions productId={product.id}/>
        </>
      )
    },
  },
];


// Define the type for the product data
export type Product = {
  id: number
  name: string
  brandName: string
  price: number
  status: "AVAILABLE" | "OUT_OF_STOCK"
}

