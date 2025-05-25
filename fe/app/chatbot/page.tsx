"use client";

import React, { useState, useRef, useEffect } from "react";
import Cookies from "js-cookie";

type Message = {
  sender: "user" | "bot";
  text: string;
};
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

const USER_API = "http://localhost:8080/api/users/me/";
const DOCTOR_API = "http://localhost:8003/api/doctors/";
const PATIENT_API = "http://localhost:8080/api/patients/";

const BOT_AVATAR = "https://cdn-icons-png.flaticon.com/512/4712/4712035.png";
const USER_AVATAR = "https://cdn-icons-png.flaticon.com/512/149/149071.png";
const fetchAllDoctors = async () => {
  const res = await fetch(DOCTOR_API);
  if (!res.ok) throw new Error("Failed to fetch users");
  return res.json() as Promise<Doctor[]>;
};

const fetchAllPatients = async (token: string) => {
  const res = await fetch(PATIENT_API, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw new Error("Failed to fetch users");
  return res.json() as Promise<Patient[]>;
};

// (Removed all top-level useState, useEffect, and related variables. Move them inside the component.)

const exampleQuestions = [
  "Tôi bị sốt, ho, đau họng",
  "Tôi muốn đặt lịch hẹn với bác sĩ",
  "Tôi nên uống thuốc gì cho cảm cúm?",
  "Tôi bị đau bụng, buồn nôn",
];

export default function ChatbotPage() {
  // State for chatbot messages
  const [messages, setMessages] = useState<Message[]>([
    {
      sender: "bot",
      text: "Xin chào! Tôi là trợ lý sức khỏe. Bạn cần tôi giúp gì hôm nay?",
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  // State for patient info
  const [patient, setPatient] = useState<Patient | null>(null);

  // Optionally, you can keep these if you plan to use them in the UI
  // const [error, setError] = useState("");
  // const [doctors, setDoctors] = useState<Doctor[]>([]);
  // const [patients, setPatients] = useState<Patient[]>([]);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const token = Cookies.get("access") || "";
  const userId = Cookies.get("user_id") ? Number(Cookies.get("user_id")) : null;

  // Fetch patient info on mount
  useEffect(() => {
    const fetchPatient = async () => {
      if (!token || !userId) return;
      try {
        const res = await fetch(PATIENT_API, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) return;
        const allPatients: Patient[] = await res.json();
        const foundPatient = allPatients.find((p) => p.user_id === userId);
        setPatient(foundPatient || null);
        console.log("Patient info:", foundPatient);
      } catch {
        // Optionally handle error
      }
    };
    fetchPatient();
    // eslint-disable-next-line
  }, [token, userId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = async (msg: string) => {
    if (!msg.trim()) return;
    setMessages((prev) => [...prev, { sender: "user", text: msg }]);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("http://localhost:8080/api/chat/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ patient_id: patient?.id, message: msg }),
      });
      const data = await res.json();
      setMessages((prev) => [
        ...prev,
        {
          sender: "bot",
          text: data.response || "Xin lỗi, tôi chưa hiểu ý bạn.",
        },
      ]);
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          sender: "bot",
          text: "Có lỗi xảy ra khi kết nối đến máy chủ. Vui lòng thử lại sau.",
        },
      ]);
    }
    setLoading(false);
  };

  const handleInput = (e: React.ChangeEvent<HTMLInputElement>) =>
    setInput(e.target.value);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !loading) sendMessage(input);
  };

  const handleExample = (q: string) => {
    setInput(q);
    setTimeout(() => sendMessage(q), 300);
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-100 to-purple-200">
      <div className="min-w-[70%] h-[70%]! bg-white rounded-2xl shadow-2xl flex flex-col overflow-hidden">
        <div className="bg-gradient-to-r from-blue-500 to-purple-500 p-5 flex items-center gap-3">
          <img
            src={BOT_AVATAR}
            alt="Bot"
            className="w-10 h-10 rounded-full border-2 border-white shadow"
          />
          <span className="text-white font-bold text-lg">
            HealthCare Chatbot
          </span>
        </div>
        <div className="flex-1 overflow-y-auto px-4 py-3 space-y-3 bg-gray-50">
          {messages.map((msg, idx) => (
            <div
              key={idx}
              className={`flex items-end ${
                msg.sender === "user" ? "justify-end" : "justify-start"
              }`}
            >
              {msg.sender === "bot" && (
                <img
                  src={BOT_AVATAR}
                  alt="Bot"
                  className="w-8 h-8 rounded-full mr-2 shadow"
                />
              )}
              <div
                className={`px-4 py-2 rounded-2xl shadow transition-all duration-200 ${
                  msg.sender === "user"
                    ? "bg-blue-500 text-white rounded-br-none"
                    : "bg-white text-gray-800 border border-gray-200 rounded-bl-none"
                }`}
              >
                {msg.text}
              </div>
              {msg.sender === "user" && (
                <img
                  src={USER_AVATAR}
                  alt="User"
                  className="w-8 h-8 rounded-full ml-2 shadow"
                />
              )}
            </div>
          ))}
          {loading && (
            <div className="flex items-center gap-2">
              <img
                src={BOT_AVATAR}
                alt="Bot"
                className="w-8 h-8 rounded-full mr-2 shadow"
              />
              <div className="animate-pulse bg-gray-200 px-4 py-2 rounded-2xl">
                Đang trả lời...
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
        <div className="px-4 py-3 bg-white border-t border-gray-200">
          <div className="flex gap-2 mb-2">
            {exampleQuestions.map((q, i) => (
              <button
                key={i}
                className="text-xs bg-blue-100 hover:bg-blue-200 text-blue-700 px-3 py-1 rounded-full transition"
                onClick={() => handleExample(q)}
                disabled={loading}
              >
                {q}
              </button>
            ))}
          </div>
          <div className="flex items-center gap-2">
            <input
              type="text"
              className="flex-1 px-4 py-2 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
              placeholder="Nhập tin nhắn..."
              value={input}
              onChange={handleInput}
              onKeyDown={handleKeyDown}
              disabled={loading}
            />
            <button
              className="bg-gradient-to-r from-blue-500 to-purple-500 text-white px-5 py-2 rounded-full font-semibold shadow hover:scale-105 transition disabled:opacity-50"
              onClick={() => sendMessage(input)}
              disabled={loading || !input.trim()}
            >
              Gửi
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
