// If life was easy, we could just do things the easy way:
// var getElementsByClassName = function (className) {
//   return document.getElementsByClassName(className);
// };

// But instead we're going to implement it from scratch:
var filterFromHere = function(parentNode, className) {
  var res = [];
  if(parentNode.className != undefined && parentNode.className != "") {
    var potentialMatch = parentNode.className.split(' ');
    for(var i=0; i<potentialMatch.length; i++) {
      if(potentialMatch[i] === className) {
        res.push(parentNode);
        break;
      }
    }
  }

  var children = parentNode.childNodes;
  for(var i=0; i<children.length; i++) {
    res.push.apply(res, filterFromHere(children[i], className));
  }
  return res;
}
var getElementsByClassName = function(className) {
  // your code here

  return filterFromHere(document, className);
};
