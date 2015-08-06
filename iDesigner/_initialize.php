<?php
	/****************************************************************
	 *
	 * process only authenticated datastore service calls from client
	 *
	 ****************************************************************/
	$urin = explode("?",$_SERVER['REQUEST_URI'],2);
	if(stripos($urin[0], DATASTORE_FILENAME)!==FALSE){

		// *** dangerous intent to wipe out everything ***
		if(hasInitPermission()){ //using $GLOBALS[AUTHORIZED][AUTHORIZED_USER];

			$query = $_GET["text"];
			$query = strtolower($query);

			// initialize directories
			if($query == "directories"){

				$root           = getRepositoryRoot();

				if((! is_dir($root))&&(!mkdir($root))){
					$result['query'] = array("result"=>null,
											"error"=>array(
												"info"=>":nls:error_create_repository"),
											"id"=>null);
					header('Content-Type: text/javascript');
					print $_GET["callback"] ."(".json_encode($result).")";
					exit(0);
				}
				$result["query"]= array("info"=>":nls:repository_storage_ok");
				header('Content-Type: text/javascript');
				print $_GET["callback"] ."(".json_encode($result).")";
				exit(0);

			// initialize       users
			}else if($query == "users"){

				$users = getUsersPath();

				if((! is_dir($users))&&(!mkdir($users))){
					$result['query'] = array("result"=>null,
											"error"=>array(
												"info"=>":nls:error_create_users"),
											"id"=>null);
					header('Content-Type: text/javascript');
					print $_GET["callback"] ."(".json_encode($result).")";
					exit(0);
				}

				if(!isUser(ROOT_NAME)){
					if(! createNewUser(array(USERINFO_USERNAME=>ROOT_NAME,
											 USERINFO_PASSWORD=>convert_uuencode(ROOT_PASS),
											 USERINFO_DEFAULT_AUTH=>ADMIN_ROLE))){
						$result['query'] = array("result"=>null,
												"error"=>array(
													"info"=>":nls:error_create_admin:".ROOT_NAME),
												"id"=>null);
						header('Content-Type: text/javascript');
						print $_GET["callback"] ."(".json_encode($result).")";
						exit(0);
					}
				}

				$result["query"]= array("info"=>":nls:user_storage_ok");
				header('Content-Type: text/javascript');
				print $_GET["callback"] ."(".json_encode($result).")";
				exit(0);

			// initialize       groups
			}else if($query == "groups"){

				$groups = getGroupsPath();

				if((! is_dir($groups))&&(!mkdir($groups))){
					$result['query'] = array("result"=>null,
											"error"=>array(
												"info"=>":nls:error_create_groups"),
											"id"=>null);
					header('Content-Type: text/javascript');
					print $_GET["callback"] ."(".json_encode($result).")";
					exit(0);
				}

				if((! is_dir(getGroupMembersPath()))&&(!mkdir(getGroupMembersPath()))){
					$result['query'] = array("result"=>null,
											"error"=>array(
												"info"=>":nls:error_create_group_members_dir"),
											"id"=>null);
					header('Content-Type: text/javascript');
					print $_GET["callback"] ."(".json_encode($result).")";
					exit(0);
				}


				if(!isGroup(ADMIN_GROUP)){
					if(! createNewGroup(array( GROUPINFO_GROUPNAME => ADMIN_GROUP,
											   GROUPINFO_DEFAULT_AUTH => ADMIN_ROLE
											  ))){
						$result['query'] = array("result"=>null,
												"error"=>array(
												"info"=>":nls:error_create_admin_group:".ADMIN_GROUP),
												"id"=>null);
						header('Content-Type: text/javascript');
						print $_GET["callback"] ."(".json_encode($result).")";
						exit(0);
					}
				}

				// initialize admin group members
				// add all known admin users
				$users = getAllUserIds();
				foreach($users as $user){
					$userinfo = getUserInfo($user);
					if(!$userinfo === FALSE){
						if(isset($userinfo[USERINFO_DEFAULT_AUTH]) &&
							$userinfo[USERINFO_DEFAULT_AUTH] == ADMIN_ROLE){
							if(! addGroupMember(ADMIN_GROUP,
										   array( GROUPMEMBER_GROUP => ADMIN_GROUP,
												  GROUPMEMBER_ID => $user,
												  GROUPMEMBER_TYPE => USERID_ROLE,
												  GROUPMEMBER_ROLE => ADMIN_ROLE
												))){
								$result['query'] = array("result"=>null,
														"error"=>array(
														"info"=>":nls:error_create_admin_member:".$user),
														"id"=>null);
								header('Content-Type: text/javascript');
								print $_GET["callback"] ."(".json_encode($result).")";
								exit(0);
							}
						}
					}
				}
				if(getGroupMembersCount(ADMIN_GROUP) > 0){
					$result["query"]= array("info"=>":nls:group_storage_ok");
					header('Content-Type: text/javascript');
					print $_GET["callback"] ."(".json_encode($result).")";
					exit(0);
				}else{
					$result['query'] = array("result"=>null,
											"error"=>array(
											"info"=>":nls:error_create_admin_members"),
											"id"=>null);
					header('Content-Type: text/javascript');
					print $_GET["callback"] ."(".json_encode($result).")";
					exit(0);
				}
			// initialize       repository
			}else if($query == "repository"){

				//create 'repositories' directory, if necessary
				//create default repository with admin_group auth
				//evaluate other directories in 'repositories', if any
				//		create repo_info for each directory
				//		create 'projects' directory, if necessary
				//		create default project with admin_group auth
				//evaluate other directories in 'projects', if any
				//		create project_info for each directory
				//		create 'branches' directory, if necessary
				//		create default branch with admin_group auth
				//evaluate other directories in 'branches', if any
				//		create branch_info for each directory

				$result["query"]= array("info"=>":nls:unimplemented_request:".$action.":".$query);
				header('Content-Type: text/javascript');
				print $_GET["callback"] ."(".json_encode($result).")";
				exit(0);

			// unrecognized initialization request
			}else{

				$result["query"]= array("info"=>":nls:unimplemented_request:".$action.":".$query);
				header('Content-Type: text/javascript');
				print $_GET["callback"] ."(".json_encode($result).")";
				exit(0);
			}
		}else{
			//insufficient permissions response here
			$result['query'] = array("result"=>null,
									"error"=>array(
										"info"=>":nls:permission_denied:".$action.":".$_GET['text']),
									"id"=>null);
			header('Content-Type: text/javascript');
			print $_GET["callback"] ."(".json_encode($result).")";
			exit(0);
		}
		exit(0);
	}
	// should consider sending illegitimate calls to Login Screen
?>