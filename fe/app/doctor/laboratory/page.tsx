"use client";

import React, { useEffect, useState } from "react";
import Cookies from "js-cookie";

type Doctor = {
  id: number;
  user_id: number;
  specialty: string;
  clinic: string;
  schedule: string;
};

type User = {
  id: number;
  username: string;
  email: string;
  role: string;
  is_active: boolean;
};

type Patient = {
  id: number;
  user_id: number;
  date_of_birth: string;
  address: string;
  medical_history: string;
};

type LabRequest = {
  id: number;
  patient_id: number;
  doctor_id: number;
  test_type: string;
  description: string;
  status: string;
  created_at: string;
  updated_at: string;
};

type LabResult = {
  id: number;
  lab_request: number;
  result_date: string;
  details: string;
  created_at: string;
  updated_at: string;
};

const TEST_TYPES = [
  "Xét nghiệm máu",
  "Xét nghiệm nước tiểu",
  "X-quang",
  "MRI",
  "CT Scan",
  "Siêu âm",
  "Khác",
];

export default function LaboratoryPage() {
  const [doctor, setDoctor] = useState<Doctor | null>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [patients, setPatients] = useState<Patient[]>([]);
  const [selectedPatient, setSelectedPatient] = useState<number | "">("");
  const [testType, setTestType] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [labRequests, setLabRequests] = useState<LabRequest[]>([]);
  const [labResults, setLabResults] = useState<
    Record<number, LabResult | null>
  >({});
  const [formError, setFormError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const userId = Cookies.get("user_id");

  // Fetch doctor info based on user_id in cookies
  useEffect(() => {
    if (!userId) return;
    fetch("http://localhost:8080/api/doctors/")
      .then((res) => res.json())
      .then((data: Doctor[]) => {
        const found = data.find((d) => d.user_id === Number(userId));
        setDoctor(found || null);
      });
  }, []);

  // Fetch patients
  useEffect(() => {
    fetch("http://localhost:8080/api/patients/")
      .then((res) => res.json())
      .then((data: Patient[]) => setPatients(data));
  }, []);

  const accessToken = Cookies.get("access");

  useEffect(() => {
    fetch("http://localhost:8080/api/users/", {
      headers: { Authorization: `Bearer ${accessToken}` },
    })
      .then((res) => res.json())
      .then((data: User[]) => setUsers(data));
  }, []);

  // Fetch lab requests for this doctor
  useEffect(() => {
    if (!doctor) return;
    fetch(
      `http://localhost:8080/api/lab_requests/filter/?doctor_id=${doctor.id}`
    )
      .then((res) => res.json())
      .then((data: LabRequest[]) => setLabRequests(data));
  }, [doctor]);

  // Fetch lab results for each lab request
  useEffect(() => {
    if (!labRequests.length) return;
    const fetchResults = async () => {
      const results: Record<number, LabResult | null> = {};
      await Promise.all(
        labRequests.map(async (req) => {
          if (req.status === "completed") {
            const res = await fetch(
              `http://localhost:8080/api/lab_results/?lab_request=${req.id}`
            );
            const data = await res.json();
            if (Array.isArray(data) && data.length > 0) {
              results[req.id] = data[0];
            } else if (data && data.id) {
              results[req.id] = data;
            } else {
              results[req.id] = null;
            }
          } else {
            results[req.id] = null;
          }
        })
      );
      setLabResults(results);
    };
    fetchResults();
  }, [labRequests]);

  // Handle form submit
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);
    setSuccessMsg(null);

    if (!selectedPatient || !testType || !description) {
      setFormError("Vui lòng điền đầy đủ thông tin.");
      return;
    }
    if (!doctor) {
      setFormError("Không tìm thấy thông tin bác sĩ.");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch("http://localhost:8080/api/lab_requests/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          patient_id: selectedPatient,
          doctor_id: doctor.id,
          test_type: testType,
          description,
          status: "pending",
        }),
      });
      if (!res.ok) {
        const err = await res.json();
        setFormError(err.detail || "Có lỗi xảy ra.");
      } else {
        setSuccessMsg("Tạo yêu cầu xét nghiệm thành công!");
        setTestType("");
        setDescription("");
        setSelectedPatient("");
        fetch(
          `http://localhost:8080/api/lab_requests/filter/?doctor_id=${doctor.id}`
        )
          .then((res) => res.json())
          .then((data: LabRequest[]) => setLabRequests(data));
      }
    } catch {
      setFormError("Không thể kết nối đến máy chủ.");
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 py-10 px-4">
      <div className="max-w-3xl mx-auto bg-white rounded-xl shadow-lg p-8">
        <h1 className="text-3xl font-bold text-blue-700 mb-6 text-center">
          Tạo Yêu Cầu Xét Nghiệm
        </h1>
        <form className="space-y-6" onSubmit={handleSubmit} autoComplete="off">
          <div>
            <label className="block text-gray-700 font-medium mb-2">
              Bệnh nhân
            </label>
            <select
              className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
              value={selectedPatient}
              onChange={(e) => setSelectedPatient(Number(e.target.value))}
              required
            >
              <option value="">-- Chọn bệnh nhân --</option>
              {patients.map((p) => (
                <option key={p.id} value={p.id}>
                  #{p.id} -{" "}
                  {users.find((u) => u.id === p.user_id)?.username ||
                    "Không rõ"}{" "}
                  - {p.address} (SN: {p.date_of_birth})
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-gray-700 font-medium mb-2">
              Loại xét nghiệm
            </label>
            <select
              className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
              value={testType}
              onChange={(e) => setTestType(e.target.value)}
              required
            >
              <option value="">-- Chọn loại xét nghiệm --</option>
              {TEST_TYPES.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-gray-700 font-medium mb-2">
              Mô tả
            </label>
            <textarea
              className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Nhập mô tả chi tiết..."
              required
            />
          </div>
          {formError && (
            <div className="text-red-600 font-medium">{formError}</div>
          )}
          {successMsg && (
            <div className="text-green-600 font-medium">{successMsg}</div>
          )}
          <button
            type="submit"
            className={`w-full py-2 rounded-lg bg-blue-600 text-white font-semibold text-lg shadow hover:bg-blue-700 transition ${
              loading ? "opacity-60 cursor-not-allowed" : ""
            }`}
            disabled={loading}
          >
            {loading ? "Đang gửi..." : "Tạo yêu cầu"}
          </button>
        </form>
      </div>

      <div className="max-w-4xl mx-auto mt-12">
        <h2 className="text-2xl font-bold text-blue-700 mb-4">
          Danh sách yêu cầu xét nghiệm của bạn
        </h2>
        <div className="overflow-x-auto rounded-lg shadow">
          <table className="min-w-full bg-white">
            <thead>
              <tr className="bg-blue-100 text-blue-700">
                <th className="py-3 px-4 text-left">#</th>
                <th className="py-3 px-4 text-left">Bệnh nhân</th>
                <th className="py-3 px-4 text-left">Loại</th>
                <th className="py-3 px-4 text-left">Mô tả</th>
                <th className="py-3 px-4 text-left">Trạng thái</th>
                <th className="py-3 px-4 text-left">Ngày tạo</th>
              </tr>
            </thead>
            <tbody>
              {labRequests.length === 0 && (
                <tr>
                  <td colSpan={6} className="py-6 text-center text-gray-500">
                    Không có yêu cầu nào.
                  </td>
                </tr>
              )}
              {labRequests.map((req) => {
                const patient = patients.find((p) => p.id === req.patient_id);
                return (
                  <React.Fragment key={req.id}>
                    <tr className="hover:bg-blue-50 transition">
                      <td className="py-2 px-4 font-semibold text-blue-700 align-top">
                        {req.id}
                      </td>
                      <td className="py-2 px-4 align-top">
                        {patient
                          ? `#${patient.id} - ${
                              users.find((u) => u.id === patient.user_id)
                                ?.username || "Không rõ"
                            }`
                          : `#${req.patient_id}`}
                      </td>
                      <td className="py-2 px-4 align-top">{req.test_type}</td>
                      <td className="py-2 px-4 align-top">{req.description}</td>
                      <td className="py-2 px-4 align-top">
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-bold ${
                            req.status === "pending"
                              ? "bg-yellow-100 text-yellow-700"
                              : req.status === "completed"
                              ? "bg-green-100 text-green-700"
                              : "bg-red-100 text-red-700"
                          }`}
                        >
                          {req.status === "pending"
                            ? "Đang chờ"
                            : req.status === "completed"
                            ? "Hoàn thành"
                            : "Đã hủy"}
                        </span>
                      </td>
                      <td className="py-2 px-4 align-top">
                        {new Date(req.created_at).toLocaleString("vi-VN")}
                      </td>
                    </tr>
                    <tr>
                      <td colSpan={6} className="bg-blue-50 px-4 pb-4 pt-0">
                        <div className="pl-2">
                          <span className="font-semibold text-blue-700">
                            Kết quả:
                          </span>
                          {req.status === "completed" && labResults[req.id] ? (
                            <span className="text-green-700 flex space-x-20 ">
                              <div>
                                <span className="font-semibold">Ngày:</span>
                                {new Date(
                                  labResults[req.id]?.result_date || ""
                                ).toLocaleString("vi-VN")}
                              </div>
                              <div>
                                <span className="font-semibold">Chi tiết:</span>
                                <span>{labResults[req.id]?.details}</span>
                              </div>
                            </span>
                          ) : (
                            <span className="text-gray-400 italic ml-2">
                              {req.status === "pending"
                                ? "Chưa có"
                                : req.status === "cancelled"
                                ? "Đã hủy"
                                : "Đang xử lý..."}
                            </span>
                          )}
                        </div>
                      </td>
                    </tr>
                  </React.Fragment>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
