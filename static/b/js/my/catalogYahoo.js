var CatalogYahoo = {
    index: function () {
        $(document).ready(function () {
            catalogType = 1;

            no_item = '<tr>' +
                    '<td colspan="6" style="text-align: center;">Hiện tại chưa có danh mục nào</td>' +
                    '</tr>';

            /*++++++ JSTREE +++++++*/
            $('div#catalog-tree').jstree({
                // List of active plugins
                "plugins": [
                    "themes", "ui", "json_data"
                ],
                "themes": {
                    "theme": "default",
                    "dots": true,
                    "icons": false
                },
                "core": {"animation": 300},
                "json_data": {
                    "ajax": {
                        // the URL to fetch the data
                        "url": baseurl + '/backend/catalog-yahoo/get-child',
                        "type": "post",
                        "data": function (n) {
                            // the result is fed to the AJAX request `data` option
                            return {
                                catalogType: catalogType
                            };
                        }
                    }
                }
            }).bind("select_node.jstree", function (event, data) {
                var selectedObj = data.rslt.obj;
                var parent_id = parseInt(selectedObj.attr('value'));

                var li = selectedObj.find('ul > li');
                if (li.length > 0) {
                    $('#catalog-container').html('');

                    li.each(function (i) {
                        var item = fillData($(this));
                        $('#catalog-container').append(item);
                    });
                } else {
                    $('#catalog-container').html(no_item);
                }

            }).bind("loaded.jstree", function () {
                $('a#root-cat').trigger('click');
            });


            /*++++++ Catalog Filter +++++++*/
            $('select#catalogType').change(function () {
                catalogType = $(this).val();
                $('div#catalog-tree').jstree("refresh");
                $('#catalog-container').html(no_item);
            });


            /*++++++ Main Catalog Select +++++++*/
            $('a#root-cat').click(function () {
                if ($('li.main-catalog').length > 0) {
                    $('#catalog-container').html('');
                    $('li.main-catalog').each(function (i) {
                        var item = fillData($(this));
                        $('#catalog-container').append(item);
                    });
                } else {
                    $('#catalog-container').html(no_item);
                }
            });

            /*++++++ Edit Catalog Click +++++++*/
            $(document).on('click', '.edit', function () {
                catalogID = $(this).parent().attr('rel');
                if (catalogID) {
                    editURL = baseurl + '/backend/catalog-yahoo/edit/id/' + catalogID;

                    window.location.href = editURL;
                }
            });
            CatalogYahoo.del();

        });
    },
    add: function () {
        $(document).ready(function () {
            CatalogYahoo.initEditor();

            catalogType = 1;
            /*++++++ Validate form +++++++*/
            $("#frm").validate({
                rules: {
                    catalogName: {
                        required: true,
                        maxlength: 255
                    },
                    parent: {
                        required: true
                    },
                    catalogType: {
                        required: true,
                        min: 1
                    },
                    ordering: {
                        number: true
                    }
                },
                messages: {
                    catalogName: "Tên danh mục không được để trống. Tối đa 255 kí tự",
                    parent: "Xin hãy chọn danh mục cha",
                    catalogType: "Xin hãy chọn loại danh mục",
                    ordering: 'Thứ tự phải là chữ số'
                }
            });

            /*+++++++++++ JSTREE +++++++++++*/
            $('div#catalog-tree').jstree({
                // List of active plugins
                "plugins": [
                    "themes", "ui", "html_data"
                ],
                "themes": {
                    "theme": "default",
                    "dots": true,
                    "icons": false
                },
                "core": {"animation": 300},
                "html_data": {
                    "ajax": {
                        // the URL to fetch the data
                        "url": baseurl + '/backend/catalog-yahoo/get-child',
                        "type": "post",
                        "data": function (n) {
                            // the result is fed to the AJAX request `data` option
                            return {
                                type: 'add',
                                catalogType: catalogType
                            };
                        },
                        "success": function (res) {
                        }
                    }
                }
            });

            /*++++++ Catalog Filter +++++++*/
            $('select#catalogTypeSelect').change(function () {
                catalogType = $(this).val();
                $('div#catalog-tree').jstree("refresh");
            });

            var parent_id;
            /*+++++++++++ Select Parent Catalog +++++++++++*/
            $(document).on('change', 'input[type=radio][name=parentID]', function () {
                parent_id = parseInt($(this).val());

                var parent_name = $.trim($(this).parent().find('a').first().text());
                $('input#parent').val(parent_name);
                $('#catalogTypeRow').fadeIn();
                $('div#hidden-field').empty();


                if (parent_id == 0) {
                    $('select#catalogType').attr('disabled', false);
                    $('select#catalogType').val(parent_id);
                } else {
                    var cat_type = $(this).attr('rel');
                    $('select#catalogType').val(cat_type);
                    $('select#catalogType').attr('disabled', true);

                    var hiddenField = $('<input type="hidden">').attr('name', 'catalogType').val(cat_type);

                    $('div#hidden-field').html(hiddenField);
                }
            });

            /*++++++ Upload Catalog Images +++++++*/
            //Catalog.upload();

            //Generate catalog slug
            CatalogYahoo.getSlug();
            $("#catalogImage").Nileupload({
                action: baseurl + '/backend/catalog-yahoo/upload',
                size: '2MB',
                extension: 'jpg,jpeg,png',
                progress: $("#progress"),
                preview: $(".catalogImageList"),
                multi: true
            });
            $("#catalogImage2").Nileupload({
                action: baseurl + '/backend/catalog-yahoo/upload',
                size: '2MB',
                extension: 'jpg,jpeg,png',
                progress: $("#progress2"),
                preview: $(".catalogImageList2"),
                multi: true
            });


            $('body').on('click', '.delete', function () {
                $(this).parents('li').fadeOut('fast', function () {
                    $(this).remove();
                });
            });
        });
    },
    edit: function (catalog_id, parent_id) {
        $(document).ready(function () {
            CatalogYahoo.initEditor();

            catalogType = $('select#catalogTypeSelect').val();

            $("#catalogImage").Nileupload({
                action: baseurl + '/backend/catalog-yahoo/upload',
                size: '2MB',
                extension: 'jpg,jpeg,png',
                progress: $("#progress"),
                preview: $(".catalogImageList"),
                multi: true
            });
            $("#catalogImage2").Nileupload({
                action: baseurl + '/backend/catalog-yahoo/upload',
                size: '2MB',
                extension: 'jpg,jpeg,png',
                progress: $("#progress2"),
                preview: $(".catalogImageList2"),
                multi: true
            });

            /*++++++ Validate form +++++++*/
            frm = $("#frm");
            frm.validate({
                rules: {
                    catalogName: {
                        required: true,
                        maxlength: 255
                    },
                    ordering: {
                        number: true
                    }
                },
                messages: {
                    catalogName: "Tên danh mục không được để trống. Tối đa 255 kí tự",
                    //metaTitle: "Meta title không được để trống",
                    //metaKeyword: "Meta keyword không được để trống",
                    //metaDescription: "Meta description không được để trống",
                    ordering: 'Thứ tự phải là chữ số'
                }
            });

            /*+++++++++++ JSTREE +++++++++++*/
            $('div#catalog-tree')
                    .jstree({
                        // List of active plugins
                        "plugins": [
                            "themes", "ui", "html_data",
                        ],
                        "themes": {
                            "theme": "default",
                            "dots": true,
                            "icons": false
                        },
                        "core": {"animation": 300, },
                        "html_data": {
                            "ajax": {
                                // the URL to fetch the data
                                "url": baseurl + '/backend/catalog-yahoo/get-child',
                                "type": "post",
                                "data": function (n) {
                                    // the result is fed to the AJAX request `data` option
                                    return {
                                        type: 'edit',
                                        parent_id: parent_id,
                                        catalogType: catalogType
                                    };
                                },
                                "success": function (res) {
                                }
                            }
                        }
                    })
                    .bind("loaded.jstree", function () {
                        var radioObj = $('input[type=radio][name=parentID]:checked');
                        var parent_name = $.trim(radioObj.parent().find('a').first().text());
                        $('input#parent').val(parent_name);

                        /*+++++++++++ Select Parent Catalog +++++++++++*/
                        $(document).on('change', 'input[type=radio][name=parentID]', function () {
                            parent_id = parseInt($(this).val());

                            var parent_name = $.trim($(this).parent().find('a').first().text());
                            $('input#parent').val(parent_name);

                            //$('.btn-complete-submit').unbind('click');


                            if (parent_id == 0) {
                                //hide images upload
                                $('#catalogImagesRow').fadeIn();
                                $("#progress").css('width', '150px');
                            } else {
                                //hide images upload
                                $('#catalogImagesRow').fadeOut();
                            }

                        });
                    });

            $('.btn-complete-submit').click(function () {
                if (frm.valid()) {
                    if (!$('input[type=hidden][name=catalogImages]').length && parent_id == 0) {
                        bootbox.alert('Vui lòng chọn ảnh cho danh mục');
                        return false;
                    }
                }
            });

            /*++++++ Catalog Filter +++++++*/
            $('select#catalogTypeSelect').change(function () {
                catalogType = $(this).val();
                $('div#catalog-tree').jstree("refresh");
            });

            $('body').on('click', '.delete', function () {
                $(this).parents('li').fadeOut('fast', function () {
                    $(this).remove();
                });
            });
        });
    },
    del: function () {
        $(document).on('click', '.remove', function () {
            catalogID = $(this).parent().attr('rel');
            if (catalogID) {
                bootbox.confirm('Bạn có muốn xóa danh mục này không', function (res) {
                    if (res) {
                        $.ajax({
                            type: "POST",
                            url: baseurl + '/backend/catalog-yahoo/delete',
                            cache: false,
                            dataType: 'json',
                            data: {
                                'catalogID': catalogID
                            },
                            success: function (result) {
                                if (result.st == -1) {
                                    return bootbox.alert('' + result.msg + '');
                                }
                                if (result) {
                                    location.reload();
                                } else {
                                    bootbox.alert('Không thể xóa danh mục này');
                                }

                            }
                        });
                    }
                });
            }
        });
    },
    getSlug: function () {
        $('#catalogName').blur(function () {
            var catalogName = $(this).val();
            if (catalogName) {
                var slug = generateSlug(catalogName);
                $('#catalogSlug').val(slug);
            }
        });

        /*
         $.validator.addMethod("isSlug", function(value, element) {
         return isSlug(value);
         }, "SEO URL bạn nhập không đúng định dạng ( VD: \"giao-duc-va-dao-tao\" )");
         */
    },
    initEditor: function () {
        tinymce.init({
            selector: "textarea.description",
            height: 200,
            forced_root_block: false,
            plugins: [
                "autolink autosave link image lists charmap print preview hr anchor pagebreak",
                "wordcount visualblocks visualchars code fullscreen insertdatetime media nonbreaking",
                "table contextmenu directionality emoticons template textcolor paste textcolor colorpicker textpattern"
            ],
            toolbar1: "bold italic underline strikethrough | alignleft aligncenter alignright alignjustify | fontselect fontsizeselect",
            toolbar2: "cut copy paste | undo redo | link unlink anchor code | insertdatetime preview | forecolor backcolor code",
            menubar: false,
            //toolbar_items_size: 'small',
            fontsize_formats: "8pt 9pt 10pt 11pt 12pt 13pt 14pt 18pt 24pt 36pt",
            style_formats: [
                {title: 'Bold text', inline: 'b'},
                {title: 'Red text', inline: 'span', styles: {color: '#ff0000'}},
                {title: 'Red header', block: 'h1', styles: {color: '#ff0000'}},
            ]
        });
    }
};
function clearForm(ele) {
    $(ele).find(':input').each(function () {
        switch (this.type) {
            case 'password':
            case 'select-multiple':
            case 'select-one':
            case 'text':
            case 'textarea':
                $(this).val('');
                break;
            case 'checkbox':
            case 'radio':
                this.checked = false;
        }
    });
}

