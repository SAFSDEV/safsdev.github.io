
function convertText($nls_id, $args){
	$text = nls[$nls_id];
	if(dojo.isString($text)){
		if($text.length == 0 || $text == "undefined"){
			$text = $nls_id;
		}
	}else{
		$text = $nls_id;
	}
	if(dojo.isArray($args)) return dojo.replace($text, $args);
	return $text;
}

function convertServiceNLS($text){
	if(! dojo.isString($text)) return $text;
	$temp = $text;
	$suffix = "";
	if($text.substr(0,5) == ":nls:"){
		$temp = $text.substr(5)
		if($temp.indexOf(":") > 0){
			$suffix = $temp.substr($temp.indexOf(":"));
			$temp = $temp.substr(0, $temp.indexOf(":"));
		}
		$temp = nls[$temp];
	}
	return $temp+$suffix;
}

function nlsWidgets(/*optional*/ $rootId){

    if($rootId){
		dojo.forEach(dojo.query("[nls]", dojo.byId($rootId)),
			function(node){	dojo.attr(node, "innerHTML", nls[dojo.attr(node,"nls")]);});

		dojo.forEach(dojo.query("[emptyLabel]", dojo.byId($rootId)),
			function(node){dojo.attr(node, "emptyLabel", nls[dojo.attr(node,"emptyLabel")]);});

		dojo.forEach(dojo.query("[title]", dojo.byId($rootId)),
			function(node){dojo.attr(node, "title", nls[dojo.attr(node,"title")]);});
    }else{
		document.title = nls['app_title'];
		dojo.forEach(dojo.query("[nls]"),
			function(node){dojo.attr(node, "innerHTML", nls[dojo.attr(node,"nls")]);});

		dojo.forEach(dojo.query("[emptyLabel]"),
			function(node){dojo.attr(node, "emptyLabel", nls[dojo.attr(node,"emptyLabel")]);});

		dojo.forEach(dojo.query("[title]"),
			function(node){dojo.attr(node, "title", nls[dojo.attr(node,"title")]);});
	}
}

function prompt_init(){
	var l = dojo.query(dojo.create("span",{ innerHTML: nls["init_info"]}));
	l.push( dojo.create("p"));
	l.push( new dijit.form.Button({
		label: nls["initialize_label"],
		onClick: initialize_app}).domNode);
	dijit.byId("welcome_tab").set("content", l);
}

function initialize_app(e){
	console.log("function initialize_app() called.");
	var text = nls['init_begin'];
	text += "<p>"+ nls['status_label'];
	var l = dojo.query(dojo.create("span",{ id: "init_status", innerHTML: text}));
	dijit.byId("welcome_tab").set("content", l);
	store.initialize_app(
		/*update*/
		function(rc){
			rc = convertServiceNLS(rc);
			var t = dojo.attr("init_status", "innerHTML");
			dojo.attr("init_status", "innerHTML", t += "<br/>"+ rc);
		},
		/*complete*/
		function(rc){
			rc = convertServiceNLS(rc);
			var t = dojo.attr("init_status", "innerHTML");
			dojo.attr("init_status", "innerHTML", t += "<br/>"+ rc);
			initusers=false;
		}
	).then(function(){app_initialized();}, function(e){app_initialize_failure(e);});
}

function app_initialized(){

	//TODO: start using app first-time with Admin interface?
	$text = convertText("app_initialized")+ "NOW DO SOMETHING!";
	var t = dojo.attr("init_status", "innerHTML");
	dojo.attr("init_status", "innerHTML", t += "<br/>"+ $text);
}

function app_initialize_failure(e){

	//TODO: what do we do now!!!
	$text = convertText("initialize_abort") +" "+ convertServiceNLS(e);
	var t = dojo.attr("init_status", "innerHTML");
	dojo.attr("init_status", "innerHTML", t += "<br/>"+ $text);
}

function removeAllOptions(widget){
	var options = widget.getOptions();
	if(options) widget.removeOption(options);
}

function repoChanged(event){
    getProjects();
}

function projectChanged(event){
    getBranches();
}

function getRepos(){
	repoAccess = true;
	var widget = dijit.byId("sel_repo");
	var prev_val = widget.value;
	console.debug("repo setting:", prev_val);
	widget.set("disabled",true);
	removeAllOptions(widget);
	widget.set('emptyLabel',nls.repo_emptyLabel);
	store.getRepos(function(repos){
	    console.debug("repos returned: ", repos);
		if(dojo.isArray(repos)) {
			widget.addOption(repos);
			console.debug("repo resetting:", prev_val);
			if(prev_val){
				var o = widget.getOptions(prev_val);
				if(o) widget.set("value", prev_val);
			}
			if(repos.length > 0){
				widget.set("disabled", false);
			}
		}else{
			console.error("getRepos failed returning null or FALSE.");
		}
		console.debug("repoAccess complete.");
		repoAccess = false;
    });
}

function getProjects(){
	projectAccess = true;
	var widget = dijit.byId("sel_project");
	widget.set("disabled",true);
	var prev_val = widget.value;
	console.debug("project setting:", prev_val);
	removeAllOptions(widget);
	widget.set('emptyLabel', nls.project_emptyLabel);

	var r = dijit.byId("sel_repo").value;
	store.getProjects(r, function(projects){
    	console.debug("projects returned: ", projects);
		if(dojo.isArray(projects)){
			widget.addOption(projects);
			console.debug("project resetting:", prev_val);
			if(prev_val){
				var o = widget.getOptions(prev_val);
				if(o) {
					widget.set("value", prev_val);
				}
			}
			if(projects.length > 0){
				widget.set("disabled", false);
			}
		}else{
			console.error("getProjects failed returning null or FALSE.");
		}
		console.debug("projectAccess complete.");
		projectAccess = false;
    });
}

function getBranches(){
	branchAccess = true;
	var widget = dijit.byId("sel_branch");
	widget.set("disabled",true);
	var prev_val = widget.value;
	console.debug("branch setting:", prev_val);
	removeAllOptions(widget);
	widget.set('emptyLabel', nls.branch_emptyLabel);

	var r = dijit.byId("sel_repo").value;
	var p = dijit.byId("sel_project").value;
	store.getBranches(r, p, function(branches){
    	console.debug("branches returned: ", branches);
		if(dojo.isArray(branches)){
			widget.addOption(branches);
			console.debug("branch resetting:", prev_val);
			if(prev_val){
				var o = widget.getOptions(prev_val);
				if(o) widget.set("value", prev_val);
			}
			if(branches.length > 0){
			   widget.set("disabled", false);
			}
		}else{
		console.error("getBranches failed returning null or FALSE.");
		}
		console.debug("branchAccess complete.");
		branchAccess = false;
    });
}


