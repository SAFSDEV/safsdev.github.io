<HTML>
<HEAD>
<TITLE>Make XML Files from Source</TITLE>
</HEAD>
<BODY>

<?php
	include("extractXMLDoc.php");
?>

<A name="top" />
<H1><?php print $message ?></H1>

<A name="form" />
<FORM method="POST">
	<P>Enter Library: <BR>
	<INPUT type="text" name="userfile" value="<?php print $file?>" size=32><BR>
	<INPUT type="checkbox" name="allOption" value="<?php print DEFAULT_ALL_VALUE?>">ALL Libraries<BR>
	</P><P>
	<INPUT type="radio" name="tool" value="<?php print RATIONAL_TOOL?>" <?php print $rrState?>>
		<?php print RATIONAL_TOOL?><BR>
	<INPUT type="radio" name="tool" value="<?php print WINRUNNER_TOOL?>" <?php print $wrState?>>
		<?php print WINRUNNER_TOOL?><BR>
	</P><P>
	<INPUT type="submit" value="Submit">
	<INPUT type="checkbox"  name="resetOption" value="RESET">RESET FORM
	</P>
</FORM>
</BODY>
</HTML>
