const serialports = require('serialport');
/*const {dialog} = require('electron').remote;*/
const fs = require('fs');
let previous_ports;

async function listSerialPorts() {
    await serialports.list().then((ports, err) => {
        let total = document.getElementById('total_ports');
        if(err) {
            document.getElementById('error').textContent = err.message
            total.innerHTML = '';
            return
        } else {
            document.getElementById('error').textContent = ''
        }
        //console.log('ports', ports);

        if (ports.length === 0) {
            document.getElementById('error').textContent = 'No ports discovered'
        }
        let list = document.getElementById('ports');
        if (previous_ports !== ports.length) {
            total.innerHTML = 'Ports detected: <b>' + ports.length + '</b>';
            list.innerHTML = '<div>';
            Object.entries(ports).forEach(([key, value]) => {
                list.innerHTML += '<div class="field">' +
                    '<input id="'+ value.path + '" type="checkbox" name="port" class="switch" checked="checked">' +
                    '<label for="'+ value.path + '">'+ value.path + '</label></div>';
            });
            list.innerHTML += '</div>';
        }
        previous_ports = ports.length;
    })
}

setTimeout(function listPorts() {
    listSerialPorts();
    setTimeout(listPorts, 2000);
}, 2000);


function manageMinerConfig () {
    let username = document.getElementById('username').textContent;
    let avrport = [];
    document.querySelectorAll("input[type=checkbox][name=port]:checked").forEach(function(port){
        avrport.push(port.id);
    });
    let identifier_string = document.getElementById("identifier").value;
    let identifier = identifier_string !== '' ? identifier_string : 'none';
    let content = "[arduminer]\n" +
        "username = " + username + "\n" +
        "avrport = " + avrport.toString() + "\n" +
        "donate = 0\n" +
        "language = english\n" +
        "identifier = " + identifier + "\n" +
        "debug = n\n" +
        "\n";
    fs.writeFile('AVRMiner_2.49_resources/Miner_config.cfg', content, (err) => {
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
            runMiner();
        }
    });
}

window.addEventListener('load', function() {
    let start_mining = document.getElementById('start_mining');
    start_mining.onclick = function () {
        manageMinerConfig();
        start_mining.setAttribute("disabled", true);
    };
    let clear_console = document.getElementById('clear_console');
    clear_console.onclick = function () {
        document.getElementById('traces').innerHTML = '';
    };

});

function runMiner() {
    let traces = document.getElementById('traces');
    let python = require('child_process').spawn('python', ['miner/AVR_Miner.py', '']);
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

    python.on('close', (code) => {
        //traces.innerHTML += '<code>child process exited with code ' + code + '</code><br>';
        //traces.innerHTML += '<code>' + code.toString('utf8') + '</code><br>';
        traces.innerHTML += String.fromCharCode.apply(null, data);
    });
}