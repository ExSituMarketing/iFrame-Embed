/**
 * Make sure this file is loaded
 */



module('Browser');
QUnit.test('TestgetElementsByClassName', function () {
    var f = $("#qunit-fixture");
    f.append("<iframe class='test'/>");
    ok(window.document.getElementsByClassName, 'getElementsByClassName is defined');
    deepEqual(window.document.getElementsByClassName('nonexisting').length, 0, 'There are no elements with the class: nonexisting');
    deepEqual(window.document.getElementsByClassName('test').length, 1, 'There is one element with the class: test');
});

module('Init');
QUnit.test('TestDefinitions', function () {
    AOembed.init(window, AOembed);
    ok(AOembed, "AOembed namespace exists");
    deepEqual(AOembed.document, document, "Document is set");
    deepEqual(AOembed.params.hasResponsive, false, "Not responsive by default");
    deepEqual(AOembed.params.hasRefresh, false, "Not auto refresh by default");
    deepEqual(AOembed.params.asyncImpressionLog, true, "Async impression logging by default");
    deepEqual(AOembed.params.mobileWidth > 0, true, 'Min mobile width set');
    deepEqual(AOembed.params.isActiveWindow, true, 'Default isActiveWindow is set to true');
    deepEqual(AOembed.elements, {}, 'Elements are empty');
    deepEqual(AOembed.current, null, 'Current is not set');
    deepEqual(AOembed.fwidth, {}, 'Widths are empty');
    deepEqual(AOembed.fheight, {}, 'Heights are empty');
    deepEqual(AOembed.messageID, {}, 'Message timer ID is empty');
    deepEqual(AOembed.timerID, {}, 'Refresh timer ID is empty');
    deepEqual(AOembed.responsiveSteps[300] > -1, true, "Responsive steps are defined");
    deepEqual(AOembed.refreshTimer.mobile > -1, true, "Refresh time for mobile is defined");
    deepEqual(AOembed.refreshTimer.desktop > -1, true, "Refresh time for desktop is defined");
});


QUnit.test("TestGetClient", function () {
    deepEqual(AOembed.getClient(), 'desktop', "We can get default client (desktop)");
    var doc = document.implementation.createDocument('http://www.w3.org/1999/xhtml', 'html', null);
    var body = doc.createElementNS('http://www.w3.org/1999/xhtml', 'body');
    body.setAttribute('style', 'width:300px');
    AOembed.setDocument(doc);
    window.innerWidth = 200;
    deepEqual(AOembed.getClient(), 'mobile', "We can get mobile client");
});

//QUnit.test("TestInViewport", function () {
//    deepEqual(AOembed.inViewport(null),true, "Invalid element handled 0");
//        var f = $("#qunit-fixture");
//    f.append('<iframe id="TestElement1" class="test"/><span>CAW</span>');
//        f.show();
//       
//AOembed.init(window, AOembed);
//    deepEqual(AOembed.inViewport(f.id),false, "Element NOT in the viewport");
//    //deepEqual(AOembed.inViewport(e.id),true, "Element IS in the viewport");
//});

module('Auto Refresh');
QUnit.test('TestDefaultTimer', function () {
    var f = $("#qunit-fixture");
    f.append('<iframe id="TestElement1" class="test"/></iframe>');
    var e = document.getElementById('TestElement1');
    deepEqual(AOembed.defaultTimerID(null), false, 'Invalid element handled 1');
    deepEqual(AOembed.defaultTimerID(e), 0, 'Timer has been set');
    AOembed.timerID = {};
});

QUnit.test('TestHandleRefresh', function () {
    deepEqual(AOembed.handleRefresh(null), false, 'Invalid element handled 2');
    var e = document.createElement("TestElement");
    e.setAttribute("id", "TestElement2");
    e.setAttribute("data-ref", "true");
    deepEqual(AOembed.handleRefresh(e), true, 'Refresh has started');
    deepEqual(AOembed.timerID[e.id] > 1, true, 'Timer has been set');
    AOembed.timerID = {};
});

