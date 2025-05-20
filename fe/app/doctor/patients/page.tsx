"use client";

import React, { useEffect, useState } from "react";
import Cookies from "js-cookie";

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

interface User {
  id: number;
  username: string;
  email: string;
  role: string;
  is_active: boolean;
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
  const [users, setUsers] = useState<User[]>([]);

  const [doctorId, setDoctorId] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({
    patient_id: "",
    diagnosis_date: "",
    description: "",
  });
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Prescription state
  const [prescriptions, setPrescriptions] = useState<{
    [diagnosisId: number]: Prescription[];
  }>({});
  const [prescriptionForm, setPrescriptionForm] = useState<{
    [diagnosisId: number]: {
      details: string;
      status: string;
      editingId?: number;
    };
  }>({});
  const [prescriptionLoading, setPrescriptionLoading] = useState<{
    [diagnosisId: number]: boolean;
  }>({});
  const [prescriptionError, setPrescriptionError] = useState<{
    [diagnosisId: number]: string | null;
  }>({});

  const token = Cookies.get("access");

  // Fetch patients, doctors, diagnoses
  useEffect(() => {
    setLoading(true);
    Promise.all([
      fetch("http://localhost:8080/api/patients/", {
        headers: { Authorization: `Bearer ${token}` },
      }).then((r) => r.json()),
      fetch("http://localhost:8080/api/doctors/").then((r) => r.json()),
      fetch("http://localhost:8080/api/diagnoses/").then((r) => r.json()),
      fetch("http://localhost:8080/api/users/").then((r) => r.json()),
    ])
      .then(([patientsData, doctorsData, diagnosesData, usersData]) => {
        setPatients(patientsData);
        setDoctors(doctorsData);
        setUsers(usersData);

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

        // Fetch prescriptions for each diagnosis
        filteredDiagnoses.forEach((diag: Diagnosis) => {
          fetchPrescriptions(diag.id);
        });

        setLoading(false);
      })
      .catch(() => {
        setError("Lỗi khi tải dữ liệu.");
        setLoading(false);
      });
    // eslint-disable-next-line
  }, []);

  // Fetch prescriptions for a diagnosis
  const fetchPrescriptions = async (diagnosisId: number) => {
    setPrescriptionLoading((prev) => ({ ...prev, [diagnosisId]: true }));
    setPrescriptionError((prev) => ({ ...prev, [diagnosisId]: null }));
    try {
      const res = await fetch(
        `http://localhost:8080/api/prescriptions/by_diagnosisId/${diagnosisId}/`
      );
      if (!res.ok) {
        setPrescriptions((prev) => ({ ...prev, [diagnosisId]: [] }));
        setPrescriptionLoading((prev) => ({ ...prev, [diagnosisId]: false }));
        return;
      }
      const data = await res.json();
      setPrescriptions((prev) => ({ ...prev, [diagnosisId]: data }));
    } catch {
      setPrescriptionError((prev) => ({
        ...prev,
        [diagnosisId]: "Lỗi khi tải đơn thuốc.",
      }));
    }
    setPrescriptionLoading((prev) => ({ ...prev, [diagnosisId]: false }));
  };

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
      const res = await fetch("http://localhost:8080/api/diagnoses/", {
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
      // Fetch prescriptions for new diagnosis (should be empty)
      fetchPrescriptions(newDiagnosis.id);
    } catch (err: any) {
      setError(err.message || "Có lỗi xảy ra.");
    }
    setCreating(false);
  };

  // Prescription form handlers
  const handlePrescriptionFormChange = (
    diagnosisId: number,
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    setPrescriptionForm((prev) => ({
      ...prev,
      [diagnosisId]: {
        ...prev[diagnosisId],
        [e.target.name]: e.target.value,
      },
    }));
  };

