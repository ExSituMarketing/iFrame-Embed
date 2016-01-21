/*!
 * iFrame-Embed multi-function iframe embed script v2.0.0
 * https://github.com/ExSituMarketing/iFrame-Embed
 *
 * Copyright 2015 Ex Situ Marketing
 * Released under the MIT license 
 */
window.document.getElementsByClassName = function (cl) {
    var retnode = [];
    var elem = this.getElementsByTagName('*');
    for (var i = 0; i < elem.length; i++) {
        if ((' ' + elem[i].className + ' ').indexOf(' ' + cl + ' ') > -1)
            retnode.push(elem[i]);
    }
    return retnode;
};

// Build the object
(function (window, ao) {
    ao.init = function (window, ao) {
        // Set the document
        ao.document = window.document;
        // Set the parameters
        ao.params = {
            hasResponsive: false, // Window has a responsive iframe
            hasRefresh: false, // Window has a refresh iframe
            asyncImpressionLog: true, // Should we use async impression logging
            mobileWidth: 600, // The width that defines mobile vs desktop views
            isActiveWindow: true // Whether this window tab is active or not. 
        };
        // The AO elements on the page -> obtained via getElementsByClassName
        ao.elements = [];
        // The frame widths
        ao.fwidth = [];
        // The frame heights
        ao.fheight = [];
        // Heights that correspond with widths
        ao.responsiveSteps = {
            300: "250",
            728: "90",
            962: "102",
            1144: "250",
            600: "250"
        };
        // The frame messagers
        ao.messageID = [];
        // The frame timers
        ao.timerID = [];
        // Timings for the refresh rate
        ao.refreshTimer = {
            mobile: 6000,
            desktop: 12000
        };
        
        ao.totalViewportTimer = [];
        ao.inViewportTimer = [];                
    },
            // Setter to mock the doc
            ao.setDocument = function (doc) {
                ao.document = doc;
            },
            ao.getClient = function () {
                if ((Math.max(ao.document.documentElement.clientWidth, window.innerWidth || 0)) <= ao.params.mobileWidth) {
                    return 'mobile';
                }
                return 'desktop';

            },
            // Set the timer pointer
            ao.defaultTimerID = function (e) {
                if (e && e.id && !ao.timerID[e.id]) {
                    ao.timerID[e.id] = 0;
                } else {
                    return false;
                }
                return ao.timerID[e.id];
            },
            // Handle a refresh
            ao.handleRefresh = function (e) {
                if (e === null) {
                    return false;
                }
                // Set the timer id's
                ao.defaultTimerID(e);
                if ((ao.isAutoRefresh(e) === true) && (ao.inViewport(e.id) !== false) && (ao.params.isActiveWindow === true)) {
                    ao.startTimer(e);
                }
                return true;
            },
            // Run in the timer
            ao.inTimer = function (e) {              
                if ((ao.isAutoRefresh(e) === true) && (ao.inViewport(e.id) !== false) && (ao.params.isActiveWindow === true)) {
                    ao.loadFrame(e);
                    return true;
                } else {
                    ao.stopTimer(e);
                    return false;
                }
            },
            // Start the timer
            ao.startTimer = function (e) {
                try {
                    if ((typeof ao.timerID[e.id] === 'undefined') || (ao.timerID[e.id] === 0))
                    {
                        ao.timerID[e.id] = setInterval( function() { ao.inTimer(e) }, ao.refreshTimer[ao.getClient()]);
                    }
                    return true;
                } catch (ex) {
                    return false;
                }
            },
            // Stop the timer for the iframe refresh
            ao.stopTimer = function (e) {
                try {
                    clearInterval(ao.timerID[e.id]);
                    ao.timerID[e.id] = 0;
                } catch (ex) {
                    return false;
                }
                return true;
            },
            // Detect if the element is in the viewport
            ao.inViewport = function (id) {
                try {
                    var windowSize = ao.getWindowSize();
                    var viewport = ao.getViewportSize(windowSize);
                    var bounds = ao.getBoundPos(id, windowSize);
                    return (!(viewport.right < bounds.left || viewport.left > bounds.right || viewport.bottom < Number(bounds.top) + Number(windowSize.scrollTop) || bounds.bottom < 0));
                } catch (ex) {
                    return true;
                }
            },
            //get bound position
            ao.getBoundPos = function (id, windowSize) {
                var AoFrame = document.getElementById(id);
                var bounds = document.getElementById(id).getBoundingClientRect();
                bounds.right = Number(bounds.left) + Number(windowSize.scrollLeft) + Number(AoFrame.width);
                bounds.bottom = Number(bounds.top) + Number(windowSize.scrollTop) + Number(AoFrame.height);
                return bounds;
            },
            // get viewport size
            ao.getViewportSize = function (windowSize) {
                return {top: windowSize.scrollTop, left: windowSize.scrollLeft, right: windowSize.scrollLeft + windowSize.width, bottom: windowSize.scrollTop + windowSize.height};
            },
            // get parent window size 
            ao.getWindowSize = function () {
                return {scrollLeft: ao.getScrollLeft(), scrollTop: ao.getScrollTop(), width: ao.getParentWidthPos(), height: ao.getParentHeightPos()};
            },
            // get scroll left position
            ao.getScrollLeft = function () {
                return (window.pageXOffset !== undefined) ? window.pageXOffset : (document.body || document.body.parentNode || document.documentElement).scrollLeft;
            },
            // get scroll top position
            ao.getScrollTop = function () {
                return (window.pageYOffset !== undefined) ? window.pageYOffset : (document.body || document.body.parentNode || document.documentElement).scrollTop;
            },
            // get parent window width position
            ao.getParentWidthPos = function () {
                return window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
            },
            // get parent window height position
            ao.getParentHeightPos = function () {
                return window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight;
            },
            // Append the framewidth
            ao.appendFramewidth = function (a, e) {
                if (ao.isResponsive(e) === true) {
                    a.push('frameWidth=' + ao.fwidth[e.id]);
                }
                return a;
            },
            // Append the async logging
            ao.appendAsyncImpressionLogging = function (a) {
                if (ao.params.asyncImpressionLog === true) {
                    a.push('ail=1');
                }
                return a;
            },
            // get the current page url
            ao.getCurrentUrl = function (a) {
                var currentUrl = window.location.href;
                if (currentUrl) {
                    a.push('ref=' + currentUrl);
                }
                return a;
            },
            // Get all the url append
            ao.getUrlAppend = function (e) {
                var append = [];
                // Responsive params
                ao.appendFramewidth(append, e);
                // Impression flag
                ao.appendAsyncImpressionLogging(append);
                // get the page url
                ao.getCurrentUrl(append);

                return ao.niceQueryString(append);
            },
            // Build a nice query string
            ao.niceQueryString = function (args) {
                if (args.length > 0) {
                    return '?' + args.join('&');
                }
                return '';
            },
            // Handle the responsive height / width
            ao.getParentWidth = function (e) {
                try {
                    return e.parentNode.offsetWidth;
                } catch (ex) {
                    return e.width;
                }
            },
            // Get the iframe width
            ao.getReponsiveFrameWidth = function (w) {
                var fWidth = w;
                if (w < 600) {
                    fWidth = "300";
                } else if (w < 728 && w >= 600) {
                    fWidth = "600";
                } else if (w < 962 && w >= 728) {
                    fWidth = "728";
                } else if (w < 1144 && w >= 962) {
                    fWidth = "962";
                } else {
                    fWidth = "1144";
                }
                return fWidth;
            },
            // Set the iframe dimensions
            ao.setIframeParams = function (e) {
                // Check for refresh
                ao.isAutoRefresh(e);

                if (ao.isResponsive(e) === true) {
                    ao.fwidth[e.id] = ao.getReponsiveFrameWidth(ao.getParentWidth(e));
                    ao.fheight[e.id] = ao.responsiveSteps[ao.fwidth[e.id]];
                } else {
                    ao.fwidth[e.id] = ao.getFrameWidth(e);
                    ao.fheight[e.id] = ao.getFrameHeight(e);
                }
            },
            // Get the iframe width
            ao.getFrameWidth = function (e) {
                try {
                    return e.width;
                } catch (ex) {
                    // shh
                    return 0;
                }
            },
            // Get the iframe height
            ao.getFrameHeight = function (e) {
                try {
                    return e.height;
                } catch (ex) {
                    // shh
                    return 0;
                }
            },
            // Get application domain name
            ao.getDatasetDomainFromLocation = function (e) {
                try {
                    var arr = ao.getDataset(e, 'data-loc').split("/");
                    return arr[0];
                } catch (ex) {
                    return false;
                }
            },
            // Get the location of this iframe
            ao.getDatasetLocation = function (e) {
                try {
                    return ao.getDataset(e, 'data-loc');
                } catch (ex) {
                    return '';
                }
            },
            // Should this iframe auto refresh
            ao.isAutoRefresh = function (e) {
                var refresh = ao.getDatasetBoolean(e, 'data-ref');
                if (refresh === 'true') {
                    ao.params.hasRefresh = true;
                    return true;
                }
                return false;
            },
            // Should this iframe be responsive
            ao.isResponsive = function (e) {
                var responsive = ao.getDatasetBoolean(e, 'data-res');
                if (responsive === 'true') {
                    ao.params.hasResponsive = true;
                    return true;
                }
                return false;
            },
            // Build the location of the iframe from the html dataset tag - we should probably have a fallback here
            ao.getLocation = function (r) {
                var loc = 'https://' + ao.getDatasetLocation(r) + ao.getUrlAppend(r);
                return loc;
            },
            // load iframe
            ao.loadFrame = function (e) {
                try {
                    ao.inViewportTimer[e.id] = 0;
                    ao.setIframeParams(e);
                    e.src = ao.getLocation(e);
                    e.width = ao.fwidth[e.id];
                    e.height = ao.fheight[e.id];
                    e.style.display = 'block';
                    
                    // wrap send message function in a event for chrome                    
                    e.onload = function () {
                        ao.postMessageSender(e);
                    };
                } catch (ex) {
                    return false;
                }
            },
            // get boolean data
            ao.getDatasetBoolean = function (e, a) {
                try {
                    return ao.getDataset(e, a);
                } catch (ex) {
                    return false;
                }
            },
            // Get the attribute (html4/xhtml helper)
            ao.getDataset = function (e, a) {
                var dset = e.getAttribute(a);
                return dset;
            },
            ao.loadResponsiveFrames = function (e) {
                // Only responsive iframes that are in a step
                if (ao.isResponsive(e) === true && ao.getReponsiveFrameWidth(ao.getParentWidth(e)) !== ao.getFrameWidth(e)) {
                    ao.loadFrame(e);
                }
            },
            // set isActiveWindow value
            ao.setIsActiveWindow = function () {
                ao.params.isActiveWindow = true;
                ao.executeRefresh();
            },
            ao.setIsInActiveWindow = function () {
                ao.params.isActiveWindow = false;
            },
            ao.MoveAway = function () {
                for (var i = 0; i < ao.elements.length; i++) {
                    if(typeof ao.elements[i] !== 'undefined') {
                        ao.MoveAwayLogging(ao.elements[i]);
                    }
                }
            },
            
            ao.MoveAwayLogging = function (e) {                
                if (typeof ao.totalViewportTimer[e.id] !== 'undefined' && ao.totalViewportTimer[e.id] < 900) {
                    var target = ao.getDatasetDomainFromLocation(e);
                    e.contentWindow.postMessage('total|' + ao.totalViewportTimer[e.id], 'https://' + target);
                }
            }
            
            // excute resposicive frame load
            ao.executeResponsive = function () {
                // Only fire if there are responsive elements
                if (ao.params.hasResponsive === true) {
                    ao.each('loadResponsiveFrames');
                }
            },
            // excute load refresh frame
            ao.executeRefresh = function () {
                // Only fire if there are refresh elements
                if (ao.params.hasRefresh === true) {
                    ao.each('handleRefresh');
                }
            },
            // Initial load of all iframes
            ao.execute = function () {
                ao.each('loadFrame');
            },
            // Iterate over all the elements flagged as ao iframes
            ao.each = function (m) {
                for (var i = 0; i < ao.elements.length; i++) {
                    if (typeof ao.elements[i] !== 'undefined') {
                        ao[m](ao.elements[i]);
                    }
                }
            },
            ao.setTotalInViewportTimer = function () {
                for (var i = 0; i < ao.elements.length; i++) {
                    if (typeof ao.elements[i] !== 'undefined') {
                        ao.totalViewportTimer[ao.elements[i].id] = 0;
                        ao.inViewportTimer[ao.elements[i].id] = 0;
                    }
                }                
            }
            // Add the different listners 
            ao.attachListeners = function () {
                // Refresh
                ao.attacheRefreshListeners();

                // Responsive
                ao.attacheResponsiveListeners();

                //active tab
                ao.attachActiveWindowListeners();
                
                // move away
                ao.attachMoveAwayListeners();
            },
            // Process a scroll (viewport detection)
            ao.attacheRefreshListeners = function () {
                if (window.addEventListener) {
                    window.addEventListener("scroll", ao.setIsActiveWindow, false);
                } else {
                    window.attachEvent("onscroll", ao.setIsActiveWindow);
                }
            },
            // active window listener
            ao.attachActiveWindowListeners = function () {
                window.onfocus = ao.setIsActiveWindow;
                window.onblur = ao.setIsInActiveWindow;
            },
            ao.attachMoveAwayListeners = function () {
                window.onbeforeunload = ao.MoveAway;               
            },
            // Process the resize (responsive)
            ao.attacheResponsiveListeners = function () {
                window.onresize = ao.executeResponsive;
            },
            // The async Impression logger
            ao.asyncImpressionLogger = function (e) {
                try {
                    ao.sendLog(e);
                } catch (ex) {
                    return false;
                }
            },
            // send message to ao only when it is in the viewport
            ao.sendLog = function (e) {;
                var target = ao.getDatasetDomainFromLocation(e);
                if ((ao.inViewport(e.id)) !== false && (target !== false) && (ao.params.isActiveWindow === true)) {                  
                    ao.totalViewportTimer[e.id]++;
                    ao.inViewportTimer[e.id]++;                  
                    e.contentWindow.postMessage('in|' + ao.inViewportTimer[e.id], 'https://' + target);
                } else {
                    ao.inViewportTimer[e.id] = 0;
                }
            },
            // set post message
            ao.postMessageSender = function (e) {
                if (ao.params.asyncImpressionLog === true) {
                    // terminate
                    ao.stopMessage(e);
                    // start
                    ao.startMessage(e);
                }
            },
            // stop interval timer for message
            ao.stopMessage = function (e) {
                if (ao.messageID[e.id]) {
                    clearInterval(ao.messageID[e.id]);
                    ao.messageID[e.id] = 0;
                }
            },
            // set interval for post message 
            ao.startMessage = function (e) {
                if ((typeof ao.messageID[e.id] === 'undefined') || (ao.messageID[e.id] === 0))
                {
                    ao.messageID[e.id] = setInterval( function() { ao.asyncImpressionLogger(e) }, 1000);
                }
            },
            ao.run = function () {
                // Set the document
                ao.document = window.document;
                // Get all the elements
                ao.elements = ao.document.getElementsByClassName("aoembed");
                // initiate total in viewport timer for each e.
                ao.setTotalInViewportTimer();
                // Attach Listeners
                ao.attachListeners();
                // Execute onload
                ao.execute();
                // handle refreshing
                ao.executeRefresh();
            },
            (function () {
                ao.init(window, ao);
                ao.run();       // duplicated???                
            })();
}(window, AOembed = window.AOembed || {}));

// Handle ready
(function (exports, d) {
    function domReady(fn, context) {

        function onReady(event) {
            d.removeEventListener("DOMContentLoaded", onReady);
            fn.call(context || exports, event);
        }

        function onReadyIe(event) {
            if (d.readyState === "complete") {
                d.detachEvent("onreadystatechange", onReadyIe);
                fn.call(context || exports, event);
            }
        }

        d.addEventListener && d.addEventListener("DOMContentLoaded", onReady) ||
                d.attachEvent && d.attachEvent("onreadystatechange", onReadyIe);
    }

    exports.domReady = domReady;
})(window, document);

domReady(function () {
    AOembed.run();
});

