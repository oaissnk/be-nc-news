const request = require("supertest");
const app = require("../db/app");
const db = require("../db/index");
const seed = require("../db/seeds/seed");
const data = require("../db/data/test-data");

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
            .then(({ body }) => {
                const { topics } = body;
                expect(topics).toHaveLength(3)
                topics.forEach((topic) => {
                    expect(topic).toHaveProperty("slug", expect.any(String))
                    expect(topic).toHaveProperty("description", expect.any(String))
                })
            })
    }) 
})
describe("GET /api/", () => {
    test(`404: responds with bad request for an invalid path`, () => {
        return request(app)
        .get("/api/dfdfdfdf/")
        .expect(404)
        .then(({body}) => {
        console.log(body)
        
            expect(body.message).toBe(`No path found`)
        })
    })
})



