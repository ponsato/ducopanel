window.addEventListener('load', function() {
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
    document.addEventListener('DOMContentLoaded', () => { // HAMBURGER MENU
        const $navbarBurgers = Array.prototype.slice.call(document.querySelectorAll('.navbar-burger'), 0);
        if ($navbarBurgers.length > 0) {
            $navbarBurgers.forEach(el => { // Add a click event on each of burger menus
                el.addEventListener('click', () => {
                    const target = el.dataset.target; // Get the target from the "data-target" attribute
                    const $target = document.getElementById(target);
                    el.classList.toggle('is-active'); // Toggle the "is-active" class on both the "navbar-burger" and the "navbar-menu"
                    $target.classList.toggle('is-active');
                });
            });
        }
    });

    // EXPLORER
    let duco_price = 0.00045;
    let load_workers = false;
    let url_string = window.location;
    let url = new URL(url_string);
    let to_search = document.getElementById('forUsername').innerText;

    function change_tags(data, type) {
        $("meta[name='title']").attr(`${type}: ${data} - browse the official Duino-Coin explorer`);
        $("meta[name='og:title']").attr(`${type}: ${data} - browse the official Duino-Coin explorer`);
        $("meta[name='twitter:title']").attr(`${type}: ${data} - browse the official Duino-Coin explorer`);

        $("meta[name='description']").attr(`View details of ${type}: ${data} in the official Duino-Coin chain explorer.`);
        $("meta[name='og:description']").attr(`View details of ${type}: ${data} in the official Duino-Coin chain explorer.`);
        $("meta[name='twitter:description']").attr(`View details of ${type}: ${data} in the official Duino-Coin chain explorer.`);
    }

    function update_element(element, value, animate = false) {
        if (animate) {
            $(`#${element}`).fadeOut(300);
            $(`#${element}`).html(value).fadeIn(300);
        } else {
            $(`#${element}`).html(value);
        }
    }


    function round_to(precision, value) {
        power_of_ten = 10 ** precision;
        return Math.round(value * power_of_ten) / power_of_ten;
    }

    $('#loadworkers').on('click', fill_worker_list());

    function fill_worker_list() {
        $("#loadworkers").addClass("is-loading")
        fetch("https://server.duinocoin.com/statistics_miners")
            .catch(function(error) {
                console.log(error);
            })
            .then(response => response.json())
            .then(data => {
                data = data.result;
                let workers = `<ul class="workers">`
                let counter = 0;
                let worker_counter = 0;
                let sorted_workers = [];
                for (worker in data) {
                    sorted_workers.push({
                        "User": worker,
                        "Verified": data[worker]["v"],
                        "Miners": data[worker]["w"]
                    })
                }
                sorted_workers.sort((a, b) => b.Miners - a.Miners);
                for (let i = 0; i < sorted_workers.length; i++) {
                    let worker = sorted_workers[i];

                    if (worker.Verified == "yes") {
                        workers +=
                            `<li>
                                  <a class="has-text-success" onclick="link_search('${worker.User}')">` +
                            worker.User +
                            `</a><b class="tag">` +
                            worker.Miners +
                            `</b></li>`;
                    } else {
                        workers +=
                            `<li>
                                  <i></i>
                                  <a class="has-text-danger onclick="link_search('${worker.User}')">` +
                            worker.User +
                            `</a>
                        <b class="tag">` +
                            worker.Miners +
                            `</b></li>`;
                    }

                    worker_counter += worker.Miners;
                    counter++;
                }
                workers += `</ul>`;
                document.getElementById("workers").innerHTML = workers;
                $("#allworkers").text("(" + worker_counter + " workers on " + counter + " accounts)");
            });
    }


    const scientific_prefix = (value) => {
        value = parseFloat(value);
        if (value / 1000000 > 0.5)
            value = round_to(4, value / 1000000) + " M";
        else if (value / 1000 > 0.5)
            value = round_to(4, value / 1000) + " k";
        else
            value = round_to(4, value) + " ";
        return value;
    };
    firststart = true;

    let opts = {
        angle: 0,
        lineWidth: 0.5,
        radiusScale: 1,
        pointer: { strokeWidth: 0 },
        limitMax: false,
        limitMin: true,
        colorStart: '#EF7A44',
        generateGradient: false,
        highDpiSupport: true,
    };

    var target = document.getElementById('hashratechart');
    let hashrate_gauge = new Gauge(target).setOptions(opts);
    hashrate_gauge.setMinValue(0);
    hashrate_gauge.animationSpeed = 100;

    var target = document.getElementById('userchart');
    let user_gauge = new Gauge(target).setOptions(opts);
    user_gauge.maxValue = 75000;
    user_gauge.setMinValue(0);
    user_gauge.animationSpeed = 100;

    var target = document.getElementById('circulationchart');
    let circulation_gauge = new Gauge(target).setOptions(opts);
    circulation_gauge.maxValue = 28110000;
    circulation_gauge.setMinValue(0);
    circulation_gauge.animationSpeed = 100;

    var target = document.getElementById('energychart');
    let energy_gauge = new Gauge(target).setOptions(opts);
    energy_gauge.maxValue = 100;
    energy_gauge.setMinValue(0);
    energy_gauge.animationSpeed = 100;

    var target = document.getElementById('sharechart');
    let share_gauge = new Gauge(target).setOptions(opts);
    share_gauge.maxValue = 150000000000;
    share_gauge.setMinValue(0);
    share_gauge.animationSpeed = 100;

    master_server = {}


    function fetch_price() {
        fetch("https://server.duinocoin.com/historic_prices?currency=max&limit=30")
            .catch(function(error) {
                console.log(error);
            })
            .then(response => response.json())
            .then(data => {
                data = data.result;

                let date_labels = []
                let prices = []

                for (day in data.reverse()) {
                    date_labels.push(data[day]["day"]);
                    prices.push(data[day]["price"])
                }

                var ctx = document.getElementById('pricechart').getContext('2d');
                var myChart = new Chart(ctx, {
                    type: 'line',
                    data: {
                        labels: date_labels,
                        datasets: [{
                            label: '',
                            data: prices,
                            backgroundColor: 'rgba(239, 122, 68, 0.8)',
                            borderColor: 'rgba(255, 255, 255, 1)',
                            borderWidth: 1.5
                        }]
                    },
                    options: {
                        legend: {
                            display: false
                        },
                        scales: {
                            yAxes: [{
                                ticks: {
                                    callback: function(value, index, values) {
                                        return '$' + value.toFixed(5);
                                    },
                                    beginAtZero: false
                                }
                            }],
                            xAxes: [{
                                gridLines: {
                                    display: false
                                }
                            }]

                        }
                    }
                });

            });
    }

    function get_daily() {
        fetch("https://duco.sytes.net/dailynewusers.json")
            .catch(function(error) {
                console.log(error);
            })
            .then(response => response.json())
            .then(data => {
                days = []
                users = []
                for (day in data) {
                    days.push(day);
                    users.push(data[day]["new"]);
                }
                const ctxt = document.getElementById('dailyusers').getContext('2d');
                const userchart = new Chart(ctxt, {
                    type: 'bar',
                    data: {
                        labels: days.slice(-30),
                        datasets: [{
                            data: users.slice(-30),
                            backgroundColor: '#00C07B',
                            borderWidth: 1.5
                        }]
                    },
                    options: {
                        animation: {
                            duration: 1500
                        },
                        legend: {
                            display: false
                        },
                        plugins: {
                            labels: {
                                fontSize: 0,
                            }
                        }
                    }
                });
            });
    }
    get_daily()

    function update_stats() {
        fetch("https://server.duinocoin.com/api.json")
            .catch(function(error) {
                console.log(error);
            })
            .then(response => response.json())
            .then(data => {
                duco_price = data["Duco price"];

                data["Miner distribution"]["ESP32"] /= 2
                data["Miner distribution"]["RPi"] /= 4
                data["Miner distribution"]["CPU"] /= 6
                data["Miner distribution"]["Web"] /= 6
                data["Miner distribution"]["Phone"] /= 4

                update_element("hashrate", data["Pool hashrate"])
                hashrate_gauge.set(parseInt(data["Pool hashrate"]));

                update_element("registeredusers", data["Registered users"])
                user_gauge.set(data["Registered users"]);
                hashrate_gauge.maxValue = (data["Registered users"]/10)+500;

                update_element("allmined", scientific_prefix(data["All-time mined DUCO"]));
                circulation_gauge.set(data["All-time mined DUCO"])

                update_element("watt_usage", data["Net energy usage"])
                energy_gauge.set(parseInt(data["Net energy usage"]))

                update_element("shares", scientific_prefix(data["Mined blocks"]))
                share_gauge.set(parseInt(data["Mined blocks"]))

                update_element("arduinos", data["Miner distribution"]["Arduino"])

                update_element("esp8266s", data["Miner distribution"]["ESP8266"])

                update_element("esp32s", Math.round(data["Miner distribution"]["ESP32"]))

                update_element("rpis", Math.round(data["Miner distribution"]["RPi"]))

                update_element("cpus", Math.round(data["Miner distribution"]["Web"] +
                    data["Miner distribution"]["CPU"]))

                update_element("phones", Math.round(data["Miner distribution"]["Phone"]))

                update_element("others", data["Miner distribution"]["Other"])

                aktualizacja = new Date() / 1000 - data["Last sync"]
                master_server = {
                    "icon": "fa-server",
                    "name": `MASTERNODE v${data["Server version"]}`,
                    "cpu": data["Server CPU usage"],
                    "ram": data["Server RAM usage"],
                    "connections": data["Active connections"],
                    "lastsync": `${round_to(0, aktualizacja)}s ago`
                }

                labels = []
                mnrdata = []
                $("#workercount").text(data["Miner distribution"]["All"])
                delete data["Miner distribution"]["All"]
                for (label in data["Miner distribution"]) {
                    labels.push(label)
                    mnrdata.push(Math.round(data["Miner distribution"][label]))
                }

                userlabels = []
                usrdata = []
                ignored = ["celoDUCO", "maticDUCO", "bscDUCO"]
                for (label in data["Top 10 richest miners"]) {
                    user = data["Top 10 richest miners"][label].split(" - ")
                    if (!ignored.includes(user[1])) {
                        userlabels.push(user[1])
                        usrdata.push(parseInt(user[0]))
                    }
                }
                userlabels.push("Other accounts")
                usrdata.push(parseInt(data["All-time mined DUCO"]))

                if (firststart) {
                    const ctx = document.getElementById('distributionchart').getContext('2d');
                    const distributionchart = new Chart(ctx, {
                        type: 'doughnut',
                        data: {
                            labels: labels,
                            datasets: [{
                                data: mnrdata,
                                backgroundColor: [
                                    '#00C07B',
                                    '#5E68FF',
                                    '#EE5253',
                                    'rgba(253, 167, 223, 1.0)',
                                    'rgba(16, 172, 132, 1.0)',
                                    '#2e86de',
                                    '#5f27cd',
                                    'rgba(255, 159, 67, 1.0)',
                                    'rgba(0, 148, 50, 1.0)',
                                    '#EF7A44'
                                ],
                                borderWidth: 1.5
                            }]
                        },
                        options: {
                            rotation: 45,
                            animation: {
                                duration: 1500
                            },
                            legend: false,
                            tooltips: {
                                backgroundColor: 'rgba(0, 0, 0, 0.8)',
                                cornerRadius: 8,
                                caretSize: 0,
                                displayColors: false
                            },
                            plugins: {
                                labels: {
                                    render: 'label',
                                    showZero: false,
                                    fontSize: 12,
                                    fontColor: '#fff',
                                    fontStyle: 'normal',
                                    fontFamily: "'Lato', 'Helvetica', 'Arial', sans-serif",
                                    textShadow: true,
                                    shadowBlur: 10,
                                    shadowOffsetX: 0,
                                    shadowOffsetY: -1,
                                    shadowColor: 'rgba(0,0,0,0.5)',
                                    arc: false,
                                    position: 'border',
                                    overlap: false,
                                    outsidePadding: 4,
                                    textMargin: 4
                                }
                            }
                        }
                    });

                    const ctxt = document.getElementById('userducochart').getContext('2d');
                    const userchart = new Chart(ctxt, {
                        type: 'pie',
                        data: {
                            labels: userlabels,
                            datasets: [{
                                data: usrdata,
                                backgroundColor: [
                                    '#00C07B',
                                    '#5E68FF',
                                    '#EE5253',
                                    'rgba(253, 167, 223, 1.0)',
                                    'rgba(16, 172, 132, 1.0)',
                                    'rgba(255, 159, 67, 1.0)',
                                    'rgba(0, 148, 50, 1.0)',
                                    '#EF7A44'
                                ],
                                borderWidth: 1.5
                            }]
                        },
                        options: {
                            rotation: (-0.47 * Math.PI) - (25 / 180 * Math.PI),
                            animation: {
                                duration: 1500
                            },
                            legend: false,
                            tooltips: {
                                backgroundColor: 'rgba(0, 0, 0, 0.8)',
                                cornerRadius: 8,
                                caretSize: 0,
                                displayColors: false
                            },
                            plugins: {
                                labels: {
                                    render: 'label',
                                    showZero: false,
                                    fontSize: 12,
                                    fontColor: '#fff',
                                    fontStyle: 'normal',
                                    fontFamily: "'Lato', 'Helvetica', 'Arial', sans-serif",
                                    textShadow: true,
                                    shadowBlur: 10,
                                    shadowOffsetX: 0,
                                    shadowOffsetY: -1,
                                    shadowColor: 'rgba(0,0,0,0.5)',
                                    arc: false,
                                    position: 'border',
                                    overlap: false,
                                    outsidePadding: 4,
                                    textMargin: 4
                                }
                            }
                        }
                    });
                    firststart = false;
                }
            })
    }


    function last_explorer_hashes() {
        fetch("https://server.duinocoin.com/transactions.json")
            .catch(function(error) {})
            .then(response => response.json())
            .then(data => {

                hashes = []
                for (hash in data) {
                    hashes.push(data[hash])
                }

                transaction_hashes_html = "";
                for (hash in hashes.reverse()) {
                    if (hash >= 5) break
                    this_hash = hashes[hash].Hash;
                    if (this_hash.length == 40) {
                        transaction_hashes_html += `<a class='transaction2 monospace' onclick="link_search('${this_hash}')">` + this_hash.substring(0, 40) + "</a><br>";
                    } else {
                        transaction_hashes_html += `<a class='transaction1 monospace' onclick="link_search('${this_hash}')">` + this_hash.substring(0, 40) + "</a><br>";
                    }
                }
                $("#transactionstext3").html(transaction_hashes_html);
            })
        fetch("https://server.duinocoin.com/foundBlocks.json")
            .catch(function(error) {})
            .then(response => response.json())
            .then(data => {
                let last = [];
                for (hash in data) {
                    last.push(hash);
                }

                block_hashes_html = "";
                for (hash in last.reverse()) {
                    if (hash >= 5) break
                    this_hash = last[hash];
                    if (this_hash.length == 40) {
                        block_hashes_html += `<a class='block2 monospace' onclick="link_search('${this_hash}')">` + this_hash.substring(0, 40) + "</a><br>";
                    } else {
                        block_hashes_html += `<a class='block1 monospace' onclick="link_search('${this_hash}')">` + this_hash.substring(0, 40) + "</a><br>";
                    }
                }
                $("#transactionstext4").html(block_hashes_html);
            })
    }


    String.prototype.escape = function() {
        var tagsToReplace = {
            '&': ' ',
            '\\': ' ',
            '/': ' ',
            '(': ' ',
            ')': ' ',
            '`': ' ',
            '<': ' ',
            '>': ' '
        };
        return this.replace(/[&<>]/g, function(tag) {
            return tagsToReplace[tag] || tag;
        });
    };


    function search(searched_string) {
        let cont = true;
        if (searched_string) {
            window.history.pushState('Duino-Coin network statistics and chain explorer', 'Duino-Coin network statistics and chain explorer', `?search=${searched_string}`);
            $("#transactionstext1").html(`<div class="divider">Results&nbsp;for&nbsp;<span style="overflow:hidden"><a onclick="link_search('${searched_string}')">${searched_string}</a></span></div>`);
            $("#transactionstext1_sub").html("");
        }
        if (cont) {
            $("#searchcontrol").addClass("is-loading");
            $.getJSON("https://server.duinocoin.com/transactions/" + searched_string, function(data) {
                if (data.success == true && data.result != "No transaction found") {
                    cont = false;
                    let amount_usd = data.result.amount * duco_price;
                    if (searched_string.length == 40) transaction_type = "DUCO-S1";
                    else transaction_type = "XXHASH"

                    change_tags(searched_string, "transaction");

                    found_transaction_html = `
                            <table class="table is-narrow is-fullwidth">
                                <tbody>
                                    <tr>
                                        <th>
                                            <span class="icon-text">
                                                <i class="icon fa fa-info-circle"></i>
                                                <span>Type</span> 
                                            </span>
                                        </th>
                                        <th>
                                            Transaction #${data.result.id} (${transaction_type})
                                        </th>
                                    </tr>
                                    <tr>
                                        <th>
                                            <span class="icon-text">
                                                <i class="icon fa fa-calendar"></i>
                                                <span>Timestamp</span>
                                            </span>
                                        </th>
                                        <th>
                                            ${data.result.datetime}
                                        </th>
                                    </tr>
                                    <tr>
                                        <th>
                                            <span class="icon-text">
                                                <i class="icon fa fa-arrow-right"></i>
                                                <span>Output (sender)</span>
                                            </span>
                                        </th>
                                        <th>
                                            <a onclick="link_search('${data.result.sender}')">
                                                ${data.result.sender}
                                            </a>
                                        </th>
                                    </tr>
                                    <tr>
                                        <th>
                                            <span class="icon-text">
                                                <i class="icon fa fa-arrow-left"></i>
                                                <span>Input (recipient)</span>
                                            </span>
                                        </th>
                                        <th>
                                            <a onclick="link_search('${data.result.recipient}')">
                                                ${data.result.recipient}
                                            </a>
                                        </th>
                                    </tr>
                                    <tr>
                                        <th>
                                            <span class="icon-text">
                                                <i class="icon fa fa-coins"></i>
                                                <span>Transferred amount</span>
                                            </span>
                                        </th>
                                        <th>
                                            ${data.result.amount} DUCO
                                            ($${round_to(4, amount_usd)})
                                        </th>
                                    </tr>
                                    <tr>
                                        <th>
                                            <span class="icon-text">
                                                <i class="icon fa fa-envelope"></i>
                                                <span>Memo</span>
                                            </span>
                                        </th>
                                        <th>
                                            ${data.result.memo}
                                        </th>
                                    </tr>
                                </tbody>
                            </table>`

                    $("#searchcontrol").removeClass("is-loading");
                    update_element("transactionstext2", found_transaction_html);
                }
            })
                .fail(function(error) {
                    console.log(error.responseText);
                    if (error.responseText.includes("500")) error = "500 - internal server error";
                    else if (error.responseText.includes("429")) error = "429 - too many requests (slow down)";
                    else if (error.responseText.includes("404")) error = "404 - nothing interesting found";
                    found_transaction_html = `<ul class="is-size-6"><li>` +
                        `<i class='fas fa-info-circle'></i>` +
                        `&nbsp;Error: <b>${error}</b> 🤦‍♀️</li></ul>`;
                    $("#searchcontrol").removeClass("is-loading");
                    update_element("transactionstext2", found_transaction_html);
                });
        }
        if (cont) {
            $.getJSON('https://server.duinocoin.com/users/' + searched_string, function(data) {
                if (data.success == true) {
                    cont = false;
                    let amount_usd = data.result.balance.balance * duco_price;

                    change_tags(searched_string, "user");

                    miner_str = "";
                    miner_count = 0;
                    if (data.result.miners.length) {
                        let threaded_miners = {};
                        user_miners = data.result.miners;

                        for (let miner in user_miners) {
                            let miner_wallet_id = user_miners[miner]["wd"];
                            if (!miner_wallet_id) miner_wallet_id = Math.random();
                            const miner_hashrate = user_miners[miner]["hashrate"];
                            const miner_rejected = user_miners[miner]["rejected"];
                            const miner_accepted = user_miners[miner]["accepted"];

                            if (!threaded_miners[miner_wallet_id]) {
                                threaded_miners[miner_wallet_id] = user_miners[miner];
                                threaded_miners[miner_wallet_id]["threads"] = 1;
                                miner_count += 1;
                                continue;
                            } else if (threaded_miners[miner_wallet_id]) {
                                threaded_miners[miner_wallet_id]["hashrate"] += miner_hashrate;
                                threaded_miners[miner_wallet_id]["rejected"] += miner_rejected;
                                threaded_miners[miner_wallet_id]["accepted"] += miner_accepted;
                                threaded_miners[miner_wallet_id]["threads"] += 1;
                                continue;
                            }
                        }

                        i = 0;
                        for (miner in threaded_miners) {
                            if (threaded_miners[miner]["identifier"] != "None") {
                                miner_str += "<b>" +
                                    threaded_miners[miner]["identifier"] +
                                    "</b> <span class='has-text-grey'>(" +
                                    threaded_miners[miner]["software"] +
                                    ")</span> - " +
                                    get_prefix("", threaded_miners[miner]["accepted"]) + "/" +
                                    get_prefix("", (threaded_miners[miner]["accepted"] + threaded_miners[miner]["rejected"])) +
                                    ", <b>" + get_prefix("H/s", threaded_miners[miner]["hashrate"]) + `</b> (${((threaded_miners[miner]["threads"] == 1) ? ("1 thread") : (`${threaded_miners[miner]["threads"]} threads`))}) <br>`;
                            } else {
                                miner_str += "<b>" + threaded_miners[miner]["software"] + "</b> - " +
                                    threaded_miners[miner]["accepted"] + "/" +
                                    (threaded_miners[miner]["accepted"] + threaded_miners[miner]["rejected"]) +
                                    ", <b>" + get_prefix("H/s", threaded_miners[miner]["hashrate"]) + `</b> (${((threaded_miners[miner]["threads"] == 1) ? ("1 thread") : (`${threaded_miners[miner]["threads"]} threads`))}) <br>`;
                            }

                            if (i > 10) {
                                miner_str += "And " + (miner_count - i) + " more miner(s)...";
                                break;
                            }
                            i += 1;
                        }
                    } else {
                        miner_str += "No miners found for that user";
                    }

                    tx_str = "";
                    i = 0;
                    if (data["result"]["transactions"].length) {
                        for (transaction in data["result"]["transactions"].reverse()) {
                            if (data["result"]["transactions"][transaction]["sender"] == data["result"]["balance"]["username"]) {
                                tx_str += "<span class='has-text-grey'>" +
                                    data["result"]["transactions"][transaction]["datetime"] +
                                    "</span> Sent <span class='has-text-danger-dark'>" +
                                    " <b>" +
                                    Math.round(data["result"]["transactions"][transaction]["amount"] * 1000) / 1000 +
                                    " DUCO</b></span> to " +
                                    `<a onclick="link_search('${data["result"]["transactions"][transaction]["recipient"]}')">` +
                                    "<b>" +
                                    data["result"]["transactions"][transaction]["recipient"] + "</a></b> " + `<a onclick="link_search('${data["result"]["transactions"][transaction]["hash"]}')">(` + data["result"]["transactions"][transaction]["hash"].substr(data["result"]["transactions"][transaction]["hash"].length - 8) + ")</a><br>"
                            } else {
                                tx_str += "<span class='has-text-grey'>" +
                                    data["result"]["transactions"][transaction]["datetime"] +
                                    "</span> Received <span class='has-text-success-dark'>" +
                                    "<b>" +
                                    Math.round(data["result"]["transactions"][transaction]["amount"] * 1000) / 1000 +
                                    " DUCO</b></span> from " +
                                    `<a onclick="link_search('${data["result"]["transactions"][transaction]["sender"]}')">` + "<b>" +
                                    data["result"]["transactions"][transaction]["sender"] + "</a></b> " + `<a onclick="link_search('${data["result"]["transactions"][transaction]["hash"]}')">(` + data["result"]["transactions"][transaction]["hash"].substr(data["result"]["transactions"][transaction]["hash"].length - 8) + ")</a><br>"
                            }

                            i += 1;
                            if (i > 10) {
                                break;
                            }
                        }
                    } else {
                        tx_str += "No transactions found for that user";
                    }

                    found_user_html = `
                            <table class="table is-narrow is-fullwidth">
                                <tbody>
                                    <tr>
                                        <th>
                                            <span class="icon-text">
                                                <i class="icon fa fa-user"></i>
                                                <span>Wallet name</span> 
                                            </span>
                                        </th>
                                        <th>
                                            <a onclick="link_search('${searched_string}')">
                                                ${searched_string}
                                            </a>
                                        </th>
                                    </tr>
                                    <tr>
                                        <th>
                                            <span class="icon-text">
                                                <i class="icon fa fa-coins"></i>
                                                <span>Balance</span>
                                            </span>
                                        </th>
                                        <th>
                                            ${round_to(10, data.result.balance.balance)} DUCO
                                            ($${round_to(4, amount_usd)})
                                        </th>
                                    </tr>
                                    <tr>
                                        <th>
                                            <span class="icon-text">
                                                <i class="icon fa fa-check-circle"></i>
                                                <span>Verified</span>
                                            </span>
                                        </th>
                                        <th>
                                            ${data.result.balance.verified}
                                        </th>
                                    </tr>
                                    <tr>
                                        <th>
                                            <span class="icon-text">
                                                <i class="icon fa fa-calendar"></i>
                                                <span>Creation date</span>
                                            </span>
                                        </th>
                                        <th>
                                            ${data.result.balance.created}
                                        </th>
                                    </tr>
                                    <tr>
                                        <th colspan="2">
                                            <span class="icon-text">
                                                <i class="icon fa fa-cog"></i>
                                                <span>Miners</span>
                                            </span>
                                        </th>
                                    </tr>
                                    <tr>
                                        <th colspan="2">
                                            ${miner_str}
                                        </th>
                                    </tr>
                                    <tr>
                                        <th colspan="2">
                                            <span class="icon-text">
                                                <i class="icon fas fa-people-arrows"></i>
                                                <span>Transactions</span>
                                            </span>
                                        </th>
                                    </tr>
                                    <tr>
                                        <th colspan="2">
                                            ${tx_str}
                                        </th>
                                    </tr>
                                </tbody>
                            </table>`

                    $("#searchcontrol").removeClass("is-loading");
                    update_element("transactionstext2", found_user_html);
                }
            })
                .fail(function(error) {
                    if (error.responseText.includes("500")) error = "500 - internal server error";
                    else if (error.responseText.includes("429")) error = "429 - too many requests (slow down)";
                    else if (error.responseText.includes("404")) error = "404 - nothing interesting found";
                    found_transaction_html = `<ul class="is-size-6"><li>` +
                        `<i class='fas fa-info-circle'></i>` +
                        `&nbsp;Error: <b>${error}</b> 🤦‍♀️</li></ul>`;
                    $("#searchcontrol").removeClass("is-loading");
                    update_element("transactionstext2", found_transaction_html);
                });
        }
        if (cont) {
            $.getJSON('https://server.duinocoin.com/foundBlocks.json', function(data) {
                cont = false;
                let found = data[searched_string]
                if (searched_string != "" && found != "" && found != undefined) {
                    cont = false;
                    let amount_usd = found["Amount generated"] * duco_price;
                    if (searched_string.length == 40) block_type = "DUCO-S1";
                    else block_type = "XXHASH"

                    change_tags(searched_string, "block");

                    found["Finder"] = found["Finder"].replace("(DUCO-S1)", "")
                    found["Finder"] = found["Finder"].replace("(XXHASH)", "")

                    found_block_html = `
                            <table class="table is-fullwidth">
                                <tbody>
                                    <tr>
                                        <th>
                                            <span class="icon-text">
                                                <i class="icon fa fa-info-circle"></i>
                                                <span>Type</span>
                                            </span>
                                        </th>
                                        <th>
                                            Block (${block_type})
                                        </th>
                                    </tr>
                                    <tr>
                                        <th>
                                            <span class="icon-text">
                                                <i class="icon fa fa-calendar"></i>
                                                <span>Timestamp</span>
                                            </span>
                                        </th>
                                        <th>
                                            ${found["Date"]} ${found["Time"]}
                                        </th>
                                    </tr>
                                    <tr>
                                        <th>
                                            <span class="icon-text">
                                                <i class="icon fa fa-user-tie"></i>
                                                <span>Finder</span>
                                            </span>
                                        </th>
                                        <th>
                                            <a onclick="link_search('${found["Finder"]}')">
                                                ${found["Finder"]}
                                            </a>
                                        </th>
                                    </tr>
                                    <tr>
                                        <th>
                                            <span class="icon-text">
                                                <i class="icon fa fa-coins"></i>
                                                <span>Generated amount</span>
                                            </span>
                                        </th>
                                        <th>
                                            ${found["Amount generated"]} DUCO
                                            ($${round_to(4, amount_usd)})
                                        </th>
                                    </tr>
                                </tbody>
                            </table>`

                    $("#searchcontrol").removeClass("is-loading");
                    update_element("transactionstext2", found_block_html);
                }
            })
                .fail(function(error) {
                    if (error.responseText.includes("500")) error = "500 - internal server error";
                    else if (error.responseText.includes("429")) error = "429 - too many requests (slow down)";
                    else if (error.responseText.includes("404")) error = "404 - nothing interesting found";
                    found_transaction_html = `<ul class="is-size-6"><li>` +
                        `<i class='fas fa-info-circle'></i>` +
                        `&nbsp;Error: <b>${error}</b> 🤦‍♀️</li></ul>`;
                    $("#searchcontrol").removeClass("is-loading");
                    update_element("transactionstext2", found_transaction_html);
                });
        }
        if (cont) {
            setTimeout(function() { $("#searchcontrol").removeClass("is-loading"); }, 500);
            $("#transactionstext2").text(`Nothing interesting found for your query 🤷`);
        }
    }

    function getColor(value) {
        var hue = ((1 - value) * 128).toString(10);
        return ["hsl(", hue, ", 100%, 25%)"].join("");
    }

    function update_pools() {
        fetch("https://server.duinocoin.com/all_pools")
            .catch(function(error) {
                console.log(error);
            })
            .then(response => response.json())
            .then(data => {
                if (data.success === true) {
                    data = data.result;

                    node_html = "";

                    data = {
                        "master": master_server,
                        ...data
                    }
                    for (node in data) {
                        cpucolor = getColor(data[node]["cpu"] / 100);
                        ramcolor = getColor(data[node]["ram"] / 100);

                        if (parseInt(data[node]["lastsync"]) < 60) {
                            synccolor = "has-text-success";
                            syncicon = "fa-check-circle";
                        } else if (parseInt(data[node]["lastsync"]) < 360) {
                            synccolor = "has-text-warning";
                            syncicon = "fa-exclamation-triangle";
                        } else {
                            synccolor = "has-text-danger";
                            syncicon = "fa-times-circle";
                        }

                        if (parseInt(data[node]["lastsync"]) < 3600) {
                            node_html += `
                        <div class="column" style="min-width:200px">
                            <p class="heading title mb-1 is-size-6">
                                <i class="fa ${data[node]["icon"]}"></i>
                                <span>${data[node]["name"].replace("pool", "node")}</span>
                            </p>
                            <div class="content">
                                Last sync: <strong>${data[node]["lastsync"]}</strong>
                                <i class="${synccolor} fa ${syncicon}"></i>
                                <br>
                                CPU: <strong style="color:${cpucolor}">${data[node]["cpu"]}%</strong><br>
                                RAM: <strong style="color:${ramcolor}">${data[node]["ram"]}%</strong><br>
                                Clients: <strong>${data[node]["connections"]}</strong>
                            </div>
                        </div>`
                        }
                    }
                    update_element("pools", node_html)
                }
            })
    }

    update_stats();
    window.setInterval(update_stats, 5000);

    last_explorer_hashes();
    window.setInterval(last_explorer_hashes, 5000);

    update_pools();
    window.setInterval(update_pools, 5000);

    fetch_price();

    $("#search_input").on('keydown', function(e) {
        if (e.which === 13) {
            e.preventDefault();
            button_search();
        }
    });

    function button_search() {
        to_search = document.getElementById('forUsername').innerText;
        console.log("Button search for ", to_search.escape())
        search(to_search.escape());
    }

    function link_search(to_search) {
        console.log("Link search for ", to_search.escape())
        search(to_search.escape());
    }

    if (to_search) search(to_search.escape());

    // Target Blank
    function targetBlank() {
        let a = document.getElementsByTagName('a');
        for (let i = 0; i < a.length; i++) {
            a[i].setAttribute('target', '_blank');
        }
    }
    targetBlank();
});