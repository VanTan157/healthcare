# Healthcare System - Doctor Service API Documentation

## 1. DoctorProfileViewSet APIs

Các API liên quan đến hồ sơ bác sĩ (`DoctorProfile`).

### 1.1. Lấy danh sách tất cả hồ sơ bác sĩ

- **Phương thức:** `GET`
- **URL:** `/api/doctors/`
- **Mô tả:** Trả về danh sách tất cả các hồ sơ bác sĩ trong hệ thống.

**Ví dụ sử dụng:**

```bash
curl http://localhost:8080/api/doctors/
```

**Phản hồi mẫu:**

```json
[
  {
    "id": 1,
    "user_id": 1,
    "specialty": "Nội khoa",
    "clinic": "Bệnh viện A",
    "schedule": "Mon-Fri, 9AM-5PM",
    "created_at": "2025-05-20T15:48:00Z",
    "updated_at": "2025-05-20T15:48:00Z"
  }
]
```

> **Lưu ý:** Nên cân nhắc giới hạn quyền truy cập nếu thông tin nhạy cảm.

---

### 1.2. Lấy chi tiết một hồ sơ bác sĩ

- **Phương thức:** `GET`
- **URL:** `/api/doctors/{id}/`
- **Mô tả:** Trả về thông tin chi tiết của một hồ sơ bác sĩ dựa trên `id`.

**Ví dụ sử dụng:**

```bash
curl http://localhost:8080/api/doctors/1/
```

**Phản hồi mẫu:**

```json
{
  "id": 1,
  "user_id": 1,
  "specialty": "Nội khoa",
  "clinic": "Bệnh viện A",
  "schedule": "Mon-Fri, 9AM-5PM",
  "created_at": "2025-05-20T15:48:00Z",
  "updated_at": "2025-05-20T15:48:00Z"
}
```

---

### 1.3. Tạo hồ sơ bác sĩ

- **Phương thức:** `POST`
- **URL:** `/api/doctors/`
- **Mô tả:** Tạo một hồ sơ bác sĩ mới.

**Body mẫu:**

```json
{
  "user_id": 3,
  "specialty": "Nhi khoa",
  "clinic": "Bệnh viện C",
  "schedule": "Mon-Sat, 10AM-6PM"
}
```

**Ví dụ sử dụng:**

```bash
curl -X POST http://localhost:8080/api/doctors/ \
-H "Content-Type: application/json" \
-d '{"user_id": 3, "specialty": "Nhi khoa", "clinic": "Bệnh viện C", "schedule": "Mon-Sat, 10AM-6PM"}'
```

**Phản hồi mẫu:**

```json
{
  "id": 3,
  "user_id": 3,
  "specialty": "Nhi khoa",
  "clinic": "Bệnh viện C",
  "schedule": "Mon-Sat, 10AM-6PM",
  "created_at": "2025-05-21T01:54:00Z",
  "updated_at": "2025-05-21T01:54:00Z"
}
```

> **Lưu ý:** Nên xác thực và kiểm tra `user_id` với `user_service`.

---

### 1.4. Cập nhật toàn bộ hồ sơ bác sĩ

- **Phương thức:** `PUT`
- **URL:** `/api/doctors/{id}/`
- **Mô tả:** Cập nhật toàn bộ thông tin hồ sơ bác sĩ dựa trên `id`.

**Body mẫu:**

```json
{
  "user_id": 1,
  "specialty": "Nội khoa",
  "clinic": "Bệnh viện D",
  "schedule": "Mon-Fri, 8AM-4PM"
}
```

**Ví dụ sử dụng:**

```bash
curl -X PUT http://localhost:8080/api/doctors/1/ \
-H "Content-Type: application/json" \
-d '{"user_id": 1, "specialty": "Nội khoa", "clinic": "Bệnh viện D", "schedule": "Mon-Fri, 8AM-4PM"}'
```

**Phản hồi mẫu:**

```json
{
  "id": 1,
  "user_id": 1,
  "specialty": "Nội khoa",
  "clinic": "Bệnh viện D",
  "schedule": "Mon-Fri, 8AM-4PM",
  "created_at": "2025-05-20T15:48:00Z",
  "updated_at": "2025-05-21T01:54:00Z"
}
```

---

### 1.5. Cập nhật một phần hồ sơ bác sĩ

- **Phương thức:** `PATCH`
- **URL:** `/api/doctors/{id}/`
- **Mô tả:** Cập nhật một phần thông tin hồ sơ bác sĩ dựa trên `id`.

**Body mẫu:**

```json
{
  "schedule": "Mon-Fri, 7AM-3PM"
}
```

**Ví dụ sử dụng:**

```bash
curl -X PATCH http://localhost:8080/api/doctors/1/ \
-H "Content-Type: application/json" \
-d '{"schedule": "Mon-Fri, 7AM-3PM"}'
```

