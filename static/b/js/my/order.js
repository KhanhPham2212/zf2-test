var Order = {
    index: function () {
        $(document).ready(function () {
            var arrResponsiveTableWidth = ['5', '17', '15', '13', '13', '8', '12', '9', '8'];
            $(window).width() <= '800' ? responsiveTable([], $('.responsiveTable'), true) : responsiveTable(arrResponsiveTableWidth, $('.responsiveTable'), true);
            $(window).on('resize', function () {
                $(this).width() <= '800' ? responsiveTable([], $('.responsiveTable'), true) : responsiveTable(arrResponsiveTableWidth, $('.responsiveTable'), true);
            });

            $('#btnToggleFilterOrder').click(function () {
                $('div#frmFilterOrder').slideToggle();
            });

            //multiple order status search
            $('#paymentStatus').change(function () {
                var strPaymentStatus = '',
                        arrPaymentStatus = $(this).val();
                if (arrPaymentStatus) {
                    $.each(arrPaymentStatus, function (k, v) {
                        strPaymentStatus += v >= 0 ? v + ',' : '';
                    });
                    strPaymentStatus = strPaymentStatus.slice(0, -1);
                }
                $("input[name*='paymentStatus']").val(strPaymentStatus);
            });

            $('.viewNote').click(function () {
                var orderID = $(this).attr('orderID');
                if ($(this).hasClass('fa fa-plus-square-o')) {
                    $(this).removeClass('fa fa-plus-square-o').addClass('fa fa-minus-square-o');
                    $(this).parents('tr').siblings('.note-element-' + orderID).show();
                } else {
                    $(this).removeClass('fa fa-minus-square-o').addClass('fa fa-plus-square-o');
                    $(this).parents('tr').siblings('.note-element-' + orderID).hide();
                }
            });


            var orderFilterElem = $('.orderFilter');
            var orderItemFilterElem = $('.orderItemFilter');

            //is order item filter
            orderItemFilterElem.on('keyup change', function () {
                if (isStillFilter(orderItemFilterElem)) {
                    orderFilterElem.attr('disabled', true);
                    $('#isOrderFilter').attr('disabled', true);

                    $('#isOrderItemFilter').removeAttr('disabled');
                } else {
                    orderFilterElem.removeAttr('disabled');

                    $('#isOrderFilter').removeAttr('disabled');
                    $('#isOrderItemFilter').removeAttr('disabled');
                }
            });

            //is order filter
            orderFilterElem.on('keyup change', function () {
                if (isStillFilter(orderFilterElem)) {
                    orderItemFilterElem.attr('disabled', true);
                    $('#isOrderItemFilter').attr('disabled', true);

                    $('#isOrderFilter').removeAttr('disabled');
                } else {
                    orderItemFilterElem.removeAttr('disabled');

                    $('#isOrderFilter').removeAttr('disabled');
                    $('#isOrderItemFilter').removeAttr('disabled');
                }
            });

            $('#btnExportExcel').click(function () {
                var params = $('#frm').serialize();
                if (params) {
                    window.location = baseurl + '/backend/order/export-order-excel/?' + params;
                }
            });
        });
    },
    view: function () {
        $(document).ready(function () {
            if (isUnknowFee === 1) {
                bootbox.dialog({
                    message: '<b>Hiện tại đơn hàng này chưa đầy đủ chi phí, vui lòng vào <ins>chỉnh sửa đơn hàng</ins> để bổ sung chi phí trước khi kiểm duyệt.</b>',
                    closeButton: false,
                    title: "THÔNG BÁO",
                    buttons: {
                        danger: {
                            label: '<span id="btnCancel">Thoát</span>',
                            className: "btn-danger",
                            callback: function () {
                            }
                        },
                        main: {
                            label: '<span id="btnConfirm">Chỉnh sửa đơn hàng</span>',
                            className: "btn-primary",
                            callback: function () {
                                $('#btnConfirm').html('<i class="fa fa-refresh fa-spin"></i> Đang xử lý...').parent().prop('disabled', true);
                                window.location = baseurl + '/backend/order/edit/id/' + orderID;
                                return false;
                            }
                        }
                    }
                });
            }

            $('#btnToggleOrderFunction').click(function () {
                $('#orderFunctionBody').toggle();
            });
            $('#orderFunction').scrollToFixed({
                marginTop: 60,
                preFixed: function () {
                    if ($('#orderFunctionBody:visible').length > 0) {
                        $('#orderFunctionBody').toggle();
                    }
                },
                postFixed: function () {
                    if ($('#orderFunctionBody:hidden').length > 0) {
                        $('#orderFunctionBody').toggle();
                    }
                }
            });
            initEditor();
            $('.orderStatusCheckbox').click(function () {
                $('#btnChangeMultiItemStatus').hide();
                if ($('.orderStatusCheckbox:checked').size() > 0) {
                    $('#btnChangeMultiItemStatus').show().css('display', 'inline');
                }
            });

            //select all items checkbox event
            $('#selectAllItem').click(function () {
                $('.orderStatusCheckbox').removeAttr('checked');
                $('#btnChangeMultiItemStatus').hide();
                if ($('#selectAllItem:checked').size() > 0) {
                    $('.orderStatusCheckbox').not('.itemCanceled').trigger('click');
                }
            });

            //multiple items event
            $('#btnChangeMultiItemStatus').change(function () {
                var $this = $(this),
                        orderID = parseInt($this.attr('order-id')),
                        userID = parseInt($this.attr('user-id')),
                        currentPaymentStatus = parseInt($this.attr('current-payment-status')),
                        actionID = parseInt($this.val());
                switch (actionID) {
                    case 1: //đổi trạng thái sản phẩm
                        var isError = 0;
                        var strItemID = '';
                        var strItemIDError = '';
                        var isReUpdateOrderTotal = 0;
                        var isUnPaid = 0;
                        $('.orderStatusCheckbox:checked').each(function (k, v) {
                            var orderItemID = parseInt($(v).attr('item-id'));
                            var currentStatus = parseInt($(v).attr('item-status'));
                            strItemID += orderItemID + ',';
                            if (currentStatus === 6) {
                                strItemIDError += strItemIDError + ',';
                                $this.val(0);
                                isError = 1;
                            }
                            if (currentStatus < 3) {
                                isUnPaid = 1;
                            }
                            if (currentStatus === 0) {
                                isReUpdateOrderTotal = 1;
                            }

                        });
                        strItemID = strItemID.slice(0, -1);

                        if (isError) {
                            $this.val(0);
                            return bootbox.alert('<b>Mã sản phẩn <b style="color:red;">' + strItemIDError + '</b> hiện tại đã về, bạn không thể thay đổi trạng thái sản phẩm này nữa.</b>');
                        }

                        var html = '<div class="alert alert-danger" id="prepaidFeeEmpty" style="display:none;"><strong>Lỗi!</strong><br />Vui lòng nhập số tiền khách đã thanh toán.</div>'
                                + '<div class="alert alert-danger" id="statusListEmpty" style="display:none;"><strong>Lỗi!</strong><br />Vui lòng chọn trạng thái muốn chuyển</div>'
                                + '<select id="statusList" class="form-control">'
                                + strStatusOption
                                + '</select><br />'
                                + '<div id="prepaidFee" style="display:none;">'
                                + '<label><b>Số tiền khách đã thanh toán trước</b></label>'
                                + '<input type="text" class="form-control" name="prepaidFee" placeholder="Vui lòng nhập số tiền khách đã thanh toán trước" />'
                                + '</div>';
                        bootbox.dialog({
                            message: html,
                            closeButton: false,
                            title: "Chọn trạng thái muốn chuyển",
                            buttons: {
                                danger: {
                                    label: '<span id="btnCancel">Hủy</span>',
                                    className: "btn-danger",
                                    callback: function () {
                                        $this.val(0);
                                    }
                                },
                                main: {
                                    label: '<span id="btnConfirm">Xác nhận</span>',
                                    className: "btn-primary",
                                    callback: function () {
                                        var status = $('#statusList').val();
                                        var prepaidFee = 0;
                                        if (status === '') {
                                            $('#statusListEmpty').show();
                                            return false;
                                        }
                                        if (isUnPaid === 1 && status > 3) {
                                            $this.val(0);
                                            return bootbox.alert('<b>Vui lòng chuyển trạng thái sản phẩm sang <ins>Đã Thanh Toán</ins> trước.</b>');
                                        }
                                        if ($('#prepaidFee input').is(':visible')) {
                                            prepaidFee = parseFloat($.trim($('#prepaidFee input').val()));
                                            prepaidFee = isNaN(prepaidFee) ? 0 : prepaidFee;
                                        }
                                        if (prepaidFee == 0 && $('#prepaidFee input').is(':visible')) {
                                            $('#prepaidFeeEmpty').show();
                                            return false;
                                        }
                                        $('#statusListEmpty, #prepaidFeeEmpty').hide();
                                        if (status >= 0 && strItemID) {
                                            $('#btnConfirm').html('<i class="fa fa-refresh fa-spin"></i> Đang xử lý...').parent().prop('disabled', true);
                                            if (status == 0) { //Đã bị hủy
                                                $('#btnCancel').parent().trigger('click');
                                                cancelTransReasonModal(status, strItemID);
                                            } else if (status >= 1 && status <= 4) { //đã thanh toán tới đã mua hàng
                                                updateStatus(status, strItemID, isReUpdateOrderTotal, '', '', prepaidFee);
                                            } else if (status == 5) { //đã có tracking - chờ hàng về 
                                                $('#btnCancel').parent().trigger('click');
                                                predictDateModal(status, strItemID, isReUpdateOrderTotal);
                                            } else if (status == 6) { //hàng đã về
                                                updateStatus(status, strItemID, isReUpdateOrderTotal);
                                            }
                                        }
                                        return false;
                                    }
                                }
                            }
                        });
                        break;
                    case 2:
                        var itemID = '';
                        var error = false;
                        var itemStatus = 0
                        $('.orderStatusCheckbox:checked').each(function (k, v) {
                            itemStatus = parseInt($(v).attr('item-status'));
                            if (!itemStatus || isNaN(itemStatus) || itemStatus < 5) {
                                return error = true;
                            }
                            itemID += $(v).attr('item-id') + ',';
                        });
                        if (error === true) {
                            $('#btnChangeMultiItemStatus').val(0);
                            return bootbox.alert('<b>Chỉ những sản phẩm đã có tracking mới có thể cập nhật số lượng hàng về.</b>');
                        }
                        itemID = itemID.slice(0, -1);
                        if (!itemID || !orderID || isNaN(orderID)) {
                            return bootbox.alert('Hiện tại không thể cập nhật số lượng hàng về.');
                        }
                        var data = {orderID: orderID, itemID: itemID, userID: userID};
                        updateArrivedItem(data);
                        break;
                    case 3:
                        if (!orderID || isNaN(orderID)) {
                            return bootbox.alert('<b>Không thể tạo mã vận đơn, vui lòng kiểm tra lại.</b>');
                        }
                        Lading.add(orderID);
                        break;
                }

                //show input nhập số tiền khách đã thanh toán trước khi trạng thái muốn chuyển là đã thanh toán - đang mua hàng.
                $('#statusList').on('change', function () {
                    var status = $(this).val();
                    var prepaidFee = parseFloat(currentPrepaidFee);
                    $('#prepaidFee').hide();
                    if (status >= 3 && prepaidFee == 0) {
                        $('#prepaidFee').show();
                    }
                });
            });

            //check status don hang, neu status la da chuyen tien va chua enter so tien vao thi show popup nhac nho
            if (currentPrepaidFee <= 0 && paymentStatus >= 3) {
                var html = '<div class="alert alert-danger" id="prepaidFeeError" style="display:none;"><strong>Lỗi!</strong><br />Số tiền nhập vào không đúng</div>'
                        + '<span style="margin-left:10px;font-weight:600;">Vui lòng nhập số tiền khách hàng đã thanh toán</span> <br />'
                        + '<input class="form-control" id="prepaidFee" type="text" value="" name="prepaidFee" placeholder="Vui lòng nhập số tiền" autocomplete="off" />';
                bootbox.dialog({
                    message: html,
                    closeButton: false,
                    title: "Nhập số tiền khách hàng trả trước",
                    buttons: {
                        main: {
                            label: "Xác nhận",
                            className: "btn-primary",
                            callback: function () {
                                var prepaidFee = $('#prepaidFee').val();

                                if (prepaidFee <= 0 || isNaN(prepaidFee)) {
                                    $('#prepaidFeeError').show();
                                    $('#prepaidFee').addClass('error');
                                    return false;
                                } else {
                                    $('#prepaidFeeError').hide();
                                    $('#prepaidFee').removeClass('error');
                                    $.ajax({
                                        type: "POST",
                                        url: baseurl + '/backend/order/update-order-prepaid-fee',
                                        cache: false,
                                        dataType: 'json',
                                        data: {
                                            orderID: orderID,
                                            prepaidFee: prepaidFee,
                                        },
                                        success: function (result) {
                                            if (result.st == -1) {
                                                return bootbox.alert('' + result.msg + '');
                                            }
                                            if (result.error == 1) {
                                                bootbox.alert(result.message);
                                            } else {
                                                bootbox.alert(result.message, function () {
                                                    window.location = window.location.href;
                                                });
                                            }
                                        }
                                    });
                                }
                            }
                        }
                    }
                });
            }

            /**
             * Them chiet khau van chuyen
             */
            $('#btnExtraShippingDiscount').click(function () {
                //var orderID = orderID;
                var html = '<div class="alert alert-danger" id="extraPriceError" style="display:none;"><strong>Lỗi!</strong><br />Số tiền nhập vào không đúng</div>'
                        + '<span style="margin-left:10px;font-weight:600;">Vui lòng nhập số tiền. Ví dụ: 10000</span>'
                        + '<input class="form-control" id="extraPrice" type="text" value="" name="extraPrice" placeholder="Vui lòng nhập số tiền" autocomplete="off">';
                bootbox.dialog({
                    message: html,
                    title: "Thêm chiết khấu vận chuyển",
                    buttons: {
                        danger: {
                            label: "Thoát!",
                            className: "btn-danger",
                            callback: function () {
                            }
                        },
                        main: {
                            label: "Xác nhận",
                            className: "btn-primary",
                            callback: function () {
                                var extraPrice = $('#extraPrice').val();
                                if (isNaN(extraPrice) || extraPrice <= 0) {
                                    $('#extraPriceError').show();
                                    $('#extraPrice').addClass('error');
                                    return false;
                                } else {
                                    $('#extraPriceError').hide();
                                    $('#extraPrice').removeClass('error');
                                    console.log(orderID);
                                    updateExtraShippingReason(orderID, extraPrice);
                                }
                            }
                        }
                    }
                });
            });

            /**
             * Change Item Status
             */
            $('.status').mouseenter(function () {
                currentStatus = $(this).val();
            });
            $('.status').change(function () {
                $this = $(this);
                var status = parseInt($this.val());
                var currentStatus = parseInt($(this).attr("current-status"));
                var prepaidFee = parseFloat(currentPrepaidFee);

                if (prepaidFee == 0 && status > 3) {
                    $this.val(currentStatus);
                    return bootbox.alert('<b>Vui lòng đổi trạng thái đơn hàng sang <i>"Đã thanh toán - Đang mua hàng"</i> trước để nhập phí khách hàng đã thanh toán.<b>');
                }

                var orderItemID = $this.attr('id');
                var txtStatus = $.trim($('option:selected', this).text());
                $this.attr('current-status', status);

                var arrStatus = [];
                $('.status').each(function (k, v) {
                    arrStatus.push($(v).attr('current-status'));
                });
                var maxStatus = Math.max.apply(Math, arrStatus);
                var minStatus = Math.min.apply(Math, arrStatus);

                var isReUpdateOrderTotal = currentStatus === 0 ? 1 : 0;

                if (status >= 0 && orderItemID) {
                    if ((status < currentStatus) && currentStatus == 6) {
                        $(this).val(currentStatus);
                        return bootbox.alert('<b>Món hàng này đã về rồi. Không thể thay đổi trạng thái món hàng</b>');
                    }
                    bootbox.confirm('<b>Bạn có muốn chuyển trạng thái món hàng thành "' + txtStatus + '" ???</b><br/><br/><ins>Lưu ý</ins> : khi đã chắc chắn chuyển trạng thái đơn hàng thì bạn không thể quay lại trạng thái cũ hay thấp hơn.', function (result) {
                        if (result === true) {
                            if (minStatus === maxStatus && minStatus === 3 && maxStatus === 3) {
                                $('.bootbox-close-button').trigger('click');
                                var html = '<div class="alert alert-danger" id="prepaidFeeError" style="display:none;"><strong>Lỗi!</strong><br />Số tiền nhập vào không đúng</div>'
                                        + '<input class="form-control" id="prepaidFee" type="text" value="" name="extraPrice" placeholder="Chỉ nhập số nguyên, ví dụ: $1,235 nhập là 1234" autocomplete="off">';
                                bootbox.dialog({
                                    message: html,
                                    title: "Nhập số tiền khách đã thanh toán trước. ",
                                    buttons: {
                                        danger: {
                                            label: "Thoát!",
                                            className: "btn-danger",
                                            callback: function () {
                                                $this.val(currentStatus);
                                            }
                                        },
                                        main: {
                                            label: "Xác nhận",
                                            className: "btn-primary",
                                            callback: function () {
                                                var prepaidFee = $('#prepaidFee').val();
                                                if (isNaN(prepaidFee) || prepaidFee <= 0) {
                                                    $('#prepaidFeeError').show();
                                                    $('#prepaidFee').addClass('error');
                                                    return false;
                                                } else {
                                                    $('#prepaidFeeError').hide();
                                                    $('#prepaidFee').removeClass('error');
                                                    updateStatus(status, orderItemID, isReUpdateOrderTotal, '', '', prepaidFee);
                                                    return false;
                                                }
                                            }
                                        }
                                    }
                                });
                            } else {
                                if (status === 0) { //Đã bị hủy
                                    cancelTransReasonModal(status, orderItemID);
                                } else if (status >= 1 && status <= 4) { //đã thanh toán - đang mua hàng
                                    updateStatus(status, orderItemID, isReUpdateOrderTotal);
                                } else if (status === 5) { //đã có tracking - chờ hàng về
                                    predictDateModal(status, orderItemID, isReUpdateOrderTotal);
                                } else if (status === 6) { //hàng đã về
                                    updateStatus(status, orderItemID, isReUpdateOrderTotal);
                                }
                            }
                        }
                        $this.val(currentStatus);
                    });
                }
            });

            /**
             * Update Prepaid Fee
             */
            $('#prepaid-fee-order').blur(function () {
                var $this = $(this);
                var prepaidFee = $this.val();

                //only update when value is changed
                if (prepaidFee == currentPrepaidFee) {
                    return false;
                }
                if (prepaidFee >= 0 && $.isNumeric(prepaidFee)) {
                    $.ajax({
                        type: "POST",
                        url: baseurl + '/backend/order/update-order-prepaid-fee',
                        cache: false,
                        dataType: 'json',
                        data: {
                            orderID: orderID,
                            prepaidFee: prepaidFee,
                            type: 'prepaid-fee'
                        },
                        success: function (result) {
                            if (result.st == -1) {
                                return bootbox.alert('' + result.msg + '');
                            }
                            if (result.error == 1) {
                                bootbox.alert(result.message, function () {
                                    $this.val(currentPrepaidFee);
                                });
                            } else {
                                bootbox.alert(result.message, function () {
                                    window.location = window.location;
                                });
                            }
                        }
                    });
                } else {
                    bootbox.alert('Số tiền nhập vào phải là số lớn hơn hoặc bằng 0');
                    $this.val(currentPrepaidFee);
                }
            });
            $('#prepaid-fee-order').keypress(function (e) {
                if (e.which === 13) {
                    $('#prepaid-fee-order').trigger('blur');
                }
            });

            /**
             * Update prepaid percent
             */
            $('#prepaid-percent-order').change(function () {
                var $this = $(this);
                var type = $('#prepaid-percent-order option:selected').data('type');
                $('input[name="prepaidType"]').val(type);
                var prepaidPercent = $(this).val();
                $.ajax({
                    type: "POST",
                    url: baseurl + '/backend/order/update-order-prepaid-percent',
                    cache: false,
                    dataType: 'json',
                    data: {
                        orderID: orderID,
                        prepaidPercent: prepaidPercent,
                        prepaidType: type,
                    },
                    success: function (result) {
                        if (result.st == -1) {
                            return bootbox.alert('' + result.msg + '');
                        }
                        if (result.error == 1) {
                            bootbox.alert(result.message, function () {
                                $this.val(currentPrepaidPercent);
                            });
                        } else {
                            bootbox.alert(result.message, function () {
                                window.location = window.location.href;
                            });
                        }
                    }
                });
            });

            /**
             * update item note
             */
            $('.btnUpdateOrderItemNote').click(function () {
                var btn = $(this);
                var orderItemID = $(this).parents('tr').attr('item-id');
                var note = $.trim($(this).parents('tr').find('input.txtNote').val());
                if (orderItemID && note) {
                    $.ajax({
                        type: "POST",
                        url: baseurl + '/backend/order/update-order-item',
                        cache: false,
                        dataType: 'json',
                        beforeSend: function () {
                            btn.html('<i class="fa fa-refresh fa-spin"></i> Đang xử lý...').attr('disabled', 'disabled');
                        },
                        data: {
                            orderItemID: orderItemID,
                            note: note
                        },
                        success: function (result) {
                            if (result.st == -1) {
                                return bootbox.alert('' + result.msg + '');
                            }
                            btn.text('Cập nhật').removeAttr('disabled');
                            if (result.error == 1) {
                                return bootbox.alert(result.message);
                            } else {
                                bootbox.alert(result.message, function () {
                                    window.location.href = window.location.href;
                                });
                            }
                        }
                    });
                }
            });

            $('#vatPercent').keypress(function (e) {
                if (e.which === 13) {
                    $(this).attr('disabled', 'disabled');
                    var vatPercent = parseInt($(this).val());
                    if (typeof vatPercent !== 'undefined' || typeof vatPercent !== 'null') {
                        bootbox.confirm('Bạn có muốn cộng thêm <b style="color:red;">' + vatPercent + '%</b> phí xuất hóa đơn cho đơn hàng này không ?', function (result) {
                            if (result) {
                                $.ajax({
                                    url: baseurl + '/backend/order/update-order-vat-fee',
                                    type: "POST",
                                    async: true,
                                    cache: false,
                                    dataType: 'json',
                                    beforeSend: function () {
                                        $('.modal button.btn-primary').html('<i class="fa fa-refresh fa-spin"></i> Đang xử lý...').attr('disabled', 'disabled');
                                    },
                                    data: {
                                        orderID: orderID,
                                        vatPercent: vatPercent,
                                    },
                                    success: function (result) {
                                        if (result.st == -1) {
                                            return bootbox.alert('' + result.msg + '');
                                        }
                                        $('#vatPercent').removeAttr('disabled');
                                        $('.modal button.close').trigger('click');
                                        if (result.success === 1) {
                                            bootbox.alert(result.message, function () {
                                                window.location = window.location.href;
                                            });
                                        } else {
                                            bootbox.alert('<b>' + result.message + '</b>');
                                        }
                                    }
                                });
                                return false;
                            }
                            $('#vatPercent').removeAttr('disabled');
                        });
                    }
                }
            });


            /**
             * Edit Shipping Address
             */
            $('#editShippingAddress').click(function () {

                var cityOptions = '';
                var districtOptions = '';
                var wardOptions = '';
                var selected = '';

                cityList = $.parseJSON(arrCityList);
                districtList = $.parseJSON(arrDistrictList);
                wardList = $.parseJSON(arrWardList);


                $.each(cityList, function (k, v) {
                    if (v.city_id == cityID) {
                        selected = 'selected="selected"';
                    } else {
                        selected = '';
                    }
                    cityOptions += '<option value="' + v.city_id + '" ' + selected + ' >' + v.city_name + '</option>';
                });

                $.each(districtList, function (k, v) {
                    if (v.district_id == districtID) {
                        selected = 'selected="selected"';
                    } else {
                        selected = '';
                    }

                    districtOptions += '<option value="' + v.district_id + '" ' + selected + '>' + v.district_name + '</option>';
                });

                $.each(wardList, function (k, v) {
                    if (v.ward_id == wardID) {
                        selected = 'selected="selected"';
                    } else {
                        selected = '';
                    }

                    wardOptions += '<option value="' + v.ward_id + '" ' + selected + '>' + v.ward_name + '</option>';
                });


                var html = '<form role="form">'
                        + '<div class="form-group">'
                        + '<label for="address">Địa chỉ</label>'
                        + '<input type="text" class="form-control" id="address" placeholder="Chỉ nhập số nhà và tên đường" value="' + shippingAddress + '">'
                        + '<div id="addressError" style="color:red;display:none;">Xin vui lòng nhập địa chỉ.</div>'
                        + '</div>'

                        + '<div class="form-group">'
                        + '<label for="city">Tỉnh / Thành</label>'
                        + '<select class="form-control" id="city" style="margin-bottom:20px;">'
                        + '<option value="">-- Chọn Tỉnh / Thành --</option>'
                        + cityOptions
                        + '</select>'
                        + '<div id="cityError" style="color:red;display:none;">Xin vui lòng chọn tỉnh thành.</div>'
                        + '</div>'

                        + '<div class="form-group">'
                        + '<label for="district">Quận / Huyện</label>'
                        + '<select class="form-control" id="district" style="margin-bottom:20px;">'
                        + '<option value="">-- Chọn Quận / Huyện --</option>'
                        + districtOptions
                        + '</select>'
                        + '<div id="districtError" style="color:red;display:none;">Xin vui lòng chọn quận huyện.</div>'
                        + '</div>'

                        + '<div class="form-group">'
                        + '<label for="ward">Phường / Xã</label>'
                        + '<select class="form-control" id="ward" style="margin-bottom:20px;">'
                        + '<option value="">-- Chọn Phường / Xã --</option>'
                        + wardOptions
                        + '</select>'
                        + '<div id="wardError" style="color:red;display:none;">Xin vui lòng chọn phường xã.</div>'
                        + '</div>';



                bootbox.dialog({
                    className: 'frmEditShippingAddress',
                    message: html,
                    title: "Chỉnh sửa địa chỉ chuyển hàng",
                    buttons: {
                        danger: {
                            label: "Thoát",
                            className: "btn-danger",
                            callback: function () {
                            }
                        },
                        main: {
                            label: "Đồng ý",
                            className: "btn-primary",
                            callback: function () {
                                var address = $('#address').val();
                                var cityID = $('select#city').val();
                                var districtID = $('select#district').val();
                                var wardID = $('select#ward').val();
                                if (!address) {
                                    $('#addressError').show();
                                    return false;
                                }
                                if (!cityID) {
                                    $('#cityError').show();
                                    return false;
                                }
                                if (!districtID) {
                                    $('#districtError').show();
                                    return false;
                                }
                                if (!wardID) {
                                    $('#wardError').show();
                                    return false;
                                }
                                $('#addressError, #cityError, #districtError, #wardError').hide();

                                //call ajax update
                                $.ajax({
                                    url: baseurl + '/backend/order/update-order-address',
                                    type: "POST",
                                    async: true,
                                    cache: false,
                                    dataType: 'json',
                                    data: {
                                        orderID: orderID,
                                        address: address,
                                        cityID: cityID,
                                        districtID: districtID,
                                        wardID: wardID,
                                    },
                                    success: function (result) {
                                        if (result.st == -1) {
                                            return bootbox.alert('' + result.msg + '');
                                        }
                                        if (result.success === 1) {
                                            bootbox.alert(result.message, function () {
                                                window.location = window.location;
                                            });
                                        } else {
                                            bootbox.alert('<b>' + result.message + '</b>');
                                        }
                                    }
                                });
                            }
                        }
                    }
                });

                $('.frmEditShippingAddress').on('shown.bs.modal', function (e) {
                    $('#city').change(function () {
                        var cityID = $(this).val();
                        $('#district').attr('disabled', 'disabled').html('<option selected="selected" value="">Vui lòng chọn Quận / Huyện</option>');
                        $('#ward').attr('disabled', 'disabled').html('<option selected="selected" value="">Vui lòng chọn Phường / Xã</option>');
                        if (cityID) {
                            $.ajax({
                                url: baseurl + '/backend/district/get-list',
                                type: "POST",
                                async: true,
                                cache: false,
                                dataType: 'json',
                                data: {cityID: cityID},
                                success: function (result) {
                                    if (result.st == -1) {
                                        return bootbox.alert('' + result.msg + '');
                                    }
                                    if (result) {
                                        $('#district').removeAttr('disabled');
                                        $.each(result, function (k, v) {
                                            $('#district').append('<option value="' + v.district_id + '">' + v.district_name + '</option>');
                                        });
                                    } else {
                                        bootbox.alert('Không thể lấy dữ liệu Quận / Huyện');
                                    }
                                }
                            });
                        }
                    });

                    $('#district').change(function () {
                        var districtID = $(this).val();
                        $('#ward').attr('disabled', 'disabled').html('<option selected="selected" value="">Vui lòng chọn Phường / Xã</option>');
                        if (districtID) {
                            $.ajax({
                                url: baseurl + '/backend/ward/get-list',
                                type: "POST",
                                async: true,
                                cache: false,
                                dataType: 'json',
                                data: {districtID: districtID},
                                success: function (result) {
                                    if (result.st == -1) {
                                        return bootbox.alert('' + result.msg + '');
                                    }
                                    if (result) {
                                        $('#ward').removeAttr('disabled');
                                        $.each(result, function (k, v) {
                                            $('#ward').append('<option value="' + v.ward_id + '">' + v.ward_name + '</option>');
                                        });
                                    } else {
                                        bootbox.alert('Không thể lấy dữ liệu Phường / Xã');
                                    }
                                }
                            });
                        }
                    });
                });
            });

            return false;
        });

        $('input.trackingNumber').blur(function () {
            var trackingNumber = $.trim($(this).val());
            var tmpID = $(this).attr('id');
            var orderItemID = tmpID.split('_');
            orderItemID = orderItemID[1];
            if (!trackingNumber) {
                bootbox.alert('Vui lòng nhập số tracking');
                return false;
            }
            if (!orderItemID) {
                bootbox.alert('không thể cập nhật số tracking, xin vui lòng thử lại');
                return false;
            }
            var currentTracking = $(this).data('value');
            if (currentTracking != trackingNumber) {
                $.ajax({
                    url: baseurl + '/backend/order/update-order-item',
                    type: "POST",
                    cache: false,
                    dataType: 'json',
                    data: {
                        orderItemID: orderItemID,
                        trackingNumber: trackingNumber
                    },
                    success: function (result) {
                        bootbox.alert(result.message);
                    }
                });
            }
            return false;
        });

        $('input.predictDate').blur(function () {
            var predictDate = $.trim($(this).val());

            var isValid = validatePredictDate(predictDate);
            if (isValid !== true) {
                bootbox.alert(isValid);
                return false;
            }

            var tmpID = $(this).attr('id');
            var orderItemID = tmpID.split('_');
            orderItemID = orderItemID[1];

            if (!orderItemID) {
                bootbox.alert('không thể cập nhật số tracking, xin vui lòng thử lại');
                return false;
            }

            var currentPredictDate = $(this).data('value');

            if (currentPredictDate != predictDate) {
                $.ajax({
                    url: baseurl + '/backend/order/update-order-item',
                    type: "POST",
                    cache: false,
                    dataType: 'json',
                    data: {
                        orderItemID: orderItemID,
                        predictDate: predictDate
                    },
                    success: function (result) {
                        bootbox.alert(result.message);
                    }
                });
            }

            return false;
        });

        $('input.trackingNumber, input.predictDate').keypress(function (e) {
            if (e.which === 13) {
                $(this).trigger('blur');
            }
        });

        /**
         * Discount Code
         */
        $('#discountCode').mouseenter(function () {
            $(this).inputmask({mask: '*****-*****-*****-*****'});
        }).mouseleave(function () {
            if ($(this).val() === '_____-_____-_____-_____') {
                $(this).val('');
            }
        });

        $('button#btnAddDiscountCode').click(function () {
            var discountCode = $('#discountCode').val();
            if (discountCode) {
                $.ajax({
                    url: baseurl + '/backend/order/discount-code',
                    type: "POST",
                    cache: false,
                    dataType: 'json',
                    data: {
                        orderID: orderID,
                        discountCode: discountCode
                    },
                    success: function (result) {
                        if (result.st == -1) {
                            return bootbox.alert('' + result.msg + '');
                        }
                        if (result.error == 0) {
                            bootbox.alert(result.message, function () {
                                window.location.href = window.location.href;
                            });
                        } else {
                            bootbox.alert(result.message);
                        }
                    }
                });
            } else {
                bootbox.alert('Vui lòng nhập mã khuyến mại');
            }
        });
        /**
         * Quantity of Product 
         */
        $('#quantityProduct').mouseenter(function () {
            $(this).inputmask({mask: '***'});
        }).mouseleave(function () {
            if ($(this).val() === '___') {
                $(this).val('');
            }
        });

        $('.quantityItem').on('mouseenter', function () {
            elem = $(this);
            currentWarehouseQuantity = parseInt($(this).attr('current'))
        }).on('input', function () {
            currentWarehouseQuantity = parseInt($(this).attr('current'))
            $(this).removeClass('error');
            var quantity = parseInt($(this).val());
            if (quantity !== currentWarehouseQuantity) {
                $(this).addClass('error');
            }
        }).on('keypress', function (e) {
            if (e.which === 13) {
                var total = parseInt($(this).attr('total'));
                var quantity = parseInt($(this).val());

                if (quantity > total) {
                    return bootbox.alert('Số lượng đã về không được lớn hơn số lượng đặt mua.');
                }
                if (isNaN(quantity) || quantity === currentWarehouseQuantity) {
                    $(this).removeClass('error');
                    $(this).val(currentWarehouseQuantity);
                    return false;
                }

                var orderItemID = parseInt($(this).parent().prev().find("select").attr('id'));
                bootbox.confirm('Bạn có muốn sửa số lượng hàng về là <b style="color:red;">' + quantity + '</b> không ?', function (result) {
                    if (result) {
                        $.ajax({
                            url: baseurl + '/backend/order/update-item-in-warehouse',
                            type: "POST",
                            async: true,
                            cache: false,
                            dataType: 'json',
                            data: {orderItemID: orderItemID, quantity: quantity},
                            success: function (result) {
                                if (result.st == -1) {
                                    return bootbox.alert('' + result.msg + '');
                                }
                                elem.removeClass('error');
                                elem.attr('current', quantity);
                                if (result.error) {
                                    return bootbox.alert('<b>' + result.message + '</b>');
                                }
                            }
                        });
                    }
                });
            }
        }).on('mouseleave', function () {
            var quantity = parseInt($(this).val());
            if (isNaN(quantity) || quantity === currentWarehouseQuantity) {
                $(this).removeClass('error');
                $(this).val(currentWarehouseQuantity);
            }
        });

        $('#vatPercent').keypress(function (e) {
            if (e.which === 13) {
                $(this).attr('disabled', 'disabled');
                var vatPercent = parseInt($(this).val());
                if (typeof vatPercent !== 'undefined' || typeof vatPercent !== 'null') {
                    bootbox.confirm('Bạn có muốn cộng thêm <b style="color:red;">' + vatPercent + '%</b> phí xuất hóa đơn cho đơn hàng này không ?', function (result) {
                        if (result) {
                            $.ajax({
                                url: baseurl + '/backend/order/update-order-vat-fee',
                                type: "POST",
                                async: true,
                                cache: false,
                                dataType: 'json',
                                beforeSend: function () {
                                    $('.modal button.btn-primary').html('<i class="fa fa-refresh fa-spin"></i> Đang xử lý...').attr('disabled', 'disabled');
                                },
                                data: {orderID: orderID, vatPercent: vatPercent},
                                success: function (result) {
                                    if (result.st == -1) {
                                        return bootbox.alert('' + result.msg + '');
                                    }
                                    $('#vatPercent').removeAttr('disabled');
                                    $('.modal button.close').trigger('click');
                                    if (result.success === 1) {
                                        bootbox.alert(result.message, function () {
                                            window.location = window.location.href;
                                        });
                                    } else {
                                        bootbox.alert('<b>' + result.message + '</b>');
                                    }
                                }
                            });
                            return false;
                        }
                        $('#vatPercent').removeAttr('disabled');
                    });
                }
            }
        });
        /**
         * Trang thai hoa don
         * Drop Invoice
         */
        $('#btnDropInvoice').click(function () {
            var isDropInvoice = 1;

            $.ajax({
                url: baseurl + '/backend/order/update-order-drop-invoice',
                type: "POST",
                cache: false,
                dataType: 'json',
                data: {orderID: orderID, isDropInvoice: isDropInvoice},
                success: function (result) {
                    if (result.st == -1) {
                        return bootbox.alert('' + result.msg + '');
                    }
                    if (result.error == 0) {
                        bootbox.alert(result.message, function () {
                            window.location.href = window.location.href;
                        });
                    } else {
                        bootbox.alert(result.message);
                    }
                }
            });
        });

        /**
         * Phuong thuc thanh toan
         * Payment method
         */
        $('select#paymentMethod').change(function () {
            var paymentMethod = $(this).val();
            bootbox.confirm('<b>Bạn có muốn thay đổi phương thức thanh toán không? </b>', function (result) {
                if (result) {
                    $.ajax({
                        url: baseurl + '/backend/order/update-order-payment-method',
                        type: "POST",
                        cache: false,
                        dataType: 'json',
                        data: {orderID: orderID, paymentMethod: paymentMethod},
                        success: function (result) {
                            if (result.st == -1) {
                                return bootbox.alert('' + result.msg + '');
                            }
                            if (result.error == 0) {
                                bootbox.alert(result.message, function () {
                                    window.location = window.location.href;
                                });
                            } else {
                                bootbox.alert('<b>' + result.message + '</b>');
                            }
                        }
                    });
                }
            });
        });

        /**
         * Giao hang truoc
         */
        $('select#deliveryBefore').change(function () {
            var deliveryBefore = $(this).val();

            $.ajax({
                url: baseurl + '/backend/order/update-order-delivery-before',
                type: "POST",
                cache: false,
                dataType: 'json',
                data: {orderID: orderID, deliveryBefore: deliveryBefore},
                success: function (result) {
                    if (result.st == -1) {
                        return bootbox.alert('' + result.msg + '');
                    }
                    if (result.error == 0) {
                        bootbox.alert(result.message, function () {
                            window.location.href = window.location.href;
                        });
                    } else {
                        bootbox.alert(result.message);
                    }
                }
            });
        });

    },
    edit: function () {
        $(document).ready(function () {
            $('#addItem').click(function () {
                var orderID = $(this).attr('order-id');
                if (!orderID || orderID === '') {
                    return false;
                }
                $.ajax({
                    type: "GET",
                    url: baseurl + '/backend/order/add-order-item/id/' + orderID,
                    cache: false,
                    dataType: 'json',
                    data: {},
                    success: function (result) {
                        if (result.st == -1) {
                            return bootbox.alert('' + result.msg + '');
                        }
                        if (result.modal_content) {
                            var modalContent = result.modal_content;
                            bootbox.dialog({
                                title: "Thêm sản phẩm vào đơn hàng.",
                                message: modalContent,
                                buttons: {
                                    success: {
                                        label: "Hoàn tất",
                                        className: "btn-success",
                                        callback: function () {
                                            $('form#frmAddItem').submit();
                                            return false;
                                        }
                                    }
                                }
                            });
                        }
                    }
                });
            });
            $('#btn-update-order').click(function () {
                var isError = false;
                $('#frmUpdateItems input:visible, #frmUpdateItems textarea').each(function (k, v) {
                    if (!$.trim($(v).val())) {
                        isError = true;
                        return false;
                    }
                });
                if (isError === true) {
                    bootbox.alert('<b>Vui lòng nhập đầy đủ tên sản phẩm, số lượng, trọng lượng, chi phi.</b>');
                    return false;
                }
                $(this).html('<i class="fa fa-refresh fa-spin"></i> Đang xử lý...').attr('disabled', 'disabled');
                $('#frmUpdateItems').submit();
            });
        });
    }
};

