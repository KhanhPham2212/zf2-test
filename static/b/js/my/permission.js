var Permission = {
    index: function () {
        $(document).ready(function () {

        });
    },
    grant: function () {
        $(document).ready(function () {
            $('.actionName').on('click', function () {
                var $this = $(this),
                        isChecked = $this.is(':checked'),
                        resource = $this.val(),
                        loading = $(this).parents('.panel-body').prev('header').children('span.pull-right');
                if (resource && isChecked === true) {
                    $.ajax({
                        type: "POST",
                        url: baseurl + '/backend/permission/add/' + currentPart + '/' + userRole,
                        cache: false,
                        dataType: 'json',
                        beforeSend: function () {
                            loading.show();
                        },
                        data: {'resource': resource},
                        success: function (result) {
                            if (result.st == -1) {
                                return bootbox.alert('' + result.msg + '');
                            }
                            setTimeout(function () {
                                loading.hide();
                            }, '500');
                            if (result.error == 1) {
                                bootbox.alert(data.message);
                            }
                        }
                    });
                }
                if (resource && isChecked === false) {
                    $.ajax({
                        type: "POST",
                        url: baseurl + '/backend/permission/delete/' + currentPart + '/' + userRole,
                        cache: false,
                        dataType: 'json',
                        beforeSend: function () {
                            loading.show();
                        },
                        data: {'resource': resource},
                        success: function (result) {
                            if (result.st == -1) {
                                return bootbox.alert('' + result.msg + '');
                            }
                            setTimeout(function () {
                                loading.hide();
                            }, '500');
                            if (result.error == 1) {
                                bootbox.alert(data.message);
                            }
                        }
                    });
                }
            });
        });
    }
};