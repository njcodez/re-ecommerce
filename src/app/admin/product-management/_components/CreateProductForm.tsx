"use client";
import * as z from "zod";
import { useForm } from "react-hook-form";
import { Button } from "~/components/ui/button";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "~/components/ui/form";
import { Input } from "~/components/ui/input";
import { Textarea } from "~/components/ui/textarea"; 
import { useToast } from "~/hooks/use-toast";
import { api } from "~/trpc/react";

const formSchema = z.object({
  name: z.string().min(1).max(255),
  brandName: z.string().min(1).max(255),
  description: z.string().min(1).max(500), 
  price:z.coerce.number().gte(1).lte(9999999999),
  status: z.enum(['AVAILABLE', 'OUT_OF_STOCK']),
  images: z.array(z.string().url()).nonempty(),
});

type ProductFormProps = {
  
  onSubmit: () => void;
  onClose: () => void;
};

export function CreateProductForm({  onSubmit, onClose }: ProductFormProps) {
  const { toast } = useToast();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name:  '',
      brandName:  '',
      description:  '',
      price:  0,
      status: 'AVAILABLE',
      images:  [''], 
    },
  });
  const productRouter = api.product.createProduct.useMutation(
    { onSuccess: ()=>{
      toast({
        title: "Product Saved Successfully",
      });
    }}
  );

  const onSubmitHandler = async (values: z.infer<typeof formSchema>) => {
    try {
      
      await productRouter.mutateAsync(values);
      form.reset();
      onSubmit();

    } catch (error) {
      console.error("Error saving product:", error);
      toast({
        title: "Error saving product",
        description: "Please try again later.",
        variant: "destructive",
      });
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmitHandler)} className="space-y-6">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Product Name</FormLabel>
              <FormControl>
                <Input placeholder="Product Name" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="brandName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Brand Name</FormLabel>
              <FormControl>
                <Input placeholder="Brand Name" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea placeholder="Description" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="price"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Price</FormLabel>
              <FormControl>
                <Input type="number"  placeholder="Price" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="status"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Status</FormLabel>
              <FormControl>
                <select {...field} className="border p-2 rounded w-full">
                  <option value="AVAILABLE">Available</option>
                  <option value="OUT_OF_STOCK">Out of Stock</option>
                </select>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="images"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Image URLs</FormLabel>
              {field.value.map((image, index) => (
                <div key={index} className="flex mb-2">
                  <Input
                    type="text"
                    value={image}
                    onChange={(e) => {
                      const newImages = [...field.value];
                      newImages[index] = e.target.value;
                      field.onChange(newImages);
                    }}
                    placeholder={`Image URL ${index + 1}`}
                    className="w-full"
                  />
                  <Button
                    type="button"
                    onClick={() => {
                      const newImages = field.value.filter((_, i) => i !== index);
                      field.onChange(newImages);
                    }}
                    className="ml-2 bg-red-500 text-white"
                  >
                    Remove
                  </Button>
                </div>
              ))}
              <Button
                type="button"
                onClick={() => field.onChange([...field.value, ''])}
                className="bg-green-500 text-white"
              >
                Add Another Image
              </Button>
            </FormItem>
          )}
        />

        <div className="flex justify-end">
          <Button type="button" onClick={onClose} className="bg-gray-500 text-white mr-2">
            Cancel
          </Button>
          <Button type="submit" className="bg-blue-500 text-white">
            Save
          </Button>
        </div>
      </form>
    </Form>
  );
}
