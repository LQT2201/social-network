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
import Image from "next/image";
import name from "@/public/images/name.PNG";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAppDispatch, useAppSelector } from "@/redux/hook"; // custom hooks cho Redux
import { login, loginWithGoogle } from "@/redux/slices/authSlice"; // Async thunk login
import CustomButton from "@/app/_components/CustomButton";
import { Bird, Facebook } from "lucide-react";

// Định nghĩa schema bằng Zod
const formSchema = z.object({
  email: z.string().email({ message: "Email không hợp lệ" }),
  password: z.string().min(6, { message: "Mật khẩu phải có ít nhất 6 ký tự" }),
});

export default function LoginForm() {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const { loading, error } = useAppSelector((state) => state.auth);

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  // Hàm xử lý submit form
  const onSubmit = async (data) => {
    const resultAction = await dispatch(login(data));

    // Kiểm tra nếu đăng nhập thành công
    if (login.fulfilled.match(resultAction)) {
      alert("Đăng nhập thành công!");
      router.push("/homepage"); // Chuyển hướng đến trang dashboard (hoặc trang mong muốn)
    } else {
      // Nếu đăng nhập thất bại
      alert(
        "Đăng nhập thất bại: " +
          (resultAction.payload?.message || "Lỗi không xác định")
      );
    }
  };

  const handleGoogleLogin = async () => {
    alert("Google login");
    window.location.href = "http://localhost:5000/api/auth/google";
  };

  return (
    <div className="flex flex-col items-center justify-center bg-gray-50 bg-[url(/images/bg.png)] bg-no-repeat bg-center bg-cover h-screen w-screen">
      <div className="w-full max-w-md p-12 bg-baby-powder/90 rounded-xl">
        <Link href="/">
          <Image
            className="m-auto transform transition duration-300 hover:-translate-y-1"
            src={name}
            width={200}
            height={200}
            alt="Logo"
            placeholder="empty"
          />
        </Link>

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
                      placeholder="Nhập email của bạn"
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
                  <FormLabel>Mật khẩu</FormLabel>
                  <FormControl>
                    <Input
                      type="password"
                      placeholder="Nhập mật khẩu"
                      {...field}
                      className="rounded-sm h-11 my-1 bg-white placeholder:text-sm placeholder:text-sl-gray focus:border-sky-500"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Hiển thị lỗi nếu có */}
            {error && <p className="text-red-500 text-sm">{error}</p>}

            <Button
              type="submit"
              className="w-full rounded-full p-5 bg-yellow-orange hover:bg-l-yellow"
              disabled={loading}
            >
              {loading ? "Loading..." : "Login now"}
            </Button>
          </form>
        </Form>

        <div className="text-center mt-7">
          <h3 className="text-sm text-jet">
            {"Don't have an account? "}
            <Link href="/signup">
              <b className="underline hover:text-yellow-orange hover:no-underline">
                Sign up now
              </b>
            </Link>
          </h3>
        </div>

        <div className="flex items-center my-4">
          <hr className="flex-1 border-l-gray  border-1" />
          <span className="px-3 text-d-gray text-sm">Or sign in with</span>
          <hr className="flex-1 border-l-gray border-1" />
        </div>

        <div className="flex flex-wrap justify-center gap-4">
          <CustomButton
            className="flex-1 min-w-[150px]"
            onClick={() => handleGoogleLogin()}
          >
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
      </div>
    </div>
  );
}
