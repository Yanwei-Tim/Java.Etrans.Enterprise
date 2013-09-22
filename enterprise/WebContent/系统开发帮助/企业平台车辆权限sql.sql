-------------------------------------------------------------
---查询车辆的逻辑
---目前用到此逻辑的模块有【登陆时查车保存到session中】
---【报警设置模块的车辆组管理选车功能】【报表查询模块的车辆】【车辆多选、车辆输入框自动补全】
----------------------------------------------------------------


--企业平台超级管理员车辆权限
SELECT 
				pve.id,pve.registrationNO,pve.WorkUnitID,
				pve.registrationNO+'|'+pvc.name +'|'+f.name+'|'+d.name + '|'+k.phoneNo AS NoColor
		 	FROM 
			 	Pub_Vehicle pve, --车辆表
			 	Pub_REGISTRATIONnOCOLOR pvc , --车牌颜色表
			 	pub_workUnit d,--企业表
			 	Pub_TradeKind f,--车辆类型表
			 	Pub_Terminal j ,--终端表
			 	pub_simcard k --sim卡表
		 	WHERE 
			 	pve.RegistrationNOColorID = pvc.id  AND 
			 	pve.WorkUnitID = d.id AND
	 		 	pve.TradeKindID=f.id  and 
				(pve.isDeleted!=1 or pve.isdeleted is null) AND 
				pve.TerminalID = j.id AND 
				j.simID= k.id


--企业管理员
SELECT 
		 		a.id,a.registrationNO,a.WorkUnitID,
		 		a.RegistrationNO+'|'+e.name+'|'+f.name+'|'+d.name +'|'+k.phoneNo  AS NoColor
		 	FROM 
		 		Pub_Vehicle a ,--车辆表
		 		Pub_REGISTRATIONnOCOLOR e , --车牌颜色表
		 		pub_workUnit d, --企业表
		 		Pub_TradeKind f,--车辆类型表
		 		Pub_Terminal j ,--终端表
		 		pub_simcard k --sim卡表
		 	WHERE 
		 		a.RegistrationNOColorID=e.id AND 
		 		a.WorkUnitID = d.id AND
 		 		a.TradeKindID=f.id  AND 
				(a.isDeleted!=1 or a.isdeleted is null) and 
				a.TerminalID = j.id AND 
				j.simID= k.id  --要改Pub_Terminal终端表中的simid
				and d.fullId LIKE '%118%'
----------
--中间还有查询授权组数据的sql
----------



--普通用户
SELECT 
			DISTINCT 
			a.id,a.registrationNO,a.WorkUnitID,
			a.RegistrationNO +'|'+ e.name+'|'+f.name+'|'+d.name  +'|'+k.phoneNo AS NoColor
		FROM pub_vehicle a, --车辆表
							(
							--获取角色下面权限的车辆组
							SELECT  
								DISTINCT a.VehicleGroupID  
							FROM (
								--角色下面有多少车辆组begin
								SELECT 
									*
								FROM Pub_VehicleGroupPurview c --角色和车辆组关联表
								WHERE 
									c.UserGroupID IN(
										SELECT  a.id  
											FROM  Pub_UserGroup a, --角色
												  Pub_UserAndGroup b  --用户和角色关联表
										WHERE   
											a.id=b.usergroupid  AND  
											b.userId=66)
									--角色下面有多少车辆组end
									) 
								a, 
								Pub_GroupVehicle c  --车辆组和车辆的关联表 
							WHERE 
								a.VehicleGroupID = c.VehicleGroupID
			)
			b, --车辆组id列表
			Pub_GroupVehicle c , --车辆和车辆组的关联表
			Pub_REGISTRATIONnOCOLOR e, --车牌样色
			pub_workUnit d, --企业表
			Pub_TradeKind f,--车辆类型表
			Pub_Terminal j ,--终端表
		 	pub_simcard k	--sim卡表
		WHERE 
			a.id=c.VehicleID AND --车辆id等于（车辆和车辆组的关联表）中的车辆id
			c.VehicleGroupID=b.VehicleGroupID AND --
			a.RegistrationNOColorID = e.id and 
			a.TradeKindID=f.id AND 
			a.workunitid=d.id AND 
			a.WorkUnitID=118 AND 
			(a.isDeleted!=1 or a.isdeleted is null) and 
			a.TerminalID = j.id AND 
			j.simID= k.id
