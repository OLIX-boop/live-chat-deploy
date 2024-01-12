const mysql = require('mysql');

class DATABASE {
    constructor(DBINFO) {
        this.connection =  mysql.createConnection(DBINFO);
    }

    connect = () => this.connection.connect();
  
    sendQuery = (command) => {
        return new Promise((resolve) => {
            this.connection.query(command, (err, result) => {
                if (err) return console.log(err);
                resolve(result);
            })
        });
    };

    searchUser = (email) => {
        const query = `SELECT * FROM users WHERE email = '${email}'`;
        return new Promise((resolve) => {
            this.connection.query(query, (err, result) => {
                if (err) return console.log(err);
                resolve(result);
            })
        });
    }

    createUser = async (email, password, username) => {
        var emailUSED = false;
        await this.searchUser(email).then((USER) => emailUSED = (USER.length > 0));

        const params = {email, password, username};
        const query = `INSERT INTO users SET ?`;

        return new Promise((resolve, reject) => {
            if (emailUSED) return reject("Email already used");
            this.connection.query(query, params, (err, result) => {
                if (err) return console.log(err);
                resolve(result);
            })
        });
    }

    saveMessage = async (message, username, room) => {

        const params = {
            message,
            username,
            room,
            edited : false
        };

        const query = `INSERT INTO messages SET ?`;

        return new Promise((resolve) => {
            this.connection.query(query, params, (err, result) => {
                if (err) return console.log(err); 
                resolve(result);
            })
        });
    }

    getMessages = (room) => {
        const query = `SELECT * FROM messages WHERE room = '${room}' LIMIT 100`;
        return new Promise((resolve) => {
            this.connection.query(query, (err, result) => {
                if (err) return console.log(err);
                resolve(result);
            })
        });
    }

    editMessage = (message, id) => {
        const query = `UPDATE messages SET message = '${message}', edited = 1 WHERE id = ${id}`;
        return new Promise((resolve) => {
            this.connection.query(query, (err, result) => {
                if (err) return console.log(err);
                resolve(result);
            })
        });
    }
}

const DB = new DATABASE({
  host: "192.168.1.125",
  user: "dev",
  password: "260207",
  database: "live-chat",
});

DB.connect(); // called by default so that you don't have to :)

// COMMANDSs
/**
 * const result = await DB.sendQuery(`SELECT * FROM users`);
 * @param {string} query
 * @returns result of the query
*/

/**
 * const result = await DB.searchUser('seigay@gmail.com');
 * @param {string} email
 * @returns {Array} result of the query
*/

/**
 * const result = await DB.createUser("CIAO@gmail.com", "a2@dw'awdg#jawd", "NOCCIOLINA");
 * @param {string} email
 * @param {string} password
 * @param {string} username
 * @returns {Array} result of the query
*/

/**
 * const result = await DB.saveMessage("Sei uno sfigato", "NOCELORI07", "room_1");
 * @param {string} message
 * @param {string} username
 * @param {string} room
 * @returns {Array} result of the query
*/

/**
 * const result = await DB.getMessages("room_1");
 * @param {string} room
 * @returns {Array} last 100 messages of the room
*/

/**
 * const result = await DB.editMessage("Sei uno sfigato", 23);
 * @param {string} message
 * @param {number} id
 * @returns {Array} result of the query
*/



module.exports = DB;
