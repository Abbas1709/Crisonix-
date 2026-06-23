/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            fontFamily: {
                'jersey': ['"Jersey 15"', 'sans-serif'],
                'segoe': ['"Segoe UI"', 'system-ui', 'sans-serif'],
            },
            colors: {
                brand: {
                    accent: '#00e6ff',
                    tealStart: '#067b8d',
                    tealEnd: '#0ba5b8',
                }
            },
            backgroundImage: {
                'auth-gradient': "linear-gradient(135deg, #067b8d, #0ba5b8)",
                'overlay-gradient': "linear-gradient(rgba(0,0,0,0.8), rgba(0,0,0,0.8))",
            },
            boxShadow: {
                'card': '0 0 50px rgba(0,255,255,0.2)',
                'card-hover': '0 0 70px rgba(0,255,255,0.4)',
                'glow': '0 0 15px #00e6ff',
                'btn-glow': '0 0 20px #00e6ff',
            }
        },
    },
    plugins: [],
}
