var log = console.log;
var dropZone = $("#drop-zone");
var img = $("#img");
var btnSubmit = $(".btn-submit-image");
var validImageTypes = ["image/gif", "image/jpeg", "image/png"];
const maxFileSize = 10485760; // 10 MB

dropZone.bind({
    dragover: function (e) {
        e.preventDefault();
        dropZone.addClass("drop-zone-over");
    },
    dragleave: function (e) {
        e.preventDefault();
        dropZone.removeClass("drop-zone-over");
    }
})

dropZone.on('drop', function (e) {
    e.stopPropagation();
    e.preventDefault();
    var droppedFile = e.originalEvent.dataTransfer.files[0];
    var fileType = droppedFile.type;
    var fileSize = droppedFile.size;

    if (checkFileType(fileType) == false) {
        return false;
    }

    if (checkFileSize(fileSize, maxFileSize) == false) {
        return false;
    };

    $(".modal").css('visibility', 'visible').addClass('active');
    img.css({ 'border-radius': '6px', 'width': '100%', 'height': '100%' });

    var reader = new FileReader();
    const formData = new FormData();

    reader.onload = function (ev) {
        img.attr('src', ev.target.result);
        var data = (ev.target.result).split(',')[1];
        formData.append('image', data);
    };

    reader.readAsDataURL(droppedFile);

    btnSubmit.click(function (event) {
        event.preventDefault();
        var title = $("#form-title").val();
        var description = $("#form-description").val();
        formData.append('title', title);
        formData.append('description', description);

        fetch('https://api.imgur.com/3/image', {
            method: 'POST',
            headers: {
                Authorization: 'Client-ID f1a273e66909554',
            },
            body: formData
        })
            .then(response => response.json())
            .then(result => {

                if (result.status == 200) {
                    $(".modal").removeClass('active').css('visibility', 'hidden');

                    Swal.fire({
                        title: 'Success!',
                        padding: '5px',
                        html: `<a href="${result.data.link}" target="_blank">Click me to view the image</a>`,
                        icon: 'success',
                        background: '#fff',
                        customClass: { confirmButton: "btn btn-okay" },
                        confirmButtonColor: '#44c767',
                        confirmButtonText: 'Okay'
                    })
                        .then(function (result) {
                            if (result.value) { location.reload(); }
                        });

                } else {
                    throw new Error("Status: " + result.status);
                }
            }).catch(error => {
                Swal.fire({
                    title: 'Oops...',
                    text: 'Something went wrong!',
                    icon: 'error',
                    confirmButtonText: 'Okay'
                })

                console.error("Error: ", error);
            });
    });
    $("#form-title").val();
    $("#form-description").val();
});

$("#file-input").change(function (e) {
    var selectedFile = e.target.files[0];
    var fileType = selectedFile['type'];
    var fileSize = selectedFile.size;

    if (checkFileType(fileType) == false) {
        return false;
    }

    if (checkFileSize(fileSize, maxFileSize) == false) {
        return false;
    };

    $(".modal").css('visibility', 'visible').addClass('active');

    var reader = new FileReader();

    img.css({ 'border-radius': '6px', 'width': '99%', 'height': '90%' });
    const formData = new FormData();

    reader.onload = function (ev) {
        img.attr('src', ev.target.result);
        var data = (ev.target.result).split(',')[1];
        formData.append('image', data);
    };

    reader.readAsDataURL(selectedFile);

    btnSubmit.click(function (event) {
        event.preventDefault();
        var title = $("#form-title").val();
        var description = $("#form-description").val();

        formData.append('title', title);
        formData.append('description', description);

        fetch('https://api.imgur.com/3/image', {
            method: 'POST',
            headers: {
                Authorization: 'Client-ID f1a273e66909554',
            },
            body: formData
        })
            .then(response => response.json())
            .then(result => {

                if (result.status == 200) {
                    $(".modal").removeClass('active').css('visibility', 'hidden');

                    Swal.fire({
                        title: 'Success!',
                        padding: '5px',
                        html: `<a href="${result.data.link}" target="_blank">Click me to view the image</a>`,
                        icon: 'success',
                        background: '#fff',
                        customClass: { confirmButton: "btn btn-okay" },
                        confirmButtonColor: '#44c767',
                        confirmButtonText: 'Okay'
                    })
                        .then(function (result) {
                            if (result.value) { location.reload(); }
                        });

                } else {
                    throw new Error("Status: " + result.status);
                }
            }).catch(error => {
                Swal.fire({
                    title: 'Oops...',
                    text: 'Something went wrong!',
                    icon: 'error',
                    confirmButtonText: 'Okay'
                });
                console.error('Error: ', error);
            });
    });
    $("#form-title").val();
    $("#form-description").val();
});

function checkFileType(fileType) {
    if (!validImageTypes.includes(fileType)) {
        Swal.fire({
            title: 'Oops...',
            text: "Sorry, you can't upload that file type.",
            icon: 'error',
            confirmButtonText: 'Okay'
        });
        return false;
    }
};

function checkFileSize(fileSize, maxFileSize) {
    var res = true;
    if (fileSize > maxFileSize) {
        Swal.fire({
            title: 'Oops...',
            text: "File is too big. (Max 10 MB)",
            icon: 'error',
            confirmButtonText: 'Okay'
        });
        res = false;
    }
    return res;
};