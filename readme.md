# Tài liệu API cho Hệ thống Y tế (Healthcare System)

**Base URL:** `http://localhost:8080/api/`

Hệ thống y tế gồm nhiều microservices triển khai qua Docker Compose, sử dụng Kong API Gateway để định tuyến HTTP. Các dịch vụ chính: quản lý người dùng, bệnh nhân, bác sĩ, đơn thuốc, xét nghiệm, bảo hiểm, thông báo, thanh toán, và chatbot y tế. Mọi yêu cầu đều đi qua API Gateway tại `http://localhost:8080/api/`.

---

## 1. Tổng quan

- **API Gateway:** Sử dụng Kong, cấu hình qua `kong.yml`.
- **Microservices:** Mỗi dịch vụ chạy container riêng, dùng PostgreSQL, Redis (notification_service), Kafka/Zookeeper (xử lý sự kiện).
- **CORS:** Hỗ trợ frontend tại `http://localhost:3000`.
- **Frontend:** Next.js, giao tiếp backend qua API Gateway.

---

## 2. Các dịch vụ và endpoint

### 2.1. User Service

- **Base Path:** `/api/users/`, `/api/token/`
- **Internal URL:** `http://user_service:8000/`
- **Port:** `8001:8000`
- **Chức năng:** Quản lý người dùng (đăng ký, xác thực, vai trò).

#### Endpoint chính

- `POST /api/users/register/` – Đăng ký người dùng mới  
   **Body:**

  ```json
  {
    "username": "john_doe",
    "email": "john.doe@example.com",
    "password": "securepassword123",
    "role": "patient"
  }
  ```

  **Ví dụ:**

  ```bash
  curl -X POST http://localhost:8080/api/users/register/ \
      -H "Content-Type: application/json" \
      -d '{"username": "john_doe", "email": "john.doe@example.com", "password": "securepassword123", "role": "patient"}'
  ```

  **Response mẫu:**

  ```json
  {
    "username": "john_doe",
    "email": "john.doe@example.com",
    "role": "patient"
  }
  ```

- `GET /api/users/` – Lấy danh sách người dùng

  ```bash
  curl http://localhost:8080/api/users/
  ```

  **Response mẫu:**

  ```json
  [
    {
      "id": 1,
      "username": "john_doe",
      "email": "john.doe@example.com",
      "role": "patient",
      "is_active": true
    }
  ]
  ```

- `GET /api/users/<id>/` – Lấy chi tiết người dùng (yêu cầu xác thực)
- `PUT/PATCH /api/users/<id>/` – Cập nhật thông tin (chỉ admin/doctor)
- `DELETE /api/users/<id>/` – Xóa người dùng (chỉ admin/doctor)

- `POST /api/token/` – Đăng nhập lấy JWT  
   **Body:**

  ```json
  {
    "username": "john_doe",
    "password": "securepassword123"
  }
  ```

  **Response mẫu:**

  ```json
  {
    "refresh": "<refresh_token>",
    "access": "<access_token>",
    "id": 1,
    "username": "john_doe",
    "email": "john.doe@example.com",
    "role": "patient",
    "is_active": true
  }
  ```

- `POST /api/token/refresh/` – Làm mới access token  
   **Body:**
  ```json
  { "refresh": "<refresh_token>" }
  ```
  **Response mẫu:**
  ```json
  { "access": "<new_access_token>" }
  ```

---

### 2.2. Patient Service

- **Base Path:** `/api/patients/`, `/api/appointments/`
- **Internal URL:** `http://patient_service:8000/`
- **Port:** `8002:8000`
- **Chức năng:** Quản lý bệnh nhân, lịch hẹn.

#### Endpoint chính

- `GET /api/patients/` – Lấy danh sách bệnh nhân
- `GET /api/patients/<id>/` – Lấy chi tiết bệnh nhân
- `POST /api/patients/` – Tạo bệnh nhân mới
- `PUT/PATCH /api/patients/<id>/` – Cập nhật bệnh nhân
- `DELETE /api/patients/<id>/` – Xóa bệnh nhân

