<?php
	/*
	 * $swf displays desired relative url in Flash content pane
	 * ex: ?swf=Using_Debug_Log.swf
	 */
	$swf = $_GET['swf'];

	/*
	 * $mov displays desired relative url in QuickTime content pane
	 * ex: ?mov=Using_SAFS_Reference.mp4
	 */
	$mov = $_GET['mov'];

	if (empty($swf) && empty($mov)){
	    $swf = "SAFS_Video_Tutorials.swf";
	}

	/*
	 * $width provides the width of the Flash content pane
	 * This should be the width of the SWF provided.
	 * ex: &width=641
	 */
	$width = $_GET['width'];
	if (empty($width)){
	    $width = 601;
	}

	/*
	 * $height provides the height of the Flash content pane
	 * This should be the height of the SWF provided.
	 * ex: &height=641
	 */
	$height = $_GET['height'];
	if (empty($height)){
	    $height = 401;
	}
?>
<html>
<head>
<title>SAFS Training Videos</title>
<meta name="keywords" content="SAFS Software Automation Framework Support Flash Video Training Modules">
<meta name="description" content="Review SAFS Flash Video Training Modules">

<?
  if(empty($mov)){
    print "<script type='text/javascript' src='swfobject.js'></script>\n";
  }
?>

<script type="text/javascript">

<?
  if(empty($mov)){

    print "var flashvars   = {};\n";
    print "var flashparams = {\n";
    print "                    bgcolor:          \"#000000\",\n";
    print "                    quality:          \"high\",\n";
    print "                    allowfullscreen:  \"true\",\n";
    print "                    swliveconnect:    \"true\",\n";
    print "                    allowscriptaccess:\"always\",\n";
    print "                    wmode:            \"window\",\n";
    print "                    menu:             \"true\"\n";
    print "                  };\n";
    print "var flashattribs ={\n";
    print "                    id:    \"SAFSPlayer\",\n";
    print "                    name:  \"SAFSPlayer\",\n";
    print "                    align: \"center\"\n";
    print "                  };\n";

    print "swfobject.embedSWF('$swf', 'content', '$width', '$height', '10.0', 'expressInstall.swf', flashvars, flashparams, flashattribs);\n";
  }
?>

    if (document.images) {

    	play_on = new Image();
    	play_on.src = "./image/play_green.gif";
    	pause_on = new Image();
    	pause_on.src = "./image/pause_green.gif";
    	rewind_on = new Image();
		rewind_on.src = "./image/rewind_green.gif";
    	skipback_on = new Image();
		skipback_on.src = "./image/skipback_green.gif";
    	skipfore_on = new Image();
		skipfore_on.src = "./image/skipfore_green.gif";

    	play_off = new Image();
    	play_off.src = "./image/play_blue.gif";
    	pause_off = new Image();
    	pause_off.src = "./image/pause_blue.gif";
    	rewind_off = new Image();
		rewind_off.src = "./image/rewind_blue.gif";
    	skipback_off = new Image();
		skipback_off.src = "./image/skipback_blue.gif";
    	skipfore_off = new Image();
		skipfore_off.src = "./image/skipfore_blue.gif";
    }

    function playOn () {
    	if (document.images) {
    		if(swfobject.getObjectById('SAFSPlayer').IsPlaying()) {
    			document['play'].src = pause_on.src;
  	    		document['play'].alt = "Pause Video";
  	    		document['play'].title = "Pause Video";
    		} else {
    			document['play'].src = play_on.src;
  	    		document['play'].alt = "Play Video";
  	    		document['play'].title = "Play Video";
    		}
    	}
    }

    function playOff () {
    	if (document.images) {
    		if(swfobject.getObjectById('SAFSPlayer').IsPlaying()) {
    			document['play'].src = pause_off.src;
  	    		document['play'].alt = "Pause Video";
  	    		document['play'].title = "Pause Video";
    		} else {
    			document['play'].src = play_off.src;
	    		document['play'].alt = "Play Video";
	    		document['play'].title = "Play Video";
    		}
    	}
    }

    function playClick () {
        player = swfobject.getObjectById('SAFSPlayer');
    	if (player.IsPlaying()) {
    		player.StopPlay();
    	} else {
    		player.Play();
    	}
    	playOn();
    }

    function rewindClick(){
    	swfobject.getObjectById('SAFSPlayer').Rewind();
    	playOff();
    }

    function skipbackClick(){
        player = swfobject.getObjectById('SAFSPlayer');
        playing = player.IsPlaying();
        pos  = player.TCurrentFrame("/");
        pos  = pos - 30;
        if (pos < 0) pos = 0;
        player.GotoFrame(pos);
        if (playing) player.Play();
    }

    function skipforeClick(){
        player = swfobject.getObjectById('SAFSPlayer');
        playing = player.IsPlaying();
        total = player.TGetProperty("/",5);
        pos  = player.TCurrentFrame("/");
        pos  = pos + 30;
        if (pos > total) pos = total;
       	player.GotoFrame(pos);
        if (playing && (pos < total)) 	player.Play();
    }

    function imageOn (imageRoot) {
    	if (document.images) {
    		document[imageRoot].src = eval(imageRoot +"_on.src");
    	}
    }

    function imageOff (imageRoot) {
    	if (document.images) {
    		document[imageRoot].src = eval(imageRoot +"_off.src");
    	}
    }

    function toggleMISC(){
    	var divi = document.getElementById("misc");
    	var imag = document.getElementById("misc_img");

    	if(divi.style.display == "block"){
    	   divi.style.display = "none";
    	   imag.src="./image/using_misc_open_thumb.GIF";
    	}else{
    	   divi.style.display = "block";
    	   imag.src="./image/using_misc_close_thumb.GIF";
    	}
    }

    function toggleIBT(){
    	var divi = document.getElementById("ibt");
    	var imag = document.getElementById("ibt_img");

    	if(divi.style.display == "block"){
    	   divi.style.display = "none";
    	   imag.src="./image/using_ibt_open_thumb.GIF";
    	}else{
    	   divi.style.display = "block";
    	   imag.src="./image/using_ibt_close_thumb.GIF";
    	}
    }

