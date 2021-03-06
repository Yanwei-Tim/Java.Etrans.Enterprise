/**
 * InitSelectServices.java
 * Create on 2012-4-26 15:43:24
 * Copyright (c) 2012 by e_trans.
 */
package com.etrans.bubiao.services.sys;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.etrans.bubiao.auth.SessionUser;
import com.etrans.bubiao.entities.Tree;
import com.etrans.bubiao.http.Result;
import com.etrans.bubiao.services.IbatisServices;
import com.etrans.bubiao.sys.UserContext;
import com.etrans.common.util.json.JSONUtil;

@Service
public class TreeServices {

	@Autowired
	private IbatisServices ibatisServices;

	public IbatisServices getIbatisServices() {
		return ibatisServices;
	}
	public void setIbatisServices(IbatisServices ibatisServices) {
		this.ibatisServices = ibatisServices;
	}

	/**
	 * 行业类型
	 * 
	 * @return
	 * @throws Exception
	 */
	@SuppressWarnings("unchecked")
	public String getTradeKindTree(String id) throws Exception {
		// 行业类型
		List<Map<String, String>> tradeKinds = null;
		if (id == null || id.equals("")) {
			tradeKinds = this.ibatisServices.queryForList(Map.class,
					"getTradeKindsSQL", new HashMap());
		}

		// 组装树
		List<Tree> trees = null;

		if (null != tradeKinds && tradeKinds.size() > 0) {
			trees = new ArrayList<Tree>(tradeKinds.size());
			Tree tree = null;
			for (Map<String, String> map : tradeKinds) {
				tree = new Tree();
				tree.setId(String.valueOf(map.get("id")));
				tree.setState(null);
				tree.setIconCls("icon-vehicle");
				tree.setText(String.valueOf(map.get("name").toString().trim()));
				trees.add(tree);
			}
		}
		return JSONUtil.toJson(trees);
	}

