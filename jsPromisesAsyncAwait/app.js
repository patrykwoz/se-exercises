$(document).ready(function() {
    var contentDiv = $('<div>').attr('id', 'content').appendTo('body');

    console.log('hi from app.js');

    var baseUrl = 'http://numbersapi.com';
    var favNum = 7;

    async function returnSingleFact(favNum) {
        try {
            let response = await axios.get(baseUrl + '/' + favNum)
            
            $('<h2>').text('Your favorite number is ' + favNum).appendTo(contentDiv);
            $('<p>').text(response.data).appendTo(contentDiv);
        } catch (err) {
            console.log(err);
        }
    }
    returnSingleFact(favNum);

    var favNums = [7, 11, 13];

    async function returnMultipleFacts(favNums) {
    var response = await axios.get(baseUrl + '/' + favNums);
        try{
            $('<h2>').text('Your favorite numbers are ' + favNums.join(', ')).appendTo(contentDiv);
            var favNumsList = $('<ul>').appendTo(contentDiv);
            Object.keys(response.data).forEach(function(key) {
                $('<li>').text(response.data[key]).appendTo(favNumsList);
            });
        } catch (err) {
            console.log(err);
        }
    }
    returnMultipleFacts(favNums);
        

    var promises = [];

    async function returnMultiplePromises() {
        for (var i = 0; i < 4; i++) {
            promises.push(axios.get(baseUrl + '/' + i));
        }
        try {
            var promiseArr = await Promise.all(promises);
            $('<h2>').text('Multiple Promises').appendTo(contentDiv);
            promiseArr.forEach(function(promise, i) {
                $('<p>').text('Number ' + i).appendTo(contentDiv);
                $('<p>').text(promise.data).appendTo(contentDiv);
            });
        } catch (err) {
            console.log(err);
        }
    }
    returnMultiplePromises();

});