</script>
<style type="text/css">
<!--
.style1 {font-size: 12px}
-->
</style>
</head>
<body bgcolor="black" link="10ffff" text="00ffff" >
<div id="training">
   <table>
   <tr>
   <td valign="top">

<?
  if(empty($mov)){
    print  "<center>\n";
    print  "<div id='controls'>\n";
    print  "	 <center>\n";
    print  "		  <IMG name='play' src='./image/play_blue.gif' width=34 height=34 alt='Play Video' title='Play Video'\n";
    print  "		       onClick='playClick()'\n";
    print  "		       onMouseOver='playOn()'\n";
    print  "		       onMouseOut ='playOff()' /><br>\n";
    print  "	      <IMG name='rewind' src='./image/rewind_blue.gif' width=34 height=34 alt='Rewind Video' title='Rewind Video'\n";
    print  "	           onClick='rewindClick()'\n";
    print  "	           onMouseOver=\"imageOn('rewind')\"\n";
    print  "	           onMouseOut=\"imageOff('rewind')\"  /><br>\n";
    print  "     </center>\n";
    print  "	      <IMG name='skipback' src='./image/skipback_blue.gif' width=34 height=34 alt='Jump Back' title='Jump Back'\n";
    print  "	           onClick='skipbackClick()'\n";
    print  "	           onMouseOver=\"imageOn('skipback')\"\n";
    print  "	           onMouseOut=\"imageOff('skipback')\"  />&nbsp;\n";
    print  "	      <IMG name='skipfore' src='./image/skipfore_blue.gif' width=34 height=34 alt='Jump Forward' title='Jump Forward'\n";
    print  "	           onClick='skipforeClick()'\n";
    print  "	           onMouseOver=\"imageOn('skipfore')\"\n";
    print  "	           onMouseOut=\"imageOff('skipfore')\"  /><br>\n";
    print  "</div>\n";
    print  "</center>\n";
  }
