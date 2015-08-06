<?php
/*
	Extract the XML content from source files.
	This script accepts the following parameters:

	*)'file='   -- the file to process. Filename patterns are allowed.
	*)'dir='    -- the subdir off the current dir to locate the file(s).
	*)'NOWRITE' -- do NOT write output file. Only return the result info.
				   Otherwise, XML content will be written to <dir>/xml/

	No file will be written if XML is not found.
*/

	include("makeFunctions.php");
	include_once("makeConstants.php");


	$message = "Welcome to the XML Doc Extraction Tool!";
	$file    = DEFAULT_LIBRARY_TEXT;
	$rrState = TOOL_ENABLED;
	$wrState = TOOL_DISABLED;

	//see if this is first request
	if ((count ($HTTP_POST_VARS)> 0) && (! isset($resetOption)))
	{
		if (validPost())
		{
			//DEBUG INFO FOR ME :)
			foreach ($HTTP_POST_VARS as $param=>$value)
			{
				print "$param == $value <BR>\n";
			}


			//fill a file array with all matching filenames

			//process each file. build results info

			//return results info

		}
	}

?>