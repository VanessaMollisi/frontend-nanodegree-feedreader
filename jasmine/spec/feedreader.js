
+/* feedreader.js
 *
 * This is the spec file that Jasmine will read and contains
 * all of the tests that will be run against your application.
 */

/* We're placing all of our tests within the $() function,
 * since some of these tests may require DOM elements. We want
 * to ensure they don't run until the DOM is ready.
 */
$(function() {
    /* This is our first test suite - a test suite just contains
    * a related set of tests. This suite is all about the RSS
    * feeds definitions, the allFeeds variable in our application.
    */
    describe('RSS Feeds', function() {
        /* This is our first test - it tests to make sure that the
         * allFeeds variable has been defined and that it is not
         * empty. Experiment with this before you get started on
         * the rest of this project. What happens when you change
         * allFeeds in app.js to be an empty array and refresh the
         * page?
         */
        it('are defined', function() {
            expect(allFeeds).toBeDefined();
            expect(allFeeds.length).not.toBe(0);
        });


        /* TODO: Write a test that loops through each feed
         * in the allFeeds object and ensures it has a URL defined
         * and that the URL is not empty.
         */
		 
		//swiped this looping technique from https://discussions.udacity.com/t/tricks-for-setting-callbacks-and-handlers-during-loop-iteration-closure/38435
		//I do it this way because I want to know which entries fail
		allFeeds.forEach(function(feed,i) {
			it(i+' has a url', function() {
				expect(feed['url']).toBeDefined();
				expect(feed['url'].length).not.toBe(0);
			});
		
		});


        /* TODO: Write a test that loops through each feed
         * in the allFeeds object and ensures it has a name defined
         * and that the name is not empty.
         */
		allFeeds.forEach(function(feed,i) {
			it(i+' has a name', function() {
				expect(feed['name']).toBeDefined();
				expect(feed['name'].length).not.toBe(0);
			});
		
		});
    });


    /* TODO: Write a new test suite named "The menu" */
	describe('The menu', function() {
		
        /* TODO: Write a test that ensures the menu element is
         * hidden by default. You'll have to analyze the HTML and
         * the CSS to determine how we're performing the
         * hiding/showing of the menu element.
         */
		it('is hidden', function() {
			var body = $('body');
			var menu = $('.menu');
			expect(body.hasClass('menu-hidden')).toBe(true);
			expect(menu.position().left+menu.width()).toBeLessThan(0);
		});
		 

         /* TODO: Write a test that ensures the menu changes
          * visibility when the menu icon is clicked. This test
          * should have two expectations: does the menu display when
          * clicked and does it hide when clicked again.
          */
		 //I care how long it takes for the menu to be visible
		 //The css transition is .2 seconds, so I give it .25 seconds to transition
		it('changes visibility on icon click', function(done) {
			var body = $('body');
			var menu = $('.menu');
			var menuIcon = $('.menu-icon-link');
			menuIcon.trigger('click');
			window.setTimeout(function(){
				expect(body.hasClass('menu-hidden')).toBe(false);
				expect(menu.position().left+menu.width()).not.toBeLessThan(0);
				menuIcon.trigger('click');
				window.setTimeout(function(){
					expect(body.hasClass('menu-hidden')).toBe(true);
					expect(menu.position().left+menu.width()).toBeLessThan(0);
					done();
				},250);
			},250);
		});
	});

    /* TODO: Write a new test suite named "Initial Entries" */
	describe('Initial Entries', function(){
        /* TODO: Write a test that ensures when the loadFeed
         * function is called and completes its work, there is at least
         * a single .entry element within the .feed container.
         * Remember, loadFeed() is asynchronous so this test wil require
         * the use of Jasmine's beforeEach and asynchronous done() function.
         */
		//'Initial Entries' seems like a misleading description for this test since the TODO does not say anything about what initially happens
		//I will test the 0-index feed since that is what is supposed to happen on page load; it looks like the next suite is for other feeds
		beforeEach(function(done){
			loadFeed(0,function(){
				done();
			});

		});
		
		it('has at least a single .entry within the .feed container',function() {
			var entry = $('.feed .entry')[0];
			expect(entry).toBeGreaterThan('');

		});
		
	});
    /* TODO: Write a new test suite named "New Feed Selection"*/
	describe('New Feed Selection', function() {
        /* TODO: Write a test that ensures when a new feed is loaded
         * by the loadFeed function that the content actually changes.
         * Remember, loadFeed() is asynchronous.
         */
		//The content includes the header-title, the entry-link, the article>h2 title, and the article>p content
		//Specific things to look for are empty entries, duplicate entries for a single query, ghost entries from previous queries, ghost links
		//I think I will do this by first retrieving the content for each feed
		//then comparing the content across the feeds.
		
		var stack = [];

			
		allFeeds.forEach(function(feed, i) {
			beforeAll(function(done){
			
				loadFeed(i,function() {
					var t = $('.header-title')[0].innerText;
					
					var aEntries = [];
					var $entries = $('.feed .entry-link');
					for(var j=0,k=$entries.length;j<k;j++){
						var eL = $entries[j].getAttribute('href');
						var eT = $entries[j].innerText;
						var e = new feedEntry({entryLink: eL, entryContent: eT});
						aEntries.push(e);
					}
					var datum = new feedDatum({headerTitle: t,entries: aEntries});
					stack.push(datum);
					
					done();
				});
			});
			
		});
		
		it('has the right number of feeds',function() {

			expect(stack.length).toEqual(allFeeds.length);

		});
		
		//https://github.com/jasmine/jasmine/issues/830 - suggests I cant dynamically make tests based on asynchronous response, unfortunately
		it('has feeds with content',function() {

			stack.forEach(function(f,i) {

						expect(stack[i]).not.toBeUndefined();

			});
			

		});
			
		it('has header titles that exist and change on loadfeed',function(){
			var initTitle = stack[0].headerTitle;
			expect(initTitle).toBeGreaterThan('');
			for(var i=1,l=stack.length;i<l;i++) {
				expect(stack[i].headerTitle).not.toBe(initTitle);
				initTitle=stack[i].headerTitle;
			}
		});
		
		//I would like to test internal differences (all the links for a given feed are different)
		//and across feed differences (the links change when the feed changes)
		it('has feeds whose entry links exist and are different from each other', function(){
			for(var i = 0,l=stack.length;i<l;i++) {
				expect(stack[i].entries.length).toBeGreaterThan(0);
				var a = stack[i].getEntryTitles();
				var s = new Set(a);
				//console.dir(s);
				expect(s.size).toEqual(a.length);//http://stackoverflow.com/questions/7376598/in-javascript-how-do-i-check-if-an-array-has-duplicate-values
			}
			
			
		});
		
		it('has feeds with the same number of entries',function(){
			var initTitles = stack[0].getEntryTitles();
			
			for(var i=1,l=stack.length;i<l;i++) {
				//var s = new Set();
				expect(stack[i].getEntryTitles().length).toEqual(initTitles.length);
			}
		});
		
		it('has feeds whose corresponding entry links change when the feed changes',function(){
			var initTitles = stack[0].getEntryTitles();
			
			for(var i=1,l=stack.length;i<l;i++) {

				expect(stack[i].getEntryTitles().length).toEqual(initTitles.length);
			}
			for(var i=0,l=initTitles.length;i<l;i++) {
				var s = new Set();
				for(var j=0,k=stack.length;j<k;j++) {
					var titles = stack[j].getEntryTitles();
					s.add(titles[i]);
				}

				expect(s.size).toEqual(initTitles.length);
			}
			
		});

	});
}());

var feedDatum = function(obj) {
	this.headerTitle = obj['headerTitle'];
	this.entries = obj['entries'];
};
feedDatum.prototype.getEntryTitles = function() {
	var aTitles = [];
	for(var i=0,l=this.entries.length;i<l;i++) {
		aTitles.push(this.entries[i].entryLink);
	}
	return aTitles;
}

var feedEntry = function(obj) {
	this.entryLink = obj.entryLink;
	//this.entryTitle = obj.entryTitle;
	this.entryContent = obj.entryContent;
};


