import express from 'express'
import { createUser, createVote, getUser } from './db'

const app = express()
const PORT = 3000

app.use(express.json())

// @ts-ignore
app.post('/users', async (req, res) => {
	const { name, digital_signature, public_address, age, id_code } = req.body

	if (!name || !digital_signature || !public_address || !age || !id_code) {
		return res.status(400).json({ error: 'Missing fields in request' })
	}

	try {
		await createUser(name, digital_signature, public_address, age, id_code)
		res.status(201).json({ message: 'User added successfully' })
	} catch (err) {
		res.status(500).json({ error: 'Failed to add user' })
	}
})

// @ts-ignore
app.get('/users/:public_address', async (req, res) => {
	const { public_address } = req.params

	try {
		const user = await getUser(public_address)

		if (!user) return res.status(404).json({ error: 'user not found' })

		res.json(user)
	} catch (err) {
		console.error(err)
		res.status(500).json({ error: 'Failed to fetch user' })
	}
})

// @ts-ignore
app.post('/check-user', async (req, res) => {
	const { public_address, digital_signature } = req.body

	if (!public_address || !digital_signature) return res.status(400).json({ error: 'Missing fields' })

	try {
		const user = await getUser(public_address)

		if (!user) return res.status(404).json({ error: 'User not found' })

		if (user.digital_signature === digital_signature)
			return res.status(200).json({ message: 'User verified', user })
		else return res.status(401).json({ error: 'Invalid digital signature' })
	} catch (err) {
		console.error('Database error:', err)
		res.status(500).json({ error: 'Internal server error' })
	}
})

// @ts-ignore
app.post('/votes', async (req, res) => {
	const { name, min_age = 0, max_age = 0, id_code_regex = '.*', owner_public_address } = req.body

	if (!name || !owner_public_address) {
		return res.status(400).json({ error: 'Missing required fields: name or owner_public_address' })
	}

	try {
		const uuid = await createVote(name, min_age, max_age, id_code_regex, owner_public_address)

		res.status(201).json({ message: 'Vote created', uuid })
	} catch (error) {
		console.error('Failed to insert vote:', error)
		res.status(500).json({ error: 'Internal server error' })
	}
})

app.listen(PORT, () => {
	console.log(`Server running on http://localhost:${PORT}`)
})