  // Create prescription
  const handleCreatePrescription = async (diagnosis: Diagnosis) => {
    if (!doctorId) return;
    const formData = prescriptionForm[diagnosis.id];
    if (!formData?.details) return;
    setPrescriptionLoading((prev) => ({ ...prev, [diagnosis.id]: true }));
    setPrescriptionError((prev) => ({ ...prev, [diagnosis.id]: null }));
    try {
      const res = await fetch("http://localhost:8080/api/prescriptions/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          patient_id: diagnosis.patient_id,
          doctor_id: doctorId,
          diagnosis_id: diagnosis.id,
          details: formData.details,
          status: formData.status || "pending",
        }),
      });
      if (!res.ok) throw new Error("Tạo đơn thuốc thất bại");
      await fetchPrescriptions(diagnosis.id);
      setPrescriptionForm((prev) => ({
        ...prev,
        [diagnosis.id]: { details: "", status: "pending" },
      }));
    } catch (err: any) {
      setPrescriptionError((prev) => ({
        ...prev,
        [diagnosis.id]: err.message || "Có lỗi xảy ra.",
      }));
    }
    setPrescriptionLoading((prev) => ({ ...prev, [diagnosis.id]: false }));
  };

  // Edit prescription (set form to edit mode)
  const handleEditPrescription = (
    diagnosisId: number,
    prescription: Prescription
  ) => {
    setPrescriptionForm((prev) => ({
      ...prev,
      [diagnosisId]: {
        details: prescription.details,
        status: prescription.status,
        editingId: prescription.id,
      },
    }));
  };

  // Update prescription (PUT)
  const handleUpdatePrescription = async (diagnosisId: number) => {
    const formData = prescriptionForm[diagnosisId];
    if (!formData?.editingId) return;
    setPrescriptionLoading((prev) => ({ ...prev, [diagnosisId]: true }));
    setPrescriptionError((prev) => ({ ...prev, [diagnosisId]: null }));
    try {
      const res = await fetch(
        `http://localhost:8080/api/prescriptions/${formData.editingId}/`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            status: formData.status,
          }),
        }
      );
      if (!res.ok) throw new Error("Cập nhật đơn thuốc thất bại");
      await fetchPrescriptions(diagnosisId);
      setPrescriptionForm((prev) => ({
        ...prev,
        [diagnosisId]: { details: "", status: "pending" },
      }));
    } catch (err: any) {
      setPrescriptionError((prev) => ({
        ...prev,
        [diagnosisId]: err.message || "Có lỗi xảy ra.",
      }));
    }
    setPrescriptionLoading((prev) => ({ ...prev, [diagnosisId]: false }));
  };

  // Delete prescription
  const handleDeletePrescription = async (
    diagnosisId: number,
    prescriptionId: number
  ) => {
    if (!window.confirm("Bạn có chắc chắn muốn xóa đơn thuốc này?")) return;
    setPrescriptionLoading((prev) => ({ ...prev, [diagnosisId]: true }));
    setPrescriptionError((prev) => ({ ...prev, [diagnosisId]: null }));
    try {
      const res = await fetch(
        `http://localhost:8080/api/prescriptions/${prescriptionId}/`,
        { method: "DELETE" }
      );
      if (!res.ok && res.status !== 204)
        throw new Error("Xóa đơn thuốc thất bại");
      await fetchPrescriptions(diagnosisId);
    } catch (err: any) {
      setPrescriptionError((prev) => ({
        ...prev,
        [diagnosisId]: err.message || "Có lỗi xảy ra.",
      }));
    }
    setPrescriptionLoading((prev) => ({ ...prev, [diagnosisId]: false }));
  };

  // Cancel edit
  const handleCancelEdit = (diagnosisId: number) => {
    setPrescriptionForm((prev) => ({
      ...prev,
      [diagnosisId]: { details: "", status: "pending" },
    }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 py-10 px-4">
      <div className="mx-auto bg-white rounded-xl shadow-lg p-8 min-w-[80%]">
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
                        #{p.id} -
                        {users.find((u) => u.id === p.user_id)?.username ||
                          "Không rõ tên"}{" "}
                        - {p.address} - {p.date_of_birth}
                        {p.address} - {p.date_of_birth}
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
                      <th className="py-2 px-3 text-left">Đơn thuốc</th>
                    </tr>
                  </thead>
                  <tbody>
                    {diagnoses.map((d) => {
                      const patient = patients.find(
                        (p) => p.id === d.patient_id
                      );
                      const prescList = prescriptions[d.id] || [];
                      const prescForm = prescriptionForm[d.id] || {
                        details: "",
                        status: "pending",
                      };
                      const isEditing = !!prescForm.editingId;
                      return (
                        <React.Fragment key={d.id}>
                          <tr className="hover:bg-blue-50 transition border-b last:border-none">
                            <td className="py-2 px-3 font-mono">{d.id}</td>
                            <td className="py-2 px-3">
                              {patient
                                ? ` ${
                                    users?.find((u) => u.id === patient.user_id)
                                      ?.username
                                  }`
                                : `#${d.patient_id}`}
                            </td>
                            <td className="py-2 px-3">
                              {new Date(d.diagnosis_date).toLocaleString(
                                "vi-VN"
                              )}
                            </td>
                            <td className="py-2 px-3">{d.description}</td>
                            <td className="py-2 px-3">
                              {/* Prescription actions */}
                              {prescriptionLoading[d.id] && (
                                <span className="text-blue-500 text-sm">
                                  Đang xử lý...
                                </span>
                              )}
                              {prescriptionError[d.id] && (
                                <div className="text-red-500 text-xs mb-1">
                                  {prescriptionError[d.id]}
                                </div>
                              )}
                              {/* Nếu đang tạo hoặc sửa đơn thuốc */}
                              {(prescList.length === 0 || isEditing) &&
                                (prescForm.details !== undefined ||
                                  isEditing) && (
                                  <form
                                    className="mt-2 space-y-2"
                                    onSubmit={(e) => {
                                      e.preventDefault();
                                      if (isEditing) {
                                        handleUpdatePrescription(d.id);
                                      } else {
                                        handleCreatePrescription(d);
                                      }
                                    }}
                                  >
                                    <textarea
                                      name="details"
                                      value={prescForm.details}
                                      onChange={(e) =>
                                        handlePrescriptionFormChange(d.id, e)
                                      }
                                      required
                                      rows={2}
                                      className="w-full border rounded px-2 py-1 text-sm"
                                      placeholder="Chi tiết đơn thuốc..."
                                    />
                                    <select
                                      name="status"
                                      value={prescForm.status || "pending"}
                                      onChange={(e) =>
                                        handlePrescriptionFormChange(d.id, e)
                                      }
                                      className="w-full border rounded px-2 py-1 text-sm"
                                    >
                                      <option value="pending">Chờ phát</option>
                                      <option value="dispensed">Đã phát</option>
                                      <option value="cancelled">Đã hủy</option>
                                    </select>
                                    <div className="flex gap-2">
                                      <button
                                        type="submit"
                                        disabled={prescriptionLoading[d.id]}
                                        className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded text-sm"
                                      >
                                        {isEditing
                                          ? "Cập nhật"
                                          : "Tạo đơn thuốc"}
                                      </button>
                                      <button
                                        type="button"
                                        className="bg-gray-300 hover:bg-gray-400 text-gray-800 px-3 py-1 rounded text-sm"
                                        onClick={() => handleCancelEdit(d.id)}
                                      >
                                        Hủy
                                      </button>
                                    </div>
                                  </form>
                                )}
                              {/* Nếu đã có đơn thuốc, hiển thị danh sách và nút sửa/xóa */}
                              {prescList.length > 0 && !isEditing && (
                                <div className="space-y-2">
                                  {prescList.map((presc) => (
                                    <div
                                      key={presc.id}
                                      className="border rounded p-2 mb-1 bg-blue-50"
                                    >
                                      <div className="text-sm font-semibold">
                                        Đơn thuốc
                                      </div>
                                      <div className="text-xs text-gray-700">
                                        {presc.details}
                                      </div>
                                      <div className="text-xs text-gray-500">
                                        Trạng thái:{" "}
                                        <span
                                          className={
                                            presc.status === "pending"
                                              ? "text-yellow-600"
                                              : presc.status === "dispensed"
                                              ? "text-green-600"
                                              : "text-red-600"
                                          }
                                        >
                                          {presc.status === "pending"
                                            ? "Chờ phát"
                                            : presc.status === "dispensed"
                                            ? "Đã phát"
                                            : "Đã hủy"}
                                        </span>
                                      </div>
                                      <div className="flex gap-2 mt-1">
                                        <button
                                          className="bg-yellow-500 hover:bg-yellow-600 text-white px-2 py-1 rounded text-xs"
                                          onClick={() =>
                                            handleEditPrescription(d.id, presc)
                                          }
                                          type="button"
                                        >
                                          Sửa trạng thái
                                        </button>
                                        <button
                                          className="bg-red-500 hover:bg-red-600 text-white px-2 py-1 rounded text-xs"
                                          onClick={() =>
                                            handleDeletePrescription(
                                              d.id,
                                              presc.id
                                            )
                                          }
                                          type="button"
                                        >
                                          Xóa
                                        </button>
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              )}
                            </td>
                          </tr>
                        </React.Fragment>
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
