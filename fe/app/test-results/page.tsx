"use client";

import React, { useEffect, useState } from "react";

type Patient = {
  id: number;
  user_id: number;
  date_of_birth: string;
  address: string;
  medical_history: string;
  created_at: string;
  updated_at: string;
};

type LabRequest = {
  id: number;
  patient_id: number;
  doctor_id: number;
  test_type: string;
  description: string;
  status: "pending" | "completed" | "cancelled";
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

function getCookie(name: string): string | null {
  if (typeof document === "undefined") return null;
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop()!.split(";").shift() || null;
  return null;
}

const TestResultsPage: React.FC = () => {
  const [patient, setPatient] = useState<Patient | null>(null);
  const [labRequests, setLabRequests] = useState<LabRequest[]>([]);
  const [labResults, setLabResults] = useState<LabResult[]>([]);
  const [loading, setLoading] = useState(true);

  // Get user_id from cookies
  useEffect(() => {
    const fetchPatient = async () => {
      try {
        const userIdStr = getCookie("user_id");
        if (!userIdStr) {
          setLoading(false);
          return;
        }
        const user_id = parseInt(userIdStr, 10);
        const res = await fetch("http://localhost:8080/api/patients/");
        const patients: Patient[] = await res.json();
        const found = patients.find((p) => p.user_id === user_id);
        if (found) setPatient(found);
      } catch (e) {
        // handle error
      } finally {
        setLoading(false);
      }
    };
    fetchPatient();
  }, []);

  // Fetch lab requests and results for patient
  useEffect(() => {
    if (!patient) return;
    const fetchLabRequestsAndResults = async () => {
      setLoading(true);
      try {
        // Get all lab requests for this patient
        const reqRes = await fetch(
          `http://localhost:8080/api/lab_requests/filter/?patient_id=${patient.id}`
        );
        const requests: LabRequest[] = await reqRes.json();
        setLabRequests(requests);

        // Get all lab results
        const resRes = await fetch("http://localhost:8080/api/lab_results/");
        const results: LabResult[] = await resRes.json();
        setLabResults(results);
      } catch (e) {
        // handle error
      } finally {
        setLoading(false);
      }
    };
    fetchLabRequestsAndResults();
  }, [patient]);

  // Map lab_request.id -> lab_result
  const labResultMap = React.useMemo(() => {
    const map: Record<number, LabResult> = {};
    for (const result of labResults) {
      map[result.lab_request] = result;
    }
    return map;
  }, [labResults]);

  if (loading)
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );

  if (!patient)
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <h2 className="text-2xl font-semibold text-gray-700 mb-2">
          Không tìm thấy thông tin bệnh nhân
        </h2>
        <p className="text-gray-500">Vui lòng đăng nhập lại.</p>
      </div>
    );

  return (
    <div className="max-w-4xl mx-auto py-10 px-4">
      <h1 className="text-3xl font-bold mb-6 text-blue-700 flex items-center gap-2">
        <svg
          className="w-8 h-8 text-blue-500"
          fill="none"
          stroke="currentColor"
          strokeWidth={2}
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M9 17v-2a2 2 0 012-2h2a2 2 0 012 2v2m-6 4h6a2 2 0 002-2v-5a2 2 0 00-2-2h-1V7a4 4 0 10-8 0v5h-1a2 2 0 00-2 2v5a2 2 0 002 2z"
          />
        </svg>
        Kết quả xét nghiệm của bạn
      </h1>
      <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
        <div className="flex items-center gap-4 mb-4 space-x-8">
          <div className="flex ">
            <div className="font-semibold text-gray-700">Mã bệnh nhân:</div>
            <div className="text-blue-600">{patient.id}</div>
          </div>
          <div className="flex">
            <div className="font-semibold text-gray-700">Ngày sinh:</div>
            <div>{patient.date_of_birth}</div>
          </div>
          <div className="flex">
            <div className="font-semibold text-gray-700">Địa chỉ:</div>
            <div>{patient.address}</div>
          </div>
        </div>
      </div>
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h2 className="text-xl font-semibold mb-4 text-blue-600">
          Danh sách xét nghiệm
        </h2>
        {labRequests.length === 0 ? (
          <div className="text-gray-500">
            Bạn chưa có yêu cầu xét nghiệm nào.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead>
                <tr>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                    Loại xét nghiệm
                  </th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                    Mô tả
                  </th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                    Trạng thái
                  </th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                    Kết quả
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {labRequests.map((req) => {
                  const result = labResultMap[req.id];
                  return (
                    <tr key={req.id} className="hover:bg-blue-50 transition">
                      <td className="px-4 py-3 font-medium text-gray-800">
                        {req.test_type}
                      </td>
                      <td className="px-4 py-3 text-gray-700">
                        {req.description}
                      </td>
                      <td className="px-4 py-3">
                        <span
                          className={
                            req.status === "completed"
                              ? "bg-green-100 text-green-700 px-2 py-1 rounded-full text-xs"
                              : req.status === "pending"
                              ? "bg-yellow-100 text-yellow-700 px-2 py-1 rounded-full text-xs"
                              : "bg-red-100 text-red-700 px-2 py-1 rounded-full text-xs"
                          }
                        >
                          {req.status === "completed"
                            ? "Đã hoàn thành"
                            : req.status === "pending"
                            ? "Đang chờ"
                            : "Đã hủy"}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        {result ? (
                          <div className="flex flex-col gap-1">
                            <span className="font-semibold text-blue-700">
                              {result.details}
                            </span>
                            <span className="text-xs text-gray-500">
                              Ngày trả kết quả:{" "}
                              {new Date(result.result_date).toLocaleString(
                                "vi-VN"
                              )}
                            </span>
                          </div>
                        ) : (
                          <span className="italic text-gray-400">
                            Chưa có kết quả
                          </span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default TestResultsPage;
