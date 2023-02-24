const axios = require("axios");

const sendNotification = async (token,body)=>{
    var title = 'AvoConsulte';
  const message = {
    notification: {
      title: title,
      body: body
    },
    to : token,
    sound : true
  };

  const url = 'https://fcm.googleapis.com/fcm/send';
  const headers = {
    'Content-Type': 'application/json',
    Authorization: `key=${process.env.FIREBASE_TOKEN}`,
  };

  const response = await axios.post(url, message, { headers })
  return response
}
module.exports = {
    sendNotification,
};