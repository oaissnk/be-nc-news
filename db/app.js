const express = require("express");
const app = express();
const { handlePsqlErrors, handleCustomErrors, handleServerErrors } = require("./error");
const { getAllTopics, routeNotFound, getApiEndpoints } = require("./app.controller");

module.exports = app;

app.get('/api', getApiEndpoints)
app.get('/api/topics', getAllTopics)
app.all("*", routeNotFound)

app.use(handlePsqlErrors)
app.use(handleCustomErrors)
app.use(handleServerErrors)
