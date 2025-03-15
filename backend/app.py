from flask import Flask, jsonify, request
from flask_cors import CORS
from websocket_manager import WebSocketManager
import random
import time

app = Flask(__name__)
CORS(app)
websocket_manager = WebSocketManager(app)

@app.route('/settings', methods=['GET'])
def get_settings():
    settings_data = {
 "data": [
 {
 "fridge_id": 1,
 "instrument_name": "instrument_one",
 "parameter_name": "flux_bias",
 "applied_value": 0.37,
 "timestamp": 1739596596
 },
 {
 "fridge_id": 2,
 "instrument_name": "instrument_two",
 "parameter_name": "temperature",
 "applied_value": -0.12,
 "timestamp": 1739597890
 },
 {
 "fridge_id": 3,
 "instrument_name": "instrument_three",
 "parameter_name": "power_level",
  "applied_value": 1.25,
 "timestamp": 1739601234
 },
 {
 "fridge_id": 1,
 "instrument_name": "instrument_four",
 "parameter_name": "current_bias",
 "applied_value": 0.89,
 "timestamp": 1739612345
 },
 {
 "fridge_id": 2,
 "instrument_name": "instrument_five",
 "parameter_name": "voltage",
 "applied_value": 0.02,
 "timestamp": 1739623456
 }
 ]
}
    
    return jsonify(settings_data)


@app.route('/live', methods=['GET'])
def start_live():
    """Endpoint to start live data streaming"""
    websocket_manager.start_live_data_stream()
    return jsonify({"status": "Live streaming started"})

@app.route('/stop-live', methods=['GET'])
def stop_live():
    """Endpoint to stop live data streaming"""
    websocket_manager.stop_live_data_stream()
    return jsonify({"status": "Live streaming stopped"})

@app.route('/settings/history', methods=['GET'])
def get_historical_data():
    page = request.args.get('page', 1, type=int)
    per_page = request.args.get('per_page', 20, type=int)
    
    # Generate paginated historical data
    historical_data = []
    for i in range(per_page):
        data = {
            "fridge_id": random.randint(1, 3),
            "instrument_name": f"instrument_{random.randint(1,5)}",
            "parameter_name": random.choice(["flux_bias", "temperature", "power_level"]),
            "applied_value": round(random.uniform(-1, 1), 2),
            "timestamp": int(time.time()) - ((page * per_page + i) * 3600)
        }
        historical_data.append(data)
    
    return jsonify({
        "data": historical_data,
        "page": page,
        "has_more": page < 5  # Limit to 5 pages for demo
    })

@app.route('/analytics', methods=['GET'])
def get_analytics():
    analytics = {
        "instrument_stats": {
            "instrument_one": {
                "avg_value": round(random.uniform(-0.5, 0.5), 2),
                "max_value": round(random.uniform(0.5, 1), 2),
                "min_value": round(random.uniform(-1, -0.5), 2),
                "total_readings": random.randint(100, 1000)
            },
            "instrument_two": {
                "avg_value": round(random.uniform(-0.5, 0.5), 2),
                "max_value": round(random.uniform(0.5, 1), 2),
                "min_value": round(random.uniform(-1, -0.5), 2),
                "total_readings": random.randint(100, 1000)
            }
        },
        "fridge_stats": {
            "1": {"total_operations": random.randint(1000, 5000)},
            "2": {"total_operations": random.randint(1000, 5000)},
            "3": {"total_operations": random.randint(1000, 5000)}
        }
    }
    return jsonify(analytics)

if __name__ == '__main__':
    # Change from app.run() to websocket_manager.socketio.run()
    websocket_manager.socketio.run(
        app, 
        host='0.0.0.0',
        port=8000, 
        debug=True,
        allow_unsafe_werkzeug=True  # Required for development
    )


