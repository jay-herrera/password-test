'use client'
import {useRouter} from 'next/navigation'

import styles from './page.module.css'

export default function BackButton() {
	const router = useRouter()

	return (
		<div className={styles.header}>
			<button
				onClick={() => {
					router.back()
				}}
			>
				<p>Back</p>
			</button>
		</div>
	)
}
