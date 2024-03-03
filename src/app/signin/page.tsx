import Link from 'next/link'

import Form from './form'
import styles from './page.module.css'

import {compare} from 'bcrypt'
import {SignJWT} from 'jose'
import {AsyncDatabase} from 'promised-sqlite3'
import {Database} from 'sqlite3'

export default function Signin() {
	const authenticateUser = async (formData: {
		email: string
		password: string
	}) => {
		'use server'

		try {
			const db = new AsyncDatabase(new Database('./users.db'))

			const user: {name: string; pwHashed: string} | undefined = await db.get(
				`SELECT name, pwHashed FROM users WHERE email = '${formData.email}'`
			)

			db.close()

			if (!user) {
				return {
					message: 'User not found',
					status: 404
				}
			}

			if (await compare(formData.password, user.pwHashed)) {
				if (!process.env.JWT_SECRET) {
					throw new Error('JWT_SECRET not found')
				}

				const jwt: string = await new SignJWT({
					name: user.name
				})
					.setExpirationTime('1d')
					.setProtectedHeader({alg: 'HS256'})
					.sign(new TextEncoder().encode(process.env.JWT_SECRET as string))

				return {
					jwt,
					message: 'User logged in!',
					status: 200
				}
			}

			return {
				message: 'Invalid password',
				status: 401
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

			console.error(err)

			return {
				message: 'Error logging in user',
				status: 500
			}
		}
	}

	return (
		<main className={styles.main}>
			<div className={styles.header}>
				<Link href='/signup'>
					<p>Sign Up</p>
				</Link>
			</div>
			<div className={styles['form-wrapper']}>
				<Form {...{authenticateUser}}>
					<label className={styles.label}>
						Enter your email:
						<input type='email' name='email' className={styles.input} />
					</label>
					<label className={styles.label}>
						Enter your password:
						<input type='password' name='password' className={styles.input} />
					</label>
					<input type='submit' value='Submit' className={styles.submit} />
				</Form>
			</div>
			<div />
		</main>
	)
}