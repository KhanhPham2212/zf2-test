var Lading = {
    index: function () {
        $(document).ready(function () {
            getLadingDate();
            $('#btnToggleFilterLading').click(function () {
                $('#frmFilterLading').toggle();
            });
            $('.viewLading').on('click', function () {
                var $this = $(this);
                if ($this.hasClass('pause')) {
                    return false;
                }
                var orderID = parseInt($this.parent().prevAll('td.orderID').text());
                var ladingCode = $.trim($this.parent().prevAll('td.ladingCode').text());
                var ladingDate = $.trim($this.parent().prevAll('td.ladingDate').text());

                if (!ladingCode || ladingCode === '' || !orderID || isNaN(orderID) || !ladingDate || ladingDate === '') {
                    return bootbox.alert('<b>Không thể xem chi tiết vận đơn này, vui lòng thử lại.</b>');
                }
                $this.removeClass('fa fa-search viewLading').addClass('fa fa-refresh fa-spin pause');
                getItemList(orderID, ladingCode, ladingDate);
                setTimeout(function () {
                    $this.removeClass('fa fa-refresh fa-spin pause').addClass('fa fa-search viewLading');
                }, 800);
            });

            $('#btnPrintLading').click(function () {
                var params = $('#frm').serialize();
                if (params) {
                    window.location = baseurl + '/backend/print/print-lading/?' + params;
                }
            });

            $('#btnExportExcel').click(function () {
                var params = $('#frm').serialize();
                if (params) {
                    window.location = baseurl + '/backend/lading/export-lading-to-excel/?' + params;
                }
            });

            $('#btnCreateLading').click(function () {
                bootbox.dialog({
                    message: '<form class="form-horizontal" role="form" method="POST" id="frm-ladding" action="' + baseurl + '/backend/print/print-lading-text">' +
                            '<div class="msg-box"></div>' +
                            '<div class="form-group">' +
                            '<label for="" class="col-lg-2 col-sm-2 control-label">Họ và tên</label>' +
                            '<div class="col-lg-10">' +
                            '<input type="text" class="form-control" id="lad_name" name="lad_name" placeholder="Họ và tên">' +
                            '</div>' +
                            '</div>' +
                            '<div class="form-group">' +
                            '<label for="" class="col-lg-2 col-sm-2 control-label">Địa chỉ</label>' +
                            '<div class="col-lg-10">' +
                            '<input type="text" class="form-control"  id="lad_address" name="lad_address" placeholder="Địa chỉ">' +
                            '</div>' +
                            '</div>' +
                            '<div class="form-group">' +
                            '<label for="" class="col-lg-2 col-sm-2 control-label">Điện thoại</label>' +
                            '<div class="col-lg-10">' +
                            '<input type="text" class="form-control"  id="lad_phone" name="lad_phone" placeholder="Điện thoại">' +
                            '</div>' +
                            '</div>' +
                            '<div class="form-group">' +
                            '<label for="" class="col-lg-2 col-sm-2 control-label">Email</label>' +
                            '<div class="col-lg-10">' +
                            '<input type="text" class="form-control"  id="lad_email" name="lad_email" placeholder="Email">' +
                            '</div>' +
                            '</div>' +
                            '<div class="form-group">' +
                            '<label for="" class="col-lg-2 col-sm-2 control-label">Tracking</label>' +
                            '<div class="col-lg-10">' +
                            '<input type="text" class="form-control"  id="lad_track" name="lad_track" placeholder="Tracking code">' +
                            '</div>' +
                            '</div>' +
                            '</div>' +
                            '<div class="form-group">' +
                            '<label for="" class="col-lg-2 col-sm-2 control-label">Trọng lượng</label>' +
                            '<div class="col-lg-10">' +
                            '<input type="text" class="form-control" id="lad_weight" name="lad_weight" placeholder="Trọng lượng">' +
                            '</div>' +
                            '</div>' +
                            '</div>' +
                            '<div class="form-group">' +
                            '<label for="" class="col-lg-2 col-sm-2 control-label">Chi phí</label>' +
                            '<div class="col-lg-10">' +
                            '<input type="text" class="form-control" value="0" id="lan_fee" name="lan_fee" placeholder="Chi phí">' +
                            '</div>' +
                            '</div>' +
                            '</div>' +
                            '<div class="form-group">' +
                            '<label for="" class="col-lg-2 col-sm-2 control-label">Số kiện</label>' +
                            '<div class="col-lg-10">' +
                            '<input type="text" class="form-control" value="1" id="lad_num" name="lad_num" placeholder="Số kiện">' +
                            '</div>' +
                            '</div>' +
                            '</div>' +
                            '<div class="form-group">' +
                            '<label for="" class="col-lg-2 col-sm-2 control-label">Mã vận đơn</label>' +
                            '<div class="col-lg-10">' +
                            '<input type="text" class="form-control" id="lad_landing" name="lad_code" placeholder="Mã vận đơn">' +
                            '</div>' +
                            '</div>' +
                            '</div>' +
                            '<div class="form-group">' +
                            '<label for="" class="col-lg-2 col-sm-2 control-label">Trung gian vận chuyển</label>' +
                            '<div class="col-lg-10">' +
                            '<select class="form-control"  id="lad_ship" name="lad_ship" >' +
                            '<option value="PS">Proship</option>' +
                            '<option value="BĐ">Bưu điện</option>' +
                            '<option value="HN">Hà Nội</option>' +
                            '</select>' +
                            '</div>' +
                            '</div>' +
                            '</form>',
                    closeButton: true,
                    title: "Thông tin vận đơn",
                    className: "medium",
                    buttons: {
                        danger: {
                            label: "Thoát",
                            className: "btn-danger",
                            callback: function () {
                                bootbox.hideAll();
                            }
                        }, main: {
                            label: "Tạo",
                            className: "btn-success",
                            callback: function () {
                                var params = $('#frm-ladding').serialize();
                                $.ajax({
                                    type: "POST",
                                    url: baseurl + '/backend/print/print-lading-text',
                                    cache: false,
                                    data: 'ajax=true&' + params,
                                    beforeSend: function () {

                                    },
                                    success: function (data) {
                                        result = $.parseJSON(data);
                                        if (result.st == -1) {
                                            $('.msg-box').html('<div class="alert alert-block alert-danger fade in"><button data-dismiss="alert" class="close close-sm" type="button"> <i class="icon-remove"></i> </button><strong>Có lỗi xảy ra!</strong><div>' + result.msg + '</div></div>');

                                        } else {
                                            $("#frm-ladding").submit();
                                            // window.location = baseurl + '/backend/print/print-lading-text/?' + params;
                                        }
                                    }
                                });
                                return false;
                            }
                        }
                    }
                });
            });
        });
    },
    add: function (orderID) {
        $(document).ready(function () {
            var error = false,
                    itemStatus = 0,
                    itemID = '';
            $('.orderStatusCheckbox:checked').each(function (k, v) {
                itemStatus = parseInt($(v).attr('item-status'));
                if (!itemStatus || isNaN(itemStatus) || itemStatus < 5) {
                    return error = true;
                }
                itemID += $(v).attr('item-id') + ',';
            });

            if (error === true) {
                $('#btnChangeMultiItemStatus').val(0);
                return bootbox.alert('<b>Chỉ những sản phẩm đã có tracking mới có thể tạo vận đơn.</b>');
            }

            itemID = itemID.slice(0, -1);
            if (!orderID || isNaN(orderID) || !itemID) {
                return bootbox.alert('<b>Không thể tạo mã vận đơn, vui lòng kiểm tra lại.</b>');
            }
            $.ajax({
                type: "GET",
                url: baseurl + '/backend/lading/add',
                cache: false,
                dataType: 'json',
                data: {orderID: orderID, itemID: itemID},
                success: function (result) {
                    if (result.st == -1) {
                        return  bootbox.alert('' + data.msg + '');
                    }

                    if (result.error == 1) {
                        $('#btnChangeMultiItemStatus').val(0);
                        return bootbox.alert('<b>' + result.message + '</b>');
                    }
                    bootbox.dialog({
                        message: result.modal_content,
                        closeButton: true,
                        title: "Tạo vận đơn",
                        buttons: {
                            danger: {
                                label: '<span id="btnCancelView">Hủy</span>',
                                className: "btn-danger",
                                callback: function () {
                                    $('#btnChangeMultiItemStatus').val(0);
                                }
                            },
                            main: {
                                label: '<span id="btnConfirm">Xác nhận</span>',
                                className: "btn-primary",
                                callback: function () {
                                    $('#frmAddLading').submit();
                                    return false;
                                }
                            }
                        }
                    }).find("div.modal-dialog").css({'margin': '0 auto', 'width': '100%'});
                    $('.bootbox-close-button').click(function () {
                        $('#btnChangeMultiItemStatus').val(0);
                    });
                }
            });
        });
    },
    vehicleTrip: function () {
        $(document).ready(function () {
            $('#btnToggleFilterVehicleTrip').click(function () {
                $('#frmFilterVehicleTrip').toggle();
            });
            $('.lockVehicleTrip').click(function () {
                var vehicleTrip = $(this).parents('tr').attr('vehicletrip'),
                        timestamp = $(this).parents('tr').attr('timestamp');
                if (!vehicleTrip || !timestamp) {
                    return bootbox.alert('Không thể khóa đợt hàng này.');
                }
                bootbox.confirm('<b>Bạn có muốn khóa đợt hàng này không ?</b>', function (result) {
                    if (result) {
                        $.ajax({
                            type: "POST",
                            url: baseurl + '/backend/lading/vehicle-trip',
                            cache: false,
                            dataType: 'json',
                            data: {vehicleTrip: vehicleTrip, timestamp: timestamp},
                            beforeSend: function () {
                                $('.modal-content .btn-primary').html('<i class="fa fa-refresh fa-spin"></i> Đang xử lý...').attr('disabled', 'disabled');
                            },
                            success: function (result) {
                                if (result.st == -1) {
                                    return bootbox.alert('' + result.msg + '');
                                }

                                if (result.success == 1) {
                                    return window.location = window.location;
                                }
                                return bootbox.alert(result.message);
                            }
                        });
                    }
                });
            });
            $('.unlockVehicleTrip').click(function () {
                return bootbox.alert('Chức năng đang được phát triển.');
            });
        });
    },
    edit: function () {
        $(document).ready(function () {

        });
    },
    del: function () {
        $(document).ready(function () {

        });
    },
    view: function () {
        $(document).ready(function () {
            $('#ladingList').click(function () {
                if (!orderID || isNaN(orderID)) {
                    return bootbox.alert('<b>Không thể xem vận đơn, vui lòng thử lại.</b>');
                }
                $(this).hide();
                getItemList(orderID, '', '');
            });

            $(document).on('change', '#frmViewLading-ladingList', function () {
                var ladingCode = $(this).val();
                var ladingDate = $('#frmViewLading-ladingDate').val();
                var deliveryMethod = $('#frmViewLading-deliveryMethod').val();
                getItemList(orderID, ladingCode, ladingDate, deliveryMethod);
            });

            $(document).on('change', '#frmViewLading-deliveryMethod', function () {
                var deliveryMethod = $(this).val();
                var ladingDate = $('#frmViewLading-ladingDate').val();
                getItemList(orderID, '', ladingDate, deliveryMethod);
            });

            $(document).on('change', '#frmViewLading-ladingDate', function () {
                var ladingDate = $(this).val();
                var deliveryMethod = $('#frmViewLading-deliveryMethod').val();
                getItemList(orderID, '', ladingDate, deliveryMethod);
            });
        });
    }
};
function getItemList(orderID, ladingCode, ladingDate, deliveryMethod) {
    orderID = typeof orderID === 'undefined' ? '' : orderID;
    ladingCode = typeof ladingCode === 'undefined' ? '' : ladingCode;
    ladingDate = typeof ladingDate === 'undefined' ? '' : ladingDate;
    deliveryMethod = typeof deliveryMethod === 'undefined' ? '' : deliveryMethod;
    var btn = {
        danger: {
            label: '<span id="btnCancelView">Thoát</span>',
            className: "btn-danger",
            callback: function () {
                $('#btnChangeMultiItemStatus').val(0);
            }
        }
    };
    if (ladingCode && ladingCode !== '0') {
        btn.main = {
            label: '<span id="btnConfirm">In vận đơn này</span>',
            className: "btn-primary",
            callback: function () {
                var params = {
                    orderID: orderID,
                    ladingCode: ladingCode,
                    ladingDate: ladingDate
                };
                printLading(params);
                return false;
            }
        };
        btn.success = {
            label: "Chỉnh sửa hình thức giao hàng",
            className: "btn-success",
            callback: function () {
                surchargeShipping(ladingCode);
                return false;
            }
        };
    }
    $.ajax({
        type: "GET",
        url: baseurl + '/backend/lading/view',
        cache: false,
        dataType: 'json',
        data: {ladingCode: ladingCode, orderID: orderID, ladingDate: ladingDate, deliveryMethod: deliveryMethod},
        beforeSend: function () {
            $('#frmViewLading-itemList tr').hide();
            $('#ladingList').hide();
            $('tr#loading, #ladingLoading').show();
        },
        success: function (result) {
            if (result.st == -1) {
                return bootbox.alert('' + result.msg + '');
            }
            $('#btnCancelView').trigger('click');
            $('#ladingList').show();
            $('#ladingLoading').hide();
            if (result.error == 1) {
                $('#btnChangeMultiItemStatus').val(0);
                return bootbox.alert('<b>' + result.message + '</b>');
            }
            setTimeout(function () {
                bootbox.dialog({
                    message: result.modal_content,
                    closeButton: true,
                    title: "CHI TIẾT VẬN ĐƠN",
                    buttons: btn
                }).find("div.modal-dialog").css({'margin': '0 auto', 'width': '100%'});
            }, 400);
        }
    });
}

