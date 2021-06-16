const serialports = require('serialport');
const upath = require('upath');
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
                    '<input id="'+ value.path + '" type="checkbox" name="port" class="switch" checked="checked">' +
                    '<label for="'+ value.path + '">'+ value.path + '</label></div>';
                list_boot.innerHTML += '<div class="field">' +
                    '<input id="'+ value.path + '" type="checkbox" name="port_boot" class="switch" checked="checked">' +
                    '<label for="'+ value.path + '">'+ value.path + '</label></div>';
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
    let avrport = [];
    let dir = './AVRMiner_2.49_resources';
    if (!fs.existsSync(dir)){
        fs.mkdirSync(dir);
    }
    if (method === 'mining') {
        document.querySelectorAll("input[type=checkbox][name=port]:checked").forEach(function(port){
            avrport.push(port.id);
        });
    }
    if (method === 'boot') {
        document.querySelectorAll("input[type=checkbox][name=port_boot]:checked").forEach(function(port){
            avrport.push(port.id);
        });
    }
    let identifier_string = document.getElementById("identifier").value;
    let identifier = identifier_string !== '' ? identifier_string : 'none';
    let avrboard = '';
    if (method === 'boot') {
        avrboard = "avrboard = " + document.getElementById('avr_board').value;
    }
    let content = "[arduminer]\n" +
        "username = " + username + "\n" +
        "avrport = " + avrport.toString() + "\n" +
        "donate = 0\n" +
        "language = english\n" +
        "identifier = " + identifier + "\n" +
        "debug = n\n" +
        avrboard +
        "\n";
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
        }
    });
}

window.addEventListener('load', function() {
    let start_mining = document.getElementById('start_mining');
    start_mining.onclick = function () {
        manageMinerConfig('mining');
        start_mining.setAttribute("disabled", true);
    };
    let clear_console = document.getElementById('clear_console');
    clear_console.onclick = function () {
        document.getElementById('traces').innerHTML = '';
    };
    let clear_console_boot = document.getElementById('clear_console_boot');
    clear_console_boot.onclick = function () {
        document.getElementById('traces_boot').innerHTML = '';
    };

    let start_boot = document.getElementById('start_boot');
    start_boot.onclick = function () {
        manageMinerConfig('boot');
    }
});

function runMiner() {
    let traces = document.getElementById('traces');
    let dirminer = upath.toUnix(upath.join(__dirname, "../miner","AVR_Miner.py"));
    let python = require('child_process').spawn('python', [dirminer, '']);
    let stop_mining = document.getElementById('stop_mining');
    stop_mining.removeAttribute("disabled");
    stop_mining.onclick = function () {
        python.kill('SIGINT');
        document.getElementById('start_mining').removeAttribute("disabled");
        stop_mining.setAttribute("disabled", true);
    };
    python.stdout.on('data', function (data) {
        console.log("Python response: ", data.toString('utf8'));
        //traces.innerHTML += '<code>' + data.toString('utf8') + '</code><br>';
        traces.innerHTML += String.fromCharCode.apply(null, data);
    });
    python.stderr.on('data', (data) => {
        //traces.innerHTML += '<code>child process exited with code ' + data + '</code><br>';
        //traces.innerHTML += '<code>' + data.toString('utf8') + '</code><br>';
        traces.innerHTML += String.fromCharCode.apply(null, data);
    });

    python.on('close', (data) => {
        //traces.innerHTML += '<code>child process exited with code ' + code + '</code><br>';
        //traces.innerHTML += '<code>' + code.toString('utf8') + '</code><br>';
        traces.innerHTML += String.fromCharCode.apply(null, data);
    });
}

function runBootloader() {
    let traces = document.getElementById('traces_boot');
    let dircode = upath.toUnix(upath.join(__dirname, "../miner","upload-sketch.py"));
    let python = require('child_process').spawn('python', [dircode, '']);
    let start_boot = document.getElementById('start_boot');
    //start_boot.setAttribute("disabled", true);
    python.stdout.on('data', function (data) {
        console.log("Python response: ", data.toString('utf8'));
        //traces.innerHTML += '<code>' + data.toString('utf8') + '</code><br>';
        traces.innerHTML += String.fromCharCode.apply(null, data);
    });
    python.stderr.on('data', (data) => {
        //traces.innerHTML += '<code>child process exited with code ' + data + '</code><br>';
        //traces.innerHTML += '<code>' + data.toString('utf8') + '</code><br>';
        traces.innerHTML += String.fromCharCode.apply(null, data);
    });
    python.on('close', (data) => {
        traces.innerHTML += 'child process exited with code ' + data;
        //traces.innerHTML += '<code>' + code.toString('utf8') + '</code><br>';
        // traces.innerHTML += String.fromCharCode.apply(null, data);
    });
}