//Special thanks to this article for making this happen: https://loginov-rocks.medium.com/how-to-make-a-web-app-for-your-own-bluetooth-low-energy-device-arduino-2af8d16fdbe8

let connectButton = document.getElementById('connect');
let disconnectButton = document.getElementById('disconnect');
let terminalContainer = document.getElementById('terminal');

let deviceCache = null;
let characteristicCache = null;
let readBuffer = '';


// let sendForm = document.getElementById('send-form');
// let inputField = document.getElementById('input');

// Connect to the device on Connect button click
connectButton.addEventListener('click', function () {
    connect();
});

// Disconnect from the device on Disconnect button click
disconnectButton.addEventListener('click', function () {
    disconnect();
});

// Handle form submit event
/* sendForm.addEventListener('submit', function (event) {
    event.preventDefault(); // Prevent form sending
    send(inputField.value); // Send text field contents
    inputField.value = '';  // Zero text field
    inputField.focus();     // Focus on text field
}); */

// Launch Bluetooth device chooser and connect to the selected
let connect = () => {
    return (deviceCache ? Promise.resolve(deviceCache) :
        requestBluetoothDevice()).
        then(device => connectDeviceAndCacheCharacteristic(device)).
        then(characteristic => startNotifications(characteristic)).
        catch(error => log(error));
}

// Disconnect from the connected device
let disconnect = () => {
    if (deviceCache) {
        log('Disconnecting from "' + deviceCache.name + '" bluetooth device...');
        deviceCache.removeEventListener('gattserverdisconnected',
            handleDisconnection);

        if (deviceCache.gatt.connected) {
            deviceCache.gatt.disconnect();
            log('"' + deviceCache.name + '" bluetooth device disconnected');
        }
        else {
            log('"' + deviceCache.name +
                '" bluetooth device is already disconnected');
        }
    }

    // Added condition
    if (characteristicCache) {
        characteristicCache.removeEventListener('characteristicvaluechanged',
            handleCharacteristicValueChanged);
        characteristicCache = null;
    }

    deviceCache = null;
}


let requestBluetoothDevice = () => {
    log('Requesting bluetooth device...');

    return navigator.bluetooth.requestDevice({
        filters: [{ services: [0xFFE0] }],
    }).
        then(device => {
            log('"' + device.name + '" bluetooth device selected');
            deviceCache = device;

            // Added line
            deviceCache.addEventListener('gattserverdisconnected',
                handleDisconnection);

            return deviceCache;
        });
}

let handleDisconnection = (event) => {
    let device = event.target;

    log('"' + device.name +
        '" bluetooth device disconnected, trying to reconnect...');

    connectDeviceAndCacheCharacteristic(device).
        then(characteristic => startNotifications(characteristic)).
        catch(error => log(error));
}

let connectDeviceAndCacheCharacteristic = (device) => {
    if (device.gatt.connected && characteristicCache) {
        return Promise.resolve(characteristicCache);
    }

    log('Connecting to GATT server...');

    return device.gatt.connect().
        then(server => {
            log('GATT server connected, getting service...');

            return server.getPrimaryService(0xFFE0);
        }).
        then(service => {
            log('Service found, getting characteristic...');

            return service.getCharacteristic(0xFFE1);
        }).
        then(characteristic => {
            log('Characteristic found');
            characteristicCache = characteristic;

            return characteristicCache;
        });
}

let startNotifications = (characteristic) => {
    log('Starting notifications...');

    return characteristic.startNotifications().
        then(() => {
            log('Notifications started');
            // Added line
            characteristic.addEventListener('characteristicvaluechanged',
                handleCharacteristicValueChanged);
        });
}

const log = (data, type = '') => {
    terminalContainer.insertAdjacentHTML('beforeend',
        '<div' + (type ? ' class="' + type + '"' : '') + '>' + data + '</div>');
}

let handleCharacteristicValueChanged = (event) => {
    let value = new TextDecoder().decode(event.target.value);

    for (let c of value) {
        if (c === '\n') {
            let data = readBuffer.trim();
            readBuffer = '';
            if (data) {
                receive(data);
            }
        }
        else {
            readBuffer += c;
        }
    }
}

const receive = (data) => {
    log(data, 'in');
}