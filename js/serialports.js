const serialports = require('serialport')
let previous_ports;

async function listSerialPorts() {
    await serialports.list().then((ports, err) => {
        if(err) {
            document.getElementById('error').textContent = err.message
            total.innerHTML = '';
            return
        } else {
            document.getElementById('error').textContent = ''
        }
        console.log('ports', ports);

        if (ports.length === 0) {
            document.getElementById('error').textContent = 'No ports discovered'
        }
        let list = document.getElementById('ports');
        let total = document.getElementById('total_ports');
        if (previous_ports !== ports.length) {
            total.innerHTML = 'Ports detected: <b>' + ports.length + '</b>';
            list.innerHTML = '<div>';
            Object.entries(ports).forEach(([key, value]) => {
                list.innerHTML += '<div class="field">' +
                    '<input id="'+ value.path + '" type="checkbox" name="switchExample" class="switch" checked="checked">' +
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