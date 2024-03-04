import Link from 'next/link'

import Form from './form'
import styles from './page.module.css'

import {sql} from '@vercel/postgres'
import {compare} from 'bcrypt'
import {SignJWT} from 'jose'

export const runtime = 'nodejs'

export default function Signin() {
	const authenticateUser = async (formData: {
		email: string
		password: string
	}) => {
		'use server'

		try {
			const {
				rows: [user]
			} =
				await sql`SELECT name, pwHashed FROM users WHERE email = ${formData.email}`

			if (!user) {
				return {
					message: 'User not found',
					status: 404
				}
			}

			if (await compare(formData.password, user.pwhashed)) {
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
		<>
			<div className={styles.header}>
				<Link href='/signup'>
					<p>Sign Up</p>
				</Link>
			</div>
			<div className='form-wrapper'>
				<Form {...{authenticateUser}}>
					<label className={styles.label}>
						Enter your email:
						<input type='email' name='email' />
					</label>
					<label className={styles.label}>
						Enter your password:
						<input type='password' name='password' />
					</label>
				</Form>
			</div>
			<div />
		</>
	)
}
