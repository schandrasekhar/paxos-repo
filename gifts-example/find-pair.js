const fs = require("fs");
const LineByLineReader = require('line-by-line');


/*
    Have considered two use cases here
    1. The entire file is loaded in memory as a hash map. This can be used based on file size and hardware ram size
    2. The entire file is streamed per line into an array and a function keeps shifting from the array. This
        can be used if the file size is very large, there are hardware ram restrictions or the file size is potentially
        infinite(a never ending stream of lines)

    For the stream use case i have used two functions
    1. `getGifts.stream.findPairStream`: this parses each line of the file and pushed it onto a array data structure
    2. `getGifts.stream.getPair`: this shifts a line from the array and check if there is valid combination possible.
        this is a recursive function which calls itself with a given timeout. Another possible implementation in javascript
        can be a event driven system where instead of a array events can be fired and listened upon (and action can be taken).
        Another possible implementation can be the check for a valid combination can be done via events from a readable stream.
        As javascript is inherently single threaded i did not choose the multithreaded option, where the task of finding a possible
        valid combination can be assigned to two threads and they can communicate via a shared data structure (or) via messages (for e.g.
        the channel construct in golang or something like message oriented middleware which is able to pass on messages from producers to 
        consumers)
    
    Big O notation
    if the file has `n` lines and `m` gifts need to be returned, then big O notation is O(n * combination(m))


    TODOS:
    1. I have assumed that a valid combination can be of only two items (hardcoded it in the code). A better implementation
        can be say for a par of `r` items all possible combinations of (`r-1` + 1(gotten from the file)) can be calculated
        and then the first valid one can be chosen.
*/




/*
    Data to be used for in memory object use case
*/
var data = {
    "Candy Bar": 50000,
    "Paperback Book": 700,
    "Detergent": 1000,
    "Headphones": 1400,
    "Earmuffs": 2000,
    "Bluetooth Stereo": 6000
};

const getGifts = {
    findPair: function(data, max) {
        const pair = getGifts._findPair(data, null, max);
        if (Object.getOwnPropertyNames(pair).length < 2) {
            return "Not possible";
        }
        return pair;
    },
    /*
        This function creates a pair that is sent to the client if valid
    */
    createPair: function(oldPair, key, value, index) {
        const newPair = {};
        const keys = Object.keys(oldPair);
        newPair[keys[index]] = oldPair[keys[index]];
        newPair[key] = value;
        return newPair;
    },

    /*
        This function checks whether the given item's value can be a valid entry or not
    */
    checkValidity: function(item1, item2, max) {
        if ((item1 + item2) > max) {
            return false;
        } else if ((item1 + item2) === max) {
            return true;
        } else if ((item1 + item2) < max) {
            return true;
        }
    },

    /*
        This function returns a pair which is valid i.e. returns two items (if possible) whose sum
        is lesser than or equal to the amount provided by the user
    */
    _findPair: function(data, pair, max) {
        const keys = Object.keys(data);
        pair = pair || {};
        for (var key in data) {
            const pairKeys = Object.keys(pair);
            if (pairKeys.length == 0) {
                pair[key] = data[key];
            } else if (getGifts.checkValidity(pair[pairKeys[1]], data[key], max)) {
                pair = getGifts.createPair(pair, key, data[key], 1);
            } else if (getGifts.checkValidity(pair[pairKeys[0]], data[key], max)) {
                pair = getGifts.createPair(pair, key, data[key], 0);
            } else {
                break;
            }
        }
        return pair;
    },

    /*
        These methods are used for the streaming of file use case
    */
    stream: {
        /*
            Data structure used to store the lines streamed from the file
        */
        concurrentArray: [],

        /*
            This function shifts a value from the array and checks if a pair is possible
        */
        getPair: function(max, pair) {
            pair = pair || {};
            const obj = getGifts.stream.concurrentArray.shift();
            if (obj) {
                pair = getGifts._findPair(obj, pair, max);
                setTimeout(function() {
                    getGifts.stream.getPair(max, pair);
                }, 100);
            } else {
                if (Object.getOwnPropertyNames(pair).length < 2) {
                    console.log("Not possible");
                    return;
                }
                console.log(pair);
            }
        },

        /*
            This function reads a file and pushes each line of the file in a given format to the array
        */
        findPairStream: function(max) {
            var lr = new LineByLineReader('./prices.txt');
            lr.on('line', function(line) {
                const arr = line.split(',');
                const obj = {};
                obj[arr[0]] = parseInt(arr[1], 10);
                getGifts.stream.concurrentArray.push(obj);
            });
            lr.on('end', function() {
                getGifts.stream.concurrentArray.push(null);
            });
        }
    }
};

const args = process.argv;
const max = parseInt(args[2], 10);

/*
    In memory object use case
*/
const pair = getGifts.findPair(data, max);
console.log(pair);


/*
    File streaming use case
*/
// getGifts.stream.findPairStream();
// setTimeout(function() {
//     getGifts.stream.getPair(max);
// }, 10);


module.exports = getGifts;