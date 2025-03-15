from flask_socketio import SocketIO
import random
import time
from threading import Thread

class WebSocketManager:
    def __init__(self, app):
        self.socketio = SocketIO(
            app, 
            cors_allowed_origins="*",
            async_mode='threading',
            logger=True,
            engineio_logger=True
        )
        self.should_run = False
        self.data_thread = None

        @self.socketio.on('connect')
        def handle_connect(auth):
            print("Client connected")
            self.start_live_data_stream()

        @self.socketio.on('disconnect')
        def handle_disconnect():
            print("Client disconnected")
            self.stop_live_data_stream()

        @self.socketio.on('error')
        def handle_error(error):
            print(f"WebSocket error: {error}")

    def start_live_data_stream(self):
        if not self.should_run:
            self.should_run = True
            self.data_thread = Thread(target=self._generate_data)
            self.data_thread.daemon = True
            self.data_thread.start()
            print("Started live data stream")

    def stop_live_data_stream(self):
        self.should_run = False
        if self.data_thread and self.data_thread.is_alive():
            self.data_thread.join(timeout=1)
        print("Stopped live data stream")

    def _generate_data(self):
        while self.should_run:
            try:
                data = {
                    "fridge_id": random.randint(1, 3),
                    "instrument_name": f"instrument_{random.randint(1,5)}",
                    "parameter_name": random.choice(["flux_bias", "temperature", "power_level"]),
                    "applied_value": round(random.uniform(-1, 1), 2),
                    "timestamp": int(time.time())
                }
                print(f"Emitting data: {data}")
                self.socketio.emit('new_data', data)
                time.sleep(2)
            except Exception as e:
                print(f"Error generating data: {e}")
                self.should_run = False
                break