	/**
	 * 区域树形
	 * 
	 * @param mapWhere
	 * @param id
	 * @return
	 * @throws Exception
	 */
	@SuppressWarnings("unchecked")
	public String getAreaTreeList(Map mapWhere, String id) throws Exception {

		StringBuilder jsonString = new StringBuilder();
		jsonString.append("[");
		List<Map<String, String>> areas = null;
		String parentFullId = "";

		if (id == null || id.equals("")) {
			areas = this.ibatisServices.queryForList(Map.class,
					"getAreaRootSQL", new HashMap());
		} else {
			parentFullId = id;
		}
		if (!parentFullId.equals("")) {
			areas = this.ibatisServices.queryForList(Map.class,
					"getAreaTreeSQL", mapWhere);
			;
		}

		if (areas != null && areas.size() > 0) {
			for (Map<String, String> map : areas) {
				jsonString.append("{");
				jsonString.append("\"id\":\"" + String.valueOf(map.get("id"))
						+ "|" + (String) map.get("fullId") + "\",");
				jsonString.append("\"text\":\""
						+ ((String) map.get("name")).trim() + "\",");
				jsonString.append("\"iconCls\":\"icon-group\",");
				jsonString.append("\"state\":\"closed\"");
				jsonString.append("}");
				jsonString.append(",");
			}
			jsonString.deleteCharAt(jsonString.toString().length() - 1);

		}

		jsonString.append("]");
		 System.out.println("---------------:"+jsonString.toString());
		return jsonString.toString();

	}

	
	/**
	 * 模糊查询区域树形
	 * 
	 * @param mapWhere
	 * @param id
	 * @return
	 * @throws Exception
	 */
	@SuppressWarnings("unchecked")
	public String getAreaTreeLists(Map mapWhere, String id,String level) throws Exception {
		
		List<HashMap<String, String>> list = null;
		List<Map<String, String>> areas = null;
		String[] b=null;
		String[] c=null;
		String[] d=null;
		String[] e=null;
		String[] f=null;
		String[] g=null;
		StringBuilder jsonString = new StringBuilder();
		StringBuilder jsonString1 = new StringBuilder();
		StringBuilder jsonString2 = new StringBuilder();
		StringBuilder str = new StringBuilder();
		StringBuilder fullidStr = new StringBuilder();
		jsonString.append("[");
		
       //得到模糊查询词汇
		String name=mapWhere.get("name").toString();
		Map paramMap = new HashMap();
		paramMap.put("name", new String(name.getBytes("ISO-8859-1"), "gbk"));
		  //根据模糊词汇查询区域FULLID、level字段
			list = this.ibatisServices.queryForList(Map.class,"getAreaFullIDByNameSQL",paramMap);
			if (list != null || "".equals(list)) {
				for (int i = 0; i < list.size(); i++) {
					str.append(list.get(i).get("FullID").toString()+"x");
				}
				System.out.println("str:"+str.toString());
				c=str.toString().split("x");
				for (int i = 0; i <c.length; i++) {
					if(c.length==1){
						fullidStr.append(c[0].substring(0, str.length() - 1).replace("." ,"="));
					}else{
						fullidStr.append(c[i].replace("." ,"=")+"-");
					}
				}
				
				
				System.out.println("fullidStr:"+fullidStr.toString().substring(0, fullidStr.length() - 1));
				d=fullidStr.substring(0, fullidStr.length() - 1).split("-");
				for (int i = 0; i < d.length; i++) {
					if(d.length==1){
						b=d[0].split("=");
						if(id!=null){
							String fullid1=null;
							String fullids=id;
							int level1=1;
							fullids+="."+b[Integer.parseInt(level)];
							level1+=Integer.parseInt(level);
							fullid1 = fullids.substring(0, fullids.length() - 1);
							paramMap.put("fullid1", fullids);
							paramMap.put("level1", level1);
							if(level1>=3){
								areas = this.ibatisServices.queryForList(Map.class,
										"getAreaTree2SQL", paramMap);
							}else{
								areas = this.ibatisServices.queryForList(Map.class,
										"getAreaTree1SQL", paramMap);
							}
							
					
				      }else{
							String fullid1=null;
							String level1=null;
							fullid1=b[0];//省
							level1="1";
							paramMap.put("fullid1", fullid1);
							paramMap.put("level1", level1);
							areas = this.ibatisServices.queryForList(Map.class,
									"getAreaTree1SQL", paramMap);
						}
					}else{
						b=d[i].split("=");
						String ids="";
						String ids1="";
						
						if(id!=null){
							if(id.length()==8){
								ids=id;
							}else{
								ids=id.toString().replace(".", "=");
							}
							
							for (int j = 0; j < d.length; j++) {
								if(d[j].indexOf(ids)>=0&&d[j].length()==ids.length()+9){
									ids1+=d[j]+"-";
								}
							}
							g=ids1.substring(0, ids1.length() - 1).split("-");
							for (int z = 0; z < g.length; z++) {
								String fullid1=null;
								String fullids=id;
								f=g[z].split("=");
								int level1=1;
								System.out.println(f[Integer.parseInt(level)].toString());
								fullids+="."+f[Integer.parseInt(level)];
								level1+=Integer.parseInt(level);
								fullid1 = fullids.substring(0, fullids.length() - 1);
								paramMap.put("fullid1", fullids);
								paramMap.put("level1", level1);
								areas = this.ibatisServices.queryForList(Map.class,
										"getAreaTree1SQL", paramMap);
							}
//							f=ids.split("=");
//							String fullid1=null;
//							String fullids=id;
//							int level1=1;
//							System.out.println(f[Integer.parseInt(level)].toString());
//							fullids+="."+f[Integer.parseInt(level)];
//							level1+=Integer.parseInt(level);
//							fullid1 = fullids.substring(0, fullids.length() - 1);
//							paramMap.put("fullid1", fullids);
//							paramMap.put("level1", level1);
//							areas = this.ibatisServices.queryForList(Map.class,
//									"getAreaTree1SQL", paramMap);
					
				      }else{
							String fullid1=null;
							String level1=null;
							fullid1=b[0];//省
							level1="1";
							paramMap.put("fullid1", fullid1);
							paramMap.put("level1", level1);
							areas = this.ibatisServices.queryForList(Map.class,
									"getAreaTree1SQL", paramMap);
							
						
						}
						
					}
					if (areas != null && areas.size() > 0) {
						for (Map<String, String> map : areas) {
							jsonString.append("{");
							jsonString.append("\"id\":\"" + String.valueOf(map.get("id"))
									+ "|" + (String) map.get("fullId")+"|"+ String.valueOf(map.get("level")) + "\",");
							jsonString.append("\"text\":\""
									+ ((String) map.get("name")).trim() + "\",");
							jsonString.append("\"iconCls\":\"icon-group\",");
							jsonString.append("\"state\":\"closed\"");
							jsonString.append("}");
							jsonString.append(",");
							
							jsonString1.append("{");
							jsonString1.append("\"id\":\"" + String.valueOf(map.get("id"))
									+ "|" + (String) map.get("fullId")+"|"+ String.valueOf(map.get("level")) + "\",");
							jsonString1.append("\"text\":\""
									+ ((String) map.get("name")).trim() + "\",");
							jsonString1.append("\"iconCls\":\"icon-group\",");
							jsonString1.append("\"state\":\"closed\"");
							jsonString1.append("}");
							jsonString1.append("#");
						}

					}

				}
								
				
			}
	   
//		if(id!=null){
//					
//					String fullid1=null;
//					String fullids=id;
//					int level1=1;
//					fullids+="."+b[Integer.parseInt(level)];
//					level1+=Integer.parseInt(level);
//					fullid1 = fullids.substring(0, fullids.length() - 1);
//					paramMap.put("fullid1", fullids);
//					paramMap.put("level1", level1);
//					areas = this.ibatisServices.queryForList(Map.class,
//							"getAreaTree1SQL", paramMap);
//			
//		}else{
//			
//					
//					String fullid1=null;
//					String level1=null;
//					fullid1=b[0];//省
//					level1="1";
//					paramMap.put("fullid1", fullid1);
//					paramMap.put("level1", level1);
//					areas = this.ibatisServices.queryForList(Map.class,
//							"getAreaTree1SQL", paramMap);
//				}
//		
//		if (areas != null && areas.size() > 0) {
//			for (Map<String, String> map : areas) {
//				jsonString.append("{");
//				jsonString.append("\"id\":\"" + String.valueOf(map.get("id"))
//						+ "|" + (String) map.get("fullId")+"|"+ String.valueOf(map.get("level")) + "\",");
//				jsonString.append("\"text\":\""
//						+ ((String) map.get("name")).trim() + "\",");
//				jsonString.append("\"iconCls\":\"icon-group\",");
//				jsonString.append("\"state\":\"closed\"");
//				jsonString.append("}");
//				jsonString.append(",");
//				
//				jsonString1.append("{");
//				jsonString1.append("\"id\":\"" + String.valueOf(map.get("id"))
//						+ "|" + (String) map.get("fullId")+"|"+ String.valueOf(map.get("level")) + "\",");
//				jsonString1.append("\"text\":\""
//						+ ((String) map.get("name")).trim() + "\",");
//				jsonString1.append("\"iconCls\":\"icon-group\",");
//				jsonString1.append("\"state\":\"closed\"");
//				jsonString1.append("}");
//				jsonString1.append("#");
//			}

//		}
	    jsonString.deleteCharAt(jsonString.toString().length() - 1);
		jsonString.append("]");
		
		jsonString1.deleteCharAt(jsonString1.toString().length() - 1);
		
		
		System.out.println("-------111111111111111--------:"+jsonString.toString());
//		jsonString1.append(jsonString.toString()+"x");
		System.out.println("-------22222222222222--------:"+jsonString1.toString());
		e=jsonString1.toString().split("#");
		List<String> list1 = new ArrayList<String>(); 
		for (int i = 0; i < e.length; i++) {
			if(!list1.contains(e[i])){
				list1.add(e[i]);
			}
		}
		
		String[] newStr =  list1.toArray(new String[1]); 
		jsonString2.append("[");
		for (String element:newStr ) {     
			System.out.print(element + ",");  
			jsonString2.append(element + ",");
		}
		jsonString2.deleteCharAt(jsonString2.toString().length() - 1);
		jsonString2.append("]");
		
		System.out.println("-------3333333--------:"+jsonString2.toString());
		return jsonString2.toString();
	}
	/**
	 * 企业树形
	 * 
	 * @param mapWhere
	 * @param id
	 * @return
	 * @throws Exception
	 */
	@SuppressWarnings("unchecked")
	public String getWorkUnitTreeList(String id) throws Exception {

		//拼接树字符串结果
		StringBuilder jsonString = new StringBuilder();
		jsonString.append("[");
		
		List<Map<String,Object>> areas = new ArrayList<Map<String,Object>>();
		
		String parentFullId = "";
		
		//获得用户所属企业完整id并且保存到查询条件集合中
		SessionUser user = UserContext.getLoginUser();
		if(id == null || id.equals("")){
			//得到最高级别的单位
			Result result = this.getRootWorkUnit();
			areas = (List<Map<String,Object>>)result.getData();			
		}
		//超级管理员UserContext.isBsRootUser()
		else if(UserContext.isBsRootUser()){
			parentFullId = id;
		}
		//企业管理员&&user.isWorkUnitSuperAdmin()
		else if(user!=null&&user.isWorkUnitSuperAdmin()){
			parentFullId = id;
		}
		//如果父id不等于空
		if(!parentFullId.equals("")){
			if(parentFullId!="null" && parentFullId!=null){
				String[] ary = id.split("\\|");
				String []str=new String[2];
				 for (int i = 0; i < ary.length; i++){ 
					 str[i]=ary[i];
				 }
                  
				 parentFullId=str[1];
			}
			Map whereMap = new HashMap();
			whereMap.put("parentFullId", parentFullId.trim());
			areas = this.ibatisServices.queryForList(Map.class, "getWorkUnitTreeSQL",whereMap);
		}
		
		

		//如果结果不等于空
		if(areas!=null && areas.size()>0){
			for(Map<String,Object> map : areas){
				jsonString.append("{");
				jsonString.append("\"id\":\"" + String.valueOf(map.get("ID"))
						+ "|" + (String) map.get("FullID") + "\",");
				jsonString.append("\"text\":\"" + ((String)map.get("Name")).trim() + "\",");
				jsonString.append("\"iconCls\":\"icon-group\",");
				jsonString.append("\"state\":\"closed\"");
				jsonString.append("}");
				jsonString.append(",");
			}
			jsonString.deleteCharAt(jsonString.toString().length() - 1);
		}
		
		jsonString.append("]");
		return jsonString.toString();
	}
	
	
	/**
	 * 查询最高级别单位
	 * @param whereMap
	 * @return
	 * @throws Exception
	 */
	@SuppressWarnings("unchecked")
	public Result getRootWorkUnit() throws Exception {
		Result result = new Result();
		Map params = new HashMap();
		//获得用户所属企业完整id并且保存到查询条件集合中
		SessionUser user = UserContext.getLoginUser();
		if(user != null){
			//超级管理员UserContext.isBsRootUser()
			if(UserContext.isBsRootUser()){
				params.put("lengths", 8);
			}
			//企业管理员或者是普通用户
			else{
				params = user.getParamsOrFullid(params);
			}
		}
		List<Map<String,Object>> listInfo = this.ibatisServices.queryForList(Map.class, "getWorkUnitRootSQL",params);
		result.setData(listInfo);
		return result;
	}
	

