from flask import Flask, jsonify
from flask_cors import CORS
import firebase_admin
from firebase_admin import credentials, firestore


app = Flask(__name__)
CORS(app)
# Use the path to your service account JSON file
cred = credentials.Certificate(".\custom-closet-app-firebase-adminsdk-tetxw-78acf01b55.json")
firebase_admin.initialize_app(cred)

# Get a Firestore client
db = firestore.client()

@app.route("/")

def get_data():
    data = {"message": "This is JSON data from the server!"}
    return jsonify(data)

@app.route("/orders")


def get_orders():
    data = {"message": "iyar azain"}
    return jsonify(data)

@app.route("/get_data", methods=["GET"])
def get_data1():
    # Example: Retrieve data from a Firestore collection
    data = []
    collection_ref = db.collection("orders")
    docs = collection_ref.stream()
    for doc in docs:
        data.append(doc.to_dict())

    return jsonify({"data": data})

if __name__ == "__main__":
    app.run(debug=True)
