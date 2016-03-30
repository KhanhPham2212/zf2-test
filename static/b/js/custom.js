var ObjCity,ObjDistrict,ObjWard;
	$(document).ready(function(){
		$.ajax({
			url     : "<?php echo $urlCity ?>",
        	type    : "POST",
        	dataType : "json",
        	success : function(data){
        		// console.log(data);
				ObjCity     = data.listCity;
				ObjDistrict = data.listDistrict;
				ObjWard     = data.listWard;
     			
        		$(ObjCity).each(function(index,val){
        			var cityName = val.city_name;
        			var cityID   = val.city_id;
        			$("#city").append('<option value="'+cityID+'">' + cityName + '</option>');
        		})
        	} 
        });

        $("#city").change(function(){
        	$("#district").empty();
        	$("#district").append('<option value="default">Vui lòng chọn Quận / Huyện</option>');
        	var idCity = $(this).find(":selected").val();
        	$(ObjDistrict).each(function(index,val){
        		if(val.city_id === idCity){
        			var districtName = val.district_name;
        			var districtID   = val.district_id;
        			$("#district").append('<option value="'+districtID+'">' + districtName + '</option>');
        		}
        			
        	})
        })

        $("#district").change(function(){
        	$("#ward").empty();
        	$("#ward").append('<option value="default">Vui lòng chọn Phường / Xã</option>');
        	var idDistrict = $(this).find(":selected").val();

        	$(ObjWard).each(function(index,val){
        		if(val.district_id === idDistrict){
        			var wardName = val.ward_name;
        			var wardID   = val.ward_id;
        			$("#ward").append('<option value="'+wardID+'">' + wardName + '</option>');
        		}
        			
        	})
        })
	})