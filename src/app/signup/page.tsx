import BackButton from './back-button'
import Form from './form'
import styles from './page.module.css'

import {hash} from 'bcrypt'
import {AsyncDatabase} from 'promised-sqlite3'
import {Database} from 'sqlite3'

export default function Signup() {
	const registerUser = async (formData: {
		email: string
		name: string
		password: string
	}) => {
		'use server'
		const hashedPassword = await hash(formData.password, 10)

		try {
			const db = new AsyncDatabase(new Database('./users.db'))

			await db.run(`
				INSERT INTO users (email, name, pwHashed)
				VALUES ('${formData.email}', '${formData.name}', '${hashedPassword}')
			`)
			await db.close()

			return {
				message: 'User registered successfully!',
				status: 200
			}
		} catch (err) {
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
		<main className={styles.main}>
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
		</main>
	)
}
