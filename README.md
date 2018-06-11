# Smart Coffee Maker

## What it is?
This is a client for your coffee weight. It collects data from an Arduino, and uses ThingSpeak as a cloud based
back end for collecting data.

The client was created as a project in the course DAT259 at the Western Norway University
of Applied Sciences.


## How to connect and use the client:

#### What you need:
* Arduino Uno

* Load Cells (we used 4 load cells from a cheap kitchen scale)
* HX711 Amplifier
* Raspberry Pi with network connection
* Raspberry Pi 7" Touch Screen (can use a different screen)
* A ThingSpeak account
* A Twitter account
* Node.js and npm/yarn installed on your machine and Raspberry Pi 

#### How to use everything:
* Connect the load cells following this [guide by DegrawSt](http://www.instructables.com/id/Arduino-Bathroom-Scale-With-50-Kg-Load-Cells-and-H/)

* Connect the Raspberry Pi 7" Touch Screen following a [guide like this](https://thepihut.com/blogs/raspberry-pi-tutorials/45295044-raspberry-pi-7-touch-screen-assembly-guide)

* Clone this project on your Raspberry Pi: `git clone https://github.com/JosteinKringlen/coffee-weight-client.git`

* Navigate to the cloned folder and install all dependencies: `yarn install` 
or `npm install`

* Download the Arduino IDE, and follow steps 4 and 5 from DegrawSt's guide

* After calibration, upload the code for running the weight collection. You can find the code we have used on our 
Arduino in [collectWeight.cpp](/ArduinoCode/collectWeight.cpp). This code is a modified
version of the code found in DegrawSt's guide

* Create a ThingSpeak channel and connect the channel to Twitter using ThingTweet.
Get read and write API keys from ThingSpeak and an API key for ThingTweet.

* In the project folder on the Raspberry Pi, create a file called `credentials.json`,
and add read and write API keys from ThingSpeak as well as the API key from ThingTweet.
It should look like this: 
```json
{
    "write_key": "XXXXXXXXXXXXXX",
    "read_key": "XXXXXXXXXXXXXX",
    "thing_tweet": "XXXXXXXXXXXX"
}
```

* The last step is to change the channel number and field number in `$(document).ready(function(){...})`
in [code.js](code.js) so that it matches what you have in your ThingSpeak channel:
`'https://api.thingspeak.com/channels/<CHANNEL_NUMBER>/fields/<FIELD_NUMBER>/last.json?api_key='...` 

Now, all you have to do is run the project using `npm start` or `yarn start`



## Authors 
Jostein Kringlen & Lars Henrik Haug 
