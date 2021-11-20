let loggedIn = false;
let balance = 0;
let curr_bal = 0;
let profitcheck = 0;
let duco_price = 0.0065;
let daily_average = [];
let oldb = 0;
let total_hashrate = 0;
let start = Date.now();
let timestamps = [];
let balances = [];
let username, password;
let notify_shown = false;
let transaction_limit = 5;
let first_launch = true;

const MD5 = function(d) { var r = M(V(Y(X(d), 8 * d.length))); return r.toLowerCase() };

function M(d) { for (var _, m = "0123456789ABCDEF", f = "", r = 0; r < d.length; r++) _ = d.charCodeAt(r), f += m.charAt(_ >>> 4 & 15) + m.charAt(15 & _); return f }

function X(d) { for (var _ = Array(d.length >> 2), m = 0; m < _.length; m++) _[m] = 0; for (m = 0; m < 8 * d.length; m += 8) _[m >> 5] |= (255 & d.charCodeAt(m / 8)) << m % 32; return _ }

function V(d) { for (var _ = "", m = 0; m < 32 * d.length; m += 8) _ += String.fromCharCode(d[m >> 5] >>> m % 32 & 255); return _ }

function Y(d, _) {
    d[_ >> 5] |= 128 << _ % 32, d[14 + (_ + 64 >>> 9 << 4)] = _;
    for (var m = 1732584193, f = -271733879, r = -1732584194, i = 271733878, n = 0; n < d.length; n += 16) {
        var h = m,
            t = f,
            g = r,
            e = i;
        f = md5_ii(f = md5_ii(f = md5_ii(f = md5_ii(f = md5_hh(f = md5_hh(f = md5_hh(f = md5_hh(f = md5_gg(f = md5_gg(f = md5_gg(f = md5_gg(f = md5_ff(f = md5_ff(f = md5_ff(f = md5_ff(f, r = md5_ff(r, i = md5_ff(i, m = md5_ff(m, f, r, i, d[n + 0], 7, -680876936), f, r, d[n + 1], 12, -389564586), m, f, d[n + 2], 17, 606105819), i, m, d[n + 3], 22, -1044525330), r = md5_ff(r, i = md5_ff(i, m = md5_ff(m, f, r, i, d[n + 4], 7, -176418897), f, r, d[n + 5], 12, 1200080426), m, f, d[n + 6], 17, -1473231341), i, m, d[n + 7], 22, -45705983), r = md5_ff(r, i = md5_ff(i, m = md5_ff(m, f, r, i, d[n + 8], 7, 1770035416), f, r, d[n + 9], 12, -1958414417), m, f, d[n + 10], 17, -42063), i, m, d[n + 11], 22, -1990404162), r = md5_ff(r, i = md5_ff(i, m = md5_ff(m, f, r, i, d[n + 12], 7, 1804603682), f, r, d[n + 13], 12, -40341101), m, f, d[n + 14], 17, -1502002290), i, m, d[n + 15], 22, 1236535329), r = md5_gg(r, i = md5_gg(i, m = md5_gg(m, f, r, i, d[n + 1], 5, -165796510), f, r, d[n + 6], 9, -1069501632), m, f, d[n + 11], 14, 643717713), i, m, d[n + 0], 20, -373897302), r = md5_gg(r, i = md5_gg(i, m = md5_gg(m, f, r, i, d[n + 5], 5, -701558691), f, r, d[n + 10], 9, 38016083), m, f, d[n + 15], 14, -660478335), i, m, d[n + 4], 20, -405537848), r = md5_gg(r, i = md5_gg(i, m = md5_gg(m, f, r, i, d[n + 9], 5, 568446438), f, r, d[n + 14], 9, -1019803690), m, f, d[n + 3], 14, -187363961), i, m, d[n + 8], 20, 1163531501), r = md5_gg(r, i = md5_gg(i, m = md5_gg(m, f, r, i, d[n + 13], 5, -1444681467), f, r, d[n + 2], 9, -51403784), m, f, d[n + 7], 14, 1735328473), i, m, d[n + 12], 20, -1926607734), r = md5_hh(r, i = md5_hh(i, m = md5_hh(m, f, r, i, d[n + 5], 4, -378558), f, r, d[n + 8], 11, -2022574463), m, f, d[n + 11], 16, 1839030562), i, m, d[n + 14], 23, -35309556), r = md5_hh(r, i = md5_hh(i, m = md5_hh(m, f, r, i, d[n + 1], 4, -1530992060), f, r, d[n + 4], 11, 1272893353), m, f, d[n + 7], 16, -155497632), i, m, d[n + 10], 23, -1094730640), r = md5_hh(r, i = md5_hh(i, m = md5_hh(m, f, r, i, d[n + 13], 4, 681279174), f, r, d[n + 0], 11, -358537222), m, f, d[n + 3], 16, -722521979), i, m, d[n + 6], 23, 76029189), r = md5_hh(r, i = md5_hh(i, m = md5_hh(m, f, r, i, d[n + 9], 4, -640364487), f, r, d[n + 12], 11, -421815835), m, f, d[n + 15], 16, 530742520), i, m, d[n + 2], 23, -995338651), r = md5_ii(r, i = md5_ii(i, m = md5_ii(m, f, r, i, d[n + 0], 6, -198630844), f, r, d[n + 7], 10, 1126891415), m, f, d[n + 14], 15, -1416354905), i, m, d[n + 5], 21, -57434055), r = md5_ii(r, i = md5_ii(i, m = md5_ii(m, f, r, i, d[n + 12], 6, 1700485571), f, r, d[n + 3], 10, -1894986606), m, f, d[n + 10], 15, -1051523), i, m, d[n + 1], 21, -2054922799), r = md5_ii(r, i = md5_ii(i, m = md5_ii(m, f, r, i, d[n + 8], 6, 1873313359), f, r, d[n + 15], 10, -30611744), m, f, d[n + 6], 15, -1560198380), i, m, d[n + 13], 21, 1309151649), r = md5_ii(r, i = md5_ii(i, m = md5_ii(m, f, r, i, d[n + 4], 6, -145523070), f, r, d[n + 11], 10, -1120210379), m, f, d[n + 2], 15, 718787259), i, m, d[n + 9], 21, -343485551), m = safe_add(m, h), f = safe_add(f, t), r = safe_add(r, g), i = safe_add(i, e)
    }
    return Array(m, f, r, i)
}

