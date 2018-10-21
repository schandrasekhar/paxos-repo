let getGifts = require('./find-pair');
var expect = require('expect');

var mockdata = {
    "Candy Bar": 500,
    "Paperback Book": 700,
    "Detergent": 1000,
    "Headphones": 1400,
    "Earmuffs": 2000,
    "Bluetooth Stereo": 6000
};

let pair;

//minimum test case
pair = getGifts.findPair(mockdata, 1100);
expect(typeof pair).toBe('string');

//normal use case
pair = getGifts.findPair(mockdata, 2400);
expect(typeof pair).toBe('object');
expect(pair).toMatchObject({ Detergent: 1000, Headphones: 1400 });



//maximum use case
pair = getGifts.findPair(mockdata, 500000);
expect(typeof pair).toBe('object');
expect(pair).toMatchObject({Earmuffs: 2000, "Bluetooth Stereo": 6000});



