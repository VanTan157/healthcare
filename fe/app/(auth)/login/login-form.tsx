"use client";
import React, { useState } from "react";

export default function LoginForm() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await fetch("http://localhost:8080/api/token/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
      });
      if (!res.ok) {
        throw new Error("Tên đăng nhập hoặc mật khẩu không đúng.");
      }
      // const data = await res.json(); // handle token here if needed
      alert("Đăng nhập thành công!");
    } catch (err: any) {
      setError(err.message || "Có lỗi xảy ra.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#a8edea] to-[#fed6e3]">
      <form
        className="bg-white p-10 rounded-2xl shadow-xl w-full max-w-sm flex flex-col gap-5 animate-fade-in"
        onSubmit={handleSubmit}
        autoComplete="off"
      >
        <h2 className="text-center mb-2 text-gray-800 font-bold text-2xl">
          Đăng nhập
        </h2>
        <div className="flex flex-col gap-1">
          <label htmlFor="username" className="text-base text-gray-600">
            Tên đăng nhập
          </label>
          <input
            id="username"
            type="text"
            placeholder="Nhập tên đăng nhập"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            autoFocus
            className="px-4 py-3 border border-gray-200 rounded-lg text-base focus:outline-none focus:border-[#a8edea] focus:ring-2 focus:ring-[#a8edea]/30 transition"
          />
        </div>
        <div className="flex flex-col gap-1">
          <label htmlFor="password" className="text-base text-gray-600">
            Mật khẩu
          </label>
          <div className="relative flex items-center">
            <input
              id="password"
              type={showPassword ? "text" : "password"}
              placeholder="Nhập mật khẩu"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="px-4 py-3 border border-gray-200 rounded-lg text-base w-full focus:outline-none focus:border-[#a8edea] focus:ring-2 focus:ring-[#a8edea]/30 transition"
            />
            <button
              type="button"
              className="absolute right-3 top-1/2 -translate-y-1/2 text-xl text-gray-400 hover:text-gray-700 transition"
              onClick={() => setShowPassword(!showPassword)}
              tabIndex={-1}
              aria-label="Hiện/ẩn mật khẩu"
            >
              {showPassword ? "🙈" : "👁️"}
            </button>
          </div>
        </div>
        {error && (
          <div className="text-red-600 bg-red-50 rounded-md px-4 py-2 text-center text-sm">
            {error}
          </div>
        )}
        <button
          className="mt-2 py-3 bg-gradient-to-r from-[#a8edea] to-[#fed6e3] rounded-lg text-gray-800 text-lg font-semibold shadow-md hover:brightness-105 active:scale-95 transition disabled:opacity-70 disabled:cursor-not-allowed"
          type="submit"
          disabled={loading}
        >
          {loading ? (
            <span className="inline-block w-5 h-5 border-2 border-gray-200 border-t-[#a8edea] rounded-full animate-spin align-middle"></span>
          ) : (
            "Đăng nhập"
          )}
        </button>
      </form>
      <style jsx global>{`
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fade-in {
          animation: fade-in 0.7s cubic-bezier(0.4, 0, 0.2, 1);
        }
      `}</style>
    </div>
  );
}
