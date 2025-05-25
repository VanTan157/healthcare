FROM python:3.9

WORKDIR /app

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

RUN python scripts/generate_data.py
RUN python scripts/train_model.py
RUN rasa train --config rasa/config.yml --domain rasa/domain.yml --data rasa/data

ENV PYTHONPATH=/app:/app/rasa:/app/rasa/actions

CMD ["sh", "-c", "echo 'Container is ready'"]