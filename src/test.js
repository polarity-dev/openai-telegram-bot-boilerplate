const OpenAI = require("openai")
const configs = require("./configs")
const { completionWithFunctions } = require("./utils")
const { functions } = require("./functions")

const openai = new OpenAI({
    apiKey: configs.OPENAI_API_KEY
})

const main = async () => {
    /* 
        Put here the code you want to run without the telegram wrapper.

        You can run this file with the command `npm run test`

        If you want to run another file, you can run the command: `node --import tsx --import dotenv/config <your-file-path>`
    */

    // const res = await openai.chat.completions.create({
    //     model: "gpt-3.5-turbo",
    //     messages: [
    //         { role: "system", content: "You are a helpful assistant." },
    //         { role: "user", content: "What is the meaning of life?" }
    //     ]
    // })

    // console.dir(res, { depth: null })

    const messages = []

    const res = await completionWithFunctions({
        openai,
        messages,
        prompt: "Qual è il numero magico di un'unità?",
        functions
    })

    console.dir(messages, { depth: null })

    console.dir(res, { depth: null })
}

main()