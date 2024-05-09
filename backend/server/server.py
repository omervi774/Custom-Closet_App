from flask import Flask, jsonify, request
from flask_cors import CORS
import firebase_admin
from firebase_admin import credentials, firestore
from openai import OpenAI
from dotenv import load_dotenv
import os

# Connect to openAI API
load_dotenv()
api_key = os.getenv('OPENAI_API_KEY')
if api_key is None:
    raise ValueError("OpenAI API key not found in environment variables.")
client = OpenAI(api_key=api_key)

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

@app.route("/stocks")
def get_stocks():
    collection_ref = db.collection("stocks")
    docs = collection_ref.stream()
    data = [{"id": doc.id, **doc.to_dict()} for doc in docs]
    return jsonify({"data": data})

@app.post("/stocks")
def add_new_field():
    collection_ref = db.collection("stocks")
    data = request.json
    collection_ref.add(data)
    return jsonify({"message": "document successfully added"}),201

@app.put("/stocks/<document_id>")
def update_field(document_id):
    data = request.json
    collection_ref = db.collection("stocks")
    document_ref = collection_ref.document(document_id)
    document_ref.update(data)
    print(document_ref.get().id)
    print(document_ref.get()._data)
    return jsonify({"id": document_ref.get().id,**document_ref.get()._data}),200

@app.delete("/stocks/<document_id>")
def delete_field(document_id):
    collection_ref = db.collection("stocks")
    document_ref = collection_ref.document(document_id)
    document_ref.delete()
    return jsonify({"message": "document successfully deleted"}),200

# AI chatbot
@app.post("/ai")
def chat():
    user_message = request.json.get("text") 

    # "role": "system", "content": "You are a kind helpful assistant. Your answer should always be in array format"
    # You need to help design a beautiful cabinet. The cabinets consist of \"cubes\" of sizes 1 meter. return the answer only in the format of a dictionary, where each key is a number starting from 0, represent a floor (layer) in the cabinet and each value is a list of the \"cubes\" positions that are in this layer. x, y, z represent the middle of the cube, where z is always 0. the cabinet must contain at least 2 layers.
    messages = [
        {"role": "system", "content": "You are a professional cabinet designer. Your answer should always be in dictionary (python) format. The cabinets consist of \"cubes\" of sizes 1 meter. Please provide the cabinet design specifications in the following format: {0: [(x1, y1, z), (x2, y2, z), ...], 1: [(x1, y1, z), (x2, y2, z), ...], ...}, where each key represents a layer and the value is a list of cube positions (x, y, z) in that layer. The z-coordinate is always 0! The cabinet must contain at least 2 layers. Be creative but always follow the rules!"
},
        {"role": "user", "content": user_message}
    ]
    chat = client.chat.completions.create(
        model="gpt-3.5-turbo", messages=messages
    ) 
    reply = chat.choices[0].message.content
    print(f"ChatGPT: {reply}")
    messages.append({"role": "assistant", "content": reply})
    return jsonify({"text": reply})



if __name__ == "__main__":
    app.run(debug=True)