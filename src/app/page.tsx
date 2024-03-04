import {cookies} from 'next/headers'
import Image from 'next/image'

import styles from './page.module.css'
import SignoutButton from './signout-button'

export default function Home() {
	const name = cookies().get('name')

	return (
		<>
			<div className={styles.header}>
				<SignoutButton />
				<p className={styles.greeting}>
					Hello{name?.value ? `, ${name?.value}` : ''}!
				</p>
			</div>

			<div className={styles.center}>
				<Image
					className={styles.logo}
					src='/jays-pw-demo.svg'
					alt='Website Logo'
					fill={true}
					priority
				/>
			</div>

			<div />
		</>
	)
}
