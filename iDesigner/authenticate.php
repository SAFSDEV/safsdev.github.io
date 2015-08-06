<?php

	session_start();
	if (empty($_SESSION[SESSION_NONCE])) {
		session_regenerate_id();
		$_SESSION[SESSION_SESSIONID] = session_id();
		$_SESSION[SESSION_NONCE] = md5($_SESSION[SESSION_SESSIONID]);
		header(HEADER_LOCATION . PAGE_LOGIN, TRUE, 301);
		exit;
	}

	function challenge(){
		header(HEADER_UNAUTHORIZED);
		header(HEADER_AUTH_DIGEST . PAGE_REALM .'",
			   qop="auth",nonce="'.$_SESSION[SESSION_NONCE].'",opaque="'.md5(PAGE_REALM).'"');

		//send logoff page
		die(PAGE_TITLE. " requires user login.<p><a href='?".PAGE_LOGIN."'>Goto Login</a>");
		exit;
	}

	function new_session(){
		$_SESSION[SESSION_SESSIONID] = session_id();
		$_SESSION[SESSION_NONCE] = md5($_SESSION[SESSION_SESSIONID]);
		header(HEADER_LOCATION. PAGE_LOGIN, TRUE, 301);
		exit;
	}

	function log_out() {
		session_destroy();
		session_unset($_SESSION[SESSION_SESSION_ID]);
		session_unset($_SESSION[SESSION_NONCE]);
		header(HEADER_LOCATION. PAGE_LOGOUT, TRUE, 301);
		exit;
	}

	function authenticate(){
		if(!isset($_SERVER[PHP_DIGEST]))	                                challenge();
		if(! ($GLOBALS[AUTHORIZATION] = http_digest_parse($_SERVER[PHP_DIGEST]))) challenge();

		$password = getUserPassword($GLOBALS[AUTHORIZATION][AUTHORIZED_USER]);
		if(!$password)                                                          challenge();

		// generate the valid response
		$A1 = md5($GLOBALS[AUTHORIZATION][AUTHORIZED_USER] . ':' . $GLOBALS[AUTHORIZATION]['realm'] . ':'. $password);
		$A2 = md5($_SERVER['REQUEST_METHOD'].':'.$GLOBALS[AUTHORIZATION]['uri']);
		//$valid_response = md5($A1.':'.$GLOBALS[AUTHORIZATION]['nonce'].':'.$GLOBALS[AUTHORIZATION]['nc'].':'.$GLOBALS[AUTHORIZATION]['cnonce'].':'.$GLOBALS[AUTHORIZATION]['qop'].':'.$A2);
		$valid_response = md5($A1.':'.$_SESSION['nonce'].':'.$GLOBALS[AUTHORIZATION]['nc'].':'.$GLOBALS[AUTHORIZATION]['cnonce'].':'.$GLOBALS[AUTHORIZATION]['qop'].':'.$A2);

		if ($GLOBALS[AUTHORIZATION]['response'] != $valid_response) challenge();

		//check for log off request
		if( isset($_REQUEST[REQUEST_LOGOUT])) {
			unset($_REQUEST[REQUEST_LOGOUT]);
			log_out();
		}
	}

	// function to parse the http auth header
	// returns FALSE or valid $data
	function http_digest_parse($txt)
	{
		// protect against missing data
		$needed_parts = array('nonce'=>1, 'nc'=>1, 'cnonce'=>1, 'qop'=>1, 'username'=>1, 'uri'=>1, 'response'=>1, 'realm'=>1);
		$data = array();
		$keys = implode('|', array_keys($needed_parts));

		preg_match_all('@(' . $keys . ')=(?:([\'"])([^\2]+?)\2|([^\s,]+))@', $txt, $matches, PREG_SET_ORDER);

		foreach ($matches as $m) {
			$data[$m[1]] = $m[3] ? $m[3] : $m[4];
			unset($needed_parts[$m[1]]);
		}

		return $needed_parts ? false : $data;
	}

?>