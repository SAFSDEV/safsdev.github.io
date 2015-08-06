
<?php

    const USERINFO_DIR			= "users/";

    const REPOSITORY_ROOT		= "repository/";

    const REPOSITORIES_DIR     	= "repositories/";
    const REPOSITORYINFO_FILE  	= "repositoryinfo.js";

    const PROJECTS_DIR         	= "projects/";
    const PROJECTINFO_FILE     	= "projectinfo.js";

    const BRANCHES_DIR         	= "branches/";
    const BRANCHINFO_FILE      	= "branchinfo.js";

    const GROUPINFO_DIR		   	= "groups/";
	const GROUPINFO_FILE       	= "members";

    const GROUPMEMBER_DIR		= "members/";

    const ADMIN_GROUP	 		= "admin";

    const AUTOMATOR_GROUP_FILE 	= "automator";
    const DESIGNER_GROUP_FILE  	= "designer";
    const INSPECT_GROUP_FILE   	= "inspect";
    const EXECUTE_GROUP_FILE   	= "execute";


	// password for username or FALSE
	// sets $GLOBALS[USERS_NOT_INITIALIZED] if database does not exist!
	function getUserPassword($username){
		$file = getUsersPath() . $username;
		if(is_file($file)){
			$data = unserializeFile($file);
			if(isset($data[USERINFO_PASSWORD])){
				return convert_uudecode($data[USERINFO_PASSWORD]);
			}else{
				return FALSE;
			}
		}else if($username == ROOT_NAME && (!is_dir(getUsersPath()))){
			$GLOBALS[USERS_NOT_INITIALIZED] = true;
			return ROOT_PASS;
		}
		return FALSE;
	}

	function hasInitPermission(){
		$user = $GLOBALS[AUTHORIZATION][AUTHORIZED_USER];
		if($user == ROOT_NAME && isset($GLOBALS[USERS_NOT_INITIALIZED])) return TRUE;
		if(! isUser($user)) return FALSE;
		$userinfo = getUserInfo($user);
		if(isset($userinfo[USERINFO_DEFAULT_AUTH]) && $userinfo[USERINFO_DEFAULT_AUTH]==ADMIN_ROLE) return TRUE;
		return FALSE;
	}

	function getSubdirectories($path){
		$dirs = array();
		if(! is_dir($path)) return $dirs;
		$files = scandir($path);
		if($files === FALSE) return $dirs;
        foreach ($files as $afile){
            $filepath = $path . $afile;
            if(is_dir($filepath)){
                if($afile == "." or $afile == ".."){
                    //skip these
                }else{
        	        $dirs[] = $afile;
        	    }
        	}
        }
        return $dirs;
	}

	function getFilenames($path){
		$files = array();
		if(! is_dir($path)) return $files;
		$files = scandir($path);
		if($files === FALSE) return $dirs;
        foreach ($files as $afile){
            $filepath = $path . $afile;
            if(is_file($filepath)){
				$files[] = $afile;
        	}
        }
        return $files;
	}

	/*
	 * create an array of id=>[id=>item, label=>item, value=>item]
	 * for each item in the given array
	 *
	 */
	function labelize($items){
		$rc = array();
		foreach($items as $item){
			$rc[] = array("id"=>$item, "label"=>$item,"value"=>$item);
		}
		return $rc;
	}

	function getRepositoryRoot(){
		return getIDesignerParent(). REPOSITORY_ROOT;
	}
	function getUsersPath(){
		return getRepositoryRoot(). USERINFO_DIR;
	}
	function getGroupsPath(){
		return getRepositoryRoot(). GROUPINFO_DIR;
	}
	function getGroupMembersPath(){
		return getGroupsPath() . GROUPMEMBER_DIR;
	}
	function getRepositoriesPath(){
		return getRepositoryRoot(). REPOSITORIES_DIR;
	}
	function getProjectsPath($repo){
		return getRepositoriesPath(). $repo ."/". PROJECTS_DIR;
	}
	function getBranchesPath($repo, $project){
		return getProjectsPath($repo). $project ."/". BRANCHES_DIR;
	}
	function getAllUserIds(){
		return getFilenames(getUsersPath());
	}

	/*
	 * For each repository return an array of:
	 *   [id=>item, label=>item, value=>item]
	 * Return FALSE if there are none
	 */
	function getRepositories(){
		$rc = getSubdirectories(getRepositoriesPath());
		if ($rc === FALSE) return FALSE;
		return labelize($rc);
	}

	/*
	 * For each project in repo return an array of:
	 *   [id=>item, label=>item, value=>item, repo=>repoId]
	 * Return FALSE if there are none
	 */
	function getProjects($repo){
		$rc = getSubdirectories(getProjectsPath($repo));
		if ($rc === FALSE) return FALSE;
		$rc = labelize($rc);
		foreach($rc as $value){
			$value['repo'] = $repo;
		}
		return $rc;
	}

	/*
	 * For each branch in project in repo return an array of:
	 *   [id=>item, label=>item, value=>item, repo=>repoId, project=>projectId]
	 * Return FALSE if there are none
	 */
	function getBranches($repo, $project){
		$rc = getSubdirectories(getBranchesPath($repo, $project));
		if ($rc === FALSE) return FALSE;
		$rc = labelize($rc);
		foreach($rc as $value){
			$value['repo'] = $repo;
			$value['project'] = $project;
		}
		return $rc;
	}

	/*
	 * Add a new user to internal storage.
	 * Array must contain unique 'username'
	 * Assumes required /users/ dir exists
	 * Return success TRUE of FALSE
	 */
	function createNewUser(/* array */ $auser){
		if(! isset($auser[USERINFO_USERNAME])) return FALSE;
		if(! isset($auser[USERINFO_PASSWORD])) return FALSE;
		if(! isset($auser[USERINFO_ID])) $auser[USERINFO_ID] = $auser[USERINFO_USERNAME];
		if(! isset($auser[USERINFO_LABEL])) $auser[USERINFO_LABEL] = $auser[USERINFO_USERNAME];
		if(! isset($auser[USERINFO_VALUE])) $auser[USERINFO_VALUE] = $auser[USERINFO_USERNAME];
		if(! isset($auser[USERINFO_CREATE_DATE])) $auser[USERINFO_CREATE_DATE] = date(DATE_COOKIE);
		if(! isset($auser[USERINFO_CREATE_USER])) $auser[USERINFO_CREATE_USER] = $GLOBALS[AUTHORIZATION][AUTHORIZED_USER];
		if(! isset($auser[USERINFO_STATUS])) $auser[USERINFO_STATUS] = STATUS_ACTIVE;
		$data = serialize($auser);
		$file = getUsersPath().$auser[USERINFO_USERNAME];
		$rc = file_put_contents($file, $data, FILE_TEXT OR LOCK_EX);
		return !($rc===FALSE);
	}
	/*
	 * call createNewUser. It allows us to overwrite
	 */
	function updateUserInfo(/* array */ $auser){
		return createNewUser($auser);
	}

	/*
	 * Return TRUE if UserInfo for username exists.
	 */
	function isUser(/* username */ $ausername){
		return is_File(getUsersPath().$ausername);
	}

	/*
	 * Get userinfo array from internal storage
	 * Assumes required /users/ dir exists
	 * Return data array or FALSE
	 */
	function getUserInfo(/* username */ $ausername){
		$file = getUsersPath().$ausername;
		$data = unserializeFile($file);
		if($data == null) return FALSE;
		return $data;
	}

	/*
	 * Return TRUE if GroupInfo for group exists.
	 */
	function isGroup(/* username */ $agroupname){
		return is_File(getGroupsPath().$agroupname);
	}

	/*
	 * Add a new group to internal storage.
	 * Assumes required /groups/ dir exists
	 * Return success TRUE of FALSE
	 */
	function createNewGroup(/* array */ $agroup){
		if(! isset($agroup[GROUPINFO_GROUPNAME])) return FALSE;
		if(! isset($agroup[GROUPINFO_DEFAULT_AUTH])) return FALSE;
		if(! isset($agroup[GROUPINFO_ID])) $agroup[GROUPINFO_ID] = $agroup[GROUPINFO_GROUPNAME];
		if(! isset($agroup[GROUPINFO_LABEL])) $agroup[GROUPINFO_LABEL] = $agroup[GROUPINFO_GROUPNAME];
		if(! isset($agroup[GROUPINFO_VALUE])) $agroup[GROUPINFO_VALUE] = $agroup[GROUPINFO_GROUPNAME];
		if(! isset($agroup[GROUPINFO_CREATE_DATE])) $agroup[GROUPINFO_CREATE_DATE] = date(DATE_COOKIE);
		if(! isset($agroup[GROUPINFO_CREATE_USER])) $agroup[GROUPINFO_CREATE_USER] = $GLOBALS[AUTHORIZATION][AUTHORIZED_USER];
		if(! isset($agroup[GROUPINFO_STATUS])) $agroup[GROUPINFO_STATUS] = STATUS_ACTIVE;
		if(! isset($agroup[GROUPINFO_MEMBERS])) $agroup[GROUPINFO_MEMBERS] = getGroupMembersPath().$agroup[GROUPINFO_GROUPNAME]."_".GROUPINFO_FILE;
		$data = serialize($agroup);
		$file = getGroupsPath().$agroup[GROUPINFO_GROUPNAME];
		$rc = file_put_contents($file, $data, FILE_TEXT OR LOCK_EX);
		return !($rc===FALSE);
	}

	/*
	 * call createNewGroup. It allows us to overwrite
	 */
	function updateGroupInfo(/* array */ $agroup){
		return createNewGroup($agroup);
	}

	/*
	 * Get groupinfo array from internal storage
	 * Assumes required /groups/ dir exists
	 * Return data array or FALSE
	 */
	function getGroupInfo(/* groupname */ $agroupname){
		$file = getGroupsPath().$agroupname;
		$data = unserializeFile($file);
		if($data == null) return FALSE;
		return $data;
	}

	/*
	 * Update groupmembers array to internal storage
	 * Assumes required /groups/ dir exists
	 * Return success TRUE or FALSE
	 */
	function updateGroupMembers(/* groupname */ $agroupname, $members){
		$groupinfo = getGroupInfo($agroupname);
		if($groupinfo == null) return FALSE;
		if(!isset($groupinfo[GROUPINFO_MEMBERS])) return FALSE;
		$file = $groupinfo[GROUPINFO_MEMBERS];
		$data = serialize($members);
		$rc = file_put_contents($file, $data, FILE_TEXT OR LOCK_EX);
		return !($rc===FALSE);
	}

	/*
	 * Get groupmembers array from internal storage
	 * Assumes required /groups/ dir exists
	 * Return data array if group is valid, FALSE if not.
	 * Data array may be empty of groups and users.
	 */
	function getGroupMembers(/* groupname */ $agroupname){
		$file = getGroupsPath().$agroupname;
		$groupinfo = unserializeFile($file);
		if($groupinfo == null) return FALSE;
		if(!isset($groupinfo[GROUPINFO_MEMBERS])) return FALSE;
		$memberdata = unserializeFile($groupinfo[GROUPINFO_MEMBERS]);
		if($memberdata == null) {
			$memberdata = array(GROUPMEMBER_GROUPS => array(),
								GROUPMEMBER_USERS  => array());
		}
		return $memberdata;
	}

	function getGroupMembersCount( $agroupname ){
		$count = 0;
		$members = getGroupMembers($agroupname);
		if(! is_array($members)) return 0;
		$users = $members[GROUPMEMBER_USERS];
		if(is_array($users)) $count += count($users);
		$groups = $members[GROUPMEMBER_GROUPS];
		if(is_array($groups)) $count += count($groups);
		return $count;
	}

	/*
	 * Add a member to a group in internal storage
	 * Assumes required /groups/ dir exists
	 * Return success TRUE or FALSE
	 */
	function addGroupMember(/* groupname */ $agroup, /* array */ $amember){
		if(! isset($amember[GROUPMEMBER_ID])) return FALSE;
		if(! isset($amember[GROUPMEMBER_TYPE])) return FALSE;
		if(! isset($amember[GROUPMEMBER_ROLE])) return FALSE;
		if(! isset($amember[GROUPMEMBER_GROUP])) return FALSE;
		$members = getGroupMembers($agroup);
		if($members === FALSE) return FALSE; //may be empty, but normally not FALSE
		$groups = $members[GROUPMEMBER_GROUPS];
		$users  = $members[GROUPMEMBER_USERS];
		if($amember[GROUPMEMBER_TYPE]==USERID_ROLE){
			$users[$amember[GROUPMEMBER_ID]] = $amember;//will overwrite existing
			$members[GROUPMEMBER_USERS] = $users;
		}else{
			$groups[$amember[GROUPMEMBER_ID]] = $amember;//will overwrite existing
			$members[GROUPMEMBER_GROUPS] = $groups;
		}
		return updateGroupMembers($agroup, $members);
	}

	/*
	 * parse utility for service request statements
	 */
	function unquote($value){
		return str_replace("'","", $value);
	}

	require_once "_shared.php";

	/****************************************************************
	 *
	 * process only authenticated datastore service calls from client
	 *
	 ****************************************************************/
	$urin = explode("?",$_SERVER['REQUEST_URI'],2);
	if(stripos($urin[0], DATASTORE_FILENAME)!==FALSE){

		authenticate();

		if($_GET['action']) {

			$action = $_GET["action"];
			if($action == "query"){

				require_once "_query.php";

			} else if($action == "initialize"){

				require_once "_initialize.php";

			} else {//$action not 'query' or 'initialize'
				$result['query'] = array("result"=>null,
										"error"=>array(
											"info"=>":nls:unimplemented_request:".$action),
										"id"=>null);
				header('Content-Type: text/javascript');
				print $_GET["callback"] ."(".json_encode($result).")";
				exit(0);
			}
		}else{
			$result['query'] = array("result"=>null,
									"error"=>array(
										"info"=>":nls:no_default_query"),
									"id"=>null);
			header('Content-Type: text/javascript');
			print $_GET["callback"] ."(".json_encode($result).")";
			exit(0);
		}// END:if $_GET action
	}// END:if REQUEST_URI
?>