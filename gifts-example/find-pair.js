/*
    Given sorted set

    get first element and price
    store in hashMap


    get next element and price N
    if pair[1] + N == max
        return (pair[1], N)
    else if pair[1] + N > max
        return pair
    else if pair[1] + N < max
        set pair = (pair[1], N)
*/

const fs = require("fs");
var LineByLineReader = require('line-by-line');

var data = {
    "Candy Bar": 500,
    "Paperback Book": 700,
    "Detergent": 1000,
    "Headphones": 1400,
    "Earmuffs": 2000,
    "Bluetooth Stereo": 6000
}

var checkValidity = function(item1, item2, max) {
    if ((item1 + item2) > max) {
        return false;
    } else if ((item1 + item2) === max) {
        return true;
    } else if ((item1 + item2) < max) {
        return true;
    }
};

var createPair = function(oldPair, key, value, index) {
    const newPair = {};
    const keys = Object.keys(oldPair);
    newPair[keys[index]] = oldPair[keys[index]];
    newPair[key] = value;
    return newPair;
};


var findPair = function(data, pair, max) {
    const keys = Object.keys(data);
    pair = pair || {};
    for (var key in data) {
        const pairKeys = Object.keys(pair);
        if (pairKeys.length == 0) {
            pair[key] = data[key];
        } else if ( checkValidity(pair[pairKeys[1]], data[key], max) ) {
            pair = createPair(pair, key, data[key], 1);
        } else if ( checkValidity(pair[pairKeys[0]], data[key], max) ) {
            pair = createPair(pair, key, data[key], 0);
        } else {
            break;
        }
    }
    return pair;
};


var concurrentArray = [];

var getPair = function(max, pair) {
    pair = pair || {};
    const obj = concurrentArray.shift();
    if (obj) {
        pair = findPair(obj, pair, max);
        setTimeout(function() {
            getPair(max, pair);
        }, 100);
    } else {
        if (Object.getOwnPropertyNames(pair).length < 2) {
            console.log("Not possible");
            return;
        }
        console.log(pair);
    }
};


var findPairStream = function(max) {
    var lr = new LineByLineReader('./prices.txt');
    lr.on('line', function(line) {
        const arr = line.split(',');
        const obj = {};
        obj[arr[0]] = parseInt(arr[1], 10);
        concurrentArray.push(obj);
    });
    lr.on('end', function() {
        concurrentArray.push(null);
    });
};


const args = process.argv;
const max = parseInt(args[2], 10);

/*
    In memory object use case
*/
// const pair = findPair(data, parseInt(args[2], 10)));
// if (Object.getOwnPropertyNames(pair).length < 2) {
//     return "Not possible";
// }
// return pair;


/*
    File streaming use case
*/
findPairStream();
setTimeout(function() {
    getPair(max);
}, 10);















