import {AsyncDatabase} from 'promised-sqlite3'
import {Database} from 'sqlite3'

const initializeDB = async () => {
	const clearTables = !(
		process.argv.indexOf('-p') > -1 || process.argv.indexOf('--persist') > -1
	)

	try {
		const db = new AsyncDatabase(new Database('./users.db'))
		console.info('Database opened')

		await db.run(`CREATE TABLE IF NOT EXISTS users (
			email TEXT PRIMARY KEY,
			name TEXT,
			pwHashed TEXT
		)`)
		console.info('users Table created')

		if (clearTables) {
			await db.run('DELETE FROM users')
			console.info('users Table cleared')
		}

		await db.close()
		console.info('Database closed')
	} catch (err) {
		console.error(err)
	}
}

initializeDB()
