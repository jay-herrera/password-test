'use client'
import {ReactNode, useState} from 'react'
import {useRouter} from 'next/navigation'

import {RotatingLines} from 'react-loader-spinner'

export default function Form({
	children,
	authenticateUser
}: {
	children?: ReactNode
	authenticateUser: (formData: {email: string; password: string}) => Promise<{
		status: number
		message: string
		jwt?: string
	}>
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
						password: string
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

					if (formData.password.length < 6) {
						setErrorText('Password must be at least 6 characters')

						return
					}
					const response = await authenticateUser(formData)

					if (response.status !== 200) {
						setLoading(false)
						setErrorText((response as {message: string})?.message)

						return
					}

					if (response?.jwt) {
						document.cookie = `jwt=${response.jwt}; path=/`
					}
					router.replace('/')
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
