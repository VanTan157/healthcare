"use client";

import React, { useEffect, useState } from "react";

// Helper to get cookie value by name
function getCookie(name: string) {
  if (typeof document === "undefined") return null;
  const match = document.cookie.match(new RegExp("(^| )" + name + "=([^;]+)"));
  return match ? decodeURIComponent(match[2]) : null;
}

type Doctor = {
  id: number;
  user_id: number;
  specialty: string;
  clinic: string;
  schedule: string;
  created_at: string;
  updated_at: string;
};

const DoctorProfilePage = () => {
  const [doctor, setDoctor] = useState<Doctor | null>(null);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({
    specialty: "",
    clinic: "",
    schedule: "",
  });
  const [editMode, setEditMode] = useState(false);

  const userId = Number(getCookie("user_id"));
  const accessToken = getCookie("access");

  useEffect(() => {
    const fetchDoctor = async () => {
      setLoading(true);
      try {
        const res = await fetch("http://localhost:8080/api/doctors/", {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });
        const data: Doctor[] = await res.json();
        const found = data.find((d) => d.user_id === userId);
        if (found) {
          setDoctor(found);
          setForm({
            specialty: found.specialty,
            clinic: found.clinic,
            schedule: found.schedule,
          });
        }
      } catch (e) {
        // handle error
      }
      setLoading(false);
    };
    if (userId && accessToken) fetchDoctor();
  }, [userId, accessToken]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch("http://localhost:8080/api/doctors/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({
          user_id: userId,
          ...form,
        }),
      });
      if (res.ok) {
        const newDoctor = await res.json();
        setDoctor(newDoctor);
        setShowForm(false);
      }
    } catch (e) {
      // handle error
    }
  };

  const handleEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch(
        `http://localhost:8080/api/doctors/user/${userId}/`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
          body: JSON.stringify(form),
        }
      );
      if (res.ok) {
        const updatedDoctor = await res.json();
        setDoctor(updatedDoctor);
        setEditMode(false);
      }
    } catch (e) {
      // handle error
    }
  };

  if (loading)
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-500"></div>
      </div>
    );

  return (
    <div className="max-w-xl mx-auto mt-10 bg-white shadow-xl rounded-lg p-8">
      <h1 className="text-3xl font-bold mb-6 text-blue-700 text-center">
        Hồ sơ Bác sĩ
      </h1>
      {!doctor && !showForm && (
        <div className="text-center">
          <p className="mb-4 text-gray-600">
            Bạn chưa có hồ sơ bác sĩ. Hãy tạo hồ sơ để bắt đầu.
          </p>
          <button
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded transition"
            onClick={() => setShowForm(true)}
          >
            Tạo hồ sơ bác sĩ
          </button>
        </div>
      )}

      {showForm && (
        <form
          onSubmit={handleCreate}
          className="space-y-4 animate-fade-in"
          autoComplete="off"
        >
          <div>
            <label className="block text-gray-700 mb-1">Chuyên khoa</label>
            <input
              name="specialty"
              value={form.specialty}
              onChange={handleInputChange}
              required
              className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>
          <div>
            <label className="block text-gray-700 mb-1">Phòng khám</label>
            <input
              name="clinic"
              value={form.clinic}
              onChange={handleInputChange}
              required
              className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>
          <div>
            <label className="block text-gray-700 mb-1">Lịch làm việc</label>
            <input
              name="schedule"
              value={form.schedule}
              onChange={handleInputChange}
              required
              className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>
          <div className="flex gap-4 justify-center">
            <button
              type="submit"
              className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded transition"
            >
              Lưu hồ sơ
            </button>
            <button
              type="button"
              className="bg-gray-300 hover:bg-gray-400 text-gray-800 px-6 py-2 rounded transition"
              onClick={() => setShowForm(false)}
            >
              Hủy
            </button>
          </div>
        </form>
      )}

      {doctor && !editMode && (
        <div className="animate-fade-in">
          <div className="mb-4">
            <div className="flex items-center gap-4">
              <div className="bg-blue-100 rounded-full h-16 w-16 flex items-center justify-center text-2xl font-bold text-blue-700 shadow">
                {doctor.specialty.charAt(0)}
              </div>
              <div>
                <div className="text-lg font-semibold text-gray-800">
                  {doctor.specialty}
                </div>
                <div className="text-gray-500">{doctor.clinic}</div>
              </div>
            </div>
          </div>
          <div className="mb-2">
            <span className="font-medium text-gray-700">Lịch làm việc: </span>
            <span className="text-gray-800">{doctor.schedule}</span>
          </div>
          <div className="mb-2">
            <span className="font-medium text-gray-700">Ngày tạo: </span>
            <span className="text-gray-500">
              {new Date(doctor.created_at).toLocaleString()}
            </span>
          </div>
          <div className="flex gap-4 mt-6">
            <button
              className="bg-yellow-500 hover:bg-yellow-600 text-white px-6 py-2 rounded transition"
              onClick={() => setEditMode(true)}
            >
              Sửa hồ sơ
            </button>
          </div>
        </div>
      )}

      {doctor && editMode && (
        <form
          onSubmit={handleEdit}
          className="space-y-4 animate-fade-in"
          autoComplete="off"
        >
          <div>
            <label className="block text-gray-700 mb-1">Chuyên khoa</label>
            <input
              name="specialty"
              value={form.specialty}
              onChange={handleInputChange}
              required
              className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>
          <div>
            <label className="block text-gray-700 mb-1">Phòng khám</label>
            <input
              name="clinic"
              value={form.clinic}
              onChange={handleInputChange}
              required
              className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>
          <div>
            <label className="block text-gray-700 mb-1">Lịch làm việc</label>
            <input
              name="schedule"
              value={form.schedule}
              onChange={handleInputChange}
              required
              className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>
          <div className="flex gap-4 justify-center">
            <button
              type="submit"
              className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded transition"
            >
              Lưu thay đổi
            </button>
            <button
              type="button"
              className="bg-gray-300 hover:bg-gray-400 text-gray-800 px-6 py-2 rounded transition"
              onClick={() => {
                setEditMode(false);
                setForm({
                  specialty: doctor.specialty,
                  clinic: doctor.clinic,
                  schedule: doctor.schedule,
                });
              }}
            >
              Hủy
            </button>
          </div>
        </form>
      )}
    </div>
  );
};

export default DoctorProfilePage;
