const OpenAI = require("openai")
const { Telegraf } = require("telegraf")
const { message } = require("telegraf/filters")

const configs = require("./configs")
const utils = require("./utils")
const { functions } = require("./functions")

/* ===================== SETUP ===================== */

const data = utils.loadData()
setInterval(() => utils.saveData(data), 5000)

const bot = new Telegraf(configs.TELEGRAM_BOT_TOKEN)
const openai = new OpenAI({
    apiKey: configs.OPENAI_API_KEY
})

/* ===================== BOT ===================== */

bot.start(async (ctx) => {
    const chatId = ctx.chat.id
    await ctx.reply(`Hello! Your chat ID is ${chatId}`)
})

bot.on(message("text"), async (ctx) => {
    const message = ctx.message.text
    const chatId = ctx.chat.id

    const users = [{
        id: "Alessandro",
        aliases: ["Alessandro", "Sandro"]
    }]

    const response = await utils.completionWithFunctions({
        openai,
        prompt: message,
        functions,
        messages: [{
            role: "system",
            content: `
                =========================================
                La chat ID è ${ chatId }
                ========================================
                Questo è il contesto sugli utenti:
                ${ JSON.stringify(users) }
                ========================================
        `
        
        }]
    })

    await ctx.reply(response)
})

/* ===================== LAUNCH ===================== */

bot.launch(() => {
    console.log('Bot is up and running')
}).catch((err) => {
    console.error('Error starting bot', err)
})

// Enable graceful stop
process.once("SIGINT", () => bot.stop("SIGINT"))
process.once("SIGTERM", () => bot.stop("SIGTERM"))