"use client";

import React, { useEffect, useState } from "react";
import Cookies from "js-cookie";

interface User {
  id: number;
  username: string;
  email: string;
  role: string;
  is_active: boolean;
}

interface Patient {
  id: number;
  user_id: number;
  date_of_birth: string;
  address: string;
  medical_history: string;
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

interface Prescription {
  id: number;
  patient_id: number;
  doctor_id: number;
  diagnosis_id: number;
  details: string;
  status: string;
  created_at: string;
  updated_at: string;
}

export default function Page() {
  const [user, setUser] = useState<User | null>(null);
  const [patient, setPatient] = useState<Patient | null>(null);
  const [loading, setLoading] = useState(true);
  const [editMode, setEditMode] = useState(false);
  const [form, setForm] = useState({
    date_of_birth: "",
    address: "",
    medical_history: "",
  });
  const [message, setMessage] = useState("");
  const [diagnoses, setDiagnoses] = useState<Diagnosis[]>([]);
  const [diagnosisLoading, setDiagnosisLoading] = useState(false);

  // New: prescriptions state, keyed by diagnosis_id
  const [prescriptions, setPrescriptions] = useState<{
    [diagnosisId: number]: Prescription[] | null;
  }>({});
  const [prescriptionLoading, setPrescriptionLoading] = useState<{
    [diagnosisId: number]: boolean;
  }>({});

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const token = Cookies.get("access");
        if (!token) {
          setMessage("Không tìm thấy token đăng nhập.");
          setLoading(false);
          return;
        }
        // Lấy thông tin user
        const userRes = await fetch("http://localhost:8001/api/users/me/", {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!userRes.ok) throw new Error();
        const userData: User = await userRes.json();
        setUser(userData);

        // Lấy thông tin bệnh nhân
        const patientRes = await fetch(
          `http://localhost:8080/api/patients/by_userId/${userData.id}/`
        );
        if (patientRes.ok) {
          const patientData: Patient = await patientRes.json();
          setPatient(patientData);
          setForm({
            date_of_birth: patientData.date_of_birth,
            address: patientData.address,
            medical_history: patientData.medical_history,
          });
        } else {
          setPatient(null);
        }
      } catch (err: any) {
        setMessage("Không thể tải dữ liệu hồ sơ.");
      }
      setLoading(false);
    };
    fetchData();
  }, []);

  // Fetch diagnoses when patient is loaded
  useEffect(() => {
    const fetchDiagnoses = async () => {
      if (!patient) {
        setDiagnoses([]);
        return;
      }
      setDiagnosisLoading(true);
      try {
        const res = await fetch(
          `http://localhost:8080/api/diagnoses/by_patientId/${patient.id}/`
        );
        if (!res.ok) throw new Error();
        const data: Diagnosis[] = await res.json();
        setDiagnoses(data);
      } catch {
        setDiagnoses([]);
      }
      setDiagnosisLoading(false);
    };
    if (patient) fetchDiagnoses();
  }, [patient]);

  // Fetch prescriptions for each diagnosis
  useEffect(() => {
    if (diagnoses.length === 0) return;
    diagnoses.forEach((diagnosis) => {
      if (prescriptions[diagnosis.id] !== undefined) return; // already fetched
      setPrescriptionLoading((prev) => ({
        ...prev,
        [diagnosis.id]: true,
      }));
      fetch(
        `http://localhost:8080/api/prescriptions/by_diagnosisId/${diagnosis.id}/`
      )
        .then(async (res) => {
          if (!res.ok) {
            setPrescriptions((prev) => ({
              ...prev,
              [diagnosis.id]: [],
            }));
            return;
          }
          const data: Prescription[] = await res.json();
          setPrescriptions((prev) => ({
            ...prev,
            [diagnosis.id]: data,
          }));
        })
        .catch(() => {
          setPrescriptions((prev) => ({
            ...prev,
            [diagnosis.id]: [],
          }));
        })
        .finally(() => {
          setPrescriptionLoading((prev) => ({
            ...prev,
            [diagnosis.id]: false,
          }));
        });
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [diagnoses]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSave = async () => {
    if (!user) return;
    try {
      const token = Cookies.get("access");
      const res = await fetch(
        `http://localhost:8080/api/patients/partial_update_by_userId/${user.id}/`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(form),
        }
      );
      if (!res.ok) throw new Error();
      setPatient({ ...patient!, ...form });
      setEditMode(false);
      setMessage("Cập nhật hồ sơ thành công!");
    } catch (err) {
      setMessage("Cập nhật hồ sơ thất bại.");
    }
  };

  const handleCreate = async () => {
    if (!user) return;
    try {
      const token = Cookies.get("access");
      const res = await fetch("http://localhost:8080/api/patients/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          user_id: user.id,
          date_of_birth: form.date_of_birth || "1990-01-01",
          address: form.address || "",
          medical_history: form.medical_history || "",
        }),
      });
      if (!res.ok) throw new Error();
      const patientData: Patient = await res.json();
      setPatient(patientData);
      setForm({
        date_of_birth: patientData.date_of_birth,
        address: patientData.address,
        medical_history: patientData.medical_history,
      });
      setMessage("Tạo hồ sơ y tế thành công!");
    } catch (err) {
      setMessage("Tạo hồ sơ y tế thất bại.");
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-200 flex flex-col items-center py-10">
      <div className="bg-white shadow-xl rounded-xl p-8 min-w-[80%] transition-all duration-300 hover:shadow-2xl">
        <h1 className="text-3xl font-bold text-blue-700 mb-6 text-center">
          Hồ Sơ Y Tế Cá Nhân
        </h1>
        {message && (
          <div className="mb-4 text-center text-sm text-red-500 animate-pulse">
            {message}
          </div>
        )}
        {user && (
          <div className="mb-6">
            <div className="flex items-center gap-4 mb-2">
              <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center text-2xl font-bold text-blue-600 shadow">
                {user.username.charAt(0).toUpperCase()}
              </div>
              <div>
                <div className="font-semibold text-lg">{user.username}</div>
                <div className="text-gray-500">{user.email}</div>
                <div className="text-xs text-gray-400">
                  Vai trò: {user.role}
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span
                className={`w-3 h-3 rounded-full ${
                  user.is_active ? "bg-green-500" : "bg-gray-400"
                }`}
              ></span>
              <span className="text-xs">
                {user.is_active ? "Đang hoạt động" : "Không hoạt động"}
              </span>
            </div>
          </div>
        )}
        {patient ? (
          <div>
            <div className="mb-4">
              <label className="block text-gray-700 font-medium mb-1">
                Ngày sinh
              </label>
              {editMode ? (
                <input
                  type="date"
                  name="date_of_birth"
                  value={form.date_of_birth}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
                />
              ) : (
                <div className="px-3 py-2 bg-gray-100 rounded">
                  {patient?.date_of_birth}
                </div>
              )}
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 font-medium mb-1">
                Địa chỉ
              </label>
              {editMode ? (
                <input
                  type="text"
                  name="address"
                  value={form.address}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
                />
              ) : (
                <div className="px-3 py-2 bg-gray-100 rounded">
                  {patient?.address}
                </div>
              )}
            </div>
            <div className="mb-6">
              <label className="block text-gray-700 font-medium mb-1">
                Tiền sử bệnh
              </label>
              {editMode ? (
                <textarea
                  name="medical_history"
                  value={form.medical_history}
                  onChange={handleChange}
                  rows={3}
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
                />
              ) : (
                <div className="px-3 py-2 bg-gray-100 rounded">
                  {patient?.medical_history}
                </div>
              )}
            </div>
            <div className="flex justify-end gap-3">
              {editMode ? (
                <>
                  <button
                    onClick={handleSave}
                    className="bg-blue-600 text-white px-5 py-2 rounded-lg shadow hover:bg-blue-700 transition"
                  >
                    Lưu
                  </button>
                  <button
                    onClick={() => {
                      setEditMode(false);
                      setForm({
                        date_of_birth: patient?.date_of_birth || "",
                        address: patient?.address || "",
                        medical_history: patient?.medical_history || "",
                      });
                    }}
                    className="bg-gray-200 text-gray-700 px-5 py-2 rounded-lg hover:bg-gray-300 transition"
                  >
                    Hủy
                  </button>
                </>
              ) : (
                <button
                  onClick={() => setEditMode(true)}
                  className="bg-blue-500 text-white px-5 py-2 rounded-lg shadow hover:bg-blue-600 transition"
                >
                  Chỉnh sửa
                </button>
              )}
            </div>
            {/* Các kết quả chuẩn đoán */}
            <div className="mt-10">
              <h2 className="text-xl font-semibold text-blue-700 mb-4">
                Các kết quả chuẩn đoán
              </h2>
              {diagnosisLoading ? (
                <div className="flex items-center justify-center py-6">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-400"></div>
                </div>
              ) : diagnoses.length === 0 ? (
                <div className="text-gray-500 text-center py-4">
                  Chưa có kết quả chuẩn đoán nào.
                </div>
              ) : (
                <div className="space-y-4">
                  {diagnoses.map((d) => (
                    <div
                      key={d.id}
                      className="border rounded-lg p-4 bg-blue-50 shadow-sm"
                    >
                      <div className="flex justify-between items-center mb-2">
                        <span className="font-medium text-blue-800">
                          Chuẩn đoán
                        </span>
                        <span className="text-xs text-gray-500">
                          {new Date(d.diagnosis_date).toLocaleString("vi-VN")}
                        </span>
                      </div>
                      <div className="mb-1">
                        <span className="font-semibold text-gray-700">
                          Bác sĩ ID:
                        </span>{" "}
                        {d.doctor}
                      </div>
                      <div>
                        <span className="font-semibold text-gray-700">
                          Mô tả:
                        </span>{" "}
                        {d.description}
                      </div>
                      {/* Đơn thuốc */}
                      <div className="mt-4 pl-4 border-l-4 border-blue-200">
                        <div className="font-semibold text-blue-600 mb-2">
                          Đơn thuốc
                        </div>
                        {prescriptionLoading[d.id] ? (
                          <div className="flex items-center gap-2 text-blue-400">
                            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-400"></div>
                            Đang tải đơn thuốc...
                          </div>
                        ) : prescriptions[d.id] &&
                          prescriptions[d.id]!.length > 0 ? (
                          <ul className="space-y-2">
                            {prescriptions[d.id]!.map((p) => (
                              <li
                                key={p.id}
                                className="bg-white rounded shadow px-4 py-2 border"
                              >
                                <div>
                                  <span className="font-semibold">
                                    Chi tiết:
                                  </span>{" "}
                                  {p.details}
                                </div>
                                <div>
                                  <span className="font-semibold">
                                    Trạng thái:
                                  </span>{" "}
                                  <span
                                    className={
                                      p.status === "pending"
                                        ? "text-yellow-600"
                                        : p.status === "completed"
                                        ? "text-green-600"
                                        : "text-gray-600"
                                    }
                                  >
                                    {p.status}
                                  </span>
                                </div>
                                <div className="text-xs text-gray-400">
                                  Ngày tạo:{" "}
                                  {new Date(p.created_at).toLocaleString(
                                    "vi-VN"
                                  )}
                                </div>
                              </li>
                            ))}
                          </ul>
                        ) : (
                          <div className="text-gray-500 text-sm">
                            Không có đơn thuốc cho chuẩn đoán này.
                          </div>
                        )}
                      </div>
                      {/* End Đơn thuốc */}
                    </div>
                  ))}
                </div>
              )}
            </div>
            {/* End Các kết quả chuẩn đoán */}
          </div>
        ) : (
          <div>
            <div className="mb-4">
              <label className="block text-gray-700 font-medium mb-1">
                Ngày sinh
              </label>
              <input
                type="date"
                name="date_of_birth"
                value={form.date_of_birth}
                onChange={handleChange}
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 font-medium mb-1">
                Địa chỉ
              </label>
              <input
                type="text"
                name="address"
                value={form.address}
                onChange={handleChange}
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
              />
            </div>
            <div className="mb-6">
              <label className="block text-gray-700 font-medium mb-1">
                Tiền sử bệnh
              </label>
              <textarea
                name="medical_history"
                value={form.medical_history}
                onChange={handleChange}
                rows={3}
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
              />
            </div>
            <div className="flex justify-end">
              <button
                onClick={handleCreate}
                className="bg-green-600 text-white px-5 py-2 rounded-lg shadow hover:bg-green-700 transition"
              >
                Tạo hồ sơ y tế
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
