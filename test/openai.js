const OpenAI = require("openai")
const configs = require("../src/configs")

const openai = new OpenAI({
    apiKey: configs.OPENAI_API_KEY
})

const functions = [{
    definition: {
        name: "magic_algorithm",
        description: "A magic algorithm that manage a number with a secret algorithm.",
        parameters: {
            type: "object",
            properties: {
                n: {
                    type: "number"
                }
            },
        }
    },
    handler: (options) => {
        const { n } = options
        return n * 42
    }
}]

const completionWithTools = async (options) => {
    const {
        openai,
        messages,
        model = "gpt-3.5-turbo",
        prompt
    } = options

    const tools = functions.map(({ definition }) => ({
        type: "function",
        function: definition
    }))

    // Add the prompt to the list of messages
    messages.push({
        role: "user",
        content: prompt
    })

    const firstCompletion = await openai.chat.completions.create({
        model,
        messages,
        tools
    })

    const firstMessage = firstCompletion.choices[0].message
    const { tool_calls } = firstMessage

    // Add the message to the list of messages
    messages.push(firstMessage)

    if (tool_calls) {
        // The assistant has requested one or more tool calls
        for (const toolCall of tool_calls) {
            const functionName = toolCall.function.name
            const functionArguments = JSON.parse(toolCall.function.arguments)

            const targetFunction = functions.find(({ definition }) => definition.name === functionName)
            if (!targetFunction) {
                throw new Error(`Function ${functionName} not found`)
            }

            const functionHandler = targetFunction.handler
            const result = functionHandler(functionArguments)

            // Add the result to the list of messages
            messages.push({
                role: "tool",
                tool_call_id: toolCall.id,
                content: JSON.stringify(result)
            })
        }
    }

    const secondCompletion = await openai.chat.completions.create({
        model,
        messages,
        tools
    })

    return secondCompletion.choices[0].message.content || ""
}

const main = async () => {
    const out = await completionWithTools({
        prompt: "What is the result of the magic algorithm with a single unit?",
        openai,
        messages: [],
        functions
    })

    console.log(out)
}

main()