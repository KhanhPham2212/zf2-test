var Search = {
    listReceived: function () {
        $(document).ready(function () {
            $('#btnToggleFilterOrder').click(function () {
                $('div#frmFilterOrder').slideToggle();
            });
            $('select.receivedFilter').change(function () {
                var year = $('select#year').val();
                var month = $('select#month').val();
                $.ajax({
                    type: "POST",
                    url: baseurl + '/backend/order/list-received',
                    cache: false,
                    dataType: 'json',
                    data: {
                        year: year,
                        month: month
                    },
                    success: function (result) {
                        if (result.st == -1) {
                            return bootbox.alert('' + result.msg + '');
                        }
                        if (result.error == 0) {
                            var slbDay = $('select#day');
                            slbDay.html('<option value="0">== Tất cả ==</option>');
                            $.each(result.data, function (key, value) {
                                var selected = '';
                                if (currentDay == key) {
                                    selected = 'selected="selected"';
                                }
                                slbDay.append('<option value="' + key + '" ' + selected + '>' + value + '</option>');
                            });
                        }
                    }
                });
            });
            $('select#month').trigger('change');

            /**
             * In danh sách người nhận hàng
             */
            $('#btnExportExcel').click(function () {
                $('#frm').attr('action', exportOrderToExcelURL).attr('method', 'POST').submit().removeAttr('action').attr('method', 'GET');
            });
        });
    },
    productLate: function () {
        $(document).ready(function () {
        });
    }
};