- `GET /api/appointments/` – Lấy danh sách lịch hẹn

  ```bash
  curl http://localhost:8080/api/appointments/
  ```

- `POST /api/appointments/` – Tạo lịch hẹn mới  
   **Body:**
  ```json
  {
    "patient_id": 101,
    "doctor": "Nguyễn Văn A"
  }
  ```
  **Response mẫu:**
  ```json
  {
    "appointment": {
      "patient_id": 101,
      "doctor": "Nguyễn Văn A",
      "time": "2025-05-27T10:00:00Z"
    }
  }
  ```

---

### 2.3. Doctor Service

- **Base Path:** `/api/doctors/`, `/api/diagnoses/`, `/api/diagnose/`
- **Internal URL:** `http://doctor_service:8000/`
- **Port:** `8003:8000`
- **Chức năng:** Quản lý bác sĩ, chẩn đoán.

#### Endpoint chính

- `GET /api/doctors/` – Lấy danh sách bác sĩ

  ```bash
  curl http://localhost:8080/api/doctors/
  ```

  **Response mẫu:**

  ```json
  {
    "doctors": [
      {
        "id": 1,
        "name": "Nguyễn Văn A",
        "specialty": "Nội khoa"
      }
    ]
  }
  ```

- `GET /api/diagnoses/` – Lấy danh sách chẩn đoán
- `POST /api/diagnose/` – Tạo chẩn đoán mới

---

### 2.4. Pharmacy Service

- **Base Path:** `/api/prescriptions/`, `/api/medicines/`
- **Internal URL:** `http://pharmacy_service:8000/`
- **Port:** `8004:8000`
- **Chức năng:** Quản lý đơn thuốc, thuốc.

#### Endpoint chính

- `GET /api/prescriptions/` – Lấy danh sách đơn thuốc
- `POST /api/prescriptions/` – Tạo đơn thuốc mới  
   **Body:**

  ```json

  ```

- **Chức năng:** Quản lý yêu cầu, kết quả xét nghiệm.

#### Endpoint chính "medicine": "Paracetamol",

- `GET /api/lab_requests/` – Lấy danh sách yêu cầu xét nghiệm }
- `POST /api/lab_requests/` – Tạo yêu cầu xét nghiệm mới
- `GET /api/lab_results/` – Lấy danh sách kết quả xét nghiệm
  ```bash
  curl http://localhost:8080/api/lab_results/
  ```

---vice

### 2.6. Insurance Servicei/lab_requests/`, `/api/lab_results/`

ervice:8000/`

- **Base Path:** `/api/insurance_contracts/`, `/api/claims/`rt:\*\* `8005:8000`
- **Internal URL:** `http://insurance_service:8000/`5. Laboratory Service
- **Port:** `8006:8000` Base Path: /api/lab_requests/, /api/lab_results/
- **Chức năng:** Quản lý hợp đồng bảo hiểm, yêu cầu bồi thường.
  0/

#### Endpoint chính

