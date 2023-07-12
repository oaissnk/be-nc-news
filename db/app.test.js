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
          expect(article).toHaveProperty("title", expect.any(String));
          expect(article).toHaveProperty("topic", expect.any(String));
          expect(article).toHaveProperty("author", expect.any(String));
          expect(article).toHaveProperty("created_at", expect.any(String));
          expect(article).toHaveProperty("votes", expect.any(Number));
          expect(article).toHaveProperty("article_img_url", expect.any(String));
          expect(article).toHaveProperty("comment_count", expect.any(String));
          expect(article).not.toHaveProperty("body", expect.any(String));
        });
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
  test("400 responds with message Invalid Article ID ", () => {
    return request(app)
      .get("/api/articles/sdfsfd/comments")
      .expect(400)
      .then(({ body }) => {
        expect(body.message).toBe("Invalid Article ID !");
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
describe("POST /api/articles/:article_id/comments", () => {
  test("201 responds with a post which adds a comment for an article", () => {
    return request(app)
      .post("/api/articles/1/comments")
      .send({ username: "rogersop", body: "soa4ever" })
      .expect(201)
      .then(({ body: { comment } }) => {
        expect(comment.author).toBe("rogersop");
        expect(comment.body).toBe("soa4ever");
        expect(comment.article_id).toBe(1);
        expect(comment.votes).toBe(0);
        expect(comment).toHaveProperty("created_at", expect.any(String));
      });
  });
  test("400 responds with message Invalid Article ID ", () => {
    return request(app)
      .post("/api/articles/sdfsfd/comments")
      .expect(400)
      .send({ username: "rogersop", body: "soa4ever" })
      .then(({ body }) => {
        expect(body.message).toBe("Invalid Article ID !");
      });
  });
  test("400 responds with message Username not found ", () => {
    return request(app)
      .post("/api/articles/1/comments")
      .expect(400)
      .send({ username: "dfdfd", body: "soa4ever" })
      .then(({ body }) => {
        expect(body.message).toBe("Bad request !");
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
  test("400 responds with message Invalid Article ID ", () => {
    return request(app)
      .get("/api/articles/sdfsfd/comments")
      .expect(400)
      .then(({ body }) => {
        expect(body.message).toBe("Invalid Article ID !");
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
describe("PATCH /api/articles/:article_id", () => {
  test("200 responds with an updated vote count on an article ", () => {
    const votesBeforePatch = data.articleData[0].votes
    return request(app)
      .patch("/api/articles/1")
      .expect(200)
      .send({ inc_votes: 5 })
      .then(({ body: {article} }) => {
        expect(article.votes).toBe(votesBeforePatch + 5);
        expect(article).toHaveProperty("votes", expect.any(Number));
      });
  })
  test("400 responds with message Invalid Article ID ", () => {
    return request(app)
      .patch("/api/articles/sdfsfd")
      .expect(400)
      .send({ inc_votes: 5 })
      .then(({ body }) => {
        expect(body.message).toBe("Invalid Article ID !");
      });
  })
  test("400 responds with message inc_votes must be a number", () => {
    return request(app)
      .patch("/api/articles/1")
      .expect(400)
      .send({ inc_votes: "fff" })
      .then(({ body }) => {
        expect(body.message).toBe("inc_votes must be a number");
      });
  });
  test("400 responds with message body must include inc_votes", () => {
    return request(app)
      .patch("/api/articles/1")
      .expect(400)
      .send({ fdnjdfn: 4 })
      .then(({ body }) => {
        expect(body.message).toBe("body must include inc_votes");
      });
  });
});
