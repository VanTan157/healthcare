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

// Loading spinner component
function Spinner() {
  return (
    <div className="flex justify-center items-center py-8">
      <div className="relative w-16 h-16">
        <div className="absolute inset-0 rounded-full border-4 border-blue-400 border-t-transparent animate-spin"></div>
        <div className="absolute inset-2 rounded-full border-4 border-blue-200 border-t-transparent animate-spin-slow"></div>
        <span className="absolute inset-0 flex items-center justify-center text-blue-600 font-bold text-lg">
          Đang tải...
        </span>
      </div>
      <style jsx>{`
        .animate-spin {
          animation: spin 1s linear infinite;
        }
        .animate-spin-slow {
          animation: spin 2s linear infinite;
        }
        @keyframes spin {
          to {
            transform: rotate(360deg);
          }
        }
      `}</style>
    </div>
  );
}

export default function AdminPage() {
  // Tab state
  const [tab, setTab] = useState<"patients" | "doctors">("patients");

  // Patients
  const [patients, setPatients] = useState<Patient[]>([]);
  const [patientForm, setPatientForm] = useState({
    date_of_birth: "",
    address: "",
    medical_history: "",
  });
  const [editingPatientId, setEditingPatientId] = useState<number | null>(null);

  // Doctors
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [doctorForm, setDoctorForm] = useState<Partial<Doctor>>({});
  const [editingDoctorId, setEditingDoctorId] = useState<number | null>(null);

  // Loading states
  const [loadingPatients, setLoadingPatients] = useState(false);
  const [loadingDoctors, setLoadingDoctors] = useState(false);

  // Fetch patients
  const loadPatients = async () => {
    setLoadingPatients(true);
    const res = await fetch(API_BASE_PATIENT);
    if (res.ok) {
      setPatients(await res.json());
    }
    setLoadingPatients(false);
  };

  // Fetch doctors
  const loadDoctors = async () => {
    setLoadingDoctors(true);
    const res = await fetch(API_BASE_DOCTOR);
    if (res.ok) {
      setDoctors(await res.json());
    }
    setLoadingDoctors(false);
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
    setLoadingPatients(true);
    if (editingPatientId) {
      const res = await fetch(
        `http://localhost:8080/api/patients/partial_update_by_userId/${editingPatientId}/`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            address: patientForm.address,
            date_of_birth: patientForm.date_of_birth,
            medical_history: patientForm.medical_history,
          }),
        }
      );
      console.log(res);
    } else {
      await fetchWithAuth(API_BASE_PATIENT, {
        method: "POST",
        body: JSON.stringify(patientForm),
      });
    }
    setPatientForm({
      date_of_birth: "",
      address: "",
      medical_history: "",
    });
    setEditingPatientId(null);
    await loadPatients();
    setLoadingPatients(false);
  };

  const handleEditPatient = (p: Patient) => {
    setPatientForm(p);
    setEditingPatientId(p.user_id);
  };

  const handleDeletePatient = async (user_id: number) => {
    if (confirm("Xóa hồ sơ bệnh nhân này?")) {
      setLoadingPatients(true);
      await fetchWithAuth(`${API_BASE_PATIENT}${user_id}/`, {
        method: "DELETE",
      });
      await loadPatients();
      setLoadingPatients(false);
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
    setLoadingDoctors(true);
    if (editingDoctorId) {
      await fetch(`${API_BASE_DOCTOR}${editingDoctorId}/`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(doctorForm),
      });
    } else {
      await fetch(API_BASE_DOCTOR, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(doctorForm),
      });
    }
    setDoctorForm({});
    setEditingDoctorId(null);
    await loadDoctors();
    setLoadingDoctors(false);
  };

  const handleEditDoctor = (d: Doctor) => {
    setDoctorForm(d);
    setEditingDoctorId(d.id);
  };

  const handleDeleteDoctor = async (id: number) => {
    if (confirm("Xóa hồ sơ bác sĩ này?")) {
      setLoadingDoctors(true);
      await fetch(`${API_BASE_DOCTOR}${id}/`, { method: "DELETE" });
      await loadDoctors();
      setLoadingDoctors(false);
    }
  };

  return (
    <div className="p-8 space-y-12">
      {/* Tabs */}
      <div className="flex mb-8 border-b">
        <button
          className={`px-6 py-2 font-semibold ${
            tab === "patients"
              ? "border-b-2 border-blue-600 text-blue-600"
              : "text-gray-600"
          }`}
          onClick={() => setTab("patients")}
        >
          Quản lý Bệnh nhân
        </button>
        <button
          className={`px-6 py-2 font-semibold ${
            tab === "doctors"
              ? "border-b-2 border-blue-600 text-blue-600"
              : "text-gray-600"
          }`}
          onClick={() => setTab("doctors")}
        >
          Quản lý Bác sĩ
        </button>
      </div>

      {/* Patients Tab */}
      {tab === "patients" && (
        <section>
          <h2 className="text-2xl font-bold mb-4">Quản lý Bệnh nhân</h2>
          <form
            onSubmit={handlePatientSubmit}
            className="space-y-2 mb-6 bg-gray-50 p-4 rounded shadow"
          >
            <div className="flex gap-2">
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
                Cập nhật
              </button>
              {editingPatientId && (
                <button
                  type="button"
                  className="ml-2 px-4 py-1 rounded bg-gray-300"
                  onClick={() => {
                    setPatientForm({
                      date_of_birth: "",
                      address: "",
                      medical_history: "",
                    });
                    setEditingPatientId(null);
                  }}
                >
                  Hủy
                </button>
              )}
            </div>
          </form>
          <div className="overflow-x-auto min-h-[120px]">
            {loadingPatients ? (
              <Spinner />
            ) : (
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
                      <td
                        colSpan={5}
                        className="text-center py-2 text-gray-500"
                      >
                        Không có dữ liệu
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            )}
          </div>
        </section>
      )}

      {/* Doctors Tab */}
      {tab === "doctors" && (
        <section>
          <h2 className="text-2xl font-bold mb-4">Quản lý Bác sĩ</h2>
          <form
            onSubmit={handleDoctorSubmit}
            className="space-y-2 mb-6 bg-gray-50 p-4 rounded shadow"
          >
            <div className="flex gap-2">
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
                Cập nhật
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
          <div className="overflow-x-auto min-h-[120px]">
            {loadingDoctors ? (
              <Spinner />
            ) : (
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
                      <td
                        colSpan={6}
                        className="text-center py-2 text-gray-500"
                      >
                        Không có dữ liệu
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            )}
          </div>
        </section>
      )}
    </div>
  );
}
