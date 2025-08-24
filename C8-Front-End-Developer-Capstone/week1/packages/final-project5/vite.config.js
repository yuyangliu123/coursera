import { defineConfig } from 'vite'
import react from "@vitejs/plugin-react";
import viteCompression from "vite-plugin-compression"
export default defineConfig({
    server: {
        open: '/',
        port: 3000,
    },
    plugins: [react(),
        viteCompression({
            verbose: true,
            disable: false,
            deleteOriginFile: false,
            threshold: 1024,
            algorithm: "brotliCompress",
            ext: ".br",
        })
    ],
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