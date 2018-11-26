const should = require('should'),
    Promise = require('bluebird'),
    StorageBase = require('../BaseStorage');

describe('Storage Base', function () {
    it('getSanitizedFileName: escape non accepted characters in filenames', function () {
        const storage = new StorageBase();
        storage.getSanitizedFileName('(abc*@#123).zip').should.eql('-abc-@-123-.zip');
    });
});
