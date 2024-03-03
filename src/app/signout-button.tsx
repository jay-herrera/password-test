'use client'
import {useRouter} from 'next/navigation'

export default function SignoutButton() {
	const router = useRouter()

	return (
		<button
			onClick={() => {
				document.cookie = 'jwt=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT'
				router.replace('/signin')
			}}
		>
			Sign Out
		</button>
	)
}
