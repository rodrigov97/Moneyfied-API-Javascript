var mysql = require('mysql');

const pool = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: 'admin123',
    database: 'moneyfied',
    typeCast: function castField(field, useDefaultTypeCasting) {
        if ((field.type === "BIT") && (field.length === 1)) {
            var bytes = field.buffer();
            return (bytes[0] === 1);
        }
        return (useDefaultTypeCasting());
    }
});

module.exports = pool;