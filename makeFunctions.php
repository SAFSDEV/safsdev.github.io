<?php

	include_once("makeConstants.php");

Function validPost()
{
	global $file;
	global $tool;
	global $allOptionState;
	global $message;
	global $rrState;
	global $wrState;
	global $HTTP_POST_VARS;

	// validate the input parameters.  build results info

	//check the filename BEFORE the ALL LIBS control
	$file = $HTTP_POST_VARS['userfile'];
	if ($file == DEFAULT_ALL_VALUE)
		$allOptionState = true;
	else
	{
		$allOptionState = false;
		if ($file == "")
			$file = DEFAULT_LIBRARY_TEXT;
	}

	// the ALL LIBS control
	if (isset($HTTP_POST_VARS['allOption']))
	{
		$allOptionState = true;
		$file = DEFAULT_ALL_VALUE;
	}

	$tool = $HTTP_POST_VARS['tool'];

	if ($allOptionState == true)
		$message = "Considering ALL LIBRARIES for $tool.";
	else
		$message = "Your $tool request is being considered...";

	switch ($tool)
	{
		case RATIONAL_TOOL:
			 $rrState = TOOL_ENABLED;
			 $wrState = TOOL_DISABLED;
			break;
		case WINRUNNER_TOOL:
			 $wrState = TOOL_ENABLED;
			 $rrState = TOOL_DISABLED;
			break;
	}

	if ($file == DEFAULT_LIBRARY_TEXT)
	{
		$message = "You must specify a valid Library or ALL";

		// DEBUG INFO
		//foreach ($GLOBALS as $key=>$value)	{
		//	print "\$GLOBALS[\"$key\"] == $value<BR>";
		//}

		return false;
	}

	return true;

} // end validPost()

?>