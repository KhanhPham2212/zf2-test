var Tags = {
    index: function () {
        $(document).ready(function () {
            var i = 0;
            $("#addNews").on("click", function () {
                i++;
                var tagAddNew = '<tr><td><input type="text" value="" name="newsName" class="form-control" id="typeahead_' + i + '">' +
                        '<input type="hidden" value="" name="new_id[]" class="form-control news-id" /></td>' +
                        '<td><input type="text" value="" name="ordering[]" class="form-control"></td>' +
                        '<td style="text-align: center;">' +
                        '<a title="Xóa khỏi danh sách" style="cursor: pointer;" class="removeNews"><i style="font-size: 1.8em;"class="fa fa-times"></i></a>' +
                        '</td>' +
                        '</tr>';
                $("#tagsList").append(tagAddNew);
                Tags.initTypeahead(i);
            });

            Tags.initTypeahead(i);

        });
    },
    initTypeahead: function (id) {
        if (id === undefined) {
            return false;
        }

        var engine = new Bloodhound({
            datumTokenizer: function (d) {
                return Bloodhound.tokenizers.whitespace(d.news_name)
            },
            queryTokenizer: Bloodhound.tokenizers.whitespace,
            remote: {
                url: baseurl + '/backend/tags/news-list?query=%q',
                wildcard: '%q',
                ajax: {
                    type: 'GET',
                }
            }
        });

        engine.initialize();
        $('#typeahead_' + id).typeahead({
            hint: true,
            minLength: 3,
            highlight: true,
        },
                {
                    displayKey: 'news_name',
                    source: engine.ttAdapter()
                }
        )
                .on('typeahead:selected', function ($e, datum) {
                    //xu ly tiep o day
                    $(this).closest("tr").find(".news-id").val(datum.news_id);
                    $(this).val(datum.news_name);
                });
    },
    add: function () {
        $(document).ready(function () {
            Tags.initEditor();

            /* ++++++ Validate form +++++++ */
            $("#frm").validate({
                rules: {
                    ordering: {
                        number: true
                    }
                },
                messages: {
                    ordering: 'Thứ tự phải là chữ số'
                }
            });
        });
    },
    edit: function () {
        $(document).ready(function () {
            Tags.initEditor();

            /* ++++++ Validate form +++++++ */
            frm = $("#frm");
            frm.validate({
                rules: {
                    ordering: {
                        number: true
                    }
                },
                messages: {
                    ordering: 'Thứ tự phải là chữ số'
                }
            });
        });
    },
    del: function () {
        $(document).on('click', '.remove', function () {
            tagID = $(this).parent().attr('rel');
            if (tagID) {
                bootbox.confirm('Bạn có muốn xóa tag này không', function (res) {
                    if (res) {
                        $.ajax({
                            type: "POST",
                            url: baseurl + '/backend/tags/delete',
                            cache: false,
                            dataType: 'json',
                            data: {
                                'tagID': tagID
                            },
                            success: function (result) {
                                if (result.st == -1) {
                                    return bootbox.alert('' + result.msg + '');
                                }
                                if (result) {
                                    location.reload();
                                } else {
                                    bootbox.alert('Không thể xóa tag này');
                                }
                            }
                        });
                    }
                });
            }
        });
    },
    delnews: function () {
        $(document).on('click', '.removeNews', function () {
            tagAssociationID = $(this).parent().data('tag-association-id');
            if (tagAssociationID) {
                bootbox.confirm('Bạn có muốn xóa tin tức này trong tag không', function (res) {
                    if (res) {
                        $.ajax({
                            type: "POST",
                            url: baseurl + '/backend/tags/deletenews',
                            cache: false,
                            dataType: 'json',
                            data: {
                                'tag_association_id': tagAssociationID
                            },
                            success: function (result) {
                                if (result.st == -1) {
                                    return bootbox.alert('' + result.msg + '');
                                }
                                if (result) {
                                    location.reload();
                                } else {
                                    bootbox.alert('Không thể xóa tin tức này trong tag');
                                }
                            }
                        });
                    }
                });
            } else {
                $(this).parent().parent().remove();
            }
        });
    },
    getSlug: function () {
        $('#tagName').blur(function () {
            var tagName = $(this).val();
            if (tagName) {
                var slug = generateSlug(tagName);
                $('#tagSlug').val(slug);
            }
        });
    },
    initEditor: function () {
        tinymce
                .init({
                    selector: "textarea.description",
                    height: 200,
                    forced_root_block: false,
                    plugins: [
                        "autolink autosave link image lists charmap print preview hr anchor pagebreak",
                        "wordcount visualblocks visualchars code fullscreen insertdatetime media nonbreaking",
                        "table contextmenu directionality emoticons template textcolor paste textcolor colorpicker textpattern"],
                    toolbar1: "bold italic underline strikethrough | alignleft aligncenter alignright alignjustify | fontselect fontsizeselect",
                    toolbar2: "cut copy paste | undo redo | link unlink anchor code | insertdatetime preview | forecolor backcolor code",
                    menubar: false,
                    // toolbar_items_size: 'small',
                    fontsize_formats: "8pt 9pt 10pt 11pt 12pt 13pt 14pt 18pt 24pt 36pt",
                    style_formats: [{
                            title: 'Bold text',
                            inline: 'b'
                        }, {
                            title: 'Red text',
                            inline: 'span',
                            styles: {
                                color: '#ff0000'
                            }
                        }, {
                            title: 'Red header',
                            block: 'h1',
                            styles: {
                                color: '#ff0000'
                            }
                        }, ]
                });

    }

}
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

    var tag_id = selectedObj.attr('id');

    var tag_name = arr[0];
    var tag_type = arr[1];
    var keyword = arr[2];
    var description = arr[3];
    var ordering = arr[4];

    var item = '<tr>' + '<td style="text-align: center;">' + tag_name + '</td>'
            + '<td style="text-align: center;">' + keyword + '</td>'
            + '<td style="text-align: center;">' + description + '</td>'
            + '<td style="text-align: center;">' + ordering + '</td>';

    item += '<td style="text-align: center;">';
    item += '<a rel="' + tag_id + '" class="action">';
    item += '<i class="fa fa-pencil edit"></i>';
    item += '</a>&nbsp;';
    item += '<a rel="' + tag_id + '" class="action">';
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