# iFrame-Embed
Static JavaScript library for loading offsite iframes in a non-blocking fashion


# USAGE
iFrame-Embed will load iframes that automatically refreshed every user defined interval and fit in window sizes.
All iframe behaviours are controlled by viewport locations and active tab.
If the iframe is outside of the user's viewport or not in active tab, all behaviours are paused and wait till it is back in the viewport.

**To use iFrame-Embed:**


######Include embed.min.js in the html file.

*Standard script src using local path or remote host url:*
``` html
<script type="text/javascript" src="/path/to/embed.min.js"></script>
or
<script type="text/javascript" src="http://www.domian.com/embed/src/embed.min.js"></script>
```

or 

*Async embed in head section using remote host url:*
``` html
<script>
    (function () {
        var rpil = document.createElement("script");
        rpil.async = true;
        rpil.type = "text/javascript";
        var useSSL = "https:" == document.location.protocol;
        rpil.src = (useSSL ? "https:" : "http:") + "//www.domain.com/embed/src/embed.min.js"; 
        var node = document.getElementsByTagName("script")[0];
        node.parentNode.insertBefore(rpil, node);
    })();
</script>
```

######Add iframe in the html file.

``` html
<iframe data-loc="www.domain.com/iframe.html" data-res="TRUE_OR_FALSE_HERE" data-ref="TRUE_OR_FALSE_HERE" width="FRAME_WIDTH_HERE" height="FRAME_HEIGHT_HERE" id="ADD_UNIQUE_ID_HERE" src="about:blank" class="aoembed" frameborder="0" marginheight="0" marginwidth="0" scrolling="no" allowTransparency="true" style="display:none"></iframe>
```
The id of the iframe must be unique if multiple iframes need to be loaded in the same page.
The class name must be **aoembed**


# Parameters

data-loc: Location of the iframe source.

data-res: Set 'true' if the iframe need to be responsive. 

data-ref: Set 'true' if the iframe need to be refreshed with user defined interval.

width: The width of the iframe.

height: the height of the iframe.

class: must be **aoembed**


# Auto Refreshing
If data-ref is set to 'true', the iframe will be reloaded with the interval set in the embed.min.js
The interval can be set differently for mobile and desktop user.
``` js
ao.refreshTimer = {
    mobile: 6000, // every 6 seconds as default
    desktop: 12000 // every 12 seconds as default
}
```
Mobile agent is defined by viewport width and can be changed in setting
``` js
mobileWidth: 600, // The width that defines mobile vs desktop views
```


# Responsive Iframe
If data-res is set to 'true', the iframe that will fit in the window width will be loaded on resize or onload event.

Available sizes:
300x250, 600x250, 728x90, 962x102, 1144x250

**if the iframe doesn't support the selected window size, the default size iframe will be loaded.**


# Data Logging
All data logging such as impression and click logging, are trigged by viewport and active window.
embed.min.js will send logging info, only the iframe is visible to the user.

Along with logging information, the script will send viewport timing information to the iframe.
It measures total time of the iframe in the browser's viewport before clicks or move away.


# NOTE
The script is developed to serve iframes that promote Ex-Situ websites. 
Data logging and responsive iframe load functions do not support non Ex-Situ websites.

Including embed.min.js in the head section can cause blocking the html page loading until the script loading is completed.


# EXAMPLE

``` html
<html>
    <head>
        <title>Iframe embed example with res, ref</title>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
    </head>
    <body>
        <h1>Testing iframe embed with auto refresh and responsive template</h1>
        <br />
                <iframe data-loc="www.domain.com/iframes.html" data-res="true" data-ref="true" width=IFRAME_WIDTH height=IFRAME_HEIGHT id="ADD_UNIQUE_ID_HERE" src="about:blank" class="aoembed" frameborder="0" marginheight="0" marginwidth="0" scrolling="no" allowTransparency="true" style="display:none"></iframe>
        <br />
	<script type="text/javascript" src="/path/to/embed.min.js"></script>
    </body>
</html>
```
or
``` html
<html>
    <head>
        <title>Iframe embed example with res, ref</title>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
	<script>
    	(function () {
        	var rpil = document.createElement("script");
        	rpil.async = true;
        	rpil.type = "text/javascript";
        	var useSSL = "https:" == document.location.protocol;
        	rpil.src = (useSSL ? "https:" : "http:") + "//www.domain.com/embed/src/embed.min.js";
        	var node = document.getElementsByTagName("script")[0];
        	node.parentNode.insertBefore(rpil, node);
    	})();
    	</script>
    </head>
    <body>
        <h1>Testing iframe embed with auto refresh and responsive template</h1>
        <br />
                <iframe data-loc="www.domain.com/iframes.html" data-res="true" data-ref="true" width=IFRAME_WIDTH height=IFRAME_HEIGHT id="ADD_UNIQUE_ID_HERE" src="about:blank" class="aoembed" frameborder="0" marginheight="0" marginwidth="0" scrolling="no" allowTransparency="true" style="display:none"></iframe>
        <br />
    </body>
</html>

```

All examples are included at /iFrame-Embed/embed/

