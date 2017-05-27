// require('./format');

function Logger(name, level,formatter){

    this.name = name ;
    this.level = level ;
    if (formatter == null){
        this.formatter = "{}::{}:{}";
    }
    this.logLevels = {
        'ERROR':1,
        'INFO':2,
        'DEBUG':3,
        'DEBUG1':4,
    }
    this.info = function(msg){
        if (this.logLevels[this.level] >= 2){
            this.consoleOutput(msg);
        }
    };

    this.debug = function(msg){
        if (this.logLevels[this.level] >= 3){
            this.consoleOutput(msg);
        }
    };
    this.debug1 = function(msg){
        if (this.logLevels[this.level] >= 4){
            this.consoleOutput(msg);
        }
    }
    this.error = function(msg){
        if (this.logLevels[this.level] >= 1){
            this.consoleOutput(msg);
        }
    };

    this.consoleOutput = function(msg){
        // var d = new Date();
        // console.log(this.formatter.format(d.toLocaleString(), this.level, this.name, msg));
        console.log(this.formatter.format(this.level,this.name, msg));
    };


}

// var logger = new Logger("planetTracker", "DEBUG");
// logger.info("My name is Dean");
// logger.debug("My name is also Dean");
