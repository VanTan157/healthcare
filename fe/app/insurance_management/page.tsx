"use client";

import React, { useEffect, useState } from "react";

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
  status: "pending" | "approved" | "rejected";
  created_at: string;
  updated_at: string;
};

const API_BASE_CONTRACT = "http://localhost:8080/api/insurance_contracts";
const API_BASE_CLAIM = "http://localhost:8080/api/claims";

export default function InsuranceManagementPage() {
  // Contracts
  const [contracts, setContracts] = useState<InsuranceContract[]>([]);
  const [selectedContract, setSelectedContract] =
    useState<InsuranceContract | null>(null);
  const [contractForm, setContractForm] = useState<Partial<InsuranceContract>>(
    {}
  );
  const [contractFormMode, setContractFormMode] = useState<
    "create" | "edit" | null
  >(null);

  // Claims
  const [claims, setClaims] = useState<InsuranceClaim[]>([]);
  const [selectedClaim, setSelectedClaim] = useState<InsuranceClaim | null>(
    null
  );
  const [claimForm, setClaimForm] = useState<Partial<InsuranceClaim>>({});
  const [claimFormMode, setClaimFormMode] = useState<"create" | "edit" | null>(
    null
  );

  // UI
  const [tab, setTab] = useState<"contracts" | "claims">("contracts");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  // Fetch contracts
  const fetchContracts = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE_CONTRACT}/`);
      const data = await res.json();
      setContracts(data);
    } catch {
      setMessage("Lỗi khi tải hợp đồng bảo hiểm.");
    }
    setLoading(false);
  };

  // Fetch claims
  const fetchClaims = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE_CLAIM}/`);
      const data = await res.json();
      setClaims(data);
    } catch {
      setMessage("Lỗi khi tải yêu cầu bồi thường.");
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchContracts();
    fetchClaims();
  }, []);

  // Contract handlers
  const handleContractFormChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setContractForm({ ...contractForm, [e.target.name]: e.target.value });
  };

  const handleCreateContract = () => {
    setContractForm({});
    setContractFormMode("create");
    setSelectedContract(null);
  };

  const handleEditContract = (contract: InsuranceContract) => {
    setContractForm(contract);
    setContractFormMode("edit");
    setSelectedContract(contract);
  };

  const handleSubmitContract = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const method = contractFormMode === "edit" ? "PATCH" : "POST";
    const url =
      contractFormMode === "edit"
        ? `${API_BASE_CONTRACT}/${(contractForm as InsuranceContract).id}/`
        : `${API_BASE_CONTRACT}/`;
    const body = { ...contractForm };
    if (contractFormMode === "edit") {
      delete body.id;
      delete body.created_at;
      delete body.updated_at;
    }
    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    if (res.ok) {
      setMessage(
        contractFormMode === "edit"
          ? "Cập nhật thành công!"
          : "Tạo mới thành công!"
      );
      fetchContracts();
      setContractFormMode(null);
      setContractForm({});
    } else {
      setMessage("Có lỗi xảy ra.");
    }
    setLoading(false);
  };

  // Claim handlers
  const handleClaimFormChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    setClaimForm({ ...claimForm, [e.target.name]: e.target.value });
  };

  const handleCreateClaim = () => {
    setClaimForm({});
    setClaimFormMode("create");
    setSelectedClaim(null);
  };

  const handleEditClaim = (claim: InsuranceClaim) => {
    setClaimForm(claim);
    setClaimFormMode("edit");
    setSelectedClaim(claim);
  };

  const handleDeleteClaim = async (id: number) => {
    if (!confirm("Bạn có chắc muốn xóa yêu cầu này?")) return;
    setLoading(true);
    await fetch(`${API_BASE_CLAIM}/${id}/`, { method: "DELETE" });
    setMessage("Đã xóa yêu cầu bồi thường.");
    fetchClaims();
    setLoading(false);
  };

  const handleSubmitClaim = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    let method: "POST" | "PATCH" = claimFormMode === "edit" ? "PATCH" : "POST";
    let url =
      claimFormMode === "edit"
        ? `${API_BASE_CLAIM}/${(claimForm as InsuranceClaim).id}/`
        : `${API_BASE_CLAIM}/`;
    let body: any = { ...claimForm };
    if (claimFormMode === "edit") {
      // Only allow status update
      body = { status: claimForm.status };
    }
    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    if (res.ok) {
      setMessage(
        claimFormMode === "edit"
          ? "Cập nhật thành công!"
          : "Tạo mới thành công!"
      );
      fetchClaims();
      setClaimFormMode(null);
      setClaimForm({});
    } else {
      const err = await res.json();
      setMessage(err.detail || "Có lỗi xảy ra.");
    }
    setLoading(false);
  };

  // UI
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
      <div className="max-w-6xl mx-auto bg-white rounded-xl shadow-lg p-8">
        <h1 className="text-3xl font-bold text-indigo-700 mb-6 text-center">
          Quản lý Bảo hiểm
        </h1>
        <div className="flex justify-center mb-8">
          <button
            className={`px-6 py-2 rounded-l-lg font-semibold transition ${
              tab === "contracts"
                ? "bg-indigo-600 text-white"
                : "bg-gray-100 text-indigo-600 hover:bg-indigo-100"
            }`}
            onClick={() => setTab("contracts")}
          >
            Hợp đồng bảo hiểm
          </button>
          <button
            className={`px-6 py-2 rounded-r-lg font-semibold transition ${
              tab === "claims"
                ? "bg-indigo-600 text-white"
                : "bg-gray-100 text-indigo-600 hover:bg-indigo-100"
            }`}
            onClick={() => setTab("claims")}
          >
            Yêu cầu bồi thường
          </button>
        </div>
        {message && (
          <div className="mb-4 text-center text-green-700 bg-green-100 rounded p-2">
            {message}
          </div>
        )}
        {loading && (
          <div className="flex justify-center items-center mb-4">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
          </div>
        )}

        {/* Contracts Tab */}
        {tab === "contracts" && (
          <div>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-indigo-700">
                Danh sách hợp đồng bảo hiểm
              </h2>
              <button
                className="bg-indigo-500 hover:bg-indigo-600 text-white px-4 py-2 rounded shadow transition"
                onClick={handleCreateContract}
              >
                + Thêm hợp đồng
              </button>
            </div>
            <div className="overflow-x-auto rounded shadow mb-6">
              <table className="min-w-full bg-white">
                <thead>
                  <tr className="bg-indigo-100 text-indigo-700">
                    <th className="py-2 px-3">ID</th>
                    <th className="py-2 px-3">Mã BN</th>
                    <th className="py-2 px-3">Số hợp đồng</th>
                    <th className="py-2 px-3">Nhà cung cấp</th>
                    <th className="py-2 px-3">Từ ngày</th>
                    <th className="py-2 px-3">Đến ngày</th>
                    <th className="py-2 px-3">Chi tiết</th>
                  </tr>
                </thead>
                <tbody>
                  {contracts.map((c) => (
                    <tr
                      key={c.id}
                      className="hover:bg-indigo-50 transition border-b last:border-b-0"
                    >
                      <td className="py-2 px-3">{c.id}</td>
                      <td className="py-2 px-3">{c.patient_id}</td>
                      <td className="py-2 px-3">{c.policy_number}</td>
                      <td className="py-2 px-3">{c.provider}</td>
                      <td className="py-2 px-3">{c.start_date}</td>
                      <td className="py-2 px-3">{c.end_date}</td>
                      <td className="py-2 px-3">{c.details}</td>
                    </tr>
                  ))}
                  {contracts.length === 0 && (
                    <tr>
                      <td
                        colSpan={8}
                        className="text-center py-4 text-gray-500"
                      >
                        Không có hợp đồng nào.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
            {/* Contract Form */}
            {(contractFormMode === "create" || contractFormMode === "edit") && (
              <div className="bg-indigo-50 rounded p-6 shadow mb-6">
                <h3 className="text-lg font-semibold mb-4">
                  {contractFormMode === "create"
                    ? "Thêm hợp đồng"
                    : "Sửa hợp đồng"}
                </h3>
                <form
                  className="grid grid-cols-1 md:grid-cols-2 gap-4"
                  onSubmit={handleSubmitContract}
                >
                  <div>
                    <label className="block font-medium mb-1">
                      Mã bệnh nhân
                    </label>
                    <input
                      name="patient_id"
                      type="number"
                      required
                      className="w-full border rounded px-3 py-2"
                      value={contractForm.patient_id ?? ""}
                      onChange={handleContractFormChange}
                    />
                  </div>
                  <div>
                    <label className="block font-medium mb-1">
                      Số hợp đồng
                    </label>
                    <input
                      name="policy_number"
                      required
                      className="w-full border rounded px-3 py-2"
                      value={contractForm.policy_number ?? ""}
                      onChange={handleContractFormChange}
                    />
                  </div>
                  <div>
                    <label className="block font-medium mb-1">
                      Nhà cung cấp
                    </label>
                    <input
                      name="provider"
                      required
                      className="w-full border rounded px-3 py-2"
                      value={contractForm.provider ?? ""}
                      onChange={handleContractFormChange}
                    />
                  </div>
                  <div>
                    <label className="block font-medium mb-1">Từ ngày</label>
                    <input
                      name="start_date"
                      type="date"
                      required
                      className="w-full border rounded px-3 py-2"
                      value={contractForm.start_date ?? ""}
                      onChange={handleContractFormChange}
                    />
                  </div>
                  <div>
                    <label className="block font-medium mb-1">Đến ngày</label>
                    <input
                      name="end_date"
                      type="date"
                      required
                      className="w-full border rounded px-3 py-2"
                      value={contractForm.end_date ?? ""}
                      onChange={handleContractFormChange}
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block font-medium mb-1">Chi tiết</label>
                    <textarea
                      name="details"
                      required
                      className="w-full border rounded px-3 py-2"
                      value={contractForm.details ?? ""}
                      onChange={handleContractFormChange}
                    />
                  </div>
                  <div className="md:col-span-2 flex gap-3 mt-2">
                    <button
                      type="submit"
                      className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded shadow transition"
                    >
                      {contractFormMode === "create" ? "Tạo mới" : "Cập nhật"}
                    </button>
                    <button
                      type="button"
                      className="bg-gray-200 hover:bg-gray-300 text-gray-700 px-4 py-2 rounded transition"
                      onClick={() => {
                        setContractFormMode(null);
                        setContractForm({});
                      }}
                    >
                      Hủy
                    </button>
                  </div>
                </form>
              </div>
            )}
          </div>
        )}

        {/* Claims Tab */}
        {tab === "claims" && (
          <div>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-indigo-700">
                Danh sách yêu cầu bồi thường
              </h2>
              <button
                className="bg-indigo-500 hover:bg-indigo-600 text-white px-4 py-2 rounded shadow transition"
                onClick={handleCreateClaim}
              >
                + Thêm yêu cầu
              </button>
            </div>
            <div className="overflow-x-auto rounded shadow mb-6">
              <table className="min-w-full bg-white">
                <thead>
                  <tr className="bg-indigo-100 text-indigo-700">
                    <th className="py-2 px-3">ID</th>
                    <th className="py-2 px-3">Hợp đồng</th>
                    <th className="py-2 px-3">Số tiền</th>
                    <th className="py-2 px-3">Ngày yêu cầu</th>
                    <th className="py-2 px-3">Mô tả</th>
                    <th className="py-2 px-3">Trạng thái</th>
                    <th className="py-2 px-3">Thao tác</th>
                  </tr>
                </thead>
                <tbody>
                  {claims.map((c) => (
                    <tr
                      key={c.id}
                      className="hover:bg-indigo-50 transition border-b last:border-b-0"
                    >
                      <td className="py-2 px-3">{c.id}</td>
                      <td className="py-2 px-3">{c.contract}</td>
                      <td className="py-2 px-3">
                        {c.amount.toLocaleString()} đ
                      </td>
                      <td className="py-2 px-3">{c.claim_date.slice(0, 10)}</td>
                      <td className="py-2 px-3">{c.description}</td>
                      <td className="py-2 px-3">
                        <span
                          className={`px-2 py-1 rounded text-xs font-semibold ${
                            c.status === "pending"
                              ? "bg-yellow-100 text-yellow-700"
                              : c.status === "approved"
                              ? "bg-green-100 text-green-700"
                              : "bg-red-100 text-red-700"
                          }`}
                        >
                          {c.status === "pending"
                            ? "Chờ duyệt"
                            : c.status === "approved"
                            ? "Đã duyệt"
                            : "Từ chối"}
                        </span>
                      </td>
                      <td className="py-2 px-3 flex gap-2">
                        <button
                          className="text-indigo-600 hover:underline"
                          onClick={() => handleEditClaim(c)}
                        >
                          Sửa
                        </button>
                        <button
                          className="text-red-600 hover:underline"
                          onClick={() => handleDeleteClaim(c.id)}
                        >
                          Xóa
                        </button>
                      </td>
                    </tr>
                  ))}
                  {claims.length === 0 && (
                    <tr>
                      <td
                        colSpan={7}
                        className="text-center py-4 text-gray-500"
                      >
                        Không có yêu cầu nào.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
            {/* Claim Form */}
            {(claimFormMode === "create" || claimFormMode === "edit") && (
              <div className="bg-indigo-50 rounded p-6 shadow mb-6">
                <h3 className="text-lg font-semibold mb-4">
                  {claimFormMode === "create"
                    ? "Thêm yêu cầu bồi thường"
                    : "Cập nhật trạng thái yêu cầu"}
                </h3>
                <form
                  className="grid grid-cols-1 md:grid-cols-2 gap-4"
                  onSubmit={handleSubmitClaim}
                >
                  {claimFormMode === "create" && (
                    <>
                      <div>
                        <label className="block font-medium mb-1">
                          ID hợp đồng
                        </label>
                        <input
                          name="contract"
                          type="number"
                          required
                          className="w-full border rounded px-3 py-2"
                          value={claimForm.contract ?? ""}
                          onChange={handleClaimFormChange}
                        />
                      </div>
                      <div>
                        <label className="block font-medium mb-1">
                          Số tiền
                        </label>
                        <input
                          name="amount"
                          type="number"
                          required
                          className="w-full border rounded px-3 py-2"
                          value={claimForm.amount ?? ""}
                          onChange={handleClaimFormChange}
                        />
                      </div>
                      <div>
                        <label className="block font-medium mb-1">
                          Ngày yêu cầu
                        </label>
                        <input
                          name="claim_date"
                          type="date"
                          required
                          className="w-full border rounded px-3 py-2"
                          value={claimForm.claim_date?.slice(0, 10) ?? ""}
                          onChange={handleClaimFormChange}
                        />
                      </div>
                      <div>
                        <label className="block font-medium mb-1">Mô tả</label>
                        <textarea
                          name="description"
                          required
                          className="w-full border rounded px-3 py-2"
                          value={claimForm.description ?? ""}
                          onChange={handleClaimFormChange}
                        />
                      </div>
                      <div>
                        <label className="block font-medium mb-1">
                          Trạng thái
                        </label>
                        <select
                          name="status"
                          required
                          className="w-full border rounded px-3 py-2"
                          value={claimForm.status ?? "pending"}
                          onChange={handleClaimFormChange}
                        >
                          <option value="pending">Chờ duyệt</option>
                          <option value="approved">Duyệt</option>
                          <option value="rejected">Từ chối</option>
                        </select>
                      </div>
                    </>
                  )}
                  {claimFormMode === "edit" && (
                    <div>
                      <label className="block font-medium mb-1">
                        Trạng thái
                      </label>
                      <select
                        name="status"
                        required
                        className="w-full border rounded px-3 py-2"
                        value={claimForm.status ?? "pending"}
                        onChange={handleClaimFormChange}
                      >
                        <option value="pending">Chờ duyệt</option>
                        <option value="approved">Đã duyệt</option>
                        <option value="rejected">Từ chối</option>
                      </select>
                    </div>
                  )}
                  <div className="md:col-span-2 flex gap-3 mt-2">
                    <button
                      type="submit"
                      className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded shadow transition"
                    >
                      {claimFormMode === "create" ? "Tạo mới" : "Cập nhật"}
                    </button>
                    <button
                      type="button"
                      className="bg-gray-200 hover:bg-gray-300 text-gray-700 px-4 py-2 rounded transition"
                      onClick={() => {
                        setClaimFormMode(null);
                        setClaimForm({});
                      }}
                    >
                      Hủy
                    </button>
                  </div>
                </form>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
