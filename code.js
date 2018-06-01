const $ = require('jquery');
const SerialPort = require('serialport');
const Readline = SerialPort.parsers.Readline;


// Ports for when testing on my mac and for Raspberry Pi
const inputPortMac = '/dev/cu.usbmodem14221';
const inputPortRaspberry = '/dev/ttyACM0';

const port = new SerialPort(inputPortRaspberry, {autoOpen: true, baudRate: 9600});
const qs = require('qs');
const credentials = require('./credentials');

// Update time in seconds
const updateTime = 30;
// Standard cup of coffee is apparently 150 ml = 150 g
const cupOfCoffee = 0.150; //in kg
const fullCanOfCoffee = 1.800; //in kg
const numOfCupsPerCan = 12.0;

let last = 0;

$(document).ready(function () {
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
        $("#kg").text(data.toString());
        counter++;
        if (counter === updateTime) {
            updateWeightText(data);
            counter = 0;
        }

        if(parseFloat(data.toString()) >= 0.000 && counter === 1){
            setNumberOfCoffeeCupsLeft(data);
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
    console.log("Last = " + last);
    console.log("Cups = " + cups);


    fetch('https://api.thingspeak.com/channels/492713/fields/2/last.json?api_key='+credentials.read_key, {
        method: 'GET',
        headers: {'Content-Type': 'application/x-www-form-urlencoded'},
    })
        .then(res => res.json())
        .then(res => last = res.field2)
        .catch(err => console.log(err));

    if(last === undefined){
        if (parseInt(last) !== cups) {
            fetch('https://api.thingspeak.com/update.json?', {
                method: 'POST',
                headers: {'Content-Type': 'application/x-www-form-urlencoded'},
                body: qs.stringify({
                    api_key: credentials.write_key,
                    field2: "0"
                })
            })
                .catch(err => console.log(err))
        }
    }
}
