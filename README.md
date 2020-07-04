# Senzorsko omrežje za merjenje hrupa v urbanem okolju
Diplomska naloga



# Overview

The main goal of this project is to build a sensor network for noise sampling and analysis.

A few main goals:

- affordable sensor nodes
- one sample per second
- synchronized nodes
- fft and decibel data
- battery-powered
- wireless
- REST API interface to port data into Orange
- support for geospatial data

Additional goals:

- as long battery life as possible
- simple user interface
- useful and efficient data storage structure
- simple node firmware updates
- as few central stations as possible
- local server deployment


## Basic structure

Everything starts with good backend. The heart of this project will be a node.js and express app deployed on a local server. It will be packed in a docker container for more streamlined deployment.
This server will handle all the requests from sensor nodes and serve data to the front end app used for managing sensors and data.

Since sensors won't be directly connected to wifi because of connection overhead, there will be gateways that will send received data from the special protocol to the main server. These gateways will consist of one or two ESP32 microcontrollers.
There might be two needed because one can't communicate through the special protocol and wifi at the same time.

Sensor nodes are at the edge of this system. Their main purpose is to collect data and send it through the protocol to the gateways. These nodes will have administration mode, where they connect to designated wifi and receive instructions and OTA updates.


# Functionality overview


This is the main goal of the whole project and is the simplest overview of what will be going on.

![The simplest overview](/assets/img/simplest_overview.png)





## Gateway routine

Honestly not sure about this one. I want to only have one esp32, but I think that might not be possible. I just hope two esps won't be too much of a clusterfuck.

In case I need two esps, I will use PJON through serial https://www.pjon.org/ThroughSerial.php
It is a protocol that will help transfer data from one esp to the other.


# Sensor node


## Firmware

![Sensor routine](/assets/img/sensor_routine.png)

### Setting up

When the sensor node is first programmed, it should have generic settings.
The only thing set is what wifi it should connect to.
What's next?

Firstly, it needs a unique classifier or id, so the server knows which node sent the data. Luckily, every esp comes with a unique mac address. I can use it as an id.

Then it needs to send telemetry data like firmware version, battery voltage, mac address,...

It should go something like this:

1. Connect to wifi
2. Send a "do you know me" message to the server with mac address
3. Wait for a response
4. If ok, send telemetry data


### Provisioning

Once the sensor node is set up, it needs to get some more information before it can start measuring and sending the data.

It needs:

- Gateway mac address. To send data with ESPNOW protocol, the device needs to know the MAC address of the receiver
- Sampling rate. While one measurement per second might be fine, it needs to be modifiable to make it more robust
- Frequency range. While most noise we're interested in is below 1kHz, this needs to be modifiable as well

Most provisioning work is done on the backend, so this is probably all that is needed here.


### Sensing



## Hardware

### MCU

I chose ESP32 MCU for this project.
It has excellent library support, wifi range is quite large, it has i2s for the microphone, it has great low power capabilities, it is powerful enough for all fft calculations, price.


The exact specific model is WROOM 32U because it has an external antenna connector. PCB antennas tend to be spotty and have a lot of signal shape peculiarities that are less than ideal in this kind of application.
The bad thing about this is that all of the development boards have a very inefficient LDO AMS1117. It is a voltage regulator with a high quiescent current. It consumes 5mA of power at all times. That is unacceptable. I will have to replace those with a more efficient model like MCP1825S. It has a quiescent current of only 220uA, which is far from the lowest, but it's good enough for this application.

### Antenna

This is yet to be determined. I have a few antennas ordered off of aliexpress, but I have to test them first. A lot of antennas are poorly made or just plain wrong.


### Battery

Sensors will be powered by one or two 18650 batteries. They seem to be a good choice because of their low price and availability. I'm not sure whether ordering them off aliexpress is a good idea tho.
Battery management will be done with a cheap tp4056 board. It has a charging circuit, overcharge protection, overcurrent protection, and over-discharge protection built into a small footprint.
I will use battery holders since I'm not comfortable with welding wires directly to the batteries.


### Microphone

A MEMS i2s microphone was chosen. MEMS microphones generally have very tight manufacturing tolerances and a flat frequency response curve. They are weather-resistant and can work under extreme temperature conditions.

INMP441 was chosen for an affordable price, great performance, compatibility with esp32, and because it comes on an easy to use a breakout board.

Decibel meter project: https://github.com/ikostoski/esp32-i2s-slm


I still have to source an appropriate wind protector.

### Enclosure

It will most probably be a weatherproof ABS plastic container. 
Haven't found one yet.











# Backend


## Database 

MongoDB will be used.
Measurements will be collected in size based buckets. 









## Data structure 

MongoDB is a document driven database. 

Models used:

- Deployment 
- Data
- Gateway
- Sensor 