QUnit.test('TestInTimer', function () {
    AOembed.init(window, AOembed);
    deepEqual(AOembed.inTimer(), false, 'Invalid element handled 3');
    var e = document.createElement("TestElement3");
    e.setAttribute("data-ref", "false");
    deepEqual(AOembed.inTimer(e), false, 'Refresh timer hasnt started yet');
    e.setAttribute("data-ref", "true");
    AOembed.handleRefresh(e);
    AOembed.run();
    deepEqual(AOembed.inTimer(e), true, 'Refresh timer is running');
    var f = $("#qunit-fixture");
    f.append('<iframe id="TestinTimeStop" class="test"/></iframe>');   
    e = window.document.getElementById('TestinTimeStop');
    AOembed.current = e;
    deepEqual(AOembed.inTimer(e), false, 'Stop timer outside viewport is ok');
});

QUnit.test('TestStartTimer', function () {
    deepEqual(AOembed.startTimer(null), false, 'Invalid element handled 4');
    var e = document.createElement("TestElement4");
    e.setAttribute("data-ref", "true");
    deepEqual(AOembed.startTimer(e), true, 'Timer started');
});

QUnit.test('TestStopTimer', function () {
    AOembed.init(window, AOembed);
    deepEqual(AOembed.stopTimer(null), false, 'Invalid element handled 5');
    var e = document.createElement("TestElement5");
    e.setAttribute("data-ref", "true");
    deepEqual(AOembed.startTimer(e), true, 'Timer started');
    deepEqual(AOembed.stopTimer(e), true, 'Timer stoped');
});

module('Responsive');
// test getFrameWidth
QUnit.test('TestGetFrameWidth', function () {
    var e = document.createElement("TestGetFrameWidth");
    e.width = 350;
    deepEqual(AOembed.getFrameWidth(e), 350, 'Get frame width 350 is ok');
    e = window.document.getElementById('TestGetFrameWidth');    
    deepEqual(AOembed.getFrameWidth(e), 0, 'Get frame width 0 is ok');   
});

QUnit.test('TestGetParentWidth', function () {
    var e = document.createElement("TestGetParentWidth");
    e.setAttribute("data-res", "true");
    e.setAttribute("data-loc", "rabbitporno.bugs.ex-situ.com/friends/4503-cherrypimps/466-cherrypimps.html");
    window.document.body.appendChild(e);
    throws(AOembed.setIframeParams(e));
    deepEqual(AOembed.getParentWidth(e) > 0, true, 'Get parent width(' + AOembed.getParentWidth(e) + ') is ok');
    var e = document.createElement("TestGetParentWidth");
    e.width = 100;
    deepEqual(AOembed.getParentWidth(e), 100, 'Get parent width(no parent) is ok');
});

// test getReponsiveFrameWidth
QUnit.test('TestGetReponsiveFrameWidth', function () {
    deepEqual(AOembed.getReponsiveFrameWidth(500), '300', 'Responsive width set to 300');
    deepEqual(AOembed.getReponsiveFrameWidth(650), '600', 'Responsive width set to 600');
    deepEqual(AOembed.getReponsiveFrameWidth(750), '728', 'Responsive width set to 728');
    deepEqual(AOembed.getReponsiveFrameWidth(1000), '962', 'Responsive width set to 962');
    deepEqual(AOembed.getReponsiveFrameWidth(1500), '1144', 'Responsive width set to 1144');
});

// test loadResponsiveFrames
// how to check if elements are actually loaded??
QUnit.test('TestLoadResponsiveFrames', function () {
    var e = document.createElement("TestLoadResponsiveFrames");
    e.setAttribute("data-loc", "rabbitporno.bugs.ex-situ.com/friends/4503-cherrypimps/466-cherrypimps.html");
    e.setAttribute("data-res", "true");
    e.setAttribute("id", "TestLoadResponsiveFrames");
    e.width = 350;
    window.document.body.appendChild(e);
    throws(AOembed.setIframeParams(e));
    throws(AOembed.loadResponsiveFrames(e));
    /////////////////////////////////////////////////     check if ao.loadFrame(e) is excuted;
});

module('Viewport');
// test get parent window size(scroll and window size)
QUnit.test('TestGetWindowSize', function () {  
    AOembed.init(window, AOembed);
    notEqual(AOembed.getWindowSize().length, [], 'Get parent window size is set');
});

// test getting viewport size
QUnit.test('TestGetViewportPos', function () {
    var windowSize = AOembed.getWindowSize(); 
    notEqual(AOembed.getViewportSize(windowSize), [], 'Get viewport size is ok');
});

// test getting bounds position
QUnit.test('TestGetBoundPos', function () {
    var f = $("#qunit-fixture");
    f.append('<iframe id="TestViewport" class="test"/>');  
    var windowSize = AOembed.getWindowSize(); 
    notEqual(AOembed.getBoundPos('TestViewport', windowSize), [], 'Get bounds position is ok');
});

