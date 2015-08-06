<?php
	const DATASTORE_FILENAME = "FileDatastoreService.php";
	const DATASTORE_TIMEZONE = "America/New_York";

	const NLS_ROOT_DIR = "/js/idesigner/nls/";
	const NLS_FILENAME = "global.js";
	//const NLS_DEFAULT  = "en_US";

	const PAGE_TITLE = "Intelligent Design for SAFS";
	const PAGE_LOGIN = "IDesigner_Login.php";
	const PAGE_LOGOUT= "IDesigner_Logout.php";
	const PAGE_REALM = "Intelligent Design";

	const PHP_DIGEST = "PHP_AUTH_DIGEST";

	const REQUEST_LOGOUT = "logout";//?logout=
	const REQUEST_ACTION = "action";//?action=

	const SESSION_SESSIONID= "session_id";
	const SESSION_NONCE    = "nonce";

    const ADMIN_ROLE     	='G1';// All Permissions
    const REPO_ADMIN_ROLE	='G2';// Edit all aspects of a repository
    const PROJECT_ADMIN_ROLE='G3';// Edit all aspects of a project
    const BRANCH_ADMIN_ROLE	='G4';// Edit all aspects of a branch
    const AUTOMATOR_ROLE 	='G5';// DEV Designs, Actions, and Execute
    const DESIGNER_ROLE  	='G6';// DEV Designs Only, and Execute
    const EXECUTE_ROLE   	='G7';// Read and Execute Only
    const INSPECT_ROLE   	='G8';// Read Only
    const USERID_ROLE    	='U1'; // Individual User ID Role

    const INVALID_ID     =0;   // Invalid ID (no id or default)

    const ROOT_ID        =1;
    const ROOT_NAME      ='admin';
    const ROOT_PASS      ='admin';
    const ROOT_USER_KEY  ='1U';

    const STATUS_ACTIVE  ='ACTIVE';
    const STATUS_DELETED ='DELETED';
    const DEFAULT_USER_DESCRIPTION	= "NEW USER";
    const DEFAULT_USER_STATUSINFO	= "AUTO-GENERATED";


	const HEADER_CONTENT_HTML = "Content-Type: text/html";
	const HEADER_CONTENT_JAVA = "Content-Type: text/javascript";
	const HEADER_CONTENT_TEXT = "Content-Type: text/plain";
	const HEADER_CONTENT_XML  = "";

	const HEADER_UNAUTHORIZED = "HTTP/1.1 401 Unauthorized";
	const HEADER_AUTH_DIGEST  = 'WWW-Authenticate: Digest realm="';
	const HEADER_LOCATION     = "Location: ";

	const USERS_NOT_INITIALIZED = "users_not_initialized";//boolean true if isset = true

	const AUTHORIZATION			= "authorization";//GLOBALS authentication array
	const AUTHORIZED_USER		= "username";// field in authentication array

    const DEFAULT_REPOSITORY  	= "default";
    const DEFAULT_PROJECT	   	= "default";
    const DEFAULT_BRANCH	   	= "main";

    const USERINFO_USERNAME		="name";
    const USERINFO_ID			="id";
    const USERINFO_LABEL		="label";
    const USERINFO_VALUE		="value";
    const USERINFO_PASSWORD		="password";
    const USERINFO_DEFAULT_AUTH	="defaultAuth";
    const USERINFO_DESCRIPTION	="descript";
    const USERINFO_CREATE_DATE	="new_date";
    const USERINFO_CREATE_USER	="new_by";
    const USERINFO_STATUS		="status";
    const USERINFO_STATUS_INFO	="status_info";
    const USERINFO_FIRST_NAME	="first_name";
    const USERINFO_LAST_NAME	="last_name";
    const USERINFO_MID_NAME		="mid_name"; //ex: "Youqin" Cindy (Youqin) Wang
    const USERINFO_BACKUP_USER	="backup_user";

    const GROUPINFO_GROUPNAME	="name";
    const GROUPINFO_ID			="id";
    const GROUPINFO_LABEL		="label";
    const GROUPINFO_VALUE		="value";
    const GROUPINFO_DEFAULT_AUTH="defaultAuth";
    const GROUPINFO_DESCRIPTION	="descript";
    const GROUPINFO_CREATE_DATE	="new_date";
    const GROUPINFO_CREATE_USER	="new_by";
    const GROUPINFO_STATUS		="status";
    const GROUPINFO_STATUS_INFO	="status_info";
    const GROUPINFO_REPOSITORY	="repository";
    const GROUPINFO_PROJECT		="project";
    const GROUPINFO_BRANCH		="branch";
    const GROUPINFO_MEMBERS		="members";//path to membership list

    const GROUPMEMBER_ID		="id";    // unique userid of groupid
    const GROUPMEMBER_TYPE		="type";  // whether a user(ex: U1), or group (ex: G1)
    const GROUPMEMBER_ROLE		="role";  // role in this group
    const GROUPMEMBER_GROUP		="group"; // owning group (sanity check)
    const GROUPMEMBER_GROUPS    ="groups";// array of groups in the group
    const GROUPMEMBER_USERS     ="users"; // array of users in the group

	function unserializeFile($file){
		if(! is_file($file)) return null;
		$temp = file_get_contents($file, FILE_TEXT);
		if($temp === FALSE) return null;
		return unserialize($temp);
	}

	function getIDesignerParent(){
		$docroot = $_SERVER['DOCUMENT_ROOT'];
		$rootdir = dirname($_SERVER['PHP_SELF']);
		return $docroot . $rootdir . "/";
	}
	date_default_timezone_set(DATASTORE_TIMEZONE);
	require_once "authenticate.php";
	require_once DATASTORE_FILENAME;

?>