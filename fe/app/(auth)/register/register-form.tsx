"use client";

import React, { useState } from "react";

export default function RegisterForm() {
  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError("");
    setSuccess("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");
    try {
      const res = await fetch("http://localhost:8080/api/users/register/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, role: "patient" }),
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.message || "Đăng ký thất bại");
      }
      setSuccess("Đăng ký thành công!");
      setForm({ username: "", email: "", password: "" });
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-blue-100 to-purple-200">
      <form
        onSubmit={handleSubmit}
        className="bg-white rounded-xl shadow-2xl p-8 w-full max-w-md space-y-6 animate-fade-in"
      >
        <h2 className="text-2xl font-bold text-center text-blue-700 mb-4">
          Đăng ký tài khoản
        </h2>
        {error && (
          <div className="bg-red-100 text-red-700 px-4 py-2 rounded mb-2 text-center animate-shake">
            {error}
          </div>
        )}
        {success && (
          <div className="bg-green-100 text-green-700 px-4 py-2 rounded mb-2 text-center animate-bounce">
            {success}
          </div>
        )}
        <div>
          <label className="block text-gray-700 font-medium mb-1">
            Tên đăng nhập
          </label>
          <input
            type="text"
            name="username"
            value={form.username}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
            placeholder="Nhập tên đăng nhập"
          />
        </div>
        <div>
          <label className="block text-gray-700 font-medium mb-1">Email</label>
          <input
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
            placeholder="Nhập email"
          />
        </div>
        <div>
          <label className="block text-gray-700 font-medium mb-1">
            Mật khẩu
          </label>
          <input
            type="password"
            name="password"
            value={form.password}
            onChange={handleChange}
            required
            minLength={6}
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
            placeholder="Nhập mật khẩu"
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          className={`w-full py-2 rounded-lg font-semibold text-white bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 transition-all shadow-lg ${
            loading ? "opacity-60 cursor-not-allowed" : ""
          }`}
        >
          {loading ? "Đang đăng ký..." : "Đăng ký"}
        </button>
        <style jsx>{`
          .animate-fade-in {
            animation: fadeIn 0.8s;
          }
          @keyframes fadeIn {
            from {
              opacity: 0;
              transform: translateY(20px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }
          .animate-shake {
            animation: shake 0.4s;
          }
          @keyframes shake {
            10%,
            90% {
              transform: translateX(-2px);
            }
            20%,
            80% {
              transform: translateX(4px);
            }
            30%,
            50%,
            70% {
              transform: translateX(-8px);
            }
            40%,
            60% {
              transform: translateX(8px);
            }
          }
        `}</style>
      </form>
    </div>
  );
}
