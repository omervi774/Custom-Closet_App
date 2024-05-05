from flask import Flask, jsonify, request
from flask_cors import CORS
import firebase_admin
from firebase_admin import credentials, firestore
# import googletrans
# from googletrans import Translator
from openai import OpenAI
from dotenv import load_dotenv
import os


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

# Initialize the translator
# translator = Translator()

@app.route("/")

def get_data():
    data = {"message": "This is JSON data from the server!"}
    return jsonify(data)


# @app.route("/get_data", methods=["GET"])
# def get_data1():
#     # Example: Retrieve data from a Firestore collection
#     data = []
#     collection_ref = db.collection("orders")
#     docs = collection_ref.stream()
#     for doc in docs:
#         data.append(doc.to_dict())

#     return jsonify({"data": data})

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
    # print(data)
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



@app.post("/ai")
def chat():
    user_message = request.json.get("text") 
    
    messages = [
        {"role": "system", "content": "You are a kind helpful assistant."},
        {"role": "user", "content": user_message}
    ]

    chat = client.chat.completions.create(
        model="gpt-3.5-turbo", messages=messages
    )
        
    reply = chat.choices[0].message.content
    print(f"ChatGPT: {reply}")
    messages.append({"role": "assistant", "content": reply})
    return jsonify({"text": reply})




#     messages = [
#     {"role": "system", "content": "You are a kind helpful assistant."},
# ]

#     # Initialize chat object outside the loop
#     chat = openai.ChatCompletion.create(model="gpt-3.5-turbo", messages=messages)

#     while True:
#         # Replace this line with your mechanism to get input from the user
#         message = translated_data['text']

#         if message:
#             messages.append({"role": "user", "content": message})
#             try:
#                 # Call OpenAI API to continue the conversation
#                 chat = openai.ChatCompletion.create(model="gpt-3.5-turbo", messages=messages)
#                 reply = chat.choices[0].message.content
#                 print(f"ChatGPT: {reply}")
#                 messages.append({"role": "assistant", "content": reply})
#             except Exception as e:
#                 print(f"An error occurred: {str(e)}")


    # ---------------------------------------Translate & Chat-----------------------------------------------------------------


        # @app.post("/ai")
        # def translate_and_chat():
        #     data = request.json
        #     translated_text = translator.translate(data['text'], src='he', dest='en').text

        #     # Set up the chat with translated user input
        #     chat = openai.ChatCompletion.create(
        #         model="gpt-3.5-turbo",
        #         messages=[{"role": "system", "content": "You are a helpful assistant."},
        #                   {"role": "user", "content": translated_text}]
        #     )

        #     # Get the response from the chat and translate it back to Hebrew
        #     chat_response = chat['choices'][0]['message']['content']
        #     translated_response = translator.translate(chat_response, src='en', dest='he').text

        #     return jsonify({"translated_text": translated_response})

    # ------------------------------------------------------------------------------------------------------------------------

if __name__ == "__main__":
    app.run(debug=True)