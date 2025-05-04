import express from 'express'
import { createUser, getUser } from './db'
import cors from 'cors'

const app = express()
const PORT = 3000

app.use(cors())
app.use(express.json())

// @ts-ignore
app.post('/login', async (req, res) => {
	const { digital_signature, public_address } = req.body

	if (!digital_signature || !public_address)
		return res.status(400).json({ error: 'Missing digital_signature or public_address' })

	try {
		const user = await getUser(public_address)

		if (user && user.digital_signature === digital_signature)
			return res.status(200).json({ message: 'Login successful' })

		res.status(401).json({ error: 'Invalid digital signature' })
	} catch (error) {
		console.error('Login error:', error)
		res.status(500).json({ error: 'Server error during login' })
	}
})

// @ts-ignore
app.post('/register', async (req, res) => {
	const { name, digital_signature, public_address, age, id_code } = req.body

	if (!name || !digital_signature || !public_address || !age || !id_code)
		return res.status(400).json({ error: 'Missing required fields' })

	try {
		await createUser(name, digital_signature, public_address, age, id_code)
		res.status(201).json({ message: 'User created successfully' })
	} catch (error) {
		console.error('User creation error:', error)
		res.status(500).json({ error: 'Failed to create user' })
	}
})

// @ts-ignore
app.get('/users/:public_address', async (req, res) => {
	const { public_address } = req.params

	try {
		const user = await getUser(public_address)

		if (!user) return res.status(404).json({ error: 'user not found' })

		res.status(200).json(user)
	} catch (error) {
		console.error('Fetch user error:', error)
		res.status(500).json({ error: 'Failed to fetch user' })
	}
})

app.get('/', async (req, res) => {
	res.status(200).json({ message: 'Hello World' })
})

app.listen(PORT, () => {
	console.log(`Server is running at http://localhost:${PORT}`)
})
