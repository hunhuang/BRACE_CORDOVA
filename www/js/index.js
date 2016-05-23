/*
    SimpleSerial index.js
    Created 7 May 2013
    Modified 9 May 2013
    by Tom Igoe
    */


    var app = {
    macAddress: "AA:BB:CC:DD:EE:FF",  // get your mac address from bluetoothSerial.list
    chars: "",
    smoothie1 : null,
    smoothie2:null,
    smoothie3:null,
    
    line1: null,
    line2: null,
/*
    Application constructor
    */
    initialize: function() {
        this.bindEvents();
        console.log("Starting SimpleSerial app");
        smoothie1 = new SmoothieChart();
        smoothie1.streamTo($("#mycanvas1")[0],1000 );
        smoothie2 = new SmoothieChart();
        smoothie2.streamTo($("#mycanvas2")[0],1000 );
        smoothie3 = new SmoothieChart();
        smoothie3.streamTo($("#mycanvas3")[0],1000 );
        
        line1 = new TimeSeries();
        line2 = new TimeSeries();
        line3 = new TimeSeries();


        smoothie1.addTimeSeries(line1);
        smoothie2.addTimeSeries(line2);
        smoothie3.addTimeSeries(line3);
        },
/*
    bind any events that are required on startup to listeners:
    */
    bindEvents: function() {
        document.addEventListener('deviceready', this.onDeviceReady, false);
        connectButton.addEventListener('touchend', app.manageConnection, false);
    },

/*
    this runs when the device is ready for user interaction:
    */
    onDeviceReady: function() {
        // check to see if Bluetooth is turned on.
        // this function is called only
        //if isEnabled(), below, returns success:
        var listPorts = function() {
            // list the available BT ports:
            bluetoothSerial.list(
                function(results) {
                    app.display(JSON.stringify(results));
                    app.macAddress=results[0].address;
                },
                function(error) {
                    app.display(JSON.stringify(error));
                }
                );
        }

        // if isEnabled returns failure, this function is called:
        var notEnabled = function() {
            app.display("Bluetooth is not enabled.")
        }

         // check if Bluetooth is on:
         bluetoothSerial.isEnabled(
            listPorts,
            notEnabled
            );

     },
/*
    Connects if not connected, and disconnects if connected:
    */
    manageConnection: function() {

        // connect() will get called only if isConnected() (below)
        // returns failure. In other words, if not connected, then connect:
        var connect = function () {
            // if not connected, do this:
            // clear the screen and display an attempt to connect
            app.clear();
            app.display("Attempting to connect. " +
                "Make sure the serial port is open on the target device.");
            // attempt to connect:
            bluetoothSerial.connect(
                app.macAddress,  // device to connect to
                app.openPort,    // start listening if you succeed
                app.showError    // show the error if you fail
                );
        };

        // disconnect() will get called only if isConnected() (below)
        // returns success  In other words, if  connected, then disconnect:
        var disconnect = function () {
            app.display("attempting to disconnect");
            // if connected, do this:
            bluetoothSerial.disconnect(
                app.closePort,     // stop listening to the port
                app.showError      // show the error if you fail
                );
        };

        // here's the real action of the manageConnection function:
        bluetoothSerial.isConnected(disconnect, connect);
    },
/*
    subscribes to a Bluetooth serial listener for newline
    and changes the button:
    */
    openPort: function() {
        // if you get a good Bluetooth serial connection:
        app.display("Connected to: " + app.macAddress);
        // change the button's name:
        connectButton.innerHTML = "Disconnect";
        // set up a listener to listen for newlines
        // and display any new data that's come in since
        // the last newline:
        var count=0
        bluetoothSerial.subscribe('\n', function (data) {
            count=count+1;
            if (count % 10==0)
                app.clear();
          line1.append(new Date().getTime(), data.split(' ')[1]);
          line2.append(new Date().getTime(), data.split(' ')[2]);
          line3.append(new Date().getTime(), data.split(' ')[3]);
          
          // line2.append(new Date().getTime(), Math.random());

            app.display(data);
            // bluetoothSerial.write("This is me" +Math.floor((Math.random() * 10) + 1) +"\n")
        });
    },

/*
    unsubscribes from any Bluetooth serial listener and changes the button:
    */
    closePort: function() {
        // if you get a good Bluetooth serial connection:
        app.display("Disconnected from: " + app.macAddress);
        // change the button's name:
        connectButton.innerHTML = "Connect";
        // unsubscribe from listening:
        bluetoothSerial.unsubscribe(
            function (data) {
                app.display(data);
            },
            app.showError
            );
    },
/*
    appends @error to the message div:
    */
    showError: function(error) {
        app.display(error);
    },

/*
    appends @message to the message div:
    */
    display: function(message) {
        var display = document.getElementById("message"), // the message div
            lineBreak = document.createElement("br"),     // a line break
            label = document.createTextNode(message);     // create the label

        display.appendChild(lineBreak);          // add a line break
        display.appendChild(label);              // add the message node
    },
/*
    clears the message div:
    */
    clear: function() {
        var display = document.getElementById("message");
        display.innerHTML = "";
    }
};      // end of app

