const moment = require('moment'),
    path = require('path');

class StorageBase {
    constructor() {
        Object.defineProperty(this, 'requiredFns', {
            value: ['exists', 'save', 'serve', 'delete', 'read'],
            writable: false
        });
    }

    getTargetDir(baseDir) {
        const date = moment(),
            day = date.format('DD'),
            month = date.format('MM'),
            year = date.format('YYYY');

        if (baseDir) {
            return path.join(baseDir, year, month, day);
        }

        return path.join(year, month, day);
    }

    generateUnique(dir, name, ext, i) {
        let filename,
            append = '';

        if (i) {
            append = '-' + i;
        }

        if (ext) {
            filename = name + append + ext;
        } else {
            filename = name + append;
        }

        return this.exists(filename, dir).then((exists) => {
            if (exists) {
                i = i + 1;
                return this.generateUnique(dir, name, ext, i);
            } else {
                return path.join(dir, filename);
            }
        });
    }

    getUniqueFileName(image, targetDir) {
        var ext = path.extname(image.name), name;

        // poor extension validation
        // .1 is not a valid extension
        if (!ext.match(/.\d/)) {
            name = this.getSanitizedFileName(path.basename(image.name, ext));
            return this.generateUnique(targetDir, name, ext, 0);
        } else {
            name = this.getSanitizedFileName(path.basename(image.name));
            return this.generateUnique(targetDir, name, null, 0);
        }
    }

    getSanitizedFileName(fileName) {
        // below only matches ascii characters, @, and .
        // unicode filenames like город.zip would therefore resolve to ----.zip
        return fileName.replace(/[^\w@.]/gi, '-');
    }
}

module.exports = StorageBase;
