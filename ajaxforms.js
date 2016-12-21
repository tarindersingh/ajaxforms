$(document).ready(function () {
    $(document).on("submit", ".ajax-Form", function (e) {
        e.preventDefault();
        var F = $(this);
        var url = F.attr("action");
        var type = F.attr("method") ? F.attr("method") : "post";
        var enc = F.attr("enctype");
        var contentType = "application/x-www-form-urlencoded; charset=UTF-8";
        var processData = true;
        var formdata = new FormData();
        //var filenames = [];
        if (enc == "multipart/formdata" || enc == "multipart/form-data") {
            contentType = false;
            processData = false;
            var file_input = F.find('input[type="file"]');
            $.each(file_input, function (index, element) {
                var files = $(element)[0].files;
                var fname = $(element).attr("name");
                for (var i = 0; i < files.length; i++) {
                    formdata.append(fname, files[i]);
                }
                //filenames.push(fname);
            });
            var other_data = F.serializeArray();
            $.each(other_data, function (key, input) {
                formdata.append(input.name, input.value);
            });
        } else {
            formdata = F.serializeArray();
        }

        $.ajax({
            url: url,
            data: formdata,
            contentType: contentType,
            processData: processData,
            type: type,
            beforeSend: function () {
                clear_errors(F);
                $("body").addClass("ajax-loading");
            },
            success: function (data) {
                var R = JSON.parse(data);
                if (R.completefn) {
                    ACFn[R.completefn](F, R);
                } else if (R.success) {

                } else {
                    display_errors(F, R);
                }
            },
            error: function () {
                alert("Server Error! Try again later");
            },
            complete: function () {
                $("body").removeClass("ajax-loading");
            }
        });
    });

    $("body").on("click", ".ajax-Link", function (e) {
        e.preventDefault();
        var F = $(this);

        var confirmx = F.data("confirm") ? F.data("confirm") : "true";
        //console.log(confirm);
        if (confirmx == "true") {
            var title = F.data("title") ? F.data("title") : "Are you sure?";
            var text = F.data("text") ? F.data("text") : "You might not be able to revert this!";
            var butttontext = F.data("butttontext") ? F.data("butttontext") : "Yes";
            if (typeof swal === 'function') {
                swal({
                    title: title,
                    text: text,
                    type: 'warning',
                    showCancelButton: true,
                    confirmButtonColor: '#3085d6',
                    cancelButtonColor: '#d33',
                    confirmButtonText: butttontext
                }, function () {
                    sendAjaxButton(F);
                });
            } else if (confirm(title + '\n' + text)) {
                sendAjaxButton(F);
            }
        } else {
            sendAjaxButton(F);
        }
    });
});

function sendAjaxButton(F) {
    var url = F.data("href") ? F.data("href") : (F.attr("href") ? F.attr("href") : "");
    var method = F.data("method") ? F.data("method") : "GET";
    var token = F.data("token");
    $.ajax({
        url: url,
        method: method,
        data: {
            '_token': token
        },
        beforeSend: function () {
            $("body").addClass("ajax-loading");
        },
        success: function (data) {
            var R = JSON.parse(data);
            if (R.completefn) {
                ACFn[R.completefn](F, R);
            } else if (R.success) {

            } else {
                display_errors(F, R);
            }
        },
        error: function () {
            alert("Server Error! Try again later");
        },
        complete: function () {
            $("body").removeClass("ajax-loading");
        }
    });
}

function AjaxCompleteFunctions() {
    // other properties and functions...

    this.general_form = function (F, R) {
        if (R.success) {
            if (R.form_reset == false) {

            } else if (F.hasClass("ajax-Form")) {
                F[0].reset();
            }
            if (R.message) {
                if (typeof (swal) === 'function') {
                    swal(
                            R.messageTitle,
                            R.messageDescription,
                            R.messageType
                            )
                } else {
                    alert(R.messageTitle + '\n' + R.messageDescription);
                }
            }
            if (R.page_reload) {
                location.reload();
            }
            if (R.redirect) {
                location = R.redirectURL;
            }
        } else {
            display_errors(F, R);
        }
    };
}

var ACFn = new AjaxCompleteFunctions();

function display_errors(F, R) {
    if (R.form_errors) {
        $.each(R.form_errors, function (index, element) {
            var field = $("[name='" + index + "']");
            var field_top = field.parents(".form-group");
            var err_field = field_top.find(".error-block");
            if (err_field.length == 0) {
                field_top.append("<span class='error-block help-block'></span>");
                err_field = field_top.find(".error-block");
            }
            err_field.html(element);
            field_top.addClass("has-error");
        });
    }
    if (R.form_error) {
        var err_field = F.find(".form-error-block");
        if (err_field.length == 0) {
            F.prepend("<span class='form-error-block help-block'></span>");
            err_field = F.find(".error-block");
        }
        err_field.html(R.form_error);
        F.addClass("form-has-error");
    }
}

function clear_errors(F) {
    F.find(".error-block").html("");
    F.find(".form-error-block").html("");
    F.find(".form-group").removeClass("has-error");
    F.removeClass("form-has-error");
}