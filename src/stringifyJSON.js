// this is what you would do if you liked things to be easy:
// var stringifyJSON = JSON.stringify;

// but you don't so you're going to write it from scratch:

// straight to string version of itself: boolean, number, and string
// returns undefined: function, undefined
// returns null: Infinity, NaN, null


var stringifyJSON = function(obj) {
  // your code goes here
  if(obj === Infinity || obj === NaN || obj === null) {
    return "null";
  } else if(obj === undefined || obj.constructor === Function) {
    return undefined;
  } else if(obj.constructor === String) {
    return '"' + obj.toString() + '"';
  }else if(obj.constructor === Boolean || obj.constructor === Number) {
    return obj.toString();
  } else if(obj.constructor === Array) {
    var res = '';
    for(var i=0; i<obj.length; i++) {
      res += stringifyJSON(obj[i]);
      if(i < obj.length - 1) res += ','
    }
    return '[' + res + ']';
  } else if(obj.constructor === Object) {
    var res = '';
    for(var item in obj) {
      var key = stringifyJSON(item);
      if(key===undefined) continue;
      var value = stringifyJSON(obj[item]);
      if(value===undefined) continue;
      res += key + ':' + value + ',';
      // if(!"somehow find if this is the last item") res += ','
    }
    return '{' + res.substring(0, res.length-1) + '}';
  }
};