**Phản hồi mẫu:**

```json
{
  "id": 1,
  "user_id": 1,
  "specialty": "Nội khoa",
  "clinic": "Bệnh viện A",
  "schedule": "Mon-Fri, 7AM-3PM",
  "created_at": "2025-05-20T15:48:00Z",
  "updated_at": "2025-05-21T01:54:00Z"
}
```

---

### 1.6. Xóa hồ sơ bác sĩ

- **Phương thức:** `DELETE`
- **URL:** `/api/doctors/{id}/`
- **Mô tả:** Xóa một hồ sơ bác sĩ dựa trên `id`.

**Ví dụ sử dụng:**

```bash
curl -X DELETE http://localhost:8080/api/doctors/1/
```

**Phản hồi:** Mã trạng thái `204 No Content` nếu thành công.

---

### 1.7. Lấy hoặc cập nhật hồ sơ bác sĩ theo user_id

- **Phương thức:** `GET`, `PUT`, `PATCH`
- **URL:** `/api/doctors/user/{user_id}/`
- **Mô tả:** Lấy hoặc cập nhật hồ sơ bác sĩ dựa trên `user_id`.

**Ví dụ sử dụng:**

```bash
curl http://localhost:8080/api/doctors/user/1/
```

**Phản hồi mẫu:**

```json
{
  "id": 1,
  "user_id": 1,
  "specialty": "Nội khoa",
  "clinic": "Bệnh viện A",
  "schedule": "Mon-Fri, 9AM-5PM",
  "created_at": "2025-05-20T15:48:00Z",
  "updated_at": "2025-05-20T15:48:00Z"
}
```

**Cập nhật toàn bộ:**

```bash
curl -X PUT http://localhost:8080/api/doctors/user/1/ \
-H "Content-Type: application/json" \
-d '{"user_id": 1, "specialty": "Nội khoa", "clinic": "Bệnh viện D", "schedule": "Mon-Fri, 8AM-4PM"}'
```

**Cập nhật một phần:**

```bash
curl -X PATCH http://localhost:8080/api/doctors/user/1/ \
-H "Content-Type: application/json" \
-d '{"schedule": "Mon-Fri, 7AM-3PM"}'
```

---

## 2. DiagnosisViewSet APIs

Các API liên quan đến chuẩn đoán (`Diagnosis`).

### 2.1. Lấy danh sách tất cả chuẩn đoán

- **Phương thức:** `GET`
- **URL:** `/api/diagnoses/`
- **Mô tả:** Trả về danh sách tất cả chuẩn đoán (lọc theo vai trò người dùng).

**Ví dụ sử dụng:**

```bash
curl http://localhost:8080/api/diagnoses/
```

**Phản hồi mẫu:**

```json
[
  {
    "id": 1,
    "patient_id": 1,
    "doctor": 1,
    "diagnosis_date": "2025-05-20T15:48:00Z",
    "description": "Flu diagnosis",
    "created_at": "2025-05-20T15:48:00Z",
    "updated_at": "2025-05-20T15:48:00Z"
  }
]
```

> **Lưu ý:** Nên giới hạn quyền truy cập để bảo vệ thông tin nhạy cảm.

---

### 2.2. Lấy chi tiết một chuẩn đoán

- **Phương thức:** `GET`
- **URL:** `/api/diagnoses/{id}/`
- **Mô tả:** Trả về thông tin chi tiết của một chuẩn đoán dựa trên `id`.

**Ví dụ sử dụng:**

```bash
curl http://localhost:8080/api/diagnoses/1/
```

**Phản hồi mẫu:**

```json
{
  "id": 1,
  "patient_id": 1,
  "doctor": 1,
  "diagnosis_date": "2025-05-20T15:48:00Z",
  "description": "Flu diagnosis",
  "created_at": "2025-05-20T15:48:00Z",
  "updated_at": "2025-05-20T15:48:00Z"
}
```

---

### 2.3. Tạo chuẩn đoán

- **Phương thức:** `POST`
- **URL:** `/api/diagnoses/`
- **Mô tả:** Tạo một chuẩn đoán mới.

**Body mẫu:**

```json
{
  "patient_id": 1,
  "doctor": 1,
  "diagnosis_date": "2025-05-21T10:00:00Z",
  "description": "New diagnosis"
}
```

**Ví dụ sử dụng:**

```bash
curl -X POST http://localhost:8080/api/diagnoses/ \
-H "Content-Type: application/json" \
-d '{"patient_id": 1, "doctor": 1, "diagnosis_date": "2025-05-21T10:00:00Z", "description": "New diagnosis"}'
```

**Phản hồi mẫu:**

