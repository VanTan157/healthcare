from typing import Any, Text, Dict, List
from rasa_sdk import Action, Tracker
from rasa_sdk.executor import CollectingDispatcher
from rasa_sdk.events import SlotSet
import json
import os
import pickle
import logging
import re

logger = logging.getLogger(__name__)

# Đường dẫn trong container
MODEL_PATH = os.path.join(os.path.dirname(__file__), '../../data/model.pkl')
TRIEU_CHUNG_PATH = os.path.join(os.path.dirname(__file__), '../../data/trieu_chung.json')
MEDICATION_PATH = os.path.join(os.path.dirname(__file__), '../../data/medications.json')

# Tải mô hình và danh sách triệu chứng
try:
    with open(MODEL_PATH, 'rb') as f:
        MODEL = pickle.load(f)
    with open(TRIEU_CHUNG_PATH, 'r') as f:
        TRIEU_CHUNG = json.load(f)
    with open(MEDICATION_PATH, 'r') as f:
        MEDICATIONS = json.load(f)
except FileNotFoundError as e:
    logger.error(f"Không tìm thấy tệp: {str(e)}")
    raise FileNotFoundError(f"Không tìm thấy tệp: {str(e)}")

# Từ điển ánh xạ biến thể tiếng Việt
TRIEU_CHUNG_VARIANTS = {
    'sot': ['sốt', 'sốt cao', 'nóng sốt', 'sốt nhẹ', 'tăng nhiệt độ'],
    'ho': ['ho', 'ho khan', 'ho có đờm', 'ho nhiều', 'khục khặc'],
    'dau_dau': ['đau đầu', 'nhức đầu', 'đau nửa đầu', 'đau đầu dữ dội'],
    'met_moi': ['mệt mỏi', 'mệt', 'kiệt sức', 'yếu sức', 'mệt lả'],
    'dau_bung': ['đau bụng', 'đau dạ dày', 'đau vùng bụng', 'đau quặn bụng'],
    'dau_hong': ['đau họng', 'rát họng', 'đau cổ họng', 'ngứa họng'],
    'buon_non': ['buồn nôn', 'nôn nao', 'muốn nôn', 'cảm giác nôn'],
    'tieu_chay': ['tiêu chảy', 'đi ngoài', 'đi lỏng', 'phân lỏng'],
    'phat_ban': ['phát ban', 'nổi mẩn', 'mẩn đỏ', 'da nổi đỏ'],
    'kho_tho': ['khó thở', 'thở khó', 'nghẹt thở', 'thở gấp'],
    'dau_nguc': ['đau ngực', 'tức ngực', 'đau vùng ngực'],
    'dau_khop': ['đau khớp', 'nhức khớp', 'đau xương khớp', 'đau cơ khớp'],
    'chong_mat': ['chóng mặt', 'hoa mắt', 'đầu óc quay cuồng'],
    'non_mua': ['nôn mửa', 'ói mửa', 'nôn', 'nôn ra thức ăn'],
    'so_mui': ['sổ mũi', 'ngạt mũi', 'chảy nước mũi', 'mũi chảy']
}

# Danh sách bệnh từ medications.json
BENH_LIST = list(MEDICATIONS.keys())

class ActionChanDoanBenh(Action):
    def name(self) -> Text:
        return "action_chan_doan_benh"

    def run(self, dispatcher: CollectingDispatcher, tracker: Tracker, domain: Dict[Text, Any]) -> List[Dict[Text, Any]]:
        # Lấy tin nhắn người dùng
        trieu_chung_text = tracker.latest_message.get('text', '').lower().strip()
        logger.info(f"Tin nhắn người dùng: {trieu_chung_text}")

        # Chuyển đổi triệu chứng thành vector
        trieu_chung_vector = [0] * len(TRIEU_CHUNG)
        detected_symptoms = []
        for i, tc in enumerate(TRIEU_CHUNG):
            for variant in TRIEU_CHUNG_VARIANTS[tc]:
                if re.search(r'\b' + re.escape(variant) + r'\b', trieu_chung_text):
                    trieu_chung_vector[i] = 1
                    detected_symptoms.append(variant)
                    break

        logger.info(f"Triệu chứng phát hiện: {detected_symptoms}")
        logger.info(f"Vector triệu chứng: {trieu_chung_vector}")

        # Kiểm tra nếu không phát hiện triệu chứng
        if sum(trieu_chung_vector) == 0:
            dispatcher.utter_message(
                text="Tôi không nhận diện được triệu chứng nào từ mô tả của bạn. "
                     "Vui lòng mô tả rõ hơn, ví dụ: 'Tôi bị sốt, ho, đau họng'."
            )
            return []

        # Dự đoán bệnh
        try:
            benh = MODEL.predict([trieu_chung_vector])[0].replace('_', ' ')
            logger.info(f"Chẩn đoán: {benh}")
            response_text = f"Dựa trên các triệu chứng ({', '.join(detected_symptoms)}), bạn có thể mắc {benh}. Vui lòng gặp bác sĩ để được chẩn đoán và điều trị chính xác."
            dispatcher.utter_message(text=response_text)
            return [SlotSet("diagnosis", benh), SlotSet("symptoms", detected_symptoms)]
        except Exception as e:
            logger.error(f"Lỗi khi chẩn đoán: {str(e)}")
            dispatcher.utter_message(
                text="Đã xảy ra lỗi khi chẩn đoán bệnh. Vui lòng cung cấp lại triệu chứng hoặc thử lại sau."
            )
            return []

