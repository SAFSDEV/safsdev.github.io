<?php
    require_once "_shared.php";
    require_once "UserClass.php";
    require_once "GroupClass.php";

	function getRepositoriesPath(){
		$rootdir = getIDesignerParent() . REPOSITORIES_DIR;
		if(is_dir($rootdir)) {
			return $rootdir;
		}else{
		    return null;
		}
	}

	function getFilePath($source, $file){
		$path = $source . $file;
		if(is_file($path)) {
		    return $path;
		}else{
			return null;
		}
	}

	$root           = null;
	$userinfo       = null;
	$userpass       = null;
	$groupinfo      = null;
	$admingroup     = null;
	$repositoryinfo = null;

	$output_text = "";

	if(getRepositoriesPath()){
		$root = getRepositoriesPath();
		$output_text = "Directory '". REPOSITORIES_DIR ."' exists.\n";
	}else{
		$root = getRepositoriesParent() . REPOSITORIES_DIR;
		if(!mkdir($root)){
			header('Content-Type: text/plain');
			print "\n*** ERROR *** Unable to create required '". REPOSITORIES_DIR ."' directory.\n";
			exit(0);
		}else{
			$output_text = "Directory '". REPOSITORIES_DIR ."' created successfully.\n";
		}
	}

	//$root holds path to '/repositories/ directory'

	$root = $root . '/';

	if(getFilePath($root, USERINFO_FILE)){
		$file = getFilePath($root, USERINFO_FILE);
		$userinfo = unserializeFile($file);
		if($userinfo){
			$output_text .= "User data exists for ". count($userinfo) ." users.\n";
		}else{
			$output_text .= "\n*** ERROR *** Unable to load User data.\n";
			header('Content-Type: text/plain');
			print $output_text;
			exit(0);
		}
	}else{ // attempt to create initial userinfo.js file containing ADMIN info
		$args = array( "id"=>RoleClass::ROOT_ID,
		               "name"=>RoleClass::ROOT_NAME,
		               "description"=>"Overall Application Admin Account",
		               "new_date"=>date(DATE_COOKIE),
		               "new_id"=>RoleClass::ROOT_ID,
		               "status"=>RoleClass::STATUS_ACTIVE,
		               "status_info"=>"Auto-Generated",
		               "first_name"=>RoleClass::ROOT_NAME,
		               "last_name"=>RoleClass::ROOT_NAME,
		               "backup_id"=>RoleClass::ROOT_ID
		);
		$admin = new UserClass($args);
		$userinfo[$admin->getId()] = $admin;
		$data = serialize($userinfo);
		$file = $root . USERINFO_FILE;
		$rc = file_put_contents($file, $data, FILE_TEXT OR LOCK_EX);
		if($rc===FALSE){
			$output_text .= "\n*** ERROR *** Unable to create User data file.\n";
			header('Content-Type: text/plain');
			print $output_text;
			exit(0);
		}
	}

	$output_text .= "\nUserInfo Data:\n". serialize($userinfo)."\n";

	//$root holds path to '/repositories/ directory'
	//$userinfo contains array of all known UserClass objects

	if(getFilePath($root, USERPASS_FILE)){
		$file = getFilePath($root, USERPASS_FILE);
		$userpass = unserializeFile($file);
		if($userpass){
			$output_text .= "\nAuthentication data exists.\n";
		}else{
			$output_text .= "\n*** ERROR *** Unable to load authentication data.\n";
			header('Content-Type: text/plain');
			print $output_text;
			exit(0);
		}
	}else{
		$user = $userinfo[RoleClass::ROOT_ID];
		if($user){
			$userpass = array( $user->getName()=>convert_uuencode(RoleClass::ROOT_PASS));
			$data = serialize($userpass);
			$file = $root . USERPASS_FILE;
			$rc = file_put_contents($file, $data, FILE_TEXT OR LOCK_EX);
			if($rc===FALSE){
				$output_text .= "\n*** ERROR *** Unable to create User Authentication file.\n";
				header('Content-Type: text/plain');
				print $output_text;
				exit(0);
			}
		}else{

			// ERROR: No Root (Admin) user defined!
			$output_text .= "\n*** ERROR *** No ROOT/ADMIN User Defined.\n";
			header('Content-Type: text/plain');
			print $output_text;
			exit(0);
		}
	}

	//$root holds path to '/repositories/ directory'
	//$userinfo contains array of all known UserClass objects keyed by "id"
	//$userpass contains array of all encrypted userid passwords by "id"

	$output_text .= "\nUser Authentication Data:\n". serialize($userpass)."\n";

	// verify/create groupinfo table

	if(getFilePath($root, GROUPINFO_FILE)){
		$file = getFilePath($root, GROUPINFO_FILE);
		$groupinfo = unserializeFile($file);
		if($groupinfo){
			$output_text .= "\nGroup data exists for ". count($groupinfo) ." groups.\n";
		}else{
			$output_text .= "\n*** ERROR *** Unable to load Group data.\n";
			header('Content-Type: text/plain');
			print $output_text;
			exit(0);
		}
	}else{ // attempt to create initial groupinfo.js file containing APP ADMIN info
	    $path = $root . ADMIN_GROUP_FILE;
		$args = array( "id"=>RoleClass::ROOT_ID,
		               "name"=>RoleClass::ROOT_NAME,
		               "description"=>"Overall Application Admin Group",
		               "new_date"=>date(DATE_COOKIE),
		               "new_id"=>RoleClass::ROOT_ID,
		               "status"=>RoleClass::STATUS_ACTIVE,
		               "status_info"=>"Auto-Generated",
		               "role"=>RoleClass::ADMIN_ROLE,
		               "path"=>$path
		);
		$admin = new GroupClass($args);
		$groupinfo[$admin->getId()] = $admin;
		$data = serialize($groupinfo);
		$file = $root . GROUPINFO_FILE;
		$rc = file_put_contents($file, $data, FILE_TEXT OR LOCK_EX);
		if($rc===FALSE){
			$output_text .= "\n*** ERROR *** Unable to create Group data file.\n";
			header('Content-Type: text/plain');
			print $output_text;
			exit(0);
		}
	}

	$output_text .= "\nGroupInfo Data:\n". serialize($groupinfo)."\n";

	// verify/create admin_group table (users must exist)

	$admininfo = $groupinfo[RoleClass::ROOT_ID];

	$output_text .= "\nAdmin Group Class Data: ". serialize($admininfo) ."\n";

	$adminpath = $admininfo->getPath();

	$output_text .= "\nAdmin Group Data expected path: ". $adminpath ."\n";

	if(is_File($adminpath)){
		$admingroup = unserializeFile($adminpath);
		if($admingroup){
			$output_text .= "\nAdmin Group data exists.\n";
		}else{
			$output_text .= "\n*** ERROR *** Unable to load Admin Group data.\n";
			header('Content-Type: text/plain');
			print $output_text;
			exit(0);
		}
	}else{
		$user = $userinfo[RoleClass::ROOT_ID];
		if($user){
			$key = RoleClass::ROOT_USER_KEY;
			$admingroup = array( $key=>array("id"=>$user->getId(),"type"=>RoleClass::USERID_ROLE));
			$data = serialize($admingroup);
			$file = $root . ADMIN_GROUP_FILE;
			$rc = file_put_contents($file, $data, FILE_TEXT OR LOCK_EX);
			if($rc===FALSE){
				$output_text .= "\n*** ERROR *** Unable to create Admin Group file.\n";
				header('Content-Type: text/plain');
				print $output_text;
				exit(0);
			}
		}else{

			// ERROR: No Root (Admin) user defined!
			$output_text .= "\n*** ERROR *** No ROOT/ADMIN User Defined.\n";
			header('Content-Type: text/plain');
			print $output_text;
			exit(0);
		}
	}

	$output_text .= "\nAdmin Group Data:\n". serialize($admingroup)."\n";

	// verify there is the ROOT_ID User in the admin group

	$rootuser = $admingroup[RoleClass::ROOT_USER_KEY];
	if((is_array($rootuser)) AND (count($rootuser)>0)){
		$output_text .= "\nRoot Admin User exists in Admin Group.\n";
	}else{
		// ERROR: No Root (Admin) user defined!
		$output_text .= "\n*** ERROR *** No ROOT/ADMIN User in Admin Group.\n";
		header('Content-Type: text/plain');
		print $output_text;
		exit(0);
	}

	// verify/create top-level repositorinfo groups
	//   a) create "default" repository if none exists

	$repos = getSubdirectories($root);

	if(count($repos)> 0){

	}else{

	}

	$output_text .= "\nRepositoryInfo Data:\n". serialize($repositoryinfo)."\n";


	// verify/create repository groups per each repo directory
	// verify/create project groups per each project directory
	//   a) create "default" project if none exists
	// verify/create branch groups per each branch directory
	//   a) create "main" branch if none exists


	header('Content-Type: text/plain');
	print $output_text;

?>