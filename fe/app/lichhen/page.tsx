"use client";

import React, { useEffect, useState } from "react";
import Cookies from "js-cookie";

interface Appointment {
  id: number;
  patient: number;
  doctor_id: number;
  appointment_date: string;
  reason: string;
  status: string;
  created_at: string;
  updated_at: string;
}

interface User {
  id: number;
  username: string;
  email: string;
  role: string;
  is_active: boolean;
}

interface Doctor {
  id: number;
  user_id: number;
  specialty: string;
  clinic: string;
  schedule: string;
  created_at: string;
  updated_at: string;
}

interface Patient {
  id: number;
  user_id: number;
  date_of_birth: string;
  address: string;
  medical_history: string;
  created_at: string;
  updated_at: string;
}

const API_BASE = "http://localhost:8080/api/appointments/";
const USER_API = "http://localhost:8080/api/users/me/";
const USERS_API = "http://localhost:8080/api/users/";
const DOCTOR_API = "http://localhost:8003/api/doctors/";
const PATIENT_API = "http://localhost:8080/api/patients/";

const fetchAppointments = async (token: string) => {
  const res = await fetch(API_BASE, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw new Error("Failed to fetch appointments");
  return res.json() as Promise<Appointment[]>;
};

const fetchUser = async (token: string) => {
  const res = await fetch(USER_API, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw new Error("Failed to fetch user");
  return res.json() as Promise<User>;
};

const fetchAllUsers = async (token: string) => {
  const res = await fetch(USERS_API, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw new Error("Failed to fetch users");
  return res.json() as Promise<User[]>;
};

const fetchAllDoctors = async () => {
  const res = await fetch(DOCTOR_API);
  if (!res.ok) throw new Error("Failed to fetch users");
  return res.json() as Promise<Doctor[]>;
};

const fetchAllPatients = async (token: string) => {
  const res = await fetch(PATIENT_API, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw new Error("Failed to fetch users");
  return res.json() as Promise<Patient[]>;
};

const deleteAppointment = async (id: number, token: string) => {
  const res = await fetch(`${API_BASE}${id}/`, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw new Error("Failed to delete appointment");
};

const createAppointment = async (
  data: Omit<Appointment, "id" | "status" | "created_at" | "updated_at">,
  token: string
) => {
  const res = await fetch(API_BASE, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Failed to create appointment");
};

export default function LichHenPage() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({
    doctor_id: "",
    appointment_date: "",
    reason: "",
  });
  const [user, setUser] = useState<User | null>(null);
  const [error, setError] = useState("");
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [patients, setPatients] = useState<Patient[]>([]);

  const token = Cookies.get("access") || "";

  const loadData = async () => {
    setLoading(true);
    try {
      const [userData, appts] = await Promise.all([
        fetchUser(token),
        fetchAppointments(token),
      ]);
      setUser(userData);
      setAppointments(appts);
    } catch (err) {
      setError("Không thể tải dữ liệu");
    }
    setLoading(false);
  };

  const loadDoctors = async () => {
    setLoading(true);
    try {
      const allDoctors = await fetchAllDoctors();
      console.log(allDoctors);
      setDoctors(allDoctors);
    } catch (err) {
      setError("Không thể tải dữ liệu");
    }
    setLoading(false);
  };

  const loadPatients = async () => {
    setLoading(true);
    try {
      const allPatients = await fetchAllPatients(token);
      console.log(allPatients);
      setPatients(allPatients);
    } catch (err) {
      setError("Không thể tải dữ liệu");
    }
    setLoading(false);
  };

  useEffect(() => {
    if (token) {
      loadData();
      loadDoctors();
      loadPatients();
    }
    // eslint-disable-next-line
  }, [token]);

  const handleDelete = async (id: number) => {
    if (!confirm("Bạn có chắc muốn xóa lịch hẹn này?")) return;
    try {
      await deleteAppointment(id, token);
      setAppointments((prev) => prev.filter((a) => a.id !== id));
    } catch {
      setError("Xóa lịch hẹn thất bại");
    }
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    try {
      const patient = patients.find((p) => p.user_id === user.id);
      if (!patient) {
        setError("Không tìm thấy thông tin bệnh nhân cho người dùng này.");
        return;
      }
      console.log(form.doctor_id);
      console.log(user.id);
      console.log(form.appointment_date);
      console.log(form.reason);
      const res = await createAppointment(
        {
          patient: patient.id,
          doctor_id: Number(form.doctor_id),
          appointment_date: form.appointment_date,
          reason: form.reason,
        },
        token
      );
      console.log(res);
      setShowModal(false);
      setForm({ doctor_id: "", appointment_date: "", reason: "" });
      loadData();
    } catch {
      setError("Tạo lịch hẹn thất bại");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-200 py-10 px-4">
      <div className="max-w-3xl mx-auto bg-white rounded-xl shadow-lg p-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-blue-700">Lịch Hẹn</h1>
          <button
            className="bg-blue-600 hover:bg-blue-700 transition text-white px-4 py-2 rounded-lg shadow font-semibold"
            onClick={() => setShowModal(true)}
          >
            + Tạo lịch hẹn
          </button>
        </div>
        {error && (
          <div className="mb-4 text-red-600 font-semibold">{error}</div>
        )}
        {loading ? (
          <div className="flex justify-center items-center h-40">
            <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-blue-500"></div>
          </div>
        ) : appointments.length === 0 ? (
          <div className="text-center text-gray-500 py-10">
            Không có lịch hẹn nào.
          </div>
        ) : (
          <div className="space-y-4">
            {appointments.map((a) => (
              <div
                key={a.id}
                className={`flex flex-col md:flex-row md:items-center justify-between bg-blue-50 border border-blue-200 rounded-lg p-4 shadow transition hover:shadow-lg ${
                  a.status === "pending"
                    ? "hover:border-blue-400"
                    : "opacity-70"
                }`}
              >
                <div>
                  <div className="font-semibold text-lg text-blue-800">
                    {new Date(a.appointment_date).toLocaleString("vi-VN")}
                  </div>
                  <div className="text-gray-700">
                    <span className="font-medium">Lý do:</span> {a.reason}
                  </div>
                  <div className="text-sm text-gray-500">
                    Trạng thái:{" "}
                    <span
                      className={
                        a.status === "pending"
                          ? "text-yellow-600"
                          : a.status === "confirmed"
                          ? "text-green-600"
                          : "text-gray-600"
                      }
                    >
                      {a.status}
                    </span>
                  </div>
                </div>
                {a.status === "pending" && (
                  <button
                    className="mt-3 md:mt-0 bg-red-500 hover:bg-red-600 transition text-white px-4 py-2 rounded-lg shadow font-semibold"
                    onClick={() => handleDelete(a.id)}
                  >
                    Xóa
                  </button>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Modal tạo lịch hẹn */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40 animate-fadeIn">
          <div className="bg-white rounded-xl shadow-2xl p-8 w-full max-w-md relative">
            <button
              className="absolute top-3 right-3 text-gray-400 hover:text-gray-700 text-2xl"
              onClick={() => setShowModal(false)}
              aria-label="Đóng"
            >
              &times;
            </button>
            <h2 className="text-2xl font-bold mb-4 text-blue-700">
              Tạo lịch hẹn mới
            </h2>
            <form onSubmit={handleCreate} className="space-y-4">
              <div>
                <label className="block font-medium mb-1 text-gray-700">
                  Chọn bác sĩ
                </label>
                <select
                  required
                  className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
                  value={form.doctor_id}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, doctor_id: e.target.value }))
                  }
                >
                  <option value="">-- Chọn bác sĩ --</option>
                  {doctors.map((doc) => (
                    <option key={doc.id} value={doc.id}>
                      {doc.clinic} ({doc.specialty})
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block font-medium mb-1 text-gray-700">
                  Ngày & giờ hẹn
                </label>
                <input
                  type="datetime-local"
                  required
                  className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
                  value={form.appointment_date}
                  onChange={(e) =>
                    setForm((f) => ({
                      ...f,
                      appointment_date: e.target.value,
                    }))
                  }
                />
              </div>
              <div>
                <label className="block font-medium mb-1 text-gray-700">
                  Lý do
                </label>
                <input
                  type="text"
                  required
                  className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
                  value={form.reason}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, reason: e.target.value }))
                  }
                  placeholder="Nhập lý do khám"
                />
              </div>
              <button
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-700 transition text-white px-4 py-2 rounded-lg shadow font-semibold"
              >
                Tạo lịch hẹn
              </button>
            </form>
          </div>
        </div>
      )}

      <style jsx global>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }
        .animate-fadeIn {
          animation: fadeIn 0.2s;
        }
      `}</style>
    </div>
  );
}
