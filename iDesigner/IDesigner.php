<?php
	include_once "_shared.php";

	authenticate();
	header(HEADER_CONTENT_HTML);
?>
<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01//EN" "http://www.w3.org/TR/html4/strict.dtd">
<html dir="ltr">
<head>
	<link rel="stylesheet" type="text/css" href="/js/dijit/themes/soria/soria.css"/>
	<style type="text/css">
		body, html{
					font-family:helvetica,arial,sans-serif; font-size:90%;
					width: 100%; height: 100%; margin: 0;
				  }
		.spanbox {
			border: 1px solid #8ba0bd;
			border-top:1px solid #C0C0D0;
			border-bottom:1px solid #657c9c;
			padding: 0.1em 0.2em 0.2em 0.2em;
			background-color: #E8F0F0;
		}
	</style>

	<title>Intelligent Designer</title>
</head>
<body class="soria">
	<div id="app" dojoType="dijit.layout.BorderContainer" style="width: 100%; height: 100%; visibility: hidden" >
		<div id="project_bar" dojoType="dijit.layout.ContentPane" region="top">
			<form dojoType="dijit.form.Form" id="project_form" >
				<span nls="username_label" class="spanbox" style="border-right:none;">User</span><span class="spanbox" style="border-left:none;"><?php echo $authorization['username'];?></span>
				<span>&nbsp;&nbsp;</span>
				<span nls="repo_label">Repos:</span>&nbsp;<select jsId="sel_repo" id="sel_repo" name="sel_repo" disabled dojoType="dijit.form.Select"
							  maxHeight=200 emptyLabel="Seeking_Repos" onChange="repoChanged()" >
					  </select>&nbsp;&nbsp;
				<span nls="project_label">Projects:</span>&nbsp;<select jsId="sel_project" id="sel_project" name="sel_project" disabled dojoType="dijit.form.Select"
								 emptyLabel="Seeking_Projects" onChange="projectChanged()">
						 </select>&nbsp;&nbsp;
				<span nls="branch_label">Branches:</span>&nbsp;<select jsId="sel_branch" id="sel_branch" name="sel_branch" disabled dojoType="dijit.form.Select"
								emptyLabel="Seeking_Branches" >
						</select>&nbsp;&nbsp;
				<span id="project_logout" style="text-align:right"><a href="?logout">Log Out</a></span><br/>
			</form>
		</div>
		<div dojoType="dijit.layout.AccordionContainer" region="leading">
			<div dojoType="dijit.layout.ContentPane" title="maps_pane" nls="maps_info">
				Maps
			</div>
			<div dojoType="dijit.layout.ContentPane" title="designer_pane" nls="designer_info">
				Designs
			</div>
			<div dojoType="dijit.layout.ContentPane" title="automator_pane" nls="automator_info">
				Actions
			</div>
			<div dojoType="dijit.layout.ContentPane" title="assets_pane" nls="assets_info">
				Other
			</div>
		</div>
		<!-- <div dojoType="dijit.layout.ContentPane" region="trailing" nls="">
			trailing pane
		</div> -->
		<div dojoType="dijit.layout.TabContainer" region="center">
			<div id="welcome_tab" dojoType="dijit.layout.ContentPane" title="welcome_title" nls="welcome_info">
				tab pane info
			</div>
		</div>
		<div id="status_pane" dojoType="dijit.layout.ContentPane" region="bottom" nls="status_info">
			Bottom pane
		</div>
	</div>
</body>
<script type="text/javascript" src="/js/dojo/dojo.js"
		djConfig="parseOnLoad:false,isDebug:true" ></script>
<script type="text/javascript" src="/js/idesigner/iDesigner.js"></script>
<script type="text/javascript" >
	//dojo.require("dojo.Deferred");
	dojo.require("dojo.parser");
	dojo.require("dojo.i18n");
	dojo.require("dojo._base.query");
	dojo.requireLocalization("idesigner", "global");
	dojo.require("dojox.data.ClientFilter");
	dojo.require("idesigner.IDesignerServiceStore");
	dojo.require("dijit.layout.BorderContainer");
	dojo.require("dijit.layout.TabContainer");
	dojo.require("dijit.layout.AccordionContainer");
	dojo.require("dijit.layout.ContentPane");
	dojo.require("dijit.form.Button");
	dojo.require("dijit.form.Form");
	dojo.require("dijit.form.Select");
	dojo.require("dijit.form.Textarea");

	var nls = dojo.i18n.getLocalization("idesigner", "global");

	var repoAccess = false;
	var projectAccess = false;
	var branchAccess = false;
<?php
	echo "var auth_username =\"".$GLOBALS[AUTHORIZATION][AUTHORIZED_USER]."\";\n";
	if(isset($GLOBALS[USERS_NOT_INITIALIZED])){
		echo "var initusers = true;\n";
	}
?>
	var store = new dojox.data.IDesignerServiceStore();
	store.cachByDefault = false;

	/* init() */
	function init() {
		console.log("function init() executing...");

		nlsWidgets();
		dojo.parser.parse();
		dojo.style(dojo.byId("app"), "visibility", "visible");

		if(initusers){
			prompt_init();
		}else{
			getRepos();
		}

		console.log("function init() complete.");
	}
	/* end init() */

	dojo.addOnLoad(init);

</script>
</html>
