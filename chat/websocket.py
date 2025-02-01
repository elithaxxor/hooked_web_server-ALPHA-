import websocket
import time
import socket

def get_local_ip():
    try:
        s = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
        s.connect(("8.8.8.8", 80))
        ip = s.getsockname()[0]
        s.close()
        return ip
    except Exception as e:
        print("\n[ERROR] Failed to get local IP:", e)
        return "127.0.0.1"

def on_open(ws):
    print("\n[INFO] Connected to WebSocket server")
    user_input = input("\n[INPUT] Say something: ")
    ws.send(user_input)

def on_message(ws, message):
    print(f"\n[RECEIVED] {message}")
    ws.close()

def on_error(ws, error):
    print(f"\n[ERROR] {error}")

def on_close(ws, close_status_code, close_msg):
    print("\n[INFO] Connection closed")

def connect_with_retry(url, retries=5, delay=2):
    print(f"\n[INFO] Attempting to connect to {url}")
    for attempt in range(retries):
        try:
            print(f"[INFO] Connection attempt {attempt + 1}...")
            ws = websocket.WebSocketApp(url, 
                                        on_open=on_open,
                                        on_message=on_message,
                                        on_error=on_error,
                                        on_close=on_close)
            ws.run_forever()
            break  # Exit loop if successful
        except Exception as e:
            print(f"[WARNING] Attempt {attempt + 1} failed: {e}")
            time.sleep(delay)
    else:
        print("\n[ERROR] Failed to connect after multiple attempts")

if __name__ == "__main__":
    ##websocket.enableTrace(False)
    local_ip = get_local_ip()
    print(f"\n[INFO] Local IP detected: {local_ip}")
    connect_with_retry(f"ws://{local_ip}/webserver/chat/")
