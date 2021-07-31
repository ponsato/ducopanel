let loggedIn = false;
let balance = 0;
let curr_bal = 0;
let profitcheck = 0;
let duco_price = 0.0065;
let daily_average = [];
let oldb = 0;
let success_once = false;
let alreadyreset = false;
let start = Date.now()
let totalHashes = 0;
let sending = false;
let awaiting_login = false;
let awaiting_data = false;
let awaiting_version = true;
let timestamps = [];
let balances = [];
let first_launch = true;
let hashToBeFound;

window.addEventListener('load', function() {
    // RANDOM BACKGROUND
    const bg_list = [
        'backgrounds/1-min.png',
        'backgrounds/2-min.png',
        'backgrounds/3-min.png',
        'backgrounds/4-min.png',
        'backgrounds/5-min.png',
        'backgrounds/6-min.jpg',
        'backgrounds/7-min.png',
        'backgrounds/8-min.png',
        'backgrounds/9-min.png'
    ]

    let num = Math.floor(Math.random() * bg_list.length)
    document.body.background = bg_list[num];

    const data = {
        labels: timestamps,
        datasets: [{
            data: balances,
        }]
    };

    const config = {
        options: {
            backgroundColor: '#ff9770',
            borderColor: '#ff9770',
            plugins: {
                legend: {
                    display: false
                }
            }
        },
        type: 'line',
        data
    };

    const balance_chart = new Chart(
        document.getElementById('balance_chart'),
        config
    );

    function get_now() {
        const today = new Date();
        const time = today.getHours() +
            ":" +
            today.getMinutes() +
            ":" +
            today.getSeconds();
        return time;
    }

    function push_to_graph(balance) {
        timestamps.push(get_now());
        balances.push(balance);
        balance_chart.update();
    };

    function updateValue(e) {
        let theme = e.target.value;
        let radiate = $('#radiate');
        let alt = $('#alt');
        let crisp = $('#crisp');
        let material = $('#material');
        let frosted = $('#frosted');
        switch (theme) {
            case 'frosted':
                frosted.attr('disabled', false);
                radiate.attr('disabled', true);
                alt.attr('disabled', true);
                crisp.attr('disabled', true);
                material.attr('disabled', true);
                break;
            case 'radiance':
                radiate.attr('disabled', false);
                alt.attr('disabled', true);
                crisp.attr('disabled', true);
                material.attr('disabled', true);
                frosted.attr('disabled', true);
                break;
            case 'altlight':
                radiate.attr('disabled', true);
                alt.attr('disabled', false);
                crisp.attr('disabled', true);
                material.attr('disabled', true);
                frosted.attr('disabled', true);
                break;
            case 'light':
                radiate.attr('disabled', true);
                alt.attr('disabled', true);
                crisp.attr('disabled', true);
                material.attr('disabled', true);
                frosted.attr('disabled', true);
                break;
            case 'crisp':
                radiate.attr('disabled', true);
                alt.attr('disabled', true);
                crisp.attr('disabled', false);
                material.attr('disabled', true);
                frosted.attr('disabled', true);
                break;
            case 'material':
            default:
                radiate.attr('disabled', true);
                alt.attr('disabled', true);
                crisp.attr('disabled', true);
                material.attr('disabled', false);
                frosted.attr('disabled', true);
                break;
        }
    }


    // PRICE FROM API
    const get_duco_price = () => {
        fetch("https://server.duinocoin.com/api.json")
            .then(response => response.json())
            .then(data => {
                duco_price = round_to(5, data["Duco price"]);

                update_element("ducousd", "≈ $" + duco_price);
                update_element("ducousd_bch", "≈ $" + round_to(5, data["Duco price BCH"]));
                update_element("ducousd_trx", "≈ $" + round_to(5, data["Duco price TRX"]));

                //update_element("ducousd_xrp", "≈ $" + round_to(5, data["Duco price XRP"]));
                //update_element("ducousd_dgb", "≈ $" + round_to(5, data["Duco price DGB"]));
                //update_element("ducousd_nano", "≈ $" + round_to(5, data["Duco price NANO"]));

                update_element("duco_nodes", "≈ $" + round_to(5, data["Duco Node-S price"]));

                update_element("duco_justswap", "≈ $" + round_to(5, data["Duco JustSwap price"]));
            })
    }

    // SCIENTIFIC PREFIX CALCULATOR
    const scientific_prefix = (value) => {
        value = parseFloat(value);
        if (value / 1000000000 > 0.5)
            value = round_to(2, value / 1000000000) + " G";
        else if (value / 1000000 > 0.5)
            value = round_to(2, value / 1000000) + " M";
        else if (value / 1000 > 0.5)
            value = round_to(2, value / 1000) + " k";
        else
            value = round_to(2, value) + " ";
        return value;
    };

    //USER DATA FROM API
    const user_data = (username) => {
        $.getJSON('https://server.duinocoin.com/users/' + username, function(data) {
            data = data.result;
            balance = parseFloat(data.balance.balance);
            let balanceusd = balance * duco_price;
            //console.log("Balance received: " + balance + " ($" + balanceusd + ")");

            if (first_launch) {
                push_to_graph(balance);
                first_launch = false;
            }
            push_to_graph(balance);

            if (oldb != balance) {
                calculdaily(balance, oldb)
                oldb = balance;
            }

            balance = round_to(8, balance);
            update_element("balance", balance + " DUCO");

            balanceusd = round_to(4, balanceusd);
            update_element("balanceusd", "≈ $" + balanceusd);

            var user_miners = data.miners;
            // console.log(user_miners)
            // console.log("Miner data received " + user_miners.length);

            if (user_miners.length > 0) {
                let user_miners_html = '';
                let miner_name = '';
                let diffString = '';

                for (let miner in user_miners) {
                    miner_hashrate = user_miners[miner]["hashrate"];
                    miner_identifier = user_miners[miner]["identifier"];
                    miner_software = user_miners[miner]["software"];
                    miner_diff = user_miners[miner]["diff"];
                    miner_rejected = user_miners[miner]["rejected"];
                    miner_accepted = user_miners[miner]["accepted"];
                    miner_sharetime = user_miners[miner]["sharetime"];

                    if (miner_identifier === "None")
                        miner_name = miner_software;
                    else
                        miner_name = miner_identifier +
                            "<span class='has-text-grey'> (" +
                            miner_software +
                            ")</span>";

                    diffString = scientific_prefix(miner_diff)
                    accepted_rate = round_to(1, (miner_accepted / (miner_accepted + miner_rejected) * 100)) + "%"

                    user_miners_html += `
                            <div class="column is-full">
                                <p class="title is-size-6">
                                    <i class="fas fa-spin fa-cog fa-fw"></i>
                                    <span class="has-text-primary">
                                        ` + miner_name + `
                                    </span>
                                    -
                                    <span>
                                        ` + scientific_prefix(miner_hashrate) + `H/s
                                    </span>
                                    <span class="has-text-grey">
                                        (` + miner_sharetime + `s)
                                    </span>
                                </p>
                                <p class="subtitle is-size-7">
                                    <span>
                                        <b>` +
                        miner_accepted +
                        "/" +
                        (miner_accepted + miner_rejected) + `
                                            <span class="has-text-success-dark">
                                                (` + accepted_rate + `)
                                            </span>
                                        </b> accepted shares,
                                        difficulty <b>` + diffString + `</b>
                                    </span>
                                </p>
                            </div>`;

                    total_hashrate += miner_hashrate;
                }
                update_element("minercount", "(" + user_miners.length + ")");
                update_element("miners", user_miners_html);
                update_element("miners_miner", user_miners_html);
                update_element("total_hashrate", "Total hashrate: " + scientific_prefix(total_hashrate) + "H/s");
                update_element("miners_pcminer", user_miners_html);
                update_element("minerHR", "Total hashrate: " + scientific_prefix(total_hashrate) + "H/s");
                update_element("hashrate_miner", scientific_prefix(total_hashrate) + "H/s");
                total_hashrate = 0;
            } else {
                update_element("miners", `
                    <div class="column is-full">
                        <p class='title is-size-6'>
                            No miners detected
                        </p>
                        <p class='subtitle is-size-6 has-text-grey'>
                            If you have turned them on recently, 
                            it will take a minute or two until their stats will appear here.
                        </p>
                    </div>`);
            }

            var user_transactions = data.transactions.reverse();
            //console.log("Transaction list received " + user_transactions.length);

            let transactions_table = document.getElementById("transactions_table");
            if (user_transactions.length > 0) {
                transactions_html = "";
                for (let i in user_transactions) {
                    transaction_date = user_transactions[i]["datetime"];
                    transaction_amount = round_to(8, parseFloat(user_transactions[i]["amount"]));
                    transaction_hash_full = user_transactions[i]["hash"];
                    transaction_hash = transaction_hash_full.substr(transaction_hash_full.length - 8);
                    transaction_memo = user_transactions[i]["memo"];
                    transaction_recipient = user_transactions[i]["recipient"];
                    transaction_sender = user_transactions[i]["sender"];

                    if (transaction_memo == "None") transaction_memo = "";
                    else transaction_memo = "\"" + transaction_memo + "\""

                    if (transaction_sender == username) {
                        thtml = `
                            <div class="column is-full">
                                <p class="title is-size-6">
                                    <i class="fa fa-arrow-right fa-fw"></i>
                                    <span class="has-text-danger">
                                        Sent
                                        ` + transaction_amount + `
                                        DUCO
                                    </span>
                                    <span>
                                        to
                                    </span>
                                    <a href="https://explorer.duinocoin.com/?search=` +
                            transaction_recipient + `" target="_blank">
                                        ` + transaction_recipient + `
                                    </a>
                                    <span class="has-text-grey">
                                        ` + transaction_memo + `
                                    </span>
                                </p>
                                <p class="subtitle is-size-7">
                                    <span>
                                        ` + transaction_date + `
                                    </span>
                                    <a href="https://explorer.duinocoin.com/?search=` +
                            transaction_hash_full + `" target="_blank">
                                        (` + transaction_hash + `)
                                    </a>
                                </p>
                            </div>`;
                        transactions_html += thtml;
                    } else {
                        thtml = `
                            <div class="column is-full">
                                <p class="title is-size-6">
                                    <i class="fa fa-arrow-left fa-fw"></i>
                                    <span class="has-text-success-dark">
                                        Received
                                        ` + transaction_amount + `
                                        DUCO
                                    </span>
                                    <span>
                                        from
                                    </span>
                                    <a href="https://explorer.duinocoin.com/?search=` +
                            transaction_sender + `" target="_blank">
                                        ` + transaction_sender + `
                                    </a>
                                    <span class="has-text-grey">
                                        ` + transaction_memo + `
                                    </span>
                                </p>
                                <p class="subtitle is-size-7">
                                    <span>
                                        ` + transaction_date + `
                                    </span>
                                    <a href="https://explorer.duinocoin.com/?search=` +
                            transaction_hash_full + `" target="_blank">
                                        (` + transaction_hash + `)
                                    </a>
                                </p>
                            </div>`;
                        transactions_html += thtml;
                    }
                }
                transactions_table.innerHTML = transactions_html;
            } else transactions_table.innerHTML = `<div class="column is-full">
                    <p class="title is-size-6">
                        No transactions yet or they're temporarily unavailable
                    </p>
                </div>`;
        });
    }


    function round_to(precision, value) {
        power_of_ten = 10 ** precision;
        return Math.round(value * power_of_ten) / power_of_ten;
    }

    function update_html(element, value) {
        // Nicely fade in the new value if it changed
        element = "#" + element;
        old_value = $(element).html()

        if (value !== old_value) {
            $(element).fadeOut('fast', function() {
                $(element).html(value);
                $(element).fadeIn('fast');
            });
        }
    }

    /* Accurate daily calculator by Lukas */
    function calculdaily(newb, oldb) {
        //Duco made in last seconds
        let ducomadein = newb - oldb;
        let time_passed = (Date.now() - start) / 1000;
        let daily = 86400 * ducomadein / time_passed;

        // Large values mean transaction or big block - ignore this value
        if (daily > 0 && daily < 500) {
            if (daily_average === 0){
                daily_average = daily;
            }

            daily_average += daily;
            daily_average = daily_average/2;

            avg_list = round_to(2, daily_average).toString().split(".")
            avg_before_dot = avg_list[0]
            avg_after_dot = avg_list[1]

            update_html("estimatedprofit", "≈ " + avg_before_dot +
                "<span class='has-text-weight-light'>." +
                avg_after_dot + "</span> ᕲ daily");
            update_html("estimatedprofit_miner", avg_before_dot +
                "<span class='has-text-weight-light'>." +
                avg_after_dot + "</span> ᕲ");
            update_html("estimatedprofit_pcminer", avg_before_dot +
                "<span class='has-text-weight-light'>." +
                avg_after_dot + "</span> ᕲ");

            avgusd = round_to(2, daily * duco_price);

            update_element("estimatedprofitusd", "(≈ $" +
                avgusd + ")");
            update_element("estimatedprofitusd_miner", "(≈ $" +
                avgusd + ")");
            update_element("estimatedprofitusd_pcminer", "(≈ $" +
                avgusd + ")");
        }
        start = Date.now()
    }

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
        let username = document.getElementById('usernameinput').value
        let password = document.getElementById('passwordinput').value

        if (username && password) {
            $("#logincheck").fadeOut('fast', function() {
                $("#loginload").fadeIn('fast');
            });

            document.getElementById('send').onclick = function() {
                let recipient = document.getElementById('recipientinput').value
                let amount = document.getElementById('amountinput').value
                let memo = document.getElementById('memoinput').value

                update_element("sendinginfo", "Requesting transfer...")
                document.getElementById("send").classList.add("is-loading");

                if (recipient && amount) {
                    update_element("sendinginfo", "Requesting transaction...");
                    $.getJSON('https://server.duinocoin.com/transaction/' +
                        '?username=' + username +
                        "&password=" + encodeURIComponent(password) +
                        "&recipient=" + recipient +
                        "&amount=" + amount +
                        "&memo=" + memo,
                        function(data) {
                            console.log(data);
                            if (data.success == true) {
                                serverMessage = data["result"].split(",");
                                if (serverMessage[0] == "OK") {
                                    let modal_success = document.querySelector('#modal_success');
                                    document.querySelector('#modal_success .modal-card-body .content p')
                                        .innerHTML = `<span class='subtitle has-text-success'><b>` +
                                        serverMessage[1] +
                                        `</b></span><br> Transaction hash: <a target="_blank" href='https://explorer.duinocoin.com?search=` +
                                        serverMessage[2] + "'>" +
                                        serverMessage[2] +
                                        `</a></p>`;
                                    document.querySelector('html').classList.add('is-clipped');
                                    modal_success.classList.add('is-active');

                                    document.querySelector('#modal_success .delete').onclick = function() {
                                        document.querySelector('html').classList.remove('is-clipped');
                                        modal_success.classList.remove('is-active');
                                    }
                                    document.getElementById("send").classList.remove("is-loading");
                                    update_element("sendinginfo", "");
                                }

                            } else {
                                serverMessage = data["message"].split(",");
                                let modal_error = document.querySelector('#modal_error');
                                document.querySelector('#modal_error .modal-card-body .content p').innerHTML =
                                    `<b>An error has occurred while sending funds: </b>` + serverMessage[1] + `</b><br></p>`;
                                document.querySelector('html').classList.add('is-clipped');
                                modal_error.classList.add('is-active');

                                document.querySelector('#modal_error .delete').onclick = function() {
                                    document.querySelector('html').classList.remove('is-clipped');
                                    modal_error.classList.remove('is-active');
                                }
                                document.getElementById("send").classList.remove("is-loading");
                                update_element("sendinginfo", "");
                            }
                        })
                } else {
                    update_element("sendinginfo",
                        "<span class='subtitle is-size-6 mb-2 has-text-danger'><b>Fill in the blanks first</b></span>");
                    document.getElementById("send").classList.remove("is-loading");

                    setTimeout(() => {
                        update_element("sendinginfo", "");
                    }, 5000);
                }
            }

            update_element("logintext", "Authenticating...");
            $.getJSON('https://server.duinocoin.com/auth/?username=' +
                username +
                "&password=" +
                encodeURIComponent(password),
                function(data) {
                    if (data.success == true) {
                        console.log("User logged-in");

                        $("#login").hide('fast', function() {
                            $("#user").html("<b>" + username.toUpperCase() + "'S</b>");
                            user_data(username);
                            window.setInterval(() => {
                                user_data(username);
                            }, 10 * 1000);

                            get_duco_price();
                            window.setInterval(() => {
                                get_duco_price();
                            }, 30 * 1000);


                            window.setTimeout(() => {
                                (adsbygoogle = window.adsbygoogle || []).push({});
                            }, 1000);
                            $("#panel").show('slow');
                            update_html("forUsername",
                                "<span id='username' style='display: none'>" + username + "</span>");

                            hashToBeFound = username;
                            hashToBeFound = username;
                            if (hashToBeFound) {
                                $("#transactionstext1").html(`Results for: <strong><span class='gradienttext'>` +
                                    hashToBeFound +
                                    `</strong></span>`);
                                $("#transactionstext2").html("Nothing found or still searching 🤷");
                            }

                            // THEME SWITCHER
                            let themesel = document.getElementById('themesel');
                            themesel.addEventListener('input', updateValue);
                        });
                    } else {
                        update_element("logintext", data.message);
                        $("#loginload").fadeOut('fast');

                        setTimeout(() => {
                            update_element("logintext", "Login");
                            $("#logincheck").fadeIn('fast', function() {
                                $("#loginload").fadeOut('fast');
                            });
                        }, 5000);
                    }
                }).fail(function(jqXHR, textStatus, errorThrown) {
                update_element("logintext", "Incorrect password");
                $("#loginload").fadeOut('fast');

                setTimeout(() => {
                    update_element("logintext", "Login");
                    $("#logincheck").fadeIn('fast', function() {
                        $("#loginload").fadeOut('fast');
                    });
                }, 5000);
            })
        } else {
            update_element("logintext", "Fill in the blanks first");

            setTimeout(() => {
                update_element("logintext", "Login");
            }, 5000);
        }
    }

    // Footer
    document.getElementById("pageloader").setAttribute('class', "pageloader is-primary is-left-to-right"); // After page is loaded

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
            console.log('click');
            tab.classList.add('is-active');
            activateTabsContent(tab);
        });
    })
    tabs[0].click();


    // Network
    document.querySelector('#enlarge_prices').onclick =
    function enlarge_prices() {
        let large_prices = document.querySelector('#large_prices');
        document.querySelector('html').classList.add('is-clipped');
        large_prices.classList.add('is-active');

        document.querySelector('#large_prices .delete').onclick = function() {
            document.querySelector('html').classList.remove('is-clipped');
            large_prices.classList.remove('is-active');
        }
    }

    document.querySelector('#enlarge_miners').onclick =
    function enlarge_miners() {
        let large_miners = document.querySelector('#large_miners');
        document.querySelector('html').classList.add('is-clipped');
        large_miners.classList.add('is-active');

        document.querySelector('#large_miners .delete').onclick = function() {
            document.querySelector('html').classList.remove('is-clipped');
            large_miners.classList.remove('is-active');
        }
    }

    document.querySelector('#enlarge_balances').onclick =
    function enlarge_balances() {
        let large_balances = document.querySelector('#large_balances');
        document.querySelector('html').classList.add('is-clipped');
        large_balances.classList.add('is-active');

        document.querySelector('#large_balances .delete').onclick = function() {
            document.querySelector('html').classList.remove('is-clipped');
            large_balances.classList.remove('is-active');
        }
    }

    // EXPLORER
    let duco_price = 0.00045;
    let load_workers = false;
    let url_string = window.location;
    let url = new URL(url_string);
    hashToBeFound = url.searchParams.get("search") !== '' ? url.searchParams.get("search") : document.getElementById('username').textContent;
    if (hashToBeFound) {
        $("#transactionstext1").html(`Results for: <strong><span class='gradienttext'>` +
            hashToBeFound +
            `</strong></span>`);
        $("#transactionstext2").html("Nothing found or still searching 🤷");
    }


    function update_element(element, value) {
        // Nicely fade in the new value if it changed
        element = "#" + element;
        old_value = $(element).html()

        if ($("<div>" + value + "</div>").text() != old_value) {
            $(element).fadeOut('fast', function() {
                $(element).html(value);
                $(element).fadeIn('fast');
            });
        }
    }


    function round_to(precision, value) {
        power_of_ten = 10 ** precision;
        return Math.round(value * power_of_ten) / power_of_ten;
    }

    document.querySelector('#loadworkers').onclick =
    function start_loading_workers() {
        $("#loadworkers").addClass("is-loading")
        load_workers = true;
    }


    function update_stats() {
        fetch("https://server.duinocoin.com/api.json")
            .then(response => response.json())
            .then(data => {
                // FILL THE STATISTICS SECTION FROM API
                duco_price = data["Duco price"];

                update_element("lastupdate", "(last update: " + data["Last update"] + ")")

                update_element("hashrate", data["Pool hashrate"])
                update_element("ducos1hashrate", data["DUCO-S1 hashrate"])
                update_element("xxhashhashrate", data["XXHASH hashrate"])

                update_element("registeredusers", data["Registered users"])

                update_element("difficulty", data["Current difficulty"])

                update_element("allmined", round_to(2, data["All-time mined DUCO"]) + " ᕲ")

                /* ---------------- */

                update_element("price", "$" + round_to(5, data["Duco price"]))
                update_element("nodesprice", "$" + round_to(5, data["Duco Node-S price"]))
                update_element("justswapprice", "$" + round_to(5, data["Duco JustSwap price"]))

                update_element("watt_usage", data["Net energy usage"])

                update_element("lastblockhash", data["Last block hash"])

                update_element("shares", data["Mined blocks"])

                /* ---------------- */

                update_element("arduinos", data["Miner distribution"]["Arduino"])

                update_element("esp8266s", data["Miner distribution"]["ESP8266"])

                update_element("esp32s", Math.round(data["Miner distribution"]["ESP32"] / 2))

                update_element("rpis", Math.round(data["Miner distribution"]["RPi"] / 4))

                update_element("cpus", Math.round(data["Miner distribution"]["CPU"] / 6))

                update_element("gpus", data["Miner distribution"]["GPU"])

                update_element("others", data["Miner distribution"]["Other"])

                /* Nodes */

                update_element("master_connections", data["Active connections"])
                update_element("master_ver", data["Server version"])
                update_element("master_cpu", round_to(1, data["Server CPU usage"]) + "%")
                update_element("master_ram", round_to(1, data["Server RAM usage"]) + "%")
                update_element("master_threads", data["Open threads"])

                // WORKER LIST
                if (load_workers) {
                    let workers = `<ul class="workers">`
                    let counter = 0;
                    let worker_counter = 0;
                    for (worker in data["Active workers"]) {
                        workers += `<li><span style="color: #5ea3e4"> ` + worker + `</span>&nbsp;<span class="tag">` + data["Active workers"][worker] + ` worker(s)</span></li>`;
                        worker_counter += data["Active workers"][worker];
                        counter++;
                        //if (counter > 100) break;
                    }
                    workers += `</ul>`;
                    $("#workers").html(workers);
                    $("#allworkers").text("(" + worker_counter + " workers on " + counter + " accounts)");
                    let a = document.getElementById('workers').getElementsByTagName('a');
                    for (let i = 0; i < a.length; i++) {
                        a[i].setAttribute('target', '_blank');
                    }
                }
            })
    }


    function last_explorer_hashes() {
        fetch("https://server.duinocoin.com/transactions.json")
            .then(response => response.text())
            .then(data => {
                data = data ? JSON.parse(data) : {};
                hashes = []
                for (hash in data) {
                    hashes.push(data[hash])
                }

                transaction_hashes_html = "<strong>Last transactions:</strong><br>";
                for (hash in hashes.reverse()) {
                    if (hash >= 5) break
                    this_hash = hashes[hash].Hash;
                    if (this_hash.length == 40) {
                        transaction_hashes_html += "<span class='transaction1 monospace'>" + this_hash.substring(0, 14) + "</span><br>";
                    } else {
                        transaction_hashes_html += "<span class='transaction2 monospace'>" + this_hash.substring(0, 14) + "</span><br>";
                    }
                }
                $("#transactionstext3").html(transaction_hashes_html);
            })
        fetch("https://server.duinocoin.com/foundBlocks.json")
            .then(response => response.text())
            .then(data => {
                data = data ? JSON.parse(data) : {};
                let last = [];
                for (hash in data) {
                    last.push(hash);
                }

                block_hashes_html = "<strong>Last blocks:</strong><br>";
                for (hash in last.reverse()) {
                    if (hash >= 5) break
                    this_hash = last[hash];
                    if (this_hash.length == 40) {
                        block_hashes_html += "<span class='block2 monospace'>" + this_hash.substring(0, 14) + "</span><br>";
                    } else {
                        block_hashes_html += "<span class='block1 monospace'>" + this_hash.substring(0, 14) + "</span><br>";
                    }
                }
                $("#transactionstext4").html(block_hashes_html);
            })
    }

    function search() {
        let cont = true;
        if (cont) {
            fetch('https://server.duinocoin.com/transactions/' + hashToBeFound)
                .then(response => response.json())
                .then(data => {
                    if (data.success == true && data.result != "No transaction found") {
                        cont = false;
                        let amount_usd = data.result.amount * duco_price;
                        if (hashToBeFound.length == 40) transaction_type = "DUCO-S1";
                        else transaction_type = "XXHASH"

                        found_transaction_html = `<ul class="subtitle"><li>` +
                            `<i class='fas fa-fw card-green is-size-7 fa-info-circle'></i>` +
                            `&nbsp;Type: <b>transaction</b> (` +
                            transaction_type +
                            `)</li>` +
                            `<li>` +
                            `<i class='fas fa-fw card-red is-size-7 fa-clock'></i>` +
                            `&nbsp;Timestamp: <b>` +
                            data.result.datetime +
                            `</b> (UTC)</li>` +
                            `<li>` +
                            `<i class='fas fa-fw card-blue is-size-7 fa-user-tie'></i>` +
                            `&nbsp;Sender: <b>` +
                            `<a href="?search=` +
                            data.result.sender + `">` +
                            data.result.sender +
                            `</a></b></li>` +
                            `<li>` +
                            `<i class='fas fa-fw card-orange is-size-7 fa-user'></i>` +
                            `&nbsp;Recipient: <b>` +
                            `<a href="?search=` +
                            data.result.recipient + `">` +
                            data.result.recipient +
                            `</a></b></li>` +
                            `<li>` +
                            `<i class='fas fa-fw card-purple is-size-7 fa-receipt'></i>` +
                            `&nbsp;Amount: <b>` +
                            round_to(10, data.result.amount) +
                            ` DUCO</b> (≈$` +
                            round_to(4, amount_usd) +
                            `)</li>` +
                            `<li>` +
                            `<i class='fas fa-fw card-turquoise is-size-7 fa-envelope'></i>` +
                            `&nbsp;Message: <b><i>` +
                            data.result.memo +
                            `</b></i></li></ul>`

                        $("#transactionstext2").html(found_transaction_html);
                    }
                })
        }
        if (cont) {
            fetch('https://server.duinocoin.com/balances/' + hashToBeFound)
                .then(response => response.json())
                .then(data => {
                    //console.log(data)
                    if (data.success == true) {
                        cont = false;
                        let amount_usd = data.result.balance * duco_price;

                        found_user_html = `<ul><li>` +
                            `<i class='fas fa-fw card-green is-size-7 fa-info-circle'></i>` +
                            `&nbsp;Type: <b>wallet</b></li>` +
                            `<li>` +
                            `<i class='fas fa-fw card-red is-size-7 fa-user-tie'></i>` +
                            `&nbsp;Username: <b>` +
                            `<a href="?search=` +
                            hashToBeFound + `">` +
                            hashToBeFound +
                            `</a></b></li>` +
                            `<li>` +
                            `<i class='fas fa-fw card-blue is-size-7 fa-wallet'></i>` +
                            `&nbsp;Balance: <b>` +
                            round_to(10, data.result.balance) +
                            ` DUCO</b> (≈$` +
                            round_to(4, amount_usd) +
                            `)</li></ul>`;

                        $("#transactionstext2").html(found_user_html);

                    }
                })
        }
        if (cont) {
            fetch('https://server.duinocoin.com/foundBlocks.json')
                .then(response => response.json())
                .then(data => {
                    let found = data[hashToBeFound]
                    if (hashToBeFound != "" && found != "" && found != undefined) {
                        cont = false;
                        let amount_usd = found["Amount generated"] * duco_price;
                        if (hashToBeFound.length == 40) block_type = "DUCO-S1";
                        else block_type = "XXHASH"

                        found["Finder"] = found["Finder"].replace("(DUCO-S1)", "")
                        found["Finder"] = found["Finder"].replace("(XXHASH)", "")

                        found_block_html = `<ul><li>` +
                            `<i class='fas fa-fw card-green is-size-7 fa-info-circle'></i>` +
                            `&nbsp;Type: <b>block</b> (` +
                            block_type +
                            `)</li>` +
                            `<li>` +
                            `<i class='fas fa-fw card-red is-size-7 fa-clock'></i>` +
                            `&nbsp;Timestamp: <b>` +
                            found["Date"] +
                            ` ` +
                            found["Time"] +
                            `</b> (UTC)</li>` +
                            `<li>` +
                            `<i class='fas fa-fw card-blue is-size-7 fa-user-tie'></i>` +
                            `&nbsp;Finder: <b>` +
                            `<a href="?search=` +
                            found["Finder"] + `">` +
                            found["Finder"] +
                            `</a></b></li>` +
                            `</b></li>` +
                            `<li><i class='fas card-orange is-size-7 fa-fw fa-receipt'></i>` +
                            `&nbsp;Generated: <b>` +
                            round_to(2, found["Amount generated"]) +
                            ` DUCO</b> (≈$` + round_to(4, amount_usd) + `)</li></ul>`;

                        $("#transactionstext2").html(found_block_html);
                    }
                })
        }
    }

    // TODO fix
    /*function pulse_update() {
        fetch("https://cors.bridged.cc/http://149.91.88.18:6001/statistics")
            .then(response => response.json())
            .then(data => {
                update_element("pulse_connections", data["connections"]);
                update_element("pulse_cpu", round_to(1, data["cpu"]) + "%");
                update_element("pulse_ram", round_to(1, data["ram"]) + "%");
            })
    }

    pulse_update();
    window.setInterval(pulse_update, 7500);*/ // Refresh every 7.5s because we use a proxy
    update_stats();
    window.setInterval(update_stats, 2500); // Refresh every 2.5s

    last_explorer_hashes();
    window.setInterval(last_explorer_hashes, 5000); // Refresh every 5s

    window.setInterval(search, 15000);

    // Target Blank
    function targetBlank() {
        let a = document.getElementsByTagName('a');
        for (let i = 0; i < a.length; i++) {
            a[i].setAttribute('target', '_blank');
        }
    }
    targetBlank();
});