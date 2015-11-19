$(function() {
    describe('Initial Entries', function(){
		beforeEach(function(done){
			loadFeed(0,function(){
				done();
			});
			//done();
		});
		
		it('has at least a single .entry within the .feed container',function() {
			var entry = $('.feed .entry')[0];
			expect(entry).toBeGreaterThan('');
			//done();
		});
		
	});
}());