function surchargeShipping(ladingCode) {

    if (typeof ladingCode === 'undefined' || !ladingCode) {
        bootbox.alert('<b>Không thể chỉnh sửa hình thức giao hàng cho vận đơn này.</b>');
        return false;
    }

    var data = {ladingCode: ladingCode};
    var html = '<form id="frmEditDeliveryMethod">'
            + '<div class="form-group">'
            + '<label><b>Hình thức giao hàng</b></label>'
            + '<select class="form-control" id="deliveryMethod">'
            + '<option value="0">Vui lòng chọn hình thức giao hàng</option>'
            + '<option value="1">Miễn phí giao hàng</option>'
            + '<option value="2">Khách đến kho nhận hàng</option>'
            + '<option value="3">Giao hàng tính phí</option>'
            + '</select>'
            + '</div>'
            + '<div class="form-group" id="blockSurchargeShipping" style="display:none;">'
            + '<label><b>Số tiền phụ thu (tính bằng USD)</b></label>'
            + '<input type="text" class="form-control" id="editSurchargeShipping" value="0" placeholder="Số tiền phụ thu (tính bằng USD)" disabled="disabled" />'
            + '</div>'
            + '</div>'
            + '</form>';


    $(document).on('change', '#deliveryMethod', function () {
        var deliveryMethod = $(this).val();
        if (deliveryMethod == 3) {
            $('#blockSurchargeShipping').show();
            $('#editSurchargeShipping').removeAttr('disabled');
        } else {
            $('#blockSurchargeShipping').hide();
            $('#editSurchargeShipping').attr('disabled', true);
        }
    });

    bootbox.dialog({
        message: html,
        closeButton: true,
        title: "PHỤ THU PHÍ GIAO HÀNG",
        buttons: {
            danger: {
                label: '<span id="btnCancelEdit">Thoát</span>',
                className: "btn-danger",
                callback: function () {
                    $('#frmEditDeliveryMethod').parents('.bootbox').remove();
                    return false;
                }
            },
            main: {
                label: '<span id="btnAddSurchargeShipping">Hoàn tất</span>',
                className: "btn-primary",
                callback: function () {
                    var deliveryMethod = $('#deliveryMethod').val();
                    var surchargeShipping = 0;
                    if (deliveryMethod < 1) {
                        bootbox.alert('Xảy ra lỗi trong quá trình xử lý');
                        return false;
                    }
                    if ($('#editSurchargeShipping:visible').length > 0) {
                        surchargeShipping = parseFloat($('#editSurchargeShipping:visible').val());
                        if (isNaN(surchargeShipping) || surchargeShipping === 0) {
                            alert('<b>Số tiền nhập vào không đúng, vui lòng thử lại.</b>');
                            return false;
                        }
                    }
                    $('#btnAddSurchargeShipping').html('<i class="fa fa-refresh fa-spin"></i> Đang xử lý...').parent().prop('disabled', true);
                    $.ajax({
                        type: "POST",
                        url: baseurl + '/backend/lading/update-surcharge-shipping',
                        cache: false,
                        dataType: 'json',
                        data: {surchargeShipping: surchargeShipping, deliveryMethod: deliveryMethod, ladingCode: ladingCode},
                        success: function (result) {
                            if (result.error == 1) {
                                alert(result.message);
                                return false;
                            }
                            bootbox.hideAll();
                            //reload form xem vận đơn
                            var ladingCode = $('#frmViewLading-ladingList').val();
                            var ladingDate = $('#frmViewLading-ladingDate').val();
                            var deliveryMethod = $('#frmViewLading-deliveryMethod').val();
                            var intOrderID = $('#frmViewLading-intOrderID').val();
                            getItemList(intOrderID, ladingCode, ladingDate, deliveryMethod);
                        }
                    });
                    return false;
                }
            }
        }
    });
}

