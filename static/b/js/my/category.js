var Category = {
    index: function () {
        $(document).ready(function () {
            Category.del();
        });
    },
    add: function () {
        $('#frm').validate({
            rules: {categoryName: {required: true, minlength: 3, maxlength: 255}},
            messages: {
                categoryName: {
                    required: 'Xin vui lòng nhập tên danh mục.',
                    minlength: 'Tên danh mục tối thiểu từ 3 kí tự trở lên.',
                    maxlength: 'Tên danh mục tối đa 255 kí tự'
                }
            }
        });
    },
    edit: function () {
        $(document).ready(function () {
            Category.initEditor();
            Category.initFomularEditor($('#importTax'), 'importTaxEditor', false);
            Category.initFomularEditor($('#shippingTax'), 'shippingTaxEditor', false);
            $('#btnSubmit').click(function () {
                var importTax = $('#importTax').val();
                $('#importTax').val(importTax.replace("<?php \n", ""));
                var shippingTax = $('#shippingTax').val();
                $('#shippingTax').val(shippingTax.replace("<?php \n", ""));
                $('#frm').submit();
            });
        });
    },
    view: function () {
        $(document).ready(function () {
            Category.initFomularEditor('', 'importTaxEditor', true);
            Category.initFomularEditor('', 'shippingTaxEditor', true);
        });
    },
    del: function () {
        $(document).ready(function () {
            $(document).on('click', '.btnRemove', function () {
                var url = $(this).attr('url');
                var cateID = $(this).data('id');
                if (!url || isNaN(cateID)) {
                    return bootbox.alert('Không thể xóa danh mục này, xin vui lòng thử lại.');
                }
                bootbox.confirm('<b>Bạn có muốn xóa danh mục này không ?</b>', function (result) {
                    if (result) {
                        $.ajax({
                            type: "POST",
                            url: url,
                            cache: false,
                            dataType: 'json',
                            data: {cateID: cateID},
                            beforeSend: function () {
                                $('.bootbox .btn-primary').html('<i class="fa fa-refresh fa-spin"></i> Đang tải...').attr('disabled', 'disabled');
                            },
                            success: function (result) {
                                if (result.st == -1) {
                                    return bootbox.alert('' + result.msg + '');
                                }
                                if (result.success) {
                                    window.location = window.location;
                                } else {
                                    bootbox.alert(result.message);
                                }

                            }
                        });
                        return false;
                    }
                });
            });
        });
    }, indexError: function () {
        $(document).ready(function () {
            Category.delError();
        });
    }, delError: function () {
        $(document).ready(function () {
            $(document).on('click', '.btnRemove', function () {
                var url = $(this).attr('url');
                var logID = $(this).data('id');
                if (!url || isNaN(logID)) {
                    return bootbox.alert('Không thể xóa, xin vui lòng thử lại.');
                }
                bootbox.confirm('<b>Bạn có muốn xóa không ?</b>', function (result) {
                    if (result) {
                        $.ajax({
                            type: "POST",
                            url: url,
                            cache: false,
                            dataType: 'json',
                            data: {logID: logID},
                            beforeSend: function () {
                                $('.bootbox .btn-primary').html('<i class="fa fa-refresh fa-spin"></i> Đang tải...').attr('disabled', 'disabled');
                            },
                            success: function (result) {
                                if (result.st == -1) {
                                    return bootbox.alert('' + result.msg + '');
                                }
                                if (result.success) {
                                    window.location = window.location;
                                } else {
                                    bootbox.alert(result.message);
                                }

                            }
                        });
                        return false;
                    }
                });
            });
        });
    },
    initEditor: function () {
        tinymce.init({
            selector: 'textarea.description',
            height: 300,
            forced_root_block: false,
            valid_elements: '*[*]',
            extended_valid_elements: "*[*]",
            entity_encoding: "raw",
            fix_list_elements: true,
            plugins: ["autolink link textcolor"],
            toolbar1: "bold italic underline strikethrough | alignleft aligncenter alignright alignjustify | bullist numlist | link unlink | forecolor backcolor",
            menubar: false,
            statusbar: false,
            toolbar_items_size: 'small',
            fontsize_formats: "8pt 9pt 10pt 11pt 12pt 13pt 14pt 18pt 24pt 36pt"
        });
    },
    initFomularEditor: function (elem, editorID, readOnly) {
        var readOnly = typeof readOnly === 'undefined' ? false : readOnly;
        var editor = ace.edit(editorID);
        var session = editor.getSession();
        if (readOnly === false) {
            var textarea = elem.hide();
            session.setValue("<?php \n" + textarea.val());
            session.on('change', function () {
                textarea.val(editor.getSession().getValue());
            });
        } else {
            session.setValue("<?php \n" + editor.getValue());
            editor.setReadOnly(true);
        }
        editor.setTheme("ace/theme/dawn");
        editor.getSession().setMode("ace/mode/php");
        editor.focus();
        var count = session.getLength();
        editor.gotoLine(count, session.getLine(count - 1).length);
    }
};