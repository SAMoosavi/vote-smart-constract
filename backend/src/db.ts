import sqlite3 from 'sqlite3'
import { open } from 'sqlite'
import { v4 as uuidV4 } from 'uuid'

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

export const initVoteDB = async () => {
	const db = await open({
		filename: './database.sqlite',
		driver: sqlite3.Database,
	})

	await db.exec(`
		CREATE TABLE IF NOT EXISTS Vote
		(
			uuid                 TEXT PRIMARY KEY,
			name                 TEXT    NOT NULL UNIQUE,
			min_age              INTEGER NOT NULL DEFAULT 0,
			max_age              INTEGER NOT NULL DEFAULT 0,
			id_code_regex        TEXT    NOT NULL DEFAULT '.*',
			owner_public_address TEXT    NOT NULL
		);
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

export const createVote = async (
	name: string,
	min_age: number,
	max_age: number,
	id_code_regex: string,
	owner_public_address: string,
) => {
	const db = await initVoteDB()

	const voteId = uuidV4()

	await db.run(
		`INSERT INTO Vote (uuid, name, min_age, max_age, id_code_regex, owner_public_address)
		 VALUES (?, ?, ?, ?, ?, ?)`,
		[voteId, name, min_age, max_age, id_code_regex, owner_public_address],
	)
	return voteId
}
