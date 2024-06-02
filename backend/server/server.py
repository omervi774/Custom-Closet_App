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

@app.post('/orders')
def add_new_order():
    collection_ref = db.collection("orders")
    data = request.json
    collection_ref.add(data)
    return jsonify({"message": "document successfully added"}),201

@app.route("/orders")
def get_orders():
    collection_ref = db.collection("orders")
    docs = collection_ref.stream()
    data = [{"id": doc.id, **doc.to_dict()} for doc in docs]
    return jsonify({"data": data})

@app.delete("/orders/<document_id>")
def delete_order(document_id):
    collection_ref = db.collection("orders")
    document_ref = collection_ref.document(document_id)
    document_ref.delete()
    return jsonify({"message": "document successfully deleted"}),200

@app.route("/homePage")
def get_home_page_data():
    collection_ref = db.collection("homePage")
    docs = collection_ref.stream()
    data = [{"id": doc.id, **doc.to_dict()} for doc in docs]
    return jsonify({"data": data})

@app.put("/homePage/<document_id>")
def update_home_page_field(document_id):
    data = request.json
    collection_ref = db.collection("homePage")
    document_ref = collection_ref.document(document_id)
    document_ref.update(data)
    print(document_ref.get().id)
    print(document_ref.get()._data)
    return jsonify({"id": document_ref.get().id,**document_ref.get()._data}),200

# AI chatbot
@app.post("/ai")
def chat():
    user_message = request.json.get("text") 

    messages = [
        {
            "role": "system", 
            "content": """You help a cabinet design company. The company's cabinets are built from rectangular "cells" of different sizes. The user will provide you with the size of the closet he wants and you have to design a beautiful and special closet for him according to the following rules: Your answer should always be in dictionary (python) format. 
                        Please provide the cabinet design specifications in the following format: {0: [{position: [x1, y1, z], size: [x1_length, y1_hight]}, {position: [x2, y2, z], size: [x2_length, y2_hight]} ...], 1: [{position: [x1, y1, z], size: [x1_length, y1_hight]}, {position: [x2, y2, z], size: [x2_length, y2_hight]} ...], ...}, 
                        where each key represents a layer (floor in the closet) and the value is this: the "position" key is a list of coordinates representing the position of the CENTER of the cube in that layer and the "size" key represent the width and the hight of each cube.
                        The Z coordinate is always 0! The position of the center of the first cube at key 0 must be [0, 0, 0]. The cabinets consist of "parts" in sizes 1 meters, 2 meter and 3 meters.
                        The cabinet must contain at least 2 layers. Be creative but always follow the rules!
                        The calculation for the center of a new cube in x position is as following:
                        Take the x position value of the cube that you are connected to, add the x_length value from the "size" of the cube that you are connected divided by 2 and then add the new cube x_length divided by 2."""
        },
        {"role": "user", "content": f"{user_message} , I want you to be unique, don't just give me a boring closet design!"}
    ]
    
    def is_valid_response(response):
        try:
            design = eval(response)
            for layer in design.values():
                seen_positions = set()
                for cube in layer:
                    if cube[2] != 0 or tuple(cube) in seen_positions:
                        return False
                    seen_positions.add(tuple(cube))
            return True
        except:
            return False

    # while True:
    chat = client.chat.completions.create(
        model="gpt-4o", messages=messages
    )
    reply = chat.choices[0].message.content
    print(f"ChatGPT: {reply}")

    # TODO: Add check for creativity
    # TODO: loop and fix positions by the calculation formula

        # if is_valid_response(reply):
        #     break
        # else:
        #     messages.append({
        #         "role": "assistant", 
        #         "content": "There was an issue with your response. Please ensure that the z-coordinate is 0 for all cubes and that all cube positions are unique."
        #     })

    messages.append({"role": "assistant", "content": reply})
    return jsonify({"text": reply})



if __name__ == "__main__":
    app.run(debug=True)



# client.chat.completions.create

# "You are a professional closet designer. Your answer should always be in dictionary (python) format. Please provide the closet design specifications in the following format: {0: [(x1, y1, z), (x2, y2, z), ...], 1: [(x1, y1, z), (x2, y2, z), ...], ...}, where each key represents a layer (a floor in the closet) and the value is a list of coordinate that represents the position of the center of the cube in that layer. The z-coordinate is always 0! The cabinets consist of \"parts\" of sizes 0.5 meter 1 meter and 1.5 meter. The closet must contain at least 2 layers. Be creative but always follow the rules!"