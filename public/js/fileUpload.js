
$(".custom-file-input").on("change", function () {
    var fileName = $(this).val().split("\\").pop();
    $(this).siblings(".custom-file-label").addClass("selected").html(fileName);
});

$('#submit').on('click', function(){
    let formdata = new FormData();
    let file = $("#fileUpload")[0].files[0];
    // alert(file)
    formdata.append('fileUpload', file);
    // alert(JSON.stringify(file))
    fetch('/fileUpload', {
        method: 'POST',
        body: formdata
    })
        .then(res => res.json())
        .then((data) => {
            // alert(data.file)
            // $('#poster').attr('src', data.file);
            $('#fileURL').attr('value', data.file); // sets posterURL hidden field
            alert($('#fileURL').attr('value'))
            if (data.err) {
                $('#fileErr').show();
                $('#fileErr').text(data.err.message);
            }
            else {
                $('#fileErr').hide();
            }
            $('#contactForm').trigger('submit')
        })
})