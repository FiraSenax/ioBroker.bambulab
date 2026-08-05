'use strict';

/** @param {unknown} serial - Configured printer serial number. */
function canonicalizeSerial(serial) {
    return String(serial || '')
        .trim()
        .toUpperCase();
}

/** @param {Array<{id?: number, temp?: unknown}> | undefined} extruders - H2 extruder status entries. */
function decodeH2NozzleTemperatures(extruders) {
    const temperatures = {};
    if (!Array.isArray(extruders)) {
        return temperatures;
    }
    for (const extruder of extruders) {
        const temperatureWord = extruder?.temp;
        if (typeof temperatureWord !== 'number' || !Number.isInteger(temperatureWord)) {
            continue;
        }
        const side = extruder.id === 0 ? 'right' : extruder.id === 1 ? 'left' : null;
        if (side) {
            temperatures[`${side}_nozzle_temper`] = temperatureWord & 0xffff;
            temperatures[`${side}_nozzle_target_temper`] = (temperatureWord >>> 16) & 0xffff;
        }
    }
    return temperatures;
}

module.exports = { canonicalizeSerial, decodeH2NozzleTemperatures };
