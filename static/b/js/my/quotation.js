var Quotation = {
    index: function () {
        $(document).ready(function () {
            var arrResponsiveTableWidth = ['5', '14', '10', '10', '28', '10', '10', '13'];
            $(window).width() <= '800' ? responsiveTable([], $('.responsiveTable'), true) : responsiveTable(arrResponsiveTableWidth, $('.responsiveTable'), true);
            $(window).on('resize', function () {
                $(this).width() <= '800' ? responsiveTable([], $('.responsiveTable'), true) : responsiveTable(arrResponsiveTableWidth, $('.responsiveTable'), true);
            });
            $('.removeQuotation').click(function () {
                var quotationID = $(this).attr('rel');

                if (quotationID) {
                    bootbox.confirm('<b>Bạn có muốn xóa yêu cầu báo giá này không???</b>', function (result) {
                        if (result === true) {
                            $.ajax({
                                type: "POST",
                                url: baseurl + '/backend/quotation/delete',
                                cache: false,
                                dataType: 'json',
                                data: {'quotationID': quotationID},
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
                    });
                }
            });
            $('#createdDateFrom, #createdDateTo').inputmask({"mask": "99/99/9999"});

            //Show/Hide filter tool
            $('#btnToggleFilterEmailOrder').click(function () {
                $('div#frmFilterEmailOrder').slideToggle();
            });
        });
    },
    edit: function () {
        $('.removeQuotationItem').click(function () {
            var $this = $(this);
            bootbox.confirm('<b>Bạn có chắc chắn muốn xóa sản phẩm này khỏi danh sách?', function (result) {
                if (result === true) {
                    var quotationItemID = $this.data("id");
                    $.ajax({
                        type: "POST",
                        url: baseurl + '/backend/quotation/delete-item',
                        cache: false,
                        dataType: 'json',
                        data: {'quotationItemID': quotationItemID},
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
            });
        });
    },
    toOrder: function () {
        $(document).ready(function () {
            Quotation.initEditor();
            $('.removeQuotationItem').click(function () {
                var $this = $(this);
                bootbox.confirm('<b>Bạn có chắc chắn muốn xóa sản phẩm này khỏi danh sách?', function (result) {
                    if (result === true) {
                        $this.parent().parent().fadeOut('fast', function () {
                            $(this).remove();
                        });
                    }
                });
            });
        });
    },
    create: function () {
        $(document).ready(function () {
            //init editor for note
            Quotation.initEditor();
            var tmp = 0;
            $('#addItem').click(function () {
                tmp += 1;
                var html = '<tr>'
                        + '<td data-title="STT" style="text-align:center;"><span class="ordering"></span></td>'
                        + '<td data-title="Tên sản phẩm"><input type="text" class="form-control productName" name="quotationItem[' + tmp + '][productName]" /></td>'
                        + '<td data-title="Asin">'
                        + '<input type="text" class="form-control asin" name="quotationItem[' + tmp + '][asin]" />'
                        + '<input type="hidden" class="productImage" name="quotationItem[' + tmp + '][productImage]" value="" />'
                        + '</td>'
                        + '<td data-title="Số lượng"><input type="text" class="form-control quantity" name="quotationItem[' + tmp + '][quantity]" value="1" /></td>'
                        + ' <td data-title="Website"> <select class="form-control" name="quotationItem[' + tmp + '][language]" id="language"><option value="">Chọn</option><option value="jp">Nhật</option> <option value="us">Mỹ</option></select> </td>'
                        + '<td data-title="Shipping Weigh"><input type="text" class="form-control shippingWeigh" name="quotationItem[' + tmp + '][shippingWeigh]" /></td>'
                        + '<td data-title="Giá sau thuế tại Mỹ"><input type="text" class="form-control estimatedFee" name="quotationItem[' + tmp + '][estimatedFee]" /></td>'
                        + '<td data-title="Phí thông quan"><input type="text" class="form-control importFee" name="quotationItem[' + tmp + '][importFee]" /></td>'
                        + '<td data-title="Phí vận chuyển"><input type="text" class="form-control shippingFee" name="quotationItem[' + tmp + '][shippingFee]" /></td>'
                        + '<td data-title="Chiết khấu"><input type="text" class="form-control discountPrice" name="quotationItem[' + tmp + '][discountPrice]" value="0" /></td>'
                        + '<td data-title="Phụ phí"><input type="text" class="form-control otherCharge" name="quotationItem[' + tmp + '][otherCharge]" value="0" /></td>'
                        + '<td data-title="Chức năng" style="text-align:center;"><a class="removeQuotationItem" style="cursor:pointer;" title="Xóa khỏi danh sách"><i class="fa fa-times" style="font-size:1.8em;"></i></a></td>'
                        + '</tr>';
                $('#productList').append(html);
                updateQuotationOrdering();
            });

            $(document).on('click', '.removeQuotationItem', function () {
                if (typeof $(this).data("id") != "undefined")
                    return;

                var quantity = $('#productList').children('tr').length;
                if (quantity > 1) {
                    $(this).parents('tr').remove();
                    updateQuotationOrdering();
                }
            });
            $(".shippingWeigh").on('change', function () {
                if ($(this).val() <= 0) {
                    $(this).next().show();
                    $(this).next().html('Shipping Weight phải lớn hơn 0');
                } else {
                    $(this).next().hide();

                }
            });
            $('#getUserInfo').click(function () {
                var email = $.trim($('#email').val());
                if (!IsEmail(email)) {
                    bootbox.alert('<b>Email không đúng, xin vui lòng kiểm tra lại.</b>');
                    return false;
                }
                $.ajax({
                    type: "POST",
                    url: baseurl + '/backend/user/get-user-info',
                    cache: false,
                    dataType: 'json',
                    data: {'email': email},
                    success: function (result) {
                        if (result.st == -1) {
                            return bootbox.alert('' + result.msg + '');
                        }
                        if (result.user_id || result.fullname || result.phone) {
                            $('#userID').val(result.user_id);
                            $('#fullname').val(result.fullname);
                            $('#phoneNumber').val(result.phone);
                        } else {
                            bootbox.alert('<b>Hiện tại email này chưa được đăng ký thành viên. Xin vui lòng nhập đầy đủ <ins>Họ Tên</ins> và <ins>số điện thoại</ins> khi tạo đơn hàng.</b>');
                            $('#fullname, #phoneNumber, #userID').val('');
                        }
                    }
                });
            });


            
        });
    },
    initEditor: function () {
        tinymce.init({
            selector: 'textarea',
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
    }
};

function estimateUSTax(result, asin, merchantID) {
    var productImage = $(result.detail).find('img#landingImage, img#main-image, img#img-canvas, img#imgBlkFront, img#prodImage, img.kib-image-ma').first().attr('src');
    var productName = $(result.detail).find('#title_feature_div, #booksTitle').children('div').children('h1').text();
    !productName ? productName = $(result.detail).find('#btAsinTitle').text() : '';
    productName = $.trim(productName);

    $('#' + asin).children().find('.productName').val(productName);
    $('#' + asin).children().find('.productImage').val(productImage);

    $.getJSON(bot + "/us/tax.php?callback=?", {
        publicKey: publickey,
        asinCode: asin,
        key: result.key,
        id: result.id
    }, function (result) {
        estimateVNTax(result, merchantID, asin);
    });
}

function estimateVNTax(data, merchantID, asin) {

    $.ajax({
        url: baseurl + '/frontend/topic/calculate-tax/',
        type: "POST",
        async: true,
        cache: false,
        data: {data: data},
        success: function (data) {
            if (data.st == -1) {
                return bootbox.alert('' + data.msg + '');
            }
            totalLoad++
            var result = $.parseJSON(data);
            categoryID = result.categoryID;
            estimatedOrderTotal = result.estimatedOrderTotal;
            importFee = result.importFee;
            shippingFee = result.shippingFee;
            discountPrice = result.discountPrice;
            shippingWeigh = result.shippingWeigh;
            totalFee = result.totalFee;
            otherCharge = '';
            otherChargeFee = 0;
            if (typeof result.otherCharge !== "undefined" && result.otherCharge !== null && result.otherCharge !== '') {
                otherChargeFee = result.otherCharge;
            }
            $('#' + asin).children().find('.shippingWeigh').val(shippingWeigh);
            $('#' + asin).children().find('.estimatedOrder').val(estimatedOrderTotal);
            $('#' + asin).children().find('.importFee').val(importFee);
            $('#' + asin).children().find('.shippingFee').val(shippingFee);
            $('#' + asin).children().find('.otherCharge').val(otherChargeFee);
            // Không biết chỗ này có thêm vào không nên tạm khóa lại
            // $('#' + asin).children().find('.discountPrice').val(discountPrice);

            if (totalLoad == totalInput) {
                $('#loading').hide();
            }
        }
    });
}

function updateQuotationOrdering() {
    var count = 1;
    $('td span.ordering').each(function () {
        $(this).html(count);

        count++;
    });
}