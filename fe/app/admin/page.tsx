"use client";

import React, { useEffect, useState } from "react";

type Patient = {
  user_id: number;
  date_of_birth: string;
  address: string;
  medical_history: string;
  created_at: string;
  updated_at: string;
};

type Doctor = {
  id: number;
  user_id: number;
  specialty: string;
  clinic: string;
  schedule: string;
  created_at: string;
  updated_at: string;
};

const API_BASE_PATIENT = "http://localhost:8080/api/patients/";
const API_BASE_DOCTOR = "http://localhost:8080/api/doctors/";

function getToken() {
  // TODO: Replace with your real JWT token getter
  return localStorage.getItem("jwt_token") || "";
}

async function fetchWithAuth(url: string, options: RequestInit = {}) {
  const token = getToken();
  return fetch(url, {
    ...options,
    headers: {
      ...(options.headers || {}),
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });
}

export default function AdminPage() {
  // Patients
  const [patients, setPatients] = useState<Patient[]>([]);
  const [patientForm, setPatientForm] = useState<Partial<Patient>>({});
  const [editingPatientId, setEditingPatientId] = useState<number | null>(null);

  // Doctors
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [doctorForm, setDoctorForm] = useState<Partial<Doctor>>({});
  const [editingDoctorId, setEditingDoctorId] = useState<number | null>(null);

  // Fetch patients
  const loadPatients = async () => {
    const res = await fetch(API_BASE_PATIENT);
    if (res.ok) {
      console.log(res);
      setPatients(await res.json());
    }
  };

  // Fetch doctors
  const loadDoctors = async () => {
    const res = await fetch(API_BASE_DOCTOR);
    if (res.ok) {
      setDoctors(await res.json());
    }
  };

  useEffect(() => {
    loadPatients();
    loadDoctors();
  }, []);

  // Patient handlers
  const handlePatientFormChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setPatientForm({ ...patientForm, [e.target.name]: e.target.value });
  };

  const handlePatientSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (editingPatientId) {
      // Update
      await fetchWithAuth(`${API_BASE_PATIENT}${editingPatientId}/`, {
        method: "PATCH",
        body: JSON.stringify(patientForm),
      });
    } else {
      // Create
      await fetchWithAuth(API_BASE_PATIENT, {
        method: "POST",
        body: JSON.stringify(patientForm),
      });
    }
    setPatientForm({});
    setEditingPatientId(null);
    loadPatients();
  };

  const handleEditPatient = (p: Patient) => {
    setPatientForm(p);
    setEditingPatientId(p.user_id);
  };

  const handleDeletePatient = async (user_id: number) => {
    if (confirm("Xóa hồ sơ bệnh nhân này?")) {
      await fetchWithAuth(`${API_BASE_PATIENT}${user_id}/`, {
        method: "DELETE",
      });
      loadPatients();
    }
  };

  // Doctor handlers
  const handleDoctorFormChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setDoctorForm({ ...doctorForm, [e.target.name]: e.target.value });
  };

  const handleDoctorSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (editingDoctorId) {
      // Update
      await fetch(`${API_BASE_DOCTOR}${editingDoctorId}/`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(doctorForm),
      });
    } else {
      // Create
      await fetch(API_BASE_DOCTOR, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(doctorForm),
      });
    }
    setDoctorForm({});
    setEditingDoctorId(null);
    loadDoctors();
  };

  const handleEditDoctor = (d: Doctor) => {
    setDoctorForm(d);
    setEditingDoctorId(d.id);
  };

  const handleDeleteDoctor = async (id: number) => {
    if (confirm("Xóa hồ sơ bác sĩ này?")) {
      await fetch(`${API_BASE_DOCTOR}${id}/`, { method: "DELETE" });
      loadDoctors();
    }
  };

  return (
    <div className="p-8 space-y-12">
      {/* Patients */}
      <section>
        <h2 className="text-2xl font-bold mb-4">Quản lý Bệnh nhân</h2>
        <form
          onSubmit={handlePatientSubmit}
          className="space-y-2 mb-6 bg-gray-50 p-4 rounded shadow"
        >
          <div className="flex gap-2">
            <input
              className="border px-2 py-1 rounded w-24"
              name="user_id"
              placeholder="User ID"
              type="number"
              value={patientForm.user_id ?? ""}
              onChange={handlePatientFormChange}
              required
            />
            <input
              className="border px-2 py-1 rounded"
              name="date_of_birth"
              placeholder="YYYY-MM-DD"
              type="date"
              value={patientForm.date_of_birth ?? ""}
              onChange={handlePatientFormChange}
              required
            />
            <input
              className="border px-2 py-1 rounded flex-1"
              name="address"
              placeholder="Địa chỉ"
              value={patientForm.address ?? ""}
              onChange={handlePatientFormChange}
              required
            />
            <input
              className="border px-2 py-1 rounded flex-1"
              name="medical_history"
              placeholder="Tiền sử bệnh"
              value={patientForm.medical_history ?? ""}
              onChange={handlePatientFormChange}
              required
            />
            <button
              className="bg-blue-600 text-white px-4 py-1 rounded hover:bg-blue-700"
              type="submit"
            >
              {editingPatientId ? "Cập nhật" : "Thêm"}
            </button>
            {editingPatientId && (
              <button
                type="button"
                className="ml-2 px-4 py-1 rounded bg-gray-300"
                onClick={() => {
                  setPatientForm({});
                  setEditingPatientId(null);
                }}
              >
                Hủy
              </button>
            )}
          </div>
        </form>
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border">
            <thead>
              <tr className="bg-gray-100">
                <th className="border px-2 py-1">User ID</th>
                <th className="border px-2 py-1">Ngày sinh</th>
                <th className="border px-2 py-1">Địa chỉ</th>
                <th className="border px-2 py-1">Tiền sử bệnh</th>
                <th className="border px-2 py-1">Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {patients.map((p) => (
                <tr key={p.user_id}>
                  <td className="border px-2 py-1">{p.user_id}</td>
                  <td className="border px-2 py-1">{p.date_of_birth}</td>
                  <td className="border px-2 py-1">{p.address}</td>
                  <td className="border px-2 py-1">{p.medical_history}</td>
                  <td className="border px-2 py-1 flex gap-2">
                    <button
                      className="text-blue-600 hover:underline"
                      onClick={() => handleEditPatient(p)}
                    >
                      Sửa
                    </button>
                    <button
                      className="text-red-600 hover:underline"
                      onClick={() => handleDeletePatient(p.user_id)}
                    >
                      Xóa
                    </button>
                  </td>
                </tr>
              ))}
              {patients.length === 0 && (
                <tr>
                  <td colSpan={5} className="text-center py-2 text-gray-500">
                    Không có dữ liệu
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>

      {/* Doctors */}
      <section>
        <h2 className="text-2xl font-bold mb-4">Quản lý Bác sĩ</h2>
        <form
          onSubmit={handleDoctorSubmit}
          className="space-y-2 mb-6 bg-gray-50 p-4 rounded shadow"
        >
          <div className="flex gap-2">
            <input
              className="border px-2 py-1 rounded w-24"
              name="user_id"
              placeholder="User ID"
              type="number"
              value={doctorForm.user_id ?? ""}
              onChange={handleDoctorFormChange}
              required
            />
            <input
              className="border px-2 py-1 rounded flex-1"
              name="specialty"
              placeholder="Chuyên khoa"
              value={doctorForm.specialty ?? ""}
              onChange={handleDoctorFormChange}
              required
            />
            <input
              className="border px-2 py-1 rounded flex-1"
              name="clinic"
              placeholder="Phòng khám"
              value={doctorForm.clinic ?? ""}
              onChange={handleDoctorFormChange}
              required
            />
            <input
              className="border px-2 py-1 rounded flex-1"
              name="schedule"
              placeholder="Lịch làm việc"
              value={doctorForm.schedule ?? ""}
              onChange={handleDoctorFormChange}
              required
            />
            <button
              className="bg-blue-600 text-white px-4 py-1 rounded hover:bg-blue-700"
              type="submit"
            >
              {editingDoctorId ? "Cập nhật" : "Thêm"}
            </button>
            {editingDoctorId && (
              <button
                type="button"
                className="ml-2 px-4 py-1 rounded bg-gray-300"
                onClick={() => {
                  setDoctorForm({});
                  setEditingDoctorId(null);
                }}
              >
                Hủy
              </button>
            )}
          </div>
        </form>
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border">
            <thead>
              <tr className="bg-gray-100">
                <th className="border px-2 py-1">ID</th>
                <th className="border px-2 py-1">User ID</th>
                <th className="border px-2 py-1">Chuyên khoa</th>
                <th className="border px-2 py-1">Phòng khám</th>
                <th className="border px-2 py-1">Lịch làm việc</th>
                <th className="border px-2 py-1">Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {doctors.map((d) => (
                <tr key={d.id}>
                  <td className="border px-2 py-1">{d.id}</td>
                  <td className="border px-2 py-1">{d.user_id}</td>
                  <td className="border px-2 py-1">{d.specialty}</td>
                  <td className="border px-2 py-1">{d.clinic}</td>
                  <td className="border px-2 py-1">{d.schedule}</td>
                  <td className="border px-2 py-1 flex gap-2">
                    <button
                      className="text-blue-600 hover:underline"
                      onClick={() => handleEditDoctor(d)}
                    >
                      Sửa
                    </button>
                    <button
                      className="text-red-600 hover:underline"
                      onClick={() => handleDeleteDoctor(d.id)}
                    >
                      Xóa
                    </button>
                  </td>
                </tr>
              ))}
              {doctors.length === 0 && (
                <tr>
                  <td colSpan={6} className="text-center py-2 text-gray-500">
                    Không có dữ liệu
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
