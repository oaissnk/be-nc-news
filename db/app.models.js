const db = require("./index");

exports.selectAllTopics = () => {
  return db.query(`SELECT * FROM topics;`).then(({ rows }) => {
    return rows;
  });  
};

exports.selectArticles = (id) => {
let query = "SELECT * FROM articles"

const queryValues = []

if (id){
  query += " WHERE article_id = $1";
  queryValues.push(id)
}
  query += " ;"
  return db.query(query, queryValues).then(({ rows }) => {
    return rows
  });
};