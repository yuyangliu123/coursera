import { defineConfig } from 'vite'
import react from "@vitejs/plugin-react";

export default defineConfig({
    server: {
        open: '/',
        port: 3000,
    },
    plugins: [react()],
    build: {
        sourcemap: false, // disable source maps at production build
    },
    esbuild: {
        loader: "jsx",
        include: /src\/.*\.jsx?$/,
        exclude: [],
    },
    optimizeDeps: {
        esbuildOptions: {
            loader: {
                '.js': 'jsx',
            },
        },
    },
})