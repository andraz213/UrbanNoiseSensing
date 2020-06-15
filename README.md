# Senzorsko omrežje za merjenje hrupa v urbanem okolju
Diplomska naloga 



## Izbira tehnologije 

### Povezava senzorjev z internetom

Zahteve:
- obratovanje na baterije
- dovolj velik obseg vsaj 200m obseg (@@@ a je to res?)
- hitrost prenosa podatkov, vsak senzor generira cca. 200B/s ... 20 senzorjev generira 4KB/s


#### LoRa

Na prvi pogled izgleda obetavno z zelo majhno porabo energije in velikim dometom (2-3km). 
Problem je izredno počasna povezava. V najboljših razmerah je 20kbps. Naše zahteve so 4KB/s * 8 = 32kbps.
LoRa po mojem mnenju potem odpade zaradi prepočasnega prenosa podatov

#### NRF24l01+

Je dokaj preprosta tehnologija, ki omogoča hitro povezavo na srednje dolge razdalje, je dovolj hitro, ampak ima dve pomankljivsoti.
Tehnologija dovoljuje največ 6 povezav na vsak modul. Za potrebe naše uprabe bi načeloma lahko uporabili mrežo takih točk, ampak to poveča kompleksnost projekta in oteži postavljanje senzorjev

#### 802.11LR

Espressif, proizvajalec čipa ESP32 je implementiral poseben protokol, ki je kkompatibilen z 802.11, ampak ga navadne wifi točke ne zaznajo. Omogočal naj bi daljši domet kot navaden wifi.
To je doseženo z zmanjševanjem hitrosti pod 1Mbps, kar bi bilo za ta projekt še zmeraj dovolj. Problem tega je, da je še zmeraj prisoten overhead od wifija, kar močno poveča količino porabljene energije. Tu bi moral podatke pošiljati recimo enkrat na minuto, kar ne bi bilo več real time, ampak zaradi porabe energije ne bi šlo drugače. Tu bi tudi potreboval gateway, ki bi sporočila preko tea protokola sprejela in potem poslala na internet.


#### Testiranje tehnologij

Ker imam doma nekaj nrf24l01+ modulov z vgrajenim ojačevalnikom moči, sem testiral domet in zanesljivost.
Prav ta ko imam doma nekaj ESP32 modulov s katerimi sem testiral domet 802.11LR protokola. 

Zaenkrat se je 802.11LR izkazal za boljšega. Domet je vsaj še enkrat daljši.