// test detect viewport
QUnit.test('TestInViewport', function () {
    document.getElementById('TestViewportIn');      
    deepEqual(AOembed.inViewport('TestViewportIn'), true, 'Detecting inside viewport is ok');
    var f = $("#qunit-fixture");
    f.append('<iframe id="TestViewportOut" class="test"/>');    
    deepEqual(AOembed.inViewport('TestViewportOut'), false, 'Detecting outside viewport is ok');
});

module('Utility');
//ao.appendFramewidth
QUnit.test('TestAppendFramewidth', function () {
    var e = document.createElement("TestElement6");
    e.setAttribute("data-res", "true");
    e.setAttribute("data-loc", "rabbitporno.bugs.ex-situ.com/friends/4503-cherrypimps/466-cherrypimps.html");
    e.setAttribute("id", "TestElement6");
    window.document.body.appendChild(e);
    var parentWidth = AOembed.getParentWidth(e);
    var frameWidth = AOembed.getReponsiveFrameWidth(parentWidth);
    throws(AOembed.setIframeParams(e));
    deepEqual(AOembed.appendFramewidth([], e), ['frameWidth=' + frameWidth], 'frame width is set');
});

// test appendAsyncImpressionLogging
QUnit.test('TestAppendAsyncImpressionLogging', function () {
    AOembed.init(window, AOembed);
    AOembed.run();
    deepEqual(AOembed.appendAsyncImpressionLogging([]), ['ail=1'], 'Async impression log is set');
});

// test getCurrentUrl
QUnit.test('TestGetCurrentUrl', function () {
    var url = window.location.href;
    deepEqual(AOembed.getCurrentUrl([]), [ 'ref='+url], 'getting the page url is set');
});

// test getUrlAppend
QUnit.test('TestGetUrlAppend', function () {
    var url = window.location.href;
    var e = document.createElement("TestGetUrlAppend");
    e.setAttribute("data-res", "true");
    e.setAttribute("data-loc", "rabbitporno.bugs.ex-situ.com/friends/4503-cherrypimps/466-cherrypimps.html");
    window.document.body.appendChild(e);
    var parentWidth = AOembed.getParentWidth(e);
    var frameWidth = AOembed.getReponsiveFrameWidth(parentWidth);
    throws(AOembed.setIframeParams(e));
    deepEqual(AOembed.getUrlAppend(e), '?frameWidth=' + frameWidth + '&ail=1&ref='+url, 'url append is set');
});

// test niceQueryString
QUnit.test('TestNiceQueryString', function () {
    deepEqual(AOembed.niceQueryString(["frameWidth=1111", "ail=1"]), '?frameWidth=1111&ail=1', 'query string transform is set');
    deepEqual(AOembed.niceQueryString([]), '', 'empty query string transform is ok');
});

// test setIframeParams
QUnit.test('TestSetIframeParams', function () {
    var e = document.createElement("TestSetIframeParams");
    e.setAttribute("data-loc", "rabbitporno.bugs.ex-situ.com/friends/4503-cherrypimps/466-cherrypimps.html");
    e.setAttribute("data-ref", "true");
    e.setAttribute("data-res", "true");
    deepEqual(AOembed.isResponsive(e), 'true', 'SetIframeParams is set');
});

// test getFrameHeight
QUnit.test('TestGetFrameHeight', function () {
    AOembed.init(window, AOembed);
    var e = document.createElement("TestGetFrameHeight");
    e.height = 250;
    deepEqual(AOembed.getFrameHeight(e), 250, 'Get frame height is ok');
    e = window.document.getElementById('TestGetFrameHeight');    
    deepEqual(AOembed.getFrameHeight(e), 0, 'Get frame height 0 is ok');       
});

// test getDatasetDomain
QUnit.test('TestGetDatasetDomainFromLocation', function () {
    var e = document.createElement("TestGetDatasetDomainFromLocation");
    e.setAttribute("data-loc", "rabbitporno.bugs.ex-situ.com/friends/4503-cherrypimps/466-cherrypimps.html");
    deepEqual(AOembed.getDatasetDomainFromLocation(e), "rabbitporno.bugs.ex-situ.com", 'Detect domain is set');  
    deepEqual(AOembed.getDatasetDomainFromLocation(), false, 'Domain is set', 'Detect domain error handler is set');      
});

