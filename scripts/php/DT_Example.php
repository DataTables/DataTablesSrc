<?php

require_once('DT_Markdown.php');



class DT_Example
{
	private $_file = null;
	private $_xml = null;


	function __construct ( $file=null )
	{
		if ( $file !== null ) {
			$this->file( $file );
		}
	}


	public function file( $file )
	{
		if ( ! is_file( $file ) ) {
			throw new Exception("File $file not found", 1);
		}

		$this->_file = $file;
		$this->_xml = simplexml_load_file( $file );
	}


	public function transform ()
	{
		//var_dump( $this->_xml );
		//echo $this->_xml->info;

		echo DT_Markdown( $this->_xml->info );
	}
}


if ( $argc ) {
	$example = new DT_Example( $argv[1] );
	echo $example->transform();
}

