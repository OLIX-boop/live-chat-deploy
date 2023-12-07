var axios = require("axios");

function harperEditMessage(message, id) {
  const dbUrl = process.env.DB_URL;
  const dbPw = process.env.DB_PSW;
  if (!dbUrl || !dbPw) return null;

  var data = JSON.stringify({
    operation: "update",
    schema: "realtime_chat_app",
    table: "messages",
    records: [
      {
        id,
        message,
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

module.exports = harperEditMessage;