- `GET /api/insurance_contracts/` – Lấy danh sách hợp đồng

  ```bash xét nghiệm.
  curl http://localhost:8080/api/insurance_contracts/Các endpoint:
  ```

  **Response mẫu:**Lấy danh sách tất cả yêu cầu xét nghiệm.

  ````json
  [ét nghiệm mới.
      {
          "id": 1,.
          "patient_id": 101,
          "policy_number": "POL123456",
          "provider": "ABC Insurance",
          "start_date": "2025-01-01",
          "end_date": "2025-12-31",
          "details": "Full coverage plan",e Service
          "created_at": "2025-05-22T01:04:00Z", Path: /api/insurance_contracts/, /api/claims/
          "updated_at": "2025-05-22T01:04:00Z"
      }rnal URL: http://insurance_service:8000/
  ]
  ```t: 8006:8000 (external:internal)

  ````

- `GET /api/insurance_contracts/<id>/` – Lấy chi tiết hợp đồngg bảo hiểm và yêu cầu bồi thường.
- `POST /api/insurance_contracts/` – Tạo hợp đồng mới  
   **Body:**

  ```jsonảo hiểm.
  {
      "patient_id": 101,
      "policy_number": "POL123456",
      "provider": "ABC Insurance",
      "start_date": "2025-01-01",l http://localhost:8080/api/insurance_contracts/
      "end_date": "2025-12-31",esponse mẫu:
      "details": "Full coverage plan"
  }
  ```

- `PUT/PATCH /api/insurance_contracts/<id>/` – Cập nhật hợp đồng
- `DELETE /api/insurance_contracts/<id>/` – Xóa hợp đồng: 1,
  "patient_id": 101,
- `GET /api/claims/` – Lấy danh sách yêu cầu bồi thường icy_number": "POL123456",
  ```bash
  curl http://localhost:8080/api/claims/
  ```
  **Response mẫu:**
  ````json-22T01:04:00Z",
  [025-05-22T01:04:00Z"
      {
          "id": 1,
          "contract": 1,/api/insurance_contracts/<id>/
          "amount": 500.00,Lấy chi tiết hợp đồng bảo hiểm theo ID.
          "claim_date": "2025-05-22T01:04:00Z", /api/insurance_contracts/
          "description": "Hospitalization cost",
          "status": "pending",
          "created_at": "2025-05-22T01:04:00Z",
          "updated_at": "2025-05-22T01:04:00Z"
      }
  ]url -X POST http://localhost:8080/api/insurance_contracts/ -H "Content-Type: application/json" -d '{"patient_id": 101, "policy_number": "POL123456", "provider": "ABC Insurance", "start_date": "2025-01-01", "end_date": "2025-12-31", "details": "Full coverage plan"}'
  ```/PATCH /api/insurance_contracts/<id>/
  đồng bảo hiểm.
  ````
- `POST /api/claims/` – Tạo yêu cầu bồi thường mớince_contracts/<id>/
- `PUT/PATCH /api/claims/<id>/` – Cập nhật trạng thái yêu cầu.
- `DELETE /api/claims/<id>/` – Xóa yêu cầu

---

### 2.7. Notification Service

y

- **Internal URL:** `http://notification_service:8000/`url http://localhost:8080/api/claims/
- **Port:** `8007:8000`
- **Chức năng:** Quản lý thông báo, dùng Redis (Celery) cho tác vụ bất đồng bộ.
- **Lưu ý:** Chưa có endpoint công khai, cần thêm route trong Kong nếu muốn truy cập qua API Gateway.

---

### 2.8. Payment Service

- **Internal URL:** `http://payment_service:8000/`"amount": 500.00,
- **Port:** `8008:8000`",
- **Chức năng:** Quản lý thanh toán (hóa đơn, bảo hiểm)."description": "Hospitalization cost",
- **Lưu ý:** Chưa có endpoint công khai, cần cấu hình thêm trong Kong.

---

### 2.9. Chatbot Service

POST /api/claims/

- **Base Path:** `/api/chat/`
- **Internal URL:** `http://chatbot_fastapi:8000/`PUT/PATCH /api/claims/<id>/
- **Port:** `8009:8000`
- **Chức năng:** Chatbot y tế chẩn đoán bệnh, gợi ý thuốc (Rasa, FastAPI).

#### Endpoint chínhrvice

notification_service:8000/

