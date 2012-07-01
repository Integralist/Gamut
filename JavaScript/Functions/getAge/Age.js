var someonesBirthDate = new Date(1982, 08, 30); // Original used "1982 08 30" and worked in all browsers except Safari which worked without the string
var now = new Date();
var ms = now.valueOf() - someonesBirthDate.valueOf();
var minutes = ms / 1000 / 60;
var hours = minutes / 60;
var days = hours / 24;
var years = days/365;
alert(Math.floor(years));