/* jshint esversion: 6 */
(($, window, undefined) => {
    if (window.screen.lockOrientation) {
        window.screen.lockOrientation('portrait');
    }
    let $numberbuttons = $('.numberbuttons');
    let $numberdisplay = $('.numberdisplay');
    let $numbersubmit = $('.numbersubmit');
    let $phonenumber = $('.phonenumber');
    let phonenumber = "";
    $('.modal').modal();

    let buildPhoneSegment = (number, expectedLength) => {
        let len = number.length;
        let result = number;
        for (let step = 0; step < expectedLength - len; step++) {
            result += "#";
        }
        return result;
    };

    let displayNumber = (number) => {
        var areaCode = buildPhoneSegment(number.substr(0, 3), 3);
        var prefix = buildPhoneSegment(number.substr(3, 3), 3);
        var lineNumber = buildPhoneSegment(number.substr(6, 4), 4);
        out = "(" + areaCode + ") " + prefix + "-" + lineNumber;
        $phonenumber.html(out);
    };

    let clearNumber = () => {
        phonenumber = "";
        displayNumber(phonenumber);
    };

    let addDigit = (number) => {
        if (phonenumber.length <= 10) {
            phonenumber += number;
            displayNumber(phonenumber);
        }
    };

    let removeDigit = () => {
        if (phonenumber.length > 0) {
            phonenumber = phonenumber.slice(0, -1);
            displayNumber(phonenumber);
        }
    };

    $('html').on('keypress', (event) => {
        event.stopPropagation();
        let value = "";
        switch (event.keyCode) {
            case 48:
                value = "0";
                break;
            case 49:
                value = "1";
                break;
            case 50:
                value = "2";
                break;
            case 51:
                value = "3";
                break;
            case 52:
                value = "4";
                break;
            case 53:
                value = "5";
                break;
            case 54:
                value = "6";
                break;
            case 55:
                value = "7";
                break;
            case 56:
                value = "8";
                break;
            case 57:
                value = "9";
                break;
            case 13:
                submitNumber();
                return;
            default:
                console.log(event.which);
                return;
        }
        addDigit(value);
    });


    $numberbuttons.on('click', '[data-value]', (event) => {
        event.preventDefault();
        let value = $(event.currentTarget).data('value');
        addDigit(value);
        $(event.currentTarget).blur();
    });
    $numberdisplay.on('click', '[data-action=backspace]', (event) => {
        removeDigit();
        $(event.currentTarget).blur();
    });


    $('#registerModal form').on('submit', (event) => {
        event.preventDefault();
        let formData = $(event.currentTarget).serializeArray();
        formData = formData.reduce((map, obj) => {
            map[obj.name] = obj.value;
            return map;
        }, {});

        $.ajax({
            url: "/api/register",
            type: "POST",
            data: formData,
            success: (data, statusText, jqXHR) => {
                $('#registerModal [name=phone]').val("");
                $('#registerModal').modal('close');
                $('#registrationSuccessModal').modal('open');
                clearNumber();
                setTimeout(() => {
                    $('#registrationSuccessModal').modal('close');
                }, 10000);

            },
            error: (jqXHR, statusText, message) => {
                $('#errorModal').modal('open');
            }
        });
    });

    $('#registerModal').on('click', '.modal-submit', (event) => {
        event.preventDefault();
        $('#registerModal form').submit();
    });

    let submitNumber = () => {
        if (phonenumber.length === 10) {
            $.ajax({
                url: "/api/checkin",
                type: "POST",
                data: {
                    "_csrf": $phonenumber.data('token'),
                    "phone": phonenumber
                },
                success: (data, statusText, jqXHR) => {
                    $('#registerModal [name=phone]').val("");
                    $('#checkinSuccessModal .newpoints').text(data.earned);
                    $('#checkinSuccessModal .totalpoints').text(data.total);
                    $('#checkinSuccessModal .totalcheckins').text(data.checkins);
                    $('#checkinSuccessModal').modal('open');
                    setTimeout(() => {
                        $('#checkinSuccessModal').modal('close');
                    }, 10000);
                    clearNumber();
                },
                error: (jqXHR, statusText, message) => {
                    if (jqXHR.status === 401) {
                        //show register modal
                        $('#registerModal [name=phone]').val(phonenumber);
                        $('#registerModal').modal('open');
                    } else if (jqXHR.status == 403) {
                        $('#rapidfireModal').modal('open');
                        clearNumber();
                        setTimeout(() => {
                            $('#rapidfireModal').modal('close');
                        }, 10000);
                    } else {
                        $('#errorModal').modal('open');
                    }
                }
            });
        } else {
            $('#validationerrorModal').modal('open');
            setTimeout(() => {
                $('#validationerrorModal').modal('close');
            }, 10000);
        }
    };

    $numbersubmit.on('click', 'a', (event) => {
        event.preventDefault();
        submitNumber();
    });
})(jQuery, window);