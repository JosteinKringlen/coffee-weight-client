const $ = require('jquery');
const SerialPort = require('serialport');
const Readline = SerialPort.parsers.Readline;


// Ports for when testing on my mac and for Raspberry Pi
const inputPortMac = '/dev/cu.usbmodem14221/';
const inputPortRaspberry = '/dev/ttyAMC0/';

const port = new SerialPort(inputPortRaspberry, {autoOpen: true, baudRate: 9600});
const qs = require('qs');
const credentials = require('./credentials');

// Update time in seconds
const updateTime = 30;

$(document).ready(function () {
    runCodeContinuously();
});

function runCodeContinuously(){
    $("button").click(() => {
        port.write("tare", function (err) {
            if(err){
                return console.log(err)
            }
        });
        console.log("good stuff");
    });

    // Removes the "flow" mode of the serial input,
    // and gives each number on a single line
    let parser = new Readline();
    let counter = 0;
    port.pipe(parser);
    parser.on('data', function (data) {
        $("#kg").text(data.toString());
        counter++;
        if(counter === updateTime){
            updateWeightText(data);
            counter = 0;
        }
    });
}

function updateWeightText(weight) {
    console.log(weight.toString());
    //$("#kg").text(weight.toString());
    /*fetch('https://api.thingspeak.com/update.json?',{
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: qs.stringify({
            api_key: credentials.api_key,
            field1: weight.toString()
        })
    })
        .catch(err => console.log(err))*/
}