function initEditor() {
    tinymce.init({
        selector: 'textarea.note',
        height: 300,
        forced_root_block: false,
        valid_elements: '*[*]',
        extended_valid_elements: "*[*]",
        entity_encoding: "raw",
        fix_list_elements: true,
        plugins: ["autolink link textcolor"],
        toolbar1: "bold italic underline strikethrough | alignleft aligncenter alignright alignjustify | bullist numlist | link unlink | forecolor backcolor fontsizeselect",
        menubar: false,
        statusbar: false,
        toolbar_items_size: 'small',
        fontsize_formats: "8pt 9pt 10pt 11pt 12pt 13pt 14pt 18pt 24pt 36pt",
    });
}


function updateExtraShippingReason(orderID, extraPrice) {
    if (!orderID || !extraPrice) {
        return false;
    }
    var html = '<form role="form">'
            + '<div class="form-group">'
            + '<label for="extraShippingReason">Nhập lý do cộng thêm chiết khấu: </label>'
            + '<textarea id="extraShippingReason" class="form-control" rows="3"></textarea>'
            + '<label id="extraShippingReasonError" style="color:red;display:none;"></label>'
            + '</div>'
            + '</form>';
    bootbox.dialog({
        className: "frmExtraShippingReason",
        message: html,
        title: "Lý do cộng thêm chiết khấu",
        buttons: {
            danger: {
                label: "Thoát",
                className: "btn-danger",
                callback: function () {
                }
            },
            main: {
                label: "Hoàn tất",
                className: "btn-primary",
                callback: function () {
                    var extraShippingReason = $.trim($('#extraShippingReason').val());
                    if (!extraShippingReason) {
                        $('#extraShippingReasonError').text('Vui lòng nhập lý do cộng chiết khấu.').show();

                        return false;
                    }
                    $('#extraShippingReasonError').hide();
                    $.ajax({
                        type: "POST",
                        url: baseurl + '/backend/order/extra-discount/',
                        cache: false,
                        dataType: 'json',
                        data: {
                            'extraPrice': extraPrice,
                            'orderID': orderID,
                            'extraShippingReason': extraShippingReason,
                        },
                        success: function (result) {
                            if (result.st == -1) {
                                return bootbox.alert('' + result.msg + '');
                            }
                            if (result.success == 1) {
                                bootbox.alert(result.message, function () {
                                    window.location = window.location;
                                });
                            } else {
                                bootbox.alert(result.message);
                            }
                        }
                    });
                }
            }
        }
    });
}

