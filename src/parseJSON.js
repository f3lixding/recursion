// this is what you would do if you were one to do things the easy way:
// var parseJSON = JSON.parse;

// but you're not, so you'll write it from scratch:

// throw a syntax error: trailing comma
// returns null: 'null'

// the recurrence is the inidividual items (key and value) in the object.
// Need to find a way to locate the closing parenthesis (use stack)
// extract the substring between the enclosing parenthesis and recusively call the function for the parsed return
var bracketSet = new Set(['"', '{', '}', '[', ']']);

var openingBrackets = {
  '}' : '{',
  '"' : '"',
  ']' : '['
};

var directionDetector = function(bracket) {
  if(bracket === '{' || bracket === '[') {
    return "open";
  } else if(bracket === '}' || bracket === ']') {
    return "close";
  }
};

var typeDetector = function(string) {
  var typeDict = {
    '{' : "object",
    '[' : "array",
    '"' : "string",
  };
  if(typeDict[string[0]]) {
    return typeDict[string[0]];
  } else if((Math.abs(string[0]-'0')>=0 && Math.abs(string[0]-'0')<=9) || (string-'0').toString() != 'NaN') {
    return "number";
  } else {
    // throw new Error(string + 'cannot be parsed');
    return undefined;
  }
};

var extractKeyValue = function(string) {
  var spool = [];
  var key = '';
  var value = '';
  for(var i=0; i<string.length; i++) {
    if(string[i]==='"') {
      if(spool[spool.length-1]==='"') {
        spool.pop();
      } else {
        spool.push(string[i]);
      }
    } else if(directionDetector(string[i])==='open') {
      spool.push(string[i]);
    } else if(directionDetector(string[i])==='close') {
      if(spool[spool.length-1]===openingBrackets[string[i]]) {
        spool.pop();
      } else {
        spool.push(string[i]);
      }
    } else if(string[i]===':') {
      if(!Boolean(spool.length)) {
        key = string.substring(0, i);
        value = string.substring(i+1);
        return [key, value];
      }
    }
  }
  return [];
}

var separate = function(string) { // string is expected to be the inners of an object (no outer brackets)
  var res = [];
  var spool = [];
  var tempBin = '';
  for(var i=0; i<string.length; i++) {
    if(string[i]==='"') {
      if(spool[spool.length-1]==='"') {
        spool.pop();
      } else {
        spool.push(string[i]);
      }
      tempBin += string[i];
    } else if(directionDetector(string[i])==="open") {
      spool.push(string[i]);
      tempBin += string[i];
    } else if(directionDetector(string[i])==="close") {
      if(spool[spool.length-1]===openingBrackets[string[i]]) {
        spool.pop();
      } else {
        spool.push(string[i]); // we should really throw error here
      }
      tempBin += string[i];
    } else if(string[i]===',') {
      if(!Boolean(spool.length)) {
        res.push(tempBin);
        tempBin = '';
      } else {
        tempBin += string[i];
      }
    } else if(string[i] === ' ' && !Boolean(spool.length)){
      continue;
    } else {
      tempBin += string[i];
    }
  }
  res.push(tempBin);
  return res;
};

var parseJSON = function(json) {
  if(json==="") return;
  // your code goes here
  // determine what the json is...
  // obj:
    // initiate new obj
    // iterate over the string
    // detect individual entity (..how)
      // obj.parseJSON(key_entity substring) = parseJSON(value_entity substring);
    // return obj
  var objType = typeDetector(json);
  if(objType === "object") {
    var res = {};
    var items = separate(json.substring(1, json.length-1));
    for(var i=0; i<items.length; i++) {
      var keyValue = extractKeyValue(items[i]);
      if(Boolean(keyValue[0]) && Boolean(keyValue[1])) {
        res[parseJSON(keyValue[0])] = parseJSON(keyValue[1]);
      }
    }
    return res;
  }
  // array:
    // initiate new array
    // iterate over the string
    // detect individual entity
      // array.push(parseJSON(entity substring))
    // return array
  if(objType === "array") {
    var res = [];
    var items = separate(json.substring(1, json.length-1));
    for(var i=0; i<items.length; i++) {
      var parsed = parseJSON(items[i]);
      if(parsed === null || parsed != undefined) {
        res.push(parsed);
      }
    }
    return res;
  }
  // strings:
    // if double quotes are present, return content inside the double quote, including the double quotes
  if(objType === "string") {
    return json.substring(1, json.length-1);
  }
  // numbers:
    // return corresponding numbers
  if(objType === "number") {
    return json - '0';
  }

  // booleans:
  if(json === 'null') {
    return null;
  } else if(json === 'true') {
    return true;
  } else if(json === 'false') {
    return false;
  }
};
