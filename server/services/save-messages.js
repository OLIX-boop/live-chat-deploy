var axios = require("axios");

function harperSaveMessage(message, username, room) {
  const dbUrl = "https://live-chat-olix.harperdbcloud.com";
  const dbPw = "Basic b2xpeDoyNjAyMDc=";
  if (!dbUrl || !dbPw) return null;

  var data = JSON.stringify({
    operation: "insert",
    schema: "realtime_chat_app",
    table: "messages",
    records: [
      {
        message,
        username,
        room,
      },
    ],
  });

  var config = {
    method: "post",
    url: dbUrl,
    headers: {
      "Content-Type": "application/json",
      Authorization: dbPw,
    },
    data: data,
  };

  return new Promise((resolve, reject) => {
    axios(config)
      .then(function (response) {
        resolve(JSON.stringify(response.data));
      })
      .catch(function (error) {
        reject(error);
      });
  });
}

module.exports = harperSaveMessage;