### Deployment

This model will be used to store all the relevant deployment related data and configuration.

```
id: number
name: string
description: string
sensors: [sensor.id, coordinates]
gateways: [gateway.id, coordinates]
start: time
finish: time
measurement_num: number
tags: [string]
```
 
id is a random unique number generated by mongoDB used as an identifier.
name is a string that is used to recognize deployments easier.
description is a deployment description with more details about this deployments. 
sensors is an array that will save which sensors are deployed where.
gateways is an array of gateway ids and location data
start is the time of the first measurement
finish is the time of the last measurement
measurement_num is a number of measurements
tags is an array of tags that will help to search 

### Sensor

This model will hold crucial sensor data. 


```
id: number
name: string
mac: [number] (maybe string)
deployments: [deployment.id]
current_deployment: deployment.id
current_location: [number]
last_telemetry: time
last_data: data.id
firmware_version: string
battery_voltage: number
```

id will hold the unique identifier
name is a randommoly generated name that will make identification easier to humans
mas is a mac address of this sensor
deployments is an array of all past deployments
current_deployment is the id of the current deployment
current_location is the current location of the sensor
last_telemitry is the time and date of the last recieved telemitry
last_data is the id of the last data bucket that is currently getting filled up
firmware_version is the version of currently installed firmware
battery_voltage is last measured voltage


### Gateway

Will hold all the relevant data for the gateway.

```
id: number
name: string
mac: [number] (maybe string)
deployments: [deployment.id]
current_deployment: deployment.id
current_location: [number]
last_telemetry: time
firmware_version: string
```

id will hold the unique identifier
name is a randommoly generated name that will make identification easier to humans
mas is a mac address of this sensor
deployments is an array of all past deployments
current_deployment is the id of the current deployment
current_location is the current location of the sensor
last_telemitry is the time and date of the last recieved telemitry
firmware_version is the version of currently installed firmware

### Data


Is a bucket structure that will hold incoming data.

```
id: number
sensor: sensor.id
deployment: deployment.id
location: [number]
size: number
first: time
last: time
data: [data structure]
```

id is a unique identifier
sensor is which sensor is this data from
deployent is which deployment does this data belong to
location is where was this location captured
size is the number of measurements data currently in this bucket
first is the time of the first measurement in this bucket
last is the time of the last measuremetn in this bucket 
data is an array of meaasurements, each measurement will have its own timestamp and the data 

I might impllement this as a linked list. Just to make it easier to get the data in the right order. I'm not sure wether this is a good idea yet, but it might be useful. 




























































# Izbira tehnologije

## Povezava senzorjev z internetom

Zahteve:
- obratovanje na baterije
- dovolj velik obseg vsaj 200m obseg (@@@ a je to res?)
- hitrost prenosa podatkov, vsak senzor generira cca. 200B/s ... 20 senzorjev generira 4KB/s


### LoRa

Na prvi pogled izgleda obetavno z zelo majhno porabo energije in velikim dometom (2-3km).
Problem je izredno počasna povezava. V najboljših razmerah je 20kbps. Naše zahteve so 4KB/s * 8 = 32kbps.
LoRa po mojem mnenju potem odpade zaradi prepočasnega prenosa podatov

### NRF24l01+

Je dokaj preprosta tehnologija, ki omogoča hitro povezavo na srednje dolge razdalje, je dovolj hitro, ampak ima dve pomankljivsoti.
Tehnologija dovoljuje največ 6 povezav na vsak modul. Za potrebe naše uprabe bi načeloma lahko uporabili mrežo takih točk, ampak to poveča kompleksnost projekta in oteži postavljanje senzorjev

### 802.11LR

Espressif, proizvajalec čipa ESP32 je implementiral poseben protokol, ki je kkompatibilen z 802.11, ampak ga navadne wifi točke ne zaznajo. Omogočal naj bi daljši domet kot navaden wifi.
To je doseženo z zmanjševanjem hitrosti pod 1Mbps, kar bi bilo za ta projekt še zmeraj dovolj. Problem tega je, da je še zmeraj prisoten overhead od wifija, kar močno poveča količino porabljene energije. Tu bi moral podatke pošiljati recimo enkrat na minuto, kar ne bi bilo več real time, ampak zaradi porabe energije ne bi šlo drugače. Tu bi tudi potreboval gateway, ki bi sporočila preko tea protokola sprejela in potem poslala na internet.


### Kreativne alternative

#### SD kartice

V modulu je RTC, ki se ga enkrat nastavi in potem zansljivo drži pravilen čas in podatki se beležijo na SD kartico, s katere se podatki poberejo ob polnenju baterij.

#### GSM moduli

