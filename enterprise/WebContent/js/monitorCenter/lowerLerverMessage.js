
var time; // 定时器



$(function(){
	
	initTableDate();
	
});

function initTableDate()
{

	var tbody="";
	
	$.ajax({
		url:"monitorCenter/getLowerPlatFormInfo.action",
		type:"POST",
		dataType:"json",
		success:function(data){
		$("#alarmList tr:gt(0)").remove();
		$(data).each(function(i,n){
			var info = n.split(",");
			var msg = info[3]+"," +info[4] ;
			tbody +="<tr>"
				+"<td>"+info[0]+"</td>"
				+"<td>"+info[1]+"</td>"
				+"<td align='left'>"+msg+"</td>";
				tbody+="</tr>";
		});
		
		$("#alarmList").append(tbody);
		$("#alarmList tr:odd").addClass("odd");
		$("#alarmList tr:even").addClass("even");
		
	   }
		
	});
	
	setTimeout('initTableDate()', 5000);

}


