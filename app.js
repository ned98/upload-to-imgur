var log = console.log;
var dropZone = $("#drop-zone");
var img = $("#img");
var btnSubmit = $(".btn-submit-image");


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

    $(".modal-bg").css('visibility', 'visible').addClass('active');
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
                Authorization: 'Client-ID a42863129543066',
            },
            body: formData
        })
            .then(response => response.json())
            .then(result => {

                if (result.status == 200) {
                    $(".modal-bg").removeClass('active').css('visibility', 'hidden');

                    Swal.fire({
                        title: 'Success!',
                        padding: '5px',
                        html: `<a href="${result.data.link}" target="_blank">Click me to view the image</a>`,
                        icon: 'success',
                        background: '#fff',
                        customClass: { confirmButton: "btn btn-okay" },
                        confirmButtonColor: '#44c767',
                        confirmButtonText: 'Okay'
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
});

$("#file-input").change(function (e) {
    $(".modal-bg").css('visibility', 'visible').addClass('active');

    var selectedFile = e.target.files[0];
    var reader = new FileReader();

    img.css({ 'border-radius': '6px', 'width': '100%', 'height': '100%' });
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
                Authorization: 'Client-ID a42863129543066',
            },
            body: formData
        })
            .then(response => response.json())
            .then(result => {

                if (result.status == 200) {
                    $(".modal-bg").removeClass('active').css('visibility', 'hidden');

                    Swal.fire({
                        title: 'Success!',
                        padding: '5px',
                        html: `<a href="${result.data.link}" target="_blank">Click me to view the image</a>`,
                        icon: 'success',
                        background: '#fff',
                        customClass: { confirmButton: "btn btn-okay" },
                        confirmButtonColor: '#44c767',
                        confirmButtonText: 'Okay'
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
});
