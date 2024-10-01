"use client";
import * as z from "zod";
import { useForm } from "react-hook-form";
import { Button } from "~/components/ui/button";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "~/components/ui/form";
import { Input } from "~/components/ui/input";
import { api } from "~/trpc/react";
import { useEffect, useState } from "react";
import { useToast } from "~/hooks/use-toast";
import { useRouter } from "next/navigation";

const formSchema = z.object({
  key194: z.string().min(1).max(255),
  name: z.string().min(1).max(255),
  address: z.string().min(1).max(255),
  phone: z.string()
    .min(1)
    .max(255)
    .regex(/^\d+$/, "Phone number must be numeric"),
});

export function CreateProfileForm() {
  const { toast } = useToast();
  const { data: email, isLoading } = api.user.getProfileEmail.useQuery();
  const updateProfileMutation = api.user.updateProfile.useMutation({
    onSuccess: () => {
      toast({
        title: "Profile Updated Successfully",
      });
      setIsProfileCreated(true);
    },
  });
  const { data: profileDetails } = api.user.getUserProfileDetails.useQuery();
  const router = useRouter();
  const [isProfileCreated, setIsProfileCreated] = useState(false);
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      key194: email || "",
      name: "",
      address: "",
      phone: "",
    },
  });

  useEffect(() => {
    if (email && profileDetails) {
      form.reset({
        key194: email,
        name: profileDetails?.name || "",
        address: profileDetails?.address || "",
        phone: profileDetails?.phone || "",
      });
    }
  }, [email, profileDetails, form]);

  async function onSubmit(values: z.infer<typeof formSchema>) {
    await updateProfileMutation.mutateAsync({
      name: values.name,
      address: values.address,
      phone: values.phone,
    });
    form.reset();
    router.push("/");
  }

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-green-100">
      <h1 className="text-2xl mb-4 font-medium">My Profile</h1>
      <div className="bg-white rounded-lg p-8 shadow-md w-full max-w-md">
        <Form {...form}>
          <form noValidate onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <FormField
              control={form.control}
              name="key194"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Gmail Address</FormLabel>
                  <FormControl>
                    <Input {...field} readOnly className="focus:outline-green-500" />
                  </FormControl>
                  <FormDescription></FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Placeholder" {...field} className="focus:outline-green-500" />
                  </FormControl>
                  <FormDescription></FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="address"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Address</FormLabel>
                  <FormControl>
                    <Input placeholder="Address" {...field} className="focus:outline-green-500" />
                  </FormControl>
                  <FormDescription></FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="phone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Phone Number</FormLabel>
                  <FormControl>
                    <Input placeholder="Placeholder" {...field} className="focus:outline-green-500" />
                  </FormControl>
                  <FormDescription></FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex justify-center">
              <Button type="submit" className="bg-green-400 text-white hover:bg-green-500">Submit</Button>
            </div>
          </form>
        </Form>
        {isProfileCreated && (
          <Button onClick={() => { router.push("/") }} className="mt-4">
            Go Back
          </Button>
        )}
      </div>
    </div>
  );
}
