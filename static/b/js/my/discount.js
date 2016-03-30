var Discount = {
    index: function () {
        $(document).ready(function () {

            $('#discountType').change(function () {
                $('#percentOrValueDiscount').attr('disabled', 'disabled');
                if ($(this).val()) {
                    $('#percentOrValueDiscount').removeAttr('disabled');
                }
            });
        });
    },
    add: function () {
        $(document).ready(function () {
            frm = $("#frm");
            frm.validate({
                ignore: '',
                rules: {
                    codeQuantity: {required: true, minlength: 1, maxlength: 5},
                    discountType: {required: true},
                    percentOrValueDiscount: {required: true}
                }, messages: {
                    codeQuantity: {
                        required: 'Vui lòng nhập số lượng mã khuyến mãi.',
                        minlength: 'Số lượng mã khuyến mãi không chính xác.',
                        maxlength: 'Số lượng mã khuyến mãi tối đa được phép tạo trong một phiên là 5 chữ số.'
                    },
                    discountType: 'Xin vui lòng chọn loại mã khuyến mãi.',
                    percentOrValueDiscount: 'Vui lòng nhập giá trị mã khuyến mãi'
                }
            });
            $('#done').click(function () {
                $('#addCodeProgress').show();
                frm.submit();
            });
        });
    },
    edit: function () {
        $(document).ready(function () {

        });
    },
    sendCode: function () {
        $(document).ready(function () {

            $("input[name='csvFile']").change(function () {
                $(this).parent().prev('input').val($(this).val());
            });

            $("#email").tagsInput();
            $('#email, #csvFile').parents('div.form-group').hide();
            initEditor('textarea#body');
            $('#sendType').change(function () {
                $('#email, input[name="csvFile"]').attr('disabled', 'disabled');
                $('#email, #csvFile').parents('div.form-group').hide();
                var type = $(this).val();
                switch (type) {
                    case '':
                        $('#email, input[name="csvFile"]').attr('disabled', 'disabled');
                        $('#email, #csvFile').parents('div.form-group').hide();
                        break;
                    case '1':
                        $('input[name="csvFile"]').attr('disabled', 'disabled');
                        $('#email').removeAttr('disabled').parents('div.form-group').show();
                        break;
                    case '2':
                        $('input[name="csvFile"]').removeAttr('disabled');
                        $('#email').attr('disabled', 'disabled');
                        $('#csvFile').parents('div.form-group').show();
                        break;
                    case '3':
                        $('#email, input[name="csvFile"]').attr('disabled', 'disabled');
                        $('#email, #csvFile').parents('div.form-group').hide();
                        break;
                }
            });

            frm = $("#frm");
            frm.validate({
                ignore: '',
                rules: {
                    sendType: {required: true},
                    discountType: {required: true},
                    percentOrValueDiscount: {required: true},
                    mailTitle: {required: true},
                    discountReason: {required: true}
                }, messages: {
                    sendType: 'Xin vui lòng chọn hình thức gửi mã khuyến mãi.',
                    discountType: 'Xin vui lòng chọn loại mã khuyến mãi.',
                    percentOrValueDiscount: 'Vui lòng nhập giá trị mã khuyến mãi',
                    mailTitle: 'Vui lòng nhập tiêu đề email',
                    discountReason: 'Vui lòng nhập lý do gửi mã khuyến mãi'
                }
            });
            $('#done').click(function () {
                $('#sendCodeError').hide();
                $('#sendCodeProgress').show();
                $('#frm').submit();
            });
        });
    },
    user: function () {
        $(document).ready(function () {
            //filter
            $('#btnToggleFilterUser').click(function () {
                $('div#frmFilterUser').slideToggle();
            });
        });
    }
};
function resetEmailList() {
    $(".tagsinput").importTags('');
}
function initEditor(elem) {
    tinymce.init({
        selector: elem,
        height: 400,
        forced_root_block: false,
        valid_elements: '*[*]',
        fix_list_elements: true,
        fullpage_default_doctype: "<!DOCTYPE html>",
        fullpage_default_encoding: "UTF-8",
        plugins: [
            "autolink autosave link image lists charmap print preview hr anchor pagebreak spellchecker",
            "searchreplace wordcount visualblocks visualchars code fullscreen insertdatetime media nonbreaking",
            "table contextmenu directionality emoticons template textcolor paste textcolor colorpicker textpattern fullpage"
        ],
        toolbar1: "newdocument | bold italic underline strikethrough | alignleft aligncenter alignright alignjustify | styleselect formatselect fontselect fontsizeselect",
        toolbar2: "cut copy paste | searchreplace | bullist numlist | outdent indent blockquote | undo redo | link unlink anchor image media | insertdatetime preview | forecolor backcolor",
        toolbar3: "table | hr removeformat | subscript superscript | charmap emoticons | print fullscreen | ltr rtl | spellchecker | visualchars visualblocks nonbreaking template pagebreak restoredraft code",
        menubar: false,
        //toolbar_items_size: 'small',
        fontsize_formats: "8pt 9pt 10pt 11pt 12pt 13pt 14pt 18pt 24pt 36pt",
        style_formats: [
            {title: 'Bold text', inline: 'b'},
            {title: 'Red text', inline: 'span', styles: {color: '#ff0000'}},
            {title: 'Red header', block: 'h1', styles: {color: '#ff0000'}},
            {title: 'Table styles'},
            {title: 'Table row 1', selector: 'tr', classes: 'tablerow1'}
        ],
        file_browser_callback: function (field_name, url, type, win) {
            if (type == 'image') {
                $('div#news_image_upload').html('<input type="file" name="newsImage" id="editorImages" class="imageUpload ignore" />');
                $("#editorImages").Nileupload({
                    action: baseurl + '/backend/news/upload',
                    size: '2MB',
                    extension: 'jpg,jpeg,png',
                    progress: $("#editorProgress"),
                    preview: $(".editorImageList"),
                    multi: false,
                    callback: function (returnData) {
                        $('.mce-btn.mce-open').parent().find('.mce-textbox').val(returnData.sourceImage);
                    }
                });
                $('#editorImages').click();
            }
        }
    });
}