class ActionGoiYThuoc(Action):
    def name(self) -> Text:
        return "action_goi_y_thuoc"

    def run(self, dispatcher: CollectingDispatcher, tracker: Tracker, domain: Dict[Text, Any]) -> List[Dict[Text, Any]]:
        # Lấy slot diagnosis
        diagnosis = tracker.get_slot("diagnosis") or "unknown"
        # Nếu diagnosis chứa hai lần chữ "bệnh", chỉ giữ lại một
        if diagnosis.lower().count("bệnh") > 1:
            diagnosis = re.sub(r'(bệnh\s*)+', 'bệnh ', diagnosis, flags=re.IGNORECASE).strip()
        # Nếu diagnosis không chứa chữ "bệnh", thêm vào đầu
        if "bệnh" not in diagnosis.lower():
            diagnosis = "bệnh " + diagnosis
        trieu_chung_text = tracker.latest_message.get('text', '').lower().strip()
        logger.info(f"Yêu cầu gợi ý thuốc, slot diagnosis: {diagnosis}, tin nhắn: {trieu_chung_text}")

        # Nếu diagnosis là "unknown", thử trích xuất tên bệnh từ tin nhắn
        if diagnosis == "unknown":
            for benh in BENH_LIST:
                if benh.lower() in trieu_chung_text.replace('_', ' '):
                    diagnosis = benh
                    logger.info(f"Phát hiện bệnh từ tin nhắn: {diagnosis}")
                    break

        # Lấy thông tin thuốc
        medication_info = MEDICATIONS.get(diagnosis, {
            "thuoc": "Không có gợi ý thuốc cụ thể",
            "huong_dan": "",
            "luu_y": ""
        })

        if medication_info["thuoc"] == "Không có gợi ý thuốc cụ thể":
            dispatcher.utter_message(
                text=f"Không tìm thấy gợi ý thuốc cho bệnh {diagnosis}. "
                     f"Vui lòng gặp bác sĩ để được kê đơn phù hợp."
            )
        else:
            dispatcher.utter_message(
                text=f"Gợi ý điều trị cho bệnh {diagnosis}:\n"
                     f"- Thuốc: {medication_info['thuoc']}\n"
                     f"- Hướng dẫn: {medication_info['huong_dan']}\n"
                     f"- Lưu ý: {medication_info['luu_y']}"
            )
        return [SlotSet("diagnosis", diagnosis)]  # Lưu diagnosis để sử dụng tiếp

class ActionDatLichHen(Action):
    def name(self) -> Text:
        return "action_dat_lich_hen"

    def run(self, dispatcher: CollectingDispatcher, tracker: Tracker, domain: Dict[Text, Any]) -> List[Dict[Text, Any]]:
        patient_id = tracker.get_slot("patient_id") or tracker.sender_id
        try:
            response = requests.get("http://api_gateway:8080/api/doctors/", timeout=5)
            response.raise_for_status()
            doctors = response.json().get("doctors", [])
            if doctors:
                doctor = doctors[0]["name"]
                appointment_response = requests.post(
                    "http://api_gateway:8080/api/appointments/",
                    json={"patient_id": patient_id, "doctor": doctor},
                    timeout=5
                )
                appointment_response.raise_for_status()
                appointment = appointment_response.json().get("appointment", {})
                dispatcher.utter_message(
                    text=f"Lịch hẹn với bác sĩ {doctor} đã được đặt vào {appointment.get('time', 'thời gian chưa xác định')}."
                )
            else:
                dispatcher.utter_message(text="Không tìm thấy bác sĩ nào để đặt lịch.")
        except requests.RequestException as e:
            logger.error(f"Lỗi khi đặt lịch hẹn: {str(e)}")
            dispatcher.utter_message(text=f"Đã xảy ra lỗi khi đặt lịch hẹn: {str(e)}. Vui lòng thử lại.")
        return []

class ActionHoiLaiTrieuChung(Action):
    def name(self) -> Text:
        return "action_hoi_lai_trieu_chung"

    def run(self, dispatcher: CollectingDispatcher, tracker: Tracker, domain: Dict[Text, Any]) -> List[Dict[Text, Any]]:
        dispatcher.utter_message(text="Bạn có thể mô tả thêm các triệu chứng bạn đang gặp phải không?")
        return []

class ActionXacNhanTrieuChung(Action):
    def name(self) -> Text:
        return "action_xac_nhan_trieu_chung"

    def run(self, dispatcher: CollectingDispatcher, tracker: Tracker, domain: Dict[Text, Any]) -> List[Dict[Text, Any]]:
        symptoms = tracker.latest_message.get("text", "")
        dispatcher.utter_message(
            text=f"Tôi đã ghi nhận triệu chứng: {symptoms}. Bạn có muốn tiếp tục chẩn đoán bệnh không?"
        )
        return []