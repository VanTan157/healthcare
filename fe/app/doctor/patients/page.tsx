"use client";

import React, { useEffect, useState } from "react";
import Cookies from "js-cookie";
import { Cookie } from "next/font/google";

interface Patient {
  id: number;
  user_id: number;
  date_of_birth: string;
  address: string;
  medical_history: string;
  created_at: string;
  updated_at: string;
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

interface Diagnosis {
  id: number;
  patient_id: number;
  doctor: number;
  diagnosis_date: string;
  description: string;
  created_at: string;
  updated_at: string;
}

function getCookie(name: string): string | null {
  if (typeof document === "undefined") return null;
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop()!.split(";").shift() || null;
  return null;
}

export default function DoctorPatientsPage() {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [diagnoses, setDiagnoses] = useState<Diagnosis[]>([]);
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [doctorId, setDoctorId] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({
    patient_id: "",
    diagnosis_date: "",
    description: "",
  });
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const token = Cookies.get("access");

  // Fetch patients, doctors, diagnoses
  useEffect(() => {
    setLoading(true);
    Promise.all([
      fetch("http://localhost:8080/api/patients/", {
        headers: { Authorization: `Bearer ${token}` },
      }).then((r) => r.json()),
      fetch("http://localhost:8080/api/doctors/").then((r) => r.json()),
      fetch("http://localhost:8003/api/diagnoses/").then((r) => r.json()),
    ])
      .then(([patientsData, doctorsData, diagnosesData]) => {
        console.log(patientsData, doctorsData, diagnosesData);
        setPatients(patientsData);
        setDoctors(doctorsData);

        const userIdStr = getCookie("user_id");
        if (!userIdStr) {
          setError("Không tìm thấy user_id trong cookies.");
          setLoading(false);
          return;
        }
        const userId = Number(userIdStr);

        // Find doctor by user_id
        const doctor = doctorsData.find((d: Doctor) => d.user_id === userId);
        if (!doctor) {
          setError("Không tìm thấy thông tin bác sĩ.");
          setLoading(false);
          return;
        }
        setDoctorId(doctor.id);

        // Filter diagnoses by doctor
        const filteredDiagnoses = diagnosesData.filter(
          (d: Diagnosis) => d.doctor === doctor.id
        );
        setDiagnoses(filteredDiagnoses);
        setLoading(false);
      })
      .catch(() => {
        setError("Lỗi khi tải dữ liệu.");
        setLoading(false);
      });
  }, []);

  // Handle form input
  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // Handle create diagnosis
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!doctorId) return;
    setCreating(true);
    setError(null);
    try {
      const res = await fetch("http://localhost:8003/api/diagnoses/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          patient_id: Number(form.patient_id),
          doctor: doctorId,
          diagnosis_date: form.diagnosis_date,
          description: form.description,
        }),
      });
      if (!res.ok) throw new Error("Tạo chẩn đoán thất bại");
      const newDiagnosis = await res.json();
      setDiagnoses([newDiagnosis, ...diagnoses]);
      setForm({ patient_id: "", diagnosis_date: "", description: "" });
    } catch (err: any) {
      setError(err.message || "Có lỗi xảy ra.");
    }
    setCreating(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 py-10 px-4">
      <div className="max-w-3xl mx-auto bg-white rounded-xl shadow-lg p-8">
        <h1 className="text-3xl font-bold text-blue-700 mb-6 text-center">
          Quản lý chẩn đoán bệnh nhân
        </h1>
        {error && (
          <div className="mb-4 text-red-600 bg-red-100 rounded px-4 py-2">
            {error}
          </div>
        )}
        {loading ? (
          <div className="flex justify-center items-center h-40">
            <div className="animate-spin rounded-full h-10 w-10 border-t-4 border-blue-500"></div>
          </div>
        ) : (
          <>
            {/* Form tạo chẩn đoán */}
            <form
              onSubmit={handleSubmit}
              className="bg-blue-50 rounded-lg p-6 mb-8 shadow transition hover:shadow-lg"
            >
              <h2 className="text-xl font-semibold mb-4 text-blue-600">
                Tạo chẩn đoán mới
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block mb-1 font-medium text-gray-700">
                    Bệnh nhân
                  </label>
                  <select
                    name="patient_id"
                    value={form.patient_id}
                    onChange={handleChange}
                    required
                    className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
                  >
                    <option value="">-- Chọn bệnh nhân --</option>
                    {patients?.map((p) => (
                      <option key={p.id} value={p.id}>
                        #{p.id} - {p.address} - {p.date_of_birth}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block mb-1 font-medium text-gray-700">
                    Ngày chẩn đoán
                  </label>
                  <input
                    type="datetime-local"
                    name="diagnosis_date"
                    value={form.diagnosis_date}
                    onChange={handleChange}
                    required
                    className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
                  />
                </div>
              </div>
              <div className="mt-4">
                <label className="block mb-1 font-medium text-gray-700">
                  Mô tả chẩn đoán
                </label>
                <textarea
                  name="description"
                  value={form.description}
                  onChange={handleChange}
                  required
                  rows={3}
                  className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
                  placeholder="Nhập mô tả chẩn đoán..."
                />
              </div>
              <div className="mt-6 flex justify-end">
                <button
                  type="submit"
                  disabled={creating}
                  className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-2 rounded shadow transition disabled:opacity-60"
                >
                  {creating ? "Đang tạo..." : "Tạo chẩn đoán"}
                </button>
              </div>
            </form>

            {/* Danh sách chẩn đoán */}
            <h2 className="text-xl font-semibold mb-4 text-blue-600">
              Danh sách chẩn đoán của bạn
            </h2>
            {diagnoses.length === 0 ? (
              <div className="text-gray-500 italic">Chưa có chẩn đoán nào.</div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full bg-white rounded-lg shadow">
                  <thead>
                    <tr className="bg-blue-100 text-blue-700">
                      <th className="py-2 px-3 text-left">ID</th>
                      <th className="py-2 px-3 text-left">Bệnh nhân</th>
                      <th className="py-2 px-3 text-left">Ngày chẩn đoán</th>
                      <th className="py-2 px-3 text-left">Mô tả</th>
                      <th className="py-2 px-3 text-left">Tạo lúc</th>
                    </tr>
                  </thead>
                  <tbody>
                    {diagnoses.map((d) => {
                      const patient = patients.find(
                        (p) => p.id === d.patient_id
                      );
                      return (
                        <tr
                          key={d.id}
                          className="hover:bg-blue-50 transition border-b last:border-none"
                        >
                          <td className="py-2 px-3 font-mono">{d.id}</td>
                          <td className="py-2 px-3">
                            {patient
                              ? `#${patient.id} - ${patient.address} - ${patient.date_of_birth}`
                              : `#${d.patient_id}`}
                          </td>
                          <td className="py-2 px-3">
                            {new Date(d.diagnosis_date).toLocaleString("vi-VN")}
                          </td>
                          <td className="py-2 px-3">{d.description}</td>
                          <td className="py-2 px-3 text-gray-500 text-sm">
                            {new Date(d.created_at).toLocaleString("vi-VN")}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
