var Backlink = {
    index: function () {
        $(document).ready(function () {
            //responsive
            var arrResponsiveTableWidth = ['1', '20', '55', '10', '10', '2'];
            $(window).width() <= '800' ? responsiveTable([], $('.responsiveTable'), true) : responsiveTable(arrResponsiveTableWidth, $('.responsiveTable'), true);
            $(window).on('resize', function () {
                $(this).width() <= '800' ? responsiveTable([], $('.responsiveTable'), true) : responsiveTable(arrResponsiveTableWidth, $('.responsiveTable'), true);
            });

            //var tmp = 0;

            $('#addItem').click(function () {
                itemCount += 1;
                var html = '<tr>'
                        + '<td style="text-align: center;"><span class="ordering">2</span></td>'
                        + '<td><input type="text" class="form-control" name="backlink[' + itemCount + '][text]" /></td>'
                        + '<td><input type="text" class="form-control" name="backlink[' + itemCount + '][url]" /></td>'
                        + '<td>'
                        + '<select class="form-control" name="backlink[' + itemCount + '][target]">'
                        + '<option value="_self">Default</option>'
                        + '<option value="_blank">Blank</option>'
                        + '</select>'
                        + '</td>'
                        + '<td>'
                        + '<select class="form-control" name="backlink[' + itemCount + '][rel]">'
                        + '<option value="0">Default</option>'
                        + '<option value="nofollow">Nofollow</option>'
                        + '</select>'
                        + '</td>'
                        + '<td><a class="removeBacklinkItem" style="cursor:pointer;" title="Xóa khỏi danh sách"><i class="fa fa-remove" style="font-size:1.8em;"></i></a></td>'
                        + '</tr>';
                $('#backlinkList').append(html);
                updateBacklinkOrdering();
            });

            $(document).on('click', '.removeBacklinkItem', function () {
                var quantity = $('#backlinkList').children('tr').length;
                if (quantity > 0) {
                    $(this).parents('tr').remove();
                    updateBacklinkOrdering();
                }
            });
        });
    }
}


function updateBacklinkOrdering() {
    var count = 1;
    $('td span.ordering').each(function () {
        $(this).html(count);

        count++;
    });
}