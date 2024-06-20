from flask import Flask, jsonify, request
from flask_cors import CORS
import firebase_admin
from firebase_admin import credentials, firestore
from openai import OpenAI
from dotenv import load_dotenv
import json
import re
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
            "content": """You help a cabinet design company. The company's cabinets are built from rectangular "cells" of different sizes. The user will provide you with the size of the closet he wants and you have to design a beautiful and special closet for him (according to the sizes that the user gave you) according to the following rules: Your answer should always be in dictionary (python) format, don't add any additional text,
                        Please provide the cabinet design specifications in the following format: {0: [{position: [x1, y1, z], size: [x1_length, y1_hight]}, {position: [x2, y2, z], size: [x2_length, y2_hight]} ...], 1: [{position: [x1, y1, z], size: [x1_length, y1_hight]}, {position: [x2, y2, z], size: [x2_length, y2_hight]} ...], ...}, 
                        where each key represents a layer (floor in the closet) and the value is this: the "position" key is a list of coordinates representing the position of the CENTER of the cube in that layer and the "size" key represent the width and the hight of each cube.
                        The Z coordinate is always 0! The position of the center of the first cube at key 0 must be [0, 0, 0]. The cabinets consist of "parts" in sizes 1 meters, 2 meter and 3 meters.
                        The "y_hight" value of each cube must be 1. Therfore, the "size" key will always be [x_length, 1] and the "y" value of the "position" key will always be same as the layer number.
                        For example: Let's say the sizes the user gave us are 3 meters high and 4 meters wide, an example of a valid response is: {0: [{position: [0, 0, 0], size: [1, 1]}, {position: [1.5, 0, 0], size: [2, 1]}, {position: [3, 0, 0], size: [1, 1]}], 1: [{position: [0.5, 1, 0], size: [2, 1]}, {position: [2.5, 1, 0], size: [2, 1]}], 2: [{position: [0, 2, 0], size: [1, 1]}, {position: [1, 2, 0], size: [1, 1]}]}. This is just an example, be creative!
                        The example above is a valid response because the number of cells in each layer is different and the x-positions of cells are different across layers. In addition, the x-positions and the y-positions of cells are calculated correctly and the size of the cabinet is 3x4 meters.
                        The cabinet must contain at least 2 layers. Be creative but always follow the rules!
                        The calculation for the center of a new cube in x position is as following:
                        Take the x position value of the cube that you are connected to, add the x_length value from the "size" of the cube that you are connected divided by 2 and then add the new cube x_length divided by 2. Your answer should always be in dictionary (python) format, don't add any additional text, just the dictionary."""
        },
        {"role": "user", "content": f"{user_message} , I want you to be unique, don't just give me a boring closet design!"}
    ]

    def is_creative_response(design):
        layer_count = len(design)
        if layer_count < 2:
            return False  

        # Get the number of cells in each layer
        cell_counts = [len(design[layer]) for layer in design]

        # Check if the number of cells in each layer is the same
        if len(set(cell_counts)) == 1:
            # Check x-positions
            for i in range(cell_counts[0]):
                x_positions = [abs(design[layer][i]['position'][0]) for layer in design if i < len(design[layer])]
                if len(set(x_positions)) == 1:
                    return False  # Non-creative as x-positions match
        return True  # Design is creative

    def correct_x_positions(response):
        try:
            # Check if the response contains "```python"
            if "```python" in response:
                # Extract the JSON-like string from the response
                match = re.search(r"```python\s*(\{.*?\})\s*```", response, re.DOTALL)
                if not match:
                    raise ValueError("JSON-like content not found in the response")
                json_str = match.group(1)
            else:
                json_str = response

            # Replace single quotes with double quotes for JSON compatibility
            json_str = json_str.replace("'", '"')
            
            # Ensure keys are quoted correctly by using regex
            json_str = re.sub(r'(\w+):', r'"\1":', json_str)
            
            # Parse the JSON string into a dictionary
            data = json.loads(json_str)
            
            # Iterate through each layer
            for layer_key, cells in data.items():
                # Ensure cells is a list
                if not isinstance(cells, list):
                    continue
                
                # Iterate through each cell in the layer
                for i in range(len(cells)):
                    if i == 0 and layer_key == 0:
                        # First cell's x position should be 0
                        cells[i]['position'][0] = 0
                    elif i == 0:
                        continue
                    else:
                        # Calculate the correct x position for the current cell
                        prev_cell = cells[i - 1]
                        prev_x = prev_cell['position'][0]
                        prev_x_length = prev_cell['size'][0]
                        current_x_length = cells[i]['size'][0]
                        
                        expected_x = prev_x + (prev_x_length / 2) + (current_x_length / 2)
                        
                        # Check and correct the x position
                        if cells[i]['position'][0] != expected_x:
                            cells[i]['position'][0] = expected_x
            
            # Print the modified response
            modified_response = json.dumps(data, indent=4)
            print("Modified response:")
            print(modified_response)
            
            # Return the modified data
            return data
        
        except Exception as e:
            print(f"Error: {e}")
            return None

    # TODO - Check to see if the model can be replaced with the latest version (gpt-4o)

    chat = client.chat.completions.create(
        model="gpt-4", messages=messages
    )
    reply = chat.choices[0].message.content
    print(f"ChatGPT: {reply}")

    # Check if the initial response is creative
    initial_design = None
    try:
        initial_design = json.loads(reply.replace("'", '"').replace("```python", "").replace("```", "")) # Leave only the dictionary
    except json.JSONDecodeError:
        pass

    if initial_design and not is_creative_response(initial_design):
        messages.append({
            "role": "assistant",
            "content": "There was an issue with your response. Please ensure that the design is creative. The number of cells in each layer should not be the same and the x-positions of cells should be different across layers."
        })
        return jsonify({"text": "The response was not creative enough. Please try again."})

    # Correct the x positions
    corrected_reply = correct_x_positions(reply)
    print(f"Corrected response: {corrected_reply}")

    if corrected_reply is None:
        return jsonify({"text": "The response was not in a valid format."})

    if not is_creative_response(corrected_reply):
        messages.append({
            "role": "assistant",
            "content": "There was an issue with your response. Please ensure that the design is creative. The number of cells in each layer should not be the same and the x-positions of cells should be different across layers."
        })
        return jsonify({"text": "The response was not creative enough. Please try again."})

    messages.append({"role": "assistant", "content": json.dumps(corrected_reply, indent=4)})
    return jsonify({"text": json.dumps(corrected_reply, indent=4)})


if __name__ == "__main__":
    app.run(debug=True)

