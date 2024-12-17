// Put here some utility functions that can be used in the whole project

const setupDatabase = (db) => {
    db.prepare(`
        CREATE TABLE IF NOT EXISTS "Chats" (
            "chatId" INTEGER PRIMARY KEY,
            "nMessages" INTEGER DEFAULT 0
        );
    `).run()
}

module.exports = {
    setupDatabase
}