<?php rcs_id('$Id: random.php,v 1.10 2004/04/19 23:13:04 zorloc Exp $');
/**
 */
class randomImage {
    /**
     * Usage:
     *
     * $imgSet = new randomImage($Theme->file("images/pictures"));
     * $imgFile = "pictures/" . $imgSet->filename;
     */
    function randomImage ($dirname) {

        $this->filename = ""; // Pick up your filename here.

        $_imageSet  = new imageSet($dirname);
        $this->imageList = $_imageSet->getFiles();
        unset($_imageSet);

        if (empty($this->imageList)) {
            trigger_error(sprintf(_("%s is empty."), $dirname),
                          E_USER_NOTICE);
        } else {
            $dummy = $this->pickRandom();
        }
    }

    function pickRandom() {
        better_srand(); // Start with a good seed.
        $this->filename = $this->imageList[array_rand($this->imageList)];
        //trigger_error(sprintf(_("random image chosen: %s"),
        //                      $this->filename),
        //              E_USER_NOTICE); //debugging
        return $this->filename;
    }
};


class imageSet extends fileSet {
    /**
     * A file is considered an image when the suffix matches one from
     * $InlineImages.
     */
    function _filenameSelector($filename) {
        return preg_match("/(" . INLINE_IMAGES . ")$/i", $filename);
    }
};


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