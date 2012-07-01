// Create account with http://browserling.com/
// Run tests via http://testling.com/
//
// Documentation: http://testling.com/docs/
//
// Execute test via Terminal: 
// 		curl -u mark@stormcreative.co.uk:stormy -sSNT mytest.js testling.com/?browsers=iexplore/6.0,iexplore/7.0,safari/5.0
// 		curl -u mark@stormcreative.co.uk:stormy -sSNT mytest.js testling.com/?browsers=iexplore/7.0,iexplore/8.0,iexplore/9.0,firefox,safari,opera
//
// With a free account you get 200 minutes per month.
// To check your usage:
// 		curl -u me@example.com -s testling.com/usage

var test = require('testling');

test('the test name', function (t) {
    // See all test assertions here: 
    // http://testling.com/docs/#test-assertions
    
    /*
    t.equal(2 + 2, 4);
    
    t.ok(window.JSON, 'JSON is natively supported');
    
    t.log(window.navigator.appName);
    
    t.end();
    */
    
    t.createWindow('http://substack.net', function (win, $) {
        var paras = win.document.getElementsByTagName('p');
        t.log(paras);
        t.equal(win.document.title, 'The Universe of Discord');
        t.end();
    });
});