import BackButton from './back-button'
import Form from './form'
import styles from './page.module.css'

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
			<BackButton />
			<div className={styles['form-wrapper']}>
				<Form {...{registerUser}}>
					<label className={styles.label}>
						Enter your email:
						<input type='email' name='email' className={styles.input} />
					</label>
					<label className={styles.label}>
						Enter your name:
						<input type='text' name='name' className={styles.input} />
					</label>
					<label className={styles.label}>
						Enter a password:
						<input type='password' name='password' className={styles.input} />
					</label>
					<label className={styles.label}>
						Confirm password:
						<input
							type='password'
							name='password-confirm'
							className={styles.input}
						/>
					</label>
					<input type='submit' value='Submit' className={styles.submit} />
				</Form>
			</div>
			<div />
		</>
	)
}
