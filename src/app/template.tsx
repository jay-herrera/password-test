'use client'
import styles from './page.module.css'

import {motion} from 'framer-motion'

const variants = {
	enter: {opacity: 1, x: 0, y: 0},
	hidden: {opacity: 0, x: 0, y: '-100vh'}
}

export default function Template({children}: {children: React.ReactNode}) {
	return (
		<motion.main
			variants={variants}
			initial='hidden'
			animate='enter'
			transition={{
				damping: 20,
				duration: 0.5,
				stiffness: 50,
				type: 'easein'
			}}
			className={styles.main}
		>
			{children}
		</motion.main>
	)
}
