# Chatbot Service API Documentation

**Base URL:** `http://localhost:8080/api/`

Dịch vụ **chatbot_service** cung cấp API hỗ trợ người dùng chẩn đoán bệnh và gợi ý thuốc dựa trên triệu chứng, tích hợp Rasa để xử lý ngôn ngữ tự nhiên và mô hình Random Forest để chẩn đoán.

---

## 1. API Trò chuyện (Chat)

### Gửi tin nhắn trò chuyện

- **Endpoint:** `POST /api/chat/`
- **Mô tả:** Gửi tin nhắn (kèm `patient_id`) tới chatbot Rasa để xử lý và nhận phản hồi dựa trên intent (chẩn đoán bệnh, gợi ý thuốc, xác nhận triệu chứng, v.v.).
- **Permission:** Không yêu cầu xác thực.

#### Request Body (JSON)

```json
{
  "patient_id": 101,
  "message": "Tôi bị sốt và ho"
}
```

#### Ví dụ sử dụng curl

```bash
curl -X POST http://localhost:8080/api/chat/ \
    -H "Content-Type: application/json" \
    -d '{"patient_id": 101, "message": "Tôi bị sốt và ho"}'
```

#### Response mẫu

```json
{
  "response": "Dựa trên các triệu chứng (sốt, ho), bạn có thể mắc Cảm cúm. Vui lòng gặp bác sĩ để được chẩn đoán và điều trị chính xác."
}
```

#### Response lỗi mẫu (nếu Rasa không phản hồi)

```json
{
  "detail": "Lỗi khi giao tiếp với Rasa: Connection timed out"
}
```

---

## 2. Các intent được hỗ trợ

- `chan_doan_benh`: Chẩn đoán bệnh dựa trên triệu chứng.
- `goi_y_thuoc`: Gợi ý thuốc dựa trên bệnh được chẩn đoán.
- `hoi_lai_trieu_chung`: Yêu cầu người dùng cung cấp lại triệu chứng.
- `xac_nhan_trieu_chung`: Xác nhận triệu chứng người dùng cung cấp.
- `chao_hoi`: Phản hồi lời chào.
- `tam_biet`: Phản hồi lời tạm biệt.
- `out_of_scope`: Xử lý yêu cầu không thuộc phạm vi hỗ trợ.

---

## 3. Xử lý ngôn ngữ tự nhiên (NLU)

- Sử dụng Rasa với pipeline định nghĩa trong `config.yml`.
- Dữ liệu huấn luyện trong `nlu.yml` (chào hỏi, tạm biệt, chẩn đoán bệnh, gợi ý thuốc, hỏi lại triệu chứng, xác nhận triệu chứng, ngoài phạm vi).
- Triệu chứng được ánh xạ qua `TRIEU_CHUNG_VARIANTS` trong `actions.py`.

---

## 4. Chẩn đoán bệnh

- Mô hình Random Forest huấn luyện trên `data/symptoms_data.csv` (15,000 mẫu, 15 triệu chứng, 15 bệnh).
- Mô hình lưu tại `data/model.pkl`, danh sách triệu chứng tại `data/trieu_chung.json`.
- Độ chính xác đánh giá trong `train_model.py` với GridSearchCV.

---

## 5. Gợi ý thuốc

- Thông tin thuốc lưu tại `data/medications.json`, truy xuất bởi `ActionGoiYThuoc`.
- Nếu không có thông tin thuốc, chatbot yêu cầu gặp bác sĩ.

---

## 6. CORS

- Hỗ trợ CORS cho origin `http://localhost:3000`.
- Cho phép tất cả phương thức HTTP và header.

---

## 7. Xử lý lỗi

- Nếu Rasa không phản hồi hoặc lỗi: trả về mã 500 và chi tiết lỗi.
- Nếu không nhận diện được triệu chứng: chatbot yêu cầu mô tả rõ hơn.

---

## 8. Dữ liệu & mô hình

- **Dữ liệu triệu chứng:** `data/symptoms_data.csv`
- **Mô hình chẩn đoán:** `data/model.pkl`
- **Danh sách triệu chứng:** `data/trieu_chung.json`
- **Thông tin thuốc:** `data/medications.json`

---

## 9. Các bước triển khai

1. **Khởi động Rasa server:**
   `bash
    rasa run --enable-api --cors "*" --port 5005
    `
2. **Khởi động Rasa actions server:**
   `bash
    rasa run actions --port 5055
    `
3. **Khởi động FastAPI server:**
   `bash
    uvicorn main:app --host 0.0.0.0 --port 8080
    `
4. **Đảm bảo các tệp dữ liệu:** - `data/model.pkl` - `data/trieu_chung.json` - `data/medications.json` - `data/symptoms_data.csv`
5. **Cấu hình môi trường:** - Đảm bảo các container `chatbot_rasa:5005` và `chatbot_actions:5055` đang chạy.

---

## 10. Ví dụ sử dụng

### Chẩn đoán bệnh

```bash
curl -X POST http://localhost:8080/api/chat/ \
    -H "Content-Type: application/json" \
    -d '{"patient_id": 101, "message": "Tôi bị sốt và ho"}'
```

**Phản hồi:**

```json
{
  "response": "Dựa trên các triệu chứng (sốt, ho), bạn có thể mắc Cảm cúm. Vui lòng gặp bác sĩ để được chẩn đoán và điều trị chính xác."
}
```

### Gợi ý thuốc

```bash
curl -X POST http://localhost:8080/api/chat/ \
    -H "Content-Type: application/json" \
    -d '{"patient_id": 101, "message": "Thuốc nào trị Cảm cúm?"}'
```

**Phản hồi:**

```json
{
  "response": "Gợi ý điều trị cho bệnh Cảm cúm:\n- Thuốc: Paracetamol, Thuốc ho\n- Hướng dẫn: Uống 1 viên Paracetamol mỗi 6 giờ, dùng thuốc ho theo chỉ dẫn\n- Lưu ý: Nghỉ ngơi, uống đủ nước."
}
```

### Xác nhận triệu chứng

```bash
curl -X POST http://localhost:8080/api/chat/ \
    -H "Content-Type: application/json" \
    -d '{"patient_id": 101, "message": "Đúng rồi, tôi bị sốt và ho"}'
```

**Phản hồi:**

```json
{
  "response": "Tôi đã ghi nhận triệu chứng: Đúng rồi, tôi bị sốt và ho. Bạn có muốn tiếp tục chẩn đoán bệnh không?"
}
```
