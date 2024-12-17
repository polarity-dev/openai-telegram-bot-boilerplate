// Put here some utility functions that can be used in the whole project

import Sqlite from "better-sqlite3";

export const setupDatabase = (db: Sqlite.Database) => {
    const { changes: chatsChanges } = db.prepare(`
        CREATE TABLE IF NOT EXISTS "Chats" (
            "chatId" INTEGER PRIMARY KEY,
            "nMessages" INTEGER DEFAULT 0
        );
    `).run()
}