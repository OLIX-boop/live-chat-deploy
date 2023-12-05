const harperSearchUser = require('./search-user');
var axios = require("axios");

async function harperCreateUser (email, password, username) {
  const dbUrl = "https://live-chat-olix.harperdbcloud.com";
  const dbPw = "Basic b2xpeDoyNjAyMDc=";
  if (!dbUrl || !dbPw) return null;

  var emailUSED = false;
  await harperSearchUser(email).then((USER) => {emailUSED = (USER.length > 0);});

  console.log(username);
  var data = JSON.stringify({
    operation: "insert",
    schema: "realtime_chat_app",
    table: "users",
    records: [
      {
        email,
        password,
        username
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
    if (emailUSED) return reject("Email already used.");
    axios(config)
      .then(function (response) {
        resolve(JSON.stringify(response.data));
      })
      .catch(function (error) {
        reject(error);
      });
  });
}

module.exports = harperCreateUser;
