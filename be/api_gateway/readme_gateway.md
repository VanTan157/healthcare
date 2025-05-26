# API Gateway Service Documentation

**Base URL:** `http://localhost:8080/api/`

The `gateway_service` is an API Gateway using Kong to route HTTP requests to corresponding microservices in the healthcare system. It provides a unified entry point for all services, including user management, patient information, doctors, prescriptions, laboratory, insurance, and medical chatbot.

---

## 1. Overview

### 1.1. User Service

- **Base Path:** `/api/users/`, `/api/token/`
- **Description:** Manages user information, registration, authentication, and roles.

#### Endpoints

- **POST** `/api/users/register/`  
   Register a new user.

  ```bash
  curl -X POST http://localhost:8080/api/users/register/ \
      -H "Content-Type: application/json" \
      -d '{"username": "john_doe", "email": "john.doe@example.com", "password": "securepassword123", "role": "patient"}'
  ```

  **Sample Response:**

  ```json
  {
    "username": "john_doe",
    "email": "john.doe@example.com",
    "role": "patient"
  }
  ```

- **GET** `/api/users/`  
   Get all users.

  ```bash
  curl http://localhost:8080/api/users/
  ```

  **Sample Response:**

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

- **GET** `/api/users/<id>/`  
   Get user details by ID (requires authentication).

  ```bash
  curl -H "Authorization: Bearer <your_jwt_token>" http://localhost:8080/api/users/1/
  ```

- **PUT/PATCH** `/api/users/<id>/`  
   Update user info (admin/doctor only, requires authentication).

- **DELETE** `/api/users/<id>/`  
   Delete user (admin/doctor only, requires authentication).

- **POST** `/api/token/`  
   Login and get JWT tokens.

  ```bash
  curl -X POST http://localhost:8080/api/token/ \
      -H "Content-Type: application/json" \
      -d '{"username": "john_doe", "password": "securepassword123"}'
  ```

  **Sample Response:**

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

- **POST** `/api/token/refresh/`  
   Refresh access token.
  ```bash
  curl -X POST http://localhost:8080/api/token/refresh/ \
      -H "Content-Type: application/json" \
      -d '{"refresh": "<refresh_token>"}'
  ```
  **Sample Response:**
  ```json
  {
    "access": "<new_access_token>"
  }
  ```

---

### 1.2. Patient Service

- **Base Path:** `/api/patients/`, `/api/appointments/`
- **Description:** Manages patient information and appointments.

#### Endpoints

- **GET** `/api/patients/`  
   Get all patients.

- **GET** `/api/patients/<id>/`  
   Get patient details by ID.

- **POST** `/api/patients/`  
   Create a new patient.

- **PUT/PATCH** `/api/patients/<id>/`  
   Update patient info.

- **DELETE** `/api/patients/<id>/`  
   Delete patient.

- **GET** `/api/appointments/`  
   Get all appointments.

- **POST** `/api/appointments/`  
   Create a new appointment.
  ```bash
  curl -X POST http://localhost:8080/api/appointments/ \
      -H "Content-Type: application/json" \
      -d '{"patient_id": 101, "doctor": "Nguyễn Văn A"}'
  ```
  **Sample Response:**
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

### 1.3. Doctor Service

- **Base Path:** `/api/doctors/`, `/api/diagnoses/`, `/api/diagnose/`
- **Description:** Manages doctor information and medical diagnoses.

#### Endpoints

- **GET** `/api/doctors/`  
   Get all doctors.

  ```bash
  curl http://localhost:8080/api/doctors/
  ```

  **Sample Response:**

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

- **GET** `/api/diagnoses/`  
   Get all diagnoses.

- **POST** `/api/diagnose/`  
   Create a new diagnosis.

---

### 1.4. Pharmacy Service

- **Base Path:** `/api/prescriptions/`, `/api/medicines/`
- **Description:** Manages prescriptions and medicines.

#### Endpoints

- **GET** `/api/prescriptions/`  
   Get all prescriptions.

