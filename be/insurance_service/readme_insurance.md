# Tài liệu API cho Dịch vụ Bảo hiểm

ts/

## 1. API Hợp đồng Bảo hiểm (InsuranceContract)nt:

ts/
**Base URL:** `http://localhost:8080/api/insurance_contracts/`ểm.
ON.

### Các endpointdụ:

ash

#### Lấy danh sách tất cả hợp đồng bảo hiểm

- **GET** `/api/insurance_contracts/`
- **Mô tả:** Lấy danh sách tất cả các hợp đồng bảo hiểm.
- **Response:** Danh sách các InsuranceContract (JSON).

**Ví dụ:**

```bash
curl http://localhost:8080/api/insurance_contracts/
```

**Response mẫu:**

```json
[
  {
    "id": 1,
    "patient_id": 101,
    "policy_number": "POL123456",
    "provider": "ABC Insurance",
    "start_date": "2025-01-01",
    "end_date": "2025-12-31",
    "details": "Full coverage plan",
    "created_at": "2025-05-22T01:04:00Z",
    "updated_at": "2025-05-22T01:04:00Z"
  }
]
```

#### Lấy chi tiết hợp đồng bảo hiểm theo ID

- **GET** `/api/insurance_contracts/{id}/`
- **Mô tả:** Lấy thông tin chi tiết của một hợp đồng bảo hiểm.
- **Response:** Thông tin chi tiết InsuranceContract.

**Ví dụ:**

```bash
curl http://localhost:8080/api/insurance_contracts/1/
```

**Response mẫu:**

```json
{
  "id": 1,
  "patient_id": 101,
  "policy_number": "POL123456",
  "provider": "ABC Insurance",
  "start_date": "2025-01-01",
  "end_date": "2025-12-31",
  "details": "Full coverage plan",
  "created_at": "2025-05-22T01:04:00Z",
  "updated_at": "2025-05-22T01:04:00Z"
}
```

#### Tạo hợp đồng bảo hiểm mới

- **POST** `/api/insurance_contracts/`
- **Mô tả:** Tạo mới một hợp đồng bảo hiểm.
- **Body (JSON):**

```json
{
  "patient_id": 101,
  "policy_number": "POL123456",
  "provider": "ABC Insurance",
  "start_date": "2025-01-01",
  "end_date": "2025-12-31",
  "details": "Full coverage plan"
}
```

- **Response:** Thông tin InsuranceContract vừa tạo.

**Ví dụ:**

```bash
curl -X POST http://localhost:8080/api/insurance_contracts/ -H "Content-Type: application/json" -d '{"patient_id": 101, "policy_number": "POL123456", "provider": "ABC Insurance", "start_date": "2025-01-01", "end_date": "2025-12-31", "details": "Full coverage plan"}'
```

#### Cập nhật hợp đồng bảo hiểm

- **PUT/PATCH** `/api/insurance_contracts/{id}/`
- **Mô tả:** Cập nhật toàn bộ hoặc một phần thông tin hợp đồng bảo hiểm.
- **Body (ví dụ PATCH):**

```json
{
  "provider": "XYZ Insurance",
  "details": "Updated coverage plan"
}
```

- **Response:** Thông tin InsuranceContract đã cập nhật.

**Ví dụ:**

```bash
curl -X PATCH http://localhost:8080/api/insurance_contracts/1/ -H "Content-Type: application/json" -d '{"provider": "XYZ Insurance", "details": "Updated coverage plan"}'
```

#### Xóa hợp đồng bảo hiểm

- **DELETE** `/api/insurance_contracts/{id}/`
- **Mô tả:** Xóa hợp đồng bảo hiểm theo ID.

**Ví dụ:**

```bash
curl -X DELETE http://localhost:8080/api/insurance_contracts/1/
```

#### Lọc hợp đồng bảo hiểm theo bệnh nhân

- **GET** `/api/insurance_contracts/filter/?patient_id=...`
- **Mô tả:** Lấy danh sách hợp đồng bảo hiểm theo `patient_id`.
- **Query Parameters:** `patient_id` (bắt buộc)
- **Response:** Danh sách InsuranceContract phù hợp.

**Ví dụ:**

```bash
curl http://localhost:8080/api/insurance_contracts/filter/?patient_id=101
```

**Response mẫu:**