function printLading(params) {
    if (!params.orderID || !params.ladingCode || !params) {
        return alert('Không thể in vận đơn này.');
    }
    var URL = baseurl + '/backend/print/print-lading/?' + $.param(params);
    window.open(URL, '_blank').focus();
}

function getLadingDate(callback) {
    $('#lading-year').change(function () {
        _getLadingDate('month', $('#lading-month'));
    });
    $('#lading-month').change(function () {
        _getLadingDate('day', $('#lading-day'));
    });
    _getLadingDate('year', $('#lading-year'), true);
}
function _getLadingDate(dateFormat, elemAppend, trigger) {
    if (dateFormat && elemAppend) {

        var trigger = typeof trigger === 'undefined' ? false : true;
        var params = {dateFormat: dateFormat};

        if (dateFormat === 'month') {
            var selectedYear = $('#lading-year').val();
            if (selectedYear == 0) {
                return $('#lading-month, #lading-day').val(0).attr('disabled', 'disabled');
            }
            params.get_month_by_year = selectedYear;
        }

        if (dateFormat === 'day') {
            var selectedYear = $('#lading-year').val(),
                    seletectedMonth = $('#lading-month').val();
            if (seletectedMonth == 0 || selectedYear == 0) {
                return $('#lading-day').val(0).attr('disabled', 'disabled');
            }
            params.get_day_by_year_and_month = seletectedMonth + '/' + selectedYear;
        }

        $.ajax({
            type: "POST",
            url: baseurl + '/backend/lading/get-lading-date',
            cache: false,
            dataType: 'json',
            data: params,
            success: function (respond) {
                if (respond.st == -1) {
                    return bootbox.alert('' + respond.msg + '');
                }
                if (respond.error == 1) {
                    return bootbox.alert('<b>' + respond.message + '</b>');
                }
                elemAppend.html('<option value="0">=== Tất cả ===</option>');
                var result = $.parseJSON(respond.result);
                if (result) {
                    $.each(result, function (k, v) {
                        elemAppend.append('<option value="' + v['lading_date'] + '">' + v['lading_date'] + '</option>');
                    });
                    elemAppend.removeAttr('disabled');
                    if (trigger) {
                        if (isLadingFilter && ladingYear != 0 && dateFormat === 'year') {
                            $('#lading-year').val(ladingYear);
                            _getLadingDate('month', $('#lading-month'), true);
                            $('#lading-month').removeAttr('disabled');
                        }
                        if (isLadingFilter && ladingMonth != 0 && dateFormat === 'month') {
                            $('#lading-month').val(ladingMonth);
                            _getLadingDate('day', $('#lading-day'), true);
                            $('#lading-day').removeAttr('disabled');
                        }
                        if (isLadingFilter && ladingDay != 0 && dateFormat === 'day') {
                            $('#lading-day').val(ladingDay);
                        }
                    }
                }
            }
        });
    }
}
