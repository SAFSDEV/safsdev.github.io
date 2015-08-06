<?php
	/****************************************************************
	 *
	 * process only authenticated datastore service calls from client
	 *
	 ****************************************************************/
	$urin = explode("?",$_SERVER['REQUEST_URI'],2);
	if(stripos($urin[0], DATASTORE_FILENAME)!==FALSE){

		$query = $_GET["text"];
		$fields = explode(" ", $query);

		// select
		if(strtolower($fields[0]) == "select"){


			$select = strtolower($fields[3]);

			//select * from repos
			if($select == "repos"){
				$repos = getRepositories();
				$result["query"]= array("repos"=>$repos,
										"info"=>getRepositoriesPath());
				header('Content-Type: text/javascript');
				print $_GET["callback"] ."(".json_encode($result).")";
				exit(0);

			//select * from projects where repo=repo
			}elseif ($select == "projects"){
				$where = strtolower($fields[5]);
				$parse = explode("=", $where);
				$repo = $parse[1];
				$repo = unquote($repo);
				$projects= getProjects($repo);
				$result["query"]= array("repo"=>$repo,
										"projects"=>$projects,
										"info"=>getProjectsPath($repo));
				header('Content-Type: text/javascript');
				print $_GET["callback"] ."(".json_encode($result).")";
				exit(0);

			//select * from branches where repo=repo and project=project
			}elseif ($select == "branches"){
				$where = strtolower($fields[5]);
				$parse = explode("=", $where);
				$repo = $parse[1];
				$repo = unquote($repo);
				$where = strtolower($fields[7]);
				$parse = explode("=", $where);
				$project = $parse[1];
				$project = unquote($project);
				$branches = getBranches($repo, $project);
				$result["query"]= array("repo"=>$repo,
										"project"=>$project,
										"branches"=>$branches,
										"info"=>getBranchesPath($repo,$project));
				header('Content-Type: text/javascript');
				print $_GET["callback"] ."(".json_encode($result).")";
				exit(0);
			}
		} else {
			$result["query"]= array("info"=>":nls:unimplemented_request:".$action.":".$query);
			header('Content-Type: text/javascript');
			print $_GET["callback"] ."(".json_encode($result).")";
			exit(0);
		}
	}
	// should consider sending illegitimate calls to Login Screen
?>