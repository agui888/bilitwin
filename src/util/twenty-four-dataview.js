/***
 * Copyright (C) 2018 Qli5. All Rights Reserved.
 * 
 * @author qli5 <goodlq11[at](163|gmail).com>
 * 
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
*/

class TwentyFourDataView extends DataView {
    constructor(...args) {
        if (TwentyFourDataView.es6) {
            super(...args);
        }
        else {
            // ES5 polyfill
            // It is dirty. Very dirty.
            if (TwentyFourDataView.es6 === undefined) {
                try {
                    TwentyFourDataView.es6 = 1;
                    return super(...args);
                }
                catch (e) {
                    if (e.name == 'TypeError') {
                        TwentyFourDataView.es6 = 0;
                        let setPrototypeOf = Object.setPrototypeOf || function (obj, proto) {
                            obj.__proto__ = proto;
                            return obj;
                        };
                        setPrototypeOf(TwentyFourDataView, Object);
                    }
                    else throw e;
                }
            }
            super();
            let _dataView = new DataView(...args);
            _dataView.getUint24 = TwentyFourDataView.prototype.getUint24;
            _dataView.setUint24 = TwentyFourDataView.prototype.setUint24;
            _dataView.indexOf = TwentyFourDataView.prototype.indexOf;
            return _dataView;
        }
    }

    getUint24(byteOffset, littleEndian) {
        if (littleEndian) throw 'littleEndian int24 not implemented';
        return this.getUint32(byteOffset - 1) & 0x00FFFFFF;
    }

    setUint24(byteOffset, value, littleEndian) {
        if (littleEndian) throw 'littleEndian int24 not implemented';
        if (value > 0x00FFFFFF) throw 'setUint24: number out of range';
        let msb = value >> 16;
        let lsb = value & 0xFFFF;
        this.setUint8(byteOffset, msb);
        this.setUint16(byteOffset + 1, lsb);
    }

    indexOf(search, startOffset = 0, endOffset = this.byteLength - search.length + 1) {
        // I know it is NAIVE
        if (search.charCodeAt) {
            for (let i = startOffset; i < endOffset; i++) {
                if (this.getUint8(i) != search.charCodeAt(0)) continue;
                let found = 1;
                for (let j = 0; j < search.length; j++) {
                    if (this.getUint8(i + j) != search.charCodeAt(j)) {
                        found = 0;
                        break;
                    }
                }
                if (found) return i;
            }
            return -1;
        }
        else {
            for (let i = startOffset; i < endOffset; i++) {
                if (this.getUint8(i) != search[0]) continue;
                let found = 1;
                for (let j = 0; j < search.length; j++) {
                    if (this.getUint8(i + j) != search[j]) {
                        found = 0;
                        break;
                    }
                }
                if (found) return i;
            }
            return -1;
        }
    }
}

export default TwentyFourDataView;
