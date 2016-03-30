var Video = {
    index: function () {
        $(document).ready(function () {
            Video.del();
        });
    },
    add: function () {
        $(document).ready(function () {


            frm = $("#frm");
            frm.validate({
                ignore: '',
                rules: {
                    videoName: {required: true},
                    videoLink: {required: true},
                }, messages: {
                    videoName: {
                        required: 'Xin vui lòng nhập tiêu đề video.',
                    },
                    videoLink: {
                        required: 'Xin vui lòng nhập link video.',
                    },
                }
            });
        });
    },
    edit: function () {
        $(document).ready(function () {

        });
    },
    del: function () {
        $('.remove').click(function () {
            videoID = $(this).parent().attr('rel');
            if (videoID) {
                bootbox.confirm('Bạn có muốn xóa video này không', function (result) {
                    if (result) {
                        $.ajax({
                            type: "POST",
                            url: baseurl + '/backend/video/delete',
                            cache: false,
                            dataType: 'json',
                            data: {
                                videoID: videoID
                            },
                            success: function (result) {
                                if (result.st == -1) {
                                    return bootbox.alert('' + result.msg + '');
                                }
                                if (result) {
                                    window.location = window.location;
                                } else {
                                    bootbox.alert('Không thể xóa video này');
                                }
                            }
                        });
                    }
                });
            }
        });
    },
};
