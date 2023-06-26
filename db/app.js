const express = require("express");
const app = express();
const { handlePsqlErrors, handleCustomErrors, handleServerErrors } = require("./error");
const { getAPI, getAllTopics, routeNotFound } = require("./app.controller");
app.use(express.json());
app.get("/api", getAPI);
module.exports = app;

app.get('/api/topics', getAllTopics)

app.all("*", routeNotFound)

app.use(handlePsqlErrors)
app.use(handleCustomErrors)
app.use(handleServerErrors)
