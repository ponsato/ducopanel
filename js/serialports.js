const serialports = require('serialport');
const upath = require('upath');
const path = require('path');
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
    if (method !== 'pc') {
        dir = './AVRMiner_2.49_resources';
        if (!fs.existsSync(dir)){
            fs.mkdirSync(dir);
        }
    } else {
        dir = './PCMiner_2.49_resources';
        if (!fs.existsSync(dir)){
            fs.mkdirSync(dir);
        }
    }
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
    if (method !== 'pc') {
        let identifier_string = document.getElementById("identifier").value;
        let identifier = identifier_string !== '' ? identifier_string : 'none';
        let avrboard = '';
        if (method === 'boot') {
            avrboard = "avrboard = " + document.getElementById('avr_board').value;
        }
        content = "[arduminer]\n" +
            "username = " + username + "\n" +
            "avrport = " + avrport.toString() + "\n" +
            "donate = 0\n" +
            "language = english\n" +
            "identifier = " + identifier + "\n" +
            "debug = n\n" +
            avrboard +
            "\n";
    } else {
        let identifier_string = document.getElementById("identifier_pcminering").value;
        let identifier = identifier_string !== '' ? identifier_string : 'none';
        let efficiency = document.getElementById('mining_intensity').value;
        let threads = document.getElementById('mining_threads').value;
        let algorithm = document.getElementById('algorithm').value;
        content = "[Duino-Coin-PC-Miner]\n" +
            "username = " + username + "\n" +
            "efficiency = " + efficiency + "\n" +
            "threads = " + threads + "\n" + // TODO
            "requested_diff = NET\n" +
            "donate = 0\n" +
            "identifier = " + identifier + "\n" +
            "algorithm = " + algorithm + "\n" +
            "language = english\n" +
            "debug = n\n" +
            "soc_timeout = 30\n" + // TODO
            "discord_presence = y\n" + // TODO
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
        manageMinerConfig('pc');
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
        input_threads.setAttribute('max', data.toString('utf8'));
        input_threads.setAttribute('placeholder', '1 - ' + data.toString('utf8'));
        python.kill('SIGINT');
    });
}

function runMiner() {
    let traces = document.getElementById('traces');
    let dirminer = upath.toUnix(upath.join(__dirname, "../miner","AVR_Miner.py"));
    let python = require('child_process').spawn('python', [dirminer, '']);
    let start_mining = document.getElementById('start_mining');
    let stop_mining = document.getElementById('stop_mining');
    stop_mining.removeAttribute("disabled");
    stop_mining.onclick = function () {
        python.kill('SIGINT');
        start_mining.removeAttribute("disabled");
        stop_mining.setAttribute("disabled", true);
    };
    python.stdout.on('data', function (data) {
        console.log("Python response: ", data.toString('utf8'));
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
    python.stderr.on('data', (data) => {
        console.log("Python response: ", data.toString('utf8'));
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
        traces.scrollTop = traces.scrollHeight;
        start_mining.removeAttribute("disabled");
        stop_mining.setAttribute("disabled", true);
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
    let traces = document.getElementById('traces_pcminering');
    let dirminer = upath.toUnix(upath.join(__dirname, "../miner","PC_Miner.py"));
    let python = require('child_process').spawn('python', [dirminer, '']);
    let start_pcminering = document.getElementById('start_pcminering');
    let stop_pcminering = document.getElementById('stop_pcminering');
    stop_pcminering.removeAttribute("disabled");
    stop_pcminering.onclick = function () {
        python.kill('SIGINT');
        start_pcminering.removeAttribute("disabled");
        stop_pcminering.setAttribute("disabled", true);
    };
    python.stdout.on('data', function (data) {
        console.log("Python response: ", data.toString('utf8'));
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
    python.stderr.on('data', (data) => {
        console.log("Python response: ", data.toString('utf8'));
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
        traces.scrollTop = traces.scrollHeight;
        start_pcminering.removeAttribute("disabled");
        stop_pcminering.setAttribute("disabled", true);
    });
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