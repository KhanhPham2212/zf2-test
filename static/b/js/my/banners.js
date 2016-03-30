var Banners = {
    index: function () {
        $(document).ready(function () {

            $('body').on('click', '.delete', function () {
                $(this).parents('li').fadeOut('fast', function () {
                    $(this).remove();
                });
            });


            frm = $("#frm");
            frm.validate({
                ignore: '',
                rules: {
                }, messages: {
                }
            });
            Banners.add();
        });
    },
    add: function () {
        $(document).ready(function () {

            $("#bannersImage").Nileupload({
                action: baseurl + '/backend/banners/upload',
                size: '150KB',
                extension: 'jpg,jpeg,png',
                progress: $("#progress"),
                preview: $(".bannersImagesList"),
                multi: false
            });

        });
    },
    edit: function () {
        $(document).ready(function () {

        });
    },
    del: function () {
        $('.remove').click(function () {
            bannerID = $(this).parent().attr('rel');
            if (bannerID) {
                bootbox.confirm('Bạn có muốn xóa banner này không', function (result) {
                    if (result) {
                        $.ajax({
                            type: "POST",
                            url: baseurl + '/backend/banners/delete',
                            cache: false,
                            dataType: 'json',
                            data: {
                                'bannerID': bannerID
                            },
                            success: function (result) {
                                if (result.st == -1) {
                                    return bootbox.alert('' + result.msg + '');
                                }

                                if (result) {
                                    window.location = window.location;
                                } else {
                                    bootbox.alert('Không thể xóa banner này');
                                }
                            }
                        });
                    }
                });
            }
        });
    },
    filter: function () {
        $(document).ready(function () {
            //filter
            $('#btnToggleFilterBanners').click(function () {
                $('div#frmFilterBanners').slideToggle();
            });
        });
    },
};
