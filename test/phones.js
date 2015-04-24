

var expect = require('chai').expect;
var phone = require('../lib/utils/phone');

describe('Phone', function() {

    it('should correctly valid numbers', function() {
        expect(phone.valid('+140145170479')).to.be.ok;
        expect(phone.valid('844-913-7443')).to.be.ok;
        expect(phone.valid('(844)-913-7443')).to.be.ok;
    });

    it('should correctly detect invalid numbers', function() {
        expect(phone.valid('test')).to.not.be.ok;
    });

});
