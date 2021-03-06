<?php
rcs_id('$Id: themeinfo.php,v 1.1 2004/05/12 19:42:15 rurban Exp $');

/*
 * This file defines the default appearance ("theme") of PhpWiki.
 */

require_once('lib/Theme.php');

$Theme = new Theme('Crao');

// CSS file defines fonts, colors and background images for this
// style.  The companion '*-heavy.css' file isn't defined, it's just
// expected to be in the same directory that the base style is in.

// This should result in phpwiki-printer.css being used when
// printing or print-previewing with style "PhpWiki" selected.
$Theme->setDefaultCSS('Crao',
                      array(''		=> 'crao.css',
                            'print'	=> ''));

// This allows one to manually select "Printer" style (when browsing page)
// to see what the printer style looks like.
//$Theme->addAlternateCSS(_("Printer"), 'phpwiki-printer.css');
//$Theme->addAlternateCSS(_("Top & bottom toolbars"), 'phpwiki-topbottombars.css');
//$Theme->addAlternateCSS(_("Modern"), 'phpwiki-modern.css');


/**
 * The logo image appears on every page and links to the HomePage.
 */
//$Theme->addImageAlias('logo', 'logo.png');

/**
 * The Signature image is shown after saving an edited page. If this
 * is not set, any signature defined in index.php will be used. If it
 * is not defined by index.php or in here then the "Thank you for
 * editing..." screen will be omitted.
 */

// Comment this next line out to enable signature.
$Theme->addImageAlias('signature', false);

/*
 * Link icons.
 */
$Theme->setLinkIcon('http');
$Theme->setLinkIcon('https');
$Theme->setLinkIcon('ftp');
$Theme->setLinkIcon('mailto');
$Theme->setLinkIcon('interwiki');
$Theme->setLinkIcon('*', 'url');

$Theme->setButtonSeparator(HTML::raw("&nbsp;|&nbsp;"));

/**
 * WikiWords can automatically be split by inserting spaces between
 * the words. The default is to leave WordsSmashedTogetherLikeSo.
 */
$Theme->setAutosplitWikiWords(true);

/*
 * You may adjust the formats used for formatting dates and times
 * below.  (These examples give the default formats.)
 * Formats are given as format strings to PHP strftime() function See
 * http://www.php.net/manual/en/function.strftime.php for details.
 * Do not include the server's zone (%Z), times are converted to the
 * user's time zone.
 */
//$Theme->setDateFormat("%B %d, %Y");
//$Theme->setTimeFormat("%I:%M %p");

/*
 * To suppress times in the "Last edited on" messages, give a
 * give a second argument of false:
 */
//$Theme->setDateFormat("%B %d, %Y", false); 
$Theme->setDateFormat("%A %e %B %Y"); // must not contain time
//$Theme->setDateFormat("%x"); // must not contain time
$Theme->setTimeFormat("%H:%M:%S");
//$Theme->setTimeFormat("%X");



// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
// (c-file-style: "gnu")
// Local Variables:
// mode: php
// tab-width: 8
// c-basic-offset: 4
// c-hanging-comment-ender-p: nil
// indent-tabs-mode: nil
// End:   
?>
