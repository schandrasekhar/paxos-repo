const db = {};


db.save = function(key, data) {
    db[key] = data;
    return true;
};

db.get = function(key) {
    return db[key] || null;
};

db.delete = function(key) {
    try {
        delete db[key];
        return true;
    } catch (error) {
        console.error(error);
        return false;
    }
};

module.exports = db;