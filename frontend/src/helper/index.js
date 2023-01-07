export const registerUser = ({ firstName, lastName, email, password }) =>
  fetch(`${"http://localhost:5000/api"}/auth/register`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json"
    },
    body: JSON.stringify({ firstName, lastName, email, password }),
}).then((res) => res.json());

export const loginUser = ({ email, password }) =>
  fetch(`${"http://localhost:5000/api"}/auth/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      "Access-Control-Allow-Origin": "*",
    },
    body: JSON.stringify({ email, password }),
}).then((res) => res.json());


//input from for meeting id 

export const getMeetingId = (meetingId) =>{
  fetch(`${"http://localhost:5000/api"}/meeting/${meetingId}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify({ meetingId}),
}).then((res) => res.json())};

export const getRtcToken = ({ channelName }) =>
  fetch(`${"http://localhost:5000/api"}/auth/generate/token/rtc?channel=${channelName}`, {
    method: "GET",
    headers: {
      "Access-Control-Allow-Origin": "*",
    },
  }).then((res) => res.json());

export const getRtmToken = (uid) =>
  fetch(`${"http://localhost:5000/api"}/auth/generate/token/rtm?uid=${uid}`, {
    method: "GET",
    headers: {
      "Access-Control-Allow-Origin": "*",
    },
  }).then((res) => res.json());

export const sendFrames = (data) =>
  fetch(`${"http://localhost:5000/api"}/sendframes`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      "Access-Control-Allow-Origin": "*",
    },
    body: JSON.stringify({data}),

  }
  ).then((res) => res.json());