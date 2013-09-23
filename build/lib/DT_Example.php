<?php

require_once('DT_Markdown.php');


class DT_Example
{
	private $_file = null;

	private $_data = null;

	private $_xml = null;

	private $_template = null;

	private $_libs = null; // 2D array with js and css arrays

	private $_mediaPath = null;

	private $_tables = array(
		'html' => array(
			'columns' => array( 'name', 'age', 'position', 'office', 'start_date', 'salary' ),
			'header'  => true,
			'footer'  => true,
			'body'    => true
		),
		'ajax' => array(
			'columns' => array( 'name', 'age', 'position', 'office', 'start_date', 'salary' ),
			'header'  => true,
			'footer'  => true,
			'body'    => false
		),
		'html-comma' => array(
			'columns' => array( 'name', 'age', 'position', 'office', 'start_date', 'salary-comma' ),
			'header'  => true,
			'footer'  => true,
			'body'    => true
		)
	);

	private $_libraries_lookup = array(
		'css' => array(
			'datatables'          => 'css/jquery.dataTables.css',
			'datatables-jqueryui' => 'css/jquery.dataTables_themeroller.css',
			'jqueryui'            => '//code.jquery.com/ui/1.10.3/themes/smoothness/jquery-ui.css'
		),
		'js' => array(
			'jquery'     => 'js/jquery.js',
			'datatables' => 'js/jquery.dataTables.js',
			'jqueryui'   => '//code.jquery.com/ui/1.10.3/jquery-ui.js'
		)
	);


	function __construct ( $file=null, $template=null, $mediaPath='' )
	{
		if ( $file !== null ) {
			$this->file( $file );
		}

		if ( $template !== null ) {
			$this->template( $template );
		}

		$this->_mediaPath = $mediaPath;

		$this->_libs = array(
			'css' => array(),
			'js'  => array()
		);

		$this->_data = json_decode( file_get_contents(
			dirname(__FILE__).'/../data.json'
		), true);
	}


	public function order ()
	{
		$attrs = $this->_xml->attributes();
		return isset( $attrs['order'] ) ?
			(int)$attrs['order'] :
			1;
	}

	public function title ()
	{
		return (string)$this->_xml->title;
	}


	public function file ( $file )
	{
		if ( ! is_file( $file ) ) {
			throw new Exception("File $file not found", 1);
		}

		$this->_file = $file;
		$this->_xml = simplexml_load_file( $file );
	}


	public function template ( $file )
	{
		if ( ! is_file( $file ) ) {
			throw new Exception("Template $file not found", 1);
		}

		$this->_template = $file;
	}


	public function transform ( $opts )
	{
		$xml = $this->_xml;

		// Resolve CSS libraries
		$this->_resolve_libs( 'css', $xml->css );

		// Resolve JS libraries
		$this->_resolve_libs( 'js', $xml->js );

		// Build data
		$tableHtml = $this->_build_table( (string)$xml['table-type'] );

		//echo $tableHtml;
		
		$template = file_get_contents( $this->_template );
		if ( ! $template ) {
			throw new Exception("Template file {$template} not found}", 1);
		}

		$template = str_replace( '{title}',    (string)$xml->title,          $template );
		$template = str_replace( '{info}',     DT_Markdown( $xml->info ),    $template );
		$template = str_replace( '{css-libs}', $this->_format_libs( 'css' ), $template );
		$template = str_replace( '{js-libs}',  $this->_format_libs( 'js' ),  $template );
		$template = str_replace( '{table}',    $tableHtml,                   $template );

		if ( isset( $opts['toc'] ) ) {
			$template = str_replace( '{toc}', $opts['toc'], $template );
		}

		$template = $this->_htmlTidy( $template );

		// After the tidy to preserve white space as tidy "cleans" it up
		$template = str_replace( '{css}',      $this->_plain( 'css' ),       $template );
		$template = str_replace( '{js}',       $this->_plain( 'js' ),        $template );

		$template = preg_replace( '/\t<style type="text\/css">\n\n\t<\/style>/m', "", $template );

		return $template;
	}


	private function _htmlTidy( $html )
	{
		$tidy = new tidy();
		$tidy->parseString( $html, array(
			'indent' => 2,
			'indent-spaces' => 4,
			'new-blocklevel-tags' => 'section',
			'new-pre-tags' => 'script',
			'output-html' => 1,
			'wrap' => 120
		) );
		$tidy->cleanRepair();

		// Tody up of the tidied HTML!
		$str = preg_replace( '/\n<\/script>/m', '</script>', $tidy );
		$str = preg_replace( '/<\/td>\n\n/m', "</td>\n", $str );
		$str = preg_replace( '/<\/th>\n\n/m', "</th>\n", $str );
		$str = preg_replace( '/<\/tr>\n\n/m', "</tr>\n", $str );
		$str = preg_replace( '/<\/li>\n\n/m', "</li>\n", $str );
		$str = preg_replace( '/<\/h3>\n\n/m', "</h3>\n", $str );
		$str = preg_replace( '/\n\n<html>/m', "\n<html>", $str );
		$str = preg_replace( '/    /m', "\t", $str );
		//$str = preg_replace( '/^\n+|^[\t\s]*\n+/m', '', $tidy );
		return $str;
	}

