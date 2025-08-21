import type { Config } from "tailwindcss";

export default {
	darkMode: ["class"],
	content: [
		"./pages/**/*.{ts,tsx}",
		"./components/**/*.{ts,tsx}",
		"./app/**/*.{ts,tsx}",
		"./src/**/*.{ts,tsx}",
	],
	prefix: "",
	theme: {
		container: {
			center: true,
			padding: '2rem',
			screens: {
				'2xl': '1400px'
			}
		},
		extend: {
			colors: {
				// Core app colors using our design system
				background: 'hsl(var(--background))',
				foreground: 'hsl(var(--foreground))',
				
				// Surface variations
				surface: {
					DEFAULT: 'hsl(var(--surface))',
					secondary: 'hsl(var(--surface-secondary))',
					tertiary: 'hsl(var(--surface-tertiary))'
				},
				
				// Interactive elements
				primary: {
					DEFAULT: 'hsl(var(--primary))',
					hover: 'hsl(var(--primary-hover))',
					foreground: 'hsl(var(--primary-foreground))'
				},
				
				// Text hierarchy
				text: {
					primary: 'hsl(var(--text-primary))',
					secondary: 'hsl(var(--text-secondary))',
					tertiary: 'hsl(var(--text-tertiary))',
					placeholder: 'hsl(var(--text-placeholder))'
				},
				
				// Borders and dividers
				border: {
					DEFAULT: 'hsl(var(--border))',
					light: 'hsl(var(--border-light))'
				},
				divider: 'hsl(var(--divider))',
				
				// Sidebar specific
				sidebar: {
					DEFAULT: 'hsl(var(--sidebar-bg))',
					hover: 'hsl(var(--sidebar-hover))',
					active: 'hsl(var(--sidebar-active))',
					border: 'hsl(var(--sidebar-border))'
				},
				
				// Editor elements
				editor: {
					DEFAULT: 'hsl(var(--editor-bg))',
					hover: 'hsl(var(--editor-hover))',
					focus: 'hsl(var(--editor-focus))'
				}
			},
			borderRadius: {
				lg: 'var(--radius)',
				md: 'calc(var(--radius) - 2px)',
				sm: 'calc(var(--radius) - 4px)'
			},
			keyframes: {
				'accordion-down': {
					from: {
						height: '0'
					},
					to: {
						height: 'var(--radix-accordion-content-height)'
					}
				},
				'accordion-up': {
					from: {
						height: 'var(--radix-accordion-content-height)'
					},
					to: {
						height: '0'
					}
				}
			},
			animation: {
				'accordion-down': 'accordion-down 0.2s ease-out',
				'accordion-up': 'accordion-up 0.2s ease-out'
			}
		}
	},
	plugins: [require("tailwindcss-animate")],
} satisfies Config;
