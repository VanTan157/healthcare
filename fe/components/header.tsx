import { cookies } from "next/headers";
import Link from "next/link";
import {
  FaCalendarAlt,
  FaCapsules,
  FaBell,
  FaRobot,
  FaCreditCard,
  FaShieldAlt,
} from "react-icons/fa";
import Menu from "./menu";
import GlobalFadeInUpStyle from "./global-fade in-up";

export default async function Header() {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get("access")?.value;
  const role = cookieStore.get("role")?.value;
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
        {accessToken ? (
          role === "patient" ? (
            <div className="flex items-center gap-6">
              <Link
                href={"/lichhen"}
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
              <Menu />
            </div>
          ) : role === "doctor" ? (
            <div className="flex items-center gap-6">
              <Link
                href={"/doctor/appointments"}
                className="flex items-center gap-1 px-3 py-2 rounded-lg text-white hover:bg-blue-600 transition-all duration-200"
              >
                <FaCalendarAlt className="text-blue-300" /> Quản lý lịch hẹn
              </Link>
              <Link
                href={"/doctor/patients"}
                className="flex items-center gap-1 px-3 py-2 rounded-lg text-white hover:bg-green-600 transition-all duration-200"
              >
                <svg
                  className="w-5 h-5 text-green-300"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M10 10a4 4 0 100-8 4 4 0 000 8zm-7 8a7 7 0 1114 0H3z" />
                </svg>
                Bệnh nhân
              </Link>
              <Link
                href={"/doctor/laboratory"}
                className="flex items-center gap-1 px-3 py-2 rounded-lg text-white hover:bg-blue-600 transition-all duration-200"
              >
                <svg
                  className="w-5 h-5 text-blue-300"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={2}
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M9 17v-2a2 2 0 012-2h2a2 2 0 012 2v2m-7 4h10a2 2 0 002-2v-5a7 7 0 10-14 0v5a2 2 0 002 2z"
                  />
                </svg>
                Tạo yêu cầu xét nghiệm
              </Link>
              <Link
                href={"/doctor/profile"}
                className="flex items-center gap-1 px-3 py-2 rounded-lg text-white hover:bg-yellow-600 transition-all duration-200"
              >
                <svg
                  className="w-5 h-5 text-yellow-300"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M10 10a4 4 0 100-8 4 4 0 000 8zm-7 8a7 7 0 1114 0H3z" />
                </svg>
                Hồ sơ
              </Link>
              <Menu />
            </div>
          ) : role === "pharmacist" ? (
            <div className="flex items-center gap-6">
              <Link
                href={"/pharamacist/medicines"}
                className="flex items-center gap-1 px-3 py-2 rounded-lg text-white hover:bg-blue-600 transition-all duration-200"
              >
                <FaCapsules className="text-blue-300" /> Quản lý thuốc
              </Link>
              <Menu />
            </div>
          ) : role === "insurance_provider" ? (
            <div className="flex items-center gap-6">
              <Link
                href={"/insurance_management"}
                className="flex items-center gap-1 px-3 py-2 rounded-lg text-white hover:bg-blue-600 transition-all duration-200"
              >
                <FaShieldAlt className="text-blue-300" /> Quản lý bảo hiểm
              </Link>
              <Menu />
            </div>
          ) : (
            <div className="flex items-center gap-6">
              <Link
                href={"/lab_technician/laboratory"}
                className="flex items-center gap-1 px-3 py-2 rounded-lg text-white hover:bg-blue-600 transition-all duration-200"
              >
                <svg
                  className="w-5 h-5 text-blue-300"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={2}
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M9 17v-2a2 2 0 012-2h2a2 2 0 012 2v2m-7 4h10a2 2 0 002-2v-5a7 7 0 10-14 0v5a2 2 0 002 2z"
                  />
                </svg>
                Quản lý xét nghiệm
              </Link>
              <Menu />
            </div>
          )
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
      <GlobalFadeInUpStyle />
    </header>
  );
}
