
dojo.provide("idesigner.IDesignerServiceStore");

/* key SQL support keywords: SELECT, UPDATE, DELETE, INSERT, WHERE */

dojo.require("dojo.io.script");
dojo.require("dojox.rpc.Service");
dojo.require("dojox.data.ClientFilter");
dojo.require("dojox.data.ServiceStore");

dojo.declare("dojox.data.IDesignerServiceStore", dojox.data.ServiceStore,{
    constructor: function(){
        var mu = dojo.moduleUrl("idesigner", "idesigner.smd");
        var svc = new dojox.rpc.Service(mu);
        this.service = svc.query;

        // this lets ServiceStore’s getLabel(), fetchItemByIdentity(),
        // etc. all work correctly
        this.idAttribute = this.labelAttribute = "label";
    },

    /*
     query:
        (default) "action: query",
        text:  "select * from repos;"
		select * from projects where repo='repo';
		select * from branches where repo='repo'
				      and project='project';
		select * from maps where repo='repo'
				  and project='project'
				   and branch='branch';
		select * from tables where repo='repo'
				    and project='project'
				     and branch='branch';
		select * from cycles where repo='repo'
				    and project='project'
				     and branch='branch';
		select * from suites where repo='repo'
				    and project='project'
				     and branch='branch';
		select * from steps where repo='repo'
				   and project='project'
				    and branch='branch';
    */
    fetch: function( request ){
	    var rq = dojo.mixin({}, request.query);
	    if(rq && (!rq.action || rq.action === "query")){
	        // make mods or adds if needed
	        rq.action = "query";
	        //rq.text contains the select query
	    }
	    request.query = rq;
	    return this.inherited(arguments);
    },

    /*

    */
    _processResults: function(results, def){
		if(results.query){
		   results = results.query;
		}
		return this.inherited(arguments);
    },

	/*
	* getRepos(callback):
	* Get an array of the available repositories.
	* 'callback' should be a callback function accepting a single object.
	* The object may be:
	*    null: unknown error,
	*    String: error message,
	*    array: 0 or more repositories.
	*/
	getRepos: function(callback){
		console.debug("store.getRepos running...");
		var q = "select * from repos";
		var request = {
			query: {
				action: "query",
				text: q
			},
			queryOption:{cache:false},
			onComplete: function(items, req){
				console.debug("store.getRepos raw results:", items);
				var repos = items["repos"];
				console.debug("store.getRepos.onComplete returning items:", repos);
				callback(repos);
			}
		};
		console.debug("store.getRepos request:", request);
		store.fetch(request);
	},

	/*
	* getProjects(arepo, callback):
	* Get an array of the projects in a repository.
	* 'arepo': unique id of the repository
	* 'callback': a callback function accepting a single results object.
	* The object may be:
	*    null: unknown error,
	*    String: error message,
	*    array: 0 or more projects.
	*/
	getProjects: function(arepo, callback){
		console.debug("store.getProjects running with '"+arepo+"'");
		var q = "select * from projects where repo='"+ arepo +"'";
		var request = {
			query: {
				action: "query",
				text: q
			},
			queryOption:{cache:true},
			onComplete: function(items, req){
				console.debug("store.getProjects from '"+arepo+"' raw results:", items);
				var projects = items["projects"];
				console.debug("store.getProjects.onComplete returning items:", projects);
				callback(projects);
			}
		};
		console.debug("store.getProjects request:", request);
		store.fetch(request);
	},

	/*
	* getBranches(arepo, aproject, callback):
	* Get an array of the branches in a repository project.
	* 'arepo': unique id of the repository
	* 'aproject': unique id of the project
	* 'callback': a callback function accepting a single results object.
	* The object may be:
	*    null: unknown error,
	*    String: error message,
	*    array: 0 or more branches.
	*/
	getBranches: function(arepo, aproject, callback){
		console.debug("store.getBranches running with repo:'"+arepo+"', project:'"+aproject+"'");
		var q = "select * from branches where repo='"+ arepo +"' and project='"+aproject+"'";
		var request = {
			query: {
				action: "query",
				text: q
			},
			queryOption:{cache:true},
			onComplete: function(items, req){
				console.debug("store.getProjects from '"+arepo+"' raw results:", items);
				var branches = items["branches"];
				console.debug("store.getBranches.onComplete returning items:", branches);
				callback(branches);
			}
		};
		console.debug("store.getBranches request:", request);
		store.fetch(request);
	},

	/*
	* initialize_app(update, complete):
	* 'update' callback called to update textual status, as needed.
	* 'complete' callback called when initialization is complete.
	* returns a Deferred objects whose then() method should be used.
	*/
	initialize_app: function(/*function*/ update, /*function*/ complete){
		console.debug("store.initializing storage...");
		var async = new dojo.Deferred();
		var done = function(result, params){
			var info = result["info"];
			update(info);
			this.initialize_users(update, complete, async);
		}
		var problem = function(result, params){
			console.debug("error params:", params);
			var info = params["cacheResults"]['query']['error'];
			async.errback(info['info']);
		}
		var request = {
			query: {
				action: "initialize",
				text:   "directories"
			},
			queryOption:{cache:false},
			onComplete: done,
			onError: problem
		};
		store.fetch(request);
		return async;
	},

	initialize_users: function(update, complete, async){
		console.debug("store.initializing users...");
		var done = function(result, params){
			var info = result["info"];
			update(info);
			this.initialize_groups(update, complete, async);
		}
		var problem = function(result, params){
			console.debug("error params:", params);
			var info = params["cacheResults"]['query']['error'];
			async.errback(info['info']);
		}
		var request = {
			query: {
				action: "initialize",
				text:   "users"
			},
			queryOption:{cache:false},
			onComplete: done,
			onError: problem
		};
		store.fetch(request);
	},

	initialize_groups: function(update, complete, async){
		console.debug("store.initializing groups...");
		var done = function(result, params){
			var info = result["info"];
			update(info);
			this.initialize_repository(update, complete, async);
		}
		var problem = function(result, params){
			console.debug("error params:", params);
			var info = params["cacheResults"]['query']['error'];
			async.errback(info['info']);
		}
		var request = {
			query: {
				action: "initialize",
				text:   "groups"
			},
			queryOption:{cache:false},
			onComplete: done,
			onError: problem
		};
		store.fetch(request);
	},

	initialize_repository: function(update, complete, async){
		console.debug("store.initializing repository...");
		var done = function(result, params){
			var info = result["info"];
			update(info);
			this.initialize_complete(update, complete, async);
		}
		var problem = function(result, params){
			console.debug("error params:", params);
			var info = params["cacheResults"]['query']['error'];
			async.errback(info['info']);
		}
		var request = {
			query: {
				action: "initialize",
				text:   "repository"
			},
			queryOption:{cache:false},
			onComplete: done,
			onError: problem
		};
		store.fetch(request);
	},

	initialize_complete: function(update, complete, async){

		console.debug("store.initialization complete.");
		complete(nls['complete_uc']);
		async.callback(true);

		//TODO:

	}
});
