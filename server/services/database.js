const mysql = require('mysql');

class DATABASE {
    constructor(DBINFO) {
        this.connection =  mysql.createConnection(DBINFO);
    }

    connect = () => this.connection.connect();
  
    sendQuery = async (command) => {
        const result = await new Promise((resolve) => {
            this.connection.query(command, (err, result) => {
                if (err) return console.log(err);
                resolve(result);
            })
        });
        return result;
    };
}

const DB = new DATABASE({
  host: "192.168.1.125",
  user: "dev",
  password: "260207",
  database: "live-chat",
});

DB.connect();

// const result = await DB.sendQuery(`SELECT * FROM users`);

module.exports = DB;
