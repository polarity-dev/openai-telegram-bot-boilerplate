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

module.exports = {
    functions
}