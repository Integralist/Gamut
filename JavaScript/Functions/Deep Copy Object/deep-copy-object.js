var a = {
   foo   : { test: 1, test1: 2 },
   bar   : function(a) { alert(a) },
   foobar: 'foobar1',
   arr   : [1, [8, 9], {1: 1, 2: 2}, 4]
};
 
function clone_obj(obj) {
    var c = obj instanceof Array ? [] : {};
 
    for (var i in obj) {
        var prop = obj[i];
 
        if (typeof prop == 'object') {
           if (prop instanceof Array) {
               c[i] = [];
 
               for (var j = 0; j < prop.length; j++) {
                   if (typeof prop[j] != 'object') {
                       c[i].push(prop[j]);
                   } else {
                       c[i].push(clone_obj(prop[j]));
                   }
               }
           } else {
               c[i] = clone_obj(prop);
           }
        } else {
           c[i] = prop;
        }
    }
 
    return c;
}
 
var b = clone_obj(a);