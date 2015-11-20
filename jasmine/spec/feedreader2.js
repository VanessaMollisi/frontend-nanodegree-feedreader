$(function() {
    describe('it()', function(){
		beforeEach(function(done){
			loadFeed(0,function(){
				done();
			});
		});
		
		it('a. explicitly passes done as a parameter and invokes done',function(done) {
			var entry = $('.feed .entry')[0];
			expect(entry).toBeGreaterThan('');
			done();
		});
		
		it('b. explicitly passes done as a parameter, but doesnt invoke done',function(done) {
			var entry = $('.feed .entry')[0];
			expect(entry).toBeGreaterThan('');
			//done();
		});
		
		it('c. doesnt explicitly pass done as a parameter, but does invoke done',function() {
			var entry = $('.feed .entry')[0];
			expect(entry).toBeGreaterThan('');
			done();
		});
		
		it('d. never mentions done',function() {
			var entry = $('.feed .entry')[0];
			expect(entry).toBeGreaterThan('');

		});
		
	});
}());