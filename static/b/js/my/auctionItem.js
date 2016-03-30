var AuctionItem = {
    index: function () {
        $(document).ready(function () {
//            $("#frmAuc").validate({
//                ignore: '.ignore',
//                rules: {
//                    priceFee: {number: true,},
//                    priceTransport:{number: true,},
//                    importFee:{number: true,},
//                    weigh:{number: true,required: true, },
//                    discountPrice:{number: true,},
//                    otherFee:{number: true,},
//                    
//                  
//                   
//                }, messages: {
//                    priceFee: {
//                        number: 'Xin vui lòng nhập số.',
//                       
//                    },
//                    priceTransport: {
//                          number: 'Xin vui lòng nhập số.',
//                       
//                    },
//                    importFee: {
//                          number: 'Xin vui lòng nhập số.',
//                       
//                    },
//                    discountPrice: {
//                          number: 'Xin vui lòng nhập số.',
//                       
//                    },
//                    otherFee: {
//                          number: 'Xin vui lòng nhập số.',
//                       
//                    },
//                    weigh: {
//                         required: 'Xin vui lòng nhập trọng lượng',
//                         number: 'Xin vui lòng nhập số.',
//                       
//                    },
//                 
//                }
//            });
           
        });
        /**
         * Tinh totalFee
         */
        
        $(document).on("change",".otherFee",function(){
            var temp = $(this);
            var otherFee = temp.val();
            var discountFee = temp.parent("td").prev().children().val();
            var transport = temp.parent("td").prev().prev().children().val();
            var importFee = temp.parent("td").prev().prev().prev().children().val();
            var priceTransport = temp.parent("td").prev().prev().prev().prev().children().val();
            var priceFee = temp.parent("td").prev().prev().prev().prev().prev().children().val();
            var price = temp.parent("td").prev().prev().prev().prev().prev().prev().children().val();
            
            $.ajax({
                type: "POST",
                url: baseurl + '/backend/auction-item/total-price',
                cache: false,
                dataType: 'json',
                data: {
                    'otherFee': otherFee,
                    'discountFee': discountFee,
                    'transport': transport,
                    'importFee' : importFee,
                    'priceTransport':priceTransport,
                    'priceFee':priceFee,
                    'price':price
                },
                success: function (result) {   
                    console.log(result);
                    if (result) {
                        //$(".totalFee").val(result.totalPrice);
                        $(".totalpriceFee").val(result.priceJp);
                    } else {
                        
                    }
                }
            });
        });
    },
   
    edit: function () {
        $(document).ready(function () {
        
        $("#frmUpdateItems").validate({
                ignore: '.ignore',
                rules: {
                    shipCost: {required: true,},
                    deliveryCost:{required: true, },
                    taxCost:{required: true, },
                  
                   
                }, messages: {
                    shipCost: {
                        required: 'Xin vui lòng nhập giá ship.',
                       
                    },
                    deliveryCost: {
                         required: 'Xin vui lòng nhập phí vận chuyển.',
                       
                    },
                    taxCost: {
                         required: 'Xin vui lòng nhập giá sau thuế.',
                       
                    },
                 
                }
            });

     

        });
    },
    view: function () {
        $(document).ready(function () {

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
            $('.status').mouseenter(function () {
                currentStatus = $(this).val();
            });

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
                        actionID = parseInt($this.val());
                switch (actionID) {
                    case 1: //change multiple items status
                        var html = '<div class="alert alert-danger" id="statusListEmpty" style="display:none;"><strong>Lỗi!</strong><br />Vui lòng chọn trạng thái muốn chuyển</div>'
                                + '<select id="statusList" class="form-control">'
                                + '<option value="">Chọn trạng thái</option>'
                                + '<option value="1">Chờ kiểm duyệt</option>'
                                + '<option value="2">Đã kiểm duyệt - Chờ thanh toán</option>'
                                + '<option value="3">Đã thanh toán - Đang mua hàng</option>'
                                + '<option value="4">Đã mua hàng - Đang cập nhật Tracking</option>'
                                + '<option value="5">Đã có Tracking - Chờ hàng về</option>'
                                + '<option value="6">Hàng đã về</option>'
                                + '<option value="0">Hủy món hàng này</option>'
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

                                        if ($('#prepaidFee input').is(':visible')) {
                                            prepaidFee = parseFloat($.trim($('#prepaidFee input').val()));
                                            prepaidFee = isNaN(prepaidFee) ? 0 : prepaidFee;
                                        }

                                        $('#statusListEmpty').hide();
                                        var total = $('.orderStatusCheckbox:checked').size();
                                        var arrItemID = [];
                                        $('.orderStatusCheckbox:checked').each(function (k, v) {
                                            var orderItemID = $(v).attr('item-id');
                                            arrItemID.push(orderItemID);
                                        });
                                        if (status >= 0 && arrItemID) {
                                            $('#btnConfirm').html('<i class="fa fa-refresh fa-spin"></i> Đang xử lý...').parent().prop('disabled', true);
                                            if (status == 0) { //Đã bị hủy
                                                $('#btnCancel').parent().trigger('click');
                                                cancelTransReasonModal(status, arrItemID);
                                            } else if (status >= 1 && status <= 4) { //đã thanh toán tới đã mua hàng
                                                updateStatus(status, arrItemID, '', '', prepaidFee);
                                            } else if (status == 5) { //đã có tracking - chờ hàng về 
                                                $('#btnCancel').parent().trigger('click');
                                                predictDateModal(status, arrItemID);
                                            } else if (status == 6) { //hàng đã về
                                                $('#btnCancel').parent().trigger('click');
                                                receivedDateModal(status, arrItemID);
                                            }
                                        }
                                        return false;
                                    }
                                }
                            }
                        });
                        break;
                    case 2:
                        if (!orderID || isNaN(orderID)) {
                            return bootbox.alert('<b>Không thể tạo mã vận đơn, vui lòng kiểm tra lại.</b>');
                        }
                        Lading.add(orderID);
                        break;
                }

                //show input nhập số tiền khách đã thanh toán trước khi trạng thái muốn chuyển là đã thanh toán - đang mua hàng.
                $('#statusList').on('change', function () {
                    var status = $(this).val();
                    $('#prepaidFee').hide();
                    if (status === '3') {
                        
                        $('#prepaidFee').show();
                    }
                });
            });
            $('#btnExtraShippingDiscount').click(function () {
                var orderID = $(this).parent().attr('class');
                var html = '<div class="alert alert-danger" id="extraPriceError" style="display:none;"><strong>Lỗi!</strong><br />Số tiền nhập vào không đúng</div>'
                        + '<span style="margin-left:10px;font-weight:600;">Vui lòng nhập số tiền. Ví dụ: 10000</span>'
                        + '<input class="form-control round-input" id="extraPrice" type="text" value="" name="extraPrice" placeholder="Vui lòng nhập số tiền" autocomplete="off">'
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
                                //if (!/^\d+$/.test(extraPrice)) {
                                if (isNaN(extraPrice) || extraPrice <= 0) {
                                    $('#extraPriceError').show();
                                    $('#extraPrice').addClass('error');
                                    return false;
                                } else {
                                    $('#extraPriceError').hide();
                                    $('#extraPrice').removeClass('error');

                                    updateExtraShippingReason(orderID, extraPrice);
                                }
                            }
                        }
                    }
                });
            });

            /**
             * Change Order Status
             */
            $('.status').change(function () {
                $this = $(this);
                var status = parseInt($this.val());
                var orderItemID = $this.attr('id');
               
                var txtStatus = $.trim($('option:selected', this).text());
                if (status >= 0 && orderItemID) {
                    bootbox.confirm('<b>Bạn có muốn chuyển trạng thái món hàng thành "' + txtStatus + '" ???</b><br/><br/><ins>Lưu ý</ins> : khi đã chắc chắn chuyển trạng thái đơn hàng thì bạn không thể quay lại trạng thái cũ hay thấp hơn.', function (result) {
                        if (result === true) {
                            if (status === 0) { //Đã bị hủy
                                cancelTransReasonModal(status, orderItemID);
                            } else if (status >= 1 && status <= 4) { //đã thanh toán - đang mua hàng
                                updateStatus(status, orderItemID);
                            } else if (status === 5) { //đã có tracking - chờ hàng về
                               // predictDateModal(status, orderItemID);
                            } else if (status === 6) { //hàng đã về
                                receivedDateModal(status, orderItemID);
                            }
                        }
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
                        url: baseurl + '/backend/order/update-order-attr',
                        cache: false,
                        dataType: 'json',
                        data: {
                            orderID: orderID,
                            prepaidFee: prepaidFee,
                            type: 'prepaid-fee'
                        },
                        success: function (result) {
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

                var prepaidPercent = $(this).val();
                $.ajax({
                    type: "POST",
                    url: baseurl + '/backend/order/update-order-prepaid-percent',
                    cache: false,
                    dataType: 'json',
                    data: {
                        orderID: orderID,
                        prepaidPercent: prepaidPercent,
                    },
                    success: function (result) {
                        if (result.error == 1) {
                            bootbox.alert(result.message, function () {
                                $this.val(currentPrepaidPercent);
                            });
                        } else {
                            bootbox.alert(result.message, function () {
                                window.location.href = window.location.href;
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
                        url: baseurl + '/backend/auction-item/update-order-item',
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
                                data: {
                                    orderID: orderID,
                                    vatPercent: vatPercent,
                                },
                                success: function (result) {
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
                data: {
                    orderID: orderID,
                    isDropInvoice: isDropInvoice,
                },
                success: function (result) {
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
                        data: {
                            orderID: orderID,
                            paymentMethod: paymentMethod,
                        },
                        success: function (result) {
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
                data: {
                    orderID: orderID,
                    deliveryBefore: deliveryBefore,
                },
                success: function (result) {
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
    del: function () {
        $(document).ready(function () {
            
            $('.remove').click(function () {
                auctionItemID = $(this).attr('rel');
                if (auctionItemID) {
                    bootbox.confirm('Bạn có muốn xóa người dùng này không', function (result) {
                        if (result) {
                            $.ajax({
                                type: "POST",
                                url: baseurl + '/backend/auction-item/delete',
                                cache: false,
                                dataType: 'json',
                                data: {
                                    'auction_item_id': auctionItemID
                                },
                                success: function (result) {
                                    if (result) {
                                        window.location = window.location;
                                    } else {
                                        bootbox.alert('Không thể xóa người dùng này');
                                    }
                                }
                            });
                        }
                    });
                }
            });

            //filter
            $('#btnToggleFilterUser').click(function () {
                $('div#frmFilterUser').slideToggle();
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
        toolbar1: "bold italic underline strikethrough | alignleft aligncenter alignright alignjustify | bullist numlist | link unlink | forecolor backcolor",
        menubar: false,
        statusbar: false,
        toolbar_items_size: 'small',
        fontsize_formats: "8pt 9pt 10pt 11pt 12pt 13pt 14pt 18pt 24pt 36pt",
    });
}
function updateStatus(status, itemIdList, predictDate, cancelTransReason, prepaidFee, trackingNumber) {
    if (typeof status !== 'undefined' || status !== '') {
        predictDate = typeof predictDate !== 'undefined' ? predictDate : '';
        cancelTransReason = typeof cancelTransReason !== 'undefined' ? cancelTransReason : '';
        prepaidFee = typeof prepaidFee !== 'undefined' ? prepaidFee : '';
        trackingNumber = typeof trackingNumber !== 'undefined' ? trackingNumber : '';

        itemID = itemIdList;
        if (typeof itemIdList === 'string') {
            itemID = eval('[' + itemIdList + ']');
        }
        var total = itemID.length;
        var timeout = 0;

        $.each(itemID, function (k, v) {
            setTimeout(function () {
                $.ajax({
                    type: "POST",
                    url: editUrl,
                    cache: false,
                    dataType: 'json',
                    data: {
                        status: status,
                        orderItemID: v,
                        predictDate: predictDate,
                        cancelTransReason: cancelTransReason,
                        prepaidFee: prepaidFee,
                        trackingNumber: trackingNumber
                    },
                    success: function (result) {
                        if (k + 1 === total) {
                            window.location = window.location;
                        }
                    }
                });
            }, timeout);
            timeout += 500;
        });
    }
}

function receivedDateModal(status, itemIdList) {
    var i = 1;
    var vehicleOptions = '';
    for (i; i < 7; i++) {
        vehicleOptions += '<option value="' + i + '">Đợt ' + i + '</option>';
    }
    var html = '<form role="form">'
            + '<div class="form-group">'
            + '<label for="receivedDate">Vui lòng nhập ngày hàng về kho bên Việt Nam :</label>'
            + '<input type="text" class="form-control" id="receivedDate" placeholder="Vui lòng nhập ngày hàng về kho bên Việt Nam">'
            + '</div>'
            + '<div class="form-group">'
            + '<label for="vehicleTrip">Chọn đợt hàng về :</label>'
            + '<select class="form-control" name="vehicleTrip" id="vehicleTrip">'
            + vehicleOptions
            + '</select>'
            + '</div>'
            + '</form>';

    itemID = itemIdList;

    if (typeof itemIdList === 'string') {
        itemID = eval('[' + itemIdList + ']');
    }
    var total = itemID.length;
    var date = new Date();
    var year = date.getFullYear().toString();
    var month = (date.getMonth() + 1) < 10 ? ('0' + (date.getMonth() + 1)).toString() : (date.getMonth() + 1).toString();
    var day = date.getDate() < 10 ? ('0' + date.getDate()).toString() : date.getDate().toString();
    var currentDate = (year + '/' + month + '/' + day).toString();

    bootbox.dialog({
        className: "frmReceivedDate",
        message: html,
        title: "Ngày hàng về kho",
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
                    var receivedDate = $('#receivedDate').val();
                    if (receivedDate.length <= 0) {
                        bootbox.alert('<b>Vui lòng nhập ngày hàng về kho.</b>', function () {
                            return receivedDateModal(status, itemIdList);
                        });
                    }
                    var inputMonth;
                    var arrDate = receivedDate.split('/');
                    (parseInt(arrDate[1]) - 1) < 10 ? inputMonth = '0' + (parseInt(arrDate[1])) : inputMonth = (parseInt(arrDate[1]));
                    receivedDate = (arrDate[2] + '/' + inputMonth + '/' + arrDate[0]).toString();

                    if (arrDate[0] > 31 || inputMonth > 12) {
                        bootbox.alert('<b>Ngày hàng về kho không đúng, xin vui lòng kiểm tra lại</b>', function () {
                            return receivedDateModal(status, itemIdList);
                        });
                    }

                    var isValid = dates.compare(receivedDate, currentDate);
                    if (isValid < 0) {
                        bootbox.alert('<b>Ngày hàng về kho không được nhỏ hơn ngày hiện tại.</b>', function () {
                            return receivedDateModal(status, itemIdList);
                        });
                    }
                    //if date is valid, call ajax to add received date
                    if (isValid >= 0) {
                        //dot hang ve
                        var vehicleTrip = $('select#vehicleTrip').val();
                        $('#btnConfirm').html('<i class="fa fa-refresh fa-spin"></i> Đang xử lý...').parent().prop('disabled', true);
                        $.each(itemID, function (k, v) {
                            $.ajax({
                                type: "POST",
                                url: editUrl,
                                cache: false,
                                dataType: 'json',
                                data: {
                                    vehicleTrip: vehicleTrip,
                                    receivedDate: receivedDate,
                                    orderItemID: v,
                                    status: status
                                },
                                success: function (result) {
                                    if (k + 1 === total) {
                                        window.location = window.location;
                                    }
                                }
                            });
                        });
                    }
                    return false;
                }
            }
        }
    });
    $('.frmReceivedDate').on('shown.bs.modal', function (e) {
        var currentDate = day + '/' + month + '/' + year;
        $('#receivedDate').val(currentDate);
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
                    updateStatus(status, orderItemID, '', cancelTransReason);
                    return false;
                }
            }
        }
    });
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