	/**
	 * 车辆树形
	 * 
	 * @param mapWhere
	 * @param id
	 * @return
	 * @throws Exception
	 */
	
	@SuppressWarnings("unchecked")
	public String getVehicleTreeList(SessionUser sessionUser,String registrationNo) throws Exception {
		List<HashMap<String, String>> list = null;
		String userId = String.valueOf(sessionUser.getUserID());
		String fullId = String.valueOf(sessionUser.getWorkUnitID());
		Map paramMap = new HashMap();

	
		if(registrationNo!=null){
//			System.out.println("车牌号码=============================："+new String(registrationNo.getBytes("ISO-8859-1"), "gbk"));
			if (UserContext.isBsRootUser()) {// 超级管理员
				paramMap.put("registrationNo", new String(registrationNo.getBytes("ISO-8859-1"), "gbk"));
				list = this.ibatisServices.queryForList(Map.class,"getAdminsesVehicleIdSQL",paramMap);
			} else {
				if (sessionUser.isWorkUnitSuperAdmin()) {// 企业管理员
					paramMap.put("fullId", fullId);
					paramMap.put("registrationNo", new String(registrationNo.getBytes("ISO-8859-1"), "gbk"));
					list = this.ibatisServices.queryForList(Map.class,
							"getAdminVehicleIdSQL", paramMap);

				} else {// 普通用户
					paramMap.put("userId", userId);
					paramMap.put("registrationNo", new String(registrationNo.getBytes("ISO-8859-1"), "gbk"));
					list = this.ibatisServices.queryForList(Map.class,
							"getVehicleIdstatSQL", paramMap);
				}
			}

		}else{
			if (UserContext.isBsRootUser()) {// 超级管理员
				list = this.ibatisServices.findIbatisList("getAdminsesVehicleIdSQL");
			} else {
				if (sessionUser.isWorkUnitSuperAdmin()) {// 企业管理员
					paramMap.put("fullId", fullId);
					list = this.ibatisServices.queryForList(Map.class,
							"getAdminVehicleIdSQL", paramMap);

				} else {// 普通用户
					paramMap.put("userId", userId);
					list = this.ibatisServices.queryForList(Map.class,
							"getVehicleIdstatSQL", paramMap);
				}
			}

		}
		
		// 组装树
		List<Tree> trees = null;

		if (null != list && list.size() > 0) {
			trees = new ArrayList<Tree>(list.size());
			Tree tree = null;
			for (Map<String, String> map : list) {
				tree = new Tree();
				tree.setId(String.valueOf(map.get("id")));
				tree.setState("closed");
				tree.setIconCls("icon-group");
				tree.setText(String.valueOf(map.get("registrationNo")
						.toString().trim()));
				trees.add(tree);
			}
		}
		return JSONUtil.toJson(trees);
	}

