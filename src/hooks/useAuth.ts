"use client";

import { useMutation } from "@tanstack/react-query";
import { api } from "@/lib/axios"; // pastikan path sesuai


//Menampilkan pesan error API secara ringkas ke pengguna.
function handleApiError(error: any) {
  const apiError = error.response?.data;

  if (apiError?.errors?.length > 0) {
    alert(apiError.errors.join("\n"));
  } else {
    alert("Terjadi kesalahan. Silakan coba lagi nanti.");
  }
}


//Hook untuk mendaftarkan pengguna baru.
export function useRegister() {
  return useMutation({
    mutationFn: async (data: { email: string; fullName: string; password: string }) => {
      const res = await api.post("/register", data, {
        headers: { "Content-Type": "application/json" },
      });
      return res.data;
    },

    onSuccess: (data) => {
      if (data?.message === "Bad Request") {
        alert(data.errors.join("\n"));
      } else {
        alert("Registrasi berhasil. Silakan login.");
        window.location.href = "/auth/login";
      }
    },

    onError: handleApiError,
  });
}


//Hook untuk melakukan login pengguna (termasuk admin).
export function useLogin() {
  return useMutation({
    mutationFn: async (data: { email: string; password: string }) => {
      const res = await api.post("/login", data, {
        headers: { "Content-Type": "application/json" },
      });
      return res.data;
    },

    onSuccess: (data, variables) => {
      const { email, password } = variables;

      // Login sebagai admin
      if (email === "admin@nodewave.id" && password === "admin123") {
        localStorage.setItem("token", data.content.token);
        localStorage.setItem("user", JSON.stringify(data.content.user));
        alert("Login admin berhasil.");
        window.location.href = "/admin";
        return;
      }

      // Login sebagai user biasa
      if (data?.content?.token) {
        localStorage.setItem("token", data.content.token);
        localStorage.setItem("user", JSON.stringify(data.content.user));
        alert("Login berhasil.");
        window.location.href = "/todos";
      } else {
        alert("Login gagal. Periksa email dan password.");
      }
    },

    onError: handleApiError,
  });
}


//Hook untuk memverifikasi token pengguna melalui endpoint /verify-token.
 
export function useVerifyToken() {
  return useMutation({
    mutationFn: async (data: { token: string }) => {
      const res = await api.post("/verify-token", data, {
        headers: { "Content-Type": "application/json" },
      });
      return res.data;
    },

    onSuccess: (data) => {
      if (data?.message === "Token Verified!") {
        console.log("Token valid:", data);
      } else {
        console.warn("Token tidak valid:", data);
      }
    },

    onError: handleApiError,
  });
}

//Fungsi utilitas untuk memverifikasi token tersimpan saat reload.
export async function verifyStoredToken() {
  const token = localStorage.getItem("token");
  if (!token) return false;

  try {
    const res = await api.post("/verify-token", { token });
    return res.data.message === "Token Verified!";
  } catch {
    return false;
  }
}
