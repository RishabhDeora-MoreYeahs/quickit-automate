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
				border: 'hsl(var(--border))',
				input: 'hsl(var(--input))',
				ring: 'hsl(var(--ring))',
				background: 'hsl(var(--background))',
				foreground: 'hsl(var(--foreground))',
				primary: {
					DEFAULT: 'hsl(var(--primary))',
					foreground: 'hsl(var(--primary-foreground))'
				},
				automation: {
					primary: 'hsl(var(--automation-primary))',
					'primary-hover': 'hsl(var(--automation-primary-hover))',
					'primary-light': 'hsl(var(--automation-primary-light))',
					secondary: 'hsl(var(--automation-secondary))',
					'secondary-hover': 'hsl(var(--automation-secondary-hover))',
					canvas: 'hsl(var(--automation-canvas))',
					border: 'hsl(var(--automation-border))',
					'border-dashed': 'hsl(var(--automation-border-dashed))',
					'block-bg': 'hsl(var(--automation-block-bg))',
					'block-hover': 'hsl(var(--automation-block-hover))',
					'block-shadow': 'hsl(var(--automation-block-shadow))',
					success: 'hsl(var(--automation-success))',
					'success-light': 'hsl(var(--automation-success-light))',
					warning: 'hsl(var(--automation-warning))',
					error: 'hsl(var(--automation-error))',
					'text-primary': 'hsl(var(--automation-text-primary))',
					'text-secondary': 'hsl(var(--automation-text-secondary))',
					'text-muted': 'hsl(var(--automation-text-muted))',
					'connector-line': 'hsl(var(--automation-connector-line))',
					'connector-bg': 'hsl(var(--automation-connector-bg))',
					'connector-hover': 'hsl(var(--automation-connector-hover))'
				},
				secondary: {
					DEFAULT: 'hsl(var(--secondary))',
					foreground: 'hsl(var(--secondary-foreground))'
				},
				destructive: {
					DEFAULT: 'hsl(var(--destructive))',
					foreground: 'hsl(var(--destructive-foreground))'
				},
				muted: {
					DEFAULT: 'hsl(var(--muted))',
					foreground: 'hsl(var(--muted-foreground))'
				},
				accent: {
					DEFAULT: 'hsl(var(--accent))',
					foreground: 'hsl(var(--accent-foreground))'
				},
				popover: {
					DEFAULT: 'hsl(var(--popover))',
					foreground: 'hsl(var(--popover-foreground))'
				},
				card: {
					DEFAULT: 'hsl(var(--card))',
					foreground: 'hsl(var(--card-foreground))'
				},
				sidebar: {
					DEFAULT: 'hsl(var(--sidebar-background))',
					foreground: 'hsl(var(--sidebar-foreground))',
					primary: 'hsl(var(--sidebar-primary))',
					'primary-foreground': 'hsl(var(--sidebar-primary-foreground))',
					accent: 'hsl(var(--sidebar-accent))',
					'accent-foreground': 'hsl(var(--sidebar-accent-foreground))',
					border: 'hsl(var(--sidebar-border))',
					ring: 'hsl(var(--sidebar-ring))'
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
