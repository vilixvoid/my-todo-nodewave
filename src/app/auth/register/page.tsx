"use client";

import React, { useState } from "react";
import { useRegister } from "@/hooks/useAuth";

export default function RegisterPage() {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const { mutate: register, isPending } = useRegister();

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      alert("Password and confirmation must match!");
      return;
    }

    // Menggabungkan nama depan + belakang
    const fullName = `${firstName} ${lastName}`.trim();

    register({
      email: `${email}@nodewave.id`,
      fullName, 
      password,
    });
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-[#f9fafc] px-4">
      {/* Header */}
      <div className="text-center mb-10">
        <h1 className="text-4xl font-extrabold text-[#111827] tracking-tight">
          Register
        </h1>
        <p className="text-gray-500 mt-2 text-sm">
          Sign up to enter the Nodewave Application.
        </p>
      </div>

      {/* Card */}
      <div className="bg-white w-full max-w-xl p-8 rounded-2xl shadow-md">
        <form className="space-y-5" onSubmit={handleRegister}>
          {/* Name */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-xs text-[#1A56DB] font-medium">
                First Name
              </label>
              <input
                type="text"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                placeholder="John"
                className="w-full mt-1 rounded-lg border border-[#e5e7eb] px-3 py-2 focus:border-[#1A56DB] focus:ring-1 focus:ring-[#1A56DB] outline-none text-sm"
              />
            </div>
            <div>
              <label className="text-xs text-[#1A56DB] font-medium">
                Last Name
              </label>
              <input
                type="text"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                placeholder="Doe"
                className="w-full mt-1 rounded-lg border border-[#e5e7eb] px-3 py-2 focus:border-[#1A56DB] focus:ring-1 focus:ring-[#1A56DB] outline-none text-sm"
              />
            </div>
          </div>

          {/* Email */}
          <div>
            <label className="text-xs text-[#1A56DB] font-medium">
              Mail Address
            </label>
            <div className="relative mt-1">
              <input
                type="text"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="johdoe"
                className="w-full rounded-lg border border-[#e5e7eb] px-3 py-2 pr-28 focus:border-[#1A56DB] focus:ring-1 focus:ring-[#1A56DB] outline-none text-sm"
              />
              <span className="absolute inset-y-0 right-3 flex items-center text-gray-400 text-sm select-none">
                @nodewave.id
              </span>
            </div>
          </div>

          {/* Password */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-xs text-[#1A56DB] font-medium">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full mt-1 rounded-lg border border-[#e5e7eb] px-3 py-2 focus:border-[#1A56DB] focus:ring-1 focus:ring-[#1A56DB] outline-none text-sm"
              />
            </div>
            <div>
              <label className="text-xs text-[#1A56DB] font-medium">
                Confirm Password
              </label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full mt-1 rounded-lg border border-[#e5e7eb] px-3 py-2 focus:border-[#1A56DB] focus:ring-1 focus:ring-[#1A56DB] outline-none text-sm"
              />
            </div>
          </div>

          {/* Readonly fields (for UI only) */}
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="text-xs text-[#9ca3af] font-medium">Code</label>
              <input
                type="text"
                value="+62"
                readOnly
                className="w-full mt-1 rounded-lg border border-[#e5e7eb] bg-gray-50 text-gray-400 px-3 py-2 text-center text-sm"
              />
            </div>
            <div>
              <label className="text-xs text-[#9ca3af] font-medium">
                Phone Number
              </label>
              <input
                type="text"
                value="8123456789"
                readOnly
                className="w-full mt-1 rounded-lg border border-[#e5e7eb] bg-gray-50 text-gray-400 px-3 py-2 text-sm"
              />
            </div>
            <div>
              <label className="text-xs text-[#9ca3af] font-medium">
                Country
              </label>
              <input
                type="text"
                value="Indonesia"
                readOnly
                className="w-full mt-1 rounded-lg border border-[#e5e7eb] bg-gray-50 text-gray-400 px-3 py-2 text-sm"
              />
            </div>
          </div>

          {/* Readonly About */}
          <div>
            <label className="text-xs text-[#9ca3af] font-medium">
              About Me
            </label>
            <textarea
              value="This field is readonly."
              readOnly
              className="w-full mt-1 h-20 resize-none rounded-lg border border-[#e5e7eb] bg-gray-50 text-gray-400 px-3 py-2 text-sm"
            ></textarea>
          </div>

          {/* Buttons */}
          <div className="flex gap-4 pt-4">
            <button
              type="button"
              onClick={() => (window.location.href = "/auth/login")}
              className="flex-1 rounded-lg bg-gray-100 py-2 font-semibold text-gray-700 hover:bg-gray-200 transition text-sm"
            >
              Login
            </button>
            <button
              type="submit"
              disabled={isPending}
              className="flex-1 rounded-lg bg-[#1A56DB] py-2 font-semibold text-white hover:bg-[#1747b3] transition text-sm"
            >
              {isPending ? "Registering..." : "Register"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
