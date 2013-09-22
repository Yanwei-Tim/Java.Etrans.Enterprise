package com.etrans.bubiao.services.sys;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.etrans.bubiao.entities.EntCustomMapPoint;
import com.etrans.bubiao.entities.PageBean;
import com.etrans.bubiao.entities.Result;
import com.etrans.bubiao.services.IbatisServices;
import com.etrans.common.util.ParamKey;
import com.etrans.common.util.json.JSONUtil;

@Service
public class EntCustomMapPointServices {
	@Autowired
	private IbatisServices ibatisServices;

	public IbatisServices getIbatisServices() {
		return ibatisServices;
	}

	public void setIbatisServices(IbatisServices ibatisServices) {
		this.ibatisServices = ibatisServices;
	}
	
	/**
	 * 分页查询兴趣点信息,返回表格数据
	 * @param queryJSON
	 * @return
	 * @throws Exception
	 */
	public PageBean getEntCustomMapPointList(Map<String,Object> params) throws Exception {
		PageBean pageBean = new PageBean();
		List<Map<String,Object>> customMapPointList = this.getEntCustomMap(params);
		Long total = getEntCustomMapPointCount(params);
		pageBean.setPage((Integer)params.get(ParamKey.PAGE));
		pageBean.setRows(customMapPointList);
		pageBean.setTotal(total);
		return pageBean;
		
	}
	
	
	
	/**
	 * 分页查询地图自定义信息,返回表格数据
	 * @param queryJSON
	 * @return
	 * @throws Exception
	 */
	public PageBean getEntCustomMapList(Map<String,Object> params) throws Exception {
		PageBean pageBean = new PageBean();
		List<Map<String,Object>> customMapPointList = this.getEntCustomMap(params);
		Long total = getEntCustomMapCount(params);
		pageBean.setPage((Integer)params.get(ParamKey.PAGE));
		pageBean.setRows(customMapPointList);
		pageBean.setTotal(total);
		return pageBean;
		
	}
	
	/**
	 * 分页查询地图自定义信息
	 * @param params
	 * @return
	 * @throws Exception
	 */
	@SuppressWarnings("unchecked")
	public List<Map<String,Object>> getEntCustomMap(Map params) throws Exception {
		List<Map<String,Object>>  customMapPointList = this.ibatisServices.queryForList(Map.class, "getEntCustomMapSQL",params);
		return customMapPointList;
	}
	
	/**
	 * 查询地图自定义信息数量
	 * @param params
	 * @return
	 * @throws Exception
	 */
	public Long getEntCustomMapCount(Map<String,Object> params) throws Exception {
		return this.ibatisServices.findIbatisListCount("getEntCustomMapCountSQL", params);
		
	}
	
	
	
	/**
	 * 分页查询兴趣点信息
	 * @param params
	 * @return
	 * @throws Exception
	 */
	@SuppressWarnings("unchecked")
	public List<Map<String,Object>> getEntCustomMapPoint(Map params) throws Exception {
		List<Map<String,Object>>  customMapPointList = this.ibatisServices.queryForList(Map.class, "getEntCustomMapPointSQL",params);
		return customMapPointList;
	}
	
	/**
	 * 查询兴趣点信息数量
	 * @param params
	 * @return
	 * @throws Exception
	 */
	public Long getEntCustomMapPointCount(Map<String,Object> params) throws Exception {
		return this.ibatisServices.findIbatisListCount("getEntCustomMapPointCountSQL", params);
		
	}
	
	/**
	 **新增兴趣点信息--对象
	 */

//	public Long createEntCustomMapPoint(EntCustomMapPoint cm) {
//		return this.ibatisServices.insertReturnId("insEntCustomMapPointSQL", cm);
//	
//	}
	
	
	/**
	 **新增兴趣点信息--map
	 */

	public Object createEntCustomMapPoint(Map<String,Object> params) {
		return this.ibatisServices.insertIbatisObject("insEntCustomMapPointSQL", params);
	
	}
	
	
	
	
	/**
	 * 由ID删除兴趣点信息
	 * @param whereMap
	 * @return 
	 * @return
	 * @throws Exception
	 */
	public Object deleteEntCustomMapPoint(Map<String,Object> whereMap) throws Exception {
		return this.ibatisServices.deleteIbatisObject("deleteEntCustomMapPointSQL", whereMap);
	}
	
	
	
	/**
	 * 验证不能有相同的名称
	 * @param whereMap
	 * @return 
	 * @return
	 * @throws Exception
	 */
		@SuppressWarnings("unchecked")
		public Result checkEntCustomMapPoint(Map whereMap) throws Exception {
			Result result = new Result();
			List<Map<String,Object>> listInfo = ibatisServices.queryForList(Map.class, "checkEntCustomMapPointSQL",whereMap);
			if(null!=listInfo){
				result.setData(listInfo.size());//数据
				result.setCode(1);//表示查询有数据
			}
			return result;
	   }
		
		
		public List<HashMap<String, String>> checkEntCustomMapPointList(Map<String, Object> paramMap) {
			try {
				List<HashMap<String, String>> resultstr = ibatisServices.findIbatisList("checkEntCustomMapPointSQL", paramMap);
				return resultstr;
			} catch (Exception e) {
				e.printStackTrace();
			}
			return null;
		}
		