function cancelTransReasonModal(status, orderItemID) {
    var html = '<form role="form">'
            + '<div class="form-group">'
            + '<label for="cancelTransReason">Nhập lý do món hàng bị hủy bỏ nếu có: </label>'
            + '<textarea id="cancelTransReason" class="form-control" rows="3"></textarea>'
            + '</div>'
            + '</form>';
    bootbox.dialog({
        className: "frmCancelTransReason",
        message: html,
        title: "Lý do hủy bỏ món hàng này ?",
        buttons: {
            danger: {
                label: "Thoát",
                className: "btn-danger",
                callback: function () {
                }
            },
            main: {
                label: '<span id="btnConfirm">Xác nhận</span>',
                className: "btn-primary",
                callback: function () {
                    $('#btnConfirm').html('<i class="fa fa-refresh fa-spin"></i> Đang xử lý...').parent().prop('disabled', true);
                    var cancelTransReason = $('#cancelTransReason').val();
                    updateStatus(status, orderItemID, 1, '', cancelTransReason);
                    return false;
                }
            }
        }
    });
}

/**
 * Update Receive Date of order item
 * @param int status
 * @param int orderItemID
 */
//function receivedDateModal(status, itemIdList, isReUpdateOrderTotal) {
//    itemID = itemIdList;
//    if (typeof itemIdList === 'string') {
//        itemID = eval('[' + itemIdList + ']');
//    }
//    var total = itemID.length;
//    var timeout = 0;
//    $.each(itemID, function (k, v) {
//        setTimeout(function () {
//            $.ajax({
//                type: "POST",
//                url: editUrl,
//                cache: false,
//                dataType: 'json',
//                data: {
//                    orderItemID: v,
//                    status: status
//                },
//                success: function (result) {
//                    if (k + 1 === total) {
//                        window.location = window.location;
//                    }
//                }
//            });
//        }, timeout);
//        timeout += 400;
//    });
//}

