const request = require("supertest");
const app = require("../db/app");
const db = require("../db/index");
const seed = require("../db/seeds/seed");
const data = require("../db/data/test-data");
const endPointFile = require("../endpoints.json")

beforeEach(() => {
	return seed(data);
});
afterAll(() => {
	return db.end();
});
describe("GET /api/topics", () => {
    test("200 responds with an array of all topics", () => {
        return request(app)
            .get('/api/topics')
            .expect(200)
            .then(({ body: {topics} }) => {
                expect(topics).toHaveLength(3)
                topics.forEach((topic) => {
                    expect(topic).toHaveProperty("slug", expect.any(String))
                    expect(topic).toHaveProperty("description", expect.any(String))
                })
            })
    }) 
})
describe("GET /api/articles", () => {
    test("200 responds with all the articles", () => {
        return request(app)
            .get('/api/articles')
            .expect(200)
            .then(({ body: {articles} }) => {
                expect(articles).toHaveLength(13)
                    expect(articles[5]).toEqual({
                        article_id: 6,
                        title: "A",
                        topic: "mitch",
                        author: "icellusedkars",
                        body: "Delicious tin of cat food",
                        created_at: "2020-10-18T01:00:00.000Z",
                        votes: 0,
                        article_img_url:
                          "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700",
                      })
            })
    })  
})
describe("GET /api/articles/:article_id", () => {
    test("200 responds with the object of the article with the path of the article id", () => {
        return request(app)
            .get('/api/articles/1')
            .expect(200)
            .then(({ body: {articles} }) => {
                expect(articles).toHaveLength(1)
                    expect(articles[0]).toEqual({
                        article_id: 1,
                        title: "Living in the shadow of a great man",
                        topic: "mitch",
                        author: "butter_bridge",
                        body: "I find this existence challenging",
                        created_at: "2020-07-09T20:11:00.000Z",
                        votes: 100,
                        article_img_url:
                          "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700",
                      })
            })
    })
    test("400 responds with with a bad request for an invalid id path", () => {
        return request(app)
        .get("/api/articles/wnfjn134")
        .expect(400)
        .then(({body}) => {
            expect(body.message).toBe(`Bad request`)
        })
    })
})
describe("GET /api/", () => {
    test(`404: responds with bad request for an invalid path`, () => {
        return request(app)
        .get("/api/dfdfdfdf/")
        .expect(404)
        .then(({body}) => {
            expect(body.message).toBe(`No path found`)
        })
    })
})

describe("GET /api/", () => {
    test("200 responds with an object of all the endpoints", () => {
        return request(app)
            .get('/api/')
            .expect(200)
            .then(({ body }) => {       
        expect(body.apiEndpoints).toEqual(endPointFile)
            })
    }) 
})


