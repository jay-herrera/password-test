import BackButton from './back-button'
import Form from './form'
import styles from '../signin/page.module.css'

import {sql} from '@vercel/postgres'
import {hash} from 'bcrypt'

export const runtime = 'nodejs'

export default function Signup() {
	const registerUser = async (formData: {
		email: string
		name: string
		password: string
	}) => {
		'use server'
		const hashedPassword = await hash(formData.password, 10)

		try {
			sql`
				INSERT INTO users (email, name, pwhashed)
				VALUES (${formData.email}, ${formData.name}, ${hashedPassword})
			`

			return {
				message: 'User registered successfully!',
				status: 200
			}
		} catch (err) {
			console.error(err)

			if (
				(err as Error).message ===
				'SQLITE_CONSTRAINT: UNIQUE constraint failed: users.email'
			) {
				return {
					message: 'User already exists',
					status: 409
				}
			}

			return {
				message: 'Error registering user',
				status: 500
			}
		}
	}

	return (
		<>
			<div className={styles.header}>
				<BackButton />
			</div>
			<div className='form-wrapper'>
				<Form {...{registerUser}}>
					<label className={styles.label}>
						Enter your email:
						<input type='email' name='email' />
					</label>
					<label className={styles.label}>
						Enter your name:
						<input type='text' name='name' />
					</label>
					<label className={styles.label}>
						Enter a password:
						<input type='password' name='password' />
					</label>
					<label className={styles.label}>
						Confirm password:
						<input type='password' name='password-confirm' />
					</label>
				</Form>
			</div>
			<div />
		</>
	)
}
