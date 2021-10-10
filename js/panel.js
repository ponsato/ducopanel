let loggedIn = false;
let balance = 0;
let curr_bal = 0;
let profitcheck = 0;
let duco_price = 0.0065;
let daily_average = [];
let oldb = 0;
let total_hashrate = 0;
let start = Date.now();
let sending = false;
let timestamps = [];
let balances = [];
let username;
let transaction_limit = 5;
let first_launch = true;
let hashToBeFound;

window.addEventListener('load', function() {
    // RANDOM BACKGROUND
    const bg_list = [
        'backgrounds/yenn-sea-1.jpg',
        'backgrounds/yenn-sea-2.jpg',
        'backgrounds/yenn-mountains-1.jpg',
        'backgrounds/hge-sea-1.jpg'
    ]

    const num = Math.floor(Math.random() * bg_list.length)
    document.body.background = bg_list[num];

    fetch('https://duco.sytes.net/ducostats.json')
        .then(response => response.json())
        .then(data => {
            if (data["api"]["online"])
                api_status =
                    `<div class="column">
                    <div class="icon-text">
                        <span class="icon has-text-success">
                            <i class="fas fa-check-square"></i>
                        </span>
                        <b>REST API</b>
                    </div>
                    <p class="block">
                        Operational since ` +
                    new Date(data["api"]["since"] * 1000).toLocaleDateString("pl-PL") + `
                    </p>
                </div>`;
            else
                api_status =
                    `<div class="column">
                    <div class="icon-text">
                        <span class="icon has-text-warning">
                            <i class="fas fa-exclamation-triangle"></i>
                        </span>
                        <b>REST API</b>
                    </div>
                    <p class="block has-text-weight-bold">
                        Possible problems with the wallet and external sites since ` +
                    new Date(data["api"]["since"] * 1000).toLocaleDateString("pl-PL") + `
                        ${new Date(data["api"]["since"] * 1000).toLocaleTimeString("pl-PL")}
                    </p>
                </div>`;

            if (data["vps"]["online"])
                vps_status =
                    `<div class="column">
                    <div class="icon-text">
                        <span class="icon has-text-success">
                            <i class="fas fa-check-square"></i>
                        </span>
                        <b>Master server</b>
                    </div>
                    <p class="block">
                        Operational since
                        ${new Date(data["vps"]["since"] * 1000).toLocaleDateString("pl-PL")}
                    </p>
                </div>`;
            else
                vps_status =
                    `<div class="column">
                    <div class="icon-text">
                        <span class="icon has-text-warning">
                            <i class="fas fa-exclamation-triangle"></i>
                        </span>
                        <b>Master server</b>
                    </div>
                    <p class="block has-text-weight-bold">
                        Possible problems with pools syncing and transactions since ` +
                    new Date(data["vps"]["since"] * 1000).toLocaleDateString("pl-PL") + `
                        ${new Date(data["vps"]["since"] * 1000).toLocaleTimeString("pl-PL")}
                    </p>
                </div>`;

            if (data["node"]["online"])
                pulse_status =
                    `<div class="column">
                    <div class="icon-text">
                        <span class="icon has-text-success">
                            <i class="fas fa-check-square"></i>
                        </span>
                        <b>Pulse Pool</b>
                    </div>
                    <p class="block">
                        Operational since ` +
                    new Date(data["node"]["since"] * 1000).toLocaleDateString("pl-PL") + `
                    </p>
                </div>`;
            else
                pulse_status =
                    `<div class="column">
                    <div class="icon-text">
                        <span class="icon has-text-warning">
                            <i class="fas fa-exclamation-triangle"></i>
                        </span>
                        <b>Pulse Pool</b>
                    </div>
                    <p class="block has-text-weight-bold">
                        Possible problems with mining since ` +
                    new Date(data["node"]["since"] * 1000).toLocaleDateString("pl-PL") + `
                        ${new Date(data["node"]["since"] * 1000).toLocaleTimeString("pl-PL")}
                    </p>
                </div>`;

            if (data["node2"]["online"])
                star_status =
                    `<div class="column">
                    <div class="icon-text">
                        <span class="icon has-text-success">
                            <i class="fas fa-check-square"></i>
                        </span>
                        <b>Star Pool</b>
                    </div>
                    <p class="block">
                        Operational since ` +
                    new Date(data["node2"]["since"] * 1000).toLocaleDateString("pl-PL") + `
                    </p>
                </div>`;
            else
                star_status =
                    `<div class="column">
                    <div class="icon-text">
                        <span class="icon has-text-warning">
                            <i class="fas fa-exclamation-triangle"></i>
                        </span>
                        <b>Star Pool</b>
                    </div>
                    <p class="block has-text-weight-bold">
                        Possible problems with mining since ` +
                    new Date(data["node2"]["since"] * 1000).toLocaleDateString("pl-PL") + `
                        ${new Date(data["node2"]["since"] * 1000).toLocaleTimeString("pl-PL")}
                    </p>
                </div>`;

            if (data["node3"]["online"] === true)
                beyond_status =
                    `<div class="column">
                    <div class="icon-text">
                        <span class="icon has-text-success">
                            <i class="fas fa-check-square"></i>
                        </span>
                        <b>Beyond Pool</b>
                    </div>
                    <p class="block">
                        Operational since ` +
                    new Date(data["node3"]["since"] * 1000).toLocaleDateString("pl-PL") + `
                    </p>
                </div>`;
            else
                beyond_status =
                    `<div class="column">
                    <div class="icon-text">
                        <span class="icon has-text-warning">
                            <i class="fas fa-exclamation-triangle"></i>
                        </span>
                        <b>Beyond Pool</b>
                    </div>
                    <p class="block has-text-weight-bold">
                        Possible problems with mining since ` +
                    new Date(data["node3"]["since"] * 1000).toLocaleDateString("pl-PL") + `
                        ${new Date(data["node3"]["since"] * 1000).toLocaleTimeString("pl-PL")}
                    </p>
                </div>`;

            let final_html = api_status + vps_status + pulse_status + star_status + beyond_status;
            $("#server-status").html(final_html);
        })

    fetch('https://duco.sytes.net/ducorewards.json')
        .then(response => response.json())
        .then(data => {
            $("#avr_rewards").html(`~ ${Math.round(data.avr.dailycoins)} ᕲ daily`)
            $("#esp8266_rewards").html(`~ ${Math.round(data.esp8266.dailycoins)} ᕲ daily`)
            $("#esp32_rewards").html(`~ ${Math.round(data.esp32.dailycoins)} ᕲ daily`)
            $("#pc_rewards").html(`~ ${Math.round(data["pc/pi"].dailycoins*1.2)} ᕲ daily`)
        })

    const data = {
        labels: timestamps,
        datasets: [{
            data: balances,
        }]
    };

    const config = {
        options: {
            backgroundColor: "#e67e22",
            borderColor: "#e67e22",
            plugins: {
                legend: {
                    display: false
                }
            },
            elements: {
                line: {
                    tension: 0
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
    }

    function change_theme(e) {
        const radiate = $('#radiate');
        const frosted = $('#frosted');
        let theme = e.target.value;

        switch (theme) {
            case 'frosted':
                frosted.attr('disabled', false);
                radiate.attr('disabled', true);
                document.body.background = bg_list[num];
                setcookie("theme", 'frosted', 30);
                break;
            case 'radiance':
                radiate.attr('disabled', false);
                frosted.attr('disabled', true);
                document.body.background = "none";
                setcookie("theme", 'radiance', 30);
                break;
            case 'light':
                radiate.attr('disabled', true);
                frosted.attr('disabled', true);
                document.body.background = "none";
                setcookie("theme", 'light', 30);
                break;
        }
    }

    // PRICE FROM API
    const get_duco_price = () => {
        fetch("https://server.duinocoin.com/api.json")
            .then(response => response.json())
            .then(data => {
                $("#ducousd").html(" $" + round_to(5, data["Duco price"]));
                duco_price = round_to(5, data["Duco price"]);

                $("#ducousd_xmg").html("$" + round_to(5, data["Duco price XMG"]));
                $("#ducousd_bch").html("$" + round_to(5, data["Duco price BCH"]));
                $("#ducousd_trx").html("$" + round_to(5, data["Duco price TRX"]));
                $("#ducousd_rvn").html("$" + round_to(5, data["Duco price RVN"]));

                $("#ducousd_xrp").html("$" + round_to(5, data["Duco price XRP"]));
                $("#ducousd_dgb").html("$" + round_to(5, data["Duco price DGB"]));
                $("#ducousd_nano").html("$" + round_to(5, data["Duco price NANO"]));
                $("#ducousd_fjc").html("$" + round_to(5, data["Duco price FJC"]));

                $("#duco_nodes").html("$" + round_to(5, data["Duco Node-S price"]));
                $("#duco_justswap").html("$" + round_to(5, data["Duco JustSwap price"]));
                $("#duco_pancake").html("$" + round_to(5, data["Duco PancakeSwap price"]));
                $("#duco_sushi").html("$" + round_to(5, data["Duco SushiSwap price"]));
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

    $('#txcount').on('change', function() {
        transaction_limit = this.value;
        document.getElementById('txsel').classList.add("is-loading");
    });

    //USER DATA FROM API
    const user_data = (username, first_open) => {
        fetch(`https://server.duinocoin.com/users/${encodeURIComponent(username)}?limit=${transaction_limit}`)
            .then(response => response.json())
            .then(data => {
                data = data.result;
                balance = parseFloat(data.balance.balance);
                let balanceusd = balance * duco_price;

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
                if (first_open) {
                    $("#balance").html(balance + " DUCO");
                    $("#balance_miner").html(balance + " DUCO");
                } else {
                    update_element("balance", balance + " DUCO");
                    update_element("balance_miner", balance + " DUCO");
                }

                balanceusd = round_to(4, balanceusd);
                if (first_open) {
                    $("#balanceusd").html("≈ $" + balanceusd);
                } else {
                    update_element("balanceusd", "≈ $" + balanceusd);
                }
                if (first_open) {
                    verified = data.balance.verified;
                    if (verified === "yes") {
                        $("#verify").html(
                            `<button disabled class="button mr-2 has-text-success-dark">
                                <i class="fa fa-check icon"></i>
                                <span id="verified">
                                    Your account is verified
                                </span>
                            </button>`);
                    } else {
                        $("#verify").html(
                            `<a href="https://server.duinocoin.com/verify.html" class="button mr-2 has-text-danger-dark" target="_blank">
                                <i class="fa fa-info-circle icon"></i>
                                <span id="verified">
                                    <b>Verify your account</b>
                                </span>
                            </a>`);
                    }
                }

                var user_miners = data.miners;
                let miner_list = {
                    "AVR": [],
                    "ESP": [],
                    "PC": [],
                    "Other": []
                };
                let user_miners_html = "";
                let threaded_miners = {};

                if (user_miners.length) {
                    for (let miner in user_miners) {
                        let miner_wallet_id = user_miners[miner]["wd"];
                        if (!miner_wallet_id) miner_wallet_id = Math.random();
                        const miner_hashrate = user_miners[miner]["hashrate"];
                        const miner_rejected = user_miners[miner]["rejected"];
                        const miner_accepted = user_miners[miner]["accepted"];

                        if (!threaded_miners[miner_wallet_id]) {
                            threaded_miners[miner_wallet_id] = user_miners[miner];
                            threaded_miners[miner_wallet_id]["threads"] = 1;
                            continue;
                        } else if (threaded_miners[miner_wallet_id]) {
                            threaded_miners[miner_wallet_id]["hashrate"] += miner_hashrate;
                            threaded_miners[miner_wallet_id]["rejected"] += miner_rejected;
                            threaded_miners[miner_wallet_id]["accepted"] += miner_accepted;
                            threaded_miners[miner_wallet_id]["threads"] += 1;
                            continue;
                        }
                    }

                    for (let miner in threaded_miners) {
                        miner_hashrate = threaded_miners[miner]["hashrate"];
                        miner_identifier = threaded_miners[miner]["identifier"];
                        miner_software = threaded_miners[miner]["software"];
                        miner_diff = threaded_miners[miner]["diff"];
                        miner_rejected = threaded_miners[miner]["rejected"];
                        miner_accepted = threaded_miners[miner]["accepted"];
                        miner_sharetime = threaded_miners[miner]["sharetime"];
                        miner_pool = threaded_miners[miner]["pool"];
                        miner_algo = threaded_miners[miner]["algorithm"];
                        miner_count = threaded_miners[miner]["threads"];

                        if (miner_identifier === "None") {
                            miner_name = miner_software;
                            miner_soft = "";
                        } else {
                            miner_name = miner_identifier;
                            miner_soft = " &bull; " + miner_software;
                        }

                        let diffString = scientific_prefix(miner_diff)
                        let accepted_rate = round_to(1, (miner_accepted / (miner_accepted + miner_rejected) * 100))

                        let miner_type = "Other";
                        if (miner_software.includes("ESP8266")) {
                            icon = "fa-rss";
                            color = "#F5515F";
                            miner_type = "ESP";
                        } else if (miner_software.includes("ESP32")) {
                            icon = "fa-wifi";
                            color = "#5f27cd";
                            miner_type = "ESP";
                        } else if (miner_software.includes("AVR") || miner_software.includes("I2C")) {
                            icon = "fa-microchip";
                            color = "#B33771";
                            miner_type = "AVR";
                        } else if (miner_software.includes("PC")) {
                            icon = "fa-laptop";
                            color = "#F97F51";
                            miner_type = "PC";
                        } else if (miner_software.includes("Web")) {
                            icon = "fa-globe";
                            color = "#009432";
                            miner_type = "PC";
                        } else if (miner_software.includes("Android")) {
                            icon = "fa-mobile";
                            color = "#fa983a";
                        } else {
                            icon = "fa-question-circle";
                            color = "#16a085";
                        }

                        let accept_color = "has-text-warning-dark";
                        if (accepted_rate < 50) {
                            accept_color = "has-text-danger-dark";
                        } else if (accepted_rate > 95) {
                            accept_color = "has-text-success-dark";
                        }

                        let thread_string = "";
                        if (miner_count > 1) {
                            thread_string = `(${miner_count} threads)`;
                        }

                        miner_list[miner_type].push(`
                            <div class="column" style="min-width:50%">
                                <p class="title is-size-6">
                                    <i class="fas ${icon} fa-fw" style="color: ${color}"></i>
                                    <span class="has-text-weight-normal">
                                         ${miner_name}
                                    </span>
                                    <span class="has-text-weight-normal">
                                        &bull;
                                    </span>
                                    <span>
                                        ${scientific_prefix(miner_hashrate)}H/s
                                    </span>
                                    <span class="has-text-weight-normal">
                                        &bull;
                                    </span>
                                    <b class="${accept_color}">
                                        ${accepted_rate}%
                                    </b>
                                    <span class="has-text-weight-normal">
                                        correct shares
                                    </span>
                                    <span class="has-text-info-dark">
                                        ${thread_string}
                                    </span>
                                </p>
                                <p class="subtitle is-size-7">
                                    <b>
                                        ${miner_accepted}/${(miner_accepted + miner_rejected)}
                                    </b>
                                    total shares
                                    &bull; difficulty 
                                    <b>
                                        ${diffString}
                                    </b>
                                    (${miner_sharetime.toFixed(2)}s)
                                    &bull; node:
                                    <span class="has-text-info-dark">
                                        ${miner_pool}
                                    </span>
                                    &bull; algo:
                                    <span class="has-text-warning-dark">
                                        ${miner_algo}
                                    </span>
                                    <span>
                                        ${miner_soft}
                                    </span>
                                </p>
                            </div>`);
                        total_hashrate += miner_hashrate;
                    }

                    all_miners = 0
                    for (key in miner_list) {
                        if (miner_list[key].length) {
                            user_miners_html += `<div class="divider column is-full">${key} (${miner_list[key].length})</div>`;
                            for (worker in miner_list[key]) {
                                user_miners_html += miner_list[key][worker];
                            }
                            all_miners += miner_list[key].length
                        }
                    }

                    if (first_open) $("#minercount").html(`(${all_miners})`);
                    else update_element("minercount", `(${all_miners})`);

                    if (first_open) $("#total_hashrate").html(scientific_prefix(total_hashrate) + "H/s");
                    else update_element("total_hashrate", scientific_prefix(total_hashrate) + "H/s");

                    $("#miners").html(user_miners_html);
                    total_hashrate = 0;
                } else {
                    if (first_open) {
                        $("#miners").html(`
                               <div class="column is-full">
                                   <p class='title is-size-6'>
                                       No miners detected
                                   </p>
                                   <p class='subtitle is-size-6'>
                                       If you have turned them on recently, 
                                       it will take a minute or two until their stats will appear here.
                                   </p>
                               </div>`);

                    } else {
                        update_element("miners", `
                               <div class="column is-full">
                                   <p class='title is-size-6'>
                                       No miners detected
                                   </p>
                                   <p class='subtitle is-size-6'>
                                       If you have turned them on recently, 
                                       it will take a minute or two until their stats will appear here.
                                   </p>
                               </div>`);
                    }
                }

                user_transactions = data.transactions.reverse();
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

                        if (transaction_memo == "None")
                            transaction_memo = "";
                        else
                            transaction_memo = "\"" + transaction_memo + "\""

                        if (transaction_sender == username) {
                            thtml = `
                            <div class="column is-full">
                                <p class="title is-size-6">
                                    <i class="fa fa-arrow-right fa-fw has-text-danger"></i>
                                    <span>
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
                                    <span class="has-text-weight-normal">
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
                                    <i class="fa fa-arrow-left fa-fw has-text-success"></i>
                                    <span>
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
                                    <span class="has-text-weight-normal">
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
                    update_element("transactions_table", transactions_html);
                } else
                    update_element("transactions_table", `<div class="column is-full">
                    <p class="title is-size-6">
                        No transactions yet or they're temporarily unavailable
                    </p>
                    <p class='subtitle is-size-6'>
                        If you have sent funds recently,
                        it will take a few seconds until the transaction will appear here.
                    </p>
                </div>`);
            }).then(function() {
                if (update_element("transactioncount", user_transactions.length)) {
                    document.getElementById('txsel').classList.remove("is-loading");
                }
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
            daily = round_to(2, daily)
            update_element("estimatedprofit", `
                <i class="far fa-star"></i>
                Earning about <b>` + daily + ` ᕲ</b> daily`);
            update_element("estimatedprofit_miner", `
                <i class="far fa-star"></i>
                Earning about <b>` + daily + ` ᕲ</b> daily`);
            update_element("estimatedprofit_pcminer", `
                <i class="far fa-star"></i>
                Earning about <b>` + daily + ` ᕲ</b> daily`);

            avgusd = round_to(2, daily * duco_price);
            update_element("estimatedprofitusd", "(≈ $" + avgusd + ")");
            update_element("estimatedprofitusd_miner", "(≈ $" + avgusd + ")");
            update_element("estimatedprofitusd_pcminer", "(≈ $" + avgusd + ")");
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

    // LOGOUT
    document.getElementById('logout').onclick = function() {
        delcookie("username");
        delcookie("password");
        window.location.reload(true);
    }

    // MAIN WALLET SCRIPT
    document.getElementById('loginbutton').onclick = function() {
        let username = $('#usernameinput').val()
        let password = $('#passwordinput').val()

        if (username && password) {
            document.getElementById('loginbutton').classList.add("is-loading")

            document.getElementById('send').onclick = function() {
                let recipient = document.getElementById('recipientinput').value
                let amount = document.getElementById('amountinput').value
                let memo = document.getElementById('memoinput').value

                if (recipient && amount) {
                    document.getElementById("send").classList.add("is-loading");
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
                                    $('#recipientinput').val('');
                                    $('#amountinput').val('');
                                    $('#memoinput').val('');

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
                            }
                        })
                }
            }

            $.getJSON('https://server.duinocoin.com/auth/' +
                encodeURIComponent(username) +
                '?password=' +
                encodeURIComponent(password),
                function(data) {
                    if (data.success == true) {
                        if ($('#remember').is(":checked")) {
                            setcookie("password", password, 30);
                            setcookie("username", username, 30);
                        }

                        $("#login").fadeOut(250, function() {
                            document.getElementById('loginbutton').classList.remove("is-loading")
                            $("#user").html("<b id='username'>" + username + "</b>");
                            user_data(username, true);
                            window.setInterval(() => {
                                user_data(username, false);
                            }, 10 * 1000);

                            get_duco_price();
                            window.setInterval(() => {
                                get_duco_price();
                            }, 30 * 1000);
                            document.getElementById('forUsername').innerText = username;
                            hashToBeFound = username;
                            search(hashToBeFound);
                            $("#panel").fadeIn(250);

                            $('iframe#news_iframe').attr('src', 'https://server.duinocoin.com/news.html');

                            // THEME SWITCHER
                            let themesel = document.getElementById('themesel');
                            themesel.addEventListener('input', change_theme);

                            document.getElementById('changepassbtn').onclick = function() {
                                let modal_success = document.querySelector('#modal_changepass');
                                document.querySelector('html').classList.add('is-clipped');
                                modal_success.classList.add('is-active');
                                document.querySelector('#modal_changepass .delete').onclick = function() {
                                    document.querySelector('html').classList.remove('is-clipped');
                                    modal_success.classList.remove('is-active');
                                }
                            }

                            document.getElementById('changepassconf').onclick = function() {
                                changepass(username);
                            }

                            function changepass(username) {
                                old_pass = document.getElementById("oldpass").value;
                                new_pass = document.getElementById("newpass").value;
                                new_pass_conf = document.getElementById("newpass_conf").value;

                                if (new_pass != new_pass_conf) {
                                    update_element("changepass_text", "New passwords don't match")
                                } else {
                                    fetch("https://server.duinocoin.com/changepass/" + encodeURIComponent(username) +
                                        "?password=" + encodeURIComponent(old_pass) +
                                        "&newpassword=" + encodeURIComponent(new_pass))
                                        .then(response => response.json())
                                        .then(data => {
                                            if (data.success) {
                                                update_element("changepass_text", data.result);
                                                $('#oldpass').val('');
                                                $('#newpass').val('');
                                                $('#newpass_conf').val('');
                                            } else {
                                                update_element("changepass_text", data.message);
                                            }
                                        });
                                }
                            }

                            document.getElementById('wrapbtn').onclick = function() {
                                let modal_success = document.querySelector('#modal_wrap');
                                document.querySelector('html').classList.add('is-clipped');
                                modal_success.classList.add('is-active');
                                document.querySelector('#modal_wrap .delete').onclick = function() {
                                    document.querySelector('html').classList.remove('is-clipped');
                                    modal_success.classList.remove('is-active');
                                }
                            }

                            document.getElementById('wrapconf').onclick = function() {
                                wrap(username, password);
                            }

                            function wrap(username, password) {
                                amount = document.getElementById("wrap_amount").value;
                                address = document.getElementById("wrap_address").value;

                                fetch("https://server.duinocoin.com/wduco_wrap/" + encodeURIComponent(username) +
                                    "?password=" + encodeURIComponent(password) +
                                    "&address=" + encodeURIComponent(address) +
                                    "&amount=" + encodeURIComponent(amount))
                                    .then(response => response.json())
                                    .then(data => {
                                        if (data.success) {
                                            update_element("wrap_text", "<span class='has-text-success-dark'>" + data.result + "</span>");
                                            $('#wrap_amount').val('');
                                            $('#wrap_address').val('');
                                        } else {
                                            update_element("wrap_text", "<span class='has-text-danger-dark'>" + data.message + "</span>");
                                        }
                                    });
                            }

                        });
                    } else {
                        window.setTimeout(() => {
                            $('#usernameinput').val('');
                            $('#passwordinput').val('');

                            let modal_error = document.querySelector('#modal_error');
                            document.querySelector('#modal_error .modal-card-body .content p').innerHTML =
                                `<b>An error has occurred while logging in: </b>` + data.message + `</b><br></p>`;
                            document.querySelector('html').classList.add('is-clipped');
                            modal_error.classList.add('is-active');

                            document.querySelector('#modal_error .delete').onclick = function() {
                                document.querySelector('html').classList.remove('is-clipped');
                                modal_error.classList.remove('is-active');
                            }
                            document.getElementById('loginbutton').classList.remove("is-loading")
                        }, 150);
                    }
                }).fail(function(jqXHR, textStatus, errorThrown) {
                update_element("logintext", "Wallet API is unreachable");
                document.getElementById('loginbutton').classList.remove("is-loading")
                setTimeout(() => {
                    update_element("logintext", "");
                }, 5000);
            })
        }
    }

    if (getcookie("theme")) {
        cookie = getcookie("theme");
        $("#themesel").val(cookie);
        change_theme({ "target": { "value": cookie } });
    }

    if (getcookie("password") && getcookie("username")) {
        $('#usernameinput').val(getcookie("username"));
        $('#passwordinput').val(getcookie("password"));
        $('#loginbutton').click();
    }

    $("#loader-wrapper").fadeOut();

    function setcookie(name, value, days) {
        if (days) {
            var date = new Date();
            date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
            var expires = "; expires=" + date.toGMTString();
        } else
            var expires = "";
        document.cookie = name + "=" + value + expires + ";path=/";
    }

    function getcookie(cname) {
        let name = cname + "=";
        let decodedCookie = decodeURIComponent(document.cookie);
        let ca = decodedCookie.split(';');
        for (let i = 0; i < ca.length; i++) {
            let c = ca[i];
            while (c.charAt(0) == ' ') {
                c = c.substring(1);
            }
            if (c.indexOf(name) == 0) {
                return c.substring(name.length, c.length);
            }
        }
        return undefined;
    }

    function delcookie(name) {
        document.cookie = name + '=; Max-Age=-99999999;';
    }

    // Footer
    //document.getElementById("pageloader").setAttribute('class', "pageloader is-primary"); // After page is loaded

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



    function update_element(element, value) {
        // Nicely fade in the new value if it changed
        element = "#" + element;
        old_value = $(element).html()

        if ($("<div>" + value + "</div>").text() != old_value) {
            $(element).fadeOut('fast', function() {
                $(element).html(value);
                $(element).fadeIn('fast');
            });
            return true;
        }
        return false;
    }


    function round_to(precision, value) {
        power_of_ten = 10 ** precision;
        return Math.round(value * power_of_ten) / power_of_ten;
    }

    document.querySelector('#loadworkers').onclick =
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
                                `<li class="has-text-success">
                                  <i class="fas fa-check"></i>
                                  <span>` +
                                worker.User +
                                `</span><b class="tag">` +
                                worker.Miners +
                                `</b></li>`;
                        } else {
                            workers +=
                                `<li class="has-text-danger">
                                  <i class="fas fa-times-circle"></i>
                                  <span>` +
                                worker.User +
                                `</span>
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
                    let sorted_workers = [];
                    for (worker in data["Active workers"]) {
                        sorted_workers.push({
                            "User": worker,
                            "Miners": data["Active workers"][worker]
                        })
                    }
                    sorted_workers.sort((a, b) => b.Miners - a.Miners);
                    for (let i = 0; i < sorted_workers.length; i++) {
                        let worker = sorted_workers[i];
                        workers += `<li>` + worker.User + `<span class="tag">` + worker.Miners + ` worker(s)</span></li>`;
                        worker_counter += worker.Miners;
                        counter++;
                        //if (counter > 100) break;
                    }
                    workers += `</ul>`;
                    $("#workers").html(workers);
                    $("#allworkers").text("(" + worker_counter + " workers on " + counter + " accounts)");
                }
            })
    }


    function last_explorer_hashes() {
        fetch("https://server.duinocoin.com/transactions.json")
            .then(response => response.json())
            .then(data => {

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
            .then(response => response.json())
            .then(data => {
                let last = [];
                for (hash in data) {
                    last.push(hash);
                }

                block_hashes_html = "<strong>Last blocks:</strong><br>";
                for (hash in last.reverse()) {
                    if (hash >= 5) break
                    this_hash = last[hash];
                    if (this_hash.length == 40) {
                        block_hashes_html += "<span class='block2 monospace' target='_blank'>" + this_hash.substring(0, 14) + "</span><br>";
                    } else {
                        block_hashes_html += "<span class='block1 monospace' target='_blank'>" + this_hash.substring(0, 14) + "</span><br>";
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
    function search() {
        let cont = true;
        if (hashToBeFound) {
            console.log(hashToBeFound);
            $("#transactionstext1").html(`Results for: <a class="gradienttext" onclick="link_search('${hashToBeFound}')">${hashToBeFound}</a></span>`);
        }
        if (cont) {
            $.getJSON("https://server.duinocoin.com/transactions/" + hashToBeFound, function(data) {
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
                        `<a onclick="link_search('${data.result.sender}')">` +
                        data.result.sender +
                        `</a></b></li>` +
                        `<li>` +
                        `<i class='fas fa-fw card-orange is-size-7 fa-user'></i>` +
                        `&nbsp;Recipient: <b>` +
                        `<a onclick="link_search('${data.result.recipient}')">` +
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

                    update_element("transactionstext2", found_transaction_html);
                }
            })
                .fail(function(error) {
                    console.log(error.responseText);
                    if (error.responseText.includes("500")) error = "500 - internal server error";
                    else if (error.responseText.includes("429")) error = "429 - too many requests (slow down)";
                    else if (error.responseText.includes("404")) error = "404 - nothing interesting found";
                    found_transaction_html = `<ul class="subtitle"><li>` +
                        `<i class='fas fa-fw card-red is-size-7 fa-info-circle'></i>` +
                        `&nbsp;Error: <b>${error}</b> 🤦‍♀️</li></ul>`;
                    update_element("transactionstext2", found_transaction_html);
                });
        }
        if (cont) {
            $.getJSON('https://server.duinocoin.com/users/' + hashToBeFound, function(data) {
                if (data.success == true) {
                    cont = false;
                    let amount_usd = data.result.balance.balance * duco_price;

                    found_user_html = `<ul><li>` +
                        `<i class='fas fa-fw card-green is-size-7 fa-info-circle'></i>` +
                        `&nbsp;Type: <b>wallet</b></li>` +
                        `<li>` +
                        `<i class='fas fa-fw card-red is-size-7 fa-user-tie'></i>` +
                        `&nbsp;Username: <b>` +
                        `<a onclick="link_search('${hashToBeFound}')">` +
                        hashToBeFound +
                        `</a></b></li>` +
                        `<li>` +
                        `<i class='fas fa-fw card-blue is-size-7 fa-wallet'></i>` +
                        `&nbsp;Balance: <b>` +
                        round_to(10, data.result.balance.balance) +
                        ` DUCO</b> (≈$` +
                        round_to(4, amount_usd) +
                        `)</li>` +
                        `<li>` +
                        `<i class='fas fa-fw card-turquoise is-size-7 fa-check'></i>` +
                        `&nbsp;Verified: <b>` +
                        data.result.balance.verified +
                        `</b></li>` +
                        `<li>` +
                        `<i class='fas fa-fw card-orange is-size-7 fa-calendar'></i>` +
                        `&nbsp;Created: <b>` +
                        data.result.balance.created +
                        `</b></li>`;

                    found_user_html += `<li>` +
                        `<i class='fas fa-fw card-purple is-size-7 fa-cog'></i>` +
                        `&nbsp;Miners <b>(` + data["result"]["miners"].length + `)</b>:</li>` +
                        `<li class='is-size-6'>`;
                    i = 0;
                    if (data["result"]["miners"].length) {
                        for (miner in data["result"]["miners"]) {
                            if (data["result"]["miners"][miner]["identifier"] != "None") {
                                found_user_html += "&nbsp; &nbsp; &nbsp; &bull; <b>" +
                                    data["result"]["miners"][miner]["identifier"] +
                                    "</b> <span class='has-text-grey'>(" +
                                    data["result"]["miners"][miner]["software"] +
                                    ")</span> - " +
                                    data["result"]["miners"][miner]["accepted"] + "/" +
                                    (data["result"]["miners"][miner]["accepted"] + data["result"]["miners"][miner]["rejected"]) +
                                    ", <b>" + get_prefix("H/s", data["result"]["miners"][miner]["hashrate"]) + "</b><br>";
                            } else {
                                found_user_html += "&nbsp; &nbsp; &nbsp; &bull; <b>" + data["result"]["miners"][miner]["software"] + "</b> - " +
                                    data["result"]["miners"][miner]["accepted"] + "/" +
                                    (data["result"]["miners"][miner]["accepted"] + data["result"]["miners"][miner]["rejected"]) +
                                    ", <b>" + get_prefix("H/s", data["result"]["miners"][miner]["hashrate"]) + "</b><br>";
                            }

                            if (i > 10) {
                                found_user_html += "&nbsp; &nbsp; &nbsp; &bull; And " + (data["result"]["miners"].length - i) + " more miner(s)...";
                                break;
                            }
                            i += 1;
                        }
                    } else {
                        found_user_html += "&nbsp; &nbsp; &nbsp; &bull; No miners found for that user";
                    }

                    found_user_html += `<li>` +
                        `<i class='fas fa-fw card-pomegrante is-size-7 fa-receipt'></i>` +
                        `&nbsp;Last 10 transactions:</li>` +
                        `<li class='is-size-6'>`;
                    i = 0;
                    if (data["result"]["transactions"].length) {
                        for (transaction in data["result"]["transactions"].reverse()) {
                            if (data["result"]["transactions"][transaction]["sender"] == data["result"]["balance"]["username"]) {
                                found_user_html += "&nbsp; &nbsp; &nbsp; &bull; " +
                                    "<span class='has-text-grey'>" +
                                    data["result"]["transactions"][transaction]["datetime"] +
                                    "</span><span class='has-text-danger-dark'>" +
                                    " Sent <b>" +
                                    Math.round(data["result"]["transactions"][transaction]["amount"] * 1000) / 1000 +
                                    " DUCO</b></span> to " +
                                    `<a onclick="link_search('${data["result"]["transactions"][transaction]["recipient"]}')">` +
                                    "<b>" +
                                    data["result"]["transactions"][transaction]["recipient"] + "</a></b> " + `<a onclick="link_search('${data["result"]["transactions"][transaction]["hash"]}')">(` + data["result"]["transactions"][transaction]["hash"].substr(data["result"]["transactions"][transaction]["hash"].length - 8) + ")</a><br>"
                            } else {
                                found_user_html += "&nbsp; &nbsp; &nbsp; &bull; " +
                                    "<span class='has-text-grey'>" +
                                    data["result"]["transactions"][transaction]["datetime"] +
                                    "</span><span class='has-text-success-dark'>" +
                                    " Received <b>" +
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
                        found_user_html += "&nbsp; &nbsp; &bull; No transactions found for that user";
                    }

                    found_user_html += "</ul>"

                    update_element("transactionstext2", found_user_html);
                }
            })
                .fail(function(error) {
                    if (error.responseText.includes("500")) error = "500 - internal server error";
                    else if (error.responseText.includes("429")) error = "429 - too many requests (slow down)";
                    else if (error.responseText.includes("404")) error = "404 - nothing interesting found";
                    found_transaction_html = `<ul class="subtitle"><li>` +
                        `<i class='fas fa-fw card-red is-size-7 fa-info-circle'></i>` +
                        `&nbsp;Error: <b>${error}</b> 🤦‍♀️</li></ul>`;
                    update_element("transactionstext2", found_transaction_html);
                });
        }
        if (cont) {
            $.getJSON('https://server.duinocoin.com/foundBlocks.json', function(data) {
                cont = false;
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
                        `<a onclick="link_search('${found["Finder"]}')">` +
                        found["Finder"] +
                        `</a></b></li>` +
                        `</b></li>` +
                        `<li><i class='fas card-orange is-size-7 fa-fw fa-receipt'></i>` +
                        `&nbsp;Generated: <b>` +
                        round_to(2, found["Amount generated"]) +
                        ` DUCO</b> (≈$` + round_to(4, amount_usd) + `)</li></ul>`;

                    update_element("transactionstext2", found_block_html);
                }
            })
                .fail(function(error) {
                    if (error.responseText.includes("500")) error = "500 - internal server error";
                    else if (error.responseText.includes("429")) error = "429 - too many requests (slow down)";
                    else if (error.responseText.includes("404")) error = "404 - nothing interesting found";
                    found_transaction_html = `<ul class="subtitle"><li>` +
                        `<i class='fas fa-fw card-red is-size-7 fa-info-circle'></i>` +
                        `&nbsp;Error: <b>${error}</b> 🤦‍♀️</li></ul>`;
                    update_element("transactionstext2", found_transaction_html);
                });
        }
        if (cont) $("#transactionstext2").text(`Nothing interesting found for your query 🤷`);
    }

    function update_pools() {
        fetch("https://server.duinocoin.com/all_pools")
            .catch(function(error) {
                console.log(error);
            })
            .then(response => response.json())
            .then(data => {
                if (data.success === true) {
                    let pools = {};
                    data.result.forEach(pool => {
                        pools[pool["name"]] = pool;
                    });
                    // Update pool info, add new pools here

                    // Pulse pool
                    try {
                        let pulse1_data = pools["pulse-pool-1"];
                        let pulse2_data = pools["pulse-pool-2"];
                        update_element("pulse_connections1", pools["pulse-pool-1"]["connections"] + pools["pulse-pool-2"]["connections"] + pools["pulse-pool-3"]["connections"] + pools["pulse-pool-4"]["connections"]);

                        update_element("pulse_cpu2", round_to(1, parseFloat(pulse2_data["cpu"])) + "%");
                        update_element("pulse_ram2", round_to(1, parseFloat(pulse2_data["ram"])) + "%");
                    } catch (e) { console.log(e) };

                    // Star pool
                    try {
                        let star1_data = pools["star-pool-1"];
                        update_element("star_connections", star1_data["connections"]);
                        update_element("star_cpu", round_to(1, parseFloat(star1_data["cpu"])) + "%");
                        update_element("star_ram", round_to(1, parseFloat(star1_data["ram"])) + "%");
                    } catch (e) { console.log(e) };

                    // Beyond pool
                    try {
                        let beyond1_data = pools["beyond-pool-1"];
                        let beyond2_data = pools["beyond-pool-3"];
                        update_element("beyond_connections", pools["beyond-pool-1"]["connections"] + pools["beyond-pool-2"]["connections"]);
                        update_element("beyond_cpu", round_to(1, parseFloat(beyond1_data["cpu"])) + "%");
                        update_element("beyond_ram", round_to(1, parseFloat(beyond1_data["ram"])) + "%");

                        update_element("beyond_connections2", pools["beyond-pool-3"]["connections"] + pools["beyond-pool-4"]["connections"]);
                        update_element("beyond_cpu2", round_to(1, parseFloat(beyond2_data["cpu"])) + "%");
                        update_element("beyond_ram2", round_to(1, parseFloat(beyond2_data["ram"])) + "%");
                    } catch (e) { console.log(e) };

                    // Svko pool
                    try {
                        let svko1_data = pools["svko-pool-1"];
                        let svko2_data = pools["svko-pool-2"];

                        update_element("svko_connections", svko2_data["connections"] + svko1_data["connections"]);
                        update_element("svko_cpu", round_to(1, parseFloat(svko1_data["cpu"])) + "%");
                        update_element("svko_ram", round_to(1, parseFloat(svko1_data["ram"])) + "%");
                    } catch (e) { console.log(e) };

                    // Null pool
                    try {
                        let null_data = pools["null-pool-1"];

                        update_element("null_connections", null_data["connections"]);
                        update_element("null_cpu", round_to(1, parseFloat(null_data["cpu"])) + "%");
                        update_element("null_ram", round_to(1, parseFloat(null_data["ram"])) + "%");
                    } catch (e) { console.log(e) };

                    // End of list of pools to update
                }
            })
    }

    function pulse_update() {
        fetch("https://api.codetabs.com/v1/proxy?quest=http://149.91.88.18/statistics_2.json")
            .then(response => response.json())
            .then(data => {
                update_element("pulse_connections1", data["connections"]);
            })

        fetch("https://api.codetabs.com/v1/proxy?quest=http://149.91.88.18/statistics.json")
            .then(response => response.json())
            .then(data => {
                update_element("pulse_connections2", data["connections"]);
                update_element("pulse_cpu2", round_to(1, parseFloat(data["cpu"])) + "%");
                update_element("pulse_ram2", round_to(1, parseFloat(data["ram"])) + "%");
            })
    }

    function star_update() {
        fetch("https://api.codetabs.com/v1/proxy?quest=http://51.158.182.90/statistics.json")
            .then(response => response.json())
            .then(data => {
                update_element("star_connections", data["connections"]);
                update_element("star_cpu", round_to(1, parseFloat(data["cpu"])) + "%");
                update_element("star_ram", round_to(1, parseFloat(data["ram"])) + "%");
            })
    }

    function winner_update() {
        fetch("https://api.allorigins.win/get?url=http://193.164.7.180/statistics.json")
            .then(response => response.json())
            .then(data => {
                data = JSON.parse(data["contents"]);
                update_element("winner_connections", data["connections"]);
            })

        fetch("https://api.allorigins.win/get?url=http://193.164.7.180/statistics_2.json")
            .then(response => response.json())
            .then(data => {
                data = JSON.parse(data["contents"]);
                update_element("winner_connections2", data["connections"]);
                update_element("winner_cpu", round_to(1, parseFloat(data["cpu"])) + "%");
                update_element("winner_ram", round_to(1, parseFloat(data["ram"])) + "%");
            })
    }

    function beyond_update() {
        fetch("https://api.allorigins.win/get?url=http://beyondpool.io/statistics.json")
            .then(response => response.json())
            .then(data => {
                data = JSON.parse(data["contents"]);
                update_element("beyond_connections", data["connections"]);
                update_element("beyond_cpu", round_to(1, parseFloat(data["cpu"])) + "%");
                update_element("beyond_ram", round_to(1, parseFloat(data["ram"])) + "%");
            })
    }

    function get_prefix(symbol, value) {
        value = parseFloat(value);
        if (value / 1000000000 > 0.5)
            value = round_to(2, value / 1000000000) + " G" + symbol;
        else if (value / 1000000 > 0.5)
            value = round_to(2, value / 1000000) + " M" + symbol;
        else if (value / 1000 > 0.5)
            value = round_to(2, value / 1000) + " k" + symbol;
        else
            value = round_to(2, value) + " " + symbol;
        return value;
    }

    update_stats();
    window.setInterval(update_stats, 10000); // Refresh every 10s

    last_explorer_hashes();
    window.setInterval(last_explorer_hashes, 30000); // Refresh every 30s

    update_pools();
    window.setInterval(update_pools, 60000); // Refresh every 30s


    // Target Blank
    function targetBlank() {
        let a = document.getElementsByTagName('a');
        for (let i = 0; i < a.length; i++) {
            a[i].setAttribute('target', '_blank');
        }
    }
    targetBlank();
});