function predictDateModal(status, orderItemID, isReUpdateOrderTotal) {
    var html = '<form role="form">'
            + '<div class="form-group">'
            + '<label for="predictDate">Vui lòng nhập ngày dự kiến hàng sẽ về kho bên Mỹ</label>'
            + '<input type="text" class="form-control" id="predictDate" placeholder="Vui lòng nhập ngày dự kiến hàng sẽ về kho bên Mỹ">'
            + '</div>'
            + '<label for="trackingNumber">Tracking Number.</label>'
            + '<input type="text" class="form-control" id="trackingNumber" placeholder="Vui lòng nhập số Tracking Number">'
            + '</div>'
            + '</form>';
    bootbox.dialog({
        className: "frmPredictDate",
        message: html,
        title: "Ngày dự kiến hàng về",
        buttons: {
            danger: {
                label: "Thoát",
                className: "btn-danger",
                callback: function () {
                }
            },
            main: {
                label: '<span id="btnConfirm">Xác nhận</span>',
                className: "btn-primary",
                callback: function () {
                    var predictDate = $.trim($('#predictDate').val()),
                            trackingNumber = $.trim($('#trackingNumber').val()),
                            isValid = validatePredictDate(predictDate);

                    if (isValid !== true) {
                        bootbox.alert(isValid, function () {
                            predictDateModal(status, orderItemID);
                        });
                    }
                    if (!trackingNumber || trackingNumber === '' || trackingNumber === 'undefined') {
                        bootbox.alert('<b>Vui lòng nhập mã tracking của đơn hàng.</b>', function () {
                            predictDateModal(status, orderItemID);
                        });
                    }
                    if ((trackingNumber && trackingNumber !== '' && trackingNumber !== 'undefined') && isValid === true) {
                        $('#btnConfirm').html('<i class="fa fa-refresh fa-spin"></i> Đang xử lý...').parent().prop('disabled', true);
                        updateStatus(status, orderItemID, isReUpdateOrderTotal, predictDate, '', '', trackingNumber);
                        return false;
                    }
                }
            }
        }
    });
    $('.frmPredictDate').on('shown.bs.modal', function (e) {
        $('#predictDate').inputmask({"mask": "99/99/9999"});
    });
}

