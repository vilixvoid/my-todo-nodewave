"use client";

import { useState } from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { useLogin } from "@/hooks/useAuth"; // ✅ import hook login

export default function LoginPage() {
  // Mendefinisikan state
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // Memanggil hook login
  const { mutate: login, isPending } = useLogin();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    login({ email, password });
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#f9fafb]">
      <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-lg">
        <h1 className="text-center text-3xl font-bold text-gray-800 mb-2">
          Sign In
        </h1>
        <p className="text-center text-sm text-gray-500 mb-6">
          Just sign in if you have an account in here. Enjoy our Website
        </p>

        {/* Form */}
        <form className="space-y-4" onSubmit={handleSubmit}>
          <div>
            <label className="text-xs text-blue-500 font-medium">
              Your Email / Username
            </label>
            <Input
              type="email"
              placeholder="soeraji@squareteam.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1 border-blue-200 focus-visible:ring-[#007BFF]"
            />
          </div>

          <div>
            <label className="text-xs text-red-500 font-medium">
              Enter Password
            </label>
            <Input
              type="password"
              placeholder="••••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1 border-red-200 focus-visible:ring-[#007BFF]"
            />
          </div>

          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center space-x-2">
              <Checkbox id="remember" />
              <label htmlFor="remember" className="text-gray-600">
                Remember Me
              </label>
            </div>
            <Link
              href="#"
              className="text-[#007BFF] hover:underline text-sm font-medium"
            >
              Forgot Password
            </Link>
          </div>

          <Button
            type="submit"
            disabled={isPending}
            className={cn(
              "w-full bg-[#007BFF] hover:bg-[#0066e6] text-white font-medium mt-4 py-2 rounded-md"
            )}
          >
            {isPending ? "Signing in..." : "Login"}
          </Button>
        </form>

        <p className="text-center text-sm text-gray-500 mt-6">
          Don't have an account yet?{" "}
          <Link
            href="/auth/register"
            className="text-[#007BFF] hover:underline font-medium"
          >
            Register
          </Link>
        </p>
      </div>
    </div>
  );
}