	/**
	 * 车牌颜色
	 * 
	 * @return
	 * @throws Exception
	 */
	@SuppressWarnings("unchecked")
	public String getRegistrationNoColorTree(String id) throws Exception {
		// 车牌颜色
		List<Map<String, String>> tradeKinds = null;
		if (id == null || id.equals("")) {
			tradeKinds = this.ibatisServices.queryForList(Map.class,
					"getRegistrationNoColorsSQL", new HashMap());

		}

		// 组装树
		List<Tree> trees = null;

		if (null != tradeKinds && tradeKinds.size() > 0) {
			trees = new ArrayList<Tree>(tradeKinds.size());
			Tree tree = null;
			for (Map<String, String> map : tradeKinds) {
				tree = new Tree();
				tree.setId(String.valueOf(map.get("id")));
				tree.setState(null);
				tree.setIconCls("icon-vehicle");
				tree.setText(String.valueOf(map.get("name").toString().trim()));
				tree.setChildren(null);
				trees.add(tree);
			}
		}
		return JSONUtil.toJson(trees);
	}
	
	
	
	/**
	 * 车辆类型
	 * 
	 * @return
	 * @throws Exception
	 */
	@SuppressWarnings("unchecked")
	public String getVehicleKindTree(String id,String kindNames) throws Exception {
		// 车辆类型
		List<Map<String, String>> vehicleKinds = null;
		Map paramMap = new HashMap();
		if(kindNames!=null){
			paramMap.put("kindNames", new String(kindNames.getBytes("ISO-8859-1"), "gbk"));
			if (id == null || id.equals("")) {
				vehicleKinds = this.ibatisServices.queryForList(Map.class,
						"getKindsSQL", paramMap);
			}
		}else{
			if (id == null || id.equals("")) {
				vehicleKinds = this.ibatisServices.queryForList(Map.class,
						"getKindsSQL", paramMap);
			}
		}
		

		// 车辆类型
		List<Tree> trees = null;

		if (null != vehicleKinds && vehicleKinds.size() > 0) {
			trees = new ArrayList<Tree>(vehicleKinds.size());
			Tree tree = null;
			for (Map<String, String> map : vehicleKinds) {
				tree = new Tree();
				tree.setId(String.valueOf(map.get("id")));
				tree.setState(null);
				tree.setIconCls("icon-vehicle");
				tree.setText(String.valueOf(map.get("name").toString().trim()));
				trees.add(tree);
			}
		}
		return JSONUtil.toJson(trees);
	}
	
