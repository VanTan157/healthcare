# Sử dụng image Python 3.9 làm base
FROM python:3.9

# Đặt thư mục làm việc
WORKDIR /app

# Copy và cài đặt các thư viện từ requirements.txt
COPY requirements.txt .
RUN pip install -r requirements.txt

# Copy toàn bộ mã nguồn vào container
COPY . .

# Chạy ứng dụng với Gunicorn trên port 8000
CMD ["gunicorn", "--bind", "0.0.0.0:8000", "pharmacy_service.wsgi"]