Naprava komunicira preko GSM vmesnika in tako pošilja podatke na strežnik. Tu je še dodatni strošek recimo 7€ na mesec na senzor. Plus GSM modul, ki stane 5€. Ne vem kako je s porabo energije, ampak če bi podatke pošiljal pv paketih, bi lahko to minimiziral.

### Testiranje tehnologij

Ker imam doma nekaj nrf24l01+ modulov z vgrajenim ojačevalnikom moči, sem testiral domet in zanesljivost.
Prav ta ko imam doma nekaj ESP32 modulov s katerimi sem testiral domet 802.11LR protokola.

Zaenkrat se je 802.11LR izkazal za boljšega. Domet je vsaj še enkrat daljši.

Oba modula sem imel na okenjski polici svoje sobe. Hodil sem po kraju in opazoval koliko sporočil je prišlo do sprejemnika.

nrf24 z vgrajenim ojačevalnikom signala in cca 3dBi anteno:
- Takoj ko je bila med mano in oddajnikom hiša, je sperjemnik izgubil signal
- Line of sight doseg je bil približno 80m

802.11LR ESP32 z vgrajeno anteno na tiskanem vezju s cca 2dBi:
- Je deloval tudi na drugem koncu hiše in do neke mere celo ko je bila med mano in oddajnikom sosedova hiša
- Line of sight doseg je bil približno 160m

Test sem z 802.11LR ponovil doma v hiši. Oddajnik sem postavil na podstrešju na skrajno vzhodni strani.
- V istem nadstropju je signal brezhiben
- Eno nadstropje nižje je signal brezhiben in se sprejemnik poveže v vseh delih nadstropja razen v najbolj zahodnih delih hiše.
- V spodnjem nadstropju se sprejemnik poveže in brezhibno sprejema signal povsod razen v 1/3 najbolj zahodnega dela hiše

Ob ponovitvi testa 802.11LR z oddajnikom na podstrešju, sem izmeril line of sight domet 200m, ampak le če je bil modul obrnjen v pravo smer. Zunanja antena bi pri tem precej pomagala.

Testirano je bilo na razvojnih ploščah, ki imajo na tiskanem vezju vgrajene antene. Te antene najverjetneje niso najboljše, kar poemni, da bi z boljšimi antenami dosegli še boljše rezultate.



### Trenutnne možnosti

#### LoRa

Zaenkkrat odpade, razen če zmanjšamo količino poslanih podatkov pod 15kbps.


#### NRF24

Pogojno bi se dalo, če bi strateškko postavili senzorje in zbirnike podatkov.



#### 802.11LR

Zaenkrat se mi zdi to najboljša opcija.

Za:
- Daljši domet od nrf24 brez dodatnih optimizacij
- Cenejši od LoRa (7€ za MCU in oddajanje vs. 15€ za MCU in LoRa)
- Cenejša in bolj preprosta centralna postaja kot LoRa (dva ESP32 modula, eden je povezan na iinternet, eden pa zbira podatke iz senzorjev in jih preko I2C ali SPI vmesnika pošilja drugemu)


Proti:
- Večja poraba energije (to bi reševal s paketnim pošiljanjem podatkov)
- Najbolje deluje, ko je med oddajnikom in sprejemnikom line of sight (to bi reševal z večjim številom centralnih postaj, ki so tu cenejše in manjše od LoRa in manj odvisne od postavitve kot nrf24)


![Domet na Zoisovi cesti](/assets/img/zoisova_cesta_802_200m.jpg)






# Zapisek s sestanka

Strojna in programska infrastruktura za sledenje in analizo hrupa v urbanih okoljih
Cilj: sistem med seboj vsaj deset časovno sinhronizirinah senzorjev, ki jih postavimo na različne lokacije v nekem lokalnem okolju. Meritve gredo v oblak, najbrž preko centralne naprave, ki naprej meritve shrani lokalno. Dva načina dela: po deset meritev na sekundo (spremljamo lahko vpliv mimoidočega avtobusa) ali ena meritev na minuto. Iz oblaka meritve preberemo v Orange, spremljamo časovni potek za dano okno in v geo karti spreminjanje hrupa v času.
- poiskati ustrezni senzor
- casing
- fft
- kombinacija z ESP32 ali podobnim, avtonomna enota
- poiskati tudi referenčni merilec in narediti sistem za umerjanje instrumenta (tudi vir zvoka), morda lahko pomaga kdo iz FE
- seznam opreme za nakup (čimprej)
- sestaviti merilno enoto, ki je avtonomna (baterija) in se poveže na centralno vozlišče
- sestaviti centralno vozlišče
- testiranje na FRI
- sistem za umerjanje

- kateri problem rešujemo
- zasnova arhitekture
- seznam stvari za nakup
- ali lahko začnete s prototipom: senzor, komunikacija, iot platforma ali baza, branje v orange-u (python)