	/**
	 * 车牌类型
	 * 
	 * @return
	 * @throws Exception
	 */
	@SuppressWarnings("unchecked")
	public String getRegistrationNoKindTree(String id,String vehicleRCKinds) throws Exception {
		// 车牌类型
		List<Map<String, String>> registrationNoKinds = null;
		Map paramMap = new HashMap();
		if(vehicleRCKinds!=null){
			paramMap.put("vehicleRCKinds", new String(vehicleRCKinds.getBytes("ISO-8859-1"), "gbk"));
			if (id == null || id.equals("")) {
				registrationNoKinds = this.ibatisServices.queryForList(Map.class,
						"getRegistrationNoKindsSQL", paramMap);
			}
		}else{
			if (id == null || id.equals("")) {
				registrationNoKinds = this.ibatisServices.queryForList(Map.class,
						"getRegistrationNoKindsSQL", paramMap);
			}
		}

		// 组装树
		List<Tree> trees = null;

		if (null != registrationNoKinds && registrationNoKinds.size() > 0) {
			trees = new ArrayList<Tree>(registrationNoKinds.size());
			Tree tree = null;
			for (Map<String, String> map : registrationNoKinds) {
				tree = new Tree();
				tree.setId(String.valueOf(map.get("id")));
				tree.setState(null);
				tree.setIconCls("icon-vehicle");
				tree.setText(String.valueOf(map.get("name").toString().trim()));
				trees.add(tree);
			}
		}
		return JSONUtil.toJson(trees);
	}
	
	
	/**
	 * 车辆颜色
	 * 
	 * @return
	 * @throws Exception
	 */
	@SuppressWarnings("unchecked")
	public String getVehicleColorTree(String id) throws Exception {
		// 车辆颜色
		List<Map<String, String>> vehicleColors = null;
		if (id == null || id.equals("")) {
			vehicleColors = this.ibatisServices.queryForList(Map.class,
					"getColorsSQL", new HashMap());
		}

		// 组装树
		List<Tree> trees = null;

		if (null != vehicleColors && vehicleColors.size() > 0) {
			trees = new ArrayList<Tree>(vehicleColors.size());
			Tree tree = null;
			for (Map<String, String> map : vehicleColors) {
				tree = new Tree();
				tree.setId(String.valueOf(map.get("id")));
				tree.setState(null);
				tree.setIconCls("icon-vehicle");
				tree.setText(String.valueOf(map.get("name").toString().trim()));
				trees.add(tree);
			}
		}
		return JSONUtil.toJson(trees);
	}
	
	
	/**
	 * 终端号码
	 * 
	 * @return
	 * @throws Exception
	 */
	@SuppressWarnings("unchecked")
	public String getTerminalTree(String id,String workUnitId,String terminalName) throws Exception {
		// 终端号码
		Map paramMap = new HashMap();
		paramMap.put("workUnitId", workUnitId);
		List<Map<String, String>> terminals = null;
		
		if(terminalName!=null){
			paramMap.put("terminalName", new String(terminalName.getBytes("ISO-8859-1"), "gbk"));
			if (id == null || id.equals("")) {
				terminals = this.ibatisServices.queryForList(Map.class,
						"getTerminalsSQL", paramMap);
			}
		}else{
			if (id == null || id.equals("")) {
				terminals = this.ibatisServices.queryForList(Map.class,
						"getTerminalsSQL", paramMap);
			}
		}

		// 组装树
		List<Tree> trees = null;

		if (null != terminals && terminals.size() > 0) {
			trees = new ArrayList<Tree>(terminals.size());
			Tree tree = null;
			for (Map<String, String> map : terminals) {
				tree = new Tree();
				tree.setId(String.valueOf(map.get("id")));
				tree.setState(null);
				tree.setIconCls("icon-vehicle");
				tree.setText(String.valueOf(map.get("name").toString().trim()));
				trees.add(tree);
			}
		}
		return JSONUtil.toJson(trees);
	}
	
