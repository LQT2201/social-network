"use client";

import React from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Bird, Facebook } from "lucide-react";
import Image from "next/image";
import name from "@/public/images/name.png";

// Định nghĩa schema bằng Zod
const formSchema = z.object({
  email: z.string().email({ message: "Invalid email address" }),
  password: z
    .string()
    .min(6, { message: "Password must be at least 6 characters" }),
});

export default function RegisterForm() {
  // Khởi tạo form với react-hook-form và zodResolver
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  function onSubmit(data) {
    console.log("Form data:", data);
    // Xử lý submit, ví dụ gọi API...
  }

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-50 bg-[url(/images/bg.png)] bg-no-repeat bg-center bg-cover h-screen w-screen">
      <div className="w-full max-w-md p-12 bg-baby-powder/90 rounded-xl">
        <Image
          className="m-auto"
          src={name}
          width={200}
          height={200}
          alt="Picture of the author"
          placeholder="empty"
        ></Image>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            {/* Email Field */}
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter your email"
                      {...field}
                      className="rounded-sm h-11 my-1 bg-white placeholder:text-sm placeholder:text-sl-gray"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            {/* Password Field */}
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input
                      type="password"
                      placeholder="Create password"
                      className="rounded-sm h-11 my-1 bg-white placeholder:text-sm placeholder:text-sl-gray"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <h3 className="text-xs text-center font-normal">
              By clicking Agree & Join, you agree to the The Pet{" "}
              <b>User Agreement, Privacy Policy,</b> and <b>Cookie Policy</b>.
            </h3>
            <Button
              type="submit"
              className="w-full rounded-full p-5 bg-yellow-orange"
            >
              Agree & Join
            </Button>
          </form>
        </Form>

        <div className="flex items-center my-4">
          <hr className="flex-1 border-l-gray  border-1" />
          <span className="px-3 text-d-gray text-sm">Or sign in with</span>
          <hr className="flex-1 border-l-gray border-1" />
        </div>

        <div className="flex justify-between">
          <Button className="rounded-full bg-baby-powder border-1 border-jet text-jet hover:bg-l-gray hover:text-white hover:border-none">
            <Bird fill="black"></Bird> Google
          </Button>
          <Button className="rounded-full bg-baby-powder border-1 border-jet text-jet hover:bg-l-gray hover:text-white hover:border-none">
            <Facebook fill="black"></Facebook> Facebook
          </Button>
          <Button className="rounded-full bg-baby-powder border-1 border-jet text-jet hover:bg-l-gray hover:text-white hover:border-none">
            <Bird fill="black"></Bird> Twitter
          </Button>
        </div>

        <div className="text-center mt-7">
          <h3 className="text-sm text-jet">
            Already on The Pet? <b className="underline">Sign in</b>
          </h3>
        </div>
      </div>
    </div>
  );
}
