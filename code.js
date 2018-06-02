const $ = require('jquery');
const SerialPort = require('serialport');
const Readline = SerialPort.parsers.Readline;


// Ports for when testing on my mac and for Raspberry Pi
const inputPortMac = '/dev/cu.usbmodem14221';
const inputPortRaspberry = '/dev/ttyACM0';

const port = new SerialPort(inputPortRaspberry, {autoOpen: true, baudRate: 9600});
const qs = require('qs');
const credentials = require('./credentials');

const moment = require('moment');
const delay = require('delay');

// Update time in seconds
const updateTime = 30;
// Standard cup of coffee is apparently 150 ml = 150 g
const cupOfCoffee = 0.150; //in kg
const fullCanOfCoffee = 1.800; //in kg
const numOfCupsPerCan = 12.0;

let last = 0;
let topLevelData = "";

$(document).ready(function () {
    fetch('https://api.thingspeak.com/channels/492713/fields/2/last.json?api_key='+credentials.read_key, {
        method: 'GET',
        headers: {'Content-Type': 'application/x-www-form-urlencoded'},
    })
        .then(res => res.json())
        .then(res => {
            if(res.field2 !== undefined){
                last = res.field2;
            } else last = 0;
        })
        .catch(err => console.log(err));
    runCodeContinuously();
});

function runCodeContinuously() {
    $("#button").click(() => {
        port.write("tare", function (err) {
            if (err) {
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

        let weightDouble = parseFloat(data.toString());
        let cups = parseInt(Math.floor(weightDouble / cupOfCoffee).toString());

        $("#kg").text(data.toString());
        counter++;
        if (counter === updateTime) {
            updateWeightText(data);
            counter = 0;
        }
        topLevelData = data.toString();
        if(parseFloat(data.toString()) >= 0.000){

            (async () => {
                await delay(30000);
                setNumberOfCoffeeCupsLeft(topLevelData);
            })

        }

    });
}

function updateWeightText(weight) {
    console.log(weight.toString());
    //$("#kg").text(weight.toString());
    /*fetch('https://api.thingspeak.com/update.json',{
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: qs.stringify({
            api_key: credentials.write_key,
            field1: weight.toString()
        })
    })
        .catch(err => console.log(err))*/
}

function setNumberOfCoffeeCupsLeft(weight) {
    let weightDouble = parseFloat(weight.toString());

    let cups = parseInt(Math.floor(weightDouble / cupOfCoffee).toString());

    if(last !== undefined){
        if (parseInt(last) !== cups) {
            fetch('https://api.thingspeak.com/update.json', {
                method: 'POST',
                headers: {'Content-Type': 'application/x-www-form-urlencoded'},
                body: qs.stringify({
                    api_key: credentials.write_key,
                    field2: cups.toString()
                })
            })
                .then(res => last = cups)
                .catch(err => console.log(err))
        }
    }
}