- `POST /api/chat/` – Gửi tin nhắn tới chatbot  
   **Body:**
  ````json
  {edis làm hàng đợi (Celery) để xử lý các tác vụ bất đồng bộ.
      "patient_id": 101,Các endpoint: (Chưa được định nghĩa cụ thể trong kong.yml, cần thêm route nếu muốn truy cập qua API Gateway).
      "message": "Tôi bị sốt và ho"có endpoint công khai được định nghĩa trong cấu hình hiện tại.
  }Service
  ```ttp://payment_service:8000/
  **Response mẫu:**
  ```json000 (external:internal)
  {
      "response": "Dựa trên các triệu chứng (sốt, ho), bạn có thể mắc Cảm cúm. Vui lòng gặp bác sĩ để được chẩn đoán và điều trị chính xác."Mô tả: Quản lý thanh toán (ví dụ: thanh toán hóa đơn y tế, bảo hiểm).
  }endpoint: (Chưa được định nghĩa cụ thể trong kong.yml, cần thêm route nếu muốn truy cập qua API Gateway).
  ```hi chú: Dịch vụ này có thể xử lý các giao dịch thanh toán, nhưng cần cấu hình thêm trong Kong để công khai endpoint.
  ````

**Hỗ trợ intent:**

- `chan_doan_benh`: Chẩn đoán bệnh
- `goi_y_thuoc`: Gợi ý thuốcal URL: http://chatbot_fastapi:8000/
- `hoi_lai_trieu_chung`: Yêu cầu cung cấp lại triệu chứng
- `xac_nhan_trieu_chung`: Xác nhận triệu chứngPort: 8009:8000 (external:internal)
- `chao_hoi`: Lời chào
- `tam_biet`: Tạm biệt
- `out_of_scope`: Ngoài phạm vi
  /api/chat/
  ---Gửi tin nhắn tới chatbot để chẩn đoán bệnh hoặc gợi ý thuốc.
  (JSON):

## 3. Các thành phần khácson

### 3.1. PostgreSQLopy

- **Image:** `postgres:13`
- **Port:** `5433:5432`
- **Dùng cho:** Tất cả microservices
- **Cấu hình:**
  - Username: `user`
  - Password: `password`
  - Volume: `postgres_data`
  - Script khởi tạo: `init-dbs.sh` (tạo các DB cho từng service)calhost:8080/api/chat/ -H "Content-Type: application/json" -d '{"patient_id": 101, "message": "Tôi bị sốt và ho"}'

### 3.2. Redis

- **Image:** `redis:latest`
- **Port:** `6379:6379`
- **Dùng cho:** Notification service (Celery)ựa trên các triệu chứng (sốt, ho), bạn có thể mắc Cảm cúm. Vui lòng gặp bác sĩ để được chẩn đoán và điều trị chính xác."

### 3.3. Kafka & Zookeeper

- **Kafka Image:** `confluentinc/cp-kafka:latest`c: Gợi ý thuốc dựa trên bệnh.
- **Zookeeper Image:** `confluentinc/cp-zookeeper:latest`: Yêu cầu cung cấp lại triệu chứng.
- **Dùng cho:** Xử lý sự kiện giữa các microserviceschung: Xác nhận triệu chứng.
- **Cấu hình:**
  - Kafka: `PLAINTEXT://kafka:9092` tạm biệt.
  - Zookeeper: `ZOOKEEPER_CLIENT_PORT: 2181`. 3. Các thành phần khác

### 3.4. Frontend

3:5432 (external:internal)

- **Port:** `3000:3000`o các microservices (user_service, patient_service, doctor_service, pharmacy_service, laboratory_service, insurance_service, notification_service, payment_service, chatbot_service).
- **Dùng cho:** Next.js frontend
- **Cấu hình môi trường:** r - `NEXT_PUBLIC_API_URL=http://api_gateway:8080/api`ord - `CHOKIDAR_USEPOLLING=true` (hot-reload)
  t-dbs.sh để tạo các cơ sở dữ liệu (user_db, patient_db, doctor_db, pharmacy_db, laboratory_db, insurance_db, notification_db, payment_db, chatbot_db).

---

## 4. Các bước triển khai

ưu trữ kết quả cho các tác vụ bất đồng bộ của notification_service (Celery).

1. **Chuẩn bị môi trường:** - Cài Docker, Docker Compose - Đảm bảo các thư mục `./be/<service>` và `./fe` chứa mã nguồninc/cp-zookeeper:latest
   ả: Xử lý sự kiện và luồng dữ liệu giữa các microservices (ví dụ: thông báo, cập nhật trạng thái).
2. **Xây dựng & chạy hệ thống:**Cấu hình:

   ```basha: PLAINTEXT://kafka:9092
   docker-compose up --buildNT_PORT: 2181
   ```

