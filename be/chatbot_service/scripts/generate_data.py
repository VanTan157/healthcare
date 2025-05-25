import pandas as pd
import numpy as np

# Định nghĩa triệu chứng và bệnh
TRIEU_CHUNG = [
    'sot', 'ho', 'dau_dau', 'met_moi', 'dau_bung', 'dau_hong', 'buon_non',
    'tieu_chay', 'phat_ban', 'kho_tho', 'dau_nguc', 'dau_khop', 'chong_mat',
    'non_mua', 'so_mui'
]
BENH = [
    'Cảm cúm', 'Viêm phổi', 'Viêm phế quản', 'Sốt xuất huyết', 
    'Nhiễm trùng đường tiết niệu', 'Viêm dạ dày', 'Đau nửa đầu', 
    'Tăng huyết áp', 'Viêm mũi dị ứng', 'Tiêu chảy cấp', 
    'Viêm gan virus', 'Đau thắt lưng', 'Nhiễm trùng da', 
    'Sỏi thận', 'Cường giáp'
]

# Xác suất triệu chứng cho mỗi bệnh (dựa trên tài liệu y khoa)
TRIEU_CHUNG_BENH = {
    'Cảm cúm': {
        'sot': 0.9, 'ho': 0.8, 'dau_hong': 0.7, 'so_mui': 0.6, 
        'met_moi': 0.5, 'dau_dau': 0.4
    },
    'Viêm phổi': {
        'sot': 0.9, 'ho': 1.0, 'kho_tho': 0.9, 'dau_nguc': 0.7, 
        'met_moi': 0.5
    },
    'Viêm phế quản': {
        'ho': 1.0, 'kho_tho': 0.7, 'dau_nguc': 0.5, 'sot': 0.4
    },
    'Sốt xuất huyết': {
        'sot': 1.0, 'dau_khop': 0.9, 'phat_ban': 0.8, 'dau_dau': 0.6, 
        'buon_non': 0.5
    },
    'Nhiễm trùng đường tiết niệu': {
        'dau_bung': 0.8, 'tieu_chay': 0.5, 'sot': 0.4
    },
    'Viêm dạ dày': {
        'dau_bung': 1.0, 'buon_non': 0.8, 'non_mua': 0.6, 'met_moi': 0.4
    },
    'Đau nửa đầu': {
        'dau_dau': 1.0, 'met_moi': 0.6, 'chong_mat': 0.5, 'buon_non': 0.4
    },
    'Tăng huyết áp': {
        'dau_dau': 0.7, 'chong_mat': 0.6, 'dau_nguc': 0.4
    },
    'Viêm mũi dị ứng': {
        'so_mui': 1.0, 'dau_hong': 0.5, 'ho': 0.3
    },
    'Tiêu chảy cấp': {
        'tieu_chay': 1.0, 'dau_bung': 0.9, 'buon_non': 0.7, 'sot': 0.5
    },
    'Viêm gan virus': {
        'sot': 0.8, 'met_moi': 0.9, 'buon_non': 0.7, 'dau_bung': 0.6
    },
    'Đau thắt lưng': {
        'dau_khop': 1.0, 'met_moi': 0.5
    },
    'Nhiễm trùng da': {
        'phat_ban': 1.0, 'sot': 0.6, 'dau_hong': 0.4
    },
    'Sỏi thận': {
        'dau_bung': 0.9, 'tieu_chay': 0.4, 'buon_non': 0.5
    },
    'Cường giáp': {
        'met_moi': 0.8, 'chong_mat': 0.7, 'sot': 0.5, 'dau_dau': 0.4
    }
}

# Tạo dữ liệu
np.random.seed(42)
n_samples = 15000
samples_per_benh = n_samples // len(BENH)  # 1000 mẫu mỗi bệnh

data = {tc: [] for tc in TRIEU_CHUNG}
data['benh'] = []

for benh in BENH:
    for _ in range(samples_per_benh):
        # Tạo vector triệu chứng cho bệnh
        trieu_chung_vector = {
            tc: 1 if np.random.rand() < TRIEU_CHUNG_BENH[benh].get(tc, 0) else 0
            for tc in TRIEU_CHUNG
        }
        for tc in TRIEU_CHUNG:
            data[tc].append(trieu_chung_vector[tc])
        data['benh'].append(benh)

# Lưu dữ liệu
df = pd.DataFrame(data)
df.to_csv('data/symptoms_data.csv', index=False)
print(f"Đã tạo symptoms_data.csv với {n_samples} mẫu, mỗi bệnh {samples_per_benh} mẫu")