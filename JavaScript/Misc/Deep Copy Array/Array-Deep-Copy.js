var src = [ 1, 2, 3, 4, 5 ], 
    dest = [];

// Easy to 'deep copy' an Array
[].push.apply( dest, src );