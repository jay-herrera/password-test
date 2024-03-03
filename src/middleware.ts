import {cookies} from 'next/headers'
import {NextResponse} from 'next/server'
import type {NextRequest} from 'next/server'

import {jwtVerify} from 'jose'

export const config = {
	matcher: '/'
}

// This function can be marked `async` if using `await` inside
export async function middleware(request: NextRequest) {
	const jwt = cookies().get('jwt')

	if (!jwt?.value) {
		return NextResponse.redirect(new URL('/signin', request.url))
	}

	try {
		const {
			payload: {name}
		} = await jwtVerify(
			jwt.value,
			new TextEncoder().encode(process.env.JWT_SECRET as string)
		)

		const passthroughResponse = NextResponse.next()
		passthroughResponse.cookies.set('name', name as string)

		return passthroughResponse
	} catch (err) {
		console.error(err)

		return NextResponse.redirect(new URL('/signin', request.url))
	}
	// .redirect(new URL('/home', request.url))
}