- **POST** `/api/prescriptions/`  
   Create a new prescription.

  ```bash
  curl -X POST http://localhost:8080/api/prescriptions/ \
      -H "Content-Type: application/json" \
      -d '{"patient_id": 101, "medicine": "Paracetamol", "dosage": "500mg"}'
  ```

- **GET** `/api/medicines/`  
   Get all medicines.

---

### 1.5. Laboratory Service

- **Base Path:** `/api/lab_requests/`, `/api/lab_results/`
- **Description:** Manages lab requests and results.

#### Endpoints

- **GET** `/api/lab_requests/`  
   Get all lab requests.

- **POST** `/api/lab_requests/`  
   Create a new lab request.

- **GET** `/api/lab_results/`  
   Get all lab results.
  ```bash
  curl http://localhost:8080/api/lab_results/
  ```

---

### 1.6. Insurance Service

- **Base Path:** `/api/insurance_contracts/`, `/api/claims/`
- **Description:** Manages insurance contracts and claims.

#### Endpoints

- **GET** `/api/insurance_contracts/`  
   Get all insurance contracts.

  ```bash
  curl http://localhost:8080/api/insurance_contracts/
  ```

  **Sample Response:**

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

- **GET** `/api/insurance_contracts/<id>/`  
   Get insurance contract details by ID.

- **POST** `/api/insurance_contracts/`  
   Create a new insurance contract.

  ```bash
  curl -X POST http://localhost:8080/api/insurance_contracts/ \
      -H "Content-Type: application/json" \
      -d '{"patient_id": 101, "policy_number": "POL123456", "provider": "ABC Insurance", "start_date": "2025-01-01", "end_date": "2025-12-31", "details": "Full coverage plan"}'
  ```

- **PUT/PATCH** `/api/insurance_contracts/<id>/`  
   Update insurance contract.

- **DELETE** `/api/insurance_contracts/<id>/`  
   Delete insurance contract.

- **GET** `/api/claims/`  
   Get all claims.

  ```bash
  curl http://localhost:8080/api/claims/
  ```

  **Sample Response:**

  ```json
  [
    {
      "id": 1,
      "contract": 1,
      "amount": 500.0,
      "claim_date": "2025-05-22T01:04:00Z",
      "description": "Hospitalization cost",
      "status": "pending",
      "created_at": "2025-05-22T01:04:00Z",
      "updated_at": "2025-05-22T01:04:00Z"
    }
  ]
  ```

- **POST** `/api/claims/`  
   Create a new claim.

- **PUT/PATCH** `/api/claims/<id>/`  
   Update claim status.

- **DELETE** `/api/claims/<id>/`  
   Delete claim.

---

### 1.7. Chatbot Service

- **Base Path:** `/api/chat/`
- **Description:** Interact with the medical chatbot for diagnosis and medicine suggestions based on symptoms.

#### Endpoints

- **POST** `/api/chat/`  
   Send a message to the chatbot.
  ```json
  {
    "patient_id": 101,
    "message": "Tôi bị sốt và ho"
  }
  ```
  ```bash
  curl -X POST http://localhost:8080/api/chat/ \
      -H "Content-Type: application/json" \
      -d '{"patient_id": 101, "message": "Tôi bị sốt và ho"}'
  ```
  **Sample Response:**
  ```json
  {
    "response": "Dựa trên các triệu chứng (sốt, ho), bạn có thể mắc Cảm cúm. Vui lòng gặp bác sĩ để được chẩn đoán và điều trị chính xác."
  }
  ```

#### Supported Intents

- `chan_doan_benh`: Diagnose disease based on symptoms.
- `goi_y_thuoc`: Suggest medicine based on disease.
- `hoi_lai_trieu_chung`: Request more symptoms.
- `xac_nhan_trieu_chung`: Confirm symptoms.
- `chao_hoi`: Greeting.
- `tam_biet`: Goodbye.
- `out_of_scope`: Handle out-of-scope requests.
