/* 
    Unit Test for the `getUrlPrefix` function
*/

const getUrlPrefix = require("../shared/functions/getUrlPrefix");

test('Should create URL prefix for a path 2 levels deep', () => {
    expect(getUrlPrefix('/test/1/number'))
        .toBe('./../../')
})

