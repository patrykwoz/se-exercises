$(function () {
    const cupcakesContainer = $("ul.cupcakes-container");
    $("ul.cupcakes-container").on("click", "a#cupcake-delete-btn", function (event) {
        event.preventDefault(); // Prevent the default link behavior
        var url = $(this).attr("href");
        handleDeleteCupcake(url);
    });

    $("ul.cupcakes-container").on("click", "a#cupcake-edit-btn", function (event) {
        event.preventDefault(); // Prevent the default link behavior
        var url = $(this).attr("href");
        var dataId = $(this).attr("data-id");
        parentElement = $(this).parent();
        handleEditCupcake(url, parentElement, dataId);
    });

    $("ul.cupcakes-container").on("click", "a.btn-cancel-edit", function (event) {
        event.preventDefault(); // Prevent the default link behavior
        var url = $(this).attr("href");
        var dataId = $(this).attr("data-id");
        parentElement = $(this).parent();
        handleCancelEditForm(url, parentElement, dataId);
    });

    function refreshCupcakesList() {
        axios
            .get("/api/cupcakes")
            .then(function (response) {
                // Handle the response data here
                const cupcakes = response.data.cupcakes;
                cupcakesContainer.empty(); // Clear the existing list
                cupcakes.forEach(function (cupcake) {
                    var newCupcakeElement = $(`<li>
                        <h3>Flavor: ${cupcake.flavor}</h3>
                        <img src="${cupcake.image}">
                        <p>Rating: ${cupcake.rating}</p>
                        <p>Size: ${cupcake.size}</p>
                        <a href="/api/cupcakes/${cupcake.id}" data-id="${cupcake.id}" class="btn" id="cupcake-edit-btn">Edit</a>
                        <a href="/api/cupcakes/${cupcake.id}" data-id="${cupcake.id}" class="btn" id="cupcake-delete-btn">Delete</a>
                    </li>`);
                    cupcakesContainer.append(newCupcakeElement);
                });
            })
            .catch(function (error) {
                // Handle any errors that occurred during the request
                console.error(error);
            });
    }

    function handleDeleteCupcake(url){
        axios
            .delete(url)
            .then(function  (response){
                console.log(response.data);
                refreshCupcakesList();
            })
            .catch(function(error){
                console.log(error);
            });
    }

    function handleEditCupcake(url, parentElement, id){
        console.log(url, parentElement);
        var cupcakeEditForm = $(`
        <form action="${url}" data-id="${id}" class="edit-cupcake-form">
            <div class="input-container">
                <label for="input-flavor-${id}">Flavor</label>
                <input type="text" name="flavor" id="input-flavor-${id}">
            </div>
            <div class="input-container">
                <label for="input-size-${id}">Size</label>
                <input type="text" name="size" id="input-size-${id}">
            </div>
            <div class="input-container">
                <label for="input-image-${id}">Image</label>
                <input type="url" name="image" id="input-image-${id}">
            </div>
            <div class="input-container">
                <label for="input-rating-${id}">Rating</label>
                <input type="number" name="rating" id="input-rating-${id}">
            </div>
        <a href="" class="btn-cancel-edit btn">Cancel</a>
        <button>Submit Changes</button>
        </form>
        `);
        parentElement.append(cupcakeEditForm);
    }

    function handleCancelEditForm(url, parentElement, id){
        parentElement.remove();
    }

    // Initial cupcake list retrieval
    refreshCupcakesList();

    $("#new-cupcake-form").submit(function (event) {
        event.preventDefault();
        var formDataArray = $(this).serializeArray();

        // Convert the array of objects to a JavaScript object
        var formDataObject = {};
        formDataArray.forEach(function (input) {
            formDataObject[input.name] = input.value;
        });

        // Convert the JavaScript object to a JSON string
        var formDataJSON = JSON.stringify(formDataObject);


        const url = "/api/cupcakes";

        // Define a config object to specify the Content-Type header
        const config = {
            headers: {
                'Content-Type': 'application/json'
            }
        };

        axios
            .post(url, formDataJSON, config)
            .then(function () {
                // Clear the form fields
                $(this).trigger('reset');
                // Refresh the cupcakes list after a successful POST
                refreshCupcakesList();
            })
            .catch(function (error) {
                // Handle any errors that occurred during the request
                console.error(error);
            });
    });

    $("ul.cupcakes-container").on("submit", "form.edit-cupcake-form", function (event) {
        event.preventDefault();
        var formDataArray = $(this).serializeArray();

        // Convert the array of objects to a JavaScript object
        var formDataObject = {};
        formDataArray.forEach(function (input) {
            formDataObject[input.name] = input.value;
        });

        // Convert the JavaScript object to a JSON string
        var formDataJSON = JSON.stringify(formDataObject);

        var id = $(this).attr("data-id");
        
        const url = `/api/cupcakes/${id}`;

        // Define a config object to specify the Content-Type header
        const config = {
            headers: {
                'Content-Type': 'application/json'
            }
        };

        axios
            .patch(url, formDataJSON, config)
            .then(function () {
                // Clear the form fields
                $(this).trigger('reset');
                // Refresh the cupcakes list after a successful POST
                refreshCupcakesList();
            })
            .catch(function (error) {
                // Handle any errors that occurred during the request
                console.error(error);
            });
    });
});
