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


#### Kreativne alternative

##### SD kartice

V modulu je RTC, ki se ga enkrat nastavi in potem zansljivo drži pravilen čas in podatki se beležijo na SD kartico, s katere se podatki poberejo ob polnenju baterij.

##### GSM moduli

Naprava komunicira preko GSM vmesnika in tako pošilja podatke na strežnik. Tu je še dodatni strošek recimo 7€ na mesec na senzor. Plus GSM modul, ki stane 5€. Ne vem kako je s porabo energije, ampak če bi podatke pošiljal pv paketih, bi lahko to minimiziral.

#### Testiranje tehnologij

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



#### Trenutnne možnosti

##### LoRa 

Zaenkkrat odpade, razen če zmanjšamo količino poslanih podatkov pod 15kbps.


##### NRF24 

Pogojno bi se dalo, če bi strateškko postavili senzorje in zbirnike podatkov.



##### 802.11LR

Zaenkrat se mi zdi to najboljša opcija.

Za:
- Daljši domet od nrf24 brez dodatnih optimizacij
- Cenejši od LoRa (7€ za MCU in oddajanje vs. 15€ za MCU in LoRa)
- Cenejša in bolj preprosta centralna postaja kot LoRa (dva ESP32 modula, eden je povezan na iinternet, eden pa zbira podatke iz senzorjev in jih preko I2C ali SPI vmesnika pošilja drugemu)


Proti:
- Večja poraba energije (to bi reševal s paketnim pošiljanjem podatkov)
- Najbolje deluje, ko je med oddajnikom in sprejemnikom line of sight (to bi reševal z večjim številom centralnih postaj, ki so tu cenejše in manjše od LoRa in manj odvisne od postavitve kot nrf24)


![Domet na Zoisovi cesti](/assets/img/zoisova_cesta_802_200m.jpg)






## Zapisek s sestanka

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