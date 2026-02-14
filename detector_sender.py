import cv2
import time
import requests
from ultralytics import YOLO

# --- CONFIGURATION ---
URL = "https://mimwpmgovpksdhdscnst.supabase.co/rest/v1/occupancy_logs"
# Your actual Anon Key
ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1pbXdwbWdvdnBrc2RoZHNjbnN0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzEwMjkyODMsImV4cCI6MjA4NjYwNTI4M30.f5KKCExSefD3KOSCO5XekUJupL4tkBXdK2JnBNPPFh4"

headers = {
    "apikey": ANON_KEY,
    "Authorization": f"Bearer {ANON_KEY}",
    "Content-Type": "application/json",
    "Prefer": "return=minimal"
}

# Load YOLOv8 Model (Pre-trained on 80 classes, class 0 is 'person')
model = YOLO('yolov8n.pt')

# Initialize Webcam
cap = cv2.VideoCapture(0)

last_sync_time = 0
sync_interval = 5  # Send data to Supabase every 5 seconds

def send_to_supabase(total, adults, kids):
    payload = {
        "count": total,
        "adults": adults,
        "kids": kids,
        "zone": "Front Entrance"
    }
    try:
        response = requests.post(URL, headers=headers, json=payload)
        if response.status_code == 201:
            print(f">>> SYNC SUCCESS: Total: {total} | Adults: {adults} | Kids: {kids}")
        else:
            print(f">>> SYNC ERROR: {response.status_code}")
    except Exception as e:
        print(f">>> CONNECTION FAILED: {e}")

print("--- SkyCount AI Live Feed Starting ---")
print("Press 'q' to quit.")

while cap.isOpened():
    success, frame = cap.read()
    if not success:
        break

    # Run Detection
    results = model(frame, classes=[0], conf=0.4, verbose=False)
    
    adult_count = 0
    kid_count = 0
    
    # Get bounding boxes
    for box in results[0].boxes:
        # Get coordinates: x1, y1, x2, y2
        coords = box.xyxy[0].tolist()
        height = coords[3] - coords[1]
        
        # Simple Logic: If person height is < 55% of frame height, they are a kid
        # Adjust '0.55' based on your camera distance
        frame_height = frame.shape[0]
        if height < (frame_height * 0.55):
            kid_count += 1
        else:
            adult_count += 1

    total_count = adult_count + kid_count

    # Auto-Sync every X seconds
    current_time = time.time()
    if current_time - last_sync_time > sync_interval:
        send_to_supabase(total_count, adult_count, kid_count)
        last_sync_time = current_time

    # Display UI
    annotated_frame = results[0].plot()
    cv2.putText(annotated_frame, f"Adults: {adult_count} Kids: {kid_count}", (20, 50), 
                cv2.FONT_HERSHEY_SIMPLEX, 1, (0, 255, 0), 2)
    
    cv2.imshow("SkyCount AI Feed", annotated_frame)

    if cv2.waitKey(1) & 0xFF == ord('q'):
        break

cap.release()
cv2.destroyAllWindows()