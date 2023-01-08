# American Sign Language to Speech
# Web Based Video Conferencing App

The app consists of two folders frontend and backend

## Backend
1. Download the dataset from https://drive.google.com/drive/folders/1USXPblPWKl5BRwUIf_fIL4O_bubrswSx?usp=share_link

2. Place the dataset in the backend folder

3. Install the dependencies in the backend folder using the command

```bash
pip install -r requirements.txt
```

4. The backend folder structure should look like this

```bash
backend
├── app.py
├── preprocessing.ipynb
├── requirements.txt
├── 100words
│   ├── accident
│   ├── africa
│   ├── again
│       ├── 10000.mp4
│       ├── 10001.mp4
│       ├── 10002.mp4

```

5. In the preprocessing.ipynb file run the normalization script

6. It will resize the videos and save it in the ResizedVideos folder

7. Next run the augmentation script

8. It will augment the videos and save it in the same ResizedVideos folder

9. The ResizedVideos folder should look like this

10. Run the app.py file

```bash
python app.py
```

11. The app will run on http://localhost:5000/

12. MongoDB should be installed and running on the system



## Frontend

1. Install the dependencies in the frontend folder using the command

```bash
npm install
```

2. Run the app using the command

```bash
npm start
```

3. The app will run on http://localhost:3000/

## Demo

1. Create an account

2. Login

3. Click on the start meeting button

4. Invite a friend to join the meeting

5. To send frames to the backend click on the person button at the bottom right

6. The landmarks and npy files will be saved in the backend folder