var Comment = {
    index: function () {
        $(document).ready(function () {

        });
    },
    edit: function () {
        $(document).ready(function () {
            initEditor('textarea#content');
            $('.btnEditComment').click(function () {
                var html = '',
                        $this = $(this),
                        commentID = $this.parents('.text').attr('comment-id'),
                        content = $.trim($this.parent('p').next('div').html()),
                        currentStatus = parseInt($(this).attr('current-status')),
                        arrInfo = $.trim($this.parent('p').children('a').text()).split(' | ');

                if (!content || !commentID) {
                    return false;
                }

                if ($this.parents('div#parentComment').length > 0) {
                    var typeSeleted = parseInt(currentType) === 1 ? '<option value="1" selected="seleted">Góp ý</option><option value="2">Hỏi đáp</option>' : '<option value="1">Góp ý</option><option value="2" selected="seleted">Hỏi đáp</option>';
                    html += '<label><b>Phân loại hiện tại: </b></label><select id="frmEditType" class="form-control">' + typeSeleted + '</select><br />';
                }

                var statusSelected = currentStatus === 0 ? '<option value="0" selected="seleted">Chờ kiểm duyệt</option><option value="1">Đã kiểm duyệt</option>' : '<option value="0">Chờ kiểm duyệt</option><option value="1" selected="seleted">Đã kiểm duyệt</option>';

                html += '<label><b>Họ và Tên: </b></label><input type="text" class="form-control" id="frmEditFullname" value="' + arrInfo[0] + '" /><br />'
                        + '<label><b>Email: </b></label><input type="text" class="form-control" id="frmEditemail" value="' + arrInfo[1] + '" /><br />'
                        + '<label><b>Trạng thái hiện tại: </b></label><select id="frmEditStatus" class="form-control">' + statusSelected + '</select><br />'
                        + '<textarea id="frmEditComment">' + content + '</textarea>';
                bootbox.confirm(html, function (result) {
                    if (result) {
                        var fullname = $.trim($('#frmEditFullname').val()),
                                email = $.trim($('#frmEditemail').val()),
                                type = $.trim($('#frmEditType').val()),
                                status = $.trim($('#frmEditStatus').val()),
                                catalogID = parseInt($('#parentComment').attr('catalog-id')),
                                content = tinymce.activeEditor.getContent();

                        if (content && fullname && email) {
                            $.ajax({
                                url: baseurl + '/backend/comment/edit',
                                type: "POST",
                                dataType: "JSON",
                                async: true,
                                cache: false,
                                data: {commentID: commentID, fullname: fullname, email: email, type: type, status: status, catalogID: catalogID, content: content},
                                beforeSend: function () {
                                    $('.modal .btn-primary').html('<i class="fa fa-refresh fa-spin"></i> Đang xử lý...').attr('disabled', 'disabled');
                                },
                                success: function (data) {
                                    if (data.st == -1) {
                                        bootbox.alert('' + data.msg + '');
                                    } else {
                                        window.location = window.location.href;
                                    }
                                }
                            });
                        }
                        return false;
                    }
                    tinymce.remove('textarea#frmEditComment');
                });
                initEditor('textarea#frmEditComment');
            });

            $('.btnDelComment').click(function () {
                var html = '',
                        $this = $(this),
                        commentID = $this.parents('.text').attr('comment-id');
                if (!commentID) {
                    return false;
                }
                bootbox.confirm('<b>Bạn có muốn xóa bình luận này không ?</b>', function (result) {
                    if (result) {
                        $.ajax({
                            url: baseurl + '/backend/comment/delete',
                            type: "POST",
                            dataType: "JSON",
                            async: true,
                            cache: false,
                            data: {commentID: commentID},
                            beforeSend: function () {
                                $('.modal .btn-primary').html('<i class="fa fa-refresh fa-spin"></i> Đang xử lý...').attr('disabled', 'disabled');
                            },
                            success: function (data) {
                                if (data.st == -1) {
                                    bootbox.alert('' + data.msg + '');
                                } else {
                                    window.location = window.location.href;
                                }
                            }
                        });
                        return false;
                    }
                });
            });
        });
    },
    del: function () {
        $(document).ready(function () {
            $('.remove').click(function () {
                var commentID = $(this).parent('a').attr('rel');
                if (commentID) {
                    bootbox.confirm('<b>Bạn có muốn xóa bình luận này không ?</b>', function (result) {
                        if (result) {
                            $.ajax({
                                url: baseurl + '/backend/comment/delete',
                                type: "POST",
                                dataType: "JSON",
                                async: true,
                                cache: false,
                                data: {commentID: commentID},
                                beforeSend: function () {
                                    $('.modal .btn-primary').html('<i class="fa fa-refresh fa-spin"></i> Đang xử lý...').attr('disabled', 'disabled');
                                },
                                success: function (data) {
                                    if (data.st == -1) {
                                        return bootbox.alert('' + data.msg + '');
                                    }
                                    if (data.success == 1) {
                                        window.location = window.location.href;
                                    }
                                }
                            });
                            return false;
                        }
                    });
                }
            });
        });
    }
};

function initEditor(elem) {
    tinymce.init({
        selector: elem,
        height: 300,
        forced_root_block: false,
        valid_elements: '*[*]',
        extended_valid_elements: "*[*]",
        entity_encoding: "raw",
        fix_list_elements: true,
        fullpage_default_doctype: "<!DOCTYPE html>",
        fullpage_default_encoding: "UTF-8",
        plugins: [
            "autolink link image lists charmap print preview hr anchor pagebreak spellchecker",
            "searchreplace wordcount visualblocks visualchars code fullscreen insertdatetime media nonbreaking",
            "table contextmenu directionality emoticons template textcolor paste textcolor colorpicker textpattern"
        ],
        toolbar1: "newdocument | bold italic underline strikethrough | alignleft aligncenter alignright alignjustify | styleselect formatselect fontselect fontsizeselect",
        toolbar2: "cut copy paste | searchreplace | bullist numlist | outdent indent blockquote | undo redo | link unlink anchor | insertdatetime preview | forecolor backcolor",
        toolbar3: "table | hr removeformat | subscript superscript | charmap emoticons | print fullscreen | ltr rtl | spellchecker | visualchars visualblocks nonbreaking template pagebreak restoredraft code",
        menubar: false,
        toolbar_items_size: 'small',
        fontsize_formats: "8pt 9pt 10pt 11pt 12pt 13pt 14pt 18pt 24pt 36pt",
        style_formats: [
            {title: 'Bold text', inline: 'b'},
            {title: 'Red text', inline: 'span', styles: {color: '#ff0000'}},
            {title: 'Red header', block: 'h1', styles: {color: '#ff0000'}},
            {title: 'Table styles'},
            {title: 'Table row 1', selector: 'tr', classes: 'tablerow1'}
        ]
    });
}