const articles = require("./data/test-data/articles");
const db = require("./index");

exports.selectAllTopics = () => {
  return db.query(`SELECT * FROM topics;`).then(({ rows }) => {
    return rows;
  });  
};

exports.selectArticleById = (id) => {
  return db.query("SELECT * FROM articles WHERE article_id = $1;", [id]).then(({ rows }) => {
      return rows[0]
  });
};

exports.selectCommentsByArticleId = (articleId) => {
  return db.query(
    `SELECT * FROM comments 
     WHERE article_id = $1
     ORDER BY comments.created_at DESC;`, 
      [articleId]).then(({ rows }) => {
    return rows
  })
}

exports.selectArticles = () => {
  return db.query(`SELECT articles.author, articles.title, articles.article_id, articles.topic, articles.created_at, articles.votes, articles.article_img_url, COUNT(comments.article_id) AS comment_count
  FROM articles
  LEFT JOIN comments ON comments.article_id = articles.article_id
  GROUP BY articles.article_id
  ORDER BY articles.created_at DESC;`).then(({ rows }) => {
    return rows
  })
}

exports.insertArticleComment = (newComment, articleID) => {
  const { username, body } = newComment;
  return db
    .query(
      "INSERT INTO comments (author, body, article_id) VALUES ($1, $2, $3) RETURNING *;",
      [username, body, articleID]
    )
    .then(({ rows }) => rows[0]);
};