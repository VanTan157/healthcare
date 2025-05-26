# Pharmacy Service API Documentation

Dưới đây là tài liệu chi tiết các API của `pharmacy_service`, bao gồm endpoint và ví dụ sử dụng.

---

## 1. PrescriptionViewSet APIs

### 1.1. Lấy danh sách tất cả đơn thuốc

- **Phương thức:** `GET`
- **URL:** `/api/prescriptions/`
- **Mô tả:** Trả về danh sách tất cả đơn thuốc trong hệ thống.

**Ví dụ:**

```bash
curl http://localhost:8080/api/prescriptions/
```

**Phản hồi mẫu:**

```json
[
  {
    "id": 1,
    "patient_id": 1,
    "doctor_id": 1,
    "diagnosis_id": 1,
    "details": "Paracetamol 500mg, 2 tablets daily",
    "status": "pending",
    "created_at": "2025-05-21T02:24:00Z",
    "updated_at": "2025-05-21T02:24:00Z"
  }
]
```

---

### 1.2. Lấy chi tiết một đơn thuốc

- **Phương thức:** `GET`
- **URL:** `/api/prescriptions/{id}/`
- **Mô tả:** Trả về thông tin chi tiết của một đơn thuốc theo `id`.

**Ví dụ:**

```bash
curl http://localhost:8080/api/prescriptions/1/
```

**Phản hồi mẫu:**

```json
{
  "id": 1,
  "patient_id": 1,
  "doctor_id": 1,
  "diagnosis_id": 1,
  "details": "Paracetamol 500mg, 2 tablets daily",
  "status": "pending",
  "created_at": "2025-05-21T02:24:00Z",
  "updated_at": "2025-05-21T02:24:00Z"
}
```

---

### 1.3. Tạo đơn thuốc

- **Phương thức:** `POST`
- **URL:** `/api/prescriptions/`
- **Mô tả:** Tạo một đơn thuốc mới.

**Body mẫu:**

```json
{
  "patient_id": 1,
  "doctor_id": 1,
  "diagnosis_id": 1,
  "details": "Paracetamol 500mg, 2 tablets daily",
  "status": "pending"
}
```

**Ví dụ:**

```bash
curl -X POST http://localhost:8080/api/prescriptions/ \
    -H "Content-Type: application/json" \
    -d '{"patient_id": 1, "doctor_id": 1, "diagnosis_id": 1, "details": "Paracetamol 500mg, 2 tablets daily", "status": "pending"}'
```

**Phản hồi mẫu:**

```json
{
  "id": 2,
  "patient_id": 1,
  "doctor_id": 1,
  "diagnosis_id": 1,
  "details": "Paracetamol 500mg, 2 tablets daily",
  "status": "pending",
  "created_at": "2025-05-21T02:24:00Z",
  "updated_at": "2025-05-21T02:24:00Z"
}
```

---

### 1.4. Cập nhật toàn bộ đơn thuốc

- **Phương thức:** `PUT`
- **URL:** `/api/prescriptions/{id}/`
- **Mô tả:** Chỉ cho phép cập nhật trường `status`.

**Body mẫu:**

```json
{
  "status": "dispensed"
}
```

**Ví dụ:**

```bash
curl -X PUT http://localhost:8080/api/prescriptions/1/ \
    -H "Content-Type: application/json" \
    -d '{"status": "dispensed"}'
```

**Phản hồi mẫu:**

```json
{
  "id": 1,
  "patient_id": 1,
  "doctor_id": 1,
  "diagnosis_id": 1,
  "details": "Paracetamol 500mg, 2 tablets daily",
  "status": "dispensed",
  "created_at": "2025-05-21T02:24:00Z",
  "updated_at": "2025-05-21T02:25:00Z"
}
```

---

### 1.5. Cập nhật một phần đơn thuốc

- **Phương thức:** `PATCH`
- **URL:** `/api/prescriptions/{id}/`
- **Mô tả:** Chỉ cho phép cập nhật trường `status`.

**Body mẫu:**

```json
{
  "status": "cancelled"
}
```

**Ví dụ:**

```bash
curl -X PATCH http://localhost:8080/api/prescriptions/1/ \
    -H "Content-Type: application/json" \
    -d '{"status": "cancelled"}'
```

---

### 1.6. Xóa đơn thuốc

