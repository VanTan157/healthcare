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

type InsuranceContract = {
  id: number;
  patient_id: number;
  policy_number: string;
  provider: string;
  start_date: string;
  end_date: string;
  details: string;
  created_at: string;
  updated_at: string;
};

type InsuranceClaim = {
  id: number;
  contract: number;
  amount: number;
  claim_date: string;
  description: string;
  status: string;
  created_at: string;
  updated_at: string;
};

const API_BASE = "http://localhost:8080/api";

function getCookie(name: string) {
  if (typeof document === "undefined") return null;
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop()?.split(";").shift() || null;
  return null;
}

export default function InsurancePage() {
  const [patient, setPatient] = useState<Patient | null>(null);
  const [contracts, setContracts] = useState<InsuranceContract[]>([]);
  const [claims, setClaims] = useState<InsuranceClaim[]>([]);
  const [loading, setLoading] = useState(true);
  const [showNewContract, setShowNewContract] = useState(false);
  const [showNewClaim, setShowNewClaim] = useState(false);
  const [contractForm, setContractForm] = useState({
    policy_number: "",
    provider: "",
    start_date: "",
    end_date: "",
    details: "",
  });
  const [claimForm, setClaimForm] = useState({
    contract: "",
    amount: "",
    claim_date: "",
    description: "",
    status: "pending",
  });
  const [message, setMessage] = useState<string | null>(null);

  // Get patient by user_id from cookies
  useEffect(() => {
    const userId = getCookie("user_id");
    if (!userId) {
      setLoading(false);
      setMessage("Bạn chưa đăng nhập.");
      return;
    }
    fetch(`${API_BASE}/patients/`)
      .then((res) => res.json())
      .then((data: Patient[]) => {
        const found = data.find((p) => String(p.user_id) === String(userId));
        if (found) setPatient(found);
        else setMessage("Không tìm thấy thông tin bệnh nhân.");
      })
      .catch(() => setMessage("Lỗi khi lấy thông tin bệnh nhân."))
      .finally(() => setLoading(false));
  }, []);

  // Get contracts and claims when patient is set
  useEffect(() => {
    if (!patient) return;
    setLoading(true);
    fetch(`${API_BASE}/insurance_contracts/filter/?patient_id=${patient.id}`)
      .then((res) => (res.ok ? res.json() : []))
      .then((data: InsuranceContract[]) => setContracts(data))
      .catch(() => setContracts([]));
    fetch(`${API_BASE}/claims/`)
      .then((res) => (res.ok ? res.json() : []))
      .then((data: InsuranceClaim[]) =>
        setClaims(
          data.filter((c: InsuranceClaim) =>
            contracts.some((contract) => contract.id === c.contract)
          )
        )
      )
      .catch(() => setClaims([]))
      .finally(() => setLoading(false));
    // eslint-disable-next-line
  }, [patient]);

  // Update claims when contracts change
  useEffect(() => {
    if (!contracts.length) {
      setClaims([]);
      return;
    }
    fetch(`${API_BASE}/claims/`)
      .then((res) => (res.ok ? res.json() : []))
      .then((data: InsuranceClaim[]) =>
        setClaims(
          data.filter((c: InsuranceClaim) =>
            contracts.some((contract) => contract.id === c.contract)
          )
        )
      )
      .catch(() => setClaims([]));
  }, [contracts]);

  // Handlers
  const handleContractFormChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setContractForm({ ...contractForm, [e.target.name]: e.target.value });
  };

  const handleClaimFormChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    setClaimForm({ ...claimForm, [e.target.name]: e.target.value });
  };

  const handleCreateContract = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!patient) return;
    setLoading(true);
    setMessage(null);
    const body = {
      ...contractForm,
      patient_id: patient.id,
    };
    const res = await fetch(`${API_BASE}/insurance_contracts/`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    if (res.ok) {
      setMessage("Đăng ký bảo hiểm thành công!");
      setShowNewContract(false);
      setContractForm({
        policy_number: "",
        provider: "",
        start_date: "",
        end_date: "",
        details: "",
      });
      // Refresh contracts
      fetch(`${API_BASE}/insurance_contracts/filter/?patient_id=${patient.id}`)
        .then((res) => res.json())
        .then((data: InsuranceContract[]) => setContracts(data));
    } else {
      setMessage("Đăng ký bảo hiểm thất bại.");
    }
    setLoading(false);
  };

  const handleRenewContract = async (contract: InsuranceContract) => {
    setLoading(true);
    setMessage(null);
    // Gia hạn: cập nhật end_date (ví dụ +1 năm)
    const newEndDate = new Date(contract.end_date);
    newEndDate.setFullYear(newEndDate.getFullYear() + 1);
    const res = await fetch(`${API_BASE}/insurance_contracts/${contract.id}/`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ end_date: newEndDate.toISOString().slice(0, 10) }),
    });
    if (res.ok) {
      setMessage("Gia hạn bảo hiểm thành công!");
      fetch(`${API_BASE}/insurance_contracts/filter/?patient_id=${patient?.id}`)
        .then((res) => res.json())
        .then((data: InsuranceContract[]) => setContracts(data));
    } else {
      setMessage("Gia hạn bảo hiểm thất bại.");
    }
    setLoading(false);
  };

  const handleDeleteContract = async (id: number) => {
    if (!window.confirm("Bạn có chắc muốn xóa hợp đồng này?")) return;
    setLoading(true);
    setMessage(null);
    const res = await fetch(`${API_BASE}/insurance_contracts/${id}/`, {
      method: "DELETE",
    });
    if (res.ok) {
      setMessage("Xóa hợp đồng thành công!");
      setContracts(contracts.filter((c) => c.id !== id));
    } else {
      setMessage("Xóa hợp đồng thất bại.");
    }
    setLoading(false);
  };

  const handleCreateClaim = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);
    const body = {
      ...claimForm,
      contract: Number(claimForm.contract),
      amount: Number(claimForm.amount),
    };
    const res = await fetch(`${API_BASE}/claims/`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    if (res.ok) {
      setMessage("Tạo yêu cầu bồi thường thành công!");
      setShowNewClaim(false);
      setClaimForm({
        contract: "",
        amount: "",
        claim_date: "",
        description: "",
        status: "pending",
      });
      // Refresh claims
      fetch(`${API_BASE}/claims/`)
        .then((res) => res.json())
        .then((data: InsuranceClaim[]) =>
          setClaims(
            data.filter((c: InsuranceClaim) =>
              contracts.some((contract) => contract.id === c.contract)
            )
          )
        );
    } else {
      setMessage("Tạo yêu cầu bồi thường thất bại.");
    }
    setLoading(false);
  };

  const handleDeleteClaim = async (id: number) => {
    if (!window.confirm("Bạn có chắc muốn xóa yêu cầu này?")) return;
    setLoading(true);
    setMessage(null);
    const res = await fetch(`${API_BASE}/claims/${id}/`, { method: "DELETE" });
    if (res.ok) {
      setMessage("Xóa yêu cầu thành công!");
      setClaims(claims.filter((c) => c.id !== id));
    } else {
      setMessage("Xóa yêu cầu thất bại.");
    }
    setLoading(false);
  };

  const handleUpdateClaimStatus = async (id: number, status: string) => {
    setLoading(true);
    setMessage(null);
    const res = await fetch(`${API_BASE}/claims/${id}/`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    if (res.ok) {
      setMessage("Cập nhật trạng thái thành công!");
      fetch(`${API_BASE}/claims/`)
        .then((res) => res.json())
        .then((data: InsuranceClaim[]) =>
          setClaims(
            data.filter((c: InsuranceClaim) =>
              contracts.some((contract) => contract.id === c.contract)
            )
          )
        );
    } else {
      setMessage("Cập nhật trạng thái thất bại.");
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-200 p-6">
      <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-lg p-8">
        <h1 className="text-3xl font-bold text-blue-700 mb-4 flex items-center gap-2">
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
              d="M12 6v6l4 2m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          Quản lý Bảo hiểm của Bệnh nhân
        </h1>
        {loading && (
          <div className="text-blue-500 animate-pulse">Đang tải...</div>
        )}
        {message && (
          <div className="my-2 text-center text-red-600">{message}</div>
        )}
        {!loading && patient && (
          <>
            <div className="mb-6">
              <h2 className="text-xl font-semibold text-gray-700 mb-2">
                Thông tin bệnh nhân
              </h2>
              <div className="grid grid-cols-2 gap-4 bg-blue-50 rounded-lg p-4">
                <div>
                  <span className="font-medium">ID:</span> {patient.id}
                </div>
                <div>
                  <span className="font-medium">Ngày sinh:</span>{" "}
                  {patient.date_of_birth}
                </div>
                <div>
                  <span className="font-medium">Địa chỉ:</span>{" "}
                  {patient.address}
                </div>
                <div>
                  <span className="font-medium">Tiền sử bệnh:</span>{" "}
                  {patient.medical_history}
                </div>
              </div>
            </div>

            {/* Insurance Contracts */}
            <div className="mb-8">
              <div className="flex justify-between items-center mb-2">
                <h2 className="text-xl font-semibold text-gray-700">
                  Hợp đồng bảo hiểm
                </h2>
                <button
                  className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded shadow transition"
                  onClick={() => setShowNewContract((v) => !v)}
                >
                  {showNewContract ? "Đóng" : "Đăng ký mới"}
                </button>
              </div>
              {showNewContract && (
                <form
                  className="bg-blue-50 rounded-lg p-4 mb-4 grid grid-cols-2 gap-4 animate-fade-in"
                  onSubmit={handleCreateContract}
                >
                  <input
                    className="border rounded px-2 py-1"
                    name="policy_number"
                    placeholder="Số hợp đồng"
                    value={contractForm.policy_number}
                    onChange={handleContractFormChange}
                    required
                  />
                  <input
                    className="border rounded px-2 py-1"
                    name="provider"
                    placeholder="Nhà cung cấp"
                    value={contractForm.provider}
                    onChange={handleContractFormChange}
                    required
                  />
                  <input
                    className="border rounded px-2 py-1"
                    name="start_date"
                    type="date"
                    placeholder="Ngày bắt đầu"
                    value={contractForm.start_date}
                    onChange={handleContractFormChange}
                    required
                  />
                  <input
                    className="border rounded px-2 py-1"
                    name="end_date"
                    type="date"
                    placeholder="Ngày kết thúc"
                    value={contractForm.end_date}
                    onChange={handleContractFormChange}
                    required
                  />
                  <textarea
                    className="border rounded px-2 py-1 col-span-2"
                    name="details"
                    placeholder="Chi tiết"
                    value={contractForm.details}
                    onChange={handleContractFormChange}
                    required
                  />
                  <button
                    className="col-span-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded shadow transition"
                    type="submit"
                  >
                    Đăng ký
                  </button>
                </form>
              )}
              <div className="overflow-x-auto">
                <table className="min-w-full bg-white rounded-lg shadow">
                  <thead>
                    <tr className="bg-blue-100 text-blue-700">
                      <th className="py-2 px-3">Số hợp đồng</th>
                      <th className="py-2 px-3">Nhà cung cấp</th>
                      <th className="py-2 px-3">Ngày bắt đầu</th>
                      <th className="py-2 px-3">Ngày kết thúc</th>
                      <th className="py-2 px-3">Chi tiết</th>
                      <th className="py-2 px-3">Hành động</th>
                    </tr>
                  </thead>
                  <tbody>
                    {contracts.length === 0 && (
                      <tr>
                        <td
                          colSpan={6}
                          className="text-center py-4 text-gray-500"
                        >
                          Chưa có hợp đồng bảo hiểm nào.
                        </td>
                      </tr>
                    )}
                    {contracts.map((contract) => (
                      <tr
                        key={contract.id}
                        className="hover:bg-blue-50 transition"
                      >
                        <td className="py-2 px-3">{contract.policy_number}</td>
                        <td className="py-2 px-3">{contract.provider}</td>
                        <td className="py-2 px-3">{contract.start_date}</td>
                        <td className="py-2 px-3">{contract.end_date}</td>
                        <td className="py-2 px-3">{contract.details}</td>
                        <td className="py-2 px-3 flex gap-2">
                          <button
                            className="bg-green-500 hover:bg-green-600 text-white px-2 py-1 rounded text-sm"
                            onClick={() => handleRenewContract(contract)}
                          >
                            Gia hạn
                          </button>
                          <button
                            className="bg-red-500 hover:bg-red-600 text-white px-2 py-1 rounded text-sm"
                            onClick={() => handleDeleteContract(contract.id)}
                          >
                            Xóa
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Insurance Claims */}
            <div>
              <div className="flex justify-between items-center mb-2">
                <h2 className="text-xl font-semibold text-gray-700">
                  Yêu cầu bồi thường
                </h2>
                <button
                  className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded shadow transition"
                  onClick={() => setShowNewClaim((v) => !v)}
                  disabled={contracts.length === 0}
                  title={
                    contracts.length === 0 ? "Bạn cần có hợp đồng bảo hiểm" : ""
                  }
                >
                  {showNewClaim ? "Đóng" : "Tạo yêu cầu"}
                </button>
              </div>
              {showNewClaim && (
                <form
                  className="bg-blue-50 rounded-lg p-4 mb-4 grid grid-cols-2 gap-4 animate-fade-in"
                  onSubmit={handleCreateClaim}
                >
                  <select
                    className="border rounded px-2 py-1"
                    name="contract"
                    value={claimForm.contract}
                    onChange={handleClaimFormChange}
                    required
                  >
                    <option value="">Chọn hợp đồng</option>
                    {contracts.map((contract) => (
                      <option key={contract.id} value={contract.id}>
                        {contract.policy_number} - {contract.provider}
                      </option>
                    ))}
                  </select>
                  <input
                    className="border rounded px-2 py-1"
                    name="amount"
                    type="number"
                    min={0}
                    step={0.01}
                    placeholder="Số tiền"
                    value={claimForm.amount}
                    onChange={handleClaimFormChange}
                    required
                  />
                  <input
                    className="border rounded px-2 py-1"
                    name="claim_date"
                    type="date"
                    placeholder="Ngày yêu cầu"
                    value={claimForm.claim_date}
                    onChange={handleClaimFormChange}
                    required
                  />
                  <select
                    className="border rounded px-2 py-1"
                    name="status"
                    value={claimForm.status}
                    onChange={handleClaimFormChange}
                    required
                  >
                    <option value="pending">Chờ duyệt</option>
                  </select>
                  <textarea
                    className="border rounded px-2 py-1 col-span-2"
                    name="description"
                    placeholder="Mô tả"
                    value={claimForm.description}
                    onChange={handleClaimFormChange}
                    required
                  />
                  <button
                    className="col-span-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded shadow transition"
                    type="submit"
                  >
                    Gửi yêu cầu
                  </button>
                </form>
              )}
              <div className="overflow-x-auto">
                <table className="min-w-full bg-white rounded-lg shadow">
                  <thead>
                    <tr className="bg-blue-100 text-blue-700">
                      <th className="py-2 px-3">Hợp đồng</th>
                      <th className="py-2 px-3">Số tiền</th>
                      <th className="py-2 px-3">Ngày yêu cầu</th>
                      <th className="py-2 px-3">Mô tả</th>
                      <th className="py-2 px-3">Trạng thái</th>
                      <th className="py-2 px-3">Hành động</th>
                    </tr>
                  </thead>
                  <tbody>
                    {claims.length === 0 && (
                      <tr>
                        <td
                          colSpan={6}
                          className="text-center py-4 text-gray-500"
                        >
                          Chưa có yêu cầu bồi thường nào.
                        </td>
                      </tr>
                    )}
                    {claims.map((claim) => (
                      <tr
                        key={claim.id}
                        className="hover:bg-blue-50 transition"
                      >
                        <td className="py-2 px-3">
                          {contracts.find((c) => c.id === claim.contract)
                            ?.policy_number || claim.contract}
                        </td>
                        <td className="py-2 px-3">
                          {claim.amount.toLocaleString("vi-VN")}₫
                        </td>
                        <td className="py-2 px-3">
                          {claim.claim_date.slice(0, 10)}
                        </td>
                        <td className="py-2 px-3">{claim.description}</td>
                        <td className="py-2 px-3">
                          <span
                            className={
                              claim.status === "pending"
                                ? "text-yellow-600 font-semibold"
                                : claim.status === "approved"
                                ? "text-green-600 font-semibold"
                                : "text-red-600 font-semibold"
                            }
                          >
                            {claim.status === "pending"
                              ? "Chờ duyệt"
                              : claim.status === "approved"
                              ? "Đã duyệt"
                              : "Từ chối"}
                          </span>
                        </td>
                        <td className="py-2 px-3 flex gap-2">
                          <button
                            className="bg-red-500 hover:bg-red-600 text-white px-2 py-1 rounded text-sm"
                            onClick={() => handleDeleteClaim(claim.id)}
                          >
                            Xóa
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}
      </div>
      <style jsx global>{`
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: none;
          }
        }
        .animate-fade-in {
          animation: fade-in 0.3s ease;
        }
      `}</style>
    </div>
  );
}