// test getDatasetLocation
QUnit.test('TestGetDatasetLocation', function () {
    var e = document.createElement("TestGetDatasetLocation");
    e.setAttribute("data-loc", "rabbitporno.bugs.ex-situ.com/friends/4503-cherrypimps/466-cherrypimps.html");
    deepEqual(AOembed.getDatasetLocation(e), "rabbitporno.bugs.ex-situ.com/friends/4503-cherrypimps/466-cherrypimps.html", 'Frame location is set');
    deepEqual(AOembed.getDatasetLocation(), "", 'Empty frame location handler is set');    
});

// test isAutoRefresh
QUnit.test('TestIsAutoRefresh', function () {
    var e = document.createElement("TestIsAutoRefresh");
    e.setAttribute("data-loc", "rabbitporno.bugs.ex-situ.com/friends/4503-cherrypimps/466-cherrypimps.html");
    e.setAttribute("data-ref", "true");
    deepEqual(AOembed.params.hasRefresh, false, 'Auto refresh is initiated');
    throws(AOembed.isAutoRefresh(e));
    deepEqual(AOembed.params.hasRefresh, true, 'Auto refresh is on');
});

// test isResponsive
QUnit.test('TestIsResponsive', function () {
    var e = document.createElement("TestIsResponsive");
    e.setAttribute("data-loc", "rabbitporno.bugs.ex-situ.com/friends/4503-cherrypimps/466-cherrypimps.html");
    e.setAttribute("data-res", "true");
    deepEqual(AOembed.params.hasResponsive, false, 'Responsive is initiated');
    throws(AOembed.isResponsive(e));
    deepEqual(AOembed.params.hasResponsive, true, 'Responsive refresh is on');
});

// test getLocation
QUnit.test('TestGetLocation', function () {
    var url = window.location.href;
    var e = document.createElement("TestGetLocation");
    e.setAttribute("data-loc", "rabbitporno.bugs.ex-situ.com/friends/4503-cherrypimps/466-cherrypimps.html");
    deepEqual(AOembed.getLocation(e), "http://rabbitporno.bugs.ex-situ.com/friends/4503-cherrypimps/466-cherrypimps.html?ail=1&ref="+url, AOembed.getLocation(e));
    AOembed.params.asyncImpressionLog = false;
    deepEqual(AOembed.getLocation(e), "http://rabbitporno.bugs.ex-situ.com/friends/4503-cherrypimps/466-cherrypimps.html?ref="+url, 'frame url with no async logging is set');
});

// test load frame
QUnit.test('TestLoadFrame', function () {
    var e = document.createElement("TestLoadFrame");
    e.setAttribute("data-loc", "rabbitporno.bugs.ex-situ.com/friends/4503-cherrypimps/466-cherrypimps.html");
    throws(AOembed.loadFrame(e));
    deepEqual(AOembed.loadFrame(), false, 'Load frame error handler is set.');
});

// test getDatasetBoolean
QUnit.test('TestGetDatasetBoolean', function () {
    var e = document.createElement("TestGetDatasetBoolean");
    e.setAttribute("data-res", "true");
    deepEqual(AOembed.getDatasetBoolean(e, 'data-res'), 'true', 'getDatasetBoolean is passed.');
    deepEqual(AOembed.getDatasetBoolean(), false, 'getDatasetBoolean error handler is set.');
});

// test getDataset
QUnit.test('TestGetDataset', function () {
    var e = document.createElement("TestGetDataset");
    e.setAttribute("data-res", "true");
    deepEqual(AOembed.getDataset(e, 'data-res'), 'true', 'getDataset is passed.');
});

// test setIsActiveWindow
QUnit.test('TestSetIsActiveWindow', function () {
    AOembed.init(window, AOembed);
    throws(AOembed.setIsActiveWindow());
    deepEqual(AOembed.params.isActiveWindow, true, 'IsActiveWindow is set to true.');
});

// test setIsInActiveWindow
QUnit.test('TestSetIsInActiveWindow', function () {
    AOembed.init(window, AOembed);
    throws(AOembed.setIsInActiveWindow());
    deepEqual(AOembed.params.isActiveWindow, false, 'IsActiveWindow is set to false.');
});

// test executeResponsive
QUnit.test('TestExecuteResponsive', function () {
    AOembed.init(window, AOembed);
    AOembed.params.hasResponsive = true;
    throws(AOembed.executeResponsive());    
});

