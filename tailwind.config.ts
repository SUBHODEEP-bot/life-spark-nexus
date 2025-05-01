
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
			fontFamily: {
				'sans': ['Inter', 'system-ui', 'sans-serif'],
				'poppins': ['Poppins', 'system-ui', 'sans-serif'],
				'sora': ['Sora', 'system-ui', 'sans-serif'],
			},
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
				lifemate: {
					purple: {
						DEFAULT: '#9b87f5',
						dark: '#7E69AB',
						light: '#D6BCFA'
					},
					dark: '#1A1F2C',
					gray: '#8E9196',
					light: '#F1F1F1',
					offwhite: '#eee',
					blue: '#D3E4FD',
					orange: '#F97316',
					yellow: '#FEF7CD',
					green: '#F2FCE2',
					pink: '#FFDEE2',
					peach: '#FDE1D3'
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
				},
				"pulse-slow": {
					"0%, 100%": {
						opacity: "1"
					},
					"50%": {
						opacity: "0.5"
					}
				},
				"float": {
					"0%, 100%": {
						transform: "translateY(0)"
					},
					"50%": {
						transform: "translateY(-10px)"
					}
				},
				"slide-up": {
					"0%": {
						transform: "translateY(20px)",
						opacity: "0" 
					},
					"100%": {
						transform: "translateY(0)",
						opacity: "1"
					}
				},
				"slide-right": {
					"0%": {
						transform: "translateX(-20px)",
						opacity: "0"
					},
					"100%": {
						transform: "translateX(0)",
						opacity: "1"
					}
				},
				"scale-up": {
					"0%": {
						transform: "scale(0.95)",
						opacity: "0"
					},
					"100%": {
						transform: "scale(1)",
						opacity: "1"
					}
				},
				"rotate-3d": {
					"0%": {
						transform: "perspective(1000px) rotateY(0deg)"
					},
					"100%": {
						transform: "perspective(1000px) rotateY(10deg)"
					}
				}
			},
			animation: {
				'accordion-down': 'accordion-down 0.2s ease-out',
				'accordion-up': 'accordion-up 0.2s ease-out',
				"pulse-slow": "pulse-slow 3s cubic-bezier(0.4, 0, 0.6, 1) infinite",
				"float": "float 6s ease-in-out infinite",
				"slide-up": "slide-up 0.6s ease-out",
				"slide-right": "slide-right 0.6s ease-out",
				"scale-up": "scale-up 0.5s ease-out",
				"rotate-3d": "rotate-3d 3s ease-in-out alternate infinite"
			},
			boxShadow: {
				'glow': '0 0 15px rgba(155, 135, 245, 0.5)',
				'3d': '10px 10px 20px rgba(0, 0, 0, 0.2)',
				'glass': '0 8px 32px rgba(0, 0, 0, 0.08)',
				'neon': '0 0 8px rgba(155, 135, 245, 0.6)'
			}
		}
	},
	plugins: [require("tailwindcss-animate")],
} satisfies Config;