- **Phương thức:** `DELETE`
- **URL:** `/api/prescriptions/{id}/`
- **Mô tả:** Xóa một đơn thuốc dựa trên `id`.

**Ví dụ:**

```bash
curl -X DELETE http://localhost:8080/api/prescriptions/1/
```

**Phản hồi:** Mã trạng thái 204 (No Content).

---

### 1.7. Lấy danh sách đơn thuốc theo `diagnosis_id` (mới)

- **Phương thức:** `GET`
- **URL:** `/api/prescriptions/by_diagnosisId/{diagnosis_id}/`
- **Mô tả:** Trả về danh sách đơn thuốc liên quan đến một `diagnosis_id`.

**Ví dụ:**

```bash
curl http://localhost:8080/api/prescriptions/by_diagnosisId/1/
```

**Phản hồi mẫu:**

```json
[
  {
    "id": 1,
    "patient_id": 1,
    "doctor_id": 1,
    "diagnosis_id": 1,
    "details": "Paracetamol 500mg, 2 tablets daily",
    "status": "pending",
    "created_at": "2025-05-21T02:24:00Z",
    "updated_at": "2025-05-21T02:24:00Z"
  }
]
```

**Lỗi mẫu (nếu không tìm thấy):**

```json
{
  "detail": "No prescriptions found for diagnosis_id 1"
}
```

---

## 2. MedicineViewSet APIs

### 2.1. Lấy danh sách tất cả thuốc

- **Phương thức:** `GET`
- **URL:** `/api/medicines/`
- **Mô tả:** Trả về danh sách tất cả thuốc trong kho.

**Ví dụ:**

```bash
curl http://localhost:8080/api/medicines/
```

**Phản hồi mẫu:**

```json
[
  {
    "id": 1,
    "name": "Paracetamol",
    "description": "Pain reliever",
    "quantity": 100,
    "price": 10.0,
    "created_at": "2025-05-21T02:24:00Z",
    "updated_at": "2025-05-21T02:24:00Z"
  }
]
```

---

### 2.2. Lấy chi tiết một thuốc

- **Phương thức:** `GET`
- **URL:** `/api/medicines/{id}/`
- **Mô tả:** Trả về thông tin chi tiết của một thuốc theo `id`.

**Ví dụ:**

```bash
curl http://localhost:8080/api/medicines/1/
```

---

### 2.3. Tạo thuốc

- **Phương thức:** `POST`
- **URL:** `/api/medicines/`
- **Mô tả:** Tạo một thuốc mới trong kho.

**Body mẫu:**

```json
{
  "name": "Ibuprofen",
  "description": "Anti-inflammatory",
  "quantity": 50,
  "price": 15.0
}
```

**Ví dụ:**

```bash
curl -X POST http://localhost:8080/api/medicines/ \
    -H "Content-Type: application/json" \
    -d '{"name": "Ibuprofen", "description": "Anti-inflammatory", "quantity": 50, "price": 15.00}'
```

---

### 2.4. Cập nhật toàn bộ thuốc

- **Phương thức:** `PUT`
- **URL:** `/api/medicines/{id}/`
- **Mô tả:** Cập nhật toàn bộ thông tin của một thuốc.

**Body mẫu:**

```json
{
  "name": "Ibuprofen",
  "description": "Anti-inflammatory",
  "quantity": 60,
  "price": 16.0
}
```

**Ví dụ:**

```bash
curl -X PUT http://localhost:8080/api/medicines/1/ \
    -H "Content-Type: application/json" \
    -d '{"name": "Ibuprofen", "description": "Anti-inflammatory", "quantity": 60, "price": 16.00}'
```

---

### 2.5. Cập nhật một phần thuốc

- **Phương thức:** `PATCH`
- **URL:** `/api/medicines/{id}/`
- **Mô tả:** Cập nhật một phần thông tin của thuốc.

**Body mẫu:**

```json
{
  "quantity": 70
}
```

**Ví dụ:**

```bash
curl -X PATCH http://localhost:8080/api/medicines/1/ \
    -H "Content-Type: application/json" \
    -d '{"quantity": 70}'
```

---

### 2.6. Xóa thuốc

- **Phương thức:** `DELETE`
- **URL:** `/api/medicines/{id}/`
- **Mô tả:** Xóa một thuốc khỏi kho.

**Ví dụ:**

```bash
curl -X DELETE http://localhost:8080/api/medicines/1/
```

---
