const serialports = require('serialport');
const upath = require('upath');
const path = require('path');
const version = "2.57";
/*const {dialog} = require('electron').remote;*/
const fs = require('fs');
let previous_ports;

async function listSerialPorts() {
    await serialports.list().then((ports, err) => {
        let total = document.getElementById('total_ports');
        let total_boot = document.getElementById('total_ports_toboot');
        if(err) {
            document.getElementById('error').textContent = err.message
            document.getElementById('error_boot').textContent = err.message
            total.innerHTML = '';
            total_boot.innerHTML = '';
            return
        } else {
            document.getElementById('error').textContent = ''
            document.getElementById('error_boot').textContent = ''
        }
        //console.log('ports', ports);

        if (ports.length === 0) {
            document.getElementById('error').textContent = 'No ports discovered'
            document.getElementById('error_boot').textContent = 'No ports discovered'
        }
        let list = document.getElementById('ports');
        let list_boot = document.getElementById('ports_toboot');
        if (previous_ports !== ports.length) {
            total.innerHTML = 'Ports detected: <b>' + ports.length + '</b>';
            total_boot.innerHTML = 'Ports detected: <b>' + ports.length + '</b>';
            list.innerHTML = '<div>';
            list_boot.innerHTML = '<div>';
            Object.entries(ports).forEach(([key, value]) => {
                list.innerHTML += '<div class="field">' +
                    '<input id="'+ value.path + '" value="'+ value.path + '" type="checkbox" name="port" class="switch" checked="checked">' +
                    '<label for="'+ value.path + '">'+ value.path + '</label></div>';
                list_boot.innerHTML += '<div class="field">' +
                    '<input id="boot_'+ value.path + '" value="'+ value.path + '" type="checkbox" name="port_boot" class="switch" checked="checked">' +
                    '<label for="boot_'+ value.path + '">'+ value.path + '</label></div>';
            });
            list.innerHTML += '</div>';
            list_boot.innerHTML += '</div>';
        }
        previous_ports = ports.length;
    })
}

setTimeout(function listPorts() {
    listSerialPorts();
    setTimeout(listPorts, 2000);
}, 2000);


function manageMinerConfig (method) {
    let username = document.getElementById('username').textContent;
    let content = '';
    let dir = '';
    let avrport = [];
    if (method === 'mining') {
        document.querySelectorAll("input[type=checkbox][name=port]:checked").forEach(function(port){
            avrport.push(port.value);
        });
    }
    if (method === 'boot') {
        document.querySelectorAll("input[type=checkbox][name=port_boot]:checked").forEach(function(port){
            avrport.push(port.value);
        });
    }
    if (method === 'mining' || method === 'boot') {
        dir = './AVRMiner_' + version + '_resources';
        if (!fs.existsSync(dir)){
            fs.mkdirSync(dir);
        }
        let identifier_string = document.getElementById("identifier").value;
        let identifier = identifier_string !== '' ? identifier_string : 'none';
        let avrboard = '';
        if (method === 'boot') {
            avrboard = "avrboard = " + document.getElementById('avr_board').value;
        }
        content = "[Duino-Coin-AVR-Miner]\n" +
            "username = " + username + "\n" +
            "avrport = " + avrport.toString() + "\n" +
            "donate = 0\n" +
            "language = english\n" +
            "identifier = " + identifier + "\n" +
            "debug = n\n" +
            "soc_timeout = 45\n" +
            "avr_timeout = 3.1\n" +
            "discord_presence = y\n" +
            "periodic_report = 60\n" +
            "shuffle_ports = y\n" +
            avrboard +
            "\n";
    }
    fs.writeFile(dir + '/Miner_config.cfg', content, (err) => {
        if(err){
            alert("An error ocurred creating config file "+ err.message);
            let modal_error = document.querySelector('#modal_error');
            document.querySelector('#modal_error .modal-card-body .content p').innerHTML =
                'An error ocurred creating config file: <br><b>' + err.message + '</b></p>';
            document.querySelector('html').classList.add('is-clipped');
            modal_error.classList.add('is-active');
            document.querySelector('#modal_error .delete').onclick = function() {
                document.querySelector('html').classList.remove('is-clipped');
                modal_error.classList.remove('is-active');
            }
        } else {
            if (method === 'mining') {
                runMiner();
            }
            if (method === 'boot') {
                runBootloader();
            }
            if (method === 'pc') {
                runPcMiner();
            }
        }
    });
}

