let versionReceived = false;
let loggedIn = false;
let balance = 0;
let curr_bal = 0;
let profitcheck = 0;
let ducoUsdPrice = 0.0065;
let sending = false;
let daily_average = [];
window.addEventListener('load', function() {
    document.getElementById("loginstatus").innerHTML = "";

    // RANDOM BACKGROUND
    document.body.background = 'https://lorempixel.com/1920/1080/';

    // THEME SWITCHER
    let themesel = document.getElementById('themesel');
    themesel.addEventListener('input', updateValue);

    function updateValue(e) {
        let theme = e.target.value;
        let dark = $('#dark');
        let radiate = $('#radiate');
        let alt = $('#alt');
        let crisp = $('#crisp');
        let material = $('#material');
        switch (theme) {
            case 'dark':
                dark.attr('disabled', false);
                radiate.attr('disabled', true);
                alt.attr('disabled', true);
                crisp.attr('disabled', true);
                material.attr('disabled', true);
                break;
            case 'radiance':
                dark.attr('disabled', true);
                radiate.attr('disabled', false);
                alt.attr('disabled', true);
                crisp.attr('disabled', true);
                material.attr('disabled', true);
                break;
            case 'altlight':
                dark.attr('disabled', true);
                radiate.attr('disabled', true);
                alt.attr('disabled', false);
                crisp.attr('disabled', true);
                material.attr('disabled', true);
                break;
            case 'light':
                dark.attr('disabled', true);
                radiate.attr('disabled', true);
                alt.attr('disabled', true);
                crisp.attr('disabled', true);
                material.attr('disabled', true);
                break;
            case 'crisp':
                dark.attr('disabled', true);
                radiate.attr('disabled', true);
                alt.attr('disabled', true);
                crisp.attr('disabled', false);
                material.attr('disabled', true);
                break;
            case 'material':
            default:
                dark.attr('disabled', true);
                radiate.attr('disabled', true);
                alt.attr('disabled', true);
                crisp.attr('disabled', true);
                material.attr('disabled', false);
                break;
        }
    }


    // PRICE FROM API
    const GetData = () => {
        $.getJSON('https://server.duinocoin.com/statistics', function(data) {
            ducoUsdPrice = data["Duco price"];
            document.getElementById("ducousd")
                .innerHTML = "$" + (ducoUsdPrice).toFixed(4);
        });
    };

    // HASHRATE PREFIX CALCULATOR
    let totalHashes = 0;
    const calculateHashrate = (hashes) => {
        hashes = parseFloat(hashes);
        let hashrate = hashes.toFixed(2) + " H/s";

        if (hashes / 1000 > 0.5) hashrate = (hashes / 1000).toFixed(2) + " kH/s";
        if (hashes / 1000000 > 0.5)
            hashrate = (hashes / 1000000).toFixed(2) + " MH/s";
        if (hashes / 1000000000 > 0.5)
            hashrate = (hashes / 1000000000).toFixed(2) + " GH/s";

        return hashrate;
    };

    //USER DATA FROM API
    const UserData = (username) => {
        $.getJSON('https://server.duinocoin.com/users/' + username, function(data) {
            balance = parseFloat(data.result.balance.balance);
            let balanceusd = balance * ducoUsdPrice;
            //console.log("Balance received: " + balance + "($" + balanceusd + ")");

            let balance_list = balance.toFixed(8).split(".")
            let balance_before_dot = balance_list[0]
            let balance_after_dot = balance_list[1]

            document.getElementById("balance")
                .innerHTML = balance_before_dot +
                "<span class='has-text-weight-normal'>." +
                balance_after_dot + " ᕲ";

            let balanceusd_list = balanceusd.toFixed(4).split(".")
            let balanceusd_before_dot = balanceusd_list[0]
            let balanceusd_after_dot = balanceusd_list[1]

            document.getElementById("balanceusd")
                .innerHTML = "<span class='has-text-weight-normal'>≈ $</span>" + balanceusd_before_dot +
                "." +
                balanceusd_after_dot;

            let jsonD = data.result.transactions.reverse();

            const transtable = document.getElementById("transactions");
            //console.log("Transaction list received");
            if (jsonD.length > 0) {
                let transactions = "";
                for (let i in jsonD) {
                    let classD = "has-text-success-dark";
                    let symbolD = "+";
                    if (jsonD[i].sender == username) {
                        classD = "has-text-danger";
                        symbolD = "-";
                    }
                    transactions +=
                        `<tr><td data-label="Date" class="subtitle is-size-6 has-text-grey">${jsonD[i].datetime.substr(0, jsonD[i].datetime.length - 14)}</td>` +
                        `<td data-label="Amount" class="subtitle is-size-6  ${classD}"> ${symbolD} ${jsonD[i].amount.toFixed(2)} ᕲ</td>` +
                        `<td data-label="Sender" class="subtitle is-size-6">${jsonD[i].sender}</td>` +
                        `<td data-label="Recipient" class="subtitle is-size-6">${jsonD[i].recipient}</td>` +
                        `<td data-label="Hash">` +
                        `<a class="subtitle is-size-6" target='_blank' style="color:#8e44ad" href="https://explorer.duinocoin.com/?search=${jsonD[i].hash}">` +
                        `${jsonD[i].hash.substr(jsonD[i].hash.length - 5)}</a>` +
                        `<td data-label="Message" class="subtitle is-size-6 has-text-grey">${jsonD[i].memo}</td></tr>`;
                    if (i >= 10) break
                }
                transtable.innerHTML = transactions;
            } else transtable.innerHTML = `<tr><td data-label="Date">No transactions yet</td></tr>`;

            let myMiners = data.result.miners;
            //console.log("Miner data received");
            let miners = document.getElementById("miners");
            miners.innerHTML = "";
            let minerHashrate = document.getElementById("minerHR");
            let minerId = '';
            let diffString = '';
            if (myMiners.length > 0) {
                for (let miner in myMiners) {
                    if (myMiners[miner]["identifier"] === "None")
                        minerId = "";
                    else
                        minerId = myMiners[miner]["identifier"];

                    if (myMiners[miner]["diff"] >= 1000000000)
                        diffString = Math.round(myMiners[miner]["diff"] / 1000000000) + "G";
                    else if (myMiners[miner]["diff"] >= 1000000)
                        diffString = Math.round(myMiners[miner]["diff"] / 1000000) + "M";
                    else if (myMiners[miner]["diff"] >= 1000)
                        diffString = Math.round(myMiners[miner]["diff"] / 1000) + "k";
                    else
                        diffString = myMiners[miner]["diff"];

                    if (minerId !== '') {
                        miners.innerHTML +=
                            "<b class='has-text-grey-light'>#" +
                            miner +
                            ":</b><b class='has-text-primary'> " +
                            minerId +
                            "</b> (" +
                            myMiners[miner]["software"] +
                            ") <b><span class='has-text-success'>" +
                            calculateHashrate(myMiners[miner]["hashrate"]) +
                            "</b></span><span class='has-text-info'> @ diff " +
                            diffString +
                            "</span>, " +
                            myMiners[miner]["accepted"] +
                            "/" +
                            (myMiners[miner]["accepted"] + myMiners[miner]["rejected"]) +
                            " <b class='has-text-success-dark'>(" +
                            Math.round(
                                (myMiners[miner]["accepted"] /
                                    (myMiners[miner]["accepted"] + myMiners[miner]["rejected"])) *
                                100
                            ) +
                            "%)</b><br>";
                    } else {
                        miners.innerHTML +=
                            "<b class='has-text-grey-light'>#" +
                            miner +
                            ":</b> " +
                            myMiners[miner]["software"] +
                            " <b><span class='has-text-success'>" +
                            calculateHashrate(myMiners[miner]["hashrate"]) +
                            "</b></span><span class='has-text-info'> @ diff " +
                            diffString +
                            "</span>, " +
                            myMiners[miner]["accepted"] +
                            "/" +
                            (myMiners[miner]["accepted"] + myMiners[miner]["rejected"]) +
                            " <b class='has-text-success-dark'>(" +
                            Math.round(
                                (myMiners[miner]["accepted"] /
                                    (myMiners[miner]["accepted"] + myMiners[miner]["rejected"])) *
                                100
                            ) +
                            "%)</b><br>";
                    }
                    totalHashes = totalHashes + myMiners[miner]["hashrate"];
                }
                minerHashrate.innerHTML = calculateHashrate(totalHashes);
                totalHashes = 0;
            } else {
                miners.innerHTML = "<b class='subtitle is-size-6'>No miners detected</b>" +
                    "<p class=' subtitle is-size-6 has-text-grey'>If you have turned them on recently, it will take a minute or two until their stats will appear here.</p>";
            }
        });
    }

    // PROFIT CALCULATOR
    const ProfitCalculator = () => {
        let prev_bal = curr_bal;
        curr_bal = balance;
        let daily = (((curr_bal - prev_bal) * 12) * 60) * 24;
        profitcheck++;
        let avgusd;
        let avg_list;
        let avg_before_dot;
        let avg_after_dot;
        let avgusd_list;
        let avgusd_before_dot;
        let avgusd_after_dot;
        if ((curr_bal - prev_bal) > 0 && profitcheck > 1) {
            // High daily profit means a transaction or big block - that value should be ignored
            if (daily < 500) {
                // Get the average from profit calculations to not make it fluctuate as much
                daily_average.push(daily);
                let sum = daily_average.reduce((a, b) => a + b, 0);
                let avg = (sum / daily_average.length) || 0;
                avgusd = avg * ducoUsdPrice;
                //console.log("Estimated profit sum: " + sum + ", average: " + avg);

                avg_list = avg.toFixed(2).split(".")
                avg_before_dot = avg_list[0]
                avg_after_dot = avg_list[1]


                document.getElementById("estimatedprofit")
                    .innerHTML = avg_before_dot +
                    "<span class='has-text-weight-normal'>." +
                    avg_after_dot + " ᕲ";

                avgusd_list = avgusd.toFixed(2).split(".")
                avgusd_before_dot = avgusd_list[0]
                avgusd_after_dot = avgusd_list[1]

                document.getElementById("estimatedprofitusd")
                    .innerHTML = "<span class='has-text-weight-normal'>≈ $</span>" + avgusd_before_dot +
                    "." +
                    avgusd_after_dot;
            }
        }
    };

    // ENTER KEY AS LOGIN
    let input_login = document.getElementById("login");
    input_login.addEventListener("keyup", function(event) {
        if (event.keyCode === 13) {
            event.preventDefault();
            document.getElementById("loginbutton").click();
        }
    });

    // MAIN WALLET SCRIPT
    document.getElementById('loginbutton').onclick = function() {
        document.getElementById("loginstatus")
            .innerHTML = "Connecting...";
        document.getElementById("loginbutton").classList.add("is-loading");

        let username = document.getElementById('usernameinput').value
        let password = document.getElementById('passwordinput').value

        if (username != null &&
            username !== "" &&
            username !== undefined &&
            password != null &&
            password !== "" &&
            password !== undefined) {
            let socket = new WebSocket("wss://server.duinocoin.com:15808", null, 15000, 5);

            document.getElementById('send').onclick = function() {
                document.getElementById("sendinginfo")
                    .innerHTML = "Requesting transfer..."
                document.getElementById("send").classList.add("is-loading");
                let recipient = document.getElementById('recipientinput').value
                let amount = document.getElementById('amountinput').value
                let memo = document.getElementById('memoinput').value
                if (recipient != null &&
                    recipient !== "" &&
                    recipient !== undefined &&
                    amount != null &&
                    amount !== "" &&
                    amount !== undefined) {
                    sending = true;

                    socket.send("SEND," + memo + "," + recipient + "," + amount + ",");
                    document.getElementById("sendinginfo").innerHTML = "Confirming transaction..."
                } else {
                    document.getElementById("sendinginfo")
                        .innerHTML = "<span class='subtitle is-size-7 mb-2 has-text-danger'><b>Fill in the blanks first</b></span>"
                    document.getElementById("send").classList.remove("is-loading");
                    sending = false;
                    setTimeout(() => {
                        document.getElementById("sendinginfo")
                            .innerHTML = "";
                    }, 5000);
                }
            }

            socket.onclose = function(event) {
                console.error("Error Code: " + event.code);
                let dataErr = "Unknown";

                if(event.code == 1000)
                {
                    console.error("[Error] WS: Normal closure");
                    dataErr = "Normal Closure";
                }
                else if(event.code == 1001 || event.code == 1002)
                {
                    console.error("[Error] WS: Server problem.");
                    dataErr = "Server Problem";
                }
                else if(event.code == 1005)
                {
                    console.error("[Error] WS: No status code was actually present");
                    dataErr = "No status code";
                }
                else if(event.code == 1006)
                {
                    console.error("[Error] WS: The connection was closed abnormally");
                    dataErr = "Abnormally closed";
                }
                else if(event.code == 1015)
                {
                    console.error("[Error] WS: The connection was closed due to a failure to perform a TLS handshake");
                    dataErr = "TLS handshake";
                }
                else
                    console.error("[Error] WS: Unknown reason");

                let modal_error = document.querySelector('#modal_error');
                document.querySelector('#modal_error .modal-card-body .content p').innerHTML =
                    'An error has occurred, ask for help on the discord with this code: <br><b>' + event.code + ' (' + dataErr + ')</b></p>';
                document.querySelector('html').classList.add('is-clipped');
                modal_error.classList.add('is-active');

                document.querySelector('#modal_error .delete').onclick = function() {
                    document.querySelector('html').classList.remove('is-clipped');
                    modal_error.classList.remove('is-active');
                }
            }

            socket.onmessage = function(msg) {
                serverMessage = msg.data;

                if (loggedIn == false &&
                    versionReceived == false &&
                    serverMessage.includes("2.")) {
                    //console.log("Version received: " + serverMessage);
                    versionReceived = true;
                }
                if (loggedIn == false &&
                    versionReceived) {
                    document.getElementById("loginstatus")
                        .innerHTML = "Authenticating...";
                    socket.send("LOGI," + username + "," + password + ",");
                }
                if (loggedIn == false &&
                    versionReceived &&
                    serverMessage.includes("OK")) {
                    //console.log("User logged-in");

                    document.getElementById("loginstatus")
                        .innerHTML = "Logged in!";
                    document.getElementById("loginbutton").classList.remove("is-loading");
                    document.getElementById("wallettext")
                        .innerHTML = "<span id='username' class='has-text-weight-light'><b>" + username + "</b>";
                    const transtable = document.getElementById("transactions");
                    transtable.innerHTML = `<tr><td data-label="Date">Please wait...</td></tr>`;

                    $("#login").hide('fast', function() {
                        $("#panel").show('normal', function() {
                            window.setInterval(() => {
                                UserData(username);
                            }, 12500);

                            window.setInterval(() => {
                                ProfitCalculator();
                            }, 7510);

                            GetData();
                            window.setInterval(() => {
                                GetData();
                            }, 30000);

                            loggedIn = true;
                        });
                    });
                }
                if (loggedIn == false &&
                    versionReceived &&
                    serverMessage.includes("NO")) {
                    document.getElementById("loginstatus")
                        .innerHTML = "<span class='has-text-danger'>" + serverMessage + "</span>";
                    document.getElementById("loginbutton").classList.remove("is-loading");
                    setTimeout(() => {
                        document.getElementById("loginstatus")
                            .innerHTML = ""
                    }, 5000);
                }
                if (sending == true) {
                    serverMessage = serverMessage.split(",");
                    if (serverMessage[0].includes("OK")) {
                        document.getElementById("sendinginfo")
                            .innerHTML = "<span class='subtitle is-size-7 mb-2 has-text-success'><b>" +
                            serverMessage[1] +
                            "</b></span> TXID: <a href='https://explorer.duinocoin.com?search=" +
                            serverMessage[2] + "' target='_blank'>" +
                            serverMessage[2] +
                            "</a>";
                    } else if (serverMessage[0].includes("NO")) {
                        document.getElementById("sendinginfo")
                            .innerHTML = "<span class='subtitle is-size-7 mb-2 has-text-danger'><b>" + serverMessage[1] + "</b></span>";
                    } else {
                        document.getElementById("sendinginfo")
                            .innerHTML = "<span class='subtitle is-size-7 mb-2 has-text-warning-dark'><b>Error sending request, please try again</b></span>";
                    }
                    document.getElementById("send").classList.remove("is-loading");
                    setTimeout(() => {
                        sending = false;
                        document.getElementById("sendinginfo")
                            .innerHTML = "";
                    }, 5000);
                }
            }
        } else {
            document.getElementById("loginstatus")
                .innerHTML = "<span class='has-text-danger'>Fill in the blanks first</span>";
            document.getElementById("loginbutton").classList.remove("is-loading");
            setTimeout(() => {
                document.getElementById("loginstatus")
                    .innerHTML = ""
            }, 5000);
        }
    }

    // Footer
    document.getElementById("pageloader").setAttribute('class', "pageloader is-primary is-left-to-right"); // After page is loaded

    /*let multiplier = document.getElementById('multiplier');
    let inputHashrate = document.getElementById('input-hashrate');
    let log = document.getElementById('values');

    multiplier.addEventListener('input', updateValueHashrate);
    inputHashrate.addEventListener('input', updateValueHashrate);

    function floatmap(x, in_min, in_max, out_min, out_max) {
        return (x - in_min) * (out_max - out_min) / (in_max - in_min) + out_min
    }

    function updateValueHashrate(e) {
        hashrate = e.target.value * multiplier.value;

        /!* https://github.com/revoxhere/duino-coin#some-of-the-officially-tested-devices-duco-s1 *!/
        result = (0.0026 * hashrate) + 2.7
        if (hashrate > 8000) result = floatmap(result, 25, 1000, 25, 40); // extreme diff tier, TODO

        if (hashrate < 1) log.textContent = "0 ᕲ/day";
        if (hashrate < 1) log.textContent = "0 ᕲ/day";
        else log.textContent = result.toFixed(2) + " ᕲ/day";
    }

    let device = document.getElementById('device-type');
    let input_devices = document.getElementById('input-devices');
    let log_devices = document.getElementById('values-devices');

    device.addEventListener('input', updateValueDevices);
    input_devices.addEventListener('input', updateValueDevices);

    let basereward;
    function updateValueDevices(e) {
        if (device.value === 'AVR') basereward = 8
        if (device.value === 'ESP8266') basereward = 6
        if (device.value === 'ESP32') basereward = 7
        /!* https://github.com/revoxhere/duino-coin#some-of-the-officially-tested-devices-duco-s1 *!/
        let result = 0;
        for (i = 0; i < input_devices.value; i++) {
            result += basereward;
            basereward *= 0.96;
        }
        log_devices.textContent = result.toFixed(2) + " ᕲ/day";
    }*/

    // TABS
    let tabs = document.querySelectorAll('.tabs li');
    let tabsContent = document.querySelectorAll('.tab-content');

    let deactvateAllTabs = function () {
        tabs.forEach(function (tab) {
            tab.classList.remove('is-active');
        });
    };

    let hideTabsContent = function () {
        tabsContent.forEach(function (tabContent) {
            tabContent.classList.remove('is-active');
        });
    };

    let activateTabsContent = function (tab) {
        tabsContent[getIndex(tab)].classList.add('is-active');
    };

    let getIndex = function (el) {
        return [...el.parentElement.children].indexOf(el);
    };

    tabs.forEach(function (tab) {
        tab.addEventListener('click', function () {
            deactvateAllTabs();
            hideTabsContent();
            tab.classList.add('is-active');
            activateTabsContent(tab);
        });
    })
    tabs[0].click();


    // Network

    // EXPLORER
    let ducoUsdPrice = 0.0956;
    let url_string = window.location;
    let url = new URL(url_string);
    let hashToBeFound = url.searchParams.get("search");
    if (hashToBeFound) document.getElementById("transactionstext1").innerHTML = "Showing search results for: <strong><span class='gradienttext'>" + hashToBeFound + "</strong></span>";

    if (hashToBeFound) document.getElementById("transactionstext2").innerHTML = "Nothing was found for your query";

    function APIupdate() {
        $.getJSON('https://server.duinocoin.com/api.json', function(data) {
            // FILL THE STATISTICS SECTION FROM API
            ducoUsdPrice = data["Duco price"];
            document.getElementById("lastupdate").innerHTML = "(last update: " + data["Last update"] + ")";

            document.getElementById("hashrate").innerHTML = data["Pool hashrate"];
            document.getElementById("ducos1hashrate").innerHTML = data["DUCO-S1 hashrate"];
            document.getElementById("xxhashhashrate").innerHTML = data["XXHASH hashrate"];

            document.getElementById("registeredusers").innerHTML = data["Registered users"];
            document.getElementById("difficulty").innerHTML = data["Current difficulty"];
            document.getElementById("allmined").innerHTML = data["All-time mined DUCO"].toFixed(0) + " ᕲ";

            document.getElementById("price").innerHTML = ducoUsdPrice.toFixed(4);
            document.getElementById("watt_usage").innerHTML = data["Net energy usage"];
            document.getElementById("connections").innerHTML = data["Active connections"];
            document.getElementById("lastblockhash").innerHTML = data["Last block hash"];

            document.getElementById("serverver").innerHTML = "v" + data["Server version"];
            document.getElementById("cpu").innerHTML = Math.round(data["Server CPU usage"]) + "%"
            document.getElementById("ram").innerHTML = Math.round(data["Server RAM usage"]) + "% Threads: " + data["Open threads"];

            document.getElementById("arduinos").innerHTML = data["Miner distribution"]["Arduino"];
            document.getElementById("esp8266s").innerHTML = data["Miner distribution"]["ESP8266"];
            document.getElementById("esp32s").innerHTML = Math.round(data["Miner distribution"]["ESP32"] / 2);
            document.getElementById("rpis").innerHTML = Math.round(data["Miner distribution"]["RPi"] / 4);
            document.getElementById("cpus").innerHTML = Math.round(data["Miner distribution"]["CPU"] / 4);
            document.getElementById("gpus").innerHTML = data["Miner distribution"]["GPU"];
            document.getElementById("others").innerHTML = data["Miner distribution"]["Other"];


            // WORKER LIST
            let workers = "<ul align='left' class='grid-list workers is-size-6'>"
            let counter = 0;
            let worker_counter = 0;
            $.each(data["Active workers"], function(k, v) {
                if (v >= 32) {
                    if (counter % 2 == 0) workers = workers.concat(`<li>` + k + `<span class="tag" style="color:#eb2f06;">` + v + `</span></li>`);
                    else workers = workers.concat(`<li>` + k + `<span class="tag" style="color:#eb2f06;">` + v + `</span></li>`);
                } else if (v >= 24) {
                    if (counter % 2 == 0) workers = workers.concat(`<li>` + k + `<span class="tag" style="color:#f0932b;">` + v + `</span></li>`);
                    else workers = workers.concat(`<li>` + k + `<span class="tag" style="color:#f0932b;">` + v + `</span></li>`);
                } else if (v >= 16) {
                    if (counter % 2 == 0) workers = workers.concat(`<li>` + k + `<span class="tag" style="color:#feca57;">` + v + `</span></li>`);
                    else workers = workers.concat(`<li>` + k + `<span class="tag" style="color:#feca57;">` + v + `</span></li>`);
                } else if (v >= 8) {
                    if (counter % 2 == 0) workers = workers.concat(`<li>` + k + `<span class="tag" style="color:#2d3436;">` + v + `</span></li>`);
                    else workers = workers.concat(`<li>` + k + `<span class="tag" style="color:#2d3436;">` + v + `</span></li>`);
                } else {
                    if (counter % 2 == 0) workers = workers.concat(`<li>` + k + `<span class="tag" style="color:#10ac84;">` + v + `</span></li>`);
                    else workers = workers.concat(`<li>` + k + `<span class="tag" style="color:#10ac84;">` + v + `</span></li>`);
                }
                worker_counter += v;
                counter++;
            });
            workers = workers.concat("</ul>");
            document.getElementById("workers").innerHTML = workers;
            document.getElementById("allworkers").innerHTML = "(" + worker_counter + " miners on " + counter + " accounts)";
        });
    }

    function EXPLORERupdate() {
        $.getJSON('https://server.duinocoin.com/transactions', function(data) {
            document.getElementById("transactionstext3").innerHTML = "<strong>Last transactions:</strong><br>" +
                data.result[data.result.length - 1].hash.substring(0, 20) + "<br>" +
                data.result[data.result.length - 2].hash.substring(0, 20) + "<br>" +
                data.result[data.result.length - 3].hash.substring(0, 20) + "<br>" +
                data.result[data.result.length - 4].hash.substring(0, 20) + "<br>" +
                data.result[data.result.length - 5].hash.substring(0, 20);
        })
        $.getJSON('https://server.duinocoin.com/foundBlocks.json', function(data) {
            let last = [];
            for (hash in data) last.push(hash);

            document.getElementById("transactionstext4").innerHTML = "<strong>Last blocks:</strong><br>" +
                last[last.length - 1].substring(0, 20) + "<br>" +
                last[last.length - 2].substring(0, 20) + "<br>" +
                last[last.length - 3].substring(0, 20) + "<br>" +
                last[last.length - 4].substring(0, 20) + "<br>" +
                last[last.length - 5].substring(0, 20);
        })
    }

    function search() {
        let cont = true;
        if (cont) {
            try {
                $.getJSON('https://server.duinocoin.com/transactions/' + hashToBeFound, function(data) {

                    if (data.success == true) {
                        cont = false;

                        let amountInUsd = data.result.amount.toFixed(4) * ducoUsdPrice;

                        document.getElementById("transactionstext2").innerHTML =
                            "<ul><li><i class='fas fa-fw fa-info-circle' style='color:#27ae60'></i>&nbsp;Type: transaction</li>" +
                            "<li><i class='fas fa-fw fa-clock' style='color:#2980b9'></i>&nbsp;Timestamp: <b>" + data.result.datetime + "</b> (UTC)</li>" +
                            "<li><i class='fas fa-fw fa-user-tie' style='color:#8e44ad'></i>&nbsp;Sender's username: <b>" + data.result.sender + "</b></li>" +
                            "<li><i class='fas fa-fw fa-user' style='color:#e74c3c'></i>&nbsp;Recipient's username: <b>" + data.result.recipient + "</b></li>" +
                            "<li><i class='fas fa-fw fa-receipt' style='color:#27ae60'></i>&nbsp;Transfered amount: <b>" + data.result.amount.toFixed(4) + " DUCO</b> (≈" + amountInUsd.toFixed(4) + " USD)</li>" +
                            "<li><i class='fas fa-envelope' style='color:#f39c12'></i>&nbsp;&nbsp;Message: <b>" + data.result.memo + "</b></li></ul>";
                    } else {
                        document.getElementById("transactionstext2").innerHTML = "No transaction found";
                    }
                });
            } catch (e) {
                //console.log(e);
            }
        }

        if (cont) {
            try {
                $.getJSON('https://server.duinocoin.com/balances/' + hashToBeFound, function(data) {
                    if (data.success == true) {
                        cont = false;

                        let amountInUsd = data.result.balance * ducoUsdPrice;

                        document.getElementById("transactionstext2").innerHTML =
                            "<ul><li><i class='fas fa-fw fa-info-circle' style='color:#27ae60'></i>&nbsp;Type: wallet</li>" +
                            "<li><i class='fas fa-fw fa-user-tie' style='color:#e74c3c'></i>&nbsp;Username: <b>" + hashToBeFound + "</b></li>" +
                            "<li><i class='fas fa-fw fa-receipt' style='color:#2980b9'></i>&nbsp;Balance: <b>" + data.result.balance + "</b> (≈" + amountInUsd.toFixed(4) + " USD)</li></ul>";
                    } else {
                        document.getElementById("transactionstext2").innerHTML = "No user found";
                    }
                });
            } catch (e) {
                //console.log(e);
            }
        }

        if (cont) {
            try {
                $.getJSON('https://server.duinocoin.com/foundBlocks.json', function(data) {
                    let found = data[hashToBeFound]
                    if (hashToBeFound != "" && found != "" && found != undefined) {
                        cont = false;

                        let amountInUsd = found["Amount generated"].toFixed(4) * ducoUsdPrice;
                        document.getElementById("transactionstext2").innerHTML =
                            "<ul><li><i class='fas fa-fw fa-info-circle' style='color:#27ae60'></i>&nbsp;Type: block</li>" +
                            "<li><i class='fas fa-fw fa-clock' style='color:#3498db'></i>&nbsp;Block generation timestamp: <b>" + found["Date"] + " " + found["Time"] + "</b> (UTC)</li>" +
                            "<li><i class='fas fa-fw fa-user-tie' style='color:#ee5253'></i>&nbsp;Finder's username: <b>" + found["Finder"] + "</b></li>" +
                            "<li><i class='fas fa-fw fa-receipt' style='color:#ff9f43'></i>&nbsp;Generated amount: <b>" + found["Amount generated"].toFixed(4) + " DUCO</b> (≈" + amountInUsd.toFixed(4) + " USD)</li></ul>";
                    }
                });
            } catch (e) {
                //console.log(e);
            }
        } else if (cont) {
            document.getElementById("transactionstext1").innerHTML = "No data was found for: <strong><br><strong><span class='gradienttext monospace'>" + hashToBeFound + "</strong></span>";
            document.getElementById("transactionstext2").innerHTML = "";
        }
    }

    APIupdate();
    window.setInterval(APIupdate, 2500); // Refresh statistics every 2.5s

    EXPLORERupdate();
    window.setInterval(EXPLORERupdate, 5000); // Refresh statistics every 5s

    if (hashToBeFound) search();


});