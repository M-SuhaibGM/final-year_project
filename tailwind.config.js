/** @type {import('tailwindcss').Config} */
module.exports = {
    darkMode: ["class"],
    content: [
        "./pages/**/*.{js,ts,jsx,tsx,mdx}",
        "./components/**/*.{js,ts,jsx,tsx,mdx}",
        "./app/**/*.{js,ts,jsx,tsx,mdx}",
    ],
    theme: {
        extend: {
            colors: {
                // ✅ Replace oklch-based Tailwind colors with safe RGB
                blue: {
                    600: "rgb(37, 99, 235)",
                    700: "rgb(29, 78, 216)",
                },
                gray: {
                    100: "rgb(243, 244, 246)",
                    200: "rgb(229, 231, 235)",
                    500: "rgb(107, 114, 128)",
                    700: "rgb(55, 65, 81)",
                },
                orange: {
                    500: "rgb(249, 115, 22)",
                    600: "rgb(234, 88, 12)",
                },
                green: {
                    600: "rgb(22, 163, 74)",
                    700: "rgb(21, 128, 61)",
                },
            },
        },
    },
    plugins: [],
};
