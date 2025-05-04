<template>
	<main class="w-full pt-10 gap-15 flex flex-col items-center">
		<div class="w-full lg:w-1/3 md:w-1/2">
			<form @submit.prevent="createAccount" class="flex flex-col gap-5 pt-5 items-center text-center w-full">
				<label class="floating-label w-full">
					<input
						type="text"
						v-model.trim.lazy="form.name"
						autofocus
						placeholder="name"
						required
						class="input validator input-secondary w-full"
					/>
					<span>name</span>
				</label>

				<label class="floating-label w-full">
					<input
						type="number"
						v-model.number.trim.lazy="form.age"
						autofocus
						placeholder="age"
						required
						class="input validator input-secondary w-full"
					/>
					<span>age</span>
				</label>

				<label class="floating-label w-full">
					<input
						type="number"
						v-model.number.trim.lazy="form.id_code"
						autofocus
						placeholder="id code"
						required
						class="input validator input-secondary w-full"
					/>
					<span>id code</span>
				</label>

				<button :disabled="creating" class="btn btn-block btn-dash btn-primary" type="submit">
					<span v-show="creating" class="loading loading-spinner loading-md"></span>
					create
				</button>
			</form>
		</div>
	</main>
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue'
import { createConnection } from '@/functions/Connector.ts'
import { register } from '@/functions/api-handler.ts'
import { toast } from 'vue3-toastify'
import { useUserStore } from '@/stores/user.ts'
import { useRouter } from 'vue-router'

const router = useRouter()
const form = reactive({
	name: '',
	age: 0,
	private_key: '',
	id_code: 0,
})

const creating = ref(false)

async function createAccount() {
	if (form.age <= 0) {
		toast.error('please enter correct age')
		return
	}
	if (form.id_code.toString().length < 5) {
		toast.error('please enter correct id')
		return
	}

	creating.value = true
	try {
		const { signer } = await createConnection()

		const public_address = signer.address
		const digital_signature = await signer.signMessage(public_address)

		const user = { name: form.name, age: form.age, public_address, digital_signature, id_code: form.id_code }
		register(user)
			.then((res) => {
				toast.success(res.data.message)
				useUserStore().loginUser(user)
				router.push('/dashboard')
			})
			.catch((err) => {
				if (err.response) toast.error(err.response.data.error)
			})
	} catch {
		toast.error('invalid private key')
	}
	creating.value = false
}
</script>
