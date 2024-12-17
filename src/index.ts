import Sqlite from "better-sqlite3"
import OpenAI from "openai"
import { Telegraf } from "telegraf"
import { message } from "telegraf/filters"
import configs from "./configs"
import { setupDatabase } from "./utils"

const db = new Sqlite("data.db")
setupDatabase(db)

const bot = new Telegraf(configs.TELEGRAM_BOT_TOKEN)

const openai = new OpenAI({
    apiKey: configs.OPENAI_API_KEY
})

bot.start(async (ctx) => {
    await ctx.reply(`Hello! Your chat ID is ${ctx.chat.id}`)
})

bot.on(message("text"), async (ctx) => {
    const chatId = ctx.chat.id

    // Setups the chat in the database if it doesn't exist
    const { changes } = db.prepare(`
        INSERT INTO "Chats" ("chatId", "nMessages")
        VALUES (?, 0)
        ON CONFLICT("chatId") DO NOTHING
    `).run(chatId)

    if (changes === 1) {
        await ctx.reply("Chat setup successfully!")
    }

    // Increments the number of messages sent by the chat
    db.prepare(`
        UPDATE "Chats"
        SET "nMessages" = "nMessages" + 1
        WHERE "chatId" = ?
    `).run(chatId)

    // Get the number of messages sent by the chat
    const { nMessages } = db.prepare(`
        SELECT "nMessages"
        FROM "Chats"
        WHERE "chatId" = ?
    `).get(chatId) as { nMessages: number }

    await ctx.reply(`You sent ${nMessages} messages`)
})

bot.launch(() => {
    console.log('Bot is up and running')
}).catch((err) => {
    console.error('Error starting bot', err)
})

// Enable graceful stop
process.once('SIGINT', () => bot.stop('SIGINT'))
process.once('SIGTERM', () => bot.stop('SIGTERM'))