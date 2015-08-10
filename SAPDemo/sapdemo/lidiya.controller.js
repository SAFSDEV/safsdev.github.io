var global_debug = true;
var global_lidiya_controller_filename = "lidiya.controller.js";

sap.ui.controller("sapdemo.lidiya", {

	/**
	 * Called when a controller is instantiated and its View controls (if available) are already created.
	 * Can be used to modify the View before it is displayed, to bind event handlers and do other one-time initialization.
	 * @memberOf sapdemo.lidiya
	 */
	onInit: function() {
//		this.debugStop();//close previously opened debug log if exist
//		this.debugInit();
	},

	/**
	 * Similar to onAfterRendering, but this hook is invoked before the controller's View is re-rendered
	 * (NOT before the first rendering! onInit() is used for that one!).
	 * @memberOf sapdemo.lidiya
	 */
//	onBeforeRendering: function() {

//	},

	/**
	 * Called when the View has been rendered (so its HTML is part of the document). Post-rendering manipulations of the HTML could be done here.
	 * This hook is the same one that SAPUI5 controls get after being rendered.
	 * @memberOf sapdemo.lidiya
	 */
//	onAfterRendering: function() {

//	},

	/**
	 * Called when the Controller is destroyed. Use this one to free resources and finalize activities.
	 * @memberOf sapdemo.lidiya
	 */
	onExit: function() {
		this.debugStop();
	},

	debugInit : function(){
		var url = '/SAPDemo/debuglog?configdebug=init';
        jQuery.ajax({
            type : "GET",
            url : url,
            async: false,//we should wait for the debugger get prepared
            dataType: "text",
            success: function(data){
        		if(global_debug){
        			//data is returned as a link to the debug log file on the server
        			//data is like 'http://localhost:8888/SAPDemo/download/debuglog_127.0.0.1_1393232553660.txt'
        			global_lidiya_view.updateDebugBar("Get Debug log message from file: ", "DebugLog", data, false);
        		}
            },
        	error: function(xhr, error, exception){
        		alert(error);
        	}
        });
	},
	
	debugStop : function(){
//		document.location.href='/SAPDemo/debuglog?configdebug=stop';
		jQuery.ajax({
			type : "GET",
			url : '/SAPDemo/debuglog?configdebug=stop',
//			async: false,
            success: function(data){
            	global_lidiya_view.updateDebugBar(undefined,undefined,undefined,true);
            },
		});
	},
	
	debug: function(debugmsg, oEvent){
		if(global_debug){
			var message = "";
			if(debugmsg!=undefined && (typeof debugmsg=="string")){
				message = debugmsg;
			}
			if(oEvent!=undefined && (oEvent instanceof sap.ui.base.Event)){
				message = oEvent.getSource().getId() + " does it: "+message;
			}
			
	        jQuery.ajax({
	            type : "GET",
	            url : '/SAPDemo/debuglog?debugmsg='+debugmsg,
	            async: false
	        });
		}
	},
	
	selectTab: function(tabStrip, tabId){
		if(tabStrip!=undefined){
			var tab = undefined;
			
			tab = sap.ui.getCore().byId(tabId);
			if(tab==undefined){
				var tabs = tabStrip.getTabs();
				var tabText = global_bundle.getText(tabId);
				for(var i=0;i<tabs.length;i++){
					if(tabs[i].getText()==tabText){
						tab = tabs[i];
					}
				}
			}
			
			if(tab!=undefined){
				var index = tabStrip.indexOfTab(tab);
				tabStrip.setSelectedIndex(index);
				tabStrip.fireSelect({'index':index});		
			}else{
				this.debug("Can not find tab for id '"+tabId+"'");
			}
		}else{
			this.debug("The parameter tabStrip is undefined.");
		}
	},
	
	/**
	 * 
	 * @param treenode
	 * @returns {String} the full path of this treenode, like 'root->child->grandchild'
	 */
	getTreeFullPath: function(treenode){
		var path = "";
		while(treenode!=undefined && treenode instanceof sap.ui.commons.TreeNode){
			if(path=="") path = treenode.getText();
			else		 path = treenode.getText()+"->"+path;
			treenode = treenode.getParent();
		}
		return path;
	},
	
	/**
	 * getRows() can only get the row number of the view (rows shown on page), if we want<br>
	 * the real row number of the whole table, we need to call this function.<br>
	 * @param oTable sap.ui.table.Table
	 * @returns the total row number of the table.
	 */
	getTableModelRowLength: function(oTable){
		if(oTable==undefined){
			this.debug("The parameter oTable is undefined.");
		}else{
			var rowsBinding = oTable.getBinding("rows");
			var length = undefined;
			if(rowsBinding!=undefined) length = rowsBinding.getLength();
			
			if(length==undefined){
				var tableModel = oTable.getModel();
				var data = tableModel.getData();
				alert(data);
			}
			var tableModel = oTable.getModel();
			var data = tableModel.getData();
			var debugmsg = "Table Model Data has properties: ";
			for(var propertyname in data){
				debugmsg += propertyname+", ";
			}
			this.debug(debugmsg);

			if(length==undefined){
				this.debug("Cannot deduce the table total row number.");
			}else{
				return length;
			}
			
		}
	},
	
	/**
	 * create a JSONModel and load it with data fetched from url, then return the JSONModel.
	 * <b>NOTE:</b>The root tag is "/jsondata".
	 * @param url	String, the url can return a json data
	 */
	getJSONModel: function(url){
		var oModel = new sap.ui.model.json.JSONModel();
		
		var debugmsg = global_lidiya_controller_filename+".getJSONModel(): ";
		this.debug(debugmsg+" ajax requesting json data from '"+url+"'.");
		try{
			$.ajax({
				type: "GET",
				url: url,
				async: false,
				dataType: "json",
				success: function(data){
					oModel.setData({"jsondata": data});
//					oModel.setData({data});
					global_controller.debug(debugmsg+" success get json data.");
				},
				error: function(xhr, error, exception){
					global_controller.debug(debugmsg+" fail with error='"+error+"', exception='"+exception+"'");
				}
			});
			
		}catch(error){
			this.debug(debugmsg+ "Met error '"+error+"'");
		}
		
		return oModel;
	},

});