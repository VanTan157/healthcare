"use client";
import Link from "next/link";
import { useEffect, useState, useRef } from "react";
import Cookies from "js-cookie";
import {
  FaUserCircle,
  FaCalendarAlt,
  FaCapsules,
  FaBell,
  FaRobot,
  FaCreditCard,
  FaFileMedical,
  FaVial,
  FaSignOutAlt,
  FaShieldAlt,
} from "react-icons/fa";

export default function Header() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setIsLoggedIn(!!Cookies.get("access"));
  }, []);

  // Đóng menu khi click ra ngoài
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setMenuOpen(false);
      }
    }
    if (menuOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [menuOpen]);

  const handleLogout = () => {
    Cookies.remove("access");
    Cookies.remove("refresh");
    setIsLoggedIn(false);
    setMenuOpen(false);
    window.location.href = "/login";
  };

  return (
    <header className="bg-gradient-to-r from-blue-700 via-blue-800 to-gray-900 shadow-lg">
      <nav className="max-w-6xl mx-auto flex items-center justify-between px-6 py-4">
        <Link
          href={"/"}
          className="flex items-center gap-2 text-3xl font-extrabold text-white tracking-wide hover:scale-105 transition-transform duration-200"
        >
          <svg
            className="w-8 h-8 text-blue-300"
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M3 12l2-2m0 0l7-7 7 7m-9 2v6m0 0h4m-4 0a2 2 0 01-2-2V7.414a1 1 0 01.293-.707l7-7a1 1 0 011.414 0l7 7a1 1 0 01.293.707V16a2 2 0 01-2 2h-4"
            />
          </svg>
          Home
        </Link>
        {isLoggedIn ? (
          <div className="flex items-center gap-6">
            <Link
              href={"/appointment"}
              className="flex items-center gap-1 px-3 py-2 rounded-lg text-white hover:bg-blue-600 transition-all duration-200"
            >
              <FaCalendarAlt className="text-blue-300" /> Đặt lịch hẹn
            </Link>
            <Link
              href={"/insurance"}
              className="flex items-center gap-1 px-3 py-2 rounded-lg text-white hover:bg-green-600 transition-all duration-200"
            >
              <FaShieldAlt className="text-green-300" /> Bảo hiểm
            </Link>
            <Link
              href={"/pharmacy"}
              className="flex items-center gap-1 px-3 py-2 rounded-lg text-white hover:bg-purple-600 transition-all duration-200"
            >
              <FaCapsules className="text-purple-300" /> Nhà thuốc
            </Link>
            <Link
              href={"/payment"}
              className="flex items-center gap-1 px-3 py-2 rounded-lg text-white hover:bg-yellow-600 transition-all duration-200"
            >
              <FaCreditCard className="text-yellow-300" /> Thanh toán
            </Link>
            <Link
              href={"/notifications"}
              className="flex items-center gap-1 px-3 py-2 rounded-lg text-white hover:bg-pink-600 transition-all duration-200"
            >
              <FaBell className="text-pink-300" /> Thông báo
            </Link>
            <Link
              href={"/chatbot"}
              className="flex items-center gap-1 px-3 py-2 rounded-lg text-white hover:bg-indigo-600 transition-all duration-200"
            >
              <FaRobot className="text-indigo-300" /> Chatbot
            </Link>
            <div className="relative" ref={menuRef}>
              <button
                onClick={() => setMenuOpen((v) => !v)}
                className="flex items-center gap-2 px-3 py-2 rounded-full bg-white/10 hover:bg-white/20 transition-all duration-200 focus:outline-none"
              >
                <FaUserCircle className="text-3xl text-white" />
              </button>
              {menuOpen && (
                <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-xl z-50 animate-fade-in-up border border-gray-200">
                  <div className="p-4 border-b border-gray-100 font-semibold text-gray-700">
                    Tài khoản
                  </div>
                  <Link
                    href={"/profile"}
                    className="flex items-center gap-2 px-4 py-2 hover:bg-blue-50 transition"
                  >
                    <FaUserCircle /> Thông tin cá nhân
                  </Link>
                  <Link
                    href={"/medical-record"}
                    className="flex items-center gap-2 px-4 py-2 hover:bg-blue-50 transition"
                  >
                    <FaFileMedical /> Hồ sơ y tế
                  </Link>
                  <Link
                    href={"/insurance"}
                    className="flex items-center gap-2 px-4 py-2 hover:bg-blue-50 transition"
                  >
                    <FaShieldAlt /> Bảo hiểm
                  </Link>
                  <Link
                    href={"/test-results"}
                    className="flex items-center gap-2 px-4 py-2 hover:bg-blue-50 transition"
                  >
                    <FaVial /> Kết quả xét nghiệm
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="flex items-center gap-2 w-full px-4 py-2 text-red-600 hover:bg-red-50 transition"
                  >
                    <FaSignOutAlt /> Đăng xuất
                  </button>
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="flex gap-6">
            <Link
              href={"/login"}
              className="relative px-4 py-2 rounded-lg font-semibold text-white hover:bg-blue-600 hover:shadow-lg transition-all duration-200 group"
            >
              <span className="absolute left-0 bottom-0 w-0 h-1 bg-blue-400 group-hover:w-full transition-all duration-300 rounded"></span>
              Login
            </Link>
            <Link
              href={"/register"}
              className="relative px-4 py-2 rounded-lg font-semibold text-white hover:bg-green-600 hover:shadow-lg transition-all duration-200 group"
            >
              <span className="absolute left-0 bottom-0 w-0 h-1 bg-green-400 group-hover:w-full transition-all duration-300 rounded"></span>
              Register
            </Link>
          </div>
        )}
      </nav>
      <style jsx global>{`
        @keyframes fade-in-up {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fade-in-up {
          animation: fade-in-up 0.2s ease;
        }
      `}</style>
    </header>
  );
}
