FROM python:3.11-slim

# ✅ sqlite3 と gcc など最低限の依存をインストール
RUN apt update && \
    apt install -y sqlite3 gcc libpq-dev && \
    apt clean && \
    rm -rf /var/lib/apt/lists/*

WORKDIR /app

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

CMD ["python", "run.py"]
