<%@ page language="java" import="java.util.*" pageEncoding="utf-8"%>
<%@page import="com.etrans.common.util.Tools"%>
<%
	String path = request.getContextPath();
	String basePath = request.getScheme() + "://"
			+ request.getServerName() + ":" + request.getServerPort()
			+ path + "/";
			
			//视频服务器ip
			String TransmitIP = new String(request.getParameter("TransmitIP").getBytes("ISO-8859-1"),"utf-8");
			//设置类型
			String Kind = request.getParameter("Kind");
			//视频设备ID
			String ID=request.getParameter("ID");
			//通道个数
			String Channel = new String(request.getParameter("Channel").getBytes("ISO-8859-1"),"utf-8");
%>
<html>
<head>
<base href="<%=basePath%>"></base>
<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
<title></title>

<script type="text/javascript" src="<%=basePath%>jiankong/jquery-1.7.1.min.js"></script>
<script type="text/javascript" src="<%=basePath%>jiankong/js/jiankong.js"></script>

<!------------------- 全屏---------------------->
<script language="javascript" type="text/javascript" for="UserProxy1" event="OnDoubleClick(x,y)">
  	FullScreen();
</script>
<script language="javascript" type="text/javascript" for="UserProxy2" event="OnDoubleClick(x,y)">
  	FullScreen();
</script>
<script language="javascript" type="text/javascript" for="UserProxy3" event="OnDoubleClick(x,y)">
  	FullScreen();
</script>
<script language="javascript" type="text/javascript" for="UserProxy4" event="OnDoubleClick(x,y)">
  	FullScreen();
</script>
    
<script type="text/javascript">
	var TransmitIP='<%=TransmitIP%>';
	var Kind ='<%=Kind%>';
	var ID ='<%=ID%>';
	var Channel='<%=Channel%>';
</script>
	
</head>
<body  style="background-color: transparent;">
    <input type="text" id="txtWindowType" value="4" style="display: none" />
    <center>
        <table  width="670px;">
            <tr>
              <td ><object  id="UserProxy1" style="width: 330px; height: 175px;background-color:#485869;" IsCamera="0" classid="clsid:E24D8362-0622-4D15-94AA-2E83A6616EAC" 
                        value="0">
                <a href="<%=basePath%>jiankong/software/Netvideo.exe" style="color:red; font-family:'宋体';">下载播放软件</a>
              </object></td>
		   <td>
		   	     <object id="UserProxy2"  style="width: 330px; height: 175px;background-color:#485869;" IsCamera="0" classid="clsid:E24D8362-0622-4D15-94AA-2E83A6616EAC"
                        value="0">
						<a href="<%=basePath%>jiankong/software/Netvideo.exe" style="color:red; font-family:'宋体';">下载播放软件</a>
                </object>
				</td>
            </tr>
            <tr>
                <td style="background-color: #485869">
                <center>
                    <img onclick="Stop('UserProxy1')" src="<%=basePath%>jiankong/VideoMonitoringImg/stop.gif" alt="停止播放" title="停止播放" style="cursor: pointer;" />
<%--                    <img id="UserProxy1Video" onclick="RecordOrStopRecord('UserProxy1')" src="<%=basePath%>jiankong/VideoMonitoringImg/video.gif" alt="开始录像" title="开始录像" style="cursor: pointer;" />--%>
<%--                    <img onclick="CapturePic('UserProxy1')" src="<%=basePath%>jiankong/VideoMonitoringImg/photoGraph.gif" alt="照相" title="照相" style="cursor: pointer;" />--%>
                    <img onclick="FullScreen('UserProxy1')" src="<%=basePath%>jiankong/VideoMonitoringImg/fullScreen.gif" alt="全屏" title="全屏" style="cursor: pointer;" />
                    <img onclick="SetEnableSound('UserProxy1',0)" src="<%=basePath%>jiankong/VideoMonitoringImg/close.gif" alt="静音" title="静音" style="cursor: pointer;" />                
                </center>    
                </td>
                <td style="background-color: #485869">
                <center>
                    <img onclick="Stop('UserProxy2')" src="<%=basePath%>jiankong/VideoMonitoringImg/stop.gif" alt="停止播放" title="停止播放" style="cursor: pointer;" />