	/**
	 * 终端类型
	 * 
	 * @return
	 * @throws Exception
	 */
	@SuppressWarnings("unchecked")
	public String getTerminalKindIDTree(String id,String terminalKindName) throws Exception {
		// 终端号码
		Map paramMap = new HashMap();
		List<Map<String, String>> list = null;
		
		
		if(terminalKindName!=null){
			paramMap.put("terminalKindName", new String(terminalKindName.getBytes("ISO-8859-1"), "gbk"));
			if (id == null || id.equals("")) {
				list = this.ibatisServices.queryForList(Map.class,
						"initTerminalKindSQL", paramMap);
			}
		}else{
			if (id == null || id.equals("")) {
				list = this.ibatisServices.queryForList(Map.class,
						"initTerminalKindSQL", paramMap);
			}
		}

		// 组装树
		List<Tree> trees = null;

		if (null != list && list.size() > 0) {
			trees = new ArrayList<Tree>(list.size());
			Tree tree = null;
			for (Map<String, String> map : list) {
				tree = new Tree();
				tree.setId(String.valueOf(map.get("id")));
				tree.setState(null);
				tree.setIconCls("icon-vehicle");
				tree.setText(String.valueOf(map.get("name").toString().trim()));
				trees.add(tree);
			}
		}
		return JSONUtil.toJson(trees);
	}
	
