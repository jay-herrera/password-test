'use client'
import {ReactNode, useState} from 'react'
import {useRouter} from 'next/navigation'

import {RotatingLines} from 'react-loader-spinner'

export default function Form({
	children,
	registerUser
}: {
	children?: ReactNode
	registerUser: (formData: {
		email: string
		name: string
		password: string
	}) => Promise<{status: number; message: string}>
}) {
	const [errorText, setErrorText] = useState('')
	const [loading, setLoading] = useState(false)
	const router = useRouter()

	return (
		<>
			<p
				style={{
					color: 'red'
				}}
			>
				{`${errorText.length ? '*' : ''}${errorText}${
					errorText.length ? '*' : ''
				}`}
			</p>
			<form
				className='input-wrapper'
				action={async (formDataRaw) => {
					setLoading(true)

					const formData = Object.fromEntries(formDataRaw) as {
						email: string
						name: string
						password: string
						'password-confirm': string
					}

					if (formData.email.length < 1) {
						setErrorText('Email is required')

						return
					}

					if (
						!formData.email.match(
							/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
						)
					) {
						setErrorText('Email is not valid')

						return
					}

					if (formData.name.length < 1) {
						setErrorText('Name is required')

						return
					}

					if (formData.password.length < 6) {
						setErrorText('Password must be at least 6 characters')

						return
					}

					if (formData['password-confirm'].length < 1) {
						setErrorText('Password confirmation is required')

						return
					}

					if (formData['password'] !== formData['password-confirm']) {
						setErrorText('Passwords do not match')

						return
					}
					const {'password-confirm': _, ...formDataToSend} = formData
					const response = await registerUser(formDataToSend)

					if (response.status !== 200) {
						setErrorText(response.message)
						setLoading(false)

						return
					}
					router.replace('/signin')
				}}
			>
				{children}
				{loading ? (
					<div
						className='submit'
						onClick={() => {
							return setLoading(false)
						}}
					>
						<RotatingLines width='29' strokeColor='#555555' />
					</div>
				) : (
					<input type='submit' value='Submit' className='submit' />
				)}
			</form>
		</>
	)
}
