//get the articles in json format
$.getJSON("articles", function(data) {
    for (let i = 0; i < data.length; i++) {
        $("articles").append("<p data-id='" + data[i]._id + "'>" + data[i].title + "<br />" + data[i].link + "</p>");
    }
});

//When the "p" tag is clicked do the following:
$(document).on("click", "p", function() {
    $("#notes").empty();
    
    let thisId = $(this).attr("data-id");

    $.ajax({
        method: "GET",
        url: "/articles/" + thisId
    })
    .then(function(data) {
        console.log(data);
        $("#notes").append("<h2>" + data.title + "</h2>");
        $("#notes").append("<input id='titleinput' name='title' >");
        $("#notes").append("<textarea id='bodyinput' name='body'></textarea>");
        $("#notes").append("<button data=id='" + data._id + "' id='savenote'>Save Note</button");

        if (data.note) {
            $("#titleinput").val(data.note.title);
            $("#bodyinput").val(data.note.body);
        }
    });
});

$(document).on("click", "#savenote", function() {
    //get the ID tied to the ID  from the submit button
    let thisId = (this).attr("data-id");

    //Post the information change to the note using the current inputs
    $.ajax({
        method: "POST",
        url: "/articles/" + thisId,
        data: {
            title: $("#titleinput").val(),
            body: $("#bodyinput").val()
        }
    })

    .then(function(data) {
        console.log(data);
        $("#notes").empty();
    });

    $("#titleinput").val("");
    $("#bodyinput").val("");
});