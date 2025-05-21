"use client";

import React, { useEffect, useState } from "react";

type Medicine = {
  id: number;
  name: string;
  description: string;
  quantity: number;
  price: number;
  created_at: string;
  updated_at: string;
};

export default function PharmacyPage() {
  const [medicines, setMedicines] = useState<Medicine[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<Medicine | null>(null);
  const [cart, setCart] = useState<{ [id: number]: number }>({});
  const [buying, setBuying] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [showCart, setShowCart] = useState(false);

  // Fetch all medicines
  useEffect(() => {
    setLoading(true);
    fetch("http://localhost:8080/api/medicines/")
      .then((res) => res.json())
      .then((data) => setMedicines(data))
      .finally(() => setLoading(false));
  }, []);

  // Add to cart
  const addToCart = (id: number) => {
    setCart((prev) => ({
      ...prev,
      [id]: (prev[id] || 0) + 1,
    }));
    setMessage("Đã thêm vào giỏ hàng!");
    setTimeout(() => setMessage(null), 1200);
  };

  // Remove from cart
  const removeFromCart = (id: number) => {
    setCart((prev) => {
      const newCart = { ...prev };
      delete newCart[id];
      return newCart;
    });
  };

  // Update cart quantity
  const updateCart = (id: number, qty: number) => {
    if (qty <= 0) removeFromCart(id);
    else setCart((prev) => ({ ...prev, [id]: qty }));
  };

  // Buy medicines
  const handleBuy = async () => {
    setBuying(true);
    let ok = true;
    for (const id in cart) {
      const medicine = medicines.find((m) => m.id === Number(id));
      if (!medicine) continue;
      const newQty = medicine.quantity - cart[Number(id)];
      if (newQty < 0) {
        setMessage(`Không đủ số lượng cho ${medicine.name}`);
        ok = false;
        break;
      }
      // PATCH quantity
      await fetch(`http://localhost:8080/api/medicines/${id}/`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ quantity: newQty }),
      });
    }
    if (ok) {
      setMessage("Mua thành công!");
      setCart({});
      // Refresh medicines
      fetch("http://localhost:8080/api/medicines/")
        .then((res) => res.json())
        .then((data) => setMedicines(data));
    }
    setBuying(false);
    setTimeout(() => setMessage(null), 2000);
  };

  // Medicine detail modal
  const MedicineDetail = () =>
    selected && (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
        <div className="bg-white rounded-2xl shadow-2xl p-10 w-full max-w-lg animate-fadeIn relative border-2 border-blue-200">
          <button
            className="absolute top-4 right-4 text-gray-400 hover:text-blue-600 text-3xl"
            onClick={() => setSelected(null)}
            aria-label="Đóng"
          >
            ×
          </button>
          <h2 className="text-3xl font-extrabold mb-3 text-blue-700 flex items-center gap-2">
            <span className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
              <svg width="20" height="20" fill="none" viewBox="0 0 24 24">
                <path
                  d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-1-13h2v6h-2zm0 8h2v2h-2z"
                  fill="#2563eb"
                />
              </svg>
            </span>
            {selected.name}
          </h2>
          <p className="mb-4 text-gray-700 text-lg">{selected.description}</p>
          <div className="mb-2 flex items-center gap-2">
            <span className="font-semibold text-blue-700">Giá:</span>
            <span className="text-xl font-bold text-green-600">
              {selected.price.toLocaleString()}$
            </span>
          </div>
          <div className="mb-6 flex items-center gap-2">
            <span className="font-semibold text-blue-700">Số lượng còn:</span>
            <span className="text-lg">{selected.quantity}</span>
          </div>
          <button
            className="bg-gradient-to-r from-blue-500 to-green-400 text-white px-6 py-2 rounded-lg font-semibold shadow hover:from-blue-600 hover:to-green-500 transition"
            onClick={() => {
              addToCart(selected.id);
              setSelected(null);
            }}
          >
            Thêm vào giỏ
          </button>
        </div>
      </div>
    );

  // Cart modal
  const CartModal = () => (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl shadow-2xl p-10 w-full max-w-xl animate-fadeIn relative border-2 border-green-200">
        <button
          className="absolute top-4 right-4 text-gray-400 hover:text-green-600 text-3xl"
          onClick={() => setShowCart(false)}
          aria-label="Đóng"
        >
          ×
        </button>
        <h2 className="text-3xl font-extrabold mb-6 text-green-700 flex items-center gap-2">
          <span className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
            <svg width="20" height="20" fill="none" viewBox="0 0 24 24">
              <path
                d="M7 18c-1.1 0-1.99.9-1.99 2S5.9 22 7 22s2-.9 2-2-.9-2-2-2zm10 0c-1.1 0-1.99.9-1.99 2S15.9 22 17 22s2-.9 2-2-.9-2-2-2zM7.16 14.26l.03-.12L8.1 12h7.45c.75 0 1.41-.41 1.75-1.03l3.24-5.88a1 1 0 00-.89-1.47H5.21l-.94-2H1v2h2l3.6 7.59-1.35 2.44C4.52 16.37 5.48 18 7 18h12v-2H7.42c-.14 0-.25-.11-.26-.25z"
                fill="#16a34a"
              />
            </svg>
          </span>
          Giỏ hàng
        </h2>
        {Object.keys(cart).length === 0 ? (
          <div className="text-gray-500 text-lg text-center py-8">
            Chưa có sản phẩm nào.
          </div>
        ) : (
          <div>
            <table className="w-full mb-6 rounded overflow-hidden">
              <thead>
                <tr className="bg-green-50">
                  <th className="text-left py-2 px-2">Tên thuốc</th>
                  <th className="py-2 px-2">Số lượng</th>
                  <th className="py-2 px-2">Giá</th>
                  <th className="py-2 px-2"></th>
                </tr>
              </thead>
              <tbody>
                {Object.entries(cart).map(([id, qty]) => {
                  const med = medicines.find((m) => m.id === Number(id));
                  if (!med) return null;
                  return (
                    <tr
                      key={id}
                      className="border-t hover:bg-green-50 transition"
                    >
                      <td className="py-2 px-2 font-semibold">{med.name}</td>
                      <td className="py-2 px-2">
                        <input
                          type="number"
                          min={1}
                          max={med.quantity}
                          value={qty}
                          className="w-16 border rounded px-2 py-1 text-center"
                          onChange={(e) =>
                            updateCart(
                              Number(id),
                              Math.min(Number(e.target.value), med.quantity)
                            )
                          }
                        />
                      </td>
                      <td className="py-2 px-2 text-green-700 font-bold">
                        {(med.price * qty).toLocaleString()}$
                      </td>
                      <td className="py-2 px-2">
                        <button
                          className="text-red-500 hover:underline font-semibold"
                          onClick={() => removeFromCart(Number(id))}
                        >
                          Xóa
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
            <div className="flex justify-between items-center mt-4">
              <div className="text-lg font-semibold">
                <span className="text-gray-700">Tổng:</span>{" "}
                <span className="text-green-700 font-bold">
                  {Object.entries(cart)
                    .reduce((sum, [id, qty]) => {
                      const med = medicines.find((m) => m.id === Number(id));
                      return sum + (med ? med.price * qty : 0);
                    }, 0)
                    .toLocaleString()}
                  $
                </span>
              </div>
              <button
                className="bg-gradient-to-r from-green-500 to-blue-400 text-white px-6 py-2 rounded-lg font-semibold shadow hover:from-green-600 hover:to-blue-500 transition"
                onClick={handleBuy}
                disabled={buying}
              >
                {buying ? "Đang mua..." : "Mua ngay"}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 via-green-50 to-green-200">
      <header className="bg-white/80 shadow-lg sticky top-0 z-10 backdrop-blur">
        <div className="container mx-auto px-4 py-5 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <span className="w-12 h-12 bg-gradient-to-br from-blue-400 to-green-400 rounded-full flex items-center justify-center shadow">
              <svg width="28" height="28" fill="none" viewBox="0 0 24 24">
                <path
                  d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"
                  fill="#fff"
                  opacity="0.2"
                />
                <path
                  d="M21 7.5V6a2 2 0 00-2-2h-1.5a.5.5 0 01-.5-.5V2h-2v1.5a.5.5 0 01-.5.5H8.5A.5.5 0 018 3.5V2H6v1.5A.5.5 0 015.5 4H4a2 2 0 00-2 2v1.5a.5.5 0 01-.5.5H2v2h1.5a.5.5 0 01.5.5V15.5a.5.5 0 01-.5.5H2v2h1.5a.5.5 0 01.5.5V20a2 2 0 002 2h1.5a.5.5 0 01.5.5V22h2v-1.5a.5.5 0 01.5-.5h3a.5.5 0 01.5.5V22h2v-1.5a.5.5 0 01.5-.5H20a2 2 0 002-2v-1.5a.5.5 0 01.5-.5H22v-2h-1.5a.5.5 0 01-.5-.5V8.5a.5.5 0 01.5-.5H22v-2h-1.5a.5.5 0 01-.5-.5z"
                  fill="#2563eb"
                />
              </svg>
            </span>
            <h1 className="text-4xl font-extrabold text-blue-700 tracking-tight drop-shadow">
              Hiệu thuốc trực tuyến
            </h1>
          </div>
          <button
            className="relative bg-gradient-to-r from-blue-500 to-green-400 text-white px-6 py-2 rounded-lg font-semibold shadow hover:from-blue-600 hover:to-green-500 transition flex items-center gap-2"
            onClick={() => setShowCart(true)}
          >
            <svg width="22" height="22" fill="none" viewBox="0 0 24 24">
              <path
                d="M7 18c-1.1 0-1.99.9-1.99 2S5.9 22 7 22s2-.9 2-2-.9-2-2-2zm10 0c-1.1 0-1.99.9-1.99 2S15.9 22 17 22s2-.9 2-2-.9-2-2-2zM7.16 14.26l.03-.12L8.1 12h7.45c.75 0 1.41-.41 1.75-1.03l3.24-5.88a1 1 0 00-.89-1.47H5.21l-.94-2H1v2h2l3.6 7.59-1.35 2.44C4.52 16.37 5.48 18 7 18h12v-2H7.42c-.14 0-.25-.11-.26-.25z"
                fill="#fff"
              />
            </svg>
            Giỏ hàng
            {Object.keys(cart).length > 0 && (
              <span className="absolute -top-2 -right-2 bg-red-500 text-xs rounded-full px-2 py-0.5 font-bold shadow">
                {Object.values(cart).reduce((a, b) => a + b, 0)}
              </span>
            )}
          </button>
        </div>
      </header>

      <main className="container mx-auto px-4 py-12">
        {message && (
          <div className="fixed top-6 left-1/2 -translate-x-1/2 bg-green-100 text-green-800 px-8 py-3 rounded-xl shadow-lg animate-fadeIn z-50 text-lg font-semibold border border-green-300">
            {message}
          </div>
        )}
        <h2 className="text-3xl font-bold mb-8 text-gray-800 flex items-center gap-2">
          <span className="w-7 h-7 bg-blue-100 rounded-full flex items-center justify-center">
            <svg width="18" height="18" fill="none" viewBox="0 0 24 24">
              <path
                d="M12 2a7 7 0 00-7 7c0 5.25 7 13 7 13s7-7.75 7-13a7 7 0 00-7-7zm0 9.5A2.5 2.5 0 1112 6a2.5 2.5 0 010 5.5z"
                fill="#2563eb"
              />
            </svg>
          </span>
          Danh sách thuốc
        </h2>
        {loading ? (
          <div className="flex justify-center items-center h-40">
            <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-600"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-10">
            {medicines.map((med) => (
              <div
                key={med.id}
                className={`bg-white rounded-2xl shadow-xl hover:shadow-2xl transition p-7 flex flex-col items-start group relative overflow-hidden border-2 ${
                  med.quantity === 0
                    ? "opacity-60 border-gray-200"
                    : "border-blue-100"
                }`}
              >
                <div className="absolute right-5 top-5 bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-xs font-semibold shadow">
                  {med.quantity > 0 ? `Còn: ${med.quantity}` : "Hết hàng"}
                </div>
                <h3 className="text-xl font-bold mb-2 group-hover:text-blue-700 transition">
                  {med.name}
                </h3>
                <p className="text-gray-600 mb-4 line-clamp-2 text-base">
                  {med.description}
                </p>
                <div className="mb-4 text-blue-700 font-extrabold text-xl">
                  {med.price.toLocaleString()}$
                </div>
                <div className="flex gap-2 mt-auto">
                  <button
                    className="bg-gradient-to-r from-blue-500 to-green-400 text-white px-4 py-2 rounded-lg font-semibold shadow hover:from-blue-600 hover:to-green-500 transition"
                    disabled={med.quantity === 0}
                    onClick={() => addToCart(med.id)}
                  >
                    Thêm vào giỏ
                  </button>
                  <button
                    className="text-blue-600 underline hover:text-blue-800 font-semibold"
                    onClick={() => setSelected(med)}
                  >
                    Xem chi tiết
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
      {selected && <MedicineDetail />}
      {showCart && <CartModal />}
      <style jsx global>{`
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
        .animate-fadeIn {
          animation: fadeIn 0.3s;
        }
        /* Custom scrollbar for modals */
        .modal-content::-webkit-scrollbar {
          width: 8px;
        }
        .modal-content::-webkit-scrollbar-thumb {
          background: #c7e0f7;
          border-radius: 4px;
        }
      `}</style>
    </div>
  );
}