3. **Kiểm tra dịch vụ:**s) giao tiếp với backend qua API Gateway (http://api_gateway:8080/api).

   - API Gateway: http://localhost:8080/api/
   - Frontend: http://localhost:3000/ttp://api_gateway:8080/api
   - PostgreSQL: localhost:5433 hỗ trợ hot-reload trong quá trình phát triển. 4. Các bước triển khai
   - Redis: localhost:6379
   - Rasa server: localhost:5005e.
   - Rasa actions: localhost:5055à ./fe chứa mã nguồn của các dịch vụ và frontend.
   - Chatbot FastAPI: localhost:8009ạy hệ thống:

4. **Đảm bảo dữ liệu chatbot:** - `data/model.pkl` - `data/trieu_chung.json` up --build - `data/medications.json` - `data/symptoms_data.csv`
   /localhost:3000/
5. **Cấu hình Kong:**ost:5433 - Đặt file `kong.yml` tại `/kong/declarative/` trong container api_gatewayocalhost:6379 - Chạy Kong ở chế độ không DB (`KONG_DATABASE=off`)Rasa server: localhost:5005
   actions: localhost:5055
   ---Chatbot FastAPI: localhost:8009
   bảo các tệp dữ liệu cho chatbot:

## 5. Ví dụ sử dụng

u_chung.json

### Đăng ký người dùngdata/medications.json

/symptoms_data.csv

```bashCấu hình Kong:
curl -X POST http://localhost:8080/api/users/register/ \ kong.yml phải được đặt trong thư mục /kong/declarative/ trong container api_gateway.
    -H "Content-Type: application/json" \ong chạy ở chế độ không cơ sở dữ liệu (KONG_DATABASE=off). 5. Ví dụ sử dụng
    -d '{"username": "john_doe", "email": "john.doe@example.com", "password": "securepassword123", "role": "patient"}'
```

**Phản hồi:**

```jsonash
{
    "username": "john_doe",
    "email": "john.doe@example.com",curl -X POST http://localhost:8080/api/users/register/ -H "Content-Type: application/json" -d '{"username": "john_doe", "email": "john.doe@example.com", "password": "securepassword123", "role": "patient"}'
    "role": "patient" hồi:
}
```

### Chẩn đoán bệnh qua chatbot

{

```bashrname": "john_doe",
curl -X POST http://localhost:8080/api/chat/ \"email": "john.doe@example.com",
    -H "Content-Type: application/json" \e": "patient"
    -d '{"patient_id": 101, "message": "Tôi bị sốt và ho"}'
```

**Phản hồi:**êu cầu:

````json
{
    "response": "Dựa trên các triệu chứng (sốt, ho), bạn có thể mắc Cảm cúm. Vui lòng gặp bác sĩ để được chẩn đoán và điều trị chính xác."
}
```curl -X POST http://localhost:8080/api/chat/ -H "Content-Type: application/json" -d '{"patient_id": 101, "message": "Tôi bị sốt và ho"}'
 hồi:
### Tạo hợp đồng bảo hiểm

```bash
curl -X POST http://localhost:8080/api/insurance_contracts/ \
    -H "Content-Type: application/json" \{
    -d '{"patient_id": 101, "policy_number": "POL123456", "provider": "ABC Insurance", "start_date": "2025-01-01", "end_date": "2025-12-31", "details": "Full coverage plan"}'ponse": "Dựa trên các triệu chứng (sốt, ho), bạn có thể mắc Cảm cúm. Vui lòng gặp bác sĩ để được chẩn đoán và điều trị chính xác."
````

**Phản hồi:**ng bảo hiểm

````json
{
    "id": 1,
    "patient_id": 101,
    "policy_number": "POL123456",
    "provider": "ABC Insurance",/api/insurance_contracts/ -H "Content-Type: application/json" -d '{"patient_id": 101, "policy_number": "POL123456", "provider": "ABC Insurance", "start_date": "2025-01-01", "end_date": "2025-12-31", "details": "Full coverage plan"}'
    "start_date": "2025-01-01",
    "end_date": "2025-12-31",
    "details": "Full coverage plan",
    "created_at": "2025-05-22T01:04:00Z",
    "updated_at": "2025-05-22T01:04:00Z"
}
```son

Copy
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
````