?>

   <div name="modules">
       <center>
          <a href="javascript:toggleMISC()"><IMG id="misc_img" src="./image/using_misc_open_thumb.GIF" alt="Show\Hide Misc Videos" title="Show\Hide Misc Videos" vspace=2 /></a><br>
          <div id="misc" style="display: none">
              <a href="SAFSVideo.php?swf=Start_STAF_Manually.swf&width=781&height=781"><IMG src="./image/start_staf_thumb.GIF" alt="Video: Start STAF Manually" title="Video: Start STAF Manually" vspace=2 /></a><br>
              <a href="SAFSVideo.php?swf=Using_Debug_Log.swf&width=781&height=781"><IMG src="./image/using_debug_thumb.GIF" alt="Video: Using SAFS Debug Log" title="Video: Using SAFS Debug Log" vspace=2 /></a><br>
              <a href="SAFSVideo.php?mov=Using_SAFS_Reference.mp4&width=800&height=600"><IMG src="./image/using_reference_thumb.GIF" alt="Video: Using SAFS Reference" title="Video: Using SAFS Reference" vspace=2 /></a><br>
          </div>
          <a href="javascript:toggleIBT()"><IMG id="ibt_img" src="./image/using_ibt_open_thumb.GIF" alt="Show\Hide Image-Based Videos" title="Show\Hide Image-Based Videos" vspace=2 /></a><br>
          <div id="ibt" style="display: none">
			  <a href="SAFSVideo.php?mov=using_safs_ocr.mp4&width=800&height=600"><IMG src="./image/using_safs_ocr_thumb.GIF" alt="Video: Using SAFS OCR" title="Video: Using SAFS OCR" vspace=2 /></a><br>
			  <a href="SAFSVideo.php?mov=Using_BitTolerance_IBT.mp4&width=800&height=600"><IMG src="./image/using_ibt_bittolerance_thumb.GIF" alt="Video: Using Image-Based BitTolerance" title="Video: Using Image-Based BitTolerance" vspace=2 /></a><br>
			  <a href="SAFSVideo.php?mov=UsingImageText_Part_I.mp4&width=800&height=600"><IMG src="./image/using_ibt_imagetext_thumb_1.GIF" alt="Video: Using Image-Based ImageText (Pt.I)" title="Video: Using Image-Based ImageText (Pt.I)" vspace=2 /></a><br>
			  <a href="SAFSVideo.php?mov=UsingImageText_Part_II.mp4&width=800&height=600"><IMG src="./image/using_ibt_imagetext_thumb_2.GIF" alt="Video: Using Image-Based ImageText (Pt.II)" title="Video: Using Image-Based ImageText (Pt.II)" vspace=2 /></a>
          </div>
       <small>
       <a href='http://www.apple.com/quicktime/download' target='_blank' title='QuickTime Player required for some tutorials.' alt='QuickTime Player required for some tutorials.'>QuickTime</a><br>
       <a href='http://www.adobe.com/go/getflashplayer' target='_blank' title='Flash Player required for some tutorials.' alt='Flash Player required for some tutorials.'>Flash</a><br>
       </small>
       </center>
   </div>
   <td valign="top" >


      <div id="wrapper">

<?php
  if(empty($mov)){
    print  "          <div id='content'>\n";
    print  "            &nbsp;\n";
    print  "            <p>&nbsp;\n";
    print  "            <p>&nbsp;\n";
    print  "            Some SAFS Training Modules Require Flash Player!<br>\n";
    print  "            <a href='http://www.adobe.com/go/getflashplayer' target='_blank'>Download Adobe Flash Player</a>, if necessary.\n";
    print  "          </div>\n";
  }else{
    $modheight = ((integer)$height)+15;
    print  "          <div id='content'>\n";
    print  "              <OBJECT classid='clsid:02BF25D5-8C17-4B23-BC80-D3488ABDDC6B' width='$width' height='$modheight' codebase='http://www.apple.com/qtactivex/qtplugin.cab'>\n";
    print  "			  <param name='src' value='$mov'>\n";
    print  "			  <param name='autoplay' value='true'>\n";
    print  "			  <param name='controller' value='true'>\n";
    print  "			  <param name='loop' value='false'>\n";
    print  "              <p>&nbsp;\n";
    print  "              Some SAFS Training Modules Require QuickTime Player!<br>\n";
    print  "              <a href='http://www.apple.com/quicktime/download' target='_blank'>Download QuickTime Player</a>, if necessary.\n";
    print  "              </p>&nbsp;\n";
    print  "			  <EMBED src='$mov' width='$width' height='$modheight' autoplay='true'\n";
    print  "			  controller='true' loop='false' bgcolor='#000000' pluginspage='http://www.apple.com/quicktime/download/'>\n";
    print  "			  </EMBED>\n";
    print  "              </OBJECT>\n";
    print  "          </div>\n";
  }
?>
      </div>
   </tr></table>
</div>
</body>
</html>