window.addEventListener('load', function() {
    let start_mining = document.getElementById('start_mining');
    let stop_boot = document.getElementById('stop_boot');
    start_mining.onclick = function () {
        eventFire(stop_boot, 'click');
        manageMinerConfig('mining');
        start_mining.setAttribute("disabled", true);
    };
    let clear_console = document.getElementById('clear_console');
    clear_console.onclick = function () {
        document.getElementById('traces').innerHTML = '';
    };

    let start_boot = document.getElementById('start_boot');
    let stop_mining = document.getElementById('stop_mining');
    start_boot.onclick = function () {
        eventFire(stop_mining, 'click');
        manageMinerConfig('boot');
        start_boot.setAttribute("disabled", true);
    }
    let clear_console_boot = document.getElementById('clear_console_boot');
    clear_console_boot.onclick = function () {
        document.getElementById('traces_boot').innerHTML = '';
    };

    let start_pcminering = document.getElementById('start_pcminering');
    start_pcminering.onclick = function () {
        runPcMiner();
        start_pcminering.setAttribute("disabled", true);
    }
    let clear_console_pcminering = document.getElementById('clear_console_pcminering');
    clear_console_pcminering.onclick = function () {
        document.getElementById('traces_pcminering').innerHTML = '';
    };
    detectThreads();
});

function detectThreads() {
    let input_threads = document.getElementById('mining_threads');
    let dirthreads = upath.toUnix(upath.join(__dirname, "../miner","detectThreads.py"));
    let python = require('child_process').spawn('python', [dirthreads, '']);
    python.stdout.on('data', function (data) {
        console.log("Num threats: ", data.toString('utf8'));
        input_threads.setAttribute('max', data.toString('utf8').replace(/(\r\n|\n|\r)/gm, ""));
        input_threads.setAttribute('placeholder', '1 - ' + data.toString('utf8').replace(/(\r\n|\n|\r)/gm, ""));
        python.kill('SIGINT');
    });
    document.getElementById('mining_threads').addEventListener('keypress', function (evt) {
        evt.preventDefault();
    });
}

function runMiner() {
    let traces = document.getElementById('traces');
    let dirminer = upath.toUnix(upath.join(__dirname, "../miner","AVR_Miner.py"));
    let python = require('child_process').spawn('python', [dirminer, '']);
    let start_mining = document.getElementById('start_mining');
    let stop_mining = document.getElementById('stop_mining');
    let totalShares = 0;
    let sharesCorrect = 0;
    let shares_miner = document.getElementById("shares_miner");
    let hljs_miner = document.getElementById('hljs_miner');
    let sharesperc = document.getElementById('sharesperc');
    stop_mining.removeAttribute("disabled");
    stop_mining.onclick = function () {
        python.kill('SIGINT');
        start_mining.removeAttribute("disabled");
        stop_mining.setAttribute("disabled", true);
    };
    python.stdout.on('data', function (data) {
        //console.log("Python response: ", data.toString('utf8'));
        if (String.fromCharCode.apply(null, data).indexOf('Error') > -1) {
            traces.innerHTML += '<span style="color: red">' + String.fromCharCode.apply(null, data) + '</span>';
        } else if (String.fromCharCode.apply(null, data).indexOf('Rejected') > -1) {
            totalShares++;
            traces.innerHTML += '<span style="color: red">' + String.fromCharCode.apply(null, data) + '</span>';
        } else if (String.fromCharCode.apply(null, data).indexOf('sys0') > -1) {
            traces.innerHTML += '<span style="color: yellow">' + String.fromCharCode.apply(null, data) + '</span>';
        } else if (String.fromCharCode.apply(null, data).indexOf('Periodic') > -1) {
            traces.innerHTML += '<span style="color: yellow">' + String.fromCharCode.apply(null, data) + '</span>';
        } else if (String.fromCharCode.apply(null, data).indexOf('Accepted') > -1) {
            totalShares++;
            sharesCorrect++;
            traces.innerHTML += '<span style="color: lime">' + String.fromCharCode.apply(null, data) + '</span>';
        } else {
            traces.innerHTML += '<span style="color: cyan">' + String.fromCharCode.apply(null, data) + '</span>';
        }
        hljs_miner.scrollTop = document.getElementById('hljs_miner').scrollHeight;
        shares_miner.innerHTML = sharesCorrect + "/" + totalShares;
        sharesperc.innerHTML = " (" + (sharesCorrect / totalShares * 100).toFixed(2) + "%)";
    });
    python.stderr.on('data', (data) => {
        console.log("Python response: ", data.toString('utf8'));
        if (String.fromCharCode.apply(null, data).indexOf('Error') > -1) {
            traces.innerHTML += '<span style="color: red">' + String.fromCharCode.apply(null, data) + '</span>';
        } else if (String.fromCharCode.apply(null, data).indexOf('Rejected') > -1) {
            totalShares++;
            traces.innerHTML += '<span style="color: red">' + String.fromCharCode.apply(null, data) + '</span>';
        } else if (String.fromCharCode.apply(null, data).indexOf('Accepted') > -1) {
            totalShares++;
            sharesCorrect++;
            traces.innerHTML += '<span style="color: lime">' + String.fromCharCode.apply(null, data) + '</span>';
        } else if (String.fromCharCode.apply(null, data).indexOf('sys0') > -1) {
            traces.innerHTML += '<span style="color: yellow">' + String.fromCharCode.apply(null, data) + '</span>';
        } else {
            traces.innerHTML += '<span style="color: cyan">' + String.fromCharCode.apply(null, data) + '</span>';
        }
        hljs_miner.scrollTop = document.getElementById('hljs_miner').scrollHeight;
        shares_miner.innerHTML = sharesCorrect + "/" + totalShares;
        sharesperc.innerHTML = " (" + (sharesCorrect / totalShares * 100).toFixed(2) + "%)";
    });
    let hours = `00`,
        minutes = `00`,
        seconds = `00`;
    document.querySelector("[data-chronometer]").innerHTML = `${hours}:${minutes}:${seconds}`;
    let chronometer = setInterval(function() {
        seconds++
        if (seconds < 10){seconds = `0` + seconds}
        if (seconds > 59) {
            seconds = `00`;
            minutes++;
            if (minutes < 10){minutes = `0` + minutes}
        }
        if (minutes > 59) {
            minutes = `00`;
            hours++;
            if (hours < 10){hours = `0` + hours}
        }
        document.querySelector("[data-chronometer]").innerHTML = `${hours}:${minutes}:${seconds}`;
    }, 1000);

    python.on('close', (data) => {
        traces.innerHTML += '<span style="color: white">child process exited with code ' + data + '</span>';
        hljs_miner.scrollTop = document.getElementById('hljs_miner').scrollHeight;
        start_mining.removeAttribute("disabled");
        stop_mining.setAttribute("disabled", true);
        clearInterval(chronometer);
    });
}