	/**
	 * Sim卡号码
	 * 
	 * @return
	 * @throws Exception
	 */
	@SuppressWarnings("unchecked")
	public String getSimTree(String id,String workUnitId,String simName) throws Exception {
		// 终端号码
		Map paramMap = new HashMap();
		paramMap.put("workUnitId", workUnitId);
		List<Map<String, String>> list = null;
		
		if(simName!=null){
			paramMap.put("simName", new String(simName.getBytes("ISO-8859-1"), "gbk"));
			if (id == null || id.equals("")) {
				list = this.ibatisServices.queryForList(Map.class,
						"getSimsSQL", paramMap);
			}
		}else{
			if (id == null || id.equals("")) {
				list = this.ibatisServices.queryForList(Map.class,
						"getSimsSQL", paramMap);
			}
		}
		
		// 组装树
		List<Tree> trees = null;

		if (null != list && list.size() > 0) {
			trees = new ArrayList<Tree>(list.size());
			Tree tree = null;
			for (Map<String, String> map : list) {
				tree = new Tree();
				tree.setId(String.valueOf(map.get("id")));
				tree.setState(null);
				tree.setIconCls("icon-vehicle");
				tree.setText(String.valueOf(map.get("code").toString().trim()));
				//tree.setText(String.valueOf(map.get("phoneNO").toString().trim()));
				
				trees.add(tree);
			}
		}
		return JSONUtil.toJson(trees);
	}
	
	
	/**
	 * 所属车队
	 * 
	 * @return
	 * @throws Exception
	 */
	@SuppressWarnings("unchecked")
	public String getVehicleTeamTree(String id,String workUnitId,String teamNames) throws Exception {
		// 所属车队
		Map paramMap = new HashMap();
		paramMap.put("workUnitId", workUnitId);
		List<Map<String, String>> vehicleTeams = null;
		
		
		if(teamNames!=null){
			paramMap.put("teamNames", new String(teamNames.getBytes("ISO-8859-1"), "gbk"));
			if (id == null || id.equals("")) {
				vehicleTeams = this.ibatisServices.queryForList(Map.class,
						"checkVehicleTeamSQL", paramMap);
			}
		}else{
			if (id == null || id.equals("")) {
				vehicleTeams = this.ibatisServices.queryForList(Map.class,
						"checkVehicleTeamSQL", paramMap);
			}
		}

		// 组装树
		List<Tree> trees = null;

		if (null != vehicleTeams && vehicleTeams.size() > 0) {
			trees = new ArrayList<Tree>(vehicleTeams.size());
			Tree tree = null;
			for (Map<String, String> map : vehicleTeams) {
				tree = new Tree();
				tree.setId(String.valueOf(map.get("id")));
				tree.setState(null);
				tree.setIconCls("icon-vehicle");
				tree.setText(String.valueOf(map.get("name").toString().trim()));
				trees.add(tree);
			}
		}
		return JSONUtil.toJson(trees);
	}
	
	
	/**
	 * 司机
	 * 
	 * @return
	 * @throws Exception
	 */
	@SuppressWarnings("unchecked")
	public String getSecondDriverTree(String id,String workUnitId,String secondDriver) throws Exception {
		// 司机
		Map paramMap = new HashMap();
		paramMap.put("workUnitId", workUnitId);
		
		List<Map<String, String>> drivers = null;
		if(secondDriver!=null){
			paramMap.put("secondDriver", new String(secondDriver.getBytes("ISO-8859-1"), "gbk"));
			if (id == null || id.equals("")) {
				drivers = this.ibatisServices.queryForList(Map.class,
						"getSecondDriversSQL", paramMap);
			}
		}else{
			if (id == null || id.equals("")) {
				drivers = this.ibatisServices.queryForList(Map.class,
						"getSecondDriversSQL", paramMap);
			}
		}
		
		
		

		// 组装树
		List<Tree> trees = null;

		if (null != drivers && drivers.size() > 0) {
			trees = new ArrayList<Tree>(drivers.size());
			Tree tree = null;
			for (Map<String, String> map : drivers) {
				tree = new Tree();
				tree.setId(String.valueOf(map.get("id")));
				tree.setState(null);
				tree.setIconCls("icon-vehicle");
				tree.setText(String.valueOf(map.get("name").toString().trim()));
				trees.add(tree);
			}
		}
		return JSONUtil.toJson(trees);
	}
	
