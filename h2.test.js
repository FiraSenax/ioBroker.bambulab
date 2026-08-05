'use strict';

const { expect } = require('chai');
const { canonicalizeSerial, decodeH2NozzleTemperatures } = require('./lib/h2');

describe('H2 printer protocol helpers', () => {
    it('canonicalizes the serial used in case-sensitive MQTT topics', () => {
        expect(canonicalizeSerial(' 31b8dp632100385 ')).to.equal('31B8DP632100385');
    });

    it('decodes live H2C dual-nozzle temperature words', () => {
        expect(
            decodeH2NozzleTemperatures([
                { id: 0, temp: 16056565 },
                { id: 1, temp: 2621493 },
            ]),
        ).to.deep.equal({
            right_nozzle_temper: 245,
            right_nozzle_target_temper: 245,
            left_nozzle_temper: 53,
            left_nozzle_target_temper: 40,
        });
    });

    it('ignores unknown extruders and invalid values', () => {
        expect(
            decodeH2NozzleTemperatures([
                { id: 2, temp: 123 },
                { id: 0, temp: '123' },
            ]),
        ).to.deep.equal({});
        expect(decodeH2NozzleTemperatures(undefined)).to.deep.equal({});
    });
});
