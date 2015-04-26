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

    it('should correctly parse a text action', function() {
        var r = parser.parse("betty: Text +140145170479");

        expect(r).to.be.ok;
        expect(r.type).to.equal("text");
        expect(r.phone).to.equal("+140145170479");
    });

    it('should not parse a text action without phone', function() {
        var r = parser.parse("betty: Text hello");

        expect(r).to.be.ok;
        expect(r.type).to.equal("unknown");
    });

    it('should correctly parse a stop action', function() {
        var r = parser.parse("betty: Stop this conversation");

        expect(r).to.be.ok;
        expect(r.type).to.equal("stop");
    });

    it('should correctly handle other receptionist names', function() {
        var r = parser.parse("ben: Stop this conversation", { receptionist: "Ben" });

        expect(r).to.be.ok;
        expect(r.type).to.equal("stop");
    });

});
