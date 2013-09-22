package com.etrans.bubiao.services.sys;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

import org.apache.struts2.convention.annotation.Action;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.etrans.bubiao.entities.PageBean;
import com.etrans.bubiao.entities.Result;
import com.etrans.bubiao.services.IbatisServices;
import com.etrans.common.util.ParamKey;
import com.etrans.common.util.json.JSONUtil;

@Service
public class TerminalServices {
	@Autowired
	private IbatisServices ibatisServices;

	public IbatisServices getIbatisServices() {
		return ibatisServices;
	}

	public void setIbatisServices(IbatisServices ibatisServices) {
		this.ibatisServices = ibatisServices;
	}
	/**
	 * 分页查询终端信息,返回表格数据
	 * @param queryJSON
	 * @return
	 * @throws Exception
	 */
	public PageBean getTerminals(Map<String,Object> params) throws Exception {
		
		PageBean pageBean = new PageBean();
		
		List<Map<String,Object>> terminalList = this.getTerminalList(params);
		Long total = getTerminalCount(params);
		
		pageBean.setPage((Integer)params.get(ParamKey.PAGE));
		pageBean.setRows(terminalList);
		pageBean.setTotal(total);
		
		return pageBean;
		
	}
	
	
	
	/**
	 * 分页查询终端信息
	 * @param params
	 * @return
	 * @throws Exception
	 */
	@SuppressWarnings({ "rawtypes", "unchecked" })
	public List<Map<String,Object>> getTerminalList(Map params) throws Exception {
		
		List<Map<String,Object>> TerminalList = new ArrayList<Map<String,Object>>();
		Boolean isSuper=(Boolean)params.get("isSuper");
		Boolean isWorkUnitSuperAdmin = (Boolean)params.get("isWorkUnitSuperAdmin");
		
		if(isSuper != null && isSuper == true){//超级用户
			TerminalList = this.ibatisServices.queryForList(Map.class, "getTerminalSQL",params);
		}else if(isWorkUnitSuperAdmin != null && isWorkUnitSuperAdmin == true){//企业管理员
			TerminalList = this.ibatisServices.queryForList(Map.class, "getTerminalSQL",params);
		}else{//普通用户
			TerminalList = this.ibatisServices.queryForList(Map.class, "getUserTerminalSQL",params);
		}
		return TerminalList;
		
	}
	
	/**
	 * 查询终端数量
	 * @param params
	 * @return
	 * @throws Exception
	 */
	public Long getTerminalCount(Map<String,Object> params) throws Exception {
		
		Boolean isSuper=(Boolean)params.get("isSuper");
		Boolean isWorkUnitSuperAdmin = (Boolean)params.get("isWorkUnitSuperAdmin");
		if(isSuper != null && isSuper == true){
			return this.ibatisServices.findIbatisListCount("getTerminalsCountSQL", params);
		}else if(isWorkUnitSuperAdmin != null && isWorkUnitSuperAdmin == true){
			return this.ibatisServices.findIbatisListCount("getTerminalsCountSQL", params);
		}else{
			return this.ibatisServices.findIbatisListCount("getUserTerminalsCountSQL", params);
		}
		
	}
	
	/**
	 **新增终端信息详细
	 * @param whereMap
	 * @return
	 * @throws Exception
	 */
	@Action(value = "createTerminal")
	public Object createTerminal(Map<String,Object> params) {
		String commNoNew=params.get("CommNO").toString();
		if(commNoNew.length()!=11){
			commNoNew=	this.rightAutomaticZero("000000000000"+commNoNew, 11);
		}
        params.put("CommNO", commNoNew);
		return this.ibatisServices.insertIbatisObject("insertTerminalSQL", params);
	
	}
	
	
	/**
	 * 自动补零
	 * @param str  要补的字符串
	 * @param pos  位数
	 * @return
	 */
	public static String rightAutomaticZero(String str,int pos){ 
        String   str1=new   StringBuffer(str).reverse().substring(0,pos); 
        StringBuffer   sb=new   StringBuffer(str1).reverse(); 
        return   sb.toString(); 

   }
	

	
	 
	/**
	 * 由ID查询终端详细
	 * @param whereMap
	 * @return
	 * @throws Exception
	 */
	public String getTerminalById(Map<String,Object> whereMap) throws Exception {
		return	JSONUtil.toJson(this.ibatisServices.findIbatisList("getTerminalByIdSQL", whereMap));
		
	}
	
	/**
	 * 由ID修改终端信息详细
	 * @param whereMap
	 * @return 
	 * @return
	 * @throws Exception
	 */
	public Object updateTerminal(Map<String,Object> whereMap) throws Exception {
	
		return this.ibatisServices.updateIbatisObject("updateTerminalSQL", whereMap);
		
	}
	
	/**
	 * 由ID删除终端信息
	 * @param whereMap
	 * @return 
	 * @return
	 * @throws Exception
	 */
	public Object deleteTerminal(Map<String,Object> whereMap) throws Exception {
		
		return this.ibatisServices.deleteIbatisObject("deleteTerminalSQL", whereMap);
		
	}
	
	/**
	 * 验证不能有相同的通信号
	 * @param whereMap
	 * @return 
	 * @return
	 * @throws Exception
	 */
		@SuppressWarnings("unchecked")
		public Result checkCommNo(Map whereMap) throws Exception {
		Result result = new Result();
		List<Map<String,Object>> listInfo = ibatisServices.queryForList(Map.class, "checkCommnoSQL",whereMap);
		if(null!=listInfo){
			result.setData(listInfo.size());//数据
			result.setCode(1);//表示查询有数据
		}
		return result;
	}
	
}
