var global_lidiya_view_filename = "lidiya.view.js";
var global_lidiya_view;
var global_bundle;
var global_mainLayout;
var global_controller;

var employeePersonalInfoModel;
var employeesidModel;
var organizationModel;
var employeesModel;

sap.ui.jsview("sapdemo.lidiya", {

	/** Specifies the Controller belonging to this View. 
	* In the case that it is not implemented, or that "null" is returned, this View does not have a Controller.
	* @memberOf sapdemo.lidiya
	*/ 
	getControllerName : function() {
		return "sapdemo.lidiya";
	},

	/** Is initially called once after the Controller has been instantiated. It is the place where the UI is constructed. 
	* Since the Controller is given to this method, its event handlers can be attached right away. 
	* @memberOf sapdemo.lidiya
	*/ 
	createContent : function(oController) {
		//Create a set of controls to return as the whole view content
		var aControls = [];
		
		try{
			//Assign the global objects
			global_lidiya_view = this;
			global_controller = oController;
			global_bundle = this.getResourceBundle();
			global_mainLayout = this.getMainLayout(global_bundle);
			
			//Initialize the debugger
			oController.debugStop();//close previously opened debug log if exist
			oController.debugInit();
			
			//initialize some data models
			employeePersonalInfoModel = global_controller.getJSONModel("data/employeePersonalInfo.json");
			employeesidModel = global_controller.getJSONModel("data/employeesid.json");
			organizationModel = global_controller.getJSONModel("data/organization.json");
			employeesModel = global_controller.getJSONModel("data/employees.json");

			
			var tabStripContent = this.getCenterContent(global_bundle);
			var menubarContent = this.getMenuBarContent(global_bundle);
			global_mainLayout.getTop().addContent(menubarContent);
			global_mainLayout.getCenter().addContent(tabStripContent);
			aControls.push(global_mainLayout);
			
	//		var oButton = new sap.ui.commons.Button({
	//			id : this.createId("MyButton"),
	//			text : "Hello JS view"
	//		});
	//		aControls.push(oButton.attachPress(oController.doIt ));
				
//			oController.selectTab(tabStripContent, "toolbar.mort.text");
//			oController.selectTab(tabStripContent, "toolbar.basc.text");
			oController.selectTab(tabStripContent, "toolbar.jpan.text");
	//		oController.selectTab(tabStripContent, "toolbar.jtree.text");
	//		oController.selectTab(tabStripContent, "toolbar.jtree2.text");
	//		oController.selectTab(tabStripContent, "toolbar.jtable.text");
	//		oController.selectTab(tabStripContent, "toolbar.jtable2.text");

		}catch(error){
			try{
				global_controller.debug("Met an error '"+error+"'");
				
				var deubgArea = sap.ui.getCore().byId("layout.bottom.debug");
				var errorTextView = new sap.ui.commons.TextView({
					text: "Sorry for a bug.",
					design: sap.ui.commons.TextViewDesign.Bold
				}).addStyleClass("errorIindicationLabel");
				
				aControls.push(errorTextView);
				aControls.push(deubgArea);
				
				oController.debugStop();
				
			}catch(err){}
		}
		
		return aControls;
	},
	
	/**
	 * Return the resource bundle, which is used to get i18n string according to the locale
	 * @return jQuery.sap.util.ResourceBundle
	 */
	getResourceBundle: function(){
		var aLocale = new sap.ui.core.Configuration().getLocale();
//		var aLocale = new sap.ui.core.Configuration().getLanguage();
//		alert(aLocale);
		var oBundle = jQuery.sap.resources({
			url: "res/message.properties",
			locale: aLocale
		});
		
		return oBundle;
	},
	
	getStatesProperties: function(){
		return jQuery.sap.properties({url: "res/stateslist.properties"});
	},
	
	getStatesItemArray: function(){
		var stateItems = [];
		
		var states = this.getStatesProperties();
		
		var keys = states.getKeys();
		for(var i=0;i<keys.length;i++){
			stateItems.push(new sap.ui.core.ListItem({text:states.getProperty(keys[i]), key:keys[i]}));
		}
		
		return stateItems;
	},
	
	updateStatusBar: function(statusText){
		var statusTextView=undefined;
		var contents = global_mainLayout.getBottom().getContent();
		for(var i=0;i<contents.length;i++){
			if(contents[i].getId()=="layout.bottom.status.content.textview"){
				statusTextView = contents[i];
				break;
			}
		}
		if(statusTextView==undefined){
			statusTextView = sap.ui.getCore().byId("layout.bottom.status.content.textview");
		}
		
		if(statusTextView!=undefined){
			statusTextView.setText(statusText);
			statusTextView.setSemanticColor(sap.ui.commons.TextViewColor.Positive);
			statusTextView.setDesign(sap.ui.commons.TextViewDesign.Bold);
		}
	},
	
	updateDebugBar: function(debugmsg, linkText, linkHref, linkVisibility){
		if(global_debug){
			//update the debug message
			if(debugmsg!=undefined && (typeof debugmsg=="string")){
				var debugTextView = sap.ui.getCore().byId("layout.bottom.debug.content.textview");
				debugTextView.setText(debugmsg);
				debugTextView.setSemanticColor(sap.ui.commons.TextViewColor.Default);
//				debugTextView.setDesign(sap.ui.commons.TextViewDesign.Bold);
			}

			//update the debug link
			var debugLinkView = sap.ui.getCore().byId("layout.bottom.debug.content.link");
			if(linkText!=undefined && (typeof linkText=="string")){
				debugLinkView.setText(linkText);
			}
			if(linkHref!=undefined && (typeof linkHref=="string")){
				debugLinkView.setHref(linkHref);
			}
			if(linkVisibility!=undefined && (typeof linkVisibility=="boolean")){
				debugLinkView.setVisible(linkVisibility);
			}
		}
	},
	
	debughandler: function(oControlEvent){global_controller.debug("", oControlEvent);},
	
	/**
	 * Return a border layout
	 * @param oBundle
	 * @returns {sap.ui.commons.layout.BorderLayout}
	 */
	getMainLayout: function(oBundle){
		var statusbarstatusLayout = new sap.ui.layout.HorizontalLayout("layout.bottom.status", {content: [
		                                                            	         new sap.ui.commons.TextView("layout.bottom.status.label.textview", {text: oBundle.getText("layout.bottom.status.label.textview"), design: sap.ui.commons.TextViewDesign.Bold }),
		                                                            	         new sap.ui.commons.TextView("layout.bottom.status.content.textview", {text: oBundle.getText("layout.bottom.status.content.textview")})
		                                                            	        ]}) ;
		var statusbardebugLayout = new sap.ui.layout.HorizontalLayout("layout.bottom.debug", {content: [
		                                                                                            new sap.ui.commons.TextView("layout.bottom.debug.label.textview", {text: oBundle.getText("layout.bottom.debug.label.textview"), design: sap.ui.commons.TextViewDesign.Bold }),
		                                                                                            new sap.ui.commons.TextView("layout.bottom.debug.content.textview", {text: oBundle.getText("layout.bottom.debug.content.textview")}),
		                                                                                            new sap.ui.commons.Link("layout.bottom.debug.content.link")
		                                                                                            ]}) ;
		var statusbarLayout = new sap.ui.layout.VerticalLayout("layout.bottom.status.bar", {content: [statusbarstatusLayout,statusbardebugLayout]});
		
		// Create a BorderLayout instance
		var oBorderLayout1 = new sap.ui.commons.layout.BorderLayout("BorderLayout1", 
			{
			width: "1024px",
			height: "768px", 
			top: new sap.ui.commons.layout.BorderLayoutArea({
				size: "25px",
				contentAlign: "left",
				visible: true, 
//				content: [new sap.ui.commons.TextView({text: 'Top Area', design: sap.ui.commons.TextViewDesign.Bold })]
				}),
			bottom: new sap.ui.commons.layout.BorderLayoutArea({
				size: "5%",
				contentAlign: "left",
				visible: true, 
				content: [statusbarLayout]
				}),
				
			center: new sap.ui.commons.layout.BorderLayoutArea({
					contentAlign: "top",
					visible: true, 
//				content: [new sap.ui.commons.TextView({text: 'Center Area', design: sap.ui.commons.TextViewDesign.Bold })]
				}),
				
			begin: new sap.ui.commons.layout.BorderLayoutArea({
				size: "0%",
				contentAlign: "center",
				visible: true, 
				content: [new sap.ui.commons.TextView({text: 'Begin Area', design: sap.ui.commons.TextViewDesign.Bold })]
				}),
				
			end: new sap.ui.commons.layout.BorderLayoutArea({
				size: "0%",
				contentAlign: "center",
				visible: true, 
				content: [new sap.ui.commons.TextView({text: 'End Area', design: sap.ui.commons.TextViewDesign.Bold })]
				})
			});
		
		return oBorderLayout1;
	},
	
	/**
	 * Return a tab panel.
	 * @param oBundle
	 * @returns {sap.ui.commons.TabStrip}
	 */
	getCenterContent: function(oBundle){
		// Create a TabStrip instance
		var tabStrip = new sap.ui.commons.TabStrip("main.content.tabstrip");
		tabStrip.setWidth("100%");
		tabStrip.setHeight("100%");
		tabStrip.attachClose( function (oEvent) {
			var oTabStrip = oEvent.oSource;
			oTabStrip.closeTab(oEvent.getParameter("index"));
		});

		this.addTabMortCalc(oBundle, tabStrip);
		this.addTabBascComp(oBundle, tabStrip);
		this.addTabJPan(oBundle, tabStrip);
		this.addTabJTree(oBundle, tabStrip);
		this.addTabJTree2(oBundle, tabStrip);
		this.addTabJTable(oBundle, tabStrip);
		this.addTabJTable2(oBundle, tabStrip);
		this.addTabJTable3(oBundle, tabStrip);
		this.addTabJTable4(oBundle, tabStrip);
		

		// 4. secret tab (inactive)
		oTab4 = new sap.ui.commons.Tab("tab4", {title: new sap.ui.core.Title("Title4",{text:"Top Secret"}), enabled: false});
		tabStrip.addTab(oTab4);
		
		return tabStrip;
	},
	
	// 1. tab: Mort.Calc
	addTabMortCalc: function(oBundle, tabStrip){
//		var debugmsg = global_lidiya_view_filename+".addTabMortCalc(): ";
		var oLayoutForMortCalc = new sap.ui.commons.layout.MatrixLayout("layout.center.tab.mort", {columns: 2, width: "100%"});
//		oLayoutForMortCalc.setWidths(['150px']);

		var oLabel = new sap.ui.commons.Label("calc.panel.title", {text: oBundle.getText("calc.panel.title"), design: sap.ui.commons.LabelDesign.Bold});
		oLayoutForMortCalc.createRow(oLabel);
		
		var oTF = new sap.ui.commons.TextField("calc.panel.textfield.term", {tooltip: oBundle.getText("calc.panel.label.term")});
		oLabel = new sap.ui.commons.Label("calc.panel.label.term", {text: oBundle.getText("calc.panel.label.term"), labelFor: oTF});
		oLayoutForMortCalc.createRow(oLabel, oTF);
		
		oTF = new sap.ui.commons.TextField("calc.panel.textfield.principal", {tooltip: oBundle.getText("calc.panel.label.principal")});
		oLabel = new sap.ui.commons.Label("calc.panel.label.principal", {text: oBundle.getText("calc.panel.label.principal"), labelFor: oTF});
		oLayoutForMortCalc.createRow(oLabel, oTF);
		
		oTF = new sap.ui.commons.TextField("calc.panel.textfield.rate", {tooltip: oBundle.getText("calc.panel.label.rate")});
		oLabel = new sap.ui.commons.Label("calc.panel.label.rate", {text: oBundle.getText("calc.panel.label.rate"), labelFor: oTF});
		oLayoutForMortCalc.createRow(oLabel, oTF);
		
		var oButton = new sap.ui.commons.Button("calc.panel.button.submit", {text: oBundle.getText("calc.panel.button.submit")});
		oButton.attachPress(
				//Add anonymous function to calculate mortgage
				function(oControlEvent){
					var debugmsg = global_lidiya_view_filename+".addTabMortCalc().oButton.attachPress(): ";
					var term = sap.ui.getCore().byId("calc.panel.textfield.term");
					var principal = sap.ui.getCore().byId("calc.panel.textfield.principal");
					var rate = sap.ui.getCore().byId("calc.panel.textfield.rate");
					var payment = sap.ui.getCore().byId("calc.panel.textfield.payment");
					
					try{
						termVal= Number(term.getValue());
						principalVal= Number(principal.getValue());
						rateVal=Number(rate.getValue());
						
						y = 1+((rateVal/100)/12);
						x = (principalVal * Math.pow(y,(12*termVal)));
						z = (Math.pow(y,(12*termVal))-1)/(y-1);
						paymentVal=Math.round(x/(y*z));
						payment.setValue("$"+paymentVal);
					}catch(error){
						global_controller.debug(debugmsg+error.toString());
						payment.setValue("$NaN");
					};
				}		
		);
		oLayoutForMortCalc.createRow(oButton);
		
		oTF = new sap.ui.commons.TextField("calc.panel.textfield.payment", {tooltip: oBundle.getText("calc.panel.label.payment")});
		oLabel = new sap.ui.commons.Label("calc.panel.label.payment", {text: oBundle.getText("calc.panel.label.payment"), labelFor: oTF});
		oLayoutForMortCalc.createRow(oLabel, oTF);
		tabStrip.createTab(oBundle.getText("toolbar.mort.text"), oLayoutForMortCalc);
		
	},
	
	// 2. tab: Basc.Comp
	addTabBascComp: function(oBundle, tabStrip){
		var debugmsg = global_lidiya_view_filename+".addTabBascComp(): ";
		var oTabBascComp = new sap.ui.commons.Tab("toolbar.basc.text");
		oTabBascComp.setTooltip(oBundle.getText("toolbar.basc.desc"));
		oTabBascComp.setText(oBundle.getText("toolbar.basc.text"));

		var oLayoutForBascComp = new sap.ui.commons.layout.MatrixLayout("layout.center.tab.basc", {columns: 2, width: "100%"});
//		oLayoutForBascComp.setWidths(['250px']);

//		var oCell = new sap.ui.commons.layout.MatrixLayoutCell({content: [oTF1, oTF2]});
		var oTF = new sap.ui.commons.PasswordField("layout.center.tab.basc.password", {width: "200px"});
		var oLabel = new sap.ui.commons.Label("layout.center.tab.basc.password.label", {text: oBundle.getText("layout.center.tab.basc.password.label"), labelFor: oTF});
		oTF.attachChange(this.debughandler);
		oLayoutForBascComp.createRow(oLabel, oTF);
		
		var textAreaContent = "jTextArea1\njTextArea1\njTextArea1\njTextArea1\njTextArea1\njTextArea1\njTextArea1\nC:/safs/samples/Java/JavaApp/swingapp.jar";
		var oTA = new sap.ui.commons.TextArea("layout.center.tab.basc.textarea", {value:textAreaContent, width: "200px"});
		oLabel = new sap.ui.commons.Label("layout.center.tab.basc.textarea.label", {text: oBundle.getText("layout.center.tab.basc.textarea.label"), labelFor: oTA});
		oTA.attachChange(this.debughandler);
		oLayoutForBascComp.createRow(oLabel, oTA);
		
		var stateComboboxChanged = function(oControlEvent){
			var debugmsg = global_lidiya_view_filename+".addTabBascComp().stateComboboxChanged(): ";
			global_controller.debug(debugmsg, oControlEvent);
			var statusText = " Select state '"+oControlEvent.getParameters().newValue+"'";
			//this could NOT be recognized here!!!
//			this.updateStatusBar(statusText);
			global_lidiya_view.updateStatusBar(statusText);
		};
		var oCB = new sap.ui.commons.ComboBox("layout.center.tab.basc.combobox", {items:this.getStatesItemArray(),width: "200px"});
		oCB.attachChange(stateComboboxChanged);
		oLabel = new sap.ui.commons.Label("layout.center.tab.basc.combobox.label", {text: oBundle.getText("layout.center.tab.basc.combobox.label"), labelFor: oCB});
		oLayoutForBascComp.createRow(oLabel, oCB);

		var allowMutipleSelectInStateList= function(oControlEvent){
			var debugmsg = global_lidiya_view_filename+".addTabBascComp().allowMutipleSelectInStateList(): ";
			global_controller.debug(debugmsg, oControlEvent);
			var listbox = sap.ui.getCore().byId("layout.center.tab.basc.listbox");
			var allowMultipleSelect = oControlEvent.getSource().getChecked();
			listbox.setAllowMultiSelect(allowMultipleSelect);
			global_lidiya_view.updateStatusBar("'"+global_bundle.getText("layout.center.tab.basc.listbox.label")+"'"+(allowMultipleSelect?" allow":" does not allow")+" multiple selection.");
		};
		var oRB = new sap.ui.commons.RadioButton("layout.center.tab.basc.radiobutton", {text: oBundle.getText("layout.center.tab.basc.radiobutton.label")});
		var oCB = new sap.ui.commons.CheckBox("layout.center.tab.basc.checkbox", {text: oBundle.getText("layout.center.tab.basc.checkbox.label")});
		oRB.attachSelect(this.debughandler);
		oCB.attachChange(allowMutipleSelectInStateList);
		oLayoutForBascComp.createRow(oRB, oCB);
		
		var oLB = new sap.ui.commons.ListBox("layout.center.tab.basc.listbox",
				                             {items:this.getStatesItemArray(), 
			                                  width: "200px", "height":"350px",
			                                  allowMultiSelect:true });
		oLabel = new sap.ui.commons.Label("layout.center.tab.basc.listbox.label", {text: oBundle.getText("layout.center.tab.basc.listbox.label"), labelFor: oLB});
		oLB.attachSelect(
				function(oControlEvent){
					var debugmsg = global_lidiya_view_filename+".addTabBascComp().oLB.attachSelect(): ";
					global_controller.debug(debugmsg+"List contain "+oLB.getItems().length+" items.", oControlEvent);
//					var listItemText = oControlEvent.getParameters().selectedItem.getText();
//					var listItemKey = oControlEvent.getParameters().selectedItem.getKey();
					var selectedItems = oLB.getSelectedItems();
					var message = "Selected Items:";
					for(var i=0;i<selectedItems.length;i++){
						message += "'"+selectedItems[i].getKey()+"':'"+selectedItems[i].getText()+"', ";
					}
					if(selectedItems.length==0) message = "No List Item Selected.";
					global_lidiya_view.updateStatusBar(message);
					global_controller.debug(debugmsg+message, oControlEvent);
				}
		);
		oLayoutForBascComp.createRow(oLabel, oLB);
		
		var oTB = new sap.ui.commons.ToggleButton("layout.center.tab.basc.togglebutton", {text: oBundle.getText("layout.center.tab.basc.togglebutton.label")});
		var oBT = new sap.ui.commons.Button("layout.center.tab.basc.button", {text: oBundle.getText("layout.center.tab.basc.button.label")});
		oTB.attachPress(this.debughandler);
		oBT.attachPress(this.debughandler);
		oLayoutForBascComp.createRow(oTB, oBT);
		
		var oLink = new sap.ui.commons.Link("layout.center.tab.basc.link", {text: oBundle.getText("layout.center.tab.basc.link.text"), href: oBundle.getText("layout.center.tab.basc.link.href") });
		oLayoutForBascComp.createRow(oLink);
		
		oTabBascComp.addContent(oLayoutForBascComp);
		tabStrip.addTab(oTabBascComp);
	},
	
	// 3. tab: JPan
	addTabJPan: function(oBundle, tabStrip){
		var oTab = new sap.ui.commons.Tab("toolbar.jpan.text");
		oTab.setTooltip(oBundle.getText("toolbar.jpan.desc"));
		oTab.setText(oBundle.getText("toolbar.jpan.text"));
		var onclickHandlerClicked = false;
		
		var oLayout = new sap.ui.commons.layout.MatrixLayout("layout.center.tab.jpan", {columns: 2, width: "100%"});
		
		var valueChanged = function(oControlEvent){
			var debugmsg = global_lidiya_view_filename+".addTabJPan().valueChanged(): ";
			var sourceid = oControlEvent.getSource().getId();
			global_controller.debug(debugmsg+sourceid+" has been modified.");
//			var oldvalue = oControlEvent.getSource().getValue();//This will get the newvalue
			var newvalue = oControlEvent.getParameter('newValue');
			global_lidiya_view.updateStatusBar("newvalue='"+newvalue+"'.");
		};
		var valueLiveChanged = function(oControlEvent){
			var debugmsg = global_lidiya_view_filename+".addTabJPan().valueLiveChanged(): ";
			var sourceid = oControlEvent.getSource().getId();
			global_controller.debug(debugmsg+sourceid+" is being modified.");
			var oldvalue = oControlEvent.getSource().getValue();
			var livevalue = oControlEvent.getParameter('liveValue');
			global_lidiya_view.updateStatusBar("oldvalue='"+ oldvalue+"'; livevalue='"+livevalue+"'.");
		};
		var onclickHandler = function(){
			//alert("1----onclickHandler(): clicking event fired!");
			onclickHandlerClicked = true;
		};
		var onclickHandler2 = function(){
			alert("2----onclickHandler2(): clicking event fired! onclickHandlerClicked="+onclickHandlerClicked);
			onclickHandlerClicked = false;
		};
		
		var initialSelectedID = "U21";
		var oTA = new sap.ui.commons.AutoComplete("layout.center.tab.jpan.autocomplete.employeesid", 
				{
				width: "200px",
				tooltip: oBundle.getText("layout.center.tab.jpan.autocomplete.employeesid.tooltip"),
				maxPopupItems: 5,
				displaySecondaryValues: true,
				items: {
					path: "/jsondata",
					template: new sap.ui.core.ListItem({text: "{userid}", additionalText: "{name}", key: "{userid}"})
				},
				value : initialSelectedID
				});
		oTA.setModel(employeesidModel);
		var oLabel = new sap.ui.commons.Label("layout.center.tab.jpan.autocomplete.employeesid.label", {text: oBundle.getText("layout.center.tab.jpan.autocomplete.employeesid.label"), labelFor: oTA});
		var updateAccordingToID = function(employeeid){
			try{
				sap.ui.getCore().byId("layout.center.tab.jpan.inplaceedit.dropdown").setSelectedKey(employeeid);
				
				var employees = employeesidModel.getProperty("/jsondata");
				for(var i=0;i<employees.length;i++){
					if(employeeid==employees[i].userid){
						names = employees[i].name.split(",");
						sap.ui.getCore().byId("layout.center.tab.jpan.textview.firstname").setValue(names[0].trim());
						sap.ui.getCore().byId("layout.center.tab.jpan.textview.lastname").setValue(names[1].trim());
						break;
					}
				}
				
				var personalInfo = employeePersonalInfoModel.getProperty("/jsondata");
				for(var i=0;i<personalInfo.length;i++){
					if(employeeid==personalInfo[i].userid){
						sap.ui.getCore().byId("layout.center.tab.jpan.textarea.address").setValue(personalInfo[i].address.trim());
						sap.ui.getCore().byId("layout.center.tab.jpan.textview.postcode").setValue(personalInfo[i].postcode.trim());
						break;
					}
				}
			}catch(error){
				global_controller.debug("Met error '"+error+"'");
			}
		};
		oTA.attachChange(function(oControlEvent){
			var employeeid = oControlEvent.getParameter('newValue');
			updateAccordingToID(employeeid);
		});
		oTA.attachLiveChange(valueLiveChanged);
		
		//try native html event
		oTA.attachBrowserEvent("click", onclickHandler2);
		oLayout.createRow(oLabel, oTA);
		
		oTA = new sap.ui.commons.TextField("layout.center.tab.jpan.textview.firstname", {value:"Nick", width: "200px"});
		oLabel = new sap.ui.commons.Label("layout.center.tab.jpan.textview.firstname.label", {text: oBundle.getText("layout.center.tab.jpan.textview.firstname.label"), labelFor: oTA});
		oTA.attachChange(valueChanged);
		oTA.attachLiveChange(valueLiveChanged);
		
		//try native html event
		oTA.attachBrowserEvent("click", onclickHandler);
		
		oLayout.createRow(oLabel, oTA);

		oTA = new sap.ui.commons.TextField("layout.center.tab.jpan.textview.lastname", {value:"Hortan", width: "200px"});
		oLabel = new sap.ui.commons.Label("layout.center.tab.jpan.textview.lastname.label", {text: oBundle.getText("layout.center.tab.jpan.textview.lastname.label"), labelFor: oTA});
		oTA.attachChange(valueChanged);
		oTA.attachLiveChange(valueLiveChanged);
		oLayout.createRow(oLabel, oTA);
		
		oTA = new sap.ui.commons.TextArea("layout.center.tab.jpan.textarea.address", {value:"490 E Main Street Norwich CT", width: "200px"});
		oLabel = new sap.ui.commons.Label("layout.center.tab.jpan.textarea.address.label", {text: oBundle.getText("layout.center.tab.jpan.textarea.address.label"), labelFor: oTA});
		oTA.attachChange(valueChanged);
		oTA.attachLiveChange(valueLiveChanged);
		oTA.attachBrowserEvent("click", onclickHandler2);
		oLayout.createRow(oLabel, oTA);
		
		oTA = new sap.ui.commons.TextField("layout.center.tab.jpan.textview.postcode", {value:"06360", width: "200px"});
		oLabel = new sap.ui.commons.Label("layout.center.tab.jpan.textview.postcode.label", {text: oBundle.getText("layout.center.tab.jpan.textview.postcode.label"), labelFor: oTA});
		oTA.attachChange(valueChanged);
		oTA.attachLiveChange(valueLiveChanged);
		oTA.attachBrowserEvent("click", onclickHandler2);
		oLayout.createRow(oLabel, oTA);
		
		var embeddedTF = new sap.ui.commons.TextField("layout.center.tab.jpan.inplaceedit.textfield", {width: "200px", value: oBundle.getText("layout.center.tab.jpan.inplaceedit.tooltip")});
		var oInplace = new sap.ui.commons.InPlaceEdit("layout.center.tab.jpan.inplaceedit.textfield.inplace", {content: embeddedTF});
		embeddedTF.attachChange(valueChanged);
		embeddedTF.attachLiveChange(valueLiveChanged);
		oLabel = new sap.ui.commons.Label("layout.center.tab.jpan.inplaceedit.textfield.label", {text: oBundle.getText("layout.center.tab.jpan.inplaceedit.textfield.label"), labelFor: oInplace});
		oLayout.createRow(oLabel, oInplace);

		var embeddedDropdown = new sap.ui.commons.DropdownBox("layout.center.tab.jpan.inplaceedit.dropdown", 
				{
					width: "200px",
					tooltip: oBundle.getText("layout.center.tab.jpan.inplaceedit.tooltip"),
					items:{
						path: "/jsondata",
						template: new sap.ui.core.ListItem({text:"{name}", key:"{userid}"})
					}
				}
		);
		embeddedDropdown.setModel(employeesidModel);
		var oInplace = new sap.ui.commons.InPlaceEdit("layout.center.tab.jpan.inplaceedit.dropdown.inplace", {content: embeddedDropdown});
		embeddedDropdown.attachChange(valueChanged);
		oLabel = new sap.ui.commons.Label("layout.center.tab.jpan.inplaceedit.dropdown.label", {text: oBundle.getText("layout.center.tab.jpan.inplaceedit.dropdown.label"), labelFor: oInplace});
		oLayout.createRow(oLabel, oInplace);
		
		updateAccordingToID(initialSelectedID);
		
		oTab.addContent(oLayout);
		tabStrip.addTab(oTab);
	},
	
	// 4. tab: JTree
	addTabJTree: function(oBundle, tabStrip){
		var oTab = new sap.ui.commons.Tab("toolbar.jtree.text");
		oTab.setTooltip(oBundle.getText("toolbar.jtree.desc"));
		oTab.setText(oBundle.getText("toolbar.jtree.text"));
		
		var oLayout = new sap.ui.commons.layout.VerticalLayout("layout.center.tab.jtree");

		var generateTreeNodes = function(){
			var nodes = [];
			var nodeid = "layout.center.tab.jtree.tree.treenode.lv0.1";
			var topnode = new sap.ui.commons.TreeNode(nodeid, {text: oBundle.getText(nodeid+".label")});
			nodeid = "layout.center.tab.jtree.tree.treenode.lv0.2";
			var lastnode = new sap.ui.commons.TreeNode(nodeid, {text: oBundle.getText(nodeid+".label")});
			nodes.push(topnode);
			nodes.push(lastnode);
			
			//Add children for top node
			for(var i=0;i<8;i++){
				nodeid = "layout.center.tab.jtree.tree.treenode.lv0.1.lv1."+i;
				node = new sap.ui.commons.TreeNode(nodeid, {text: oBundle.getText(nodeid+".label")});
				topnode.addNode(node);
			}
			
			//Add children for last node
			for(var i=0;i<5;i++){
				nodeid = "layout.center.tab.jtree.tree.treenode.lv0.2.lv1."+i;
				node = new sap.ui.commons.TreeNode(nodeid, {text: oBundle.getText(nodeid+".label")});
				lastnode.addNode(node);
			}
			nodeid = "layout.center.tab.jtree.tree.treenode.lv0.2.lv1.5";
			var lastnode_childnodes =new sap.ui.commons.TreeNode(nodeid, {text: oBundle.getText(nodeid+".label")}); 
			lastnode.addNode(lastnode_childnodes);
			
			//Add children for lastnode_childnodes
			for(var i=0;i<4;i++){
				nodeid = "layout.center.tab.jtree.tree.treenode.lv0.2.lv1.5.lv2."+i;
				node = new sap.ui.commons.TreeNode(nodeid, {text: oBundle.getText(nodeid+".label")});
				lastnode_childnodes.addNode(node);
			}
			
			return nodes;
		};
		var mSettings = {
				title: global_bundle.getText("layout.center.tab.jtree.tree.label"),
				width: "400px",
				height: "300px",
				nodes: generateTreeNodes()
		};
		oTree = new sap.ui.commons.Tree("layout.center.tab.jtree.tree", mSettings);
		oTree.attachSelect(
				function(oControlEvent){
					var debugmsg = global_lidiya_view_filename+".addTabJTree().oTree.attachSelect(): ";
					var selectedNode = oControlEvent.getParameter('node');
					var nodeContext = oControlEvent.getParameter('nodeContext');
					var message = "Select Tree Node '"+global_controller.getTreeFullPath(selectedNode)+"'";
					global_controller.debug(debugmsg+"nodeContext="+nodeContext+", "+message, oControlEvent);
					global_lidiya_view.updateStatusBar(message);
				}
		);
		oLayout.addContent(oTree);
		
		oTab.addContent(oLayout);
		tabStrip.addTab(oTab);
	},
	
	// 5. tab: JTree2
	addTabJTree2: function(oBundle, tabStrip){
		var oTab = new sap.ui.commons.Tab("toolbar.jtree2.text");
		oTab.setTooltip(oBundle.getText("toolbar.jtree2.desc"));
		oTab.setText(oBundle.getText("toolbar.jtree2.text"));
		
		var oLayout = new sap.ui.commons.layout.VerticalLayout("layout.center.tab.jtree2");
		
		var mSettings = {
			title: global_bundle.getText("layout.center.tab.jtree2.tree.label"),
			width: "400px",
			height: "300px",
			showHeader: false,
			showHeaderIcons: false,
		};
		oTree = new sap.ui.commons.Tree("layout.center.tab.jtree2.tree", mSettings).setModel(organizationModel);
		//There are different ways to bind data to tree nodes
		oTree.bindNodes("/jsondata", new sap.ui.commons.TreeNode().bindProperty("text", "name"));
//		oTree.bindAggregation("nodes", "/jsondata",  new sap.ui.commons.TreeNode().bindProperty("text", "name"));
//		oTree.bindAggregation("nodes", "/jsondata", function(sid, oContext){
//			var treepath = oContext.getPath();
//			global_controller.debug("+"+sid+"' Model treating tree path "+treepath);
//			var bindname = "name";
//			
//			return new sap.ui.commons.TreeNode().bindProperty("text", bindname);
//		} );
		
		oTree.attachSelect(
				function(oControlEvent){
					var debugmsg = global_lidiya_view_filename+".addTabJTree2().oTree.attachSelect(): ";
					var selectedNode = oControlEvent.getParameter('node');
					var nodeContext = oControlEvent.getParameter('nodeContext');
					var message = "Select Tree Node '"+global_controller.getTreeFullPath(selectedNode)+"'";
					global_controller.debug(debugmsg+"nodeContext="+nodeContext+", "+message, oControlEvent);
					global_lidiya_view.updateStatusBar(message);
				}
		);
		oLayout.addContent(oTree);
		
		oTab.addContent(oLayout);
		tabStrip.addTab(oTab);
	},
	
	generateListItem: function(oBundle, key){
		return new sap.ui.core.ListItem({
			text : oBundle.getText(key),
			tooltip : oBundle.getText(key),
			key : key});
	},
	generateItem: function(oBundle, key){
		return new sap.ui.core.Item({
			text : oBundle.getText(key),
			tooltip : oBundle.getText(key),
			key : key});
	},
	generateLabel: function(oBundle, key){
		return new sap.ui.commons.Label(key, {
			text: oBundle.getText(key)
		});
	},
	
	// 5. tab: JTable
	addTabJTable: function(oBundle, tabStrip){

		var oTable = this.addTableIntoTabStrip(oBundle, tabStrip, "");

		//Set toolbar for this table
		var gettoolbarItem = function(){
			var oLayout = new sap.ui.commons.layout.MatrixLayout("layout.center.tab.jtable.table.toolbar.matrix.id");
			oLayout.setLayoutFixed(false);
			oLayout.setColumns(8);

			//Create the first area: radio group for navigation mode
			var navigationGroup = new sap.ui.commons.RadioButtonGroup("layout.center.tab.jtable.table.toolbar.navigation.id",
					{tooltip : oBundle.getText("layout.center.tab.jtable.table.toolbar.navigation.label"),
					 columns : 2,
					}
			);
			var pageradio = global_lidiya_view.generateItem(oBundle, "layout.center.tab.jtable.table.toolbar.navigation.mode.page");
			var scrollradio = global_lidiya_view.generateItem(oBundle, "layout.center.tab.jtable.table.toolbar.navigation.mode.scroll");
			navigationGroup.addItem(pageradio);
			navigationGroup.addItem(scrollradio);
			navigationGroup.attachSelect(
					function(oControlEvent){
						var selectedItem = navigationGroup.getSelectedItem();
						if(pageradio.getKey()==selectedItem.getKey()){
							oTable.setNavigationMode(sap.ui.table.NavigationMode.Paginator);
						}else if(scrollradio.getKey()==selectedItem.getKey()){
							oTable.setNavigationMode(sap.ui.table.NavigationMode.Scrollbar);
						}
					}
			);
			if(oTable.getNavigationMode()==sap.ui.table.NavigationMode.Paginator) navigationGroup.setSelectedItem(pageradio);
			else if(oTable.getNavigationMode()==sap.ui.table.NavigationMode.Scrollbar) navigationGroup.setSelectedItem(scrollradio);
			
			//Create the second area: radio group for selection mode
			var selectionGroup = new sap.ui.commons.RadioButtonGroup("layout.center.tab.jtable.table.toolbar.selection.id",
					{tooltip : oBundle.getText("layout.center.tab.jtable.table.toolbar.selection.label"),
					 columns : 3,
					}
			);
			var selectionNoneRadio = global_lidiya_view.generateItem(oBundle, "layout.center.tab.jtable.table.toolbar.selection.mode.none");
			var selectionSingleRadio = global_lidiya_view.generateItem(oBundle, "layout.center.tab.jtable.table.toolbar.selection.mode.single");
			var selectionMultiRadio = global_lidiya_view.generateItem(oBundle, "layout.center.tab.jtable.table.toolbar.selection.mode.multi");
			selectionGroup.addItem(selectionNoneRadio);
			selectionGroup.addItem(selectionSingleRadio);
			selectionGroup.addItem(selectionMultiRadio);
			selectionGroup.attachSelect(
					function(oControlEvent){
						var selectedItem = selectionGroup.getSelectedItem();
						if(selectionNoneRadio.getKey()==selectedItem.getKey()){
							oTable.setSelectionMode(sap.ui.table.SelectionMode.None);
						}else if(selectionSingleRadio.getKey()==selectedItem.getKey()){
							oTable.setSelectionMode(sap.ui.table.SelectionMode.Single);
						}else if(selectionMultiRadio.getKey()==selectedItem.getKey()){
							oTable.setSelectionMode(sap.ui.table.SelectionMode.Multi);
						}
					}
			);
			if(oTable.getSelectionMode()==sap.ui.table.SelectionMode.None) selectionGroup.setSelectedItem(selectionNoneRadio);
			else if(oTable.getSelectionMode()==sap.ui.table.SelectionMode.Single) selectionGroup.setSelectedItem(selectionSingleRadio);
			else if(oTable.getSelectionMode()==sap.ui.table.SelectionMode.Multi) selectionGroup.setSelectedItem(selectionMultiRadio);
						
			//Create combo box to show row or column order
			var combobox = new sap.ui.commons.ComboBox("layout.center.tab.jtable.table.toolbar.matrix.combobox.id");
			combobox.addItem(global_lidiya_view.generateListItem(oBundle, "layout.center.tab.jtable.table.toolbar.matrix.combobox.showrows"));
			combobox.addItem(global_lidiya_view.generateListItem(oBundle, "layout.center.tab.jtable.table.toolbar.matrix.combobox.showcolumns"));
			combobox.attachChange(
					function(oControlEvent){
						var debugmsg = global_lidiya_view_filename+".addTabJTable().combobox.attachChange(): ";
						var selectedItem = oControlEvent.getParameter("selectedItem");
							
						if(selectedItem.getKey()=="layout.center.tab.jtable.table.toolbar.matrix.combobox.showrows"){
							var rows = oTable.getRows();//Will return the rows shown on the page in order. the rows out of page will not be returned.
							var lastNameOrder = "Last Name order: ";
							var viewOrder = "view order: ";
							for(var i=0;i<rows.length;i++){
								row = rows[i];
								lastNameOrder += row.getCells()[0].getText()+",";
								viewOrder += oTable.indexOfRow(row)+",";
							}
							var totallength = global_controller.getTableModelRowLength(oTable);
							
							global_lidiya_view.updateStatusBar(lastNameOrder);
							global_controller.debug(debugmsg+"totallength="+totallength+": "+viewOrder);
						}else if(selectedItem.getKey()=="layout.center.tab.jtable.table.toolbar.matrix.combobox.showcolumns"){
							var columns = oTable.getColumns();//Will return the columns shown on the page in order.
							var columnOrder = "Column order: ";
							var viewOrder = "view order: ";
							for(var i=0;i<columns.length;i++){
								column = columns[i];
								columnOrder += column.getLabel().getText()+",";
								viewOrder += oTable.indexOfColumn(column)+",";
							}
							global_lidiya_view.updateStatusBar(columnOrder);
							global_controller.debug(debugmsg+viewOrder);
						}
					}
			);
			
			var navigationLabel = global_lidiya_view.generateLabel(oBundle, "layout.center.tab.jtable.table.toolbar.navigation.label").setLabelFor(navigationGroup).addStyleClass("indicationLabel");
			var selectionLabel = global_lidiya_view.generateLabel(oBundle, "layout.center.tab.jtable.table.toolbar.selection.label").setLabelFor(selectionGroup).addStyleClass("indicationLabel");
			var showorderLabel = global_lidiya_view.generateLabel(oBundle, "layout.center.tab.jtable.table.toolbar.matrix.combobox.label").setLabelFor(combobox).addStyleClass("indicationLabel");
			
			oLayout.createRow(navigationLabel, navigationGroup, new sap.ui.commons.Label({text:" | "})/*separator*/, 
					          selectionLabel, selectionGroup, new sap.ui.commons.Label({text:" | "})/*separtor*/,
					          showorderLabel, combobox);
			return oLayout;
		};
		var toolbar = new sap.ui.commons.Toolbar("layout.center.tab.jtable.table.toolbar.id", {
			items:[gettoolbarItem()]
		});
		oTable.setToolbar(toolbar);
		

		var propertyKey = "layout.center.tab.jtable.table.json.property.lastName";
		var property = oBundle.getText(propertyKey);//property is the name in the json data model
		//Define the columns and the control templates to be used
		var oColumn = new sap.ui.table.Column({
			label: new sap.ui.commons.Label({text: oBundle.getText(propertyKey+".label")}),
			template: new sap.ui.commons.TextView().bindProperty("text", property),
			sortProperty: property,
			filterProperty: property,
			width: "100px"
		});
//		var oCustomMenu = new sap.ui.commons.Menu();
		var oCustomMenu = oColumn.getMenu();
		oCustomMenu.addItem(new sap.ui.commons.MenuItem({
			text:"Highlight",
			select:function() {
				alert("Custom Menu");
			}
		}));
//		oColumn.setMenu(oCustomMenu);
		oTable.addColumn(oColumn);
		
		propertyKey = "layout.center.tab.jtable.table.json.property.name";
		property = oBundle.getText(propertyKey);
		oTable.addColumn(new sap.ui.table.Column({
			label: new sap.ui.commons.Label({text: oBundle.getText(propertyKey+".label")}),
			template: new sap.ui.commons.TextField().bindProperty("value", property),
			sortProperty: property,
			filterProperty: property,
			width: "100px"
		}));
		
		propertyKey = "layout.center.tab.jtable.table.json.property.retired";
		property = oBundle.getText(propertyKey);
		oTable.addColumn(new sap.ui.table.Column({
			label: new sap.ui.commons.Label({text: oBundle.getText(propertyKey+".label")}),
			template: new sap.ui.commons.CheckBox().bindProperty("checked", property),
			sortProperty: property,
			filterProperty: property,
			width: "75px",
			hAlign: "Center"
		}));

		propertyKey = "layout.center.tab.jtable.table.json.property.website";
		property = oBundle.getText(propertyKey);
		oTable.addColumn(new sap.ui.table.Column({
			label: new sap.ui.commons.Label({text: oBundle.getText(propertyKey+".label")}),
			template: new sap.ui.commons.Link().bindProperty("text", property).bindProperty("href", oBundle.getText("layout.center.tab.jtable.table.json.property.href")),
			sortProperty: property,
			filterProperty: property
				
		}));
		
		propertyKey = "layout.center.tab.jtable.table.json.property.image";
		property = oBundle.getText(propertyKey);
		oTable.addColumn(new sap.ui.table.Column({
			label: new sap.ui.commons.Label({text: oBundle.getText(propertyKey+".label")}),
			template: new sap.ui.commons.Image().bindProperty("src", property),
			width: "75px",
			hAlign: "Center"
		}));
		
		propertyKey = "layout.center.tab.jtable.table.json.property.gender";
		property = oBundle.getText(propertyKey);
		oTable.addColumn(new sap.ui.table.Column({
			label: new sap.ui.commons.Label({text: oBundle.getText(propertyKey+".label")}),
			template: new sap.ui.commons.ComboBox({items: [
				new sap.ui.core.ListItem({text: "female"}),
				new sap.ui.core.ListItem({text: "male"})
			]}).bindProperty("value",property),
			width: "75px",
			sortProperty: property,
			filterProperty: property
		}));
		
		propertyKey = "layout.center.tab.jtable.table.json.property.rating";
		property = oBundle.getText(propertyKey);
		oTable.addColumn(new sap.ui.table.Column({
			label: new sap.ui.commons.Label({text: oBundle.getText(propertyKey+".label")}),
			template: new sap.ui.commons.RatingIndicator().bindProperty("value", property),
			sortProperty: property,
			filterProperty: property,
		}));

		//Get row data from bundle file
//		var aData = [];
		//jQuery.parseJSON is too strict with the data format!!!
//		for(var i=0;i<20;i++) aData.push(jQuery.parseJSON(oBundle.getText("layout.center.tab.jtable.table.row."+i)));
//		for(var i=0;i<20;i++) aData.push(eval("("+oBundle.getText("layout.center.tab.jtable.table.row."+i)+")"));
		
		//Create a model and bind the table rows to this model
//		var oModel = new sap.ui.model.json.JSONModel();
//		oModel.setData({employees: aData});
		
		//load json data
		oTable.setModel(employeesModel);
		oTable.bindRows("/jsondata");

		oTable.attachRowSelectionChange(
				function(oControlEvent){
					var debugmsg = global_lidiya_view_filename+".addTabJTable().oTable.attachRowSelectionChange(): ";
					//oControlEvent.getParameters().rowIndices will contains item thas is deselected
//					var selectedIndices = oControlEvent.getParameters().rowIndices;
					
					var selectedIndices = oTable.getSelectedIndices();
					var message = "Selected Row: "+selectedIndices.toString();
					global_controller.debug(debugmsg+message, oControlEvent);
				}
		);
		//Initially sort the table
		oTable.sort(oTable.getColumns()[0]);
		
		return oTable;
	},
	
	// 6. tab: JTable2
	addTabJTable2: function(oBundle, tabStrip){
		var oTable = this.addTableIntoTabStrip(oBundle, tabStrip, 2);
		
		return oTable;
	},
	
	// 6. tab: JTable3
	addTabJTable3: function(oBundle, tabStrip){
		var oTable = this.addTableIntoTabStrip(oBundle, tabStrip, 3);
		
		return oTable;
	},
	
	// 6. tab: JTable4
	addTabJTable4: function(oBundle, tabStrip){
		var oTable = this.addTableIntoTabStrip(oBundle, tabStrip, 4);
		
		return oTable;
	},
	
	/**
	 * Create a new tab to contain a new table, and put the tab into tabstrip.
	 * Finally return the table.
	 */
	addTableIntoTabStrip: function(oBundle, tabStrip, index){
		var oTab = new sap.ui.commons.Tab("toolbar.jtable"+index+".text",
				{
				tooltip: oBundle.getText("toolbar.jtable"+index+".desc"),
				text: oBundle.getText("toolbar.jtable"+index+".text"),
				}
		);
		
		//Create an instance of the table control
		var oTable = new sap.ui.table.Table({
			title: oBundle.getText("layout.center.tab.jtable"+index+".table.label"),
			visibleRowCount: 15,
			firstVisibleRow: 3,
			selectionMode: sap.ui.table.SelectionMode.Single,
			navigationMode: sap.ui.table.NavigationMode.Paginator,
			fixedColumnCount: 2,
			fixedRowCount: 2,
		});
		
		var oLayout = new sap.ui.commons.layout.VerticalLayout("layout.center.tab.jtable"+index);
		oLayout.addContent(oTable);

		oTab.addContent(oLayout);
		tabStrip.addTab(oTab);
		
		return oTable;
	},
	
	getMenuBarContent: function(oBundle){
		//Function to handle the select event of the items
		var handleSelect = function(oEvent){
			var debugmsg = global_lidiya_view_filename+".getMenuBarContent().handleSelect(): ";
			var menuItemId = oEvent.getParameter("item").getId();
			global_controller.debug(debugmsg+"select menu item: '"+menuItemId+"'");
			var tabStrip = global_mainLayout.getCenter().getContent()[0];
			
			var tabTextKey = undefined;
			if(menuItemId=="menu.tools.basccomp") tabTextKey="toolbar.basc.text";
			if(menuItemId=="menu.tools.mortcalc") tabTextKey="toolbar.mort.text";
			if(menuItemId=="menu.tools.jpan") tabTextKey="toolbar.jpan.text";
			if(menuItemId=="menu.tools.tree") tabTextKey="toolbar.jtree.text";
			if(menuItemId=="menu.tools.tree2") tabTextKey="toolbar.jtree2.text";
			if(menuItemId=="menu.tools.table") tabTextKey="toolbar.jtable.text";
			if(menuItemId=="menu.tools.table2") tabTextKey="toolbar.jtable2.text";
			if(menuItemId=="menu.tools.table3") tabTextKey="toolbar.jtable3.text";
			if(menuItemId=="menu.tools.table4") tabTextKey="toolbar.jtable4.text";
			if(menuItemId=="menu.tools.drag") tabTextKey="toolbar.drag.text";
			
			if(menuItemId=="menu.weird.second.third") tabTextKey="toolbar.third.text";
			if(menuItemId=="menu.weird.second.fourth") tabTextKey="toolbar.fourth.text";
			
			global_controller.debug(debugmsg+"tabTextKey="+tabTextKey);
			
			if(tabTextKey!=undefined){
				global_controller.selectTab(tabStrip, tabTextKey);
			}else{
				global_controller.debug(debugmsg+"Can not get corresponding tab for menu item '"+menuItemId+"'");
				if(menuItemId=="menu.file.exit"){
					global_controller.debugStop();
				}
			}
		};

		// Create a menu bar instance
		var oMenuBar = new sap.ui.commons.MenuBar("menuBar");

		// Create two main menu items for the menubar - for which you define subitems lateron
		var oMenuBarItemFile = new sap.ui.commons.MenuItem("menu.file",{text: oBundle.getText("menu.file") });
		oMenuBar.addItem(oMenuBarItemFile);
		var oMenuBarItemTools = new sap.ui.commons.MenuItem("menu.tools",{text: oBundle.getText("menu.tools") });
		oMenuBar.addItem(oMenuBarItemTools);
		var oMenuBarItemWeird = new sap.ui.commons.MenuItem("menu.weird",{text: oBundle.getText("menu.weird") });
		oMenuBar.addItem(oMenuBarItemWeird);
		var oMenuBarItemHelp = new sap.ui.commons.MenuItem("menu.help",{text: oBundle.getText("menu.help") });
		oMenuBar.addItem(oMenuBarItemHelp);

		// Create a menu instance for the "File" menu
		var oMenuFile = new sap.ui.commons.Menu("menu.file.menu");
		oMenuBarItemFile.setSubmenu(oMenuFile);
		oMenuFile.attachItemSelect(handleSelect);
		// Create and add sub-items for the "File" menu
		var menuitem = new sap.ui.commons.MenuItem("menu.file.exit",{text: oBundle.getText("menu.file.exit") });
		oMenuFile.addItem(menuitem);
//		menuitem.attachSelect(handleSelect);


		// Create a menu instance for the "Tools" menu
		var oMenuTools = new sap.ui.commons.Menu("menu.tools.menu");
		oMenuBarItemTools.setSubmenu(oMenuTools);
		oMenuTools.attachItemSelect(handleSelect);
		// Create and add sub-items for the "Tools" menu
		var menuitem = new sap.ui.commons.MenuItem("menu.tools.mortcalc",{text: oBundle.getText("menu.tools.mortcalc") });
		oMenuTools.addItem(menuitem);
		menuitem = new sap.ui.commons.MenuItem("menu.tools.basccomp",{text: oBundle.getText("menu.tools.basccomp") });
		oMenuTools.addItem(menuitem);
		menuitem = new sap.ui.commons.MenuItem("menu.tools.jpan",{text: oBundle.getText("menu.tools.jpan") });
		oMenuTools.addItem(menuitem);
		menuitem = new sap.ui.commons.MenuItem("menu.tools.tree",{text: oBundle.getText("menu.tools.tree") });
		oMenuTools.addItem(menuitem);
		menuitem = new sap.ui.commons.MenuItem("menu.tools.tree2",{text: oBundle.getText("menu.tools.tree2") });
		oMenuTools.addItem(menuitem);
		menuitem = new sap.ui.commons.MenuItem("menu.tools.table",{text: oBundle.getText("menu.tools.table") });
		oMenuTools.addItem(menuitem);
		menuitem = new sap.ui.commons.MenuItem("menu.tools.table2",{text: oBundle.getText("menu.tools.table2") });
		oMenuTools.addItem(menuitem);
		menuitem = new sap.ui.commons.MenuItem("menu.tools.table3",{text: oBundle.getText("menu.tools.table3") });
		oMenuTools.addItem(menuitem);
		menuitem = new sap.ui.commons.MenuItem("menu.tools.table4",{text: oBundle.getText("menu.tools.table4") });
		oMenuTools.addItem(menuitem);
		menuitem = new sap.ui.commons.MenuItem("menu.tools.drag",{text: oBundle.getText("menu.tools.drag") });
		oMenuTools.addItem(menuitem);
		
		// Create a menu instance for the "Tools" menu
		var oMenuWeird = new sap.ui.commons.Menu("menu.weird.menu");
		oMenuBarItemWeird.setSubmenu(oMenuWeird);
		oMenuWeird.attachItemSelect(handleSelect);
		// Create and add sub-items for the "Tools" menu
		menuitem = new sap.ui.commons.MenuItem("menu.weird.checkbox",{text: oBundle.getText("menu.weird.checkbox") });
		oMenuWeird.addItem(menuitem);
		menuitem = new sap.ui.commons.MenuItem("menu.weird.radio",{text: oBundle.getText("menu.weird.radio") });
		oMenuWeird.addItem(menuitem);
		menuitem = new sap.ui.commons.MenuItem("menu.weird.second",{text: oBundle.getText("menu.weird.second") });
		oMenuWeird.addItem(menuitem);
		var oMenuWeirdSecond = new sap.ui.commons.Menu("menu.weird.second.menu");
		menuitem.setSubmenu(oMenuWeirdSecond);
		menuitem = new sap.ui.commons.MenuItem("menu.weird.second.third",{text: oBundle.getText("menu.weird.second.third") });
		oMenuWeirdSecond.addItem(menuitem);
		menuitem = new sap.ui.commons.MenuItem("menu.weird.second.fourth",{text: oBundle.getText("menu.weird.second.fourth") });
		oMenuWeirdSecond.addItem(menuitem);
		
//		// Create a menu instance for the "Help" menu
		var oMenuHelp = new sap.ui.commons.Menu("menu.help.menu");
		oMenuBarItemHelp.setSubmenu(oMenuHelp);
		oMenuHelp.attachItemSelect(handleSelect);
		// Create and add sub-items for the "Help" menu
		menuitem = new sap.ui.commons.MenuItem("menu.help.about",{text: oBundle.getText("menu.help.about") });
		oMenuHelp.addItem(menuitem);
		
		return oMenuBar;
	}

});