```json
{
  "id": 3,
  "patient_id": 1,
  "doctor": 1,
  "diagnosis_date": "2025-05-21T10:00:00Z",
  "description": "New diagnosis",
  "created_at": "2025-05-21T01:54:00Z",
  "updated_at": "2025-05-21T01:54:00Z"
}
```

> **Lưu ý:** Nên kiểm tra `patient_id` với `patient_service`.

---

### 2.4. Cập nhật toàn bộ chuẩn đoán

- **Phương thức:** `PUT`
- **URL:** `/api/diagnoses/{id}/`
- **Mô tả:** Cập nhật toàn bộ thông tin của một chuẩn đoán.

**Body mẫu:**

```json
{
  "patient_id": 1,
  "doctor": 1,
  "diagnosis_date": "2025-05-21T10:00:00Z",
  "description": "Updated diagnosis"
}
```

**Ví dụ sử dụng:**

```bash
curl -X PUT http://localhost:8080/api/diagnoses/1/ \
-H "Content-Type: application/json" \
-d '{"patient_id": 1, "doctor": 1, "diagnosis_date": "2025-05-21T10:00:00Z", "description": "Updated diagnosis"}'
```

---

### 2.5. Cập nhật một phần chuẩn đoán

- **Phương thức:** `PATCH`
- **URL:** `/api/diagnoses/{id}/`
- **Mô tả:** Cập nhật một phần thông tin của chuẩn đoán.

**Body mẫu:**

```json
{
  "description": "Partially updated diagnosis"
}
```

**Ví dụ sử dụng:**

```bash
curl -X PATCH http://localhost:8080/api/diagnoses/1/ \
-H "Content-Type: application/json" \
-d '{"description": "Partially updated diagnosis"}'
```

---

### 2.6. Xóa chuẩn đoán

- **Phương thức:** `DELETE`
- **URL:** `/api/diagnoses/{id}/`
- **Mô tả:** Xóa một chuẩn đoán dựa trên `id`.

**Ví dụ sử dụng:**

```bash
curl -X DELETE http://localhost:8080/api/diagnoses/1/
```

**Phản hồi:** Mã trạng thái `204 No Content`.

---

### 2.7. Lấy danh sách chuẩn đoán theo patient_id

- **Phương thức:** `GET`
- **URL:** `/api/diagnoses/by_patientId/{patient_id}/`
- **Mô tả:** Trả về danh sách tất cả chuẩn đoán liên quan đến một `patient_id`.

**Ví dụ sử dụng:**

```bash
curl http://localhost:8080/api/diagnoses/by_patientId/1/
```

**Phản hồi mẫu:**

```json
[
  {
    "id": 1,
    "patient_id": 1,
    "doctor": 1,
    "diagnosis_date": "2025-05-20T15:48:00Z",
    "description": "Flu diagnosis",
    "created_at": "2025-05-20T15:48:00Z",
    "updated_at": "2025-05-20T15:48:00Z"
  }
]
```

**Lỗi mẫu:**

```json
{
  "detail": "No diagnoses found for patient_id 1"
}
```

---

## 3. AppointmentViewSet APIs

Các API liên quan đến lịch hẹn (gọi đến `patient_service`).

### 3.1. Lấy danh sách lịch hẹn của bác sĩ

- **Phương thức:** `GET`
- **URL:** `/api/appointments/`
- **Mô tả:** Lấy danh sách lịch hẹn của bác sĩ từ `patient_service` dựa trên `doctor_id`.

- **Header:** `Authorization: Bearer <your_jwt_token>`

**Ví dụ sử dụng:**

```bash
curl http://localhost:8080/api/appointments/ \
-H "Authorization: Bearer <your_jwt_token>"
```

**Phản hồi mẫu:**

```json
[
  {
    "id": 1,
    "patient": 1,
    "doctor_id": 1,
    "appointment_date": "2025-05-21T10:00:00Z",
    "reason": "Checkup",
    "status": "pending",
    "created_at": "2025-05-20T15:48:00Z",
    "updated_at": "2025-05-20T15:48:00Z"
  }
]
```

**Lỗi mẫu:**

```json
{
  "detail": "Unable to fetch appointments"
}
```

---

### 3.2. Cập nhật trạng thái lịch hẹn

- **Phương thức:** `PUT`
- **URL:** `/api/appointments/{pk}/update-status/`
- **Mô tả:** Cập nhật trạng thái của một lịch hẹn (ví dụ: `confirmed`, `cancelled`).

- **Header:** `Authorization: Bearer <your_jwt_token>`

**Body mẫu:**

```json
{
  "status": "confirmed"
}
```

**Ví dụ sử dụng:**

```bash
curl -X PUT http://localhost:8080/api/appointments/1/update-status/ \
-H "Authorization: Bearer <your_jwt_token>" \
-H "Content-Type: application/json" \
-d '{"status": "confirmed"}'
```

