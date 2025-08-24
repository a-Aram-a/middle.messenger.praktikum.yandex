import {resolve} from 'node:path'
import {defineConfig} from 'vite'


// vite config
export default defineConfig({
    root: 'src',
    publicDir: '../static',
    resolve: {
        alias: {
            '@': resolve(__dirname, './src'),
        },
    },
    build: {
        outDir: '../dist',
        emptyOutDir: true,
    },
    server: {
        port: 3000
    },
})
