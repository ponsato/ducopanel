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

    function update_element(element, value) {
        $(`#${element}`).html(value);
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
                            `<li class="has-text-success">
                                  <i class="fas fa-check"></i>
                                  <a onclick="link_search('${worker.User}')">` +
                            worker.User +
                            `</a><b class="tag">` +
                            worker.Miners +
                            `</b></li>`;
                    } else {
                        workers +=
                            `<li class="has-text-danger">
                                  <i class="fas fa-times-circle"></i>
                                  <a onclick="link_search('${worker.User}')">` +
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

    function update_stats() {
        fetch("https://server.duinocoin.com/api.json")
            .catch(function(error) {
                console.log(error);
            })
            .then(response => response.json())
            .then(data => {
                duco_price = data["Duco price"];

                update_element("hashrate", data["Pool hashrate"])

                update_element("registeredusers", data["Registered users"])

                update_element("allmined", scientific_prefix(data["All-time mined DUCO"]));

                update_element("watt_usage", data["Net energy usage"])

                update_element("shares", scientific_prefix(data["Mined blocks"]))

                update_element("arduinos", data["Miner distribution"]["Arduino"])

                update_element("esp8266s", data["Miner distribution"]["ESP8266"])

                update_element("esp32s", Math.round(data["Miner distribution"]["ESP32"] / 2))

                update_element("rpis", Math.round(data["Miner distribution"]["RPi"] / 4))

                update_element("cpus", Math.round(data["Miner distribution"]["Web"] +
                    data["Miner distribution"]["CPU"] / 4))

                update_element("phones", Math.round(data["Miner distribution"]["Phone"] / 4))

                update_element("others", data["Miner distribution"]["Other"])

                /* Nodes */

                update_element("master_connections", data["Active connections"])
                update_element("master_ver", data["Server version"])
                update_element("master_cpu", round_to(1, data["Server CPU usage"]) + "%")
                update_element("master_ram", round_to(1, data["Server RAM usage"]) + "%")
                update_element("master_threads", data["Open threads"])
            })
    }


    function last_explorer_hashes() {
        fetch("https://server.duinocoin.com/transactions.json")
            .catch(function(error) {
                console.log(error);
            })
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
            .catch(function(error) {
                console.log(error);
            })
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

    update_stats();
    window.setInterval(update_stats, 10000); // Refresh every 10s

    last_explorer_hashes();
    window.setInterval(last_explorer_hashes, 30000); // Refresh every 30s

    update_pools();
    window.setInterval(update_pools, 60000); // Refresh every 30s

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

    if (to_search.escape()) search(to_search.escape());

    // Target Blank
    function targetBlank() {
        let a = document.getElementsByTagName('a');
        for (let i = 0; i < a.length; i++) {
            a[i].setAttribute('target', '_blank');
        }
    }
    targetBlank();
});