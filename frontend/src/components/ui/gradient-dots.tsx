'use client';

import React from 'react';
import { motion } from 'framer-motion';

type GradientDotsProps = React.ComponentProps<typeof motion.div> & {
	/** Dot size (default: 2) */
	dotSize?: number;
	/** Spacing between dots (default: 20) */
	spacing?: number;
	/** Animation duration (default: 30) */
	duration?: number;
	/** Color cycle duration (default: 6) */
	colorCycleDuration?: number;
	/** Background color (default: '#0f172a') */
	backgroundColor?: string;
};

export function GradientDots({
	dotSize = 2,
	spacing = 20,
	duration = 30,
	colorCycleDuration = 6,
	backgroundColor = '#0f172a',
	className,
	...props
}: GradientDotsProps) {
	const hexSpacing = spacing * 1.732;

	return (
		<motion.div
			className={`fixed inset-0 pointer-events-none z-0 ${className}`}
			style={{
				backgroundColor,
				backgroundImage: `
          radial-gradient(circle, transparent ${dotSize}px, ${backgroundColor} ${dotSize}px),
          radial-gradient(circle, transparent ${dotSize}px, ${backgroundColor} ${dotSize}px),
          radial-gradient(circle at 50% 50%, #ff0000, transparent 50%),
          radial-gradient(circle at 50% 50%, #ffff00, transparent 50%),
          radial-gradient(circle at 50% 50%, #00ff00, transparent 50%),
          radial-gradient(circle at 50% 50%, #0000ff, transparent 50%)
        `,
				backgroundSize: `
          ${spacing}px ${hexSpacing}px,
          ${spacing}px ${hexSpacing}px,
          100% 100%,
          100% 100%,
          100% 100%,
          100% 100%
        `,
				backgroundPosition: `
          0px 0px, ${spacing / 2}px ${hexSpacing / 2}px,
          0% 0%,
          0% 0%,
          0% 0%,
          0% 0%
        `,
				backgroundBlendMode: 'screen',
			}}
			animate={{
				backgroundPosition: [
					`0px 0px, ${spacing / 2}px ${hexSpacing / 2}px, 0% 0%, 100% 0%, 0% 100%, 100% 100%`,
					`0px 0px, ${spacing / 2}px ${hexSpacing / 2}px, 100% 100%, 0% 100%, 100% 0%, 0% 0%`,
				],
				filter: ['hue-rotate(0deg)', 'hue-rotate(360deg)'],
			}}
			transition={{
				backgroundPosition: {
					duration: duration,
					ease: 'linear',
					repeat: Number.POSITIVE_INFINITY,
				},
				filter: {
					duration: colorCycleDuration,
					ease: 'linear',
					repeat: Number.POSITIVE_INFINITY,
				},
			}}
			{...props}
		/>
	);
}

