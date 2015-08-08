<?php
	/*
	 * $ref displays desired relative url in main content pane
	 * This overrides any $lib setting that may also be provided.
	 * ex: ?ref=SAFSReferenceKey.htm
	 */
	$ref = $_GET['ref'];

	/*
	 * $rt displays toc2 list of either DriverCommands or ComponentFunctions
	 *  rt=C displays DriverCommandsList.htm
	 *  anything else displays the ComponentFunctionsList.htm
	 * ex: &rt=C
	 */
	$rt  = $_GET['rt'];
	if ( empty( $rt ) ) {
		$rt = "ComponentFunctionsList.htm";
	}elseif ( strcasecmp( $rt, "C") == 0 ) {
		$rt = "DriverCommandsList.htm";
	}elseif ( strcasecmp( $rt, "E") == 0 ) {
		$rt = "EngineCommandsList.htm";
	}else{
		$rt = "ComponentFunctionsList.htm";
	}

	/*
	 * $lib displays toc3 list of keywords for desired library
	 *  lib=DDDriverFileCommands displays DDDriverFileCommandsList.htm
	 *  This is also used to specify which library Reference to show
	 *  in the main content pain.
	 * ex: &lib=DDDriverFileCommands
	 * This will display DDDriverFileCommandsList.htm in toc2 AND it will
	 * display the DDDriverFileCommandsReference.htm in the content pane.
	 * NOTE: if $ref is provided then the content pane will NOT be loaded
	 * with the desired lib reference.  Instead it will be loaded with the
	 * specified $ref reference.
	 */
	$lib = $_GET['lib'];
	if ( empty( $lib ) )
		$lib = "GenericMasterFunctions";

	/*
	 * $cmd may force the scroll to a specific library command in the lib reference.
	 *  cmd=FindSqaFile will specify to scroll to the FindSqaFile command reference
	 *  in the DDDriverFileCommandsReference loaded by 'lib' above.
	 * ex: &cmd=FindSqaFile
	 */
	$cmd = $_GET['cmd'];
	if ( empty( $cmd ) ) {
		$cmd = "Reference.htm";
	}else{
		$cmd = "Reference.htm#detail_".$cmd;
	}
?>
<HTML>

<HEAD>
<TITLE>SAFS Reference</TITLE>
</HEAD>

<FRAMESET FRAMEBORDER="YES" BORDER="1" FRAMESPACING="4" COLS="220,*">
  <FRAMESET FRAMEBORDER="YES" BORDER="1" FRAMESPACING="4" ROWS="250,250,*">
    <FRAME NAME="toc1" SRC="DDFramesIndex.htm" TARGET="toc2">
    <FRAME NAME="toc2" SRC='<? print $rt; ?>' TARGET="toc3">
    <FRAME NAME="toc3" SRC='<? print $lib."Index.htm";?>' TARGET="content">
  </FRAMESET>
  <FRAME NAME="content"
  SRC='<? if (empty($ref)) { print $lib.$cmd;} else { print $ref;} ?>'>
  <NOFRAMES>
  <BODY>
  <P>This page does not support HTML Frames.<BR>
  <A href="DDFramesIndex.htm">Reference Index</A></P>
  </BODY>
  </NOFRAMES>
</FRAMESET>
</HTML>
