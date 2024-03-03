import {Inter} from 'next/font/google'

import type {Metadata} from 'next'
import './globals.css'

const inter = Inter({subsets: ['latin']})

export const metadata: Metadata = {
	description: 'Example login managed by next.js',
	title: "Jay's Password Demo"
}

export default function RootLayout({
	children
}: Readonly<{
	children: React.ReactNode
}>) {
	return (
		<html lang='en'>
			<body className={inter.className}>{children}</body>
		</html>
	)
}
