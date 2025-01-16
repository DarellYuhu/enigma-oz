"use client";

import { Button } from "@/components/ui/button";
import { CardContent, CardFooter } from "@/components/ui/card";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  Form as HookForm,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { usePutService } from "@/hooks/features/service/usePutService";
import { useServices } from "@/hooks/features/service/useServices";
import ServiceSchema from "@/schemas/service";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

const Form = () => {
  const services = useServices();
  const mutation = usePutService();
  const form = useForm<z.infer<typeof ServiceSchema.putServices>>({
    resolver: zodResolver(ServiceSchema.putServices),
    defaultValues: {
      youtube: {
        id: "youtube",
        url: "",
        type: "YOUTUBE",
      },
      tiktok: {
        id: "tiktok",
        url: "",
        type: "TIKTOK",
      },
      twitter: {
        id: "twitter",
        url: "",
        type: "TWITTER",
      },
      facebook: {
        id: "facebook",
        url: "",
        type: "FACEBOOK",
      },
    },
  });

  const onSubmit = (values: z.infer<typeof ServiceSchema.putServices>) => {
    mutation.mutate(values);
  };

  useEffect(() => {
    if (services.data) {
      const newValues = services.data.reduce(
        (acc: { [key: string]: any }, curr) => {
          const {
            createdAt: _createdAt,
            updatedAt: _updatedAt,
            ...rest
          } = curr;
          acc[curr.id] = rest;
          return acc;
        },
        {}
      );

      const missingFields = ["twitter", "youtube", "tiktok", "facebook"].filter(
        (field) => !(field in newValues)
      );

      missingFields.forEach((field) => {
        newValues[field] = form.getValues(field as any);
      });

      form.reset(newValues);
    }
  }, [services.data]);

  if (services.isPending)
    return (
      <div className="p-4 space-y-3">
        {Array.from({ length: 3 }).map((_, index) => (
          <div className="space-y-2" key={index}>
            <Skeleton className="h-8 w-20" />
            <Skeleton className="h-11 w-full" />
          </div>
        ))}
      </div>
    );

  return (
    <HookForm {...form}>
      <CardContent>
        <form className="space-y-8" onSubmit={form.handleSubmit(onSubmit)}>
          <FormField
            name={"youtube.url"}
            control={form.control}
            render={({ field }) => (
              <FormItem className="grid w-full items-center gap-4">
                <div className="flex flex-col space-y-1.5">
                  <FormLabel>Youtube</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Youtube API URL"
                      type="url"
                      {...field}
                    />
                  </FormControl>
                </div>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            name={"tiktok.url"}
            control={form.control}
            render={({ field }) => (
              <FormItem className="grid w-full items-center gap-4">
                <div className="flex flex-col space-y-1.5">
                  <FormLabel>Tiktok</FormLabel>
                  <FormControl>
                    <Input placeholder="Tiktok API URL" type="url" {...field} />
                  </FormControl>
                </div>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            name={"twitter.url"}
            control={form.control}
            render={({ field }) => (
              <FormItem className="grid w-full items-center gap-4">
                <div className="flex flex-col space-y-1.5">
                  <FormLabel>Twitter</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Twitter API URL"
                      type="url"
                      {...field}
                    />
                  </FormControl>
                </div>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            name={"facebook.url"}
            control={form.control}
            render={({ field }) => (
              <FormItem className="grid w-full items-center gap-4">
                <div className="flex flex-col space-y-1.5">
                  <FormLabel>Facebook</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Facebook API URL"
                      type="url"
                      {...field}
                    />
                  </FormControl>
                </div>
                <FormMessage />
              </FormItem>
            )}
          />
          <CardFooter className="flex items-center justify-end">
            <Button disabled={mutation.isPending} type="submit">
              Update
            </Button>
          </CardFooter>
        </form>
      </CardContent>
    </HookForm>
  );
};

export default Form;
