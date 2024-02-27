const { default: TestRunner}= require("jest-runner")
const addFive = require("./addFive.js")
test("returns the number 5",()=>{
    expect(addFive(5)).toBe(10)
})

//要注意  TERMINAL的路徑必須要在package.json裡 不然npm test無法使用