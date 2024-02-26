from flask import Flask, jsonify,request
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




    





if __name__ == "__main__":
    app.run(debug=True)
