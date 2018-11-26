const moment = require('moment'),
    path = require('path');

class StorageBase {
    constructor() {
        Object.defineProperty(this, 'requiredFns', {
            value: ['exists', 'save', 'serve', 'delete', 'read'],
            writable: false
        });
    }

    getTargetDir(baseDir = '') {
        const date = moment(),
            day = date.format('DD'),
            month = date.format('MM'),
            year = date.format('YYYY');

        return path.join(baseDir, year, month, day);
    }

    getUniqueFileName(image, targetDir) {
        const ext = path.extname(image.name);

        // poor extension validation
        // .1 is not a valid extension
        if (!ext.match(/.\d/)) {
            const name = this.getSanitizedFileName(path.basename(image.name, ext));
            return path.join(targetDir, name, ext);
        } else {
            const name = this.getSanitizedFileName(path.basename(image.name));
            return path.join(targetDir, name);
        }
    }

    getSanitizedFileName(fileName) {
        // below only matches ascii characters, @, and .
        // unicode filenames like город.zip would therefore resolve to ----.zip
        return fileName.replace(/[^\w@.]/gi, '-');
    }
}

module.exports = StorageBase;
