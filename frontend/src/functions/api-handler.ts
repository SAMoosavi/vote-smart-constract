import axios, { type AxiosResponse } from 'axios'

const BASE_URL = 'http://localhost:3000'

export interface User {
	name: string
	digital_signature: string
	public_address: string
	age: number
	id_code: number
}

export interface LoginPayload {
	public_address: string
	digital_signature: string
}

export const register = async (user: User): Promise<AxiosResponse> => {
	return axios.post(`${BASE_URL}/register`, user)
}

export const login = async (payload: LoginPayload): Promise<AxiosResponse> => {
	return axios.post(`${BASE_URL}/login`, payload)
}

export const getUser = async (public_address: string): Promise<AxiosResponse> => {
	return axios.get(`${BASE_URL}/users/${public_address}`)
}
