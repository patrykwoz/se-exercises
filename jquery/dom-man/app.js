$(function(){
    console.log("Let’s get ready to party with jQuery!");
    $('article img').addClass('image-center');
    $('p:last').remove();
    let rndSize = Math.random()*100;
    $('h1').css('font-size',rndSize);
    $('ol').append('<li>Hmmm... lists are indeed pretty awesome.</li>');
    $('aside').empty().append('<p>We apologize for the existence of lists.</p>');

    const colorObj = { 'Red': 255, 'Blue': 255, 'Green': 255 };

    $('input.form-control').each(function() {
        const parentText = $(this).parent().text().trim();
        const inputValue = $(this).val();
        
        if (parentText in colorObj) {
            colorObj[parentText] = inputValue;
        }
    });

    $('input.form-control').on('input', function(e){
        const parentText = $(this).parent().text().trim();
        const inputValue = this.value;
        if (parentText in colorObj) {
            colorObj[parentText] = inputValue;
        }
        $('body').css('background-color', `rgb(${parseInt(colorObj.Red)}, ${parseInt(colorObj.Blue)}, ${parseInt(colorObj.Green)})`);
    })

    $('img').on('click', function(){
        $(this).remove();
    })
});