	/**
	 * 司机
	 * 
	 * @return
	 * @throws Exception
	 */
	@SuppressWarnings("unchecked")
	public String getDriverTree(String id,String workUnitId,String dirver) throws Exception {
		// 司机
		Map paramMap = new HashMap();
		paramMap.put("workUnitId", workUnitId);
		List<Map<String, String>> drivers = null;
		if(dirver!=null){
			paramMap.put("dirver", new String(dirver.getBytes("ISO-8859-1"), "gbk"));
			if (id == null || id.equals("")) {
				drivers = this.ibatisServices.queryForList(Map.class,
						"getDriversSQL", paramMap);
			}
		}else{
			if (id == null || id.equals("")) {
				drivers = this.ibatisServices.queryForList(Map.class,
						"getDriversSQL", paramMap);
			}
		}
		
		
		

		// 组装树
		List<Tree> trees = null;

		if (null != drivers && drivers.size() > 0) {
			trees = new ArrayList<Tree>(drivers.size());
			Tree tree = null;
			for (Map<String, String> map : drivers) {
				tree = new Tree();
				tree.setId(String.valueOf(map.get("id")));
				tree.setState(null);
				tree.setIconCls("icon-vehicle");
				tree.setText(String.valueOf(map.get("name").toString().trim()));
				trees.add(tree);
			}
		}
		return JSONUtil.toJson(trees);
	}
	/**
	 * 用途
	 * 
	 * @return
	 * @throws Exception
	 */
	@SuppressWarnings("unchecked")
	public String getUsagesTree(String id,String vehicleUsages) throws Exception {
		// 用途
		
		List<Map<String, String>> usages = null;
		Map paramMap = new HashMap();
		if(vehicleUsages!=null){
			paramMap.put("vehicleUsages", new String(vehicleUsages.getBytes("ISO-8859-1"), "gbk"));
			if (id == null || id.equals("")) {
				usages = this.ibatisServices.queryForList(Map.class,
						"getUsagesSQL", paramMap);
			}
		}else{
			if (id == null || id.equals("")) {
				usages = this.ibatisServices.queryForList(Map.class,
						"getUsagesSQL", paramMap);
			}
		}
		
		
		// 组装树
		List<Tree> trees = null;

		if (null != usages && usages.size() > 0) {
			trees = new ArrayList<Tree>(usages.size());
			Tree tree = null;
			for (Map<String, String> map : usages) {
				tree = new Tree();
				tree.setId(String.valueOf(map.get("id")));
				tree.setState(null);
				tree.setIconCls("icon-vehicle");
				tree.setText(String.valueOf(map.get("name").toString().trim()));
				trees.add(tree);
			}
		}
		return JSONUtil.toJson(trees);
	}
	
	
	/**
	 * 品牌
	 * 
	 * @return
	 * @throws Exception
	 */
	@SuppressWarnings("unchecked")
	public String getBandTree(String id) throws Exception {
		// 品牌
		List<Map<String, String>> bands = null;
		if (id == null || id.equals("")) {
			bands = this.ibatisServices.queryForList(Map.class,
					"getBandsSQL",new HashMap());
		}

		// 组装树
		List<Tree> trees = null;

		if (null != bands && bands.size() > 0) {
			trees = new ArrayList<Tree>(bands.size());
			Tree tree = null;
			for (Map<String, String> map : bands) {
				tree = new Tree();
				tree.setId(String.valueOf(map.get("id")));
				tree.setState(null);
				tree.setIconCls("icon-vehicle");
				tree.setText(String.valueOf(map.get("name").toString().trim()));
				trees.add(tree);
			}
		}
		return JSONUtil.toJson(trees);
	}
	
	
	
	/**
	 * 厂商
	 * 
	 * @return
	 * @throws Exception
	 */
	@SuppressWarnings("unchecked")
	public String getManufactoryTree(String id) throws Exception {
		// 厂商
		List<Map<String, String>> bands = null;
		if (id == null || id.equals("")) {
			bands = this.ibatisServices.queryForList(Map.class,
					"getManufactorysSQL",new HashMap());
		}

		// 组装树
		List<Tree> trees = null;

		if (null != bands && bands.size() > 0) {
			trees = new ArrayList<Tree>(bands.size());
			Tree tree = null;
			for (Map<String, String> map : bands) {
				tree = new Tree();
				tree.setId(String.valueOf(map.get("id")));
				tree.setState(null);
				tree.setIconCls("icon-vehicle");
				tree.setText(String.valueOf(map.get("name").toString().trim()));
				trees.add(tree);
			}
		}
		return JSONUtil.toJson(trees);
	}

}
