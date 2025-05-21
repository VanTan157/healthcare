"use client";

import React, { useEffect, useState } from "react";

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

const API_BASE = "http://localhost:8080/api";

function formatDate(date: string) {
  return new Date(date).toLocaleString();
}

export default function LaboratoryPage() {
  const [tab, setTab] = useState<"pending" | "completed">("pending");
  const [labRequests, setLabRequests] = useState<LabRequest[]>([]);
  const [completedRequests, setCompletedRequests] = useState<
    (LabRequest & { result?: LabResult })[]
  >([]);
  const [labResults, setLabResults] = useState<LabResult[]>([]);
  const [selectedRequest, setSelectedRequest] = useState<LabRequest | null>(
    null
  );
  const [selectedCompleted, setSelectedCompleted] = useState<
    (LabRequest & { result?: LabResult }) | null
  >(null);
  const [resultDetails, setResultDetails] = useState("");
  const [resultDate, setResultDate] = useState("");
  const [loading, setLoading] = useState(false);
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [search, setSearch] = useState("");
  const [searchCompleted, setSearchCompleted] = useState("");

  // Fetch all pending lab requests
  const fetchLabRequests = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch(`${API_BASE}/lab_requests/`);
      if (!res.ok) throw new Error("Failed to fetch lab requests");
      const data: LabRequest[] = await res.json();
      setLabRequests(data.filter((r) => r.status === "pending"));
    } catch (e: any) {
      setError(e.message);
    }
    setLoading(false);
  };

  // Fetch completed lab requests and their results
  const fetchCompletedRequests = async () => {
    setLoading(true);
    setError("");
    try {
      const [reqRes, resultRes] = await Promise.all([
        fetch(`${API_BASE}/lab_requests/`),
        fetch(`${API_BASE}/lab_results/`),
      ]);
      if (!reqRes.ok) throw new Error("Failed to fetch lab requests");
      if (!resultRes.ok) throw new Error("Failed to fetch lab results");
      const reqData: LabRequest[] = await reqRes.json();
      const resultData: LabResult[] = await resultRes.json();
      setLabResults(resultData);
      // Map results to requests
      const completed = reqData
        .filter((r) => r.status === "completed")
        .map((r) => ({
          ...r,
          result: resultData.find((res) => res.lab_request === r.id),
        }));
      setCompletedRequests(completed);
    } catch (e: any) {
      setError(e.message);
    }
    setLoading(false);
  };

  useEffect(() => {
    if (tab === "pending") {
      fetchLabRequests();
    } else {
      fetchCompletedRequests();
    }
    // eslint-disable-next-line
  }, [tab]);

  // Handle selecting a request
  const handleSelect = (req: LabRequest) => {
    setSelectedRequest(req);
    setResultDetails("");
    setResultDate(new Date().toISOString().slice(0, 16)); // default to now
    setSuccess("");
    setError("");
  };

  // Handle selecting a completed request
  const handleSelectCompleted = (req: LabRequest & { result?: LabResult }) => {
    setSelectedCompleted(req);
  };

  // Handle creating a lab result
  const handleCreateResult = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedRequest) return;
    setCreating(true);
    setError("");
    setSuccess("");
    try {
      // 1. Create lab result
      const res = await fetch(`${API_BASE}/lab_results/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          lab_request: selectedRequest.id,
          result_date: new Date(resultDate).toISOString(),
          details: resultDetails,
        }),
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.detail || "Failed to create lab result");
      }
      // 2. Update lab request status to completed
      const res2 = await fetch(
        `${API_BASE}/lab_requests/${selectedRequest.id}/`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ status: "completed" }),
        }
      );
      if (!res2.ok) {
        const err = await res2.json();
        throw new Error(err.detail || "Failed to update lab request");
      }
      setSuccess("Kết quả xét nghiệm đã được lưu và cập nhật trạng thái!");
      setSelectedRequest(null);
      fetchLabRequests();
    } catch (e: any) {
      setError(e.message);
    }
    setCreating(false);
  };

  // Filtered requests by search
  const filteredRequests = labRequests.filter(
    (r) =>
      r.test_type.toLowerCase().includes(search.toLowerCase()) ||
      r.description.toLowerCase().includes(search.toLowerCase()) ||
      String(r.patient_id).includes(search) ||
      String(r.doctor_id).includes(search)
  );

  // Filtered completed requests by search
  const filteredCompleted = completedRequests.filter(
    (r) =>
      r.test_type.toLowerCase().includes(searchCompleted.toLowerCase()) ||
      r.description.toLowerCase().includes(searchCompleted.toLowerCase()) ||
      String(r.patient_id).includes(searchCompleted) ||
      String(r.doctor_id).includes(searchCompleted)
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-200 p-8">
      <div className="max-w-5xl mx-auto bg-white rounded-2xl shadow-xl p-8">
        <h1 className="text-3xl font-bold text-blue-700 mb-6 flex items-center gap-2">
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
              d="M9 17v-2a4 4 0 014-4h3m0 0V7a4 4 0 00-4-4H7a4 4 0 00-4 4v10a4 4 0 004 4h3m7-7l3 3m0 0l-3 3m3-3H13"
            />
          </svg>
          Quản lý xét nghiệm
        </h1>
        {/* Tabs */}
        <div className="flex gap-4 mb-8">
          <button
            className={`px-4 py-2 rounded-t-lg font-semibold transition ${
              tab === "pending"
                ? "bg-blue-600 text-white shadow"
                : "bg-blue-100 text-blue-700 hover:bg-blue-200"
            }`}
            onClick={() => {
              setTab("pending");
              setSelectedRequest(null);
              setSuccess("");
              setError("");
            }}
          >
            Chờ xử lý
          </button>
          <button
            className={`px-4 py-2 rounded-t-lg font-semibold transition ${
              tab === "completed"
                ? "bg-blue-600 text-white shadow"
                : "bg-blue-100 text-blue-700 hover:bg-blue-200"
            }`}
            onClick={() => {
              setTab("completed");
              setSelectedCompleted(null);
              setSuccess("");
              setError("");
            }}
          >
            Đã có kết quả
          </button>
        </div>
        {/* Tab content */}
        {tab === "pending" ? (
          <>
            <div className="mb-8">
              <input
                className="w-full px-4 py-2 border rounded-lg shadow-sm focus:ring-2 focus:ring-blue-300"
                placeholder="Tìm kiếm theo loại xét nghiệm, mô tả, mã bệnh nhân, mã bác sĩ..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Danh sách yêu cầu xét nghiệm */}
              <div>
                <h2 className="text-xl font-semibold mb-4 text-blue-600">
                  Yêu cầu xét nghiệm chờ xử lý
                </h2>
                {loading ? (
                  <div className="flex justify-center items-center h-32">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
                  </div>
                ) : (
                  <ul className="space-y-4 max-h-[420px] overflow-y-auto pr-2">
                    {filteredRequests.length === 0 && (
                      <li className="text-gray-500 italic">
                        Không có yêu cầu nào.
                      </li>
                    )}
                    {filteredRequests.map((req) => (
                      <li
                        key={req.id}
                        className={`p-4 rounded-lg shadow transition cursor-pointer border border-blue-100 hover:bg-blue-50 ${
                          selectedRequest?.id === req.id
                            ? "bg-blue-100 border-blue-300"
                            : ""
                        }`}
                        onClick={() => handleSelect(req)}
                      >
                        <div className="flex justify-between items-center">
                          <span className="font-semibold text-blue-700">
                            {req.test_type}
                          </span>
                          <span className="text-xs text-gray-400">
                            {formatDate(req.created_at)}
                          </span>
                        </div>
                        <div className="text-gray-700 mt-1">
                          {req.description}
                        </div>
                        <div className="text-sm text-gray-500 mt-1">
                          <span>Mã BN: {req.patient_id}</span> |{" "}
                          <span>Mã BS: {req.doctor_id}</span>
                        </div>
                        <div className="mt-1">
                          <span className="inline-block px-2 py-0.5 rounded bg-yellow-100 text-yellow-700 text-xs">
                            {req.status === "pending"
                              ? "Chờ kết quả"
                              : req.status}
                          </span>
                        </div>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
              {/* Form nhập kết quả */}
              <div>
                <h2 className="text-xl font-semibold mb-4 text-blue-600">
                  Nhập kết quả xét nghiệm
                </h2>
                {selectedRequest ? (
                  <form
                    className="bg-blue-50 rounded-lg p-6 shadow flex flex-col gap-4"
                    onSubmit={handleCreateResult}
                  >
                    <div>
                      <label className="block text-sm font-medium text-blue-700 mb-1">
                        Loại xét nghiệm
                      </label>
                      <div className="bg-white px-3 py-2 rounded border">
                        {selectedRequest.test_type}
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-blue-700 mb-1">
                        Mô tả
                      </label>
                      <div className="bg-white px-3 py-2 rounded border">
                        {selectedRequest.description}
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-blue-700 mb-1">
                        Ngày trả kết quả
                      </label>
                      <input
                        type="datetime-local"
                        className="w-full px-3 py-2 border rounded"
                        value={resultDate}
                        onChange={(e) => setResultDate(e.target.value)}
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-blue-700 mb-1">
                        Kết quả chi tiết
                      </label>
                      <textarea
                        className="w-full px-3 py-2 border rounded min-h-[80px]"
                        value={resultDetails}
                        onChange={(e) => setResultDetails(e.target.value)}
                        required
                      />
                    </div>
                    <div className="flex gap-2 mt-2">
                      <button
                        type="submit"
                        className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded font-semibold shadow transition disabled:opacity-60"
                        disabled={creating}
                      >
                        {creating ? (
                          <span className="flex items-center gap-2">
                            <span className="animate-spin h-4 w-4 border-b-2 border-white rounded-full"></span>
                            Đang lưu...
                          </span>
                        ) : (
                          "Lưu kết quả"
                        )}
                      </button>
                      <button
                        type="button"
                        className="bg-gray-200 hover:bg-gray-300 text-gray-700 px-4 py-2 rounded font-semibold transition"
                        onClick={() => setSelectedRequest(null)}
                        disabled={creating}
                      >
                        Hủy
                      </button>
                    </div>
                    {error && <div className="text-red-600 mt-2">{error}</div>}
                    {success && (
                      <div className="text-green-600 mt-2">{success}</div>
                    )}
                  </form>
                ) : (
                  <div className="text-gray-500 italic">
                    Chọn một yêu cầu để nhập kết quả.
                  </div>
                )}
              </div>
            </div>
          </>
        ) : (
          // Tab: Đã có kết quả
          <>
            <div className="mb-8">
              <input
                className="w-full px-4 py-2 border rounded-lg shadow-sm focus:ring-2 focus:ring-blue-300"
                placeholder="Tìm kiếm theo loại xét nghiệm, mô tả, mã bệnh nhân, mã bác sĩ..."
                value={searchCompleted}
                onChange={(e) => setSearchCompleted(e.target.value)}
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Danh sách yêu cầu đã có kết quả */}
              <div>
                <h2 className="text-xl font-semibold mb-4 text-blue-600">
                  Xét nghiệm đã có kết quả
                </h2>
                {loading ? (
                  <div className="flex justify-center items-center h-32">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
                  </div>
                ) : (
                  <ul className="space-y-4 max-h-[420px] overflow-y-auto pr-2">
                    {filteredCompleted.length === 0 && (
                      <li className="text-gray-500 italic">
                        Không có xét nghiệm nào.
                      </li>
                    )}
                    {filteredCompleted.map((req) => (
                      <li
                        key={req.id}
                        className={`p-4 rounded-lg shadow transition cursor-pointer border border-blue-100 hover:bg-blue-50 ${
                          selectedCompleted?.id === req.id
                            ? "bg-blue-100 border-blue-300"
                            : ""
                        }`}
                        onClick={() => handleSelectCompleted(req)}
                      >
                        <div className="flex justify-between items-center">
                          <span className="font-semibold text-blue-700">
                            {req.test_type}
                          </span>
                          <span className="text-xs text-gray-400">
                            {formatDate(req.created_at)}
                          </span>
                        </div>
                        <div className="text-gray-700 mt-1">
                          {req.description}
                        </div>
                        <div className="text-sm text-gray-500 mt-1">
                          <span>Mã BN: {req.patient_id}</span> |{" "}
                          <span>Mã BS: {req.doctor_id}</span>
                        </div>
                        <div className="mt-1">
                          <span className="inline-block px-2 py-0.5 rounded bg-green-100 text-green-700 text-xs">
                            Đã có kết quả
                          </span>
                        </div>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
              {/* Chi tiết kết quả */}
              <div>
                <h2 className="text-xl font-semibold mb-4 text-blue-600">
                  Chi tiết kết quả xét nghiệm
                </h2>
                {selectedCompleted && selectedCompleted.result ? (
                  <div className="bg-blue-50 rounded-lg p-6 shadow flex flex-col gap-4">
                    <div>
                      <label className="block text-sm font-medium text-blue-700 mb-1">
                        Loại xét nghiệm
                      </label>
                      <div className="bg-white px-3 py-2 rounded border">
                        {selectedCompleted.test_type}
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-blue-700 mb-1">
                        Mô tả
                      </label>
                      <div className="bg-white px-3 py-2 rounded border">
                        {selectedCompleted.description}
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-blue-700 mb-1">
                        Ngày trả kết quả
                      </label>
                      <div className="bg-white px-3 py-2 rounded border">
                        {formatDate(selectedCompleted.result.result_date)}
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-blue-700 mb-1">
                        Kết quả chi tiết
                      </label>
                      <div className="bg-white px-3 py-2 rounded border whitespace-pre-line">
                        {selectedCompleted.result.details}
                      </div>
                    </div>
                    <div>
                      <button
                        type="button"
                        className="bg-gray-200 hover:bg-gray-300 text-gray-700 px-4 py-2 rounded font-semibold transition"
                        onClick={() => setSelectedCompleted(null)}
                      >
                        Đóng
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="text-gray-500 italic">
                    Chọn một xét nghiệm để xem chi tiết kết quả.
                  </div>
                )}
              </div>
            </div>
          </>
        )}
      </div>
      <footer className="mt-12 text-center text-gray-400 text-sm">
        © {new Date().getFullYear()} Laboratory System
      </footer>
    </div>
  );
}
