var expect = require('chai').expect;
var parser = require('../lib/parser');

describe('Messages Parser', function() {

	it('should correctly parse a call action', function() {
		var r = parser.parse("Call +140145170479 for me");

		expect(r).to.be.ok;
		expect(r.type).to.equal("call");
		expect(r.phone).to.equal("+140145170479");
	});

});