function updateStatus(status, itemIdList, isReUpdateOrderTotal, predictDate, cancelTransReason, prepaidFee, trackingNumber) {
    if (typeof status !== 'undefined' || status !== '') {
        isReUpdateOrderTotal = typeof isReUpdateOrderTotal !== 'undefined' ? isReUpdateOrderTotal : 0;
        predictDate = typeof predictDate !== 'undefined' ? predictDate : '';
        cancelTransReason = typeof cancelTransReason !== 'undefined' ? cancelTransReason : '';
        prepaidFee = typeof prepaidFee !== 'undefined' ? prepaidFee : '';
        trackingNumber = typeof trackingNumber !== 'undefined' ? trackingNumber : '';
        var urlStatus = jQuery.parseJSON(arrEditUrl);
        $.ajax({
            type: "POST",
            url: urlStatus[status],
            cache: false,
            dataType: 'json',
            data: {
                status: status,
                orderItemID: itemIdList,
                predictDate: predictDate,
                cancelTransReason: cancelTransReason,
                prepaidFee: prepaidFee,
                isReUpdateOrderTotal: isReUpdateOrderTotal,
                trackingNumber: trackingNumber
            },
            success: function (result) {
                if (result.st == -1) {
                    return bootbox.alert('' + result.msg + '');
                }
                if (result.error == 1) {
                    return bootbox.alert(result.message);
                }
                return location.reload();
            }
        });
    }
}

