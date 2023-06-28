require("jest-sorted");
const request = require("supertest");
const app = require("../db/app");
const db = require("../db/index");
const seed = require("../db/seeds/seed");
const data = require("../db/data/test-data");
const endPointFile = require("../endpoints.json");

beforeEach(() => {
  return seed(data);
});
afterAll(() => {
  return db.end();
});
describe("GET /api/topics", () => {
  test("200 responds with an array of all topics", () => {
    return request(app)
      .get("/api/topics")
      .expect(200)
      .then(({ body: { topics } }) => {
        expect(topics).toHaveLength(3);
        topics.forEach((topic) => {
          expect(topic).toHaveProperty("slug", expect.any(String));
          expect(topic).toHaveProperty("description", expect.any(String));
        });
      });
  });
});
describe("GET /api/articles", () => {
  test("200 responds with all the articles with a comment count AND is in descending order", () => {
    return request(app)
      .get("/api/articles")
      .expect(200)
      .then(({ body: { articles } }) => {
        expect(articles).toHaveLength(13);
        articles.forEach((article) => {
            expect(article).toHaveProperty("title", expect.any(String))
            expect(article).toHaveProperty("topic", expect.any(String))
            expect(article).toHaveProperty("author", expect.any(String))
            expect(article).toHaveProperty("created_at", expect.any(String))
            expect(article).toHaveProperty("votes", expect.any(Number))
            expect(article).toHaveProperty("article_img_url", expect.any(String))
            expect(article).toHaveProperty("comment_count", expect.any(String))
            expect(article).not.toHaveProperty("body", expect.any(String))
        })
        expect(articles).toBeSortedBy("created_at", { descending: true });
  });
  });
});
describe("GET /api/articles/:article_id", () => {
  test("200 responds with the object of the article with the path of the article id", () => {
    return request(app)
      .get("/api/articles/1")
      .expect(200)
      .then(({ body: { article } }) => {
        expect(article).toEqual({
          article_id: 1,
          title: "Living in the shadow of a great man",
          topic: "mitch",
          author: "butter_bridge",
          body: "I find this existence challenging",
          created_at: "2020-07-09T20:11:00.000Z",
          votes: 100,
          article_img_url:
            "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700",
        });
      });
  });
  test("400 responds with with a bad request for an invalid id path", () => {
    return request(app)
      .get("/api/articles/wnfjn134")
      .expect(400)
      .then(({ body }) => {
        expect(body.message).toBe("Invalid Article ID !");
      });
  });
});
describe("GET /api/articles/:article_id/comments", () => {
  test("200 responds with the object of all comments from the article with the path of the article id", () => {
    return request(app)
      .get("/api/articles/1/comments")
      .expect(200)
      .then(({ body: { comments } }) => {
        comments.forEach((comment) => {
          expect(comment).toHaveProperty("comment_id", expect.any(Number));
          expect(comment).toHaveProperty("body", expect.any(String));
          expect(comment).toHaveProperty("votes", expect.any(Number));
          expect(comment).toHaveProperty("author", expect.any(String));
          expect(comment).toHaveProperty("article_id", expect.any(Number));
          expect(comment).toHaveProperty("created_at", expect.any(String));
        });
        expect(comments).toBeSortedBy("created_at", { descending: true });
      });
  });
  test("404 responds with message No Comments Found", () => {
    return request(app)
      .get("/api/articles/14444/comments")
      .expect(404)
      .then(({ body }) => {
        expect(body.message).toBe("No Comments Found");
      });
  });
});
describe("GET /api/", () => {
  test(`404: responds with bad request for an invalid path`, () => {
    return request(app)
      .get("/api/dfdfdfdf/")
      .expect(404)
      .then(({ body }) => {
        expect(body.message).toBe(`No path found`);
      });
  });
});

describe("GET /api/", () => {
  test("200 responds with an object of all the endpoints", () => {
    return request(app)
      .get("/api/")
      .expect(200)
      .then(({ body }) => {
        expect(body.apiEndpoints).toEqual(endPointFile);
      });
  });
});
