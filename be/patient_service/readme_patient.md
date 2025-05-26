# Patient Service API Documentation

## 1. PatientProfileViewSet API

**Base URL:** `/api/patients/`

### Endpoints

| Method | Endpoint              | Chức năng                                                                | Quyền truy cập  |
| ------ | --------------------- | ------------------------------------------------------------------------ | --------------- |
| GET    | `/api/patients/`      | Lấy danh sách hồ sơ bệnh nhân (admin: tất cả, bệnh nhân: của chính mình) | IsAuthenticated |
| GET    | `/api/patients/{id}/` | Lấy chi tiết hồ sơ bệnh nhân theo id (admin hoặc chủ sở hữu)             | IsAuthenticated |
| POST   | `/api/patients/`      | Tạo hồ sơ bệnh nhân mới (user_id khớp với người dùng xác thực)           | IsAuthenticated |
| PUT    | `/api/patients/{id}/` | Cập nhật toàn bộ hồ sơ bệnh nhân (admin hoặc chủ sở hữu)                 | IsAuthenticated |
| PATCH  | `/api/patients/{id}/` | Cập nhật một phần hồ sơ bệnh nhân (ví dụ: địa chỉ)                       | IsAuthenticated |
| DELETE | `/api/patients/{id}/` | Xóa hồ sơ bệnh nhân (admin hoặc chủ sở hữu)                              | IsAuthenticated |

---

## 2. AppointmentViewSet API

**Base URL:** `/api/appointments/`

### Endpoints

| Method | Endpoint                  | Chức năng                                                         | Quyền truy cập  |
| ------ | ------------------------- | ----------------------------------------------------------------- | --------------- |
| GET    | `/api/appointments/`      | Lấy danh sách lịch hẹn (admin: tất cả, bệnh nhân: của chính mình) | IsAuthenticated |
| GET    | `/api/appointments/{id}/` | Lấy chi tiết lịch hẹn theo id (admin hoặc bệnh nhân liên quan)    | IsAuthenticated |
| POST   | `/api/appointments/`      | Tạo lịch hẹn mới (patient tự động gán theo user_id xác thực)      | IsAuthenticated |
| PUT    | `/api/appointments/{id}/` | Cập nhật toàn bộ lịch hẹn (admin hoặc bệnh nhân liên quan)        | IsAuthenticated |
| PATCH  | `/api/appointments/{id}/` | Cập nhật một phần lịch hẹn (ví dụ: lý do)                         | IsAuthenticated |
| DELETE | `/api/appointments/{id}/` | Xóa lịch hẹn (admin hoặc bệnh nhân liên quan)                     | IsAuthenticated |

---

## 3. Placeholder Endpoints

| Method   | Endpoint              | Chức năng       | Response                   |
| -------- | --------------------- | --------------- | -------------------------- |
| GET/POST | `/api/prescriptions/` | Chưa triển khai | 501, "Not implemented yet" |
| GET/POST | `/api/bills/`         | Chưa triển khai | 501, "Not implemented yet" |

---

## Hướng dẫn gọi API qua Postman

**Base URL:** `http://localhost:8000`

**Xác thực:** JWT

### Thiết lập chung

- **Header xác thực:**  
   `Authorization: Bearer <your_jwt_token>`
- **Content-Type:**  
   `application/json` (cho POST/PUT/PATCH)

---

### 1. PatientProfile API

#### Lấy danh sách hồ sơ bệnh nhân

```
GET /api/patients/
Authorization: Bearer <your_jwt_token>
```

**Response:**

```json
[
  {
    "user_id": 1,
    "date_of_birth": "1990-01-01",
    "address": "123 Đường ABC, Hà Nội",
    "medical_history": "Tiểu đường",
    "created_at": "2025-05-19T05:38:00Z",
    "updated_at": "2025-05-19T05:38:00Z"
  }
]
```

#### Tạo hồ sơ bệnh nhân

```
POST /api/patients/
Authorization: Bearer <your_jwt_token>
Content-Type: application/json
```

**Body:**

```json
{
  "user_id": 1,
  "date_of_birth": "1990-01-01",
  "address": "123 Đường ABC, Hà Nội",
  "medical_history": "Tiểu đường"
}
```

**Response:**

```json
{
  "user_id": 1,
  "date_of_birth": "1990-01-01",
  "address": "123 Đường ABC, Hà Nội",
  "medical_history": "Tiểu đường",
  "created_at": "2025-05-19T05:38:00Z",
  "updated_at": "2025-05-19T05:38:00Z"
}
```

#### Cập nhật toàn bộ hồ sơ

```
PUT /api/patients/1/
Authorization: Bearer <your_jwt_token>
Content-Type: application/json
```

**Body:**

```json
{
  "user_id": 1,
  "date_of_birth": "1990-01-01",
  "address": "456 Đường XYZ, Hà Nội",
  "medical_history": "Tiểu đường, cao huyết áp"
}
```

**Response:** Tương tự như POST.

#### Xóa hồ sơ

```
DELETE /api/patients/1/
Authorization: Bearer <your_jwt_token>
```

**Response:** 204 No Content

---

### 2. Appointment API

#### Lấy danh sách lịch hẹn

```
GET /api/appointments/
Authorization: Bearer <your_jwt_token>
```

**Response:**

```json
[
  {
    "id": 1,
    "patient": 1,
    "doctor_id": 2,
    "appointment_date": "2025-05-20T10:00:00Z",
    "reason": "Khám định kỳ",
    "status": "pending",
    "created_at": "2025-05-19T05:38:00Z",
    "updated_at": "2025-05-19T05:38:00Z"
  }
]
```

#### Tạo lịch hẹn

```
POST /api/appointments/
Authorization: Bearer <your_jwt_token>
Content-Type: application/json
```

**Body:**

```json
{
  "patient": 1,
  "doctor_id": 2,
  "appointment_date": "2025-05-20T10:00:00Z",
  "reason": "Khám định kỳ"
}
```

**Response:**

```json
{
  "id": 1,
  "patient": 1,
  "doctor_id": 2,
  "appointment_date": "2025-05-20T10:00:00Z",
  "reason": "Khám định kỳ",
  "status": "pending",
  "created_at": "2025-05-19T05:38:00Z",
  "updated_at": "2025-05-19T05:38:00Z"
}
```

#### Cập nhật một phần lịch hẹn

```
PATCH /api/appointments/1/
Authorization: Bearer <your_jwt_token>
Content-Type: application/json
```

**Body:**

```json
{
  "reason": "Khám bệnh tim"
}
```

**Response:** Tương tự như POST.

#### Xóa lịch hẹn

```
DELETE /api/appointments/1/
Authorization: Bearer <your_jwt_token>
```

**Response:** 204 No Content

---

### 3. Placeholder Endpoints

```
GET /api/prescriptions/
GET /api/bills/
Authorization: Bearer <your_jwt_token>
```

**Response:**

```json
{
  "detail": "Not implemented yet"
}
```

**Status code:** 501
