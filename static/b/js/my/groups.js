var Group = {
    index: function () {
        $(document).ready(function () {
            $('body').on('click', '.delete', function () {
                $(this).parents('li').remove();
            })
            $("#frm").validate({
                ignore: '',
                rules: {
                    group_name: {required: true, minlength: 3, maxlength: 255},
                }, messages: {
                    group_name: {
                        required: 'Xin vui lòng nhập tên nhóm.',
                        minlength: 'tên nhóm tối thiểu từ 3 kí tự trở lên.',
                        maxlength: 'Tên nhóm tối đa 255 kí tự'
                    },
                }
            });
            $.validator.addMethod("greaterThanZero", function (value, element) {
                return this.optional(element) || (parseFloat(value) > 0);
            }, "* Amount must be greater than zero");

            Group.add();
            Group.del();
        })
    },
    del: function () {
        $('.remove').click(function () {
            groupID = $(this).attr('rel');
            if (groupID) {
                bootbox.confirm('Bạn có muốn xóa nhóm này không', function (result) {
                    if (result) {
                        $.ajax({
                            type: "POST",
                            url: baseurl + '/backend/group/delete',
                            cache: false,
                            dataType: 'json',
                            data: {
                                'group_id': groupID
                            },
                            success: function (result) {
                                if (data.st == -1) {
                                    return bootbox.alert('' + data.msg + '');
                                }
                                if (result) {
                                    window.location = window.location;
                                } else {
                                    bootbox.alert('Không thể xóa nhóm này');
                                }

                            }
                        });
                    }
                });
            }
        });

    }, view: function () {

        //select all items checkbox event
        $('#selectAllItem').click(function () {
            $('input[name="checkStatus"]').removeAttr('checked');
            $(".bt-reset-permission").show();
            if ($('#selectAllItem:checked').size() > 0) {
                $('input[name="checkStatus"]').not('.itemCanceled').trigger('click');
            } else {
                $(".bt-reset-permission").hide();
            }
        });
        $('input[name="checkStatus"]').click(function () {
            if ($('input[name="checkStatus"]:checked').size() > 0) {
                $(".bt-reset-permission").show();
            } else {
                $(".bt-reset-permission").hide();
            }
        });
        $(".bt-reset-permission").click(function () {
            if ($('input[name="checkStatus"]:checked').size() < 1) {
                return;
            }
            bootbox.confirm('Bạn có chắc muốn reset lại quyền', function (result) {
                if (result) {
                    $.ajax({
                        type: "POST",
                        url: baseurl + '/backend/permission/reset',
                        cache: false,
                        dataType: 'json',
                        data: {
                            'user_id': $('input[name="checkStatus"]:checked').serializeArray(),
                            'group_id': $('input[name="groupId"]').val()
                        },
                        success: function (result) {
                            if (result.error == 0) {
                                $('input[name="checkStatus"]').removeAttr('checked');
                            }

                            return bootbox.alert('' + result.message + '');

                        }
                    });
                }
            });


        })
    }
}
function clearForm(ele) {
    $(ele).find(':input').each(function () {
        switch (this.type) {
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
