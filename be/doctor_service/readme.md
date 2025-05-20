# Tài liệu API cho Doctor Service

## Tổng quan

Hệ thống cung cấp các API quản lý hồ sơ bác sĩ, chẩn đoán, lịch hẹn, và các endpoint placeholder cho đơn thuốc, xét nghiệm. Các API được chia thành:

- **DoctorProfileViewSet** (`/doctors/`): CRUD hồ sơ bác sĩ.
- **DiagnosisViewSet** (`/diagnoses/`): CRUD chẩn đoán.
- **AppointmentViewSet** (`/appointments/`): Lấy và cập nhật lịch hẹn (tích hợp patient_service).
- **Placeholder** (`/prescriptions/`, `/lab_requests/`): Đánh dấu tính năng chưa triển khai.

---

## 1. API Hồ sơ Bác sĩ (`/doctors/`)

| HTTP Method | URL            | Chức năng                  | Yêu cầu xác thực |
| ----------- | -------------- | -------------------------- | ---------------- |
| GET         | /doctors/      | Lấy danh sách hồ sơ bác sĩ | Có               |
| GET         | /doctors/<pk>/ | Lấy chi tiết hồ sơ bác sĩ  | Có               |
| POST        | /doctors/      | Tạo hồ sơ bác sĩ mới       | Có               |
| PUT         | /doctors/<pk>/ | Cập nhật toàn bộ hồ sơ     | Có               |
| PATCH       | /doctors/<pk>/ | Cập nhật một phần hồ sơ    | Có               |
| DELETE      | /doctors/<pk>/ | Xóa hồ sơ bác sĩ           | Có (admin)       |

- **Quyền truy cập:** Admin xem tất cả, bác sĩ chỉ xem/sửa hồ sơ của mình.
- **Dữ liệu:**
  - `user_id`, `specialty`, `clinic`, `schedule`, `created_at`, `updated_at`
  - `created_at`, `updated_at`: chỉ đọc.
- **Validation:**
  - `user_id` kiểm tra qua user_service (phải là doctor hoặc admin).

**Ví dụ tạo hồ sơ:**

```bash
curl -X POST http://your-api/doctors/ \
-H "Authorization: Bearer <your-token>" \
-H "Content-Type: application/json" \
-d '{"user_id": 1, "specialty": "Cardiology", "clinic": "City Hospital", "schedule": "Mon-Fri 9AM-5PM"}'
```

---

## 2. API Chẩn đoán (`/diagnoses/`)

| HTTP Method | URL              | Chức năng                   | Yêu cầu xác thực |
| ----------- | ---------------- | --------------------------- | ---------------- |
| GET         | /diagnoses/      | Lấy danh sách chẩn đoán     | Có               |
| GET         | /diagnoses/<pk>/ | Lấy chi tiết chẩn đoán      | Có               |
| POST        | /diagnoses/      | Tạo chẩn đoán mới           | Có               |
| PUT         | /diagnoses/<pk>/ | Cập nhật toàn bộ chẩn đoán  | Có               |
| PATCH       | /diagnoses/<pk>/ | Cập nhật một phần chẩn đoán | Có               |
| DELETE      | /diagnoses/<pk>/ | Xóa chẩn đoán               | Có (admin)       |

- **Quyền truy cập:** Admin xem tất cả, bác sĩ chỉ xem/sửa chẩn đoán của mình.
- **Dữ liệu:**
  - `id`, `patient_id`, `doctor`, `diagnosis_date`, `description`, `created_at`, `updated_at`
  - `id`, `created_at`, `updated_at`: chỉ đọc.
- **Validation:**
  - `patient_id` kiểm tra qua patient_service.

**Ví dụ tạo chẩn đoán:**

```bash
curl -X POST http://your-api/diagnoses/ \
-H "Authorization: Bearer <your-token>" \
-H "Content-Type: application/json" \
-d '{"patient_id": 1, "description": "Hypertension", "diagnosis_date": "2025-05-20"}'
```

---

## 3. API Lịch hẹn (`/appointments/`)

| HTTP Method | URL                               | Chức năng                    | Yêu cầu xác thực |
| ----------- | --------------------------------- | ---------------------------- | ---------------- |
| GET         | /appointments/                    | Lấy danh sách lịch hẹn       | Có               |
| PUT         | /appointments/<pk>/update-status/ | Cập nhật trạng thái lịch hẹn | Có               |

- **Dữ liệu:**
  - GET: Trả về danh sách lịch hẹn từ patient_service.
  - PUT: Nhận JSON `{ "status": "confirmed" | "cancelled" }`, trả về thông tin cập nhật từ patient_service.
- **Lưu ý:**
  - Token xác thực được truyền sang patient_service.

**Ví dụ lấy lịch hẹn:**

```bash
curl -X GET http://your-api/appointments/ \
-H "Authorization: Bearer <your-token>"
```

**Ví dụ cập nhật trạng thái:**

```bash
curl -X PUT http://your-api/appointments/1/update-status/ \
-H "Authorization: Bearer <your-token>" \
-H "Content-Type: application/json" \
-d '{"status": "confirmed"}'
```

---

## 4. API Placeholder

| HTTP Method | URL             | Chức năng              | Trạng thái          |
| ----------- | --------------- | ---------------------- | ------------------- |
| GET/POST... | /prescriptions/ | Placeholder đơn thuốc  | 501 Not Implemented |
| GET/POST... | /lab_requests/  | Placeholder xét nghiệm | 501 Not Implemented |

- **Trả về:** `{ "detail": "Not implemented yet" }`

---

## Tổng kết

- **Tổng số endpoint:** 15
- **Chức năng chính:**
  - Quản lý hồ sơ bác sĩ, chẩn đoán, lịch hẹn.
  - Placeholder cho đơn thuốc, xét nghiệm.

### Cách sử dụng chung

- **Xác thực:**
  - Tất cả API (trừ placeholder) yêu cầu header `Authorization: Bearer <token>`.
- **Base URL:**
  - Ví dụ: `http://your-api/doctors/`
- **Định dạng dữ liệu:**
  - Đầu vào/ra: JSON.
- **Lỗi phổ biến:**
  - 401 (Unauthorized), 403 (Forbidden), 400 (Bad Request), 500 (Server Error).

### Lưu ý triển khai

- Đảm bảo cấu hình đúng `settings.PATIENT_SERVICE_URL` và `settings.USER_SERVICE_URL`.
- Xử lý lỗi khi gọi dịch vụ ngoài (patient_service, user_service).
- Truyền token qua HTTPS.
- Timeout mặc định khi gọi dịch vụ ngoài: 5 giây (có thể điều chỉnh).
