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

function App(mouseTimeout, updateRate){
    this.updateRate = updateRate ;
    this.mouseTimeout = mouseTimeout
    this.logger = new Logger("App","DEBUG")
    this.currentAdj = $("#adj").text();
    this.currentAdv = $("#adv").text();
    this.colors = ['#ffff00','#ffed00','#ffd800','#ffc500','#ffb100','#ff9b00','#ff8400','#ff6a00','#ff4900','#ff0000'];
    // this.colors = ['#0000ff','#6a18e9','#8f2cd2','#aa3ebc','#be50a6','#cf618f','#de7377','#eb835d','#f5943e','#ffa500'];
    this.color = null ;
    this.lastMouseMoved = new Date();


    this.init = function(){
        var height = $(window).height()
        $("#weather-display").css("transform", "translateY({}px)".format(height/2));
        this.makeWeatherRequest(this)()
        this.makeWordRequest(this)()
        $(document).mousemove(this.mouseMoveCallback(this))
        // if (this.updateRate != null){
        this.timer1 = setInterval(this.makeWeatherRequest(this), this.updateRate);
        this.timer2 = setInterval(this.makeWordRequest(this), this.updateRate);
        // }
    }

    this.makeWordRequest = function(self){
        return function(){
            util.requestData("/get-synonym/{}/{}".format(self.currentAdj,'adj'),[self.renderWord(self, 'adj')])
            util.requestData("/get-synonym/{}/{}".format(self.currentAdv,'adv'),[self.renderWord(self, 'adv')])
        }
    }

    this.makeWeatherRequest = function(self){
        return function(){
            util.requestData("/get-weather",[self.renderWeather(self)])
        }
    }

    this.renderWord = function(self, type){
        return function(data){
            var randomInt = util.getRandomInt(0, data.length);
            if (type == 'adj'){
                self.logger.debug("Placing adjective");
                self.currentAdj = data[randomInt];
                self.logger.info("Random Integer: {}, adjective: {}".format(randomInt, self.currentAdj));
                $("#adj").html(self.currentAdj);
            }else if (type == 'adv'){
                self.logger.debug("Placing adverb");
                self.currentAdv = data[randomInt];
                self.logger.info("Random Integer: {}, adverb: {}".format(randomInt, self.currentAdv));
                $("#adv").html(self.currentAdv);
            }
        }
    }

    this.renderWeather = function(self){
        return function(data){
            console.log(data);
            var min, max, cur ;
            min = data['min']
            max = data['max']
            cur = data['temp']
            self.logger.debug("Min temp: {}, max temp: {}, current temp: {}"
                .format(
                    min, max, cur
                ))
            var inc = (max+1.0 - min) / 10.0 ;
            var r = util.range(min,max+1.0,inc);
            var closestIndex = util.getSmallestDiffIndex(r, cur);
            self.color = self.colors[closestIndex];
            self.logger.debug("Closest Index: {}, color: {}".format(closestIndex, self.color));
            $("#adj").css('color',self.color);
        }
    }
    this.mouseMoveCallback = function(self){
        return function(){
            var curTime = new Date();
            self.logger.debug1(curTime - self.lastMouseMoved);
            if (curTime - self.lastMouseMoved >= self.mouseTimeout){
                self.logger.info("Making request to server!");
                self.makeWeatherRequest(self)();
                self.makeWordRequest(self)();
            }
            self.lastMouseMoved = curTime;
        }
    }
}

$(document).ready(function(){
    var app = new App(2000, 60*30*1000);
    app.init();
});