function updateArrivedItem(data) {
    if (data) {
        $.ajax({
            type: "GET",
            url: baseurl + '/backend/order/update-arrived-item',
            cache: false,
            dataType: 'json',
            data: {
                orderID: data.orderID,
                itemID: data.itemID,
                userID: data.userID
            },
            success: function (result) {
                if (result.st == -1) {
                    return bootbox.alert('' + result.msg + '');
                }
                if (result.error == 1) {
                    return bootbox.alert('<b>' + result.message + '</b>');
                }
                bootbox.dialog({
                    message: result.modal_content,
                    closeButton: false,
                    title: "Cập nhật số lượng hàng về",
                    buttons: {
                        danger: {
                            label: '<span id="btnCancel">Hủy</span>',
                            className: "btn-danger",
                            callback: function () {
                                $('#btnChangeMultiItemStatus').val(0);
                            }
                        },
                        main: {
                            label: '<span id="btnConfirm">Xác nhận</span>',
                            className: "btn-primary",
                            callback: function () {
                                $('#frmAddArrivedItem').submit();
                                return false;
                            }
                        }
                    }
                }).find("div.modal-dialog").css({'margin': '0 auto', 'width': '98%'});
            }
        });
    }
}


function validatePredictDate(predictDate) {
    if (predictDate.length <= 0) {
        return 'Vui lòng nhập ngày dự kiến hàng sẽ về kho.';
    }


    var inputMonth;
    var arrDate = predictDate.split('/');
    (parseInt(arrDate[1]) - 1) < 10 ? inputMonth = '0' + (parseInt(arrDate[1]) - 1) : inputMonth = (parseInt(arrDate[1]) - 1);
    predictDate = (arrDate[2] + '/' + inputMonth + '/' + arrDate[0]).toString();

    if (arrDate[0] > 31 || inputMonth > 12) {
        return 'Ngày dự kiến hàng về không đúng, xin vui lòng kiểm tra lại';
    }


    /*
     var date = new Date();
     var year = date.getFullYear().toString();
     var month = (date.getMonth() + 1) < 10 ? ('0' + (date.getMonth())).toString() : (date.getMonth()).toString();
     var day = date.getDate() < 10 ? ('0' + date.getDate()).toString() : date.getDate().toString();
     var currentDate = (year + '/' + month + '/' + day).toString();
     var isValid = dates.compare(predictDate, currentDate);
     if (isValid <= 0) {
     return 'Ngày dự kiến có tracking không được nhỏ hơn hoặc bằng ngày hiện tại.';
     }
     */

    return true;
}

function isStillFilter(ele) {
    isFilter = false;
    ele.each(function () {
        var tmp = $.trim($(this).val());
        if ($.isNumeric(tmp)) {
            if (tmp >= 0) {
                isFilter = true;
                return;
            }
        } else if (tmp != '') {
            isFilter = true;
            return;
        }
    });

    return isFilter;
}
