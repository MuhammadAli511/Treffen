from flask import Flask, request, jsonify
from flask_pymongo import PyMongo, MongoClient
from flask_cors import CORS, cross_origin
from werkzeug.security import generate_password_hash, check_password_hash
import time
from agora_token_builder import RtcTokenBuilder,RtmTokenBuilder
import base64
import uuid
import cv2
import numpy as np
import os
from matplotlib import pyplot as plt
import time
import mediapipe as mp

mp_holistic = mp.solutions.holistic # Holistic model
mp_drawing = mp.solutions.drawing_utils # Drawing utilities
def mediapipe_detection(image, model):
    image.flags.writeable = False                  
    results = model.process(image)                 
    image.flags.writeable = True                   
    image = cv2.cvtColor(image, cv2.COLOR_RGB2BGR) 
    return image, results

def draw_landmarks(image, results):
    mp_drawing.draw_landmarks(image, results.left_hand_landmarks, mp_holistic.HAND_CONNECTIONS) # Draw left hand connections
    mp_drawing.draw_landmarks(image, results.right_hand_landmarks, mp_holistic.HAND_CONNECTIONS) # Draw right hand connections

def draw_styled_landmarks(image, results):
    # Draw left hand connections
    mp_drawing.draw_landmarks(image, results.left_hand_landmarks, mp_holistic.HAND_CONNECTIONS, mp_drawing.DrawingSpec(color=(121,22,76), thickness=2, circle_radius=4), mp_drawing.DrawingSpec(color=(121,44,250), thickness=2, circle_radius=2)) 
    # Draw right hand connections  
    mp_drawing.draw_landmarks(image, results.right_hand_landmarks, mp_holistic.HAND_CONNECTIONS, mp_drawing.DrawingSpec(color=(245,117,66), thickness=2, circle_radius=4), mp_drawing.DrawingSpec(color=(245,66,230), thickness=2, circle_radius=2)) 


def extract_keypoints(results):
    lh = np.array([[res.x, res.y, res.z] for res in results.left_hand_landmarks.landmark]).flatten() if results.left_hand_landmarks else np.zeros(21*3)
    rh = np.array([[res.x, res.y, res.z] for res in results.right_hand_landmarks.landmark]).flatten() if results.right_hand_landmarks else np.zeros(21*3)
    return np.concatenate([lh, rh])

class User:
    def __init__(self, firstName, lastName, email, password):
        self.firstName = firstName
        self.lastName = lastName
        self.email = email
        self.password = password

app = Flask(__name__)
CORS(app, support_credentials=True)
app.config['CORS_HEADERS'] = 'Content-Type'
client = MongoClient('mongodb+srv://treffen:treffen123@cluster0.qrreehv.mongodb.net/?retryWrites=true&w=majority')
db = client.Treffen

@app.route('/')
def index():
    return 'Base route index is working'

@app.route('/api/auth/register', methods=['GET', 'POST'])
@cross_origin(supports_credentials=True)
def register():
    if request.method == 'POST':
        users = db.users
        existing_user = users.find_one({'email' : request.json['email']})


        if existing_user is None:
            hashpass = generate_password_hash(request.json['password'])
            users.insert_one({'firstName' : request.json['firstName'],'lastName' : request.json['lastName'],'email' : request.json['email'],'password':hashpass})
            return jsonify({'status' : 'success','message' : 'registered'})

        return jsonify({'error' : 'Email already exists'})
    return ""



@app.route('/api/auth/login', methods=['GET', 'POST'])
def login():
    if request.method == 'POST':
        users = db.users
        existing_user = users.find_one({'email' : request.json['email']})

        if existing_user:
            if check_password_hash(existing_user['password'], request.json['password']):
                print("Logged In")
                return jsonify({'status' : 'success', 'message' : 'Logged in successfully'})

        return jsonify({'error' : 'Invalid email/password combination'})

    return ""


@app.get("/api/auth/generate/token/rtc")
def generate_user_rtc():
    parameters = request.args
    channelName = parameters.get("channel")
    appID = "5f6b6ab3b6cc4362b19410cae478961c"
    appCertificate = "859ee2f1f4b041fe83f84a5fb162e317"
    uid = 0
    role = 1
    expireTimeInSeconds = 3600
    currentTimestamp = (int)(time.time())
    privilegeExpiredTs = currentTimestamp + expireTimeInSeconds
    token = RtcTokenBuilder.buildTokenWithUid(appID, appCertificate, channelName, uid, role, privilegeExpiredTs)
    print(token)
    return ({'uid': uid, 'token': token})

@app.get("/api/auth/generate/token/rtm")
def generate_user_rtm():
    parameters = request.args
    uid=parameters.get("uid") or uuid.uuid4()
    #check if uid is not string
    expireTimeInSeconds = 3600
    appID = "5f6b6ab3b6cc4362b19410cae478961c"
    appCertificate = "859ee2f1f4b041fe83f84a5fb162e317"
    currentTimestamp = (int)(time.time())
    privilegeExpiredTs = currentTimestamp + expireTimeInSeconds
    token = RtmTokenBuilder.buildToken(appID, appCertificate, uid, 1, privilegeExpiredTs)
    print(token)
    return ({'uid': uid, 'token': token})   

@app.post("/api/sendframes")
def getFrames():
    data=request.json['data']
    counter = 0
    for i in data:
        imgStr = i.replace("data:image/jpeg;base64,", "")
        imgdata = base64.b64decode(imgStr)
        filename = 'image' + str(counter) + '.jpeg'
        with open(filename, 'wb') as f:
            f.write(imgdata)
        # read image with opencv
        with mp_holistic.Holistic(min_detection_confidence=0.5, min_tracking_confidence=0.5) as holistic:
            image1 = cv2.imread(filename)
            image1, results = mediapipe_detection(image1, holistic)
            draw_landmarks(image1, results)
            keypoints = extract_keypoints(results)
            npy_path = "data/{}.npy".format(counter)
            np.save(npy_path, keypoints)
            cv2.imwrite('landmarks/{}'.format(filename), image1)
        counter += 1

    return ({'status':"Success"})


if __name__ == '__main__':
    app.run(debug=True)