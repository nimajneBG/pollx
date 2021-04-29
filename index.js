// Import `app`
const app = require('./app')

// Start server
const port = process.env.PORT || 3000
app.listen(port, () => {
    console.log(`
 _______         __   __
|_   __ \\       [  | [  |
  | |__) | .--.  | |  | |  _   __
  |  ___// .'\`\\ \\| |  | | [ \\ [  ]
 _| |_   | \\__. || |  | |  > '  <
|_____|   '.__.'[___][___][__]\`\\_]

    `)
    console.log(`... running at http://localhost:${port}\n\n`)
})
