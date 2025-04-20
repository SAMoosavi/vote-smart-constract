import express from 'express'
import { createUser, getUser } from './db'

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

app.listen(PORT, () => {
	console.log(`Server running on http://localhost:${PORT}`)
})
