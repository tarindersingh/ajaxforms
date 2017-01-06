$(document).ready(function () {
    $(document).on("submit", ".ajax-Form", function (e) {
        e.preventDefault();
        var F = $(this);
        var options = {};
        options.url = F.attr("action");
        options.type = F.attr("method") ? F.attr("method") : "post";
        var enc = F.attr("enctype");
        var formdata = new FormData();

        //var filenames = [];
        if (enc == "multipart/formdata" || enc == "multipart/form-data") {
            options.contentType = false;
            options.processData = false;
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
        options.data = formdata;
        options.dataType = 'jsonp';
        options.beforeSend = function () {
            clear_errors(F);
            $("body").addClass("ajax-loading");
        };
        options.success = function (data) {
            if (typeof data == "object") {
                var R = data;
            } else {
                var R = JSON.parse(data);
            }

            if (R.callbackfn) {
                ACFn[R.callbackfn](F, R);
            } else if (R.success) {

            } else {
                display_errors(F, R);
            }
        };
        options.error = function () {
            alert("Server Error! Try again later");
        };
        options.complete = function () {
            $("body").removeClass("ajax-loading");
        };
        $.ajax(options);
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
    var options = {};
    options.url = F.data("href") ? F.data("href") : (F.attr("href") ? F.attr("href") : "");
    options.method = F.data("method") ? F.data("method") : "GET";
    var data_arr = F.data();
    options.data = {};
    $.each(data_arr, function (index, element) {
        if (index.startsWith("form")) {
            var key = index.substr(4);
            options.data[key] = element;
        }
    });
    options.beforeSend = function () {
        $("body").addClass("ajax-loading");
    };
    options.success = function (data) {
        var R = JSON.parse(data);
        if (R.callbackfn) {
            ACFn[R.callbackfn](F, R);
        } else if (R.success) {

        } else {
            display_errors(F, R);
        }
    };
    options.error = function () {
        alert("Server Error! Try again later");
    };
    options.complete = function () {
        $("body").removeClass("ajax-loading");
    };
    $.ajax(options);
}

function AjaxCallbackFunctions() {
    // other properties and functions...

    this.general_form = function (F, R) {
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
        if (R.success) {
            if (R.form_reset == false) {

            } else if (F.hasClass("ajax-Form")) {
                F[0].reset();
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

var ACFn = new AjaxCallbackFunctions();

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