	private function _column( $name, $type, $row=null )
	{
		switch( $name ) {
			case 'name':
				if      ( $type === 'title' ) { return 'Name'; }
				else if ( $type === 'data' )  { return $row['first_name'].' '.$row['last_name']; }
				break;

			case 'first_name':
				if      ( $type === 'title' ) { return 'First name'; }
				else if ( $type === 'data' )  { return $row['first_name']; }
				break;

			case 'last_name':
				if      ( $type === 'title' ) { return 'Last name'; }
				else if ( $type === 'data' )  { return $row['last_name']; }
				break;

			case 'age':
				if      ( $type === 'title' ) { return 'Age'; }
				else if ( $type === 'data' )  { return $row['age']; }
				break;

			case 'position':
				if      ( $type === 'title' ) { return 'Position'; }
				else if ( $type === 'data' )  { return $row['position']; }
				break;

			case 'salary':
				if      ( $type === 'title' ) { return 'Salary'; }
				else if ( $type === 'data' )  { return '$'.number_format($row['salary']); }
				break;

			case 'salary-comma':
				if      ( $type === 'title' ) { return 'Salary'; }
				else if ( $type === 'data' )  { return '$'.number_format($row['salary'], 0, ',', '.'); }
				break;

			case 'start_date':
				if      ( $type === 'title' ) { return 'Start date'; }
				else if ( $type === 'data' )  { return $row['start_date']; }
				break;

			case 'extn':
				if      ( $type === 'title' ) { return 'Extn.'; }
				else if ( $type === 'data' )  { return $row['extn']; }
				break;

			case 'email':
				if      ( $type === 'title' ) { return 'E-mail'; }
				else if ( $type === 'data' )  { return $row['email']; }
				break;

			case 'office':
				if      ( $type === 'title' ) { return 'Office'; }
				else if ( $type === 'data' )  { return $row['office']; }
				break;

			default:
				throw new Exception("Unkown column: ".$name, 1);
				break;
		}
	}

	// @todo multiple tables by using | separator
	private function _build_table ( $type )
	{
		if ( $type === '' || $type === null ) {
			return '';
		}

		$id = 'example';
		if ( isset( $this->_xml['table-id'] ) ) {
			$id = (string)$this->_xml['table-id'];
		}

		$class = 'display';
		if ( isset( $this->_xml['table-class'] ) ) {
			$class = (string)$this->_xml['table-class'];
		}

		if ( ! isset( $this->_tables[ $type ] ) ) {
			throw new Exception("Unknown table type: ".$type, 1);
		}
		$construction = $this->_tables[ $type ];
		$columns = $construction['columns'];

		$t = '<table id="'.$id.'" class="'.$class.'" width="100%">';

		// Build the header
		$t .= '<thead>';
		if ( $construction['header'] ) {
			$cells = '';
			for ( $i=0, $ien=count($columns) ; $i<$ien ; $i++ ) {
				$cells .= '<th>'.$this->_column( $columns[$i], 'title' ).'</th>';
			}
			$t .= '<tr>'.$cells.'</tr>';
		}
		$t .= '</thead>';
		
		// Footer
		$t .= '<tfoot>';
		if ( $construction['footer'] ) {
			$cells = '';
			for ( $i=0, $ien=count($columns) ; $i<$ien ; $i++ ) {
				$cells .= '<th>'.$this->_column( $columns[$i], 'title' ).'</th>';
			}
			$t .= '<tr>'.$cells.'</tr>';
		}
		$t .= '</tfoot>';
		
		// Body
		$t .= '<tbody>';
		if ( $construction['body'] ) {
			for ( $j=0, $jen=count($this->_data) ; $j<$jen ; $j++ ) {
				$cells = '';
				for ( $i=0, $ien=count($columns) ; $i<$ien ; $i++ ) {
					$cells .= '<td>'.$this->_column( $columns[$i], 'data', $this->_data[$j] ).'</td>';
				}
				$t .= '<tr>'.$cells.'</tr>';
			}
		}
		$t .= '</tbody>';
		

		$t .= '</table>';

		return $t;
	}


	private function _plain ( $type )
	{
		$out = array();
		$tags = $type === 'js' ?
			$this->_xml->js :
			$this->_xml->css;

		foreach( $tags as $src ) {
			if ( (string)$src !== '' ) {
				if ( $type === 'css' ) {
					$out[] = (string)$src;
				}
				else {
					$out[] = (string)$src;
				}
			}
		}

		return implode( '', $out );
	}



	private function _format_libs ( $type )
	{
		$out = array();
		$libs = $this->_libs[ $type ];

		for ( $i=0, $ien=count($libs) ; $i<$ien ; $i++ ) {
			$file = $libs[$i]; // needs a path

			if ( strpos($file, '/') !== 0 ) {
				$file = $this->_mediaPath.'/'.$file;
			}

			if ( $type === 'js' ) {
				$out[] = '<script type="text/javascript" language="javascript" src="'.$file.'"></script>';
			}
			else {
				$out[] = '<link rel="stylesheet" type="text/css" href="'.$file.'">';
			}
		}

		return implode( '', $out );
	}


	private function _resolve_libs ( $type, $libs )
	{
		$host = &$this->_libs[ $type ];
		$srcLibs = $this->_libraries_lookup[ $type ];

		foreach( $libs as $lib ) {
			if ( isset( $lib['lib'] ) ) {
				$split_attr = explode( ' ', (string)$lib['lib'] );

				for ( $i=0, $ien=count($split_attr) ; $i<$ien ; $i++ ) {
					$srcLib = $split_attr[$i];

					if ( isset( $srcLibs[ $srcLib ] ) ) {
						$host[] = $srcLibs[ $srcLib ];
					}
					else {
						throw new Exception("Unknown {$type} library: ".$srcLib, 1);
					}
				}
			}
		}
	}
}


