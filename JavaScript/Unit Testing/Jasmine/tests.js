describe("Hello world", function() {
	it("says hello", function() {			
		expect(helloWorld()).toEqual("Hello world!");			
	});			
});

describe("Hello world", function() {
	it("says hello", function() {			
		expect(helloWorld()).toContain("Hello world!");			
	});			
});

/* ASYNC TESTING
describe("Calculator", function() {
	it("should factor two huge numbers asynchronously", function() {
		var calc = new Calculator();
		var answer = calc.factor(18973547201226, 28460320801839);

		waitsFor(function() {
			return calc.answerHasBeenCalculated();
		}, "It took too long to find those factors.", 10000);

		runs(function() {
			expect(answer).toEqual(9486773600613);
		});
	});
});
*/