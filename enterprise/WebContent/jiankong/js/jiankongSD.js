/**数据库参数**/
//G10:
//TransmitIP=121.33.255.142,TransmitPort=6213,TransmitPort_TCP=6226,ID=14000373675,Kind=815,Channel=1&2&3&4,RegistrationNO=桂A20607 
// 
//TransmitIP：注册服务器IP
//TransmitPort：注册服务器端口
//TransmitPort_TCP：注册服务端口TCP协议使用
//ID：终端通信号
//Kind：终端类型（固定）
//Channel：终端通道列表 1&2&3&4 表示 安装有1、2、3、4    4个通道
//RegistrationNO：车牌号码


/**初始化**/
$(function(){
//	alert('注册服务器IP:'+TransmitIP);
//	alert('注册服务器端口:'+TransmitPort);
//	alert('终端通信号 :'+ID);
//	alert('终端类型:'+Kind);
//	alert('终端通道列表:'+Channel);
	onloadDevice(TransmitIP,TransmitPort,ID,Kind,Channel);
});



/**全局变量**/
var objOcxID = []; //ocxID数组
var objOcxIDNumber=[];//通道数组
var SDClientRegDll;//隐藏的.dll文件obj对象

/**
*加载
*TransmitIP 注册服务器IP
*TransmitPort 注册服务器端口
*ID 终端通信号 
*Kind 终端类型（固定）
*Channel 终端通道列表 1&2&3&4 表示 安装有1、2、3、4    4个通道
*RegistrationNO 车牌号码
*/
function onloadDevice(TransmitIP,TransmitPort,ID,Kind,Channel,RegistrationNO){
	/**全局变量**/
	objOcxID=[];
	objOcxIDNumber=[];
	
	//通道数
	objOcxIDNumber=Channel.split('-');
	//ocxID
	var objId; //obj控件id
	for (var i = 1; i < objOcxIDNumber.length+1; i++) {
		objId = "UserProxy" + i;
		objOcxID.push(objId);
	}
	/**得到视频对象**/
	SDClientRegDll= window.document.getElementById("SDClientRegDll");
	/**TransmitIP=121.33.255.142,TransmitPort=6213,TransmitPort_TCP=6226,ID=14000373614,Kind=815,Channel=1&2&3&4,RegistrationNO=桂A81653**/
	/**************注册服务器dll文件************/
	//连接上服务器
	//SDClientRegDll.ConnectToSrv('121.33.255.142',6226);
	//SDClientRegDll.GetVMSC("14000373571");
	SDClientRegDll.ConnectToSrv(TransmitIP,TransmitPort);
	//向服务器获取3G视频服务地址
	SDClientRegDll.GetVMSC(ID);
}

/**
 * 关闭视频
 * @return
 */
function closeDevice(op){
	//alert(op);
	var objOcx = window.document.getElementById(op);
	//关闭连接
	objOcx.CloseVideo();
}

/**
 * 关闭所有的视频通道
 * @return
 */
function clsoDeviceAll(){
	//alert("关闭所有的视频通道");
	/**先关闭**/
	closeDevice("UserProxy1");
	closeDevice("UserProxy2");
	closeDevice("UserProxy3");
	closeDevice("UserProxy4");
}
















