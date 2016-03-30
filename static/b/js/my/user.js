var User = {
    index: function () {
        $(document).ready(function () {
            $('.sumoselect').SumoSelect(
                    {
                        placeholder: 'Vui lòng chọn',
                        csvDispCount: 10
                    }
            );
            $('body').on('click', '.delete', function () {
                $(this).parents('li').remove();
            });

            city = $('#city');
            cityID = city.val();
            cityName = city.find(':selected').text();

            district = $('#district');
            districtID = district.val();
            districtName = district.find(':selected').text();

            ward = $('#ward');
            wardID = ward.val();
            wardName = ward.find(':selected').text();
            $("#frm").validate({
                ignore: '.ignore',
                rules: {
                    fullName: {required: true, minlength: 3, maxlength: 255},
                    email: {required: true, minlength: 3, maxlength: 255, email: true},
//                    address: {required: true, minlength: 5, maxlength: 255},
//                    city: {required: true, greaterThanZero: true},
//                    ward: {required: true, greaterThanZero: true},
//                    district: {required: true, greaterThanZero: true},
//                    mobileNumber: {required: true, maxlength: 11},
                    password: {required: true, maxlength: 255, minlength: 3},
                    rePassword: {required: true, maxlength: 255, minlength: 3, equalTo: "#password"}
                }, messages: {
                    fullName: {
                        required: 'Xin vui lòng nhập Họ và Tên.',
                        minlength: 'Họ và tên tối thiểu từ 3 kí tự trở lên.',
                        maxlength: 'Họ và tên tối đa 255 kí tự'
                    },
                    email: {
                        required: 'Xin vui lòng nhập Email',
                        email: 'Xin vui lòng nhập đúng định dạng email. Ví dụ : hotro@amazon247.vn',
                        minlength: 'Email tối thiểu từ 3 kí tự trở lên.',
                        maxlength: 'Email tối đa 255 kí tự'
                    },
                    address: {
                        required: 'Xin vui lòng nhập địa chỉ',
                        minlength: 'Địa chỉ tối thiểu từ 5 kí tự trở lên.',
                        maxlength: 'Địa chỉ tối đa 255 kí tự'
                    },
                    mobileNumber: 'Số di động không được để trống. Tối đa 11 chữ số',
                    password: 'Mật khẩu không được để trống. Tối thiểu trên 3 kí tự và tối đa 255 kí tự',
                    rePassword: 'Vui lòng nhập lại mật khẩu.',
                    city: 'Vui lòng chọn Tỉnh/Thành',
                    ward: 'Vui lòng chọn Phường/Xã',
                    district: 'Vui lòng chọn Quận/Huyện'
                }
            });
            jQuery.extend(jQuery.validator.messages, {
                equalTo: "Password không trùng khớp. Xin vui lòng kiểm tra lại"
            });
            $.validator.addMethod("dateFormatValidate", function (value, element) {
                return value.match(/^\d\d?\-\d\d?\-\d\d\d\d$/);
            }, "Vui lòng nhập ngày tháng theo đúng định dạng : dd-mm-yyyy.");

            $.validator.addMethod("validateAddress", function (value, element) {
                return validateAddress(value);
            }, "Vui lòng nhập số nhà và tên đường đúng định dạng. Ví dụ: 1 Lê Duẩn");

            $.validator.addMethod("greaterThanZero", function (value, element) {
                return this.optional(element) || (parseFloat(value) > 0);
            }, "* Amount must be greater than zero");

            $("#mobileNumber").inputmask({"mask": "9999999999[9]"});
            $('#birthdate').inputmask({"mask": "99-99-9999"});

            User.add();
            User.del();
        })
    },
    add: function () {
        city.change(function () {
            cityID = $(this).val();
            cityName = $(this).find(':selected').text();
            if (cityID) {
                $.ajax({
                    type: "POST",
                    url: baseUrl + '/backend/admincp/district/get-list',
                    cache: false,
                    dataType: 'json',
                    data: {
                        cityID: cityID
                    },
                    success: function (result) {
                        if (result.st == -1) {
                            return bootbox.alert('' + result.msg + '');
                        }
                        if (result) {
                            district.html('<option value="">-- Chọn Quận / Huyện --</option>');
                            $.each(result, function (key, value) {
                                district.append('<option value="' + value.district_id + '">' + value.district_name + '</option>');
                            });
                        } else {
                            bootbox.alert('Không thể lấy dữ liệu Quận / Huyện');
                        }
                    }
                });
            }
        });

        district.change(function () {
            districtID = $(this).val();
            districtName = $(this).find(':selected').text();
            district.next().val(districtID);
            ward.next().val('');
            if (districtID && cityID) {
                $.ajax({
                    type: "POST",
                    url: baseUrl + '/backend/admincp/ward/get-list',
                    cache: false,
                    dataType: 'json',
                    data: {
                        cityID: cityID,
                        districtID: districtID
                    },
                    success: function (result) {
                        if (result.st == -1) {
                            return bootbox.alert('' + result.msg + '');
                        }
                        if (result) {
                            ward.html('<option value="">-- Chọn Phường / Xã --</option>');
                            $.each(result, function (key, value) {
                                ward.append('<option value="' + value.ward_id + '">' + value.ward_name + '</option>');
                            });
                        } else {
                            bootbox.alert('Không thể lấy dữ liệu Phường / Xã');
                        }
                    }
                });
            }
        });
        ward.change(function () {
            wardID = $(this).val();
            ward.next().val(wardID);
            streetName = $.trim($('#address').val());
            wardName = $(this).find(':selected').text();
            fullAddress = streetName + ', ' + wardName + ', ' + districtName + ', ' + cityName
            $('#fullAddress').val(fullAddress);
        });
    },
    edit: function () {
        $(document).ready(function () {
            $('#city, #district, #ward').change(function () {

            });
        });
    },
    del: function () {
        $(document).ready(function () {
            $('.remove').click(function () {
                userID = $(this).attr('rel');
                if (userID) {
                    bootbox.confirm('Bạn có muốn xóa người dùng này không', function (result) {
                        if (result) {
                            $.ajax({
                                type: "POST",
                                url: baseUrl + '/backend/admincp/user/delete',
                                cache: false,
                                dataType: 'json',
                                data: {
                                    'user_id': userID
                                },
                                success: function (result) {
                                    if (result.st == -1) {
                                        return bootbox.alert('' + result.msg + '');
                                    }
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

//validate only home number add street address
function validateAddress(strAddress) {
    if (!/^[/a-z0-9A-ZÀÁÂÃÈÉÊÌÍÒÓÔÕÙÚĂĐĨŨƠàáâãèéêìíòóôõùúăđĩũơƯĂẠẢẤẦẨẪẬẮẰẲẴẶẸẺẼỀỀỂẾưăạảấầẩẫậắằẳẵặẹẻẽềềếểỄỆỈỊỌỎỐỒỔỖỘỚỜỞỠỢỤỦỨỪễệỉịọỏốồổỗộớờởỡợụủứừỬỮỰỲỴÝỶỸửữựỳỵỷỹ ]+$/i.test(strAddress)) {
        return false;
    }
    if (/Phường/.test(strAddress) || /phường/.test(strAddress) || /phuong/.test(strAddress) || /Quận/.test(strAddress) || /quận/.test(strAddress) || /quan/.test(strAddress) || /Đường/.test(strAddress) || /đường/.test(strAddress) || /duong/.test(strAddress)) {
        return false;
    }
    var arrAddress = strAddress.split(' ');
    if (arrAddress.length <= 1) {
        return false;
    }
    if ($.isArray(arrAddress)) {
        if (!/^[a-z0-9A-Z/]+$/i.test(arrAddress[0])) {
            return false;
        }

        if (!/^[a-zA-ZÀÁÂÃÈÉÊÌÍÒÓÔÕÙÚĂĐĨŨƠàáâãèéêìíòóôõùúăđĩũơƯĂẠẢẤẦẨẪẬẮẰẲẴẶẸẺẼỀỀỂẾưăạảấầẩẫậắằẳẵặẹẻẽềềếểỄỆỈỊỌỎỐỒỔỖỘỚỜỞỠỢỤỦỨỪễệỉịọỏốồổỗộớờởỡợụủứừỬỮỰỲỴÝỶỸửữựỳỵỷỹ]+$/i.test(arrAddress[1]) || arrAddress[1].length <= 1) {
            return false;
        }
        if (!/^[a-z0-9A-ZÀÁÂÃÈÉÊÌÍÒÓÔÕÙÚĂĐĨŨƠàáâãèéêìíòóôõùúăđĩũơƯĂẠẢẤẦẨẪẬẮẰẲẴẶẸẺẼỀỀỂẾưăạảấầẩẫậắằẳẵặẹẻẽềềếểỄỆỈỊỌỎỐỒỔỖỘỚỜỞỠỢỤỦỨỪễệỉịọỏốồổỗộớờởỡợụủứừỬỮỰỲỴÝỶỸửữựỳỵỷỹ]+$/i.test(arrAddress[2])) {
            return false;
        }
    }
    return true;


}