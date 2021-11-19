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