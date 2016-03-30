var Statistic = {
    order: function () {
        $(document).ready(function () {
            var arrOrderTotal = [],
                    arrTransferredMoney = [],
                    arrTransferredMoneyInday = [],
                    arrCancel = [],
                    totalOrder = 0,
                    totalTransferredMoneyInday = 0,
                    totalTransferredMoney = 0,
                    totalCancel = 0;

            var arrQuotation = [],
                    arrTransferredMoneyFromQuotation = [],
                    arrTransferredMoneyFromQuotationInDay = [],
                    arrCreatedOrderFromQuotation = [],
                    totalQuotation = 0,
                    totalTransferredMoneyFromQuotationInDay = 0,
                    totalTransferredMoneyFromQuotation = 0,
                    totalCreatedOrderFromQuotation = 0;

            var arrOrderTotalByDistrict = [],
                    arrCity = [],
                    arrTransferredMoneyByDistrict = [],
                    arrTransferredMoneyIndayByDistrict = [],
                    arrCancelByDistrict = [],
                    totalOrderByDistrict = 0,
                    totalTransferredMoneyIndayByDistrict = 0,
                    totalTransferredMoneyByDistrict = 0,
                    totalCancelByDistrict = 0;

            var orderData = statisticOrderData ? $.parseJSON(statisticOrderData) : '';
            var quotationData = statisticQuotationData ? $.parseJSON(statisticQuotationData) : '';
            var orderDistrictData = arrStatisticByDistrictData ? $.parseJSON(arrStatisticByDistrictData) : '';
            if (orderData) {
                $.each(orderData.data, function (k, v) {
                    arrOrderTotal.push(parseInt(v.total_order));
                    arrTransferredMoney.push(parseInt(v.transfered_money));
                    arrTransferredMoneyInday.push(parseInt(v.transfered_money_in_day));
                    arrCancel.push(parseInt(v.canceled));

                    totalOrder += parseInt(v.total_order);
                    totalTransferredMoneyInday += parseInt(v.transfered_money_in_day);
                    totalTransferredMoney += parseInt(v.transfered_money);
                    totalCancel += parseInt(v.canceled);
                });

                setTimeout(function () {
                    $('#orderChart').highcharts({
                        chart: {
                            type: 'spline'
                        },
                        title: {
                            text: 'Biểu đồ thống kê đơn hàng trực tiếp'
                        },
                        xAxis: {
                            categories: orderData.date,
                            labels: {
                                rotation: -70,
                                style: {
                                    fontSize: '13px',
                                    fontFamily: 'tahoma'
                                }
                            }
                        },
                        yAxis: {
                            min: 0,
                            title: {
                                text: ''
                            }
                        },
                        tooltip: {
                            pointFormat: '<span style="color:{series.color}">\u25CF</span> {series.name}: <b>{point.y}</b><br/>',
                            shared: true
                        },
                        series: [{
                                name: 'Tổng số đơn hàng',
                                data: arrOrderTotal,
                                color: '#45619D',
                                point: {
                                    cursor: 'pointer',
                                    events: {
                                        click: function () {
                                            var date = this.category;
                                            if (date) {
                                                viewOrderURL += '?isOrderFilter=1&createdDateFrom=' + date + '&createdDateTo=' + date;
                                                window.open(viewOrderURL, '_blank');
                                            }
                                        }
                                    }
                                }
                            },
                            {
                                name: 'Tổng đơn hàng được chuyển tiền của đơn trong ngày',
                                data: arrTransferredMoneyInday,
                                color: '#A9D86E',
                                point: {
                                    cursor: 'pointer',
                                    events: {
                                        click: function () {
                                            var date = this.category;
                                            if (date) {
                                                viewOrderURL += '?isOrderFilter=1&createdDateFrom=' + date + '&createdDateTo=' + date + '&paymentDateFrom=' + date + '&paymentDateTo=' + date;
                                                window.open(viewOrderURL, '_blank');
                                            }
                                        }
                                    }
                                }
                            },
                            {
                                name: 'Tổng đơn hàng được chuyển tiền',
                                data: arrTransferredMoney,
                                color: '#FCB322',
                                point: {
                                    cursor: 'pointer',
                                    events: {
                                        click: function () {
                                            var date = this.category;
                                            if (date) {
                                                viewOrderURL += '?isOrderFilter=1&paymentDateFrom=' + date + '&paymentDateTo=' + date;
                                                window.open(viewOrderURL, '_blank');
                                            }
                                        }
                                    }
                                }
                            },
                            {
                                name: 'Đơn hàng bị hủy và chưa thanh toán',
                                data: arrCancel,
                                color: '#FF0000'
                            },
                            {
                                type: 'pie',
                                name: 'Tổng số đơn hàng',
                                data: [{
                                        name: 'Tổng số đơn hàng',
                                        y: totalOrder,
                                        color: '#45619D'
                                    }, {
                                        name: 'Tổng đơn hàng được chuyển tiền của đơn trong ngày',
                                        y: totalTransferredMoneyInday,
                                        color: '#A9D86E'
                                    }, {
                                        name: 'Tổng đơn hàng được chuyển tiền',
                                        y: totalTransferredMoney,
                                        color: '#FCB322'
                                    }, {
                                        name: 'Đơn hàng bị hủy và chưa thanh toán',
                                        y: totalCancel,
                                        color: '#FF0000'
                                    }],
                                center: [20, 0],
                                size: 50,
                                showInLegend: false,
                                dataLabels: {
                                    enabled: false
                                }
                            }
                        ]
                    });
                }, 1000);
            }

            if (quotationData) {
                $.each(quotationData.data, function (k, v) {
                    arrQuotation.push(parseInt(v.total_quotation));
                    arrTransferredMoneyFromQuotationInDay.push(parseInt(v.transferred_money_in_day));
                    arrTransferredMoneyFromQuotation.push(parseInt(v.transferred_money));
                    arrCreatedOrderFromQuotation.push(parseInt(v.created_order));

                    totalQuotation += parseInt(v.total_quotation);
                    totalTransferredMoneyFromQuotationInDay += parseInt(v.transferred_money_in_day);
                    totalTransferredMoneyFromQuotation += parseInt(v.transferred_money);
                    totalCreatedOrderFromQuotation += parseInt(v.created_order);
                });
                setTimeout(function () {
                    $('#quotationChart').highcharts({
                        chart: {
                            type: 'spline'
                        },
                        title: {
                            text: 'Biểu đồ thống kê yêu cầu báo giá qua mail'
                        },
                        xAxis: {
                            categories: orderData.date,
                            labels: {
                                rotation: -60,
                                style: {
                                    fontSize: '13px',
                                    fontFamily: 'tahoma'
                                }
                            }
                        },
                        yAxis: {
                            min: 0,
                            title: {
                                text: ''
                            }
                        },
                        tooltip: {
                            pointFormat: '<span style="color:{series.color}">\u25CF</span> {series.name}: <b>{point.y}</b><br/>',
                            shared: true
                        },
                        series: [
                            {
                                name: 'Tổng số yêu cầu báo giá',
                                data: arrQuotation,
                                color: '#45619D'
                            },
                            {
                                name: 'Tổng số báo giá đã chuyển tiền của báo giá qua mail trong ngày',
                                data: arrTransferredMoneyFromQuotationInDay,
                                color: '#FCB322'
                            },
                            {
                                name: 'Tổng số báo giá đã chuyển tiền từ báo giá qua mail',
                                data: arrTransferredMoneyFromQuotation,
                                color: '#A9D86E'
                            },
                            {
                                name: 'Tổng số đơn hàng được tạo từ mail báo giá',
                                data: arrCreatedOrderFromQuotation,
                                color: '#FF0000'
                            },
                            {
                                type: 'pie',
                                name: 'Tổng số đơn hàng',
                                data: [{
                                        name: 'Tổng số yêu cầu báo giá',
                                        y: totalQuotation,
                                        color: '#45619D'
                                    }, {
                                        name: 'Tổng số báo giá đã chuyển tiền của báo giá qua mail trong ngày',
                                        y: totalTransferredMoneyFromQuotationInDay,
                                        color: '#FCB322'
                                    }, {
                                        name: 'Tổng số báo giá đã chuyển tiền từ báo giá qua mail',
                                        y: totalTransferredMoneyFromQuotation,
                                        color: '#A9D86E'
                                    }, {
                                        name: 'Tổng số đơn hàng được tạo từ mail báo giá',
                                        y: totalCreatedOrderFromQuotation,
                                        color: '#FF0000'
                                    }],
                                center: [20, 0],
                                size: 50,
                                showInLegend: false,
                                dataLabels: {
                                    enabled: false
                                }
                            }
                        ]
                    });
                }, 1000);
            }

            if (orderDistrictData) {
                $.each(orderDistrictData.data, function (k, v) {
                    arrCity.push(v.city_name);
                    arrOrderTotalByDistrict.push(parseInt(v.total_order));
                    arrTransferredMoneyByDistrict.push(parseInt(v.transfered_money));
                    arrTransferredMoneyIndayByDistrict.push(parseInt(v.transfered_money_in_day));
                    arrCancelByDistrict.push(parseInt(v.canceled));

                    totalOrderByDistrict += parseInt(v.total_order);
                    totalTransferredMoneyIndayByDistrict += parseInt(v.transfered_money_in_day);
                    totalTransferredMoneyByDistrict += parseInt(v.transfered_money);
                    totalCancelByDistrict += parseInt(v.canceled);
                });
                setTimeout(function () {
                    $('#orderDistrictChart').highcharts({
                        chart: {
                            type: 'column'
                        },
                        title: {
                            text: 'Biểu đồ thống kê đơn hàng trực tiếp'
                        },
                        xAxis: {
                            categories: arrCity,
                            labels: {
                                rotation: -70,
                                style: {
                                    fontSize: '13px',
                                    fontFamily: 'tahoma'
                                }
                            }
                        },
                        yAxis: {
                            min: 0,
                            title: {
                                text: ''
                            }
                        },
                        tooltip: {
                            pointFormat: '<span style="color:{series.color}">\u25CF</span> {series.name}: <b>{point.y}</b><br/>',
                            shared: true
                        },
                        series: [{
                                name: 'Tổng số đơn hàng',
                                data: arrOrderTotalByDistrict,
                                color: '#45619D',
                                point: {
                                    cursor: 'pointer',
                                    events: {
                                        click: function () {
                                            var date = this.category;
                                            if (date) {
                                                viewOrderURL += '?isOrderFilter=1&createdDateFrom=' + date + '&createdDateTo=' + date;
                                                window.open(viewOrderURL, '_blank');
                                            }
                                        }
                                    }
                                }
                            },
                            {
                                name: 'Tổng đơn hàng được chuyển tiền của đơn trong ngày',
                                data: arrTransferredMoneyIndayByDistrict,
                                color: '#A9D86E',
                                point: {
                                    cursor: 'pointer',
                                    events: {
                                        click: function () {
                                            var date = this.category;
                                            if (date) {
                                                viewOrderURL += '?isOrderFilter=1&createdDateFrom=' + date + '&createdDateTo=' + date + '&paymentDateFrom=' + date + '&paymentDateTo=' + date;
                                                window.open(viewOrderURL, '_blank');
                                            }
                                        }
                                    }
                                }
                            },
                            {
                                name: 'Tổng đơn hàng được chuyển tiền',
                                data: arrTransferredMoneyByDistrict,
                                color: '#FCB322',
                                point: {
                                    cursor: 'pointer',
                                    events: {
                                        click: function () {
                                            var date = this.category;
                                            if (date) {
                                                viewOrderURL += '?isOrderFilter=1&paymentDateFrom=' + date + '&paymentDateTo=' + date;
                                                window.open(viewOrderURL, '_blank');
                                            }
                                        }
                                    }
                                }
                            },
                            {
                                name: 'Đơn hàng bị hủy và chưa thanh toán',
                                data: arrCancelByDistrict,
                                color: '#FF0000'
                            },
                            {
                                type: 'pie',
                                name: 'Tổng số đơn hàng',
                                data: [{
                                        name: 'Tổng số đơn hàng',
                                        y: totalOrderByDistrict,
                                        color: '#45619D'
                                    }, {
                                        name: 'Tổng đơn hàng được chuyển tiền của đơn trong ngày',
                                        y: totalTransferredMoneyIndayByDistrict,
                                        color: '#A9D86E'
                                    }, {
                                        name: 'Tổng đơn hàng được chuyển tiền',
                                        y: totalTransferredMoneyByDistrict,
                                        color: '#FCB322'
                                    }, {
                                        name: 'Đơn hàng bị hủy và chưa thanh toán',
                                        y: totalCancelByDistrict,
                                        color: '#FF0000'
                                    }],
                                center: [20, 0],
                                size: 50,
                                showInLegend: false,
                                dataLabels: {
                                    enabled: false
                                }
                            }
                        ]
                    });
                }, 1000);
            }
        });
    },
    revenue: function () {

        var arrAmazonPaid = [],
                arrCustomerCharge = [],
                arrRevenue = [],
                totalAmazonPaid = 0,
                totalCustomerCharge = 0,
                totalRevenue = 0;

        var revenueData = statisticRevenue ? $.parseJSON(statisticRevenue) : '';

        $.each(revenueData.data, function (k, v) {

            var amazonPaid = parseFloat(v.amazon_paid);
            amazonPaid = isNaN(amazonPaid) ? 0 : amazonPaid;

            var customerCharge = parseFloat(v.customer_charge);
            customerCharge = isNaN(customerCharge) ? 0 : customerCharge;

            var revenue = parseFloat(v.revenue);
            revenue = isNaN(revenue) ? 0 : revenue;

            arrAmazonPaid.push(amazonPaid);
            arrCustomerCharge.push(customerCharge);
            arrRevenue.push(revenue);

            totalAmazonPaid += amazonPaid;
            totalCustomerCharge += customerCharge;
            totalRevenue += revenue;

        });
        totalAmazonPaid = Number(totalAmazonPaid.toFixed(2));
        totalCustomerCharge = Number(totalCustomerCharge.toFixed(2));
        totalRevenue = Number(totalRevenue.toFixed(2));

        $(document).ready(function () {
            $('#receivedDateFrom, #receivedDateTo').inputmask({"mask": "99/99/9999"});
            if (revenueData) {
                setTimeout(function () {
                    $('#revenueChart').highcharts({
                        chart: {
                            type: 'spline'
                        },
                        title: {
                            text: revenueData.chart_title
                        },
                        xAxis: {
                            categories: revenueData.date,
                            labels: {
                                rotation: -60,
                                style: {
                                    fontSize: '13px',
                                    fontFamily: 'tahoma'
                                }
                            }
                        },
                        yAxis: {
                            min: 0,
                            allowDecimals: false,
                            labels: {
                                formatter: function () {
                                    return '$' + (this.value).toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,');
                                }
                            }
                        },
                        tooltip: {
                            pointFormat: '<span style="color:{series.color}">\u25CF</span> {series.name}: <b>${point.y}</b><br/>',
                            shared: true
                        },
                        series: [
                            {
                                name: 'Tổng số tiền phải trả cho Amazon',
                                data: arrAmazonPaid,
                                color: '#45619D'
                            },
                            {
                                name: 'Tổng số tiền thu từ khách hàng',
                                data: arrCustomerCharge,
                                color: '#A9D86E'
                            },
                            {
                                name: 'Phí nhập hàng',
                                data: arrRevenue,
                                color: '#FCB322'
                            }, {
                                type: 'pie',
                                name: 'Tổng số tiền',
                                data: [{
                                        name: 'Tổng số tiền phải trả cho Amazon',
                                        y: totalAmazonPaid,
                                        color: '#45619D'
                                    }, {
                                        name: 'Tổng số tiền thu từ khách hàng',
                                        y: totalCustomerCharge,
                                        color: '#A9D86E'
                                    }, {
                                        name: 'Phí nhập hàng',
                                        y: totalRevenue,
                                        color: '#FCB322'
                                    }],
                                center: [20, 0],
                                size: 50,
                                showInLegend: false,
                                dataLabels: {
                                    enabled: false
                                }
                            }
                        ]
                    });
                }, 1000);
            }
        });
    },
    statisticRevenueByCity: function () {
        var arrAmazonPaid = [],
                arrCustomerCharge = [],
                arrRevenue = [],
                totalAmazonPaid = 0,
                totalCustomerCharge = 0,
                totalRevenue = 0;
        var revenueData = jsonStatisticRevenueByCity ? $.parseJSON(jsonStatisticRevenueByCity) : '';
        var objCity = [];
        $.each(revenueData, function (k, v) {

            var amazonPaid = parseFloat(v.amazon_paid);
            amazonPaid = isNaN(amazonPaid) ? 0 : amazonPaid;

            var customerCharge = parseFloat(v.customer_charge);
            customerCharge = isNaN(customerCharge) ? 0 : customerCharge;

            var revenue = parseFloat(v.revenue);
            revenue = isNaN(revenue) ? 0 : revenue;

            arrAmazonPaid.push(amazonPaid);
            arrCustomerCharge.push(customerCharge);
            arrRevenue.push(revenue);

            totalAmazonPaid += amazonPaid;
            totalCustomerCharge += customerCharge;
            totalRevenue += revenue;

            objCity.push(v.city_name);

        });
        totalAmazonPaid = Number(totalAmazonPaid.toFixed(2));
        totalCustomerCharge = Number(totalCustomerCharge.toFixed(2));
        totalRevenue = Number(totalRevenue.toFixed(2));

        $(document).ready(function () {
            $('#receivedDateFrom, #receivedDateTo').inputmask({"mask": "99/99/9999"});
            if (revenueData) {
                setTimeout(function () {
                    $('#revenueChart').highcharts({
                        chart: {
                            type: 'column'
                        },
                        title: {
                            text: 'Biểu đồ thống kê doanh số theo Tỉnh / Thành'
                        },
                        xAxis: {
                            categories: objCity,
                            labels: {
                                rotation: -60,
                                style: {
                                    fontSize: '13px',
                                    fontFamily: 'tahoma'
                                }
                            }
                        },
                        yAxis: {
                            min: 0,
                            allowDecimals: false,
                            labels: {
                                formatter: function () {
                                    return '$' + (this.value).toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,');
                                }
                            }
                        },
                        tooltip: {
                            pointFormat: '<span style="color:{series.color}">\u25CF</span> {series.name}: <b>${point.y}</b><br/>',
                            shared: true
                        },
                        series: [
                            {
                                name: 'Tổng số tiền phải trả cho Amazon',
                                data: arrAmazonPaid,
                                color: '#45619D'
                            },
                            {
                                name: 'Tổng số tiền thu từ khách hàng',
                                data: arrCustomerCharge,
                                color: '#A9D86E'
                            },
                            {
                                name: 'Phí nhập hàng',
                                data: arrRevenue,
                                color: '#FCB322'
                            }, {
                                type: 'pie',
                                name: 'Tổng số tiền',
                                data: [{
                                        name: 'Tổng số tiền phải trả cho Amazon',
                                        y: totalAmazonPaid,
                                        color: '#45619D'
                                    }, {
                                        name: 'Tổng số tiền thu từ khách hàng',
                                        y: totalCustomerCharge,
                                        color: '#A9D86E'
                                    }, {
                                        name: 'Phí nhập hàng',
                                        y: totalRevenue,
                                        color: '#FCB322'
                                    }],
                                center: [20, 0],
                                size: 50,
                                showInLegend: false,
                                dataLabels: {
                                    enabled: false
                                }
                            }
                        ]
                    });
                }, 1000);
            }
        });
    },
    shipping: function () {
        var arrSurcharge = [],
                arrCharge = [],
                totalSurcharge = 0,
                totalCharge = 0;

        var shippingData = statisticShipping ? $.parseJSON(statisticShipping) : '';

        $.each(shippingData.data, function (k, v) {

            var surcharge = parseFloat(v.surcharge_shipping);
            surcharge = isNaN(surcharge) ? 0 : surcharge;

            var charge = parseFloat(v.shipping_charge);
            charge = isNaN(charge) ? 0 : charge;


            arrSurcharge.push(surcharge);
            arrCharge.push(charge);
            totalSurcharge += surcharge;
            totalCharge += charge;

        });
        totalSurcharge = Number(totalSurcharge.toFixed(2));
        totalCharge = Number(totalCharge.toFixed(2));

        $(document).ready(function () {
            $('#receivedDateFrom, #receivedDateTo').inputmask({"mask": "99/99/9999"});
            if (shippingData) {
                setTimeout(function () {
                    $('#shippingChart').highcharts({
                        chart: {
                            type: 'spline'
                        },
                        title: {
                            text: shippingData.chart_title
                        },
                        xAxis: {
                            categories: shippingData.date,
                            labels: {
                                rotation: -60,
                                style: {
                                    fontSize: '13px',
                                    fontFamily: 'tahoma'
                                }
                            }
                        },
                        yAxis: {
                            min: 0,
                            allowDecimals: false,
                            labels: {
                                formatter: function () {
                                    return '$' + (this.value).toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,');
                                }
                            }
                        },
                        tooltip: {
                            pointFormat: '<span style="color:{series.color}">\u25CF</span> {series.name}: <b>${point.y}</b><br/>',
                            shared: true
                        },
                        series: [
                            {
                                name: 'Phí vận chuyển trả thêm',
                                data: arrSurcharge,
                                color: '#45619D'
                            },
                            {
                                name: 'Phí vận chuyển',
                                data: arrCharge,
                                color: '#A9D86E'
                            }, {
                                type: 'pie',
                                name: 'Tổng số tiền',
                                data: [{
                                        name: 'Tổng số tiền phí vận chuyển trả thêm',
                                        y: totalSurcharge,
                                        color: '#45619D'
                                    }, {
                                        name: 'Tổng số tiền phí vận chuyển',
                                        y: totalCharge,
                                        color: '#A9D86E'
                                    }],
                                center: [20, 0],
                                size: 50,
                                showInLegend: false,
                                dataLabels: {
                                    enabled: false
                                }
                            }
                        ]
                    });
                }, 1000);
            }
        });
    },
    statisticShippingFeeByCity: function () {
        var arrSurchargeShippingFee = [],
                arrShippingFee = [],
                totalSurchargeShippingFee = 0,
                totalShippingFee = 0;

        var shippingFeeData = jsonStatisticShippingFeeByCity ? $.parseJSON(jsonStatisticShippingFeeByCity) : '';
        var objCity = [];
        $.each(shippingFeeData, function (k, v) {
            var surchargeShippingFee = parseFloat(v.surcharge_shipping);
            surchargeShippingFee = isNaN(surchargeShippingFee) ? 0 : surchargeShippingFee;

            var shippingFee = parseFloat(v.shipping_charge);
            shippingFee = isNaN(shippingFee) ? 0 : shippingFee;

            if (shippingFee === 0 && surchargeShippingFee === 0) {
                return true;
            }

            arrSurchargeShippingFee.push(surchargeShippingFee);
            arrShippingFee.push(shippingFee);

            totalSurchargeShippingFee += surchargeShippingFee;
            totalShippingFee += shippingFee;

            objCity.push(v.city_name);
        });
        totalSurchargeShippingFee = Number(totalSurchargeShippingFee.toFixed(2));
        totalShippingFee = Number(totalShippingFee.toFixed(2));

        $(document).ready(function () {
            $('#receivedDateFrom, #receivedDateTo').inputmask({"mask": "99/99/9999"});
            if (shippingFeeData) {
                setTimeout(function () {
                    $('#shippingChart').highcharts({
                        chart: {
                            type: 'column'
                        },
                        title: {text: 'Biểu đồ thống kê phí vận chuyển theo Tỉnh / Thành'},
                        xAxis: {
                            categories: objCity,
                            labels: {
                                rotation: -60,
                                style: {
                                    fontSize: '13px',
                                    fontFamily: 'tahoma'
                                }
                            }
                        },
                        yAxis: {
                            min: 0,
                            allowDecimals: false,
                            labels: {
                                formatter: function () {
                                    return '$' + (this.value).toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,');
                                }
                            }
                        },
                        tooltip: {
                            pointFormat: '<span style="color:{series.color}">\u25CF</span> {series.name}: <b>${point.y}</b><br/>',
                            shared: true
                        },
                        series: [
                            {
                                name: 'Phí vận chuyển trả thêm',
                                data: arrSurchargeShippingFee,
                                color: '#45619D'
                            },
                            {
                                name: 'Phí vận chuyển',
                                data: arrShippingFee,
                                color: '#A9D86E'
                            },
                            {
                                type: 'pie',
                                name: 'Tổng số tiền',
                                data: [{
                                        name: 'Tổng số tiền phí vận chuyển trả thêm',
                                        y: totalSurchargeShippingFee,
                                        color: '#45619D'
                                    },
                                    {
                                        name: 'Tổng số tiền phí vận chuyển',
                                        y: totalShippingFee,
                                        color: '#A9D86E'
                                    }],
                                center: [20, 0],
                                size: 50,
                                showInLegend: false,
                                dataLabels: {
                                    enabled: false
                                }
                            }
                        ]
                    });
                }, 1000);
            }
        });
    }, userRegistered: function () {
        $(document).ready(function () {
            var data = $.parseJSON(statisticRegUser);
            if (data) {
                var arrDate = [],
                        arrTotal = [];
                $.each(data, function (k, v) {
                    arrDate.push(k);
                    arrTotal.push(parseInt(v));
                });
                setTimeout(function () {
                    $('#userRegisteredChart').highcharts({
                        chart: {
                            type: 'spline'
                        },
                        title: {
                            text: 'Biểu đồ thống kê số lượng thành viên đăng ký tài khoản'
                        },
                        xAxis: {
                            categories: arrDate,
                            labels: {
                                rotation: -60,
                                style: {
                                    fontSize: '13px',
                                    fontFamily: 'tahoma'
                                }
                            }
                        },
                        yAxis: {
                            min: 0,
                            allowDecimals: false,
                            title: {text: 'Thành vien đăng ký'}
                        },
                        series: [
                            {
                                name: 'Tổng số thành viên đăng ký',
                                data: arrTotal,
                                color: '#45619D'
                            }
                        ]
                    });
                }, 500);

            }
        });
    },
    statisticOrderByCategory: function () {
        $(document).ready(function () {
            var result = $.parseJSON(statisticData);
            if (result) {

                var arrDate = [],
                        arrTotalPaid = [],
                        arrTotalUnPaid = [],
                        arrTotalViewed = [];
                $.each(result.data, function (k, v) {
                    arrTotalPaid.push(parseInt(v.totalPaid));
                    arrTotalUnPaid.push(parseInt(v.totalUnPaid));
                    arrTotalViewed.push(parseInt(v.totalViewed));
                });

                setTimeout(function () {
                    $('#orderChart').highcharts({
                        chart: {
                            type: 'spline'
                        },
                        title: {
                            text: 'Biểu đồ thống kê đơn hàng theo danh mục'
                        },
                        xAxis: {
                            categories: result.date,
                            labels: {
                                rotation: -70,
                                style: {
                                    fontSize: '13px',
                                    fontFamily: 'tahoma'
                                }
                            }
                        },
                        yAxis: {
                            min: 0,
                            title: {
                                text: ''
                            }
                        },
                        tooltip: {
                            pointFormat: '<span style="color:{series.color}">\u25CF</span> {series.name}: <b>{point.y}</b><br/>',
                            shared: true
                        },
                        series: [
                            {
                                name: 'Tổng lượt xem',
                                data: arrTotalViewed,
                                color: '#40B23B'
                            },
                            {
                                name: 'Tổng đơn hàng chuyển tiền',
                                data: arrTotalPaid,
                                color: '#45619D'
                            },
                            {
                                name: 'Tổng đơn hàng bị hủy và chưa thanh toán',
                                data: arrTotalUnPaid,
                                color: '#FF0000'
                            }
                        ]
                    });
                }, 1000);

            }
        });
    }
};
