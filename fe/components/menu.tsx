"use client";

import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import Cookies from "js-cookie";
import {
  FaUserCircle,
  FaFileMedical,
  FaVial,
  FaSignOutAlt,
  FaShieldAlt,
} from "react-icons/fa";
import { useRouter } from "next/navigation";

const Menu = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

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
    setMenuOpen(false);
    window.location.href = "/login";
  };
  return (
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
            href={"/hosoyte"}
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
  );
};

export default Menu;
