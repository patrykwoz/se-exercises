$(document).ready(function() {
    var contentDiv = $('<div>').attr('id', 'content').appendTo('body');

    console.log('hi from app.js');

    var baseUrl = 'http://numbersapi.com';
    var favNum = 7;

    axios
        .get(baseUrl + '/' + favNum)
        .then(function(response) {
            $('<h2>').text('Your favorite number is ' + favNum).appendTo(contentDiv);
            $('<p>').text(response.data).appendTo(contentDiv);
        })
        .catch(function(err) {
            console.log(err);
        });

    var favNums = [7, 11, 13];
    var favNumsPromise = axios.get(baseUrl + '/' + favNums);
    favNumsPromise
        .then(function(response) {
            $('<h2>').text('Your favorite numbers are ' + favNums.join(', ')).appendTo(contentDiv);
            var favNumsList = $('<ul>').appendTo(contentDiv);
            Object.keys(response.data).forEach(function(key) {
                $('<li>').text(response.data[key]).appendTo(favNumsList);
            });
        })
        .catch(function(err) {
            console.log(err);
        });

    var promises = [];
    for (var i = 0; i < 4; i++) {
        promises.push(axios.get(baseUrl + '/' + i));
    }

    Promise.all(promises)
        .then(function(promiseArr) {
            $('<h2>').text('Multiple Promises').appendTo(contentDiv);
            promiseArr.forEach(function(promise, i) {
                $('<p>').text('Number ' + i).appendTo(contentDiv);
                $('<p>').text(promise.data).appendTo(contentDiv);
            });
        })
        .catch(function(err) {
            console.log(err);
        });
});