**Phản hồi mẫu:**

```json
{
  "id": 1,
  "patient": 1,
  "doctor_id": 1,
  "appointment_date": "2025-05-21T10:00:00Z",
  "reason": "Checkup",
  "status": "confirmed",
  "created_at": "2025-05-20T15:48:00Z",
  "updated_at": "2025-05-21T01:54:00Z"
}
```

---

## 4. Placeholder APIs

### 4.1. Prescriptions

- **Phương thức:** `GET`
- **URL:** `/api/prescriptions/`
- **Mô tả:** Chưa được triển khai, trả về thông báo `"Not implemented yet"`.
- **Quyền truy cập:** Không giới hạn

**Ví dụ sử dụng:**

```bash
curl http://localhost:8080/api/prescriptions/
```

**Phản hồi mẫu:**

```json
{
  "detail": "Not implemented yet"
}
```

---

### 4.2. Lab Requests

- **Phương thức:** `GET`
- **URL:** `/api/lab_requests/`
- **Mô tả:** Chưa được triển khai, trả về thông báo `"Not implemented yet"`.
- **Quyền truy cập:** Không giới hạn

**Ví dụ sử dụng:**

```bash
curl http://localhost:8080/api/lab_requests/
```

**Phản hồi mẫu:**

```json
{
  "detail": "Not implemented yet"
}
```

---

## Tóm tắt các API

| API                              | Phương thức     | URL                                       | Mô tả                                                | Quyền          |
| -------------------------------- | --------------- | ----------------------------------------- | ---------------------------------------------------- | -------------- |
| Lấy danh sách bác sĩ             | GET             | /api/doctors/                             | Trả về tất cả hồ sơ bác sĩ                           | AllowAny       |
| Lấy chi tiết bác sĩ              | GET             | /api/doctors/{id}/                        | Lấy hồ sơ bác sĩ theo ID                             | AllowAny       |
| Tạo bác sĩ                       | POST            | /api/doctors/                             | Tạo hồ sơ bác sĩ mới                                 | AllowAny       |
| Cập nhật bác sĩ (toàn bộ)        | PUT             | /api/doctors/{id}/                        | Cập nhật toàn bộ hồ sơ bác sĩ                        | AllowAny       |
| Cập nhật bác sĩ (một phần)       | PATCH           | /api/doctors/{id}/                        | Cập nhật một phần hồ sơ bác sĩ                       | AllowAny       |
| Xóa bác sĩ                       | DELETE          | /api/doctors/{id}/                        | Xóa hồ sơ bác sĩ                                     | AllowAny       |
| Lấy/cập nhật bác sĩ theo user_id | GET, PUT, PATCH | /api/doctors/user/{user_id}/              | Lấy hoặc cập nhật hồ sơ bác sĩ theo user_id          | AllowAny       |
| Lấy danh sách chuẩn đoán         | GET             | /api/diagnoses/                           | Trả về danh sách chuẩn đoán (lọc theo role)          | AllowAny       |
| Lấy chi tiết chuẩn đoán          | GET             | /api/diagnoses/{id}/                      | Lấy chi tiết một chuẩn đoán                          | AllowAny       |
| Tạo chuẩn đoán                   | POST            | /api/diagnoses/                           | Tạo chuẩn đoán mới                                   | AllowAny       |
| Cập nhật chuẩn đoán (toàn bộ)    | PUT             | /api/diagnoses/{id}/                      | Cập nhật toàn bộ chuẩn đoán                          | AllowAny       |
| Cập nhật chuẩn đoán (một phần)   | PATCH           | /api/diagnoses/{id}/                      | Cập nhật một phần chuẩn đoán                         | AllowAny       |
| Xóa chuẩn đoán                   | DELETE          | /api/diagnoses/{id}/                      | Xóa một chuẩn đoán                                   | AllowAny       |
| Lấy chuẩn đoán theo patient_id   | GET             | /api/diagnoses/by_patientId/{patient_id}/ | Lấy danh sách chuẩn đoán của một bệnh nhân           | AllowAny       |
| Lấy danh sách lịch hẹn           | GET             | /api/appointments/                        | Lấy danh sách lịch hẹn của bác sĩ từ patient_service | AllowAny       |
| Cập nhật trạng thái lịch hẹn     | PUT             | /api/appointments/{pk}/update-status/     | Cập nhật trạng thái lịch hẹn                         | AllowAny       |
| Prescriptions (chưa triển khai)  | GET             | /api/prescriptions/                       | Placeholder, chưa triển khai                         | Không giới hạn |
| Lab Requests (chưa triển khai)   | GET             | /api/lab_requests/                        | Placeholder, chưa triển khai                         | Không giới hạn |
