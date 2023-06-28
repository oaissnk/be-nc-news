const express = require("express");
const app = express();
const { handlePsqlErrors, handleCustomErrors, handleServerErrors } = require("./error");
const { getAllTopics, routeNotFound, getApiEndpoints, getArticles, getCommentsByArticleId, getArticleById } = require("./app.controller");

//EndPoints
app.get('/api', getApiEndpoints)
//Topics
app.get('/api/topics', getAllTopics)
//Articles
app.get('/api/articles', getArticles)
app.get('/api/articles/:article_id', getArticleById)
app.get('/api/articles/:article_id/comments', getCommentsByArticleId)
//Errors
app.all("*", routeNotFound)
app.use(handlePsqlErrors)
app.use(handleCustomErrors)
app.use(handleServerErrors)

module.exports = app;