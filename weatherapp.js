$(function() {


    $("button#search").click(function(ev) {
        var zipCode = $("#searchBarText").val();
        getCoords(zipCode);
        $("#searchBarText").val("");
    });

    $(document).on('click', 'button#remove', function() {
        var parentDiv = $(this).parent().parent();
        parentDiv.remove();
    });

});//onready function

var getCoords = function(zipCode) {
    var googleKey = "&key=AIzaSyDJPzeEP8rfaPZRV8gtyT2keKmKR45ROO8";
    $.ajax("https://maps.googleapis.com/maps/api/geocode/json?address=" + zipCode + googleKey).done(function(data) {
        var latitude = data.results[0].geometry.location.lat;
        var longitude = data.results[0].geometry.location.lng;
        
        var cityState = data.results[0].formatted_address;
        return getInfo(latitude, longitude, zipCode, cityState);

    });
}

var getInfo = function(latitude, longitude, zip, cityState) {
    var darkSkyKey = "93fa32d43382a60a9eb23ee3cb6b9d82";
    var url = "https://api.darksky.net/forecast/";
    $.ajax(url + darkSkyKey + "/" + latitude + "," + longitude, { dataType: "jsonp"}).done(function(data) {
        //Sets the information on the front of the card pertaining to today's weatherCard

        var today = new Date();
        var tomorrow = new Date();
        var month;

        var currentTemp = data.currently.temperature;
        var maxTemp = data.daily.data[0].temperatureMax;
        var minTemp = data.daily.data[0].temperatureMin;
        var precip = data.daily.data[0].precipProbability * 100;
        var weatherIcon = data.currently.icon;
        var conditions = data.currently.summary;

        var template = $("#template").html();
        template = template.replace("@@class@@", "newCard");
        template = template.replace("@@conditions@@", conditions);
        template = template.replace("@@URL@@", changeBackground(weatherIcon));
        template = template.replace("@@color@@", changeColor(weatherIcon));
        template = template.replace("@@currentTemp@@", Math.round(currentTemp));
        template = template.replace("@@maxTemp@@", Math.round(maxTemp));
        template = template.replace("@@minTemp@@", Math.round(minTemp));
        template = template.replace("@@rain@@", precip);
        template = template.replace("@@cityState@@", cityState);
        template = template.replace("@@zipCode@@", zip);

        for (i = 0; i < 5; i++) {
            if (i > 0) {
                tomorrow.setDate(today.getDate() + i);
                month = tomorrow.getMonth() + 1;
                template = template.replace("@@date" + i + "@@", month + "/" + tomorrow.getDate());
            }
            template = template.replace("@@" + i + "max@@", Math.round(data.daily.data[i].temperatureMax));
            template = template.replace("@@" + i + "low@@", Math.round(data.daily.data[i].temperatureMin));
            template = template.replace("@@" + i + "precip@@", Math.round(data.daily.data[i].precipProbability * 100));
        }


        $(".row").append(template);
    });
}

//Function to select the proper background image based on a switch statement using the weather icon as input
var changeBackground = function(icon) {
    switch (icon) {
        case "rain":
            return "resources/rain.jpg";

        case "clear-day":
            return "resources/clear-day.jpg";

        case "clear-night":
            return "resources/clear-night.jpg";

        case "snow":
            return "resources/snow.jpg";

        case "sleet":
            return "resources/sleet.jpg";

        case "fog":
            return "resources/fog.jpg";

        case "wind":
            return "resources/wind.jpg";

        case "cloudy":
            return "resources/cloudy.jpg";

        case "partly-cloudy-day":
            return "resources/partly-cloudy-day.jpg";

        case "partly-cloudy-night":
            return "resources/partly-cloudy-night.jpg";

        default:
            return "resources/clear-day.jpg";
    }
}

//Function to select the proper text color based on a switch statement using the weather icon as input
var changeColor = function(icon) {
    switch (icon) {
        case "rain":
            return "white";

        case "clear-day":
            return "black";

        case "clear-night":
            return "white";

        case "snow":
            return "black";

        case "sleet":
            return "black";

        case "fog":
            return "black";

        case "wind":
            return "black";

        case "cloudy":
            return "white";

        case "partly-cloudy-day":
            return "black";

        case "partly-cloudy-night":
            return "white";

        default:
            return "black";
    }
}
