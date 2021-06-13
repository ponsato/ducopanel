<!--
*** Official Duino Coin README
*** by revox, 2019-2021
-->

<p align = "center">
  <a href="https://duinocoin.com">
    <img width="300em" src="https://github.com/revoxhere/duino-coin/blob/master/Resources/ducobanner.png?raw=true" />
  </a>
  <br />
  <a href="https://github.com/revoxhere/duino-coin/blob/master/README.md">
    <img src="https://img.shields.io/badge/English-0097e6.svg?style=for-the-badge" />
  </a>
  <a href="https://github.com/revoxhere/duino-coin/blob/master/Resources/README_TRANSLATIONS/README_es_LATAM.md">
    <img src="https://img.shields.io/badge/-Espa%C3%B1ol-ff793f?style=for-the-badge" />
  </a>
  <a href="https://github.com/revoxhere/duino-coin/blob/master/Resources/README_TRANSLATIONS/README_zh_CN.md">
    <img src="https://img.shields.io/badge/简体中文-2ed573.svg?style=for-the-badge" />
  </a>
  <a href="https://github.com/revoxhere/duino-coin/blob/master/Resources/README_TRANSLATIONS/README_pl_PL.md">
    <img src="https://img.shields.io/badge/Polski-e66767.svg?style=for-the-badge" />
  </a>
  <br />
  <a href="https://wallet.duinocoin.com">
    <img src="https://img.shields.io/badge/Online Wallet-8e44ad.svg?style=for-the-badge&logo=Web" /></a>
  <a href="https://play.google.com/store/apps/details?id=com.pripun.duinocoin">
    <img src="https://img.shields.io/badge/Android App-e84393.svg?style=for-the-badge&logo=Android" /></a>
  <a href="https://github.com/revoxhere/duino-coin/blob/gh-pages/assets/whitepaper.pdf">
    <img src="https://img.shields.io/badge/whitepaper-1abc9c.svg?style=for-the-badge&logo=Academia" /></a>
  <br>
  <a href="https://youtu.be/bFnCdqMke34">
    <img src="https://img.shields.io/badge/Video-Watch-e74c3c.svg?style=for-the-badge&logo=Youtube" /></a>
  <a href="https://discord.gg/kvBkccy">
    <img src="https://img.shields.io/discord/677615191793467402.svg?color=5539cc&label=Discord&logo=Discord&style=for-the-badge" /></a>
  <a href="https://github.com/revoxhere/duino-coin/releases/tag/2.4.5">
    <img src="https://img.shields.io/badge/release-2.4.5-ff4112.svg?style=for-the-badge" /></a>
</p>

<h3 align="center">Duino-Coin - это крипто монета, которую можно добывать с помощью Arduino, плат ESP, Raspberry Pi, компьютеров и многого другого</h3>
<h4 align="center">включая маршрутизаторы Wi-Fi, умные телевизоры, смартфоны, умные часы, SBC, MCU, графические процессоры - все, что угодно!</h4><br />

<table align="center">
  <tr>
    <th>Ключевые возможности</th>
    <th>Техническая спецификация</th>
  </tr>
  <tr>
    <td>
      💻 Поддержка большого числа платформ<br>
      👥 Дружное быстрорастущее сообщество<br>
      💱 Легко использовать и обменивать<br>
      🌎 Доступно везде и всегда<br>
      :new: Полностью оригинальный проект<br>
      :blush: Просто для новичков<br>
      💰 Эффективно по затратам<br>
      ⛏️ Легко добывать<br>
      📚 Проект с открытым кодом<br>
    </td>
    <td>
      ♾️ Количество монет: Бесконечное (до декабря 2020 года: 350 тысяч монет)<br>
      😎 Предварительная добыча: <5k блоков (<500 монет)<br>
      ⚡ Время транзакции: Моментально<br>
      🔢 Дробность: до 20ти знаков после запятой<br>
      🔤 Логотип: DUCO (ᕲ)<br>
      ⚒️ Алгоритмы: DUCO-S1, DUCO-S1A, XXHASH +больше в планах<br>
      ♐ Награды: поддерживается "системой Kolka", помогающей справедливо вознаграждать майнеров<br>
    </td>
  </tr>
