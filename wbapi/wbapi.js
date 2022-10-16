const cbt = async () => {
    const device = await navigator.bluetooth.requestDevice({
        optionalServices: ["battery_service", "device_information", 0x1844],
        acceptAllDevices: true,
    });
    let deviceName = device.gatt.device.name;
    const server = await device.gatt.connect();
    const batteryService = await server.getPrimaryService("battery_service");
    const infoService = await server.getPrimaryService("device_information");

    const batteryLevelchar = await batteryService.getCharacteristic("Battery_level");
    const batteryLevel = await batteryLevelCharacteristic.readValue();
    const batteryPercent = await batteryLevel.getUint8(0);
    const infoCharacteristics = await infoService.getCharacteristics();
    console.log(infoCharacteristics);
    let infoValues = [];
    const promise = new Promise((resolve, reject) => {
        infoCharacteristics.forEach(async (characteristic, index, array) => {
            // Returns a buffer
            const value = await characteristic.readValue();
            console.log(new TextDecoder().decode(value));
            // Convert the buffer to string
            infoValues.push(new TextDecoder().decode(value));
            if (index === array.length - 1) resolve();
        });
    });

    // if (!('bluetooth' in navigator)) {
    //     document.write("WBAPI not supported");
    // } else {
    //     navigator.bluetooth.requestDevice({acceptAllDevices:true}).then((de))
    // }
}