const mysql = require('mysql2');
const dotenv = require('dotenv');
let instance = null;
dotenv.config();


const connection = mysql.createConnection({
    host: process.env.HOST,
    user: process.env.USERNAME,
    password: process.env.PASSWORD,
    database: process.env.DATABASE,
    port: process.env.DB_PORT
});

connection.connect((err) => {
    if (err) {
        console.log(err.message);
    }
    console.log('connected to database');
});


class DbService {
    static getDbServiceInstance() {
        return instance ? instance : new DbService();
    }

    async insertNewUser(name, email, password) {
        
    }
}


const check_email = (email) => {
    
    try {
        const query = ('SELECT email FROM user WHERE email=?;');
        const query_result = connection.query(query, [email], (err, result) => {    
            if (err) {
                return false;
            } else {
                if (result.length > 0) {
                    return false;
                } else {
                    return true;
                }
            }
        })
    } catch (error) {
        console.log(error)
    }
    
}
module.exports = DbService;
module.exports.check_email = check_email;