import {globSync} from 'glob';
import path from 'path';

export function generateRollupInputs(projectRoot) {
    const pageFiles = globSync([
        'src/index.html',
        'src/pages/**/*.html'
    ]);

    return pageFiles.reduce((acc, file) => {
        let name;
        if (file === path.join('src', 'index.html')) {
            name = 'index';
        } else {
            name = `${path.basename(path.dirname(file))}-${path.basename(file)}`;
        }

        acc[name] = path.resolve(projectRoot, file);
        return acc;
    }, {});
}

export function generatePartialDirs(projectRoot) {
    const files = globSync('src/{components,pages}/**/*.{hbs,html}');
    const directories = files.map(file => path.dirname(file));
    const uniqueDirs = [...new Set(directories)];
    return uniqueDirs.map(dir => path.resolve(projectRoot, dir));
}