````json
[
    {
        "id": 1,
        "patient_id": 101,
        "policy_number": "POL123456",
        "provider": "ABC Insurance",
        "start_date": "2025-01-01",
        "end_date": "2025-12-31",
        "details": "Full coverage plan",
        "created_at": "2025-05-22T01:04:00Z",
        "updated_at": "2025-05-22T01:04:00Z" 2. API cho InsuranceClaim
    }t:8080/api/claims/
]
```ms/
Nếu không cung cấp `patient_id`:sách tất cả các yêu cầu bồi thường.
```bash
curl http://localhost:8080/api/insurance_contracts/filter/
````

**Response mẫu:**

```jsonCopy
{"detail": "patient_id is required"} http://localhost:8080/api/claims/
```

---

Copy

## 2. API Yêu cầu Bồi thường (InsuranceClaim)

**Base URL:** `http://localhost:8080/api/claims/`": 1,
1,

### Các endpoint

5-22T01:04:00Z",

#### Lấy danh sách tất cả yêu cầu bồi thường

- **GET** `/api/claims/`2T01:04:00Z",
- **Mô tả:** Lấy danh sách tất cả các yêu cầu bồi thường.
- **Response:** Danh sách InsuranceClaim.

**Ví dụ:**

````bashET /api/claims/{id}/
curl http://localhost:8080/api/claims/ột yêu cầu bồi thường theo id.
```ceClaim.
**Response mẫu:**
```json
[
    {Copy
        "id": 1, http://localhost:8080/api/claims/1/
        "contract": 1,
        "amount": 500.00,u cầu bồi thường mới.
        "claim_date": "2025-05-22T01:04:00Z",
        "description": "Hospitalization cost",
        "status": "pending",
        "created_at": "2025-05-22T01:04:00Z",Copy
        "updated_at": "2025-05-22T01:04:00Z"
    }contract": 1,
],
```-05-22T01:04:00Z",

#### Lấy chi tiết yêu cầu bồi thường theo ID

- **GET** `/api/claims/{id}/`esponse: Trả về thông tin InsuranceClaim vừa tạo.
- **Mô tả:** Lấy thông tin chi tiết của một yêu cầu bồi thường.
- **Response:** Thông tin chi tiết InsuranceClaim.

**Ví dụ:**Copy
```bash -X POST http://localhost:8080/api/claims/ -H "Content-Type: application/json" -d '{"contract": 1, "amount": 500.00, "claim_date": "2025-05-22T01:04:00Z", "description": "Hospitalization cost", "status": "pending"}'
curl http://localhost:8080/api/claims/1/
```của một yêu cầu bồi thường (chỉ cho phép cập nhật status).

#### Tạo yêu cầu bồi thường mới

- **POST** `/api/claims/`Copy
- **Mô tả:** Tạo mới một yêu cầu bồi thường.
- **Body (JSON):**status": "approved"
```json
{esponse: Trả về thông tin InsuranceClaim đã cập nhật.
    "contract": 1,
    "amount": 500.00,
    "claim_date": "2025-05-22T01:04:00Z",
    "description": "Hospitalization cost",Copy
    "status": "pending" -X PATCH http://localhost:8080/api/claims/1/ -H "Content-Type: application/json" -d '{"status": "approved"}'
}
````

- **Response:** Thông tin InsuranceClaim vừa tạo.
  Copy
  **Ví dụ:**tail": "Invalid status"}

```bash
curl -X POST http://localhost:8080/api/claims/ -H "Content-Type: application/json" -d '{"contract": 1, "amount": 500.00, "claim_date": "2025-05-22T01:04:00Z", "description": "Hospitalization cost", "status": "pending"}'ồi thường theo id.
```

#### Cập nhật trạng thái yêu cầu bồi thường

Copy

- **PUT/PATCH** `/api/claims/{id}/` -X DELETE http://localhost:8080/api/claims/1/
- **Mô tả:** Chỉ cho phép cập nhật trường `status`.
- **Body (JSON):**

```json
{
  "status": "approved"
}
```

- **Response:** Thông tin InsuranceClaim đã cập nhật.

**Ví dụ:**

```bash
curl -X PATCH http://localhost:8080/api/claims/1/ -H "Content-Type: application/json" -d '{"status": "approved"}'
```

**Lưu ý:** Nếu `status` không phải là `pending`, `approved`, hoặc `rejected`, API trả về lỗi 400:

```json
{ "detail": "Invalid status" }
```

#### Xóa yêu cầu bồi thường

- **DELETE** `/api/claims/{id}/`
- **Mô tả:** Xóa yêu cầu bồi thường theo ID.

**Ví dụ:**

```bash
curl -X DELETE http://localhost:8080/api/claims/1/
```
