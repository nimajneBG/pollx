/* 
    Unit Test for the vote function in the api

    1 Checks Vote that should work

    2 Check Vote that should not work (Invalid request)

    3 Check Vote that should not work (Already voted)

    Important for this test is that the ids and options in the variables exist.
    Moreover it should be noted that the results on them will be influenced by 
    this tests
*/

const request = require('supertest')
const app = require('../app')

const agent = request.agent(app)

const existingIds = [10, 11]
const existingOption = 1

describe('Test the vote api endpoint', () => {
    test('Should be able vote on a poll', async () => {
        await agent
            .post(`/api/vote/${existingIds[0]}`)
            .send({ "option": existingOption })
            .expect(200)
            .expect('Content-Length', "2")
    })

    test('Should not be able to vote (invalid request)', async () => {
        await agent
            .post(`/api/vote/${existingIds[1]}`)
            .send({ "invalid field": 1 })
            .expect(400)
    })

    test('Should not be able to vote on a poll (already voted)', async () => {
        await agent
            .post(`/api/vote/${existingIds[0]}`)
            .send({ "option": existingOption })
            .expect(200)
            .expect('Content-Type', /json/)
            .expect('Content-Length', "36")
    })
})
