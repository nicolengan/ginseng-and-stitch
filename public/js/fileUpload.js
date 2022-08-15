
$(".custom-file-input").on("change", function () {
    var fileName = $(this).val().split("\\").pop();
    $(this).siblings(".custom-file-label").addClass("selected").html(fileName);
});

$('#submit').on('click', function () {
    let file = $("#fileUpload")[0].files[0];
    if (file != null) {
        let formdata = new FormData();
        formdata.append('fileUpload', file);
        fetch('/fileUpload', {
            method: 'POST',
            body: formdata
        })
            .then(res => res.json())
            .then((data) => {
                $('#fileURL').attr('value', data.file);
                if (data.err) {
                    $('#fileErr').show();
                    $('#fileErr').text(data.err.message);
                }
                else {
                    $('#fileErr').hide();
                }
                $('#contactForm').trigger('submit')
            })
    }
    else {
        $('#contactForm').trigger('submit')
    }
})