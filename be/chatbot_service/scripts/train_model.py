import pandas as pd
from sklearn.ensemble import RandomForestClassifier
from sklearn.model_selection import train_test_split, GridSearchCV
from sklearn.metrics import accuracy_score, classification_report, confusion_matrix
import pickle
import json
import numpy as np

# Đọc dữ liệu
data = pd.read_csv('data/symptoms_data.csv')

# Kiểm tra dữ liệu
if data.isnull().values.any():
    raise ValueError("Dữ liệu chứa giá trị null")
if 'benh' not in data.columns:
    raise ValueError("Dữ liệu không có cột 'benh'")

X = data.drop('benh', axis=1)
y = data['benh']

# Lưu danh sách triệu chứng
TRIEU_CHUNG = X.columns.tolist()
with open('data/trieu_chung.json', 'w') as f:
    json.dump(TRIEU_CHUNG, f)
print(f"Đã lưu danh sách triệu chứng vào data/trieu_chung.json")

# Chia dữ liệu
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

# Tối ưu hóa tham số bằng GridSearchCV
param_grid = {
    'n_estimators': [100, 200, 300],
    'max_depth': [10, 20, 30, None],
    'min_samples_split': [2, 5, 10],
    'min_samples_leaf': [1, 2, 4]
}
rf = RandomForestClassifier(random_state=42)
grid_search = GridSearchCV(rf, param_grid, cv=5, scoring='accuracy', n_jobs=-1)
grid_search.fit(X_train, y_train)

# Lấy mô hình tốt nhất
model = grid_search.best_estimator_
print(f"Tham số tốt nhất: {grid_search.best_params_}")

# Đánh giá mô hình
y_pred = model.predict(X_test)
accuracy = accuracy_score(y_test, y_pred)
print(f"Độ chính xác mô hình: {accuracy:.2f}")
print("Báo cáo phân loại:")
print(classification_report(y_test, y_pred))

# Đánh giá độ nhạy và độ đặc hiệu
cm = confusion_matrix(y_test, y_pred)
labels = sorted(set(y_test))
for i, label in enumerate(labels):
    sensitivity = cm[i, i] / cm[i, :].sum() if cm[i, :].sum() > 0 else 0
    specificity = (cm.sum() - cm[i, :].sum() - cm[:, i].sum() + cm[i, i]) / (cm.sum() - cm[i, :].sum()) if (cm.sum() - cm[i, :].sum()) > 0 else 0
    print(f"Bệnh {label}: Độ nhạy = {sensitivity:.2f}, Độ đặc hiệu = {specificity:.2f}")

# Lưu mô hình
with open('data/model.pkl', 'wb') as f:
    pickle.dump(model, f)
print("Đã lưu mô hình vào data/model.pkl")