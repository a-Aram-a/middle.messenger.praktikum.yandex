import {resolve} from 'node:path'
import {defineConfig} from 'vite'
import handlebars from 'vite-plugin-handlebars'
import {generatePartialDirs, generateRollupInputs} from "./vite.helpers.js";

console.log('Generating Rollup inputs...');
const rollupInputs = generateRollupInputs(__dirname);
console.log('Rollup inputs generated:', rollupInputs);

console.log('Generating partial directories...');
const partialDirectories = generatePartialDirs(__dirname);
console.log('Partial directories generated:', partialDirectories);

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
        rollupOptions: {
            input: rollupInputs,
        },
    },
    server: {
        port: 3000
    },
    plugins: [handlebars({
        partialDirectory: ['./src/layout/main', './src/layout/profile', ...partialDirectories],
        helpers: {
            default: (value, defaultValue) => {
                return value || defaultValue;
            },
        },
        context: {
            title: 'Nuclear Messenger',
            description: 'A secure messaging app built with modern web technologies.',
        }
    })],
})
