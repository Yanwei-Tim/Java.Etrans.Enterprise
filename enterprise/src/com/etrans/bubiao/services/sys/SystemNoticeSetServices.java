package com.etrans.bubiao.services.sys;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.etrans.bubiao.entities.PageBean;
import com.etrans.bubiao.entities.Result;
import com.etrans.bubiao.services.IbatisServices;
import com.etrans.common.util.ParamKey;
import com.etrans.common.util.json.JSONUtil;

@Service
public class SystemNoticeSetServices {
	@Autowired
	private IbatisServices ibatisServices;

	public IbatisServices getIbatisServices() {
		return ibatisServices;
	}

	public void setIbatisServices(IbatisServices ibatisServices) {
		this.ibatisServices = ibatisServices;
	}
	
	/**
	 * 分页查询系统公告信息,返回表格数据
	 * @param queryJSON
	 * @return
	 * @throws Exception
	 */
	@SuppressWarnings("unchecked")
	public PageBean getSystemNoticeSetList(Map<String,Object> params) throws Exception {
		
		PageBean pageBean = new PageBean();
		
		List<Map<String,Object>> systemNoticeList = new ArrayList<Map<String,Object>>();
		systemNoticeList=this.getSystemNoticeSet(params);
		/**处理数据的换行*/
		for(int i=0; i<systemNoticeList.size(); i++){
			String contents=systemNoticeList.get(i).get("contents").toString();
			String content=getContents(contents);
			 Map<String, Object>paramMap=new HashMap<String, Object>();
			 paramMap.put("conent", content);
			 systemNoticeList.get(i).put("newContents", content);
		}
	   
		Long total = getSystemNoticeSetCount(params);
		
		pageBean.setPage((Integer)params.get(ParamKey.PAGE));
		pageBean.setRows(systemNoticeList);
		pageBean.setTotal(total);
		
		return pageBean;
		
	}
	
/**数据添加换行*/
private String getContents(String contents){
	//把内容通过"n将其转换成数组
	String [] cons=contents.split("\n");
	String content="";
	//遍历数字,在其换行处添加<br/>
	for(int i=0;i<cons.length;i++){
	if(!(cons[i]==""||cons[i].equals(""))){
	// System.out.println("0000"+content);
	   content=content+cons[i];
	} 
	if(!(i==(cons.length-1))&&(!(cons[i]==""||cons[i].equals("")))){
		
	      content=content+"<br/>";
	 }
	}
    return content;
	
}	
	
	/**
	 * 分页查询系统公告信息
	 * @param params
	 * @return
	 * @throws Exception
	 */
	@SuppressWarnings("rawtypes")
	public List<Map<String,Object>> getSystemNoticeSet(Map params) throws Exception {
		List<Map<String,Object>>  systemNoticeSetList = this.ibatisServices.queryForList(Map.class, "getSystemNoticeSetSQL",params);
		return systemNoticeSetList;
	}
	
	/**
	 * 查询系统公告信息数量
	 * @param params
	 * @return
	 * @throws Exception
	 */
	public Long getSystemNoticeSetCount(Map<String,Object> params) throws Exception {
		return this.ibatisServices.findIbatisListCount("getSystemNoticeSetCountSQL", params);
		
	}
	
	/**
	 **新增系统公告信息
	 */

	public Object createSystemNoticeSet(Map<String,Object> params) {
		return this.ibatisServices.insertIbatisObject("insertSystemNoticeSetSQL", params);
	
	}
	
	/**
	 * 由ID查询系统公告信息
	 * @param whereMap
	 * @return
	 * @throws Exception
	 */
	public String getSystemNoticeSetById(Map<String,Object> whereMap) throws Exception {
		return	JSONUtil.toJson(this.ibatisServices.findIbatisList("getSystemNoticeSetByIdSQL", whereMap));
		
	}
	
	/**
	 *  由ID修改系统公告信息
	 * @param whereMap
	 * @return
	 * @throws Exception
	 */
	public Object updateSystemNoticeSet(Map<String,Object> whereMap) throws Exception {
		return this.ibatisServices.updateIbatisObject("updateSystemNoticeSetSQL", whereMap);
	}
	
	/**
	 * 由ID删除系统公告信息
	 * @param whereMap
	 * @return 
	 * @return
	 * @throws Exception
	 */
	public Object deleteSystemNoticeSet(Map<String,Object> whereMap) throws Exception {
		
		return this.ibatisServices.deleteIbatisObject("deleteSystemNoticeSetSQL", whereMap);
	}
	
	/**
	 * 验证不能有相同的名称
	 * @param whereMap
	 * @return 
	 * @return
	 * @throws Exception
	 */
		@SuppressWarnings("unchecked")
		public Result checkSystemNoticeSet(Map whereMap) throws Exception {
		Result result = new Result();
		List<Map<String,Object>> listInfo = ibatisServices.queryForList(Map.class, "checkSystemNoticeSQL",whereMap);
		if(null!=listInfo){
			result.setData(listInfo.size());//数据
			result.setCode(1);//表示查询有数据
		}
		return result;
	}
		
		/**
		 * 设置系统公告
		 * @param whereMap
		 * @return 
		 * @return
		 * @throws Exception
		 */
		  @SuppressWarnings("unchecked")
			public Object installSystemNoticeSet(Map whereMap) throws Exception {
			
				 return this.ibatisServices.updateIbatisObject("installSystemNoticeSQL", whereMap);
			 
			
		}
		  
		  
			/**
			 * 系统公告页面显示详细信息
			 * @param whereMap
			 * @return
			 * @throws Exception
			 */
			public List<Map<String,Object>> getSystemNoticePageSet(Map whereMap) throws Exception {
				List<Map<String,Object>>  systemNoticePageList = this.ibatisServices.queryForList(Map.class, "getSystemNoticePageSQL",whereMap);
				if(systemNoticePageList.size()<=0){
					systemNoticePageList=this.ibatisServices.queryForList(Map.class, "getSystemNoticePageAllSQL",whereMap);
				}
				return systemNoticePageList;
				
			}
			
/**
 * 查询系统公告历史信息
 * **/
public List<Map<String, Object>> getSystemNoticeHistory(Map whereParam){
	try
	{
		List<Map<String,Object>> rows = this.ibatisServices.queryForList(Map.class, "getSystemNoticeHistorySQL",whereParam);
		return rows;
	} catch (Exception e)
	{
		e.printStackTrace();
		return null;
	}
}
			
}