</table>

<h2 align="center">Может, приступим?</h2><br>

Официальные руководства по началу работы, созданию учетной записи и настройки майнеров на различных устройствах доступны <a href="https://revoxhere.github.io/duino-coin/getting-started">на официальном сайте</a>.<br>
Часто задаваемые вопросы и ответы, помощь по устранению неполадок можно найти в <a href="https://github.com/revoxhere/duino-coin/wiki">[Вики]</a>.<br>


| Официальные кошельки | Официальные майнеры |
:---------------------:|:--------------------:
[<img src="https://i.imgur.com/msVtLHs.png">](https://duinocoin.com/getting-started#register)  |  [<img src="https://i.imgur.com/SMkKHOK.png">](https://duinocoin.com/getting-started#computer)

<h3 align="center">Установка Duino-Coin</h2><br>

Самый простой способ начать работу с Duino-Coin - это загрузить [последнюю версию](https://github.com/revoxhere/duino-coin/releases/latest) для вашей ОС.<br>
После загрузки распакуйте архив и запустите нужную программу.
Никаких зависимостей не требуется.

<hr>

Если вы хотите запускать программы из исходного кода, вам может потребоваться установить некоторые зависимости. Вот как это сделать в дистрибутивах на основе debian (например, Ubuntu, Debian, Raspian):
```BASH
sudo apt install python3 python3-pip git
git clone https://github.com/revoxhere/duino-coin
cd duino-coin
python3 -m pip install -r requirements.txt
```
Если вы работаете в Windows, скачайте [Python 3](https://www.python.org/downloads/), затем [наш репозиторий](https://github.com/revoxhere/duino-coin/archive/master.zip), извлеките его из архива и откройте папку в командной строке. В CMD введите:
```BASH
py -m pip install -r requirements.txt
```
Примечание для пользователей Windows: убедитесь, что python и pip добавлены в вашу PATH переменную среды

После этого вы можете приступить к запуску программного обеспечения (например, `python3 PC_Miner.py` или `py PC_Miner.py`).

<h3 align="center">Программное обеспечение, созданное сообществом</h3><br>

**Другие майнеры, работающие с Duino-Coin:**
*   [duino-coin-kodi](https://github.com/SandUhrGucker/duino-coin-kodi) - Майнинг аддон для медиацентра Kodi от SandUhrGucker
*   [MineCryptoOnWifiRouter](https://github.com/BastelPichi/MineCryptoOnWifiRouter) - Скрипт Python для майнинга Duino-Coin на маршрутизаторах от BastelPichi
*   [Duino-Coin_Android_Cluster Miner](https://github.com/DoctorEenot/DuinoCoin_android_cluster) - майнинг с меньшим количеством подключений на нескольких устройствах от DoctorEenot
*   [ESPython DUCO Miner](https://github.com/fabiopolancoe/ESPython-DUCO-Miner) - MicroPython майнер для плат ESP от fabiopolancoe
*   [DUCO Miner for Nintendo 3DS](https://github.com/BunkerInnovations/duco-3ds) - Python майнер для Nintendo 3DS от PhereloHD & HGEpro
*   [Dockerized DUCO Miner](https://github.com/Alicia426/Dockerized_DUCO_Miner_minimal) - Майнер в докере от Alicia426
*   [nonceMiner](https://github.com/colonelwatch/nonceMiner) - Самый быстрый из доступных майнер от colonelwatch
*   [NodeJS-DuinoCoin-Miner](https://github.com/DarkThinking/NodeJS-DuinoCoin-Miner/) - простой майнер NodeJS от DarkThinking
*   [d-cpuminer](https://github.com/phantom32-0/d-cpuminer) - майнер на чисто Си от phantom32 & revox
*   [Go Miner](https://github.com/yippiez/go-miner) от yippiez
*   [ducominer](https://github.com/its5Q/ducominer) от its5Q
*   [Список НЕ официальных майнеров](https://github.com/revoxhere/duino-coin/tree/master/Unofficial%20miners)
    *   [Julia Miner](https://github.com/revoxhere/duino-coin/blob/master/Unofficial%20miners/Julia_Miner.jl) от revox
    *   [Ruby Miner](https://github.com/revoxhere/duino-coin/blob/master/Unofficial%20miners/Ruby_Miner.rb) от revox
    *   [Minimal Python Miner (DUCO-S1)](https://github.com/revoxhere/duino-coin/blob/master/Unofficial%20miners/Minimal_PC_Miner.py) от revox
    *   [Minimal Python Miner (XXHASH)](https://github.com/revoxhere/duino-coin/blob/master/Unofficial%20miners/Minimal_PC_Miner_XXHASH.py) от revox
    *   [Teensy 4.1 code for Arduino IDE](https://github.com/revoxhere/duino-coin/blob/master/Unofficial%20miners/Teensy_code/Teensy_code.ino) от joaquinbvw
<!--*   [Multithreaded Python Miner](https://github.com/revoxhere/duino-coin/blob/master/Unofficial%20miners/Multithreaded_PC_Miner.py) от Bilaboz (НЕ ПОДДЕРЖИВАЕТСЯ) -->

**Другие инструменты:**
*   [DuinoCoinI2C](https://github.com/ricaun/DuinoCoinI2C) -  ESP8266 в качестве мастера для рига ардуин по I2C от ricaun
*   [Duino-Coin Панель мониторинга майнинга](https://lulaschkas.github.io/duco-mining-dashboard/) и помощник по устранению неполадок от Lulaschkas
*   [duco-miners](https://github.com/dansinclair25/duco-miners) Панель CLI майнинга от dansinclair25
*   [Duco-Coin Symbol Icon ttf](https://github.com/SandUhrGucker/Duco-Coin-Symbol-Icon-ttf-.h) от SandUhrGucker
*   [DUCO расширение для Chrome](https://github.com/LDarki/DucoExtension) для Chrome и производных от LDarki
*   [DUCO Monitor](https://siunus.github.io/duco-monitor/) сайт статистики от siunus
*   [duino-tools](https://github.com/kyngs/duino-tools) написанные на Java от kyngs
*   [Duino Stats](https://github.com/Bilaboz/duino-stats) официальный бот Discord от Bilaboz
<!--*   [Duino-Coin Auto Updater](https://github.com/Bilaboz/duino-coin-auto-updater) от Bilaboz (НЕ ПОДДЕРЖИВАЕТСЯ) -->

Этот список будет активно обновляться. Если вы хотите добавить программное обеспечение в этот список, отправьте ПулРеквест или свяжитесь с одним из разработчиков.

<h3 align="center">Учебник wDUCO</h3><br>

Duino-Coin - это гибридная валюта. Оэто означает, что она может быть конвертирована в wDUCO, "DUCO wrapped" это DUCO обурнутый сетью [Tron](https://tron.network) . В настоящее время для него не так много применений, кроме простого хранения средств во внешнем кошельке или обмена wDUCO на другой токен на JustSwap. Учебник по использованию wDUCO доступен в [wDUCO wiki](https://github.com/revoxhere/duino-coin/wiki/wDUCO-tutorial).
<h2 align="center">Развитие</h2><br>

Вклад в развитие - это то, что делает сообщество с открытым исходным кодом таким удивительным местом для обучения, вдохновения и творчества.
Мы высоко ценим любой вклад, который вы вносите в проект Duino-Coin.

Как помочь?

* Сделайте форк проекта
* Создайте свою ветвь
* Зафиксируйте свои изменения
* Убедитесь, что все работает так, как задумано
* Сделайте pull request


Исходный код сервера, документация для вызовов API и официальные библиотеки для разработки собственных приложений для Duino-Coin доступны в разделе [полезные инструменты](https://github.com/revoxhere/duino-coin/tree/useful-tools) .
<h2 align="center">Некоторые из официально протестированных устройств (DUCO-S1)</h2><br>

| Устройство/CPU/SBC/MCU/чип                                   | Средний хэшрейт<br>(все потоки) | Майнинг<br>потоков | Потребляемая<br>мощность | Среднее<br>DUCO/день|
|-----------------------------------------------------------|-----------------------------------|-------------------|----------------|---------------------|
| Arduino Pro Mini, Uno, Nano etc.<br>(Atmega 328p/pb/16u2) | 170 H/s                           | 1                 | 0.2 W          | 7-8                 |
| Teensy 4.1                                                | 12.8 kH/s                         | 1                 | -              | -                   |
| NodeMCU, Wemos D1 etc.<br>(ESP8266)                       | 9.3 kH/s                          | 1                 | 0.6 W          | 6-8                 |
| ESP32                                                     | 23 kH/s                           | 2                 | 1 W            | 8-9                 |
| Raspberry Pi Zero                                         | 17 kH/s                           | 1                 | 0.7 W          | -                   |
| Raspberry Pi 3                                            | 440 kH/s                          | 4                 | 5.1 W          | -                   |
| Raspberry Pi 4                                            | 1.3 MH/s                          | 4                 | 6.4 W          | -                   |
| Atomic Pi                                                 | 690 kH/s                          | 4                 | 6 W            | -                   |
| Orange Pi Zero 2                                          | 740 kH/s                          | 4                 | 2.55 W         | -                   |
| Khadas Vim 2 Pro                                          | 1.12 MH/s                         | 8                 | 6.2 W          | -                   |
| Libre Computers Tritium H5CC                              | 480 kH/s                          | 4                 | 5 W            | -                   |
| Libre Computers Le Potato                                 | 410 kH/s                          | 4                 | 5 W            | -                   |
| Pine64 ROCK64                                             | 640 kH/s                          | 4                 | 5 W            | -                   |
| Intel Celeron G1840                                       | 1.25 MH/s                         | 2                 | -              | 5-6                 |
| Intel Core i5-2430M                                       | 1.18 MH/s                         | 4                 | -              | 6.5                 |
| Intel Core i5-3230M                                       | 1.52 MH/s                         | 4                 | -              | 7.2                 |
| Intel Core i5-5350U                                       | 1.35 MH/s                         | 4                 | -              | 6.0                 |
| Intel Core i5-7200U                                       | 1.62 MH/s                         | 4                 | -              | 7.5                 |
| Intel Core i5-8300H                                       | 3.67 MH/s                         | 8                 | -              | 9.1                 |   
| Intel Core i3-4130                                        | 1.45 MH/s                         | 4                 | -              | -                   |


<h2 align="center">Лицензия</h2><br>

Duino-Coin в основном распространяется по лицензии MIT. Дополнительные сведения см. в файле "LICENSE".
Некоторые сторонние включенные файлы могут иметь разные лицензии - пожалуйста, проверьте их "ЛИЦЕНЗИОННЫЕ" заявления (обычно в верхней части файлов исходного кода).

<h2 align="center">Условия обслуживания</h2><br>
1. Duino-Монеты ("DUCOs") зарабатываются майнерами с помощью процесса, называемого майнингом.<br>
2. Майнинг описывается как использование алгоритма DUCO-S1 (описано в <a href="https://github.com/revoxhere/duino-coin/blob/gh-pages/assets/whitepaper.pdf">Duino-Coin Whitepaper</a>), в котором поиск правильного результата математической задачи дает майнеру вознаграждение.<br>
3. Майнинг может быть официально выполнен с использованием процессоров, плат AVR (например, плат Arduino), одноплатных компьютеров (например, плат Raspberry Pi), плат ESP32/8266 с использованием официальных майнеров (другие официально разрешенные майнеры описаны в верхней части README).<br>
4. Майнинг на графических процессорах, ПЛИС и других высокоэффективных аппаратных средствах разрешен, но с использованием только "ЭКСТРЕМАЛЬНОЙ" сложности майнинга.<br>
5. Любые пользователи, использующие майнеры на уровне сложности, не подходящем для их оборудования (см. <a href="https://github.com/revoxhere/duino-coin/tree/useful-tools#socket-api">список сложности</a>) будет автоматически удален и/или заблокирован.<br>
6. Любые пользователи, замеченные в использовании неподходящего и/или "Оверклокнутого" оборудования, будут заблокированы вручную или автоматически в сети без предварительного уведомления.<br>
7. Запрет включает в себя блокировку доступа пользователя к его монетам вместе с удалением учетной записи.<br>
8. Только монеты, заработанные легально, имеют право на обмен.<br>
9. Пользователи, замеченные в злоупотреблении VPN (или аналогичных) с намерениями например обхода ограничений, могут быть удалены без предварительного уведомления.<br>
10. Множественные учетные записи, используемых для обхода ограничений, могут быть заблокированы без предварительного уведомления.<br>
11. Счета могут быть временно приостановлены для проведения расследования нарушения данных правил ("нарушение" или "злоупотребление").<br>
12. Запрос на обмен, направленный на официальную биржу DUCO ("официальная биржа"), может быть отложен и/или отклонен в ходе рассмотрения. <br>
13. Запросы на обмен, поданные на официальную биржу, могут быть отклонены из-за нарушений данных правил и/или низкого финансирования.<br>
14. DUCOs пользователя могут быть удалены, если нарушение будет доказано.<br/>
15. Настоящие условия предоставления услуг могут быть изменены в любое время без предварительного уведомления.<br>
16. Каждый пользователь, использующий Duino-Coin, соглашается соблюдать вышеуказанные правила.<br>

<h4 align="center">Политика конфиденциальности</h2><br>
1. На главном сервере мы храним только имена пользователей, хэшированные пароли (с помощью bcrypt) и электронные письма пользователей в качестве данных их учетных записей.<br>
2. Электронные письма не являются общедоступными и используются только для связи с пользователем, когда это необходимо, подтверждая обмен на <a href="https://revoxhere.github.io/duco-exchange/">DUCO-Обмен</a> и получения другой информации (планируется на будущее).<br>
3. Балансы, транзакции и данные, связанные с майнингом, находятся в открытом доступе <a href="https://github.com/revoxhere/duino-coin/tree/useful-tools#http-json-api">API JSON</a>.<br>
4. Политика конфиденциальности может быть изменена в будущем с предварительным уведомлением.<br>
 
<h2 align="center">Разработчики</h2><br>

*   **Разработчики:**
    *   [@revox](https://github.com/revoxhere/) (Founder/lead dev) - robik123.345@gmail.com
    *   [@Bilaboz](https://github.com/bilaboz/) (Lead dev)
    *   [@connorhess](https://github.com/connorhess) (Lead dev)
    *   [@JoyBed](https://github.com/JoyBed) (Lead dev)
    *   [@HGEcode](https://github.com/HGEcode) (Dev)
    *   [@LDarki](https://github.com/LDarki) (Web dev)
    *   [@travelmode](https://github.com/colonelwatch) (Dev)
    *   [@ygboucherk](https://github.com/ygboucherk) ([wDUCO](https://github.com/ygboucherk/wrapped-duino-coin-v2) dev)
    *   [@Tech1k](https://github.com/Tech1k/) - kristian@beyondcoin.io (Webmaster)
    *   [@EinWildesPanda](https://github.com/EinWildesPanda) (Dev)

*   **Помошники:**
    *   [@5Q](https://github.com/its5Q)
    *   [@kyngs](https://github.com/kyngs)
    *   [@httsmvkcom](https://github.com/httsmvkcom)
    *   [@Nosh-Ware](https://github.com/Nosh-Ware)
    *   [@BastelPichi](https://github.com/BastelPichi)
    *   [@suifengtec](https://github.com/suifengtec)
    *   Thanks to [@Furim](https://github.com/Furim) for help in the early development stage
    *   Thanks to [@ATAR4XY](https://www.youtube.com/channel/UC-gf5ejhDuAc_LMxvugPXbg) for designing early logos
    *   Thanks to [@Tech1k](https://github.com/Tech1k) for [Beyondcoin](https://beyondcoin.io) partnership and providing [duinocoin.com](https://duinocoin.com) domain
    *   Thanks to [@MrKris7100](https://github.com/MrKris7100) for help with implementing SHA1 algorithm
    *   Thanks to [@daknuett](https://github.com/daknuett) for help with Arduino SHA1 library

<hr>

Ссылка на проект: [https://github.com/revoxhere/duino-coin/](https://github.com/revoxhere/duino-coin/)
