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
    },
    getSmallestDiffIndex: function(array, target){
        var diff = Math.abs(array[0] - target);
        var index = 0;
        var candidateDiff ;
        for (var i=1; i<array.length; i++){
            candidateDiff = Math.abs(array[i] - target);
            if (candidateDiff < diff){
                index = i ;
            }
        }
        return index ;
    },
    range: function(min, max, increment){
        var returnArray = [];
        var val = min ;
        var i = 0 ;
        while (val < max){
            returnArray[i] = val ;
            i += 1;
            val += increment ;
        }
        return returnArray;
    }
}

function App(updateRate){
    this.updateRate = updateRate ;
    this.logger = new Logger("App","DEBUG")
    this.currentAdj = $("#adj").text();
    this.currentAdv = $("#adv").text();
    this.colors = ['#ffff00','#ffed00','#ffd800','#ffc500','#ffb100','#ff9b00','#ff8400','#ff6a00','#ff4900','#ff0000'];
    // this.colors = ['#0000ff','#3b26e5','#4d37cb','#5646b2','#585299','#575d7f','#506765','#456f4c','#347832','#008000'];
    this.color = null ;

    this.init = function(){
        var height = $(window).height()
        $("#weather-display").css("transform", "translateY({}px)".format(height/2));
        this.makeWeatherRequest(this)()
        this.makeWordRequest(this)()
        if (this.updateRate != null){
            this.timer = setInterval(this.makeWordRequest(this), this.updateRate)
        }
    }

    this.makeWordRequest = function(self){
        return function(){
            util.requestData("/get-synonym/{}".format(self.currentAdj),[self.renderWord(self, 'adj')])
            util.requestData("/get-synonym/{}".format(self.currentAdv),[self.renderWord(self, 'adv')])
        }
    }

    this.makeWeatherRequest = function(self){
        return function(){
            util.requestData("/get-weather",[self.renderWeather(self)])
        }
    }

    this.renderWord = function(self, type){
        return function(data){
            if (type == 'adj'){
                self.logger.debug("Placing adjective");
                var randomInt = util.getRandomInt(0, data['adjective']['syn'].length);
                self.currentAdj = data['adjective']['syn'][randomInt];
                self.logger.info("Random Integer: {}, adjective: {}".format(randomInt, self.currentAdj));
                $("#adj").html(self.currentAdj);
            }else if (type == 'adv'){
                self.logger.debug("Placing adverb");
                var randomInt = util.getRandomInt(0, data['adverb']['syn'].length);
                self.currentAdv = data['adverb']['syn'][randomInt];
                self.logger.info("Random Integer: {}, adverb: {}".format(randomInt, self.currentAdv));
                $("#adv").html(self.currentAdv);
            }
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
            var r = util.range(33,43,1);
            var closestIndex = util.getSmallestDiffIndex(r, cur);
            self.color = self.colors[closestIndex];
            self.logger.debug("Closest Index: {}, color: {}".format(closestIndex, self.color));
            $("#adj").css('color',self.color);
        }
    }
}

$(document).ready(function(){
    var app = new App(null);
    app.init();
});
