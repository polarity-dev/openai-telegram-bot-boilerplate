const functions = [{
    definition: {
        name: "add_alias",
        description: "A function that adds an alias to a user",
        parameters: {
            type: "object",
            properties: {
                alias: {
                    type: "string"
                },
                chatId: {
                    type: "number"
                },
                userId: {
                    type: "string"
                },
            },
        }
    },
    handler: (options) => {
        const { alias, chatId, userId } = options
        console.log(`Adding alias ${alias} to user ${userId} in chat ${chatId}`)
        return "ok"
    }
}]

module.exports = {
    functions
}