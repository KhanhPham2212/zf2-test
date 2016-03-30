var Transport = {
    index: function () {
        $(document).ready(function () {
            var city = $('#city');
            var district = $('#district');
            var ward = $('#ward');
            $('#city').change(function () {
                var cityID = $(this).val();
                district.attr('disabled', 'disabled').html('<option value="">Chọn Quận / Huyện</option>');
                ward.attr('disabled', 'disabled').html('<option value="">Chọn Phường / Xã</option>');
                if (cityID) {
                    $.ajax({
                        type: "POST",
                        url: baseurl + '/backend/district/get-list',
                        cache: false,
                        dataType: 'json',
                        data: {'cityID': cityID},
                        success: function (result) {
                            if (result.st == -1) {
                                return bootbox.alert('' + result.msg + '');
                            }
                            district.html('<option value="">Chọn Quận / Huyện</option>').removeAttr('disabled');
                            $.each(result, function (k, v) {
                                district.append('<option value="' + v.district_id + '">' + v.district_name + '</option>');
                            });

                        }
                    });
                }
            });
            district.change(function () {
                var districtID = $(this).val();
                ward.attr('disabled', 'disabled').html('<option value="">Chọn Phường / Xã</option>');
                if (districtID) {
                    $.ajax({
                        type: "POST",
                        url: baseurl + '/backend/ward/get-list',
                        cache: false,
                        dataType: 'json',
                        data: {'districtID': districtID},
                        success: function (result) {
                            if (result.st == -1) {
                                return bootbox.alert('' + result.msg + '');
                            }
                            ward.html('').removeAttr('disabled');
                            $.each(result, function (k, v) {
                                ward.append('<option value="' + v.ward_id + '">' + v.ward_name + '</option>');
                            });

                        }
                    });
                }
            });

            ward.change(function () {
                var cityID = city.val();
                var districtID = district.val();
                var wardID = ward.val();
                if (cityID && districtID && wardID) {
                    $.ajax({
                        type: "POST",
                        url: baseurl + '/backend/transport/get-exist-area',
                        cache: false,
                        dataType: 'json',
                        beforeSend: function () {
                            $('#btnAddArea').attr('disabled', 'disabled');
                            $('#tblArea').html('<tr><td colspan="5" style="text-align:center;"><i class="fa fa-refresh fa-spin fa-3x fa-fw"></i></td></tr>');
                        },
                        data: {'cityID': cityID, 'districtID': districtID, 'wardID': wardID},
                        success: function (result) {
                            if (result.st == -1) {
                                return bootbox.alert('' + result.msg + '');
                            }
                            $('ul.pagination').parent().parent().remove();
                            if (result.success == 1 && result.arrAreaList) {
                                $('#tblArea').html('');
                                $.each(result.arrAreaList, function (k, v) {
                                    var html = '<tr>'
                                            + '<td class="text-center"><input type="checkbox" class="transporterCheckbox " item-id="' + v.transporter_area_id + '"></td>'
                                            + '<td style="text-align:center;font-weight:bold;" data-title="Trung gian vận chuyển">' + v.transporter_name + '</td>'
                                            + '<td style="text-align:center;font-weight:bold;" data-title="Tỉnh / Thành">' + v.city_name + '</td>'
                                            + '<td style="text-align:center;font-weight:bold;" data-title="Quận / Huyện">' + v.district_name + '</td>'
                                            + '<td style="text-align:center;font-weight:bold;" data-title="Phường / Xã">' + v.ward_name + '</td>'
                                            + '<td style="text-align:center;font-weight:bold;" data-title="Chức năng"><a class="fa fa-times-circle tooltips action btnRemove" rel="' + v.transporter_area_id + '" data-original-title="Xóa trung gian" data-placement="top"></a></td>'
                                            + '</tr>';
                                    $('#tblArea').append(html);
                                });
                            } else {
                                $('#btnAddArea').removeAttr('disabled');
                                $('#tblArea').html('<tr><td colspan="5" style="text-align:center;"><b>Khu vực bạn chọn hiện tại chưa có nhà vận chuyển trung gian nào.</b></td></tr>');
                            }
                        }

                    });
                }
            });

            $('#btnAddArea').click(function () {
                var isError = false;
                $('#frm select').each(function (k, v) {
                    var isSelected = $(v).val(),
                            label = $(this).parent().prev().text();
                    if (!isSelected) {
                        isError = true
                        bootbox.alert('<b>Vui lòng chọn ' + label + '</b>');
                        return false;
                    }
                });
                if (isError) {
                    return false;
                }

                $('#frm').submit();
            });
            //select all items checkbox event
            $('#selectAllItem').click(function () {
                $('.transporterCheckbox').removeAttr('checked');
                if ($('#selectAllItem:checked').size() > 0) {
                    $('.transporterCheckbox').not('.itemCanceled').trigger('click');
                }
                if ($(".transporterCheckbox:checked").size() > 0) {
                    $("#scroll-right-delete").fadeIn();
                } else {
                    $("#scroll-right-delete").fadeOut();
                }
            });
            $('.transporterCheckbox').click(function () {
                if ($(".transporterCheckbox:checked").size() > 0) {
                    $("#scroll-right-delete").fadeIn();
                } else {
                    $("#scroll-right-delete").fadeOut();
                }
            });

            $('#scroll-right-delete button').click(function () {

                bootbox.confirm('<b>Bạn có muốn xóa những khu vực này không ?</b>', function (result) {
                    arrAreaID = [];
                    $('.transporterCheckbox:checked').each(function (index, elem) {
                        arrAreaID[index] = $(elem).attr("item-id");
                    });
                    if (result) {
                        $.ajax({
                            type: "POST",
                            url: baseurl + '/backend/transport/del-multi-area',
                            cache: false,
                            dataType: 'json',
                            data: {arrAreaID: arrAreaID},
                            beforeSend: function () {
                                $('.bootbox .btn-primary').html('<i class="fa fa-refresh fa-spin"></i> Đang tải...').attr('disabled', 'disabled');
                            },
                            success: function (result) {
                                if (result.st == -1) {
                                    return bootbox.alert('' + result.msg + '');
                                }
                                if (result.success) {
                                    window.location = result.redirectURL;
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
    add: function () {
        $(document).ready(function () {
        });
    },
    edit: function () {
        $(document).ready(function () {

        });
    },
    del: function () {
        $(document).ready(function () {
            $(document).on('click', '.btnRemove', function () {
                var areaID = $(this).attr('rel');
                if (!areaID || isNaN(areaID)) {
                    return bootbox.alert('Không thể xóa khu vực này, xin vui lòng thử lại.');
                }
                bootbox.confirm('<b>Bạn có muốn xóa khu vực này không ?</b>', function (result) {
                    if (result) {
                        $.ajax({
                            type: "POST",
                            url: baseurl + '/backend/transport/del-area',
                            cache: false,
                            dataType: 'json',
                            data: {areaID: areaID},
                            beforeSend: function () {
                                $('.bootbox .btn-primary').html('<i class="fa fa-refresh fa-spin"></i> Đang tải...').attr('disabled', 'disabled');
                            },
                            success: function (result) {
                                if (result.st == -1) {
                                    return bootbox.alert('' + result.msg + '');
                                }
                                if (result.success) {
                                    window.location = result.redirectURL;
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
    }
};
