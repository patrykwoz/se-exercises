
$(function(){
    const moviesObj = {};
    $('#insert-movies-ul').on('click','button.movie-delete-btn', function(e){
        delete moviesObj[e.target.parentElement.id];
        $(e.target.parentElement).remove();

    })

    
    $('#input-form').on('submit', function(e){
        e.preventDefault();

        if($('#title').val().trim().length < 2){
            alert('Title must have min. 2 characters.')
            return;
        }
        

        if (!(moviesObj[$('#title').val().trim()])){
            $(`<li class="inserted-movie" id="${$('#title').val()}">`)
            .append(`<p><b>Title:</b> ${$('#title').val()} <b>Rating:</b> ${$('#rating').val()}</p>`)
            .append('<button class="movie-delete-btn">Delete</button>')
            .appendTo($('#insert-movies-ul'));
            moviesObj[$('#title').val().trim()] = $('#rating').val();
        } else{
            $('#insert-movies-ul').empty();
            moviesObj[$('#title').val().trim()] = $('#rating').val();
            for (const key in moviesObj){
                const value = moviesObj[key];
                $(`<li class="inserted-movie" id="${key}">`)
                .append(`<p><b>Title:</b> ${key} <b>Rating:</b> ${value}</p>`)
                .append('<button class="movie-delete-btn">Delete</button>')
                .appendTo($('#insert-movies-ul'));
            }            
        }

        $('#title').val('');
        $('#rating').val(0);
        
    });

    $('#by-title').on('click', function(e){
        $('#insert-movies-ul').empty();

        const sortedMovies = sortMovies(moviesObj, 'by-title');
        for (const key in sortedMovies){
            const value = sortedMovies[key];
            $(`<li class="inserted-movie" id="${key}">`)
            .append(`<p><b>Title:</b> ${key} <b>Rating:</b> ${value}</p>`)
            .append('<button class="movie-delete-btn">Delete</button>')
            .appendTo($('#insert-movies-ul'));
        }
    });

    $('#by-rating').on('click', function(e){
        $('#insert-movies-ul').empty();

        const sortedMovies = sortMovies(moviesObj, 'by-rating');

        for (const key in sortedMovies){
            const value = sortedMovies[key];
            $(`<li class="inserted-movie" id="${key}">`)
            .append(`<p><b>Title:</b> ${key} <b>Rating:</b> ${value}</p>`)
            .append('<button class="movie-delete-btn">Delete</button>')
            .appendTo($('#insert-movies-ul'));
        }
    });
});



function sortMovies (obj, sortBy){

    const sortByTitle = {};
    if (sortBy === 'by-title'){
        const keysArr = Object.keys(obj);
        keysArr.sort();
        for (const key of keysArr){
            sortByTitle[key] = obj[key];
        }
        return sortByTitle;
    }

    if (sortBy === 'by-rating'){
        const keyValArr = Object.entries(obj);
        keyValArr.sort((a,b)=>b[1]-a[1]);
        const sortByRating = Object.fromEntries(keyValArr);
        return sortByRating;
    }
}