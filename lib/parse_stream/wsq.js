'use strict';


var ParserStream = require('../common').ParserStream;


function parseWsqMarker(parser, callback) {

  parser._bytes(2, function (data) {
    if (data[0] !== 0xFF) {                                 // not a WSQ marker!
      callback();
      return;
    }

    var code = data[1];
    if ((code === 0xA1) || (code === 0xA7)) {  // standalone markers: EOI_WSQ = 0xffa1, DRT_WSQ = 0xffa7
      callback(code, 0);
      return;
    }

// markers with length: SOF_WSQ=0xffa2, SOB_WSQ=0xffa3, DTT_WSQ=0xffa4,
// DQT_WSQ=0xffa5, DHT_WSQ=0xffa6, COM_WSQ=0xffa8

    if ((0xA2 <= code && code <= 0xA6) || (code === 0xA8)) {
      parser._bytes(2, function (length) {
        callback(code, length.readUInt16BE(0) - 2);
      });

      return;
    }

    callback();                                              // unknown markers!
  });
}


function getWsqSize(parser) {
  parseWsqMarker(parser, function (code, length) {

    if (!code || (length < 0)) {                                 // invalid WSQ!
      parser._skipBytes(Infinity);
      parser.push(null);
      return;
    }

    if (code === 0xA1) {              // EOI_WSQ = 0xFFA1 end of the datastream!
      parser._skipBytes(Infinity);
      parser.push(null);
      return;
    }

    if (length <= 0) {                                     // e.g. empty comment
      getWsqSize(parser);
      return;
    }

    if ((code === 0xA2) && (length >= 8)) {                 // 0xFFA2 is SOF_WSQ
      parser._bytes(length, function (data) {
        parser._skipBytes(Infinity);
        parser.push({
          width:  data.readUInt16BE(6),
          height: data.readUInt16BE(4),
          type: 'wsq',
          mime: 'application/octet-stream',
          wUnits: 'px',
          hUnits: 'px'
        });

        parser.push(null);
      });
      return;
    }

    parser._skipBytes(length, function () {
      getWsqSize(parser);
    });
  });
}


module.exports = function () {
  var parser = new ParserStream();

  parser._bytes(2, function (data) {

    if ((data[0] !== 0xFF) || (data[1] !== 0xA0)) { // first marker of the file MUST be SOI_WSQ = 0xFFA0
      parser._skipBytes(Infinity);
      parser.push(null);
      return;
    }

    getWsqSize(parser);
  });

  parser.on('finish', function () {
    parser.push(null);
  });

  return parser;
};