function runBootloader() {
    let traces = document.getElementById('traces_boot');
    let dircode = upath.toUnix(upath.join(__dirname, "../miner","upload-sketch.py"));
    let python = require('child_process').spawn('python', [dircode, '']);
    let stop_boot = document.getElementById('stop_boot');
    let start_boot = document.getElementById('start_boot');
    stop_boot.removeAttribute("disabled");
    stop_boot.onclick = function () {
        python.kill('SIGINT');
        start_boot.removeAttribute("disabled");
        stop_boot.setAttribute("disabled", true);
    };
    python.stdout.on('data', function (data) {
        console.log("Python response: ", data.toString('utf8'));
        if (String.fromCharCode.apply(null, data).indexOf('Error') > -1) {
            traces.innerHTML += '<span style="color: red">' + String.fromCharCode.apply(null, data) + '</span>';
        } else if (String.fromCharCode.apply(null, data).indexOf('correctly') > -1) {
            traces.innerHTML += '<span style="color: lime">' + String.fromCharCode.apply(null, data) + '</span>'
        } else if (String.fromCharCode.apply(null, data).indexOf('Global variables use') > -1) {
            traces.innerHTML += '<span style="color: yellow">' + String.fromCharCode.apply(null, data) + '</span>'
        } else {
            traces.innerHTML += '<span style="color: white">' + String.fromCharCode.apply(null, data) + '</span>'
        }
        traces.scrollTop = traces.scrollHeight;
    });
    python.stderr.on('data', (data) => {
        if (String.fromCharCode.apply(null, data).indexOf('Error') > -1) {
            traces.innerHTML += '<span style="color: red">' + String.fromCharCode.apply(null, data) + '</span>';
        } else if (String.fromCharCode.apply(null, data).indexOf('Accepted') > -1) {
            traces.innerHTML += '<span style="color: lime">' + String.fromCharCode.apply(null, data) + '</span>'
        } else if (String.fromCharCode.apply(null, data).indexOf('sys0') > -1) {
            traces.innerHTML += '<span style="color: yellow">' + String.fromCharCode.apply(null, data) + '</span>'
        } else {
            traces.innerHTML += '<span style="color: blue">' + String.fromCharCode.apply(null, data) + '</span>'
        }
        traces.scrollTop = traces.scrollHeight;
    });
    python.on('close', (data) => {
        traces.innerHTML += '<span style="color: white">child process exited with code ' + data + '</span>';
        start_boot.removeAttribute("disabled");
        stop_boot.setAttribute("disabled", true);
        traces.scrollTop = traces.scrollHeight;
    });
}