		public List<HashMap<String, String>> getEntCustomMapPointByName(Map<String, Object> paramMap) {
			try {
				List<HashMap<String, String>> resultstr = ibatisServices.findIbatisList("getEntCustomMapPointByNameSQL", paramMap);
				return resultstr;
			} catch (Exception e) {
				e.printStackTrace();
			}
			return null;
		}
		
		
		public List<Map<String,Object>> getEntCustomMapIcon() throws Exception {
			List<Map<String,Object>> list = this.ibatisServices.queryForList(Map.class, "getEntCustomMapIconSQL",new HashMap());
			return list;
		}
		
		
		/**
		 * 由ID查询兴趣点图标
		 * @param whereMap
		 * @return
		 * @throws Exception
		 */
		public String getEntCustomMapIconById(Map<String,Object> whereMap) throws Exception {
			return	JSONUtil.toJson(this.ibatisServices.findIbatisList("getEntCustomMapIconByIdSQL", whereMap));
			
		}
		
		
		public List<HashMap<String, String>> getEntCustomMapPointByIdList(Map<String, Object> paramMap) {

			try {
				List<HashMap<String, String>> resultstr = ibatisServices.findIbatisList("getEntCustomMapPointByIdListSQL", paramMap);
				return resultstr;
			} catch (Exception e) {
				e.printStackTrace();
			}
			return null;
		}
		
		public List<HashMap<String, String>> getEntCustomMapPointByUserList(Map<String, Object> paramMap) {

			try {
				List<HashMap<String, String>> resultstr = ibatisServices.findIbatisList("getEntCustomMapPointByUserListSQL", paramMap);
				return resultstr;
			} catch (Exception e) {
				e.printStackTrace();
			}
			return null;
		}
		
		
		public Object createEntCustomMap(Map<String,Object> params) {
			return this.ibatisServices.insertIbatisObject("insEntCustomMapSQL", params);
		
		}
		
		public List<HashMap<String, String>> checkCustomMap(Map<String, Object> paramMap) {
			try {
				List<HashMap<String, String>> resultstr = ibatisServices.findIbatisList("checkCustomMapSQL", paramMap);
				return resultstr;
			} catch (Exception e) {
				e.printStackTrace();
			}
			return null;
		}
		
		public List<HashMap<String, String>> getEntCustomMapByName(Map<String, Object> paramMap) {
			try {
				List<HashMap<String, String>> resultstr = ibatisServices.findIbatisList("getEntCustomMapByNameSQL", paramMap);
				return resultstr;
			} catch (Exception e) {
				e.printStackTrace();
			}
			return null;
		}
		
		/**
		 * 由ID删除地图自定义信息
		 * @param whereMap
		 * @return 
		 * @return
		 * @throws Exception
		 */
		public Object deleteEntCustomMap(Map<String,Object> whereMap) throws Exception {
			return this.ibatisServices.deleteIbatisObject("deleteEntCustomMapSQL", whereMap);
		}
		
		
		/**
		 * 跟据用户查询自定义信息
		 * @param paramMap
		 * @return
		 */
		public List<HashMap<String, String>> getEntCustomMapByUserList(Map<String, Object> paramMap) {

			try {
				List<HashMap<String, String>> resultstr = ibatisServices.findIbatisList("getEntCustomMapByUserListSQL", paramMap);
				return resultstr;
			} catch (Exception e) {
				e.printStackTrace();
			}
			return null;
		}
		
		/**
		 * 由ID修改图层信息
		 * @param whereMap
		 * @return 
		 * @return
		 * @throws Exception
		 */
		public Object updateCustomMap(Map<String,Object> whereMap) throws Exception {
			return this.ibatisServices.updateIbatisObject("updateCustomMapSQL", whereMap);
			
		}
		
		/**
		 * 根据ID查询图层信息
		 * @param whereMap
		 * @return 
		 * @return
		 * @throws Exception
		 */
		public String getEntCustomMapById(Map<String,Object> whereMap) throws Exception {
			return	JSONUtil.toJson(this.ibatisServices.findIbatisList("getEntCustomMapByIdSQL", whereMap));
			
		}
		/**
		 * 验证是否同名
		 * @param whereMap
		 * @return
		 * @throws Exception
		 */
		public Result checkCustomMaps(Map whereMap) throws Exception {
			Result result = new Result();
			List<Map<String,Object>> listInfo = ibatisServices.queryForList(Map.class, "checkCustomMapSQL",whereMap);
			if(null!=listInfo){
				result.setData(listInfo.size());//数据
				result.setCode(1);//表示查询有数据
			}
			return result;
		}
		
}
