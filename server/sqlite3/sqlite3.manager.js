const { log, error } = console;
class SQliteManager {
  static createTokenTable(db) {
    return db.serialize(() => {
      return db.run(`CREATE TABLE IF NOT EXISTS Bad_tokens (
        id integer PRIMARY KEY AUTOINCREMENT,
        token text NOT NULL UNIQUE
      )`, (err) => {
        if(err){
          error(err);
        }
        log('Token Table Created');
      });
    });
  }

  static addToken(db, token) {
    return new Promise((resolve, reject) => {
      return db.run('INSERT INTO Bad_tokens(token) VALUES(?)', [token], function (err) {
        if(err) {
          return err.errno == 19 ? 
            resolve(true) :
              reject(err.message);
        }
        return resolve(true);
      });
    });
  }

  static findToken(db, token) {
  token = token.trim();
  return new Promise((resolve, reject) => {
    const sql = `SELECT * FROM Bad_tokens
                  WHERE token = ?`;
    return db.get(sql, [token], (err, row) => {
      if(err) {
        return reject(err.message);
      }
      return row ?
        resolve(row) :
          resolve(null);
    });
  });
  }
}


export default SQliteManager;