function runPcMiner() {
    let identifier_string = document.getElementById("identifier_pcminering").value;
    let identifier = identifier_string !== '' ? identifier_string : 'None';
    let threads = document.getElementById('mining_threads').value !== '' ? document.getElementById('mining_threads').value : 1;
    let traces = document.getElementById('traces_pcminering');
    let start_pcminering = document.getElementById('start_pcminering');
    let stop_pcminering = document.getElementById('stop_pcminering');
    let workerVer = 0;
    let totalShares_pcminer = 0;
    let sharesCorrect_pcminer = 0;
    let shares_pcminer = document.getElementById("shares_pcminer");
    let hljs_pcminer = document.getElementById('hljs_pcminer');
    let sharesperc_pcminer = document.getElementById('sharesperc_pcminer');
    let username = document.getElementById('username').textContent;
    if (threads < 1) {
        threads = 1;
    }
    if (threads > 50) {
        threads = 50;
    }
    let workers = [];
    for (let workersAmount = 0; workersAmount < threads; workersAmount++) {
        let socketWorker = new Worker("js/webminer/worker.js");
        workers.push(socketWorker);
        socketWorker.postMessage('Start,' + username + "," + identifier + ","+ workerVer); //passes the start command, username, rigid and worker version to the worker
        workerVer++;
        socketWorker.onmessage = function(event) {
            const data = event.data.split(",");
            switch (data[0]) {
                case 'UpdateLog':
                    if (data[1].indexOf('error') > -1) {
                        traces.innerHTML += '<span style="color: red">' + data[1] + '</span>';
                    } else if (data[1].indexOf('found') > -1) {
                        traces.innerHTML += '<span style="color: lime">' + data[1].replace("Share found", "Accepted") + '</span>'
                    } else if (data[1].indexOf('sys0') > -1) {
                        traces.innerHTML += '<span style="color: yellow">' + data[1] + '</span>'
                    } else {
                        traces.innerHTML += '<span style="color: cyan">' + String.fromCharCode.apply(null, data[1]) + '</span>'
                    }
                    hljs_pcminer.scrollTop = document.getElementById('hljs_pcminer').scrollHeight;
                    break;
                case 'UpdateHashrate':
                    document.getElementById("hashrate_pcminer").innerHTML = parseFloat(data[2] / 1000).toFixed(2) + " kH/s";
                    break;
                case 'GoodShare':
                    totalShares_pcminer++;
                    sharesCorrect_pcminer++;
                    shares_pcminer.innerHTML = sharesCorrect_pcminer + "/" + totalShares_pcminer;
                    sharesperc_pcminer.innerHTML = " (" + (sharesCorrect_pcminer / totalShares_pcminer * 100).toFixed(2) + "%)";
                    break;
                case 'BadShare':
                    totalShares_pcminer++;
                    shares_pcminer.innerHTML = sharesCorrect_pcminer + "/" + totalShares_pcminer;
                    sharesperc_pcminer.innerHTML = " (" + (sharesCorrect_pcminer / totalShares_pcminer * 100).toFixed(2) + "%)";
                    break;
                default:
                    break;
            }
        }
    }
    let hours = `00`,
        minutes = `00`,
        seconds = `00`;
    document.querySelector("[data-chronometer_pcminer]").innerHTML = `${hours}:${minutes}:${seconds}`;
    let chronometer_pcminer = setInterval(function() {
        seconds++
        if (seconds < 10){seconds = `0` + seconds}
        if (seconds > 59) {
            seconds = `00`;
            minutes++;
            if (minutes < 10){minutes = `0` + minutes}
        }
        if (minutes > 59) {
            minutes = `00`;
            hours++;
            if (hours < 10){hours = `0` + hours}
        }
        document.querySelector("[data-chronometer_pcminer]").innerHTML = `${hours}:${minutes}:${seconds}`;
    }, 1000);
    stop_pcminering.removeAttribute("disabled");
    stop_pcminering.onclick = function () {
        workers.map(function (worker) {
            worker.terminate();
        });
        start_pcminering.removeAttribute("disabled");
        stop_pcminering.setAttribute("disabled", true);
        clearInterval(chronometer_pcminer);
    };
}

function eventFire(el, etype){
    if (el.fireEvent) {
        el.fireEvent('on' + etype);
    } else {
        var evObj = document.createEvent('Events');
        evObj.initEvent(etype, true, false);
        el.dispatchEvent(evObj);
    }
}

function getTime() {
    let date = new Date();
    let h = date.getHours();
    let m = date.getMinutes();
    let s = date.getSeconds();

    h = (h < 10) ? "0" + h : h;
    m = (m < 10) ? "0" + m : m;
    s = (s < 10) ? "0" + s : s;

    return h + ":" + m + ":" + s;
}