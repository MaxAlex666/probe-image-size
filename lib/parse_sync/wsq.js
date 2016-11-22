'use strict';

/* eslint-disable consistent-return */

var readUInt16BE = require('../common').readUInt16BE;


module.exports = function (data) {

  if ((data.length < 2) || (data[0] !== 0xFF) || (data[1] !== 0xA0)) {
    return;                 // first marker of the file MUST be SOI_WSQ = 0xFFA0
  }

  var offset = 2;                        // Skip 2 chars, they are for signature
  while ((data.length - offset) > 2) {
    if (data[offset] !== 0xFF) {
      return;                                               // Not a WSQ marker!
    }

    var code = data[offset + 1];
    if (code === 0xA1) {
      return;                         // EOI_WSQ = 0xFFA1 end of the datastream!
    }

    offset += 2;                                                  // Skip marker
    if ((data.length - offset) < 2) {
      return;
    }
    var len = readUInt16BE(data, offset);       // Read length of the next block

    if ((code === 0xA2) && (data.length - offset >= 8)) {   // 0xFFA2 is SOF_WSQ
      return {
        width:  readUInt16BE(data, offset + 6),
        height: readUInt16BE(data, offset + 4),
        type:   'wsq',
        mime:   'application/octet-stream',
        wUnits: 'px',
        hUnits: 'px'
      };
    }

    offset += len;                                     // move to the next block
  }

  return;                                         // Invalid WSQ, no size found!
};
