import json
import asyncio
import numpy as np
import random
from fastapi import FastAPI, WebSocket
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.websocket("/ws/telemetry")
async def websocket_telemetry(websocket: WebSocket):
    await websocket.accept()
    
    try:
        while True:
            # Generate fake "human movement" data for the 10x10 grid
            grid = np.zeros(100, dtype=int)
            # Simulate 3-5 "blobs" of people moving
            for _ in range(random.randint(3, 6)):
                pos = random.randint(0, 99)
                grid[pos] = random.randint(70, 100) # Hot spot
            
            payload = {
                "total_count": random.randint(10, 50),
                "grid": grid.tolist(),
                "status": "Simulated"
            }
            
            await websocket.send_text(json.dumps(payload))
            await asyncio.sleep(0.5) # Update every half second
            
    except Exception as e:
        print(f"Socket closed: {e}")
if __name__ == "__main__":
    import uvicorn
    print("🚀 SkyCount AI Engine Starting on http://0.0.0.0:8000")
    uvicorn.run(app, host="0.0.0.0", port=8000)