function fillData(selectedObj) {
    var str = selectedObj.attr('rel');
    var arr = str.split('|');
    var data = {};

    var cat_id = selectedObj.attr('id');

    var cat_name = arr[0];
    var cat_type = arr[1];
    var keyword = arr[2];
    var description = arr[3];
    var ordering = arr[4];

    var item = '<tr>' +
            '<td style="text-align: center;">' + cat_name + '</td>' +
            '<td style="text-align: center;">' + cat_type + '</td>' +
            '<td style="text-align: center;">' + keyword + '</td>' +
            '<td style="text-align: center;">' + description + '</td>' +
            '<td style="text-align: center;">' + ordering + '</td>';

    item += '<td style="text-align: center;">';
    item += '<a rel="' + cat_id + '" class="action">';
    item += '<i class="fa fa-pencil edit"></i>';
    item += '</a>&nbsp;';
    item += '<a rel="' + cat_id + '" class="action">';
    item += '<i class="fa fa-times-circle remove"></i>';
    item += '</a>';
    item += '</td>';
    item += '</tr>';

    return item;
}


function generateSlug(str) {
    str = str.replace(/^\s+|\s+$/g, ''); // trim
    str = str.toLowerCase();

    // remove accents
    var from = "áàảãạăắằẳẵặâấầẩẫậđéèẻẽẹêếềểễệíìỉĩịỗóòỏõọôốồổộơớờởỡợúùủũụứừửữựưýỳỷỹỵ·/_,:;";
    var to = "aaaaaaaaaaaaaaaaadeeeeeeeeeeeiiiiiooooooooooooooooouuuuuuuuuuuyyyyy------";

    for (var i = 0, l = from.length; i < l; i++) {
        str = str.replace(new RegExp(from.charAt(i), 'g'), to.charAt(i));
    }

    str = str.replace(/[^a-z0-9 -]/g, '') // remove invalid chars
            .replace(/\s+/g, '-') // collapse whitespace and replace by -
            .replace(/-+/g, '-'); // collapse dashes
    return str;
}

function isSlug(strSlug) {
    if (/^[a-z][a-z0-9-]+$/i.test(strSlug)) {
        return true;
    }
    return false;
}