var News = {
    index: function () {
        $(document).ready(function () {

            tinymce.init({
                selector: "textarea#description",
                height: 400,
                forced_root_block: false,
                plugins: [
                    "autolink autosave link image lists charmap print preview hr anchor pagebreak spellchecker",
                    "searchreplace wordcount visualblocks visualchars code fullscreen insertdatetime media nonbreaking",
                    "table contextmenu directionality emoticons template textcolor paste textcolor colorpicker textpattern"
                ],
                toolbar1: "newdocument | bold italic underline strikethrough | alignleft aligncenter alignright alignjustify | styleselect formatselect fontselect fontsizeselect",
                toolbar2: "cut copy paste | searchreplace | bullist numlist | outdent indent blockquote | undo redo | link unlink anchor image media code | insertdatetime preview | forecolor backcolor",
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


            $('body').on('click', '.delete', function () {
                $(this).parents('li').fadeOut('fast', function () {
                    $(this).remove();
                });
            });


            frm = $("#frm");
            frm.validate({
                ignore: '',
                rules: {
                    newsName: {required: true, minlength: 3, maxlength: 255},
                    lv1Cat: {required: true},
                }, messages: {
                    newsName: {
                        required: 'Xin vui lòng nhập tiêu đề tin tức.',
                        minlength: 'tiêu đề tin tức tối thiểu từ 3 kí tự trở lên.',
                        maxlength: 'tiêu đề tin tức tối đa 255 kí tự.'
                    },
                    lv1Cat: 'Xin vui lòng chọn danh mục bài viết.',
                }
            });
            News.add();
        });
    },
    add: function () {
        $(document).ready(function () {


            if (catalogType > 0) {
                $.ajax({
                    type: "POST",
                    url: baseurl + '/backend/catalog/get-catalog',
                    cache: false,
                    dataType: 'json',
                    data: {
                        catalogID: 0,
                        catalogType: catalogType
                    },
                    success: function (result) {
                        if (result.st == -1) {
                            return bootbox.alert('' + result.msg + '');
                        }
                        if (result) {
                            $('#lv1Catalog').html(" ");
                            $('#lv2Catalog').html(" ");
                            $('#lv3Catalog').html(" ");
                            $.each(result, function (k, v) {
                                var selected = v.catalog_id == lv1Cat ? 'selected="selected"' : '';

                                $('#lv1Catalog').append('<option ' + selected + ' value="' + v.catalog_id + '">' + v.catalog_name + '</option>')
                                if (selected) {
                                    $('#lv1Catalog').trigger('change');
                                }
                            });
                        } else {
                            bootbox.alert('Không thể lấy dữ của danh mục');
                        }
                    }
                });
            }
            $("#catalogType").change(function () {
                var catalogType = $(this).val();

                $.ajax({
                    type: "POST",
                    url: baseurl + '/backend/catalog/get-catalog',
                    cache: false,
                    dataType: 'json',
                    data: {
                        catalogID: 0,
                        catalogType: catalogType
                    },
                    success: function (result) {
                        if (result.st == -1) {
                            return bootbox.alert('' + result.msg + '');
                        }
                        if (result) {
                            $('#lv1Catalog').html(" ");
                            $('#lv2Catalog').html(" ");
                            $('#lv3Catalog').html(" ");
                            $.each(result, function (k, v) {
                                var selected = v.catalog_id == lv1Cat ? 'selected="selected"' : '';

                                $('#lv1Catalog').append('<option ' + selected + ' value="' + v.catalog_id + '">' + v.catalog_name + '</option>')
                                if (selected) {
                                    $('#lv1Catalog').trigger('change');
                                }
                            });
                        } else {
                            bootbox.alert('Không thể lấy dữ của danh mục');
                        }
                    }
                });
            })


            $('#lv1Catalog').change(function () {
                var catalogID = $(this).val();
                if (catalogID > 0) {
                    $.ajax({
                        type: "POST",
                        url: baseurl + '/backend/catalog/get-catalog',
                        beforeSend: function () {
                            $('#lv2Catalog, #lv3Catalog').attr('disabled', true);
                            $('#lv2Catalog, #lv3Catalog').html('<option value="">Đang tải dữ liệu...</option>');
                        },
                        cache: false,
                        dataType: 'json',
                        data: {'catalogID': catalogID, 'type': 'news'},
                        success: function (result) {
                            if (result.st == -1) {
                                return bootbox.alert('' + result.msg + '');
                            }

                            $('#lv2Catalog').html(" ");
                            $('#lv3Catalog').html(" ");
                            if (!$.isEmptyObject(result)) {
                                $('#lv2Catalog').removeAttr('disabled');
                                $('#lv2Catalog').html('<option value="">Vui lòng chọn danh mục con</option>');
                                $.each(result, function (k, v) {
                                    var selected = v.catalog_id == lv2Cat ? 'selected="selected"' : '';
                                    $('#lv2Catalog').append('<option ' + selected + ' value="' + v.catalog_id + '">' + v.catalog_name + '</option>')
                                    if (selected) {
                                        $('#lv2Catalog').trigger('change');
                                    }
                                    $('#lv3Catalog').html('<option>Vui lòng chọn danh mục con</option>');
                                });
                            } else {
                                $('#lv2Catalog, #lv3Catalog').html('<option>Hiện tai chưa có danh mục con</option>');
                            }
                        }
                    });
                }
            });
            $('#lv2Catalog').change(function () {
                var catalogID = $(this).val();
                if (catalogID > 0) {
                    $.ajax({
                        type: "POST",
                        url: baseurl + '/backend/catalog/get-catalog',
                        beforeSend: function () {
                            $('#lv3Catalog').attr('disabled', true);
                            $('#lv3Catalog').html('<option value="">Đang tải dữ liệu...</option>');
                        },
                        cache: false,
                        dataType: 'json',
                        data: {'catalogID': catalogID, 'type': 'news'},
                        success: function (result) {
                            if (result.st == -1) {
                                return bootbox.alert('' + result.msg + '');
                            }
                            $('#lv3Catalog').html(" ");
                            if (!$.isEmptyObject(result)) {
                                $('#lv3Catalog').removeAttr('disabled');
                                $('#lv3Catalog').html('<option value="">Vui lòng chọn danh mục con</option>');
                                $.each(result, function (k, v) {
                                    var selected = v.catalog_id == lv3Cat ? 'selected="selected"' : '';
                                    $('#lv3Catalog').append('<option ' + selected + ' value="' + v.catalog_id + '">' + v.catalog_name + '</option>')
                                });
                            } else {
                                $('#lv3Catalog').html('<option>Hiện tai chưa có danh mục con</option>');
                            }
                        }
                    });
                }
            });
            $('.btn-complete-submit').click(function () {
                if (frm.valid()) {
//                    CKEDITOR.instances.description.updateElement();
                    description = $('#description').val();
                    description = $.trim(description.replace(/(<([^>]+)>)/ig, ""));
                    if (description === '') {
                        bootbox.alert('Chi tiết tin tức không được để trống');
                        return false;
                    }
                }
            });

            $("#newsImage").Nileupload({
                action: baseurl + '/backend/news/upload',
                size: '2MB',
                extension: 'jpg,jpeg,png',
                progress: $("#progress"),
                preview: $(".newsImagesList"),
                multi: true
            });

        });
    },
    edit: function () {
        $(document).ready(function () {
            $.ajax({
                type: "POST",
                url: baseurl + '/backend/catalog/get-catalog',
                cache: false,
                dataType: 'json',
                data: {
                    catalogID: 0,
                    catalogType: catalogType
                },
                success: function (result) {
                    if (result.st == -1) {
                        return bootbox.alert('' + result.msg + '');
                    }
                    if (result) {
                        $('#lv1Catalog').html(" ");
                        $.each(result, function (k, v) {
                            var selected = v.catalog_id == lv1Cat ? 'selected="selected"' : '';

                            $('#lv1Catalog').append('<option ' + selected + ' value="' + v.catalog_id + '">' + v.catalog_name + '</option>')
                            if (selected) {
                                $('#lv1Catalog').trigger('change');
                            }
                        });
                    } else {
                        bootbox.alert('Không thể lấy dữ của danh mục');
                    }
                }
            });
        });
    },
    del: function () {
        $('.remove').click(function () {
            newsID = $(this).parent().attr('rel');
            if (newsID) {
                bootbox.confirm('Bạn có muốn xóa tin tức này không', function (result) {
                    if (result) {
                        $.ajax({
                            type: "POST",
                            url: baseurl + '/backend/news/delete',
                            cache: false,
                            dataType: 'json',
                            data: {
                                'newsID': newsID
                            },
                            success: function (result) {
                                if (result.st == -1) {
                                    return bootbox.alert('' + result.msg + '');
                                }
                                if (result) {
                                    window.location = window.location;
                                } else {
                                    bootbox.alert('Không thể xóa tin tức này');
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
            $('#btnToggleFilterNews').click(function () {
                $('div#frmFilterUser').slideToggle();
            });

            if (catalogType > 0) {
                $.ajax({
                    type: "POST",
                    url: baseurl + '/backend/catalog/get-catalog',
                    cache: false,
                    dataType: 'json',
                    data: {
                        catalogID: 0,
                        catalogType: catalogType
                    },
                    success: function (result) {
                        if (result.st == -1) {
                            return bootbox.alert('' + result.msg + '');
                        }
                        $('#lv1Catalog').html('<option value="0"> == Tất cả == </option>');
                        $('#lv2Catalog').html('<option value="0"> == Tất cả == </option>');

                        if (!$.isEmptyObject(result)) {
                            $.each(result, function (k, v) {
                                var selected = v.catalog_id == lv1Cat ? 'selected="selected"' : '';
                                $('#lv1Catalog').append('<option ' + selected + ' value="' + v.catalog_id + '">' + v.catalog_name + '</option>')
                                if (selected) {
                                    $('#lv1Catalog').trigger('change');
                                }
                            });
                        }
                    }
                });
            }

            $("#catalogType").change(function () {
                catalogType = $(this).val();

                if (catalogType > 0) {
                    $.ajax({
                        type: "POST",
                        url: baseurl + '/backend/catalog/get-catalog',
                        cache: false,
                        dataType: 'json',
                        data: {
                            catalogID: 0,
                            catalogType: catalogType
                        },
                        success: function (result) {
                            if (result.st == -1) {
                                return bootbox.alert('' + result.msg + '');
                            }
                            $('#lv1Catalog').html('<option value="0"> == Tất cả == </option>');
                            $('#lv2Catalog').html('<option value="0"> == Tất cả == </option>');

                            if (!$.isEmptyObject(result)) {
                                $.each(result, function (k, v) {
                                    var selected = v.catalog_id == lv1Cat ? 'selected="selected"' : '';
                                    $('#lv1Catalog').append('<option ' + selected + ' value="' + v.catalog_id + '">' + v.catalog_name + '</option>')
                                    if (selected) {
                                        $('#lv1Catalog').trigger('change');
                                    }
                                });
                            }
                        }
                    });
                } else {
                    $('#lv1Catalog').html('<option value="0"> == Tất cả == </option>')
                    $('#lv2Catalog').html('<option value="0"> == Tất cả == </option>')
                }

            })


            $('#lv1Catalog').change(function () {
                var catalogID = $(this).val();
                if (catalogID > 0) {
                    $.ajax({
                        type: "POST",
                        url: baseurl + '/backend/catalog/get-catalog',
                        beforeSend: function () {
                            //$('#lv2Catalog').attr('disabled', true);
                            $('#lv2Catalog').html('<option value="">Đang tải dữ liệu...</option>');
                        },
                        cache: false,
                        dataType: 'json',
                        data: {
                            catalogID: catalogID
                        },
                        success: function (result) {
                            if (result.st == -1) {
                                return bootbox.alert('' + result.msg + '');
                            }
                            $('#lv2Catalog').html('<option value="0"> == Tất cả == </option>');

                            if (!$.isEmptyObject(result)) {
                                $.each(result, function (k, v) {
                                    var selected = v.catalog_id == lv2Cat ? 'selected="selected"' : '';
                                    $('#lv2Catalog').append('<option ' + selected + ' value="' + v.catalog_id + '">' + v.catalog_name + '</option>')
                                    if (selected) {
                                        $('#lv2Catalog').trigger('change');
                                    }
                                });
                            }
                        }
                    });
                } else {
                    $('#lv2Catalog').html('<option value="0"> == Tất cả == </option>')
                }
            });
        });
    },
};
