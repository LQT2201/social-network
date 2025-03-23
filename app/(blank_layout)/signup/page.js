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
import name from "@/public/images/name.PNG";
import Link from "next/link";
import CustomButton from "@/app/_components/CustomButton";
import { useDispatch, useSelector } from "react-redux";
import { registerUser } from "@/redux/slices/authSlice";

// Định nghĩa schema bằng Zod
const formSchema = z.object({
  username: z
    .string()
    .min(3, { message: "Username must be at least 3 characters" })
    .max(50, { message: "Your username exceed the limit" }),
  email: z.string().email({ message: "Invalid email address" }),
  password: z
    .string()
    .min(6, { message: "Password must be at least 6 characters" }),
});

export default function RegisterForm() {
  const dispatch = useDispatch();
  const { loading, error } = useSelector((state) => state.auth);

  // Khởi tạo form với react-hook-form và zodResolver
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: "",
      email: "",
      password: "",
    },
  });

  // Hàm xử lý khi form được submit
  function onSubmit(data) {
    dispatch(registerUser(data)); // Dispatch action đăng ký
  }

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-50 bg-[url(/images/bg.png)] bg-no-repeat bg-center bg-cover w-screen">
      <div className="w-full max-w-md p-12 bg-baby-powder/90 rounded-xl">
        <Link href="/">
          <Image
            className="m-auto transform trasition duration-300 hover:-translate-y-1"
            src={name}
            width={200}
            height={200}
            alt="Picture of logo name"
            placeholder="empty"
          ></Image>
        </Link>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            {/* Username Field */}
            <FormField
              control={form.control}
              name="username"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Username</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter your username"
                      {...field}
                      className="rounded-sm h-11 my-1 bg-white placeholder:text-sm placeholder:text-sl-gray focus:border-sky-500"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

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
                      className="rounded-sm h-11 my-1 bg-white placeholder:text-sm placeholder:text-sl-gray focus:border-sky-500"
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
                      className="rounded-sm h-11 my-1 bg-white placeholder:text-sm placeholder:text-sl-gray focus:border-sky-500"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {error && <p className="text-red-500 text-sm">{error.message}</p>}

            <h3 className="text-xs text-center font-normal">
              By clicking Agree & Join, you agree to the The Pet{" "}
              <b>User Agreement, Privacy Policy,</b> and <b>Cookie Policy</b>.
            </h3>

            <Button
              type="submit"
              className="w-full rounded-full p-5 bg-yellow-orange hover:bg-l-yellow"
              disabled={loading}
            >
              {loading ? "Loading..." : "Agree & Join"}
            </Button>
          </form>
        </Form>

        <div className="flex items-center my-4">
          <hr className="flex-1 border-l-gray  border-1" />
          <span className="px-3 text-d-gray text-sm">Or sign in with</span>
          <hr className="flex-1 border-l-gray border-1" />
        </div>

        <div className="flex flex-wrap justify-center gap-4">
          <CustomButton className="flex-1 min-w-[150px]">
            <Bird className="group-hover:fill-yellow-orange" />
            Google
          </CustomButton>

          <CustomButton
            className="flex-1 min-w-[150px]"
            onClick={() => alert("Facebook login")}
          >
            <Facebook className="group-hover:fill-yellow-orange" />
            Facebook
          </CustomButton>

          <CustomButton
            className="flex-1 min-w-[150px]"
            onClick={() => alert("Twitter login")}
          >
            <Bird className="group-hover:fill-yellow-orange" />
            Twitter
          </CustomButton>
        </div>

        <div className="text-center mt-7">
          <h3 className="text-sm text-jet">
            Already on The Pet?{" "}
            <Link href="/signin">
              <b className="underline hover:text-yellow-orange hover:no-underline">
                Sign in
              </b>
            </Link>
          </h3>
        </div>
      </div>
    </div>
  );
}
