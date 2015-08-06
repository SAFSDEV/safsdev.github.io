	function fix_nls($dat){
		$istart = strpos($dat, "{");
		$iend = strrpos($dat, "}");
		return substr($dat, $istart, $iend-$istart+1);
	}

	function merge_nls_bundles($locale){
		$nlsroot = $_SERVER['DOCUMENT_ROOT'] .NLS_ROOT_DIR;
		$lclocale = strtolower($locale);
		$lclocale = str_replace("_", "-", $lclocale);
		$temp = explode("-", $lclocale);
		$lang = $temp[0];
		$langdir = $nlsroot . $lang ."/";
		$langfile = $langdir . NLS_FILENAME;
		$localedir = $nlsroot . $lclocale ."/";
		$localefile = $localedir . NLS_FILENAME;
		$nls = array();
		if(is_file($localefile)){
			$dat = fix_nls(file_get_contents($localefile, FILE_TEXT));
			$nls = json_decode($dat, TRUE);
		}
		if( (!($localefile == $langfile)) && is_file($langfile)){
			$dat = fix_nls(file_get_contents($langfile, FILE_TEXT));
			$nls2 = json_decode($dat, TRUE);
			if(count($nls)> 1) {
				$nls = array_replace($nls2, $nls);
			}else{
				foreach($nls2 as $key => $val){
					$nls[$key] = $val;
				}
			}
		}
		$nlsfile = $nlsroot.NLS_FILENAME;
		if(is_file($nlsfile)){
			$dat = fix_nls(file_get_contents($nlsfile, FILE_TEXT));
			$nls2 = json_decode($dat, TRUE);
			if(count($nls)> 1) {
				$nls = array_replace($nls2, $nls);
			}else{
				foreach($nls2 as $key => $val){
					$nls[$key] = $val;
				}
			}
		}
		return $nls;
	}

	$locale = isset($_GET['userlocale']) ? $_GET['userlocale'] : NLS_DEFAULT;
	$nls = merge_nls_bundles($locale);

