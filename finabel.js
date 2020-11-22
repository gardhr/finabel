/**
 * Make sure the charset of the page using this script is
 * set to utf-8 or you will not get the correct results.
 */
var utf8 = (function () {
    var highSurrogateMin = 0xd800,
        highSurrogateMax = 0xdbff,
        lowSurrogateMin  = 0xdc00,
        lowSurrogateMax  = 0xdfff,
        surrogateBase    = 0x10000;
    
    function isHighSurrogate(charCode) {
        return highSurrogateMin <= charCode && charCode <= highSurrogateMax;
    }
    
    function isLowSurrogate(charCode) {
        return lowSurrogateMin <= charCode && charCode <= lowSurrogateMax;
    }
    
    function combineSurrogate(high, low) {
        return ((high - highSurrogateMin) << 10) + (low - lowSurrogateMin) + surrogateBase;
    }
    
    /**
     * Convert charCode to JavaScript String
     * handling UTF16 surrogate pair
     */
    function chr(charCode) {
        var high, low;
        
        if (charCode < surrogateBase) {
            return String.fromCharCode(charCode);
        }
        
        // convert to UTF16 surrogate pair
        high = ((charCode - surrogateBase) >> 10) + highSurrogateMin,
        low  = (charCode & 0x3ff) + lowSurrogateMin;
        
        return String.fromCharCode(high, low);
    }
    
    /**
     * Convert JavaScript String to an Array of
     * UTF8 bytes
     * @export
     */
    function stringToBytes(str) {
        var bytes = [],
            strLength = str.length,
            strIndex = 0,
            charCode, charCode2;
        
        while (strIndex < strLength) {
            charCode = str.charCodeAt(strIndex++);
            
            // handle surrogate pair
            if (isHighSurrogate(charCode)) {
                if (strIndex === strLength) {
                    throw new Error('Invalid format');
                }
                
                charCode2 = str.charCodeAt(strIndex++);
                
                if (!isLowSurrogate(charCode2)) {
                    throw new Error('Invalid format');
                }
                
                charCode = combineSurrogate(charCode, charCode2);
            }
            
            // convert charCode to UTF8 bytes
            if (charCode < 0x80) {
                // one byte
                bytes.push(charCode);
            }
            else if (charCode < 0x800) {
                // two bytes
                bytes.push(0xc0 | (charCode >> 6));
                bytes.push(0x80 | (charCode & 0x3f));
            }
            else if (charCode < 0x10000) {
                // three bytes
                bytes.push(0xe0 | (charCode >> 12));
                bytes.push(0x80 | ((charCode >> 6) & 0x3f));
                bytes.push(0x80 | (charCode & 0x3f));
            }
            else {
                // four bytes
                bytes.push(0xf0 | (charCode >> 18));
                bytes.push(0x80 | ((charCode >> 12) & 0x3f));
                bytes.push(0x80 | ((charCode >> 6) & 0x3f));
                bytes.push(0x80 | (charCode & 0x3f));
            }
        }
        
        return bytes;
    }

    /**
     * Convert an Array of UTF8 bytes to
     * a JavaScript String
     * @export
     */
    function bytesToString(bytes) {
        var str = '',
            length = bytes.length,
            index = 0,
            byte,
            charCode;
        
        while (index < length) {
            // first byte
            byte = bytes[index++];
            
            if (byte < 0x80) {
                // one byte
                charCode = byte;
            }
            else if ((byte >> 5) === 0x06) {
                // two bytes
                charCode = ((byte & 0x1f) << 6) | (bytes[index++] & 0x3f);
            }
            else if ((byte >> 4) === 0x0e) {
                // three bytes
                charCode = ((byte & 0x0f) << 12) | ((bytes[index++] & 0x3f) << 6) | (bytes[index++] & 0x3f);
            }
            else {
                // four bytes
                charCode = ((byte & 0x07) << 18) | ((bytes[index++] & 0x3f) << 12) | ((bytes[index++] & 0x3f) << 6) | (bytes[index++] & 0x3f);
            }
            
            str += chr(charCode);
        }
        
        return str;
    }
    
    return {
        stringToBytes: stringToBytes,
        bytesToString: bytesToString
    };
}());



var finabel = (function () {

  var hex = "0123456789abcdef";
  var lookup = new Array(256);
  for (var index = 0; index < 256; ++index)
    lookup[index] = hex.charAt(index >> 4) + hex.charAt(index & 0xf);

  function toHex(text) {
    var result = "";
    for (var index = 0, limit = text.length; index < limit; ++index) {
      var code = text.codePointAt(index);
      do {
        result += lookup[code & 0xff];
        code >>= 8;
      } while (code != 0);
    }
    return result;
  }

  A = BigInt(
    "900868433651123753195857434154886592863492075718887214387046829406809805283361296277175990663685161530183997243896077623165157756007099732429029873106259069821886766195661979481563101826429797570890866473513531898785774896418926615059720815237664116812063491035355207065882456370964859448027182804663"
  );

  B = BigInt(
    "906746488931122279923087816774254262549325961021203686871024593960273364483640837461275651353839912478276312989231907136777434371442297783809058139703704548112582549231057887119837609961275494698594028464424938139236812786325180573685365716054578878269276609138278646089652565880503149299047623725983"
  );

  C = BigInt(
    "935963679945159621618108135650731602316123462844739918966791054002220621454733515962631838558167071714943415781502503512108093455147689164719674990397035764248808486754562236727013255473894080575022971540677037449750273014794528407667454650131576454015775014701175216242011377646611112897139737772263"
  );

  var minimum_digits = C.toString(16).length;
  var record_separator = toHex("\u001e");
  var field_separator = toHex("\u001c");

  /*
 Key stretching function
*/

  function stretch(value) {
    var hex = value.toString(16);
    var buffer = hex;
    do {
      buffer += record_separator + hex;
    } while (buffer.length < minimum_digits);
    return BigInt("0x" + buffer);
  }

  /*
 Hash function interface
*/

  function hash(key, salt, rounds, digits) {
    if (rounds == null) rounds = 0;
    if (digits == null) digits = 0;
    var keys = Array.isArray(key) ? key : [key];
    keys.push(salt);

    /*
 Initial construction: concatenate keys/salt
*/

    var merged = record_separator;
    for (var index = 0, limit = keys.length; index < limit; ++index) {
      var next = keys[index];
      if (next == null || next == "") continue;
      merged += toHex(next) + field_separator;
    }

    /*
 Compute the hash
*/

    var V = BigInt("0x" + merged);
    do {
      var Q = stretch(V);
      var R = (Q * A) % B;
      var S = stretch(R);
      V = (Q * S) % C;
    } while (rounds-- > 0);

    var text = V.toString(16);

    if (digits > 0) {
      var length = text.length;
      if (length > digits) return text.substr(0, digits);
      while (length++ < digits) text += "0";
    }

    return text;
  }

  return hash;
})();

if (typeof module !== "undefined") module.exports = finabel;
else if (typeof define === "function" && define.amd)
  define(function () {
    return finabel;
  });
