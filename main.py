import os
from datetime import datetime
from typing import List

from fastapi import FastAPI, WebSocket, WebSocketDisconnect
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy import create_engine, Column, Integer, DateTime
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker

# --- 1. DATABASE CONFIGURATION ---
# We use the URL you provided. SQLAlchemy 1.4+ needs "postgresql://"
RAW_DB_URL = "postgres://pxxluser_mllo7jog962529c:3349bfec0e006e53a019ea7b0fa640961dc1afb7f8256955cff19d362ed77ec7@db.pxxl.pro:28732/pxxldb_mllo7jog2e036a8"
if RAW_DB_URL.startswith("postgres://"):
    DATABASE_URL = RAW_DB_URL.replace("postgres://", "postgresql://", 1)
else:
    DATABASE_URL = RAW_DB_URL

engine = create_engine(DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

# Define the table to store history
class OccupancyLog(Base):
    __tablename__ = "occupancy_logs"
    id = Column(Integer, primary_key=True, index=True)
    count = Column(Integer)
    timestamp = Column(DateTime, default=datetime.utcnow)

# Create the table in the DB immediately on startup
Base.metadata.create_all(bind=engine)

# --- 2. FASTAPI SETUP ---
app = FastAPI(title="SkyCount AI Backend")

# Allow your Vercel URL to talk to this backend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # Change this to your Vercel domain later for security
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# --- 3. LIVE CONNECTION MANAGER ---
class ConnectionManager:
    def __init__(self):
        self.active_connections: List[WebSocket] = []

    async def connect(self, websocket: WebSocket):
        await websocket.accept()
        self.active_connections.append(websocket)

    def disconnect(self, websocket: WebSocket):
        self.active_connections.remove(websocket)

    async def broadcast(self, message: str):
        for connection in self.active_connections:
            await connection.send_text(message)

manager = ConnectionManager()

# --- 4. ROUTES & ENDPOINTS ---

@app.get("/")
def home():
    return {"status": "SkyCount Backend is Live", "database": "Connected"}

@app.get("/history")
def get_history():
    """Fetch the last 50 entries from the database to show on the dashboard"""
    db = SessionLocal()
    logs = db.query(OccupancyLog).order_by(OccupancyLog.timestamp.desc()).limit(50).all()
    db.close()
    return logs

@app.websocket("/ws")
async def websocket_endpoint(websocket: WebSocket):
    """Handles live updates between AI engine and Frontend"""
    await manager.connect(websocket)
    try:
        while True:
            # Wait for data from your AI camera script
            data = await websocket.receive_json()
            
            # 1. Save to Database
            db = SessionLocal()
            new_log = OccupancyLog(count=data["count"])
            db.add(new_log)
            db.commit()
            db.close()

            # 2. Broadcast to all open dashboards (Vercel)
            await manager.broadcast(f'{{"count": {data["count"]}, "timestamp": "{datetime.utcnow()}"}}')
            
    except WebSocketDisconnect:
        manager.disconnect(websocket)

if __name__ == "__main__":
    import uvicorn
    # PXXL usually expects port 8080 or 8000
    uvicorn.run(app, host="0.0.0.0", port=8000)