function md5_cmn(d, _, m, f, r, i) { return safe_add(bit_rol(safe_add(safe_add(_, d), safe_add(f, i)), r), m) }

function md5_ff(d, _, m, f, r, i, n) { return md5_cmn(_ & m | ~_ & f, d, _, r, i, n) }

function md5_gg(d, _, m, f, r, i, n) { return md5_cmn(_ & f | m & ~f, d, _, r, i, n) }

function md5_hh(d, _, m, f, r, i, n) { return md5_cmn(_ ^ m ^ f, d, _, r, i, n) }

function md5_ii(d, _, m, f, r, i, n) { return md5_cmn(m ^ (_ | ~f), d, _, r, i, n) }

function safe_add(d, _) { var m = (65535 & d) + (65535 & _); return (d >> 16) + (_ >> 16) + (m >> 16) << 16 | 65535 & m }

function bit_rol(d, _) { return d << _ | d >>> 32 - _ }


function component_to_hex(c) {
    /* https://stackoverflow.com/questions/5623838/rgb-to-hex-and-hex-to-rgb */
    var hex = c.toString(16);
    return hex.length == 1 ? "0" + hex : hex;
};

function get_user_color(username) {
    /* https://www.cluemediator.com/create-a-random-color-based-on-a-string-using-javascript */
    const firstAlphabet = username.charAt(0).toLowerCase();
    const asciiCode = firstAlphabet.charCodeAt(0);
    const colorNum = asciiCode.toString() + asciiCode.toString() + asciiCode.toString();

    let num = Math.round(0xffffff * parseInt(colorNum));
    let r = num >> 16 & 255;
    let g = num >> 8 & 255;
    let b = num & 255;

    return component_to_hex(r) + component_to_hex(g) + component_to_hex(b);
};


const inputs = document.querySelectorAll(".input");