<%--                    <img id="UserProxy2Video" onclick="RecordOrStopRecord('UserProxy2')" src="<%=basePath%>jiankong/VideoMonitoringImg/video.gif" alt="开始录像" title="开始录像" style="cursor: pointer;" />--%>
<%--                    <img onclick="CapturePic('UserProxy2')" src="<%=basePath%>jiankong/VideoMonitoringImg/photoGraph.gif" alt="照相" title="照相" style="cursor: pointer;" />--%>
                    <img onclick="FullScreen('UserProxy2')" src="<%=basePath%>jiankong/VideoMonitoringImg/fullScreen.gif" alt="全屏" title="全屏" style="cursor: pointer;" />
                    <img onclick="SetEnableSound('UserProxy2',0)" src="<%=basePath%>jiankong/VideoMonitoringImg/close.gif" alt="静音" title="静音" style="cursor: pointer;" />                
                 </center>
                 </td>
            </tr>
            <tr>
			<!--iscamera="0"-->
              <td >
                    <object id="UserProxy3" style="width: 330px; height: 175px; background-color:#485869;" IsCamera="0" classid="clsid:E24D8362-0622-4D15-94AA-2E83A6616EAC"
                        value="0" >
						<a href="<%=basePath%>jiankong/software/Netvideo.exe" style="color:red; font-family:'宋体';">下载播放软件</a>
                    </object>
					</td>
					<td>
                    <object id="UserProxy4" style="width: 330px; height: 175px; background-color:#485869;" IsCamera="0" classid="clsid:E24D8362-0622-4D15-94AA-2E83A6616EAC"
                        value="0">
						<%--http://www.macromedia.com/go/getflashplayer--%>
						<a href="<%=basePath%>jiankong/software/Netvideo.exe" style="color:red; font-family:'宋体';">下载播放软件</a>
                    </object></td>
            </tr>
             <tr>
                <td style="background-color: #485869">
                    <center>
                    <img onclick="Stop('UserProxy3')" src="<%=basePath%>jiankong/VideoMonitoringImg/stop.gif" alt="停止播放" title="停止播放" style="cursor: pointer;" />
<%--                    <img id="UserProxy3Video" onclick="RecordOrStopRecord('UserProxy3')" src="<%=basePath%>jiankong/VideoMonitoringImg/video.gif" alt="开始录像" title="开始录像" style="cursor: pointer;" />--%>
<%--                    <img onclick="CapturePic('UserProxy3')" src="<%=basePath%>jiankong/VideoMonitoringImg/video.gif" alt="照相" title="照相" style="cursor: pointer;" />--%>
                    <img onclick="FullScreen('UserProxy3')" src="<%=basePath%>jiankong/VideoMonitoringImg/fullScreen.gif" alt="全屏" title="全屏" style="cursor: pointer;" />
                    <img onclick="SetEnableSound('UserProxy3',0)" src="<%=basePath%>jiankong/VideoMonitoringImg/close.gif" alt="静音" title="静音" style="cursor: pointer;" />
                    </center>
                 </td>
                <td style="background-color: #485869">
                 <center>
                    <img onclick="Stop('UserProxy4')" src="<%=basePath%>jiankong/VideoMonitoringImg/stop.gif" alt="停止播放" title="停止播放" style="cursor: pointer;" />
<%--                    <img id="UserProxy4Video" onclick="RecordOrStopRecord('UserProxy4')" src="<%=basePath%>jiankong/VideoMonitoringImg/video.gif" alt="开始录像" title="开始录像" style="cursor: pointer;" />--%>
<%--                    <img onclick="CapturePic('UserProxy4')" src="<%=basePath%>jiankong/VideoMonitoringImg/photoGraph.gif" alt="照相" title="照相" style="cursor: pointer;" />--%>
                    <img onclick="FullScreen('UserProxy4')" src="<%=basePath%>jiankong/VideoMonitoringImg/fullScreen.gif" alt="全屏" title="全屏" style="cursor: pointer;" />
                    <img onclick="SetEnableSound('UserProxy4',0)" src="<%=basePath%>jiankong/VideoMonitoringImg/close.gif" alt="静音"  title="静音" style="cursor: pointer;" />                
                  </center>
                </td>
            </tr>
        </table>
    </center>
</body>
</html>
