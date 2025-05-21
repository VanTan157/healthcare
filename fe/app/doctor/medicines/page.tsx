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

type MedicineFormProps = {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: Omit<Medicine, "id" | "created_at" | "updated_at">) => void;
  initialData?: Omit<Medicine, "id" | "created_at" | "updated_at">;
  isEdit?: boolean;
};

const MedicineForm: React.FC<MedicineFormProps> = ({
  open,
  onClose,
  onSubmit,
  initialData,
  isEdit,
}) => {
  const [form, setForm] = useState({
    name: "",
    description: "",
    quantity: 0,
    price: 0,
  });

  useEffect(() => {
    if (initialData) {
      setForm(initialData);
    } else {
      setForm({
        name: "",
        description: "",
        quantity: 0,
        price: 0,
      });
    }
  }, [initialData, open]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-md p-6 animate-fadeIn">
        <h2 className="text-xl font-semibold mb-4">
          {isEdit ? "Cập nhật thuốc" : "Thêm thuốc mới"}
        </h2>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            onSubmit({
              name: form.name,
              description: form.description,
              quantity: Number(form.quantity),
              price: Number(form.price),
            });
          }}
          className="space-y-4"
        >
          <div>
            <label className="block text-sm font-medium">Tên thuốc</label>
            <input
              className="mt-1 w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
              required
              value={form.name}
              onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
            />
          </div>
          <div>
            <label className="block text-sm font-medium">Mô tả</label>
            <input
              className="mt-1 w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
              required
              value={form.description}
              onChange={(e) =>
                setForm((f) => ({ ...f, description: e.target.value }))
              }
            />
          </div>
          <div>
            <label className="block text-sm font-medium">Số lượng</label>
            <input
              type="number"
              min={0}
              className="mt-1 w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
              required
              value={form.quantity}
              onChange={(e) =>
                setForm((f) => ({
                  ...f,
                  quantity: Number(e.target.value),
                }))
              }
            />
          </div>
          <div>
            <label className="block text-sm font-medium">Giá</label>
            <input
              type="number"
              min={0}
              step={0.01}
              className="mt-1 w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
              required
              value={form.price}
              onChange={(e) =>
                setForm((f) => ({
                  ...f,
                  price: Number(e.target.value),
                }))
              }
            />
          </div>
          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300 transition"
              onClick={onClose}
            >
              Hủy
            </button>
            <button
              type="submit"
              className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700 transition"
            >
              {isEdit ? "Cập nhật" : "Thêm"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

const MedicineTable: React.FC<{
  medicines: Medicine[];
  onEdit: (medicine: Medicine) => void;
  onDelete: (medicine: Medicine) => void;
  onView: (medicine: Medicine) => void;
}> = ({ medicines, onEdit, onDelete, onView }) => (
  <div className="overflow-x-auto">
    <table className="min-w-full bg-white rounded shadow">
      <thead>
        <tr className="bg-blue-50">
          <th className="py-2 px-4 text-left">ID</th>
          <th className="py-2 px-4 text-left">Tên thuốc</th>
          <th className="py-2 px-4 text-left">Mô tả</th>
          <th className="py-2 px-4 text-right">Số lượng</th>
          <th className="py-2 px-4 text-right">Giá</th>
          <th className="py-2 px-4 text-center">Hành động</th>
        </tr>
      </thead>
      <tbody>
        {medicines.length === 0 && (
          <tr>
            <td colSpan={6} className="text-center py-4 text-gray-500">
              Không có thuốc nào trong kho.
            </td>
          </tr>
        )}
        {medicines.map((m) => (
          <tr key={m.id} className="hover:bg-blue-50 transition cursor-pointer">
            <td className="py-2 px-4">{m.id}</td>
            <td className="py-2 px-4">{m.name}</td>
            <td className="py-2 px-4">{m.description}</td>
            <td className="py-2 px-4 text-right">{m.quantity}</td>
            <td className="py-2 px-4 text-right">
              {m.price.toLocaleString("vi-VN", {
                style: "currency",
                currency: "VND",
                minimumFractionDigits: 2,
              })}
            </td>
            <td className="py-2 px-4 flex gap-2 justify-center">
              <button
                className="px-2 py-1 rounded bg-green-500 text-white hover:bg-green-600 transition text-xs"
                onClick={() => onView(m)}
                title="Xem chi tiết"
              >
                Xem
              </button>
              <button
                className="px-2 py-1 rounded bg-yellow-500 text-white hover:bg-yellow-600 transition text-xs"
                onClick={() => onEdit(m)}
                title="Sửa"
              >
                Sửa
              </button>
              <button
                className="px-2 py-1 rounded bg-red-500 text-white hover:bg-red-600 transition text-xs"
                onClick={() => onDelete(m)}
                title="Xóa"
              >
                Xóa
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

const MedicineDetailModal: React.FC<{
  open: boolean;
  medicine?: Medicine;
  onClose: () => void;
}> = ({ open, medicine, onClose }) => {
  if (!open || !medicine) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-md p-6 animate-fadeIn">
        <h2 className="text-xl font-semibold mb-4">Chi tiết thuốc</h2>
        <div className="space-y-2">
          <div>
            <span className="font-medium">ID:</span> {medicine.id}
          </div>
          <div>
            <span className="font-medium">Tên thuốc:</span> {medicine.name}
          </div>
          <div>
            <span className="font-medium">Mô tả:</span> {medicine.description}
          </div>
          <div>
            <span className="font-medium">Số lượng:</span> {medicine.quantity}
          </div>
          <div>
            <span className="font-medium">Giá:</span>{" "}
            {medicine.price.toLocaleString("vi-VN", {
              style: "currency",
              currency: "VND",
              minimumFractionDigits: 2,
            })}
          </div>
          <div>
            <span className="font-medium">Ngày tạo:</span>{" "}
            {new Date(medicine.created_at).toLocaleString("vi-VN")}
          </div>
          <div>
            <span className="font-medium">Ngày cập nhật:</span>{" "}
            {new Date(medicine.updated_at).toLocaleString("vi-VN")}
          </div>
        </div>
        <div className="flex justify-end pt-4">
          <button
            className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700 transition"
            onClick={onClose}
          >
            Đóng
          </button>
        </div>
      </div>
    </div>
  );
};

const ConfirmModal: React.FC<{
  open: boolean;
  title: string;
  description: string;
  onConfirm: () => void;
  onCancel: () => void;
}> = ({ open, title, description, onConfirm, onCancel }) => {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-sm p-6 animate-fadeIn">
        <h2 className="text-lg font-semibold mb-2">{title}</h2>
        <p className="mb-4">{description}</p>
        <div className="flex justify-end gap-2">
          <button
            className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300 transition"
            onClick={onCancel}
          >
            Hủy
          </button>
          <button
            className="px-4 py-2 rounded bg-red-600 text-white hover:bg-red-700 transition"
            onClick={onConfirm}
          >
            Xác nhận
          </button>
        </div>
      </div>
    </div>
  );
};

const fetchMedicines = async (): Promise<Medicine[]> => {
  const res = await fetch("http://localhost:8080/api/medicines/", {
    cache: "no-store",
  });
  if (!res.ok) throw new Error("Lỗi khi lấy danh sách thuốc");
  return res.json();
};

const createMedicine = async (
  data: Omit<Medicine, "id" | "created_at" | "updated_at">
) => {
  const res = await fetch("http://localhost:8080/api/medicines/", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Lỗi khi tạo thuốc");
  return res.json();
};

const updateMedicine = async (
  id: number,
  data: Omit<Medicine, "id" | "created_at" | "updated_at">
) => {
  const res = await fetch(`http://localhost:8080/api/medicines/${id}/`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Lỗi khi cập nhật thuốc");
  return res.json();
};

const deleteMedicine = async (id: number) => {
  const res = await fetch(`http://localhost:8080/api/medicines/${id}/`, {
    method: "DELETE",
  });
  if (!res.ok) throw new Error("Lỗi khi xóa thuốc");
};

const getMedicineDetail = async (id: number): Promise<Medicine> => {
  const res = await fetch(`http://localhost:8080/api/medicines/${id}/`);
  if (!res.ok) throw new Error("Lỗi khi lấy chi tiết thuốc");
  return res.json();
};

const MedicinesPage: React.FC = () => {
  const [medicines, setMedicines] = useState<Medicine[]>([]);
  const [loading, setLoading] = useState(true);
  const [formOpen, setFormOpen] = useState(false);
  const [editMedicine, setEditMedicine] = useState<Medicine | null>(null);
  const [detailMedicine, setDetailMedicine] = useState<Medicine | null>(null);
  const [detailOpen, setDetailOpen] = useState(false);
  const [deleteMedicineId, setDeleteMedicineId] = useState<number | null>(null);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [error, setError] = useState<string | null>(null);

  const loadMedicines = async () => {
    setLoading(true);
    try {
      const data = await fetchMedicines();
      setMedicines(data);
    } catch (e: any) {
      setError(e.message || "Lỗi không xác định");
    }
    setLoading(false);
  };

  useEffect(() => {
    loadMedicines();
  }, []);

  const handleAdd = () => {
    setEditMedicine(null);
    setFormOpen(true);
  };

  const handleEdit = (medicine: Medicine) => {
    setEditMedicine(medicine);
    setFormOpen(true);
  };

  const handleDelete = (medicine: Medicine) => {
    setDeleteMedicineId(medicine.id);
    setConfirmOpen(true);
  };

  const handleView = async (medicine: Medicine) => {
    try {
      const detail = await getMedicineDetail(medicine.id);
      setDetailMedicine(detail);
      setDetailOpen(true);
    } catch (e: any) {
      setError(e.message || "Lỗi không xác định");
    }
  };

  const handleFormSubmit = async (
    data: Omit<Medicine, "id" | "created_at" | "updated_at">
  ) => {
    try {
      if (editMedicine) {
        await updateMedicine(editMedicine.id, data);
      } else {
        await createMedicine(data);
      }
      setFormOpen(false);
      setEditMedicine(null);
      await loadMedicines();
    } catch (e: any) {
      setError(e.message || "Lỗi không xác định");
    }
  };

  const handleConfirmDelete = async () => {
    if (deleteMedicineId == null) return;
    try {
      await deleteMedicine(deleteMedicineId);
      setConfirmOpen(false);
      setDeleteMedicineId(null);
      await loadMedicines();
    } catch (e: any) {
      setError(e.message || "Lỗi không xác định");
    }
  };

  const filteredMedicines = medicines.filter((m) =>
    [m.name, m.description]
      .join(" ")
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <h1 className="text-3xl font-bold mb-6 text-blue-700">Quản lý thuốc</h1>
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-4">
        <div className="flex gap-2">
          <input
            className="border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
            placeholder="Tìm kiếm theo tên hoặc mô tả..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <button
            className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700 transition"
            onClick={handleAdd}
          >
            + Thêm thuốc
          </button>
        </div>
        {error && <div className="text-red-600 font-medium">{error}</div>}
      </div>
      <div className="bg-white rounded shadow p-4 animate-fadeIn">
        {loading ? (
          <div className="flex justify-center items-center py-10">
            <svg
              className="animate-spin h-8 w-8 text-blue-600"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              ></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8v8z"
              ></path>
            </svg>
          </div>
        ) : (
          <MedicineTable
            medicines={filteredMedicines}
            onEdit={handleEdit}
            onDelete={handleDelete}
            onView={handleView}
          />
        )}
      </div>
      <MedicineForm
        open={formOpen}
        onClose={() => {
          setFormOpen(false);
          setEditMedicine(null);
        }}
        onSubmit={handleFormSubmit}
        initialData={
          editMedicine
            ? {
                name: editMedicine.name,
                description: editMedicine.description,
                quantity: editMedicine.quantity,
                price: editMedicine.price,
              }
            : undefined
        }
        isEdit={!!editMedicine}
      />
      <MedicineDetailModal
        open={detailOpen}
        medicine={detailMedicine || undefined}
        onClose={() => setDetailOpen(false)}
      />
      <ConfirmModal
        open={confirmOpen}
        title="Xác nhận xóa thuốc"
        description="Bạn có chắc chắn muốn xóa thuốc này không? Hành động này không thể hoàn tác."
        onConfirm={handleConfirmDelete}
        onCancel={() => setConfirmOpen(false)}
      />
    </div>
  );
};

export default MedicinesPage;