function changepass() {
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

function send() {
    let recipient = document.getElementById('recipientinput').value
    let amount = document.getElementById('amountinput').value
    let memo = document.getElementById('memoinput').value

    if (recipient && amount) {
        document.getElementById("send_confirm").classList.add("is-loading");
        $.getJSON('https://server.duinocoin.com/transaction/' +
            '?username=' + username +
            "&password=" + encodeURIComponent(password) +
            "&recipient=" + recipient +
            "&amount=" + amount +
            "&memo=" + memo,
            function(data) {
                document.getElementById("send_confirm").classList.remove("is-loading");
                $('#recipientinput').val('');
                $('#amountinput').val('');
                $('#memoinput').val('');
                if (data.success == true) {
                    serverMessage = data["result"].split(",");
                    if (serverMessage[0] == "OK") {
                        let modal_send = document.querySelector('#modal-send');
                        document.querySelector('html').classList.remove('is-clipped');
                        modal_send.classList.remove('is-active');

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
                    }

                } else {
                    serverMessage = data["message"].split(",");

                    let modal_send = document.querySelector('#modal-send');
                    document.querySelector('html').classList.remove('is-clipped');
                    modal_send.classList.remove('is-active');

                    let modal_error = document.querySelector('#modal_error');
                    document.querySelector('#modal_error .modal-card-body .content p').innerHTML =
                        `<b>An error has occurred while sending funds: </b>` + serverMessage[1] + `</b><br></p>`;
                    document.querySelector('html').classList.add('is-clipped');
                    modal_error.classList.add('is-active');

                    document.querySelector('#modal_error .delete').onclick = function() {
                        document.querySelector('html').classList.remove('is-clipped');
                        modal_error.classList.remove('is-active');
                    }
                }
            })
    }
}

function wrap() {
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

function logout() {
    delcookie("username");
    delcookie("password");
    window.location.reload(true);
}

function addcl() {
    let parent = this.parentNode.parentNode;
    parent.classList.add("focus");
}

function remcl() {
    let parent = this.parentNode.parentNode;
    if (this.value == "") {
        parent.classList.remove("focus");
    }
}

inputs.forEach(input => {
    input.addEventListener("focus", addcl);
    input.addEventListener("blur", remcl);
});

/* Parallax background */
document.addEventListener("mousemove", parallax_bg);
const elem = document.querySelector("#background");

function parallax_bg(e) {
    let width = window.innerWidth / 2;
    let height = window.innerHeight / 2;
    let mouse_x = e.clientX;
    let mouse_y = e.clientY;
    let depth = `${50 - (mouse_x - width) * 0.008}% ${50 - (mouse_y - height) * 0.008}%`;
    elem.style.backgroundPosition = depth;
}


function round_to(precision, value) {
    power_of_ten = 10 ** precision;
    return Math.round(value * power_of_ten) / power_of_ten;
}

/* Accurate daily calculator by Lukas */
function calculdaily(newb, oldb) {
    //Duco made in last seconds
    let ducomadein = newb - oldb;
    let time_passed = (Date.now() - start) / 1000;
    let daily = 86400 * ducomadein / time_passed;

    // Large values mean transaction or big block - ignore this value
    if (daily > 0 && daily < 500) {
        daily = round_to(1, daily)
        update_element("estimatedprofit", `
                <i class="far fa-star"></i>
                Earning about <b>` + daily + ` ᕲ</b> daily`);

        avgusd = round_to(3, daily * duco_price);
        update_element("estimatedprofitusd", "(≈ $" + avgusd + ")");
        update_element("estimatedprofit_miner", daily + ` ᕲ</b> daily`);
        update_element("estimatedprofit_pcminer", daily + ` ᕲ</b> daily`);
    }
    start = Date.now()
}

let adBlockEnabled = false
const googleAdUrl = 'https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js'
try {
    fetch(new Request(googleAdUrl)).catch(_ => adBlockEnabled = true)
} catch (e) {
    adBlockEnabled = true
}

function update_element(element, value) {
    // Nicely fade in the new value if it changed
    element = "#" + element;
    old_value = $(element).text()

    if ($("<div>" + value + "</div>").text() != old_value) {
        $(element).fadeOut('fast', function() {
            $(element).html(value);
            $(element).fadeIn('fast');
        });
        return true;
    }
    return false;
}

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

function miner_notify() {
    let modal_error = document.querySelector('#modal_error');
    document.querySelector('#modal_error .modal-card-body .content p').innerHTML =
        `<b>You're wasting power</b><br>Your total miner efficiency is <b>less than 20%</b>, because you're using too many miners.<br>Big farms are not good for Duino-Coin, as you won't earn more but only put more load on the servers. You can read more about it <a href="https://github.com/revoxhere/duino-coin/wiki/FAQ#q-can-i-create-a-mining-farm-with-esp-boards-or-arduinos" target="_blank">here</a>.<br>Consider making your rig smaller.</p>`;
    document.querySelector('html').classList.add('is-clipped');
    modal_error.classList.add('is-active');

    document.querySelector('#modal_error .delete').onclick = function() {
        document.querySelector('html').classList.remove('is-clipped');
        modal_error.classList.remove('is-active');
    }
}

window.addEventListener('load', function() {

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

    function get_now() {
        const today = new Date();
        const time = today.getHours() +
            ":" +
            today.getMinutes() +
            ":" +
            today.getSeconds();
        return time;
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
        fetch(`https://server.duinocoin.com/v2/users/${encodeURIComponent(username)}?limit=${transaction_limit}`)
            .then(response => response.json())
            .then(data => {
                data = data.result;
                duco_price = data.prices.max;

                balance = round_to(10, parseFloat(data.balance.balance));
                if (first_open)  {
                    $("#balance").html(balance);
                } else {
                    update_element("balance", balance);
                    update_element("balance_miner", round_to(7, balance));
                    update_element("balance_miner", round_to(7, balance));
                }

                if (oldb != balance) {
                    calculdaily(balance, oldb);
                    oldb = balance;
                }

                $("#ducousd").html(" $" + round_to(5, duco_price));
                $("#ducousd_xmg").html("$" + round_to(5, data.prices.xmg));
                $("#ducousd_bch").html("$" + round_to(5, data.prices.bch));
                $("#ducousd_trx").html("$" + round_to(5, data.prices.trx));
                $("#ducousd_nano").html("$" + round_to(5, data.prices.nano));
                $("#duco_nodes").html("$" + round_to(5, data.prices.nodes));
                $("#duco_justswap").html("$" + round_to(5, data.prices.justswap));
                $("#duco_pancake").html("$" + round_to(5, data.prices.pancake));
                $("#duco_sushi").html("$" + round_to(5, data.prices.sushi));

                balanceusd = round_to(4, balance * duco_price);
                if (first_open) $("#balancefiat").html(balanceusd);
                else update_element("balancefiat", balanceusd);

                verified = data.balance.verified;
                if (verified === "yes") {
                    $("#verify").html(
                        `<span class="icon-text has-text-success-dark" title="Your account is verified">
                            <i class="fa fa-check-circle icon"></i>
                        </span>`);
                } else {
                    $("#verify").html(
                        `<a href="https://server.duinocoin.com/verify.html" class="has-text-danger-dark icon-text" target="_blank">
                            <i class="fa fa-times-circle animated faa-flash icon"></i>
                            <span>unverified</span>
                        </a>`);
                }

                user_miners = data.miners;
                total_hashrate = 0;
                t_miners = []
                if (user_miners.length) {
                    $("#nominers").fadeOut(0);
                    $("#minertable").fadeIn(0)
                    for (let miner in user_miners) {
                        let miner_wallet_id = user_miners[miner]["wd"];
                        if (!miner_wallet_id) miner_wallet_id = Math.floor(Math.random() * 2812);
                        const miner_hashrate = user_miners[miner]["hashrate"];
                        const miner_rejected = user_miners[miner]["rejected"];
                        const miner_accepted = user_miners[miner]["accepted"];
                        total_hashrate += miner_hashrate;

                        if (!t_miners[miner_wallet_id]) {
                            t_miners[miner_wallet_id] = user_miners[miner];
                            t_miners[miner_wallet_id]["threads"] = 1;
                            t_miners[miner_wallet_id]["threadid"] = user_miners[miner]["threadid"];
                            continue;
                        } else if (t_miners[miner_wallet_id]) {
                            t_miners[miner_wallet_id]["hashrate"] += miner_hashrate;
                            t_miners[miner_wallet_id]["rejected"] += miner_rejected;
                            t_miners[miner_wallet_id]["accepted"] += miner_accepted;
                            t_miners[miner_wallet_id]["threads"] += 1;
                            continue;
                        }
                    }

                    t_miners = t_miners.sort(function(a, b) {
                        if (a.identifier < b.identifier) { return -1; }
                        if (a.identifier > b.identifier) { return 1; }
                        return 0;
                    });

                    miner_num = 0;
                    miners_html = "";
                    for (let miner in t_miners) {
                        miner_num += 1;
                        miner_threadid = t_miners[miner]["threadid"];
                        miner_hashrate = t_miners[miner]["hashrate"];
                        miner_identifier = t_miners[miner]["identifier"];
                        miner_software = t_miners[miner]["software"];
                        miner_diff = t_miners[miner]["diff"];
                        miner_rejected = t_miners[miner]["rejected"];
                        miner_accepted = t_miners[miner]["accepted"];
                        miner_sharetime = t_miners[miner]["sharetime"];
                        miner_pool = t_miners[miner]["pool"];
                        miner_algo = t_miners[miner]["algorithm"];
                        miner_count = t_miners[miner]["threads"];

                        if (!miner_identifier || miner_identifier === "None") {
                            miner_name = miner_software;
                            miner_soft = "";
                        } else {
                            miner_name = miner_identifier;
                            miner_soft = miner_software + ", ";
                        }

                        let miner_diff_str = scientific_prefix(miner_diff)
                        let accepted_rate = round_to(1, (miner_accepted / (miner_accepted + miner_rejected) * 100))

                        let percentage = 0.80;
                        let miner_type = "Other";
                        if (miner_software.includes("ESP8266")) {
                            icon = `<img src="img/wemos.gif">`;
                            color = "#F5515F";
                            miner_type = "ESP8266";
                            percentage = 0.96;
                        } else if (miner_software.includes("ESP32")) {
                            color = "#5f27cd";
                            icon = `<i class="fa fa-wifi" style="color:${color}"></i>`;
                            miner_type = "ESP32";
                            percentage = 0.96;
                        } else if (miner_software.includes("I2C")) {
                            icon = `<img src="img/arduino.gif">`;
                            color = "#B33771";
                            miner_type = "AVR (I²C)";
                            percentage = 0.96;
                        } else if (miner_software.includes("AVR")) {
                            icon = `<img src="img/arduino.gif">`;
                            color = "#B33771";
                            miner_type = "AVR (Normal)";
                            percentage = 0.96;
                        } else if (miner_software.includes("PC")) {
                            color = "#F97F51";
                            icon = `<i class="fa fa-laptop" style="color:${color}"></i>`;
                            miner_type = "PC (Normal)";
                        } else if (miner_software.includes("Web")) {
                            color = "#009432";
                            icon = `<i class="fa fa-globe" style="color:${color}"></i>`;
                            miner_type = "PC (Web)";
                        } else if (miner_software.includes("Android") || miner_software.includes("Phone")) {
                            color = "#fa983a";
                            icon = `<i class="fa fa-mobile" style="color:${color}"></i>`;
                            miner_type = "Mobile";
                        } else {
                            color = "#16a085";
                            icon = `<i class="fa fa-question-circle" style="color:${color}"></i>`;
                            miner_type = "Unknown!";
                        }

                        let miner_efficiency = round_to(2, Math.pow(percentage, miner_num - 1) * 100);
                        let efficiency_color = "has-text-warning-dark";
                        if (miner_efficiency < 40) {
                            efficiency_color = "has-text-danger-dark";
                        } else if (miner_efficiency > 80) {
                            efficiency_color = "has-text-success-dark";
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

                        let warning_icon = "";
                        if (miner_efficiency < 40) {
                            warning_icon = `
                        <span class="icon-text has-text-danger" title="Too many miners - low Kolka efficiency">
                            <i class="icon fa fa-times-circle animated faa-flash"></i>
                        </span>`
                        } else if (accepted_rate < 50) {
                            warning_icon = `
                        <span class="icon-text has-text-danger" title="Too many rejected shares">
                            <i class="icon fa fa-times-circle animated faa-flash"></i>
                        </span>`
                        }

                        miners_html += `
                            <tr>
                                <th align="right">
                                        <span class="has-text-grey">
                                            ${miner_num}
                                        </span>
                                </th>
                                <th>
                                        <span class="icon-text">
                                            <span class="icon" title="Miner type: ${miner_type}">
                                                ${icon}
                                            </span>
                                        </span>
                                        <span class="has-text-weight-bold" title="Miner name">
                                            ${miner_name}
                                        </span>
                                </th>
                                <th>
                                        <span class="has-text-weight-bold" title="Miner hashrate">
                                            ${scientific_prefix(miner_hashrate)}H/s
                                        </span>
                                        <span class="has-text-weight-normal" title="Threads/cores">
                                            ${thread_string}
                                        </span>
                                </th>
                                <th>
                                    <span class="${accept_color}">
                                        ${accepted_rate}%
                                    </span>
                                    <span class="has-text-weight-normal">
                                        (${miner_accepted}/${(miner_accepted+miner_rejected)})
                                    </span>
                                </th>
                                <th align="center">
                                        <span class="icon-text">
                                            ${warning_icon}
                                        </span>
                                        <span class="icon-text" style="cursor: pointer">
                                            <i class="icon fa fa-info-circle"></i>
                                        </span>
                                </th>
                            </tr>
                            <tr>
                                <td colspan="5" style="border: none;margin:none;padding:0;">
                                    <div class="content" style="display:none;">
                                        <div class="columns is-mobile">
                                            <div class="column">
                                                <ul class="my-1">
                                                    <li title="Miner software">
                                                        <span style="color:${color}">
                                                            ${miner_software}
                                                        </span>
                                                    </li>
                                                    <li title="Time it took to find the latest result">
                                                        <span class="has-text-weight-normal">
                                                            Last share:
                                                        </span>
                                                        <span class="has-text-weight-bold">
                                                            ${round_to(2, miner_sharetime)}s
                                                        </span>
                                                    </li>
                                                    <li title="Server your miner is connected to">
                                                        <span class="has-text-weight-normal">
                                                            Node: 
                                                        </span>
                                                        <span class="has-text-weight-bold">
                                                            ${miner_pool}
                                                        </span>
                                                    </li>
                                                    <li title="How hard is it to mine">
                                                        <span class="has-text-weight-normal">
                                                            Difficulty: 
                                                        </span>
                                                        <span class="has-text-weight-bold">
                                                            ${miner_diff_str}
                                                        </span>
                                                    </li>
                                                </ul>
                                            </div>
                                            <div class="column">
                                                <ul class="my-1">
                                                    <li title="Used hashing algorithm">
                                                        <span class="has-text-weight-normal">
                                                            Algorithm:
                                                        </span>
                                                        <span class="has-text-weight-bold">
                                                            ${miner_algo}
                                                        </span>
                                                    </li>
                                                    <li title="Identifier used to separate miners in the API">
                                                        <span class="has-text-weight-normal">
                                                            Thread ID:
                                                        </span>
                                                        <span class="has-text-weight-bold" >
                                                            ${miner_threadid} (${miner})
                                                        </span>
                                                    </li>
                                                    <li title="Identifier used to group same threads">
                                                        <span class="has-text-weight-normal">
                                                            Miner type:
                                                        </span>
                                                        <span class="has-text-weight-bold">
                                                            ${miner_type}
                                                        </span>
                                                    </li>
                                                    <li title="Kolka efficiency drop">
                                                        <span class="has-text-weight-normal">
                                                            Earnings
                                                            <a href="https://github.com/revoxhere/duino-coin/wiki/FAQ#q-can-i-create-a-mining-farm-with-esp-boards-or-arduinos"
                                                               target="_blank">(Kolka eff. drop)</a>:
                                                        </span>
                                                        <span class="has-text-weight-bold ${efficiency_color}">
                                                            ${miner_efficiency}%
                                                        </span>
                                                    </li>
                                                </ul>
                                            </div>
                                        </div>
                                    </div>
                                </td>
                            </tr>`
                    }
                    $("#miners").html(miners_html);
                    $("#miners_miner").html(miners_html);
                    $("#miners_pcminer").html(miners_html);
                    $("#total_hashrate").html(scientific_prefix(total_hashrate) + "H/s");
                    $("#hashrate_miner").html(scientific_prefix(total_hashrate) + "H/s");
                    $("#minercount").html(user_miners.length);
                    $("#minercount_miner").html(user_miners.length);
                    $("#minercount_pc").html(user_miners.length);
                } else {
                    $("#minertable").fadeOut(function() {
                        $("#nominers").fadeIn();
                    });
                }

                $(function() {
                    $("td[colspan=5]").find(".content").hide();
                    $(".fa-info-circle").click(function(event) {
                        let $target = $(event.target);
                        $target.closest("tr").next().find(".content").slideToggle(250);
                    });
                });

                user_transactions = data.transactions.reverse();
                if (user_transactions.length > 0) {
                    transactions_html = "";
                    for (let i in user_transactions) {
                        transaction_date = user_transactions[i]["datetime"];
                        transaction_amount = round_to(8, parseFloat(user_transactions[i]["amount"]));
                        transaction_hash_full = user_transactions[i]["hash"];
                        transaction_hash = transaction_hash_full.substr(transaction_hash_full.length - 16);
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
                                    <span class="has-text-weight-normal">
                                        Sent
                                        <span class="has-text-weight-bold">
                                            ${transaction_amount} DUCO
                                        </span>
                                        to
                                    </span>
                                    <a href="https://explorer.duinocoin.com/?search=${transaction_recipient}" target="_blank">
                                        ${transaction_recipient}
                                    </a>
                                    <span class="has-text-weight-normal">
                                        ${transaction_memo}
                                    </span>
                                </p>
                                <p class="subtitle is-size-7">
                                    <span class="has-text-weight-bold">
                                        ${transaction_date}
                                    </span>
                                    <a href="https://explorer.duinocoin.com/?search=${transaction_hash_full}" target="_blank">
                                        ${transaction_hash}
                                    </a>
                                </p>
                            </div>`;
                            transactions_html += thtml;
                        } else {
                            thtml = `
                            <div class="column is-full">
                                <p class="title is-size-6">
                                    <i class="fa fa-arrow-left fa-fw has-text-success-dark"></i>
                                    <span class="has-text-weight-normal">
                                        Received
                                        <span class="has-text-weight-bold">
                                            ${transaction_amount} DUCO
                                        </span>
                                        from
                                    </span>
                                    <a href="https://explorer.duinocoin.com/?search=${transaction_sender}" target="_blank">
                                        ${transaction_sender}
                                    </a>
                                    <span class="has-text-weight-normal">
                                        ${transaction_memo}
                                    </span>
                                </p>
                                <p class="subtitle is-size-7">
                                    <span>
                                        ${transaction_date}
                                    </span>
                                    <a href="https://explorer.duinocoin.com/?search=${transaction_hash_full}" target="_blank">
                                        ${transaction_hash}
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
                document.getElementById('txsel').classList.remove("is-loading");
            });
    }

    // ENTER KEY AS LOGIN
    let input_login = document.getElementById("submit");
    input_login.addEventListener("keyup", function(event) {
        if (event.keyCode === 13) {
            event.preventDefault();
            document.getElementById("submit").click();
        }
    });

    $('#form').submit(function() {
        return false;
    });

    $('#submit').click(function() {
        username = $('#usernameinput').val()
        password = $('#passwordinput').val()

        if (username && password) {
            $("#submit").addClass("is-loading");

            $.getJSON(`https://server.duinocoin.com/v2/auth/${encodeURIComponent(username)}`, { password: window.btoa(unescape(encodeURIComponent(password))) },
                    function(data) {
                        if (data.success == true) {
                            setcookie("username", encodeURIComponent(username));
                            setcookie("password", encodeURIComponent(password));

                            $("#ducologo").addClass("rotate");

                            $("#username").text(encodeURIComponent(username));
                            $("#email").text(`(${data.result[1]})`);

                            $("#useravatar").attr("src",
                                `https://www.gravatar.com/avatar/${encodeURIComponent(MD5(data.result[1]))}` +
                                `?d=https%3A%2F%2Fui-avatars.com%2Fapi%2F/${encodeURIComponent(username)}/128/${get_user_color(username)}/ffffff/1`);

                            user_data(username, true);
                            window.setInterval(() => {
                                user_data(username, false);
                            }, 10 * 1000);
                            document.getElementById('forUsername').innerText = username;
                            document.getElementById('ducomonitor').href = 'https://siunus.github.io/duco-monitor/#' + username;
                            search(username);

                            setTimeout(function() {
                                $('#form').hide("drop", { direction: "down" }, 500, function() {
                                    $('#panel').show("drop", { direction: "up" }, 500, function() {
                                        $("iframe#news_iframe").attr('src', 'https://server.duinocoin.com/news.html');
                                    });
                                });
                            }, 350);
                        } else {
                            if (data.message === "This user doesn't exist") {
                                $("#usernamediv").effect("shake", { duration: 750, easing: "swing", distance: 5, times: 3 });
                            } else {
                                $("#passworddiv").effect("shake", { duration: 750, easing: "swing", distance: 5, times: 3 });
                            }
                        }
                    })
                .fail(function(jqXHR, textStatus, errorThrown) {
                    $("#ducologo").effect("shake", { duration: 750, easing: "swing", distance: 5, times: 3 });
                })
                .always(function() {
                    $("#submit").removeClass("is-loading");
                });
        } else {
            $("#usernamediv").effect("shake", { duration: 750, easing: "swing", distance: 5, times: 3 });
            $("#passworddiv").effect("shake", { duration: 750, easing: "swing", distance: 5, times: 3 });
        }
    });

    setInterval(function() {
        if ($('#usernameinput').val() != "") {
            $('#usernamediv').addClass("focus");
        }
        if ($('#passwordinput').val() != "") {
            $('#passworddiv').addClass("focus");
        }

        $(".mcontainer").css("max-width", window.innerWidth - 80)
    }, 1000)

    setTimeout(function() {
        if (getcookie("password") && getcookie("username")) {
            $('#usernamediv').addClass("focus");
            $('#passworddiv').addClass("focus");
            $('#usernameinput').val(getcookie("username"));
            $('#passwordinput').val(getcookie("password"));
            $('#submit').click();
        }
    }, 500)

    // Network
    function search(searched_string) {
        let cont = true;
        if (searched_string) {
            window.history.pushState('Duino-Coin | Network statistics', 'Duino-Coin | Network statistics', `?search=${searched_string}`);
            $("#transactionstext1").html(`<div class="divider">Results&nbsp;for&nbsp;<span class='has-text-info' style="overflow:hidden"><span>${searched_string}</span></span></div>`);
        }
        if (cont) {
            $.getJSON("https://server.duinocoin.com/transactions/" + searched_string, function(data) {
                if (data.success == true && data.result != "No transaction found") {
                    cont = false;
                    let amount_usd = data.result.amount * duco_price;
                    if (searched_string.length == 40) transaction_type = "DUCO-S1";
                    else transaction_type = "XXHASH"

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
                                            <span class='has-text-info'">
                                                ${data.result.sender}
                                            </span>
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
                                            <span class='has-text-info'>
                                                ${data.result.recipient}
                                            </span>
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
                    update_element("transactionstext2", found_transaction_html);
                });
        }
        if (cont) {
            $.getJSON('https://server.duinocoin.com/users/' + searched_string, function(data) {
                if (data.success == true) {
                    cont = false;
                    let amount_usd = data.result.balance.balance * duco_price;

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
                                    `<span class='has-text-info'>` +
                                    "<b>" +
                                    data["result"]["transactions"][transaction]["recipient"] + "</span></b> " + `<span class='has-text-info'>(` + data["result"]["transactions"][transaction]["hash"].substr(data["result"]["transactions"][transaction]["hash"].length - 8) + ")</span><br>"
                            } else {
                                tx_str += "<span class='has-text-grey'>" +
                                    data["result"]["transactions"][transaction]["datetime"] +
                                    "</span> Received <span class='has-text-success-dark'>" +
                                    "<b>" +
                                    Math.round(data["result"]["transactions"][transaction]["amount"] * 1000) / 1000 +
                                    " DUCO</b></span> from " +
                                    `<span class='has-text-info'>` + "<b>" +
                                    data["result"]["transactions"][transaction]["sender"] + "</span></b> " + `<span class='has-text-info'>(` + data["result"]["transactions"][transaction]["hash"].substr(data["result"]["transactions"][transaction]["hash"].length - 8) + ")</span><br>"
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
                                            <span class='has-text-info'">
                                                ${searched_string}
                                            </span>
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
                    update_element("transactionstext2", found_transaction_html);
                });
        }
        if (cont) $("#transactionstext2").text(`Nothing interesting found for your query 🤷`);
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
});
