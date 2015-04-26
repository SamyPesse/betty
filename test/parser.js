var expect = require('chai').expect;
var parser = require('../lib/utils/parser');

describe('Messages Parser', function() {

    it('should correctly reject non betty message', function() {
        var r = parser.parse("Random message");

        expect(r).to.not.be.ok;
    });

    it('should correctly accept betty message', function() {
        var r = parser.parse("betty: Random message");

        expect(r).to.be.ok;
        expect(r.type).to.equal("unknown");
    });

    it('should correctly parse a call action', function() {
        var r = parser.parse("betty: Call +140145170479");

        expect(r).to.be.ok;
        expect(r.type).to.equal("call");
        expect(r.phone).to.equal("+140145170479");
    });

});
