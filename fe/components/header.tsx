import Link from "next/link";

export default function Header() {
  return (
    <div className="flex justify-between items-center p-4 bg-gray-800 text-white text-xl shadow">
      <div className="font-bold text-2xl">Home</div>
      <div className="flex gap-4">
        <Link href="/login" className="hover:text-gray-300 transition-colors">
          Login
        </Link>
        <Link
          href="/register"
          className="hover:text-gray-300 transition-colors"
        >
          Register
        </Link>
      </div>
    </div>
  );
}
