import requests

URL = "https://mimwpmgovpksdhdscnst.supabase.co/rest/v1/occupancy_logs"
ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1pbXdwbWdvdnBrc2RoZHNjbnN0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzEwMjkyODMsImV4cCI6MjA4NjYwNTI4M30.f5KKCExSefD3KOSCO5XekUJupL4tkBXdK2JnBNPPFh4"

headers = {
    "apikey": ANON_KEY,
    "Authorization": f"Bearer {ANON_KEY}",
    "Content-Type": "application/json",
    "Prefer": "return=minimal"
}

def send_detailed_update(adult_count, kid_count):
    total = adult_count + kid_count
    payload = {
        "count": total, 
        "adults": adult_count, 
        "kids": kid_count,
        "zone": "Main Entrance"
    }
    try:
        response = requests.post(URL, headers=headers, json=payload)
        if response.status_code == 201:
            print(f"Sent: Total {total} (Adults: {adult_count}, Kids: {kid_count})")
        else:
            print(f"Error: {response.text}")
    except Exception as e:
        print(f"Failed: {e}")

if __name__ == "__main__":
    # Test: 18 adults, 7 kids
    send_detailed_update(18, 7)
