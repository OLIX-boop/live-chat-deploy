let axios = require('axios');

function harperSearchUser(email) {
  const dbUrl = "https://live-chat-olix.harperdbcloud.com";
  const dbPw = "Basic b2xpeDoyNjAyMDc=";
  if (!dbUrl || !dbPw) return null;

  let data = JSON.stringify({
    operation: 'sql',
    sql: `SELECT * FROM realtime_chat_app.users WHERE email = '${email}'`,
  });

  let config = {
    method: 'post',
    url: dbUrl,
    headers: {
      'Content-Type': 'application/json',
      Authorization: dbPw,
    },
    data: data,
  };

  return new Promise((resolve, reject) => {
    axios(config)
      .then(function (response) {
        resolve(response.data);
      })
      .catch(function (error) {
        reject(error);
      });
  });
}

module.exports = harperSearchUser;