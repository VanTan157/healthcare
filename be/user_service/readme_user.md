# User Service API Documentation

**Base URL:** `http://localhost:8080/api/`

## 1. User Management API

### Register a New User

- **Endpoint:** `POST /api/users/register/`
- **Description:** Create a new user account with `username`, `email`, `password`, and `role`.
- **Permission:** AllowAny (anyone can call this API).

**Request Body (JSON):**

```json
{
  "username": "john_doe",
  "email": "john.doe@example.com",
  "password": "securepassword123",
  "role": "patient"
}
```

- `password` must be at least 8 characters.
- `role` must be one of: `patient`, `doctor`, `nurse`, `admin`, `pharmacist`, `lab_technician`, `insurance_provider`.

**Sample Request:**

```bash
curl -X POST http://localhost:8080/api/users/register/ \
    -H "Content-Type: application/json" \
    -d '{"username": "john_doe", "email": "john.doe@example.com", "password": "securepassword123", "role": "patient"}'
```

**Sample Response (201 Created):**

```json
{
  "username": "john_doe",
  "email": "john.doe@example.com",
  "role": "patient"
}
```

---

### Get Current User Info

- **Endpoint:** `GET /api/users/me/`
- **Description:** Returns details of the currently authenticated user (using JWT token).
- **Permission:** IsAuthenticated (user must be logged in).

**Sample Request:**

```bash
curl -H "Authorization: Bearer <your_jwt_token>" http://localhost:8080/api/users/me/
```

**Sample Response:**

```json
{
  "id": 1,
  "username": "john_doe",
  "email": "john.doe@example.com",
  "role": "patient",
  "is_active": true
}
```

---

### List All Users

- **Endpoint:** `GET /api/users/`
- **Description:** Returns a list of all users in the system.
- **Permission:** AllowAny (no authentication required).

**Sample Request:**

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
  },
  {
    "id": 2,
    "username": "dr_smith",
    "email": "smith@example.com",
    "role": "doctor",
    "is_active": true
  }
]
```

---

### Get User Details by ID

- **Endpoint:** `GET /api/users/<id>/`
- **Description:** Returns details of a user by ID.
- **Permission:** IsAuthenticated (user must be logged in).

**Sample Request:**

```bash
curl -H "Authorization: Bearer <your_jwt_token>" http://localhost:8080/api/users/1/
```

**Sample Response:**

```json
{
  "id": 1,
  "username": "john_doe",
  "email": "john.doe@example.com",
  "role": "patient",
  "is_active": true
}
```

---

### Update User Information

- **Endpoint:** `PUT/PATCH /api/users/<id>/`
- **Description:** Update all or part of a user's information (only `admin` or `doctor` allowed).
- **Permission:** IsAuthenticated & RolePermission (admin or doctor only).

**Sample Request Body (PATCH):**

```json
{
  "email": "new.email@example.com",
  "role": "doctor"
}
```

**Sample Request:**

```bash
curl -X PATCH -H "Authorization: Bearer <your_jwt_token>" \
    -H "Content-Type: application/json" \
    http://localhost:8080/api/users/1/ \
    -d '{"email": "new.email@example.com", "role": "doctor"}'
```

**Sample Response:**

```json
{
  "id": 1,
  "username": "john_doe",
  "email": "new.email@example.com",
  "role": "doctor",
  "is_active": true
}
```

---

### Delete User

- **Endpoint:** `DELETE /api/users/<id>/`
- **Description:** Delete a user by ID (only `admin` or `doctor` allowed).
- **Permission:** IsAuthenticated & RolePermission (admin or doctor only).

**Sample Request:**

```bash
curl -X DELETE -H "Authorization: Bearer <your_jwt_token>" http://localhost:8080/api/users/1/
```

---

## 2. Authentication API

### Login and Get Token

- **Endpoint:** `POST /api/token/`
- **Description:** Log in and receive a pair of tokens (access & refresh) with user info.
- **Permission:** AllowAny (no authentication required).

**Request Body (JSON):**

```json
{
  "username": "john_doe",
  "password": "securepassword123"
}
```

**Sample Request:**

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

---

### Refresh Token

- **Endpoint:** `POST /api/token/refresh/`
- **Description:** Refresh the access token using a refresh token.
- **Permission:** AllowAny (no authentication required).

**Request Body (JSON):**

```json
{
  "refresh": "<refresh_token>"
}
```

**Sample Request:**

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
