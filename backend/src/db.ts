import sqlite3 from 'sqlite3'
import { open } from 'sqlite'

const initUserDB = async () => {
	const db = await open({
		filename: './database.sqlite',
		driver: sqlite3.Database,
	})

	await db.exec(`
		CREATE TABLE IF NOT EXISTS users
		(
			name              TEXT    NOT NULL,
			digital_signature TEXT    NOT NULL UNIQUE,
			public_address    TEXT    NOT NULL PRIMARY KEY,
			age               INTEGER NOT NULL,
			id_code           TEXT    NOT NULL UNIQUE
		)
	`)

	return db
}

export const getUser = async (public_address: string) => {
	const db = await initUserDB()
	return await db.get(
		`SELECT *
		 FROM users
		 WHERE public_address = '${public_address}'`,
	)
}

export const createUser = async (
	name: string,
	digital_signature: string,
	public_address: string,
	age: number,
	id_code: string,
) => {
	const db = await initUserDB()
	return await db.run(
		`INSERT INTO users (name, digital_signature, public_address, age, id_code)
		 VALUES (?, ?, ?, ?, ?)`,
		[name, digital_signature, public_address, age, id_code],
	)
}
