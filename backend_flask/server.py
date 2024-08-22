import cv2
import numpy as np
from flask import Flask, request, jsonify
from flask_cors import CORS
import firebase_admin
from firebase_admin import credentials, db

cred = credentials.Certificate("C:\\Users\\Sabin\\Desktop\\SafyeApplication\\Safye\\backend_flask\\faces-46608-firebase-adminsdk-5rmhs-1e5078e6a0.json")

firebase_admin.initialize_app(cred, {
    'databaseURL': 'https://faces-46608-default-rtdb.europe-west1.firebasedatabase.app/'
})

app = Flask(__name__)
app.config['MAX_CONTENT_LENGTH'] = 8 * 1024 * 1024
CORS(app, resources={r"/*": {"origins": "*"}})
@app.errorhandler(404)
def resource_not_found(e):
    return jsonify(error=str(e)), 404

@app.errorhandler(500)
def internal_server_error(e):
    return jsonify(error=str(e)), 500

# @app.route('/')
# def hello():
#     return 'Hello, World!'

@app.route('/add_face', methods=['POST'])
def add_face():
    if 'multipart/form-data' not in request.content_type:
        return jsonify({"error": "Invalid content type"}), 400
    name = request.form.get('name')
    if not name:
        return jsonify({"error": "Name is missing from the form."}), 400

    faces_data_list = []

    files = request.files.getlist("images")
    if len(files) != 4:
        return jsonify({"error": "Exactly four images are required."}), 400 

    for file in files:
        npimg = np.frombuffer(file.read(), np.uint8)
        img = cv2.imdecode(npimg, cv2.IMREAD_COLOR)
        gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)

        face_cascade = cv2.CascadeClassifier(cv2.data.haarcascades + 'haarcascade_frontalface_default.xml')
        profile_cascade = cv2.CascadeClassifier(cv2.data.haarcascades + 'haarcascade_profileface.xml')

        faces_detected = face_cascade.detectMultiScale(gray, scaleFactor=1.1, minNeighbors=5, minSize=(30, 30))
        if len(faces_detected) == 0:
            faces_detected = profile_cascade.detectMultiScale(gray, scaleFactor=1.1, minNeighbors=5, minSize=(30, 30))
        
        if len(faces_detected) > 0:
            x, y, width, height = faces_detected[0]  #preiau doar prima fata
            crop_img = gray[y:y+height, x:x+width]
            resized_face = cv2.resize(crop_img, (100, 100))
            resized_face_flattened = resized_face.flatten().tolist()

            face_data = {
                'name': name,
                'location': {'x': int(x), 'y': int(y), 'width': int(width), 'height': int(height)},
                'features': resized_face_flattened
            }
        else:
            print("No face detected in image.")
            face_data = {
                'name': name,
                'location': {'x': 0, 'y': 0, 'width': 0, 'height': 0},
                'features': []
            }

        faces_data_list.append(face_data)

    faces_ref = db.reference('faces')
    for face_data in faces_data_list:
        faces_ref.child(name).push(face_data)
    return jsonify({"message": "Faces added successfully", "number_of_faces": len(faces_data_list)}), 200

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=8005)

