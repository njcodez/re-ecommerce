"use client"
import { MoreHorizontal } from 'lucide-react'
import React from 'react'
import { Button } from '~/components/ui/button'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger } from '~/components/ui/dropdown-menu'
import { api } from '~/trpc/react'

const RowActions = ({ productId }: { productId: number }) => {

    const setProductAvailable = api.product.setProductAvailable.useMutation(
      {
        onSettled: () => {utils.product.getTableProducts.invalidate()},
      }
    );
    const setProductOutOfStock = api.product.setProductOutOfStock.useMutation(
      {
        onSettled: () => {utils.product.getTableProducts.invalidate()},
      }
    );
    const utils = api.useUtils();

  return (
    <div>
          <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="default" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuItem
              onClick={() => setProductAvailable.mutate({id:productId})}
            >
              Set Availabe
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => setProductOutOfStock.mutate({id:productId})}
              >Set Out of Stock</DropdownMenuItem>
            {/* <DropdownMenuItem>View payment details</DropdownMenuItem> */}
          </DropdownMenuContent>
        </DropdownMenu>
    </div>
  )
}

export default RowActions