// test executeRefresh
QUnit.test('TestExecuteRefresh', function () {
    AOembed.init(window, AOembed);
    throws(AOembed.executeRefresh());
});

// test execute
QUnit.test('TestExecute', function () {
    AOembed.init(window, AOembed);
    throws(AOembed.execute());
});

// test each
QUnit.test('TestEach', function () {
    var e = document.createElement("TestEach");
    e.setAttribute("data-loc", "rabbitporno.bugs.ex-situ.com/friends/4503-cherrypimps/466-cherrypimps.html");
    AOembed.init(window, AOembed);
    AOembed.run();
    throws(AOembed.each('loadFrame'));
});

//test attachListeners
QUnit.test('TestAttachListeners', function () {
    AOembed.init(window, AOembed);
    throws(AOembed.attachListeners());
});

// test attacheRefreshListeners
QUnit.test('TestAttacheRefreshListeners', function () {
    AOembed.init(window, AOembed);
    throws(AOembed.attacheRefreshListeners());
    
});

// test TestSttachActiveWindowListeners
QUnit.test('TestAttachActiveWindowListeners', function () {
    AOembed.init(window, AOembed);
    throws(AOembed.attachActiveWindowListeners());
});

// test attacheResponsiveListeners
QUnit.test('TestAttacheResponsiveListeners', function () {
    AOembed.init(window, AOembed);
    throws(AOembed.attacheResponsiveListeners());
});

// test asyncImpressionLogger
QUnit.test('TestAsyncImpressionLogger', function () {
    var f = $("#qunit-fixture");
    f.append('<iframe id="TestElement1" class="test"/>');
    var e = document.getElementById('TestElement1');
    deepEqual(AOembed.asyncImpressionLogger(e), false, 'AsyncImpressionLogger is set');
});

// test postMessageSender
QUnit.test('TestPostMessageSender', function () {
    var e = document.createElement("TestPostMessageSender");
    e.setAttribute("data-loc", "rabbitporno.bugs.ex-situ.com/friends/4503-cherrypimps/466-cherrypimps.html");
    e.setAttribute("id", "TestPostMessageSender");
    throws(AOembed.postMessageSender(e));
});

// test stopMessage
QUnit.test('TestStopMessage', function () {
    var e = document.createElement("TestStopMessage");
    e.setAttribute("data-loc", "rabbitporno.bugs.ex-situ.com/friends/4503-cherrypimps/466-cherrypimps.html");
    e.setAttribute("id", "TestStopMessage");
    AOembed.messageID['TestStopMessage'] = 1;
    throws(AOembed.stopMessage(e));
    deepEqual(AOembed.timerID[e.id], undefined, 'messaging is stop');
});

// test startMessage
QUnit.test('TestStartMessage', function () {
    var e = document.createElement("TestStartMessage");
    e.setAttribute("data-loc", "rabbitporno.bugs.ex-situ.com/friends/4503-cherrypimps/466-cherrypimps.html");
    e.setAttribute("id", "TestStartMessage");
    throws(AOembed.startMessage(e));
    deepEqual(AOembed.messageID[e.id] > 1, true, 'messaging is started');
});

// test ao run
QUnit.test('TestAoRun', function () {
    var f = $("#qunit-fixture");
    f.append('<iframe id="TestAoRun" class="test"/ data-loc="rabbitporno.bugs.ex-situ.com/friends/4503-cherrypimps/466-cherrypimps.html" data-res="true" data-ref= "false" width="1144" height="250" id="async466" src="about:blank" class="aoembed" frameborder="0" marginheight="0" marginwidth="0" scrolling="no" allowTransparency="true" style="display:none"></iframe>');
    AOembed.init(window, AOembed);
    throws(AOembed.run());
});

// test sendLog
QUnit.test('TestSendLog', function () {
    var f = $("#qunit-fixture");
    f.append('<iframe id="TestSendLog" class="test"/ data-loc="rabbitporno.bugs.ex-situ.com/friends/4503-cherrypimps/466-cherrypimps.html" data-res="true" data-ref= "false" width="1144" height="250" id="async466" src="about:blank" class="aoembed" frameborder="0" marginheight="0" marginwidth="0" scrolling="no" allowTransparency="true" style="display:none"></iframe>');
    e = window.document.getElementById('TestSendLog');
    AOembed.current = e;
    throws(AOembed.sendLog(e));
});

