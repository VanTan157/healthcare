# Laboratory Service API Documentation

## 1. LabRequest API

**Base URL:** `http://localhost:8080/api/lab_requests/`

### Endpoints

#### GET `/api/lab_requests/`

- **Description:** Retrieve all lab requests.
- **Response:** JSON array of LabRequest objects.
- **Example:**
  ```bash
  curl http://localhost:8080/api/lab_requests/
  ```
  ```json
  [
    {
      "id": 1,
      "patient_id": 101,
      "doctor_id": 201,
      "test_type": "Blood Test",
      "description": "Complete blood count",
      "status": "pending",
      "created_at": "2025-05-21T21:42:00Z",
      "updated_at": "2025-05-21T21:42:00Z"
    }
  ]
  ```

#### GET `/api/lab_requests/{id}/`

- **Description:** Retrieve details of a lab request by ID.
- **Response:** LabRequest object.
- **Example:**
  ```bash
  curl http://localhost:8080/api/lab_requests/1/
  ```
  ```json
  {
    "id": 1,
    "patient_id": 101,
    "doctor_id": 201,
    "test_type": "Blood Test",
    "description": "Complete blood count",
    "status": "pending",
    "created_at": "2025-05-21T21:42:00Z",
    "updated_at": "2025-05-21T21:42:00Z"
  }
  ```

#### POST `/api/lab_requests/`

- **Description:** Create a new lab request.
- **Request Body:**
  ```json
  {
    "patient_id": 101,
    "doctor_id": 201,
    "test_type": "Blood Test",
    "description": "Complete blood count",
    "status": "pending"
  }
  ```
- **Response:** Created LabRequest object.
- **Example:**
  ```bash
  curl -X POST http://localhost:8080/api/lab_requests/ \
      -H "Content-Type: application/json" \
      -d '{"patient_id": 101, "doctor_id": 201, "test_type": "Blood Test", "description": "Complete blood count", "status": "pending"}'
  ```

#### PUT/PATCH `/api/lab_requests/{id}/`

- **Description:** Update the status of a lab request (only `status` can be updated).
- **Request Body:**
  ```json
  { "status": "completed" }
  ```
- **Response:** Updated LabRequest object.
- **Example:**
  ```bash
  curl -X PATCH http://localhost:8080/api/lab_requests/1/ \
      -H "Content-Type: application/json" \
      -d '{"status": "completed"}'
  ```
- **Note:** If `status` is not `pending`, `completed`, or `cancelled`, returns 400:
  ```json
  { "detail": "Invalid status" }
  ```

#### DELETE `/api/lab_requests/{id}/`

- **Description:** Delete a lab request by ID.
- **Example:**
  ```bash
  curl -X DELETE http://localhost:8080/api/lab_requests/1/
  ```

#### GET `/api/lab_requests/filter/`

- **Description:** Filter lab requests by `doctor_id` and/or `patient_id`.
- **Query Parameters:**
  - `doctor_id` (optional)
  - `patient_id` (optional)
  - At least one parameter is required.
- **Response:** Filtered list of LabRequest objects.
- **Examples:**
  - By doctor:
    ```bash
    curl http://localhost:8080/api/lab_requests/filter/?doctor_id=201
    ```
  - By patient:
    ```bash
    curl http://localhost:8080/api/lab_requests/filter/?patient_id=101
    ```
  - By both:
    ```bash
    curl http://localhost:8080/api/lab_requests/filter/?doctor_id=201&patient_id=101
    ```
  - No parameters:
    ```bash
    curl http://localhost:8080/api/lab_requests/filter/
    ```
    ```json
    { "detail": "At least one of doctor_id or patient_id is required" }
    ```

---

## 2. LabResult API

**Base URL:** `http://localhost:8080/api/lab_results/`

### Endpoints

#### GET `/api/lab_results/`

- **Description:** Retrieve all lab results.
- **Response:** JSON array of LabResult objects.
- **Example:**
  ```bash
  curl http://localhost:8080/api/lab_results/
  ```
  ```json
  [
    {
      "id": 1,
      "lab_request": 1,
      "result_date": "2025-05-21T21:42:00Z",
      "details": "Normal results",
      "created_at": "2025-05-21T21:42:00Z",
      "updated_at": "2025-05-21T21:42:00Z"
    }
  ]
  ```

#### GET `/api/lab_results/{id}/`

- **Description:** Retrieve details of a lab result by ID.
- **Response:** LabResult object.
- **Example:**
  ```bash
  curl http://localhost:8080/api/lab_results/1/
  ```

#### POST `/api/lab_results/`

- **Description:** Create a new lab result.
- **Request Body:**
  ```json
  {
    "lab_request": 1,
    "result_date": "2025-05-21T21:42:00Z",
    "details": "Normal results"
  }
  ```
- **Response:** Created LabResult object.
- **Example:**
  ```bash
  curl -X POST http://localhost:8080/api/lab_results/ \
      -H "Content-Type: application/json" \
      -d '{"lab_request": 1, "result_date": "2025-05-21T21:42:00Z", "details": "Normal results"}'
  ```

#### PUT/PATCH `/api/lab_results/{id}/`

- **Description:** Update a lab result.
- **Request Body:**
  ```json
  {
    "result_date": "2025-05-21T22:00:00Z",
    "details": "Updated results"
  }
  ```
- **Example:**
  ```bash
  curl -X PATCH http://localhost:8080/api/lab_results/1/ \
      -H "Content-Type: application/json" \
      -d '{"result_date": "2025-05-21T22:00:00Z", "details": "Updated results"}'
  ```

#### DELETE `/api/lab_results/{id}/`

- **Description:** Delete a lab result by ID.
- **Example:**
  ```bash
  curl -X DELETE http://localhost:8080/api/lab_results/1/
  ```
