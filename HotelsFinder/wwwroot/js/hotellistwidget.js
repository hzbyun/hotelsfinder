(function () {

    var jQuery; //localized jQuery after avoiding conflick

    /******** Load jQuery if not present (But this one is not working properly in some cases....want to ask..) *********/
    if (window.jQuery === undefined || window.jQuery.fn.jquery !== '3.3.1') {
        var script_tag = document.createElement('script');
        script_tag.setAttribute("type", "text/javascript");
        script_tag.setAttribute("src",
            "https://ajax.googleapis.com/ajax/libs/jquery/3.3.1/jquery.min.js");
        if (script_tag.readyState) {
            script_tag.onreadystatechange = function () { // For old versions of IE
                if (this.readyState == 'complete' || this.readyState == 'loaded') {
                    scriptLoadHandler(script_tag);
                }
            };
        } else { // Other browsers
            script_tag.onload = function () { scriptLoadHandler(script_tag) };
        }

        // Try to find the head, otherwise default to the documentElement
        (document.getElementsByTagName("head")[0] || document.documentElement).appendChild(script_tag);
    } else {
        // The jQuery version on the window is the one we want to use
        jQuery = window.jQuery;
        initialiseWidget();
    }

    /******** Called once jQuery has loaded ******/
    function scriptLoadHandler(script_tag) {
        // Restore $ and window.jQuery to their previous values and store the new jQuery in our local jQuery variable
        jQuery = window.jQuery.noConflict(true);
        initialiseWidget();
    }

    function initialiseWidget() {
        // this logic is for IE, which does not support currentScript
        var currentScript = document.currentScript || (function () {
            var scripts = document.getElementsByTagName('script');
            return scripts[scripts.length - 1];
        })();
        var filename = currentScript.getAttribute('filename');

        var containerNode = document.createElement("div");
        containerNode.setAttribute("class", "widget container");

        var headerNode = document.createElement("div");
        headerNode.setAttribute("class", "widget header");

        var titleNode = document.createElement("p");
        titleNode.setAttribute("class", "widget title");

        var refreshNode = document.createElement("img");
        refreshNode.setAttribute("class", "widget refresh");
        refreshNode.setAttribute("src", "images/refresh.png");

        headerNode.appendChild(titleNode);
        headerNode.appendChild(refreshNode);
        containerNode.appendChild(headerNode);

        var bodyNode = document.createElement("div");
        refreshNode.addEventListener("click", function () { fetchHotelData(titleNode, bodyNode, filename) });
        refreshNode.click();
        setInterval(function () {
            refreshNode.click();
        }, 60000);

        containerNode.appendChild(bodyNode);

        var currentlocation = currentScript.parentNode;
        currentlocation.appendChild(containerNode);

        applyInternalCss();
    }

    function fetchHotelData(titleNodeObj, bodyNodeObj, filename) {
        console.log("refresh data for " + filename);

        jQuery.getJSON("api/Places/" + filename)
            .done(function (json) {
                titleNodeObj.innerHTML = "Hotels in " + json.name;

                jQuery.each(json.hotels, function (index, hotel) {
                    fillWidgetByHotelDetail(bodyNodeObj, hotel);
                });
            })
            .fail(function (jqxhr, textStatus, error) {
                var err = textStatus + ", " + error;
                console.log("Request Failed: " + err);
            });
    }

    function fillWidgetByHotelDetail(bodyNodeObj, hotelObj) {

        if (bodyNodeObj.childNodes.length > 4) {
            bodyNodeObj.removeChild(bodyNodeObj.childNodes[0]);
        }

        var hotelNode = document.createElement("div");
        hotelNode.setAttribute("class", "hotel info");

        var hotelImageBoxNode = document.createElement("div");
        hotelImageBoxNode.setAttribute("class", "hotel imagebox");

        var hotelImageNode = document.createElement("img");
        hotelImageNode.setAttribute("class", "hotel imagebox image");
        hotelImageNode.setAttribute("src", "images/Hotels/" + hotelObj.image);      
        hotelImageNode.setAttribute("onerror", "this.onerror=null;this.src='http://placehold.it/100x100';");

        hotelImageBoxNode.appendChild(hotelImageNode);

        var hotelDetailBoxNode = document.createElement("div");
        hotelDetailBoxNode.setAttribute("class", "hotel detailbox");

        var hotelNameNode = document.createElement("p");
        hotelNameNode.setAttribute("class", "hotel detailbox name");
        hotelNameNode.innerHTML = hotelObj.name;

        var hotelPriceNode = document.createElement("p");
        hotelPriceNode.setAttribute("class", "hotel detailbox price");
        hotelPriceNode.innerHTML = "From $" + hotelObj.rate;

        hotelDetailBoxNode.appendChild(hotelNameNode);
        hotelDetailBoxNode.appendChild(hotelPriceNode);

        var hotelStarRateBoxNode = document.createElement("div");
        hotelStarRateBoxNode.setAttribute("class", "hotel starratebox");

        var starRateIndex = 0;
        for (starRateIndex = 0; starRateIndex < hotelObj.starRating; starRateIndex++) {
            var starImgNode = document.createElement("img");
            starImgNode.setAttribute("class", "hotel starratebox starimage");
            starImgNode.setAttribute("src", "images/star.png");
            starImgNode.setAttribute("style", "display:inline;margin-left:2px");
            hotelStarRateBoxNode.appendChild(starImgNode);
        }

        hotelNode.appendChild(hotelImageBoxNode);
        hotelNode.appendChild(hotelDetailBoxNode);
        hotelNode.appendChild(hotelStarRateBoxNode);

        bodyNodeObj.appendChild(hotelNode);

        applyInternalCssForHotelDisplay();
    }

    function applyInternalCssForHotelDisplay() {
        var paragraph = jQuery(".hotel p");
        paragraph.css("font", "normal 0.9em 'Helvetica Neue', Helvetica, Arial, sans-serif");

        var hotelInfo = jQuery(".hotel.info");
        hotelInfo.css("margin", "5px");     
        hotelInfo.css("border-bottom-style", "groove");
        hotelInfo.css("overflow", "hidden");

        var hotelImgBox = jQuery(".hotel.imagebox");
        hotelImgBox.css("float", "left");

        var hotelImg = jQuery(".hotel.imagebox.image");
        hotelImg.css("width", "65px");
        hotelImg.css("height", "65px");

        var hotelDetailBox = jQuery(".hotel.detailbox");
        hotelDetailBox.css("float", "left");
        hotelDetailBox.css("width", "150px");
        hotelDetailBox.css("margin-left", "5px");

        var hotelName = jQuery(".hotel.detailbox.name");
        hotelName.css("float", "left");
        hotelName.css("margin", "0px");

        var hotelName = jQuery(".hotel.detailbox.price");
        hotelName.css("text-align", "right");
        
        var hotelStarRateBox = jQuery(".hotel.starratebox");
        hotelStarRateBox.css("float", "left"); 
    }

    function applyInternalCss() {

        var paragraph = jQuery("p");
        paragraph.css("font", "normal 1.05em 'Helvetica Neue', Helvetica, Arial, sans-serif");

        var container = jQuery(".widget.container");
        container.css("width", "300px");
        container.css("margin", "10px");
        container.css("border", "1px solid");

        var header = jQuery(".widget.header");
        header.css("height", "30px");
        header.css("overflow", "hidden");
        header.css("background-color", "#09AEEE");

        var title = jQuery(".widget.title");
        title.css("float", "left");
        title.css("margin", "5px");
        title.css("color", "white");

        var refresh = jQuery(".widget.refresh");
        refresh.css("width", "20px");
        refresh.css("height", "20px");
        refresh.css("margin", "5px");
        refresh.css("float", "right");
    }

})();