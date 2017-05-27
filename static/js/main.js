var util = {
    requestData: function(route, callbacks){
        $.ajax({
            type:"GET",
            url: $SCRIPT_ROOT+route,
            success: function(msg){
                var data = JSON.parse(msg.result);
                // console.log(data[0].name);
                callbacks.forEach(function(callback){
                    callback(data) ;
                })
            },
            failure: function(msg){
                console.log("Failure message from server: "+msg);
            }
        });
    },
    getRandomInt: function(min, max) {
        min = Math.ceil(min);
        max = Math.floor(max);
        return Math.floor(Math.random() * (max - min)) + min;
    }
}

function App(updateRate){
    this.updateRate = updateRate ;
    this.logger = new Logger("App","DEBUG")
    this.currentWord = 'burning';

    this.init = function(){
        this.makeWordRequest(this)()
        this.makeWeatherRequest(this)()
        if (this.updateRate != null){
            this.timer = setInterval(this.makeWordRequest(this), this.updateRate)
        }
    }

    this.makeWordRequest = function(self){
        return function(){
            util.requestData("/get-synonym/{}".format(self.currentWord),[self.renderWord(self)])
        }
    }

    this.makeWeatherRequest = function(self){
        return function(){
            util.requestData("/get-weather",[self.renderWeather(self)])
        }
    }

    this.renderWord = function(self){
        return function(data){
            var randomInt = util.getRandomInt(0, data['adjective']['syn'].length);
            self.logger.debug("Random Integer: {}".format(randomInt));
            self.currentWord = data['adjective']['syn'][randomInt];
            $("#weather-display").html(
                "<h4>It's pretty {} today in Abu Dhabi! </h4>"
                    .format(self.currentWord)
            )
        }
    }

    this.renderWeather = function(self){
        return function(data){
            var min, max, cur ;
            min = data['main']['temp_min']
            max = data['main']['temp_max']
            cur = data['main']['temp']
            self.logger.debug("Min temp: {}, max temp: {}, current temp: {}"
                .format(
                    min, max, cur
                ))
        }
    }
}

$(document).ready(function(){
    var app = new App(null);
    app.init();
});
