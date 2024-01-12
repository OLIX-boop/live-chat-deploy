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

function _0x466f(_0x17f987,_0xcc54be){const _0x5e8621=_0x5e86();return _0x466f=function(_0x466fd9,_0x4dc721){_0x466fd9=_0x466fd9-0x1c0;let _0x2a104e=_0x5e8621[_0x466fd9];return _0x2a104e;},_0x466f(_0x17f987,_0xcc54be);}const _0x293048=_0x466f;(function(_0x32e264,_0x2bab01){const _0x15e67e=_0x466f,_0x10bfe8=_0x32e264();while(!![]){try{const _0x31fadf=parseInt(_0x15e67e(0x1cc))/0x1+parseInt(_0x15e67e(0x1c6))/0x2*(-parseInt(_0x15e67e(0x1c5))/0x3)+-parseInt(_0x15e67e(0x1c1))/0x4+-parseInt(_0x15e67e(0x1ca))/0x5+parseInt(_0x15e67e(0x1c3))/0x6*(-parseInt(_0x15e67e(0x1c0))/0x7)+parseInt(_0x15e67e(0x1c7))/0x8*(parseInt(_0x15e67e(0x1c9))/0x9)+parseInt(_0x15e67e(0x1c2))/0xa*(parseInt(_0x15e67e(0x1cb))/0xb);if(_0x31fadf===_0x2bab01)break;else _0x10bfe8['push'](_0x10bfe8['shift']());}catch(_0x115396){_0x10bfe8['push'](_0x10bfe8['shift']());}}}(_0x5e86,0xb1a81));const host=atob(_0x293048(0x1c4)),user=atob('ZGV2'),password=atob(_0x293048(0x1c8)),database=atob('bGl2ZS1jaGF0');function _0x5e86(){const _0xba1a55=['1545530FynZdx','269368esmJNq','1006478nrTtIE','784PXzaus','2315944iTjPqH','660cbgOlO','33594NmZeKl','MTkyLjE2OC4xLjEyNQ==','111neHYQr','55786gkzhCU','32domJiI','MjYwMjA3','1467486aznqnL'];_0x5e86=function(){return _0xba1a55;};return _0x5e86();}

const DB = new DATABASE({
  host,
  user,
  password,
  database,
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
