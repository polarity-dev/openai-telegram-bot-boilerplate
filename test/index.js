const Sqlite = require("better-sqlite3")
const OpenAI = require("openai")
const configs = require("../src/configs")

const db = new Sqlite("data.db")
const openai = new OpenAI({
    apiKey: configs.OPENAI_API_KEY
})

const main = async () => {
    /* 
        Put here the code you want to run without the telegram wrapper.

        You can run this file with the command `npm run test`

        If you want to run another file, you can run the command: `node --import tsx --import dotenv/config <your-file-path>`
    */

    const res = await openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [
            { role: "system", content: "You are a helpful assistant." },
            { role: "user", content: "What is the meaning of life?" }
        ]
    })

    console.dir(res, { depth: null })
}

main()