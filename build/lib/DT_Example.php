<?php

error_reporting(E_ALL);
ini_set('display_errors', '1');


require_once('DT_Markdown.php');


class DT_Example
{
	static $tables = array();
	static $lookup_libraries = array();
	static $components = array();
	static $components_cdn = false;

	private $_file = null;

	private $_data = null;

	private $_xml = null;

	private $_template = null;

	private $_libs = null; // 2D array with js and css arrays

	private $_path_resolver = null;

	private $_additional_libs = null;

	private $_xml_libs = null;
	private $_tidy_error = null;


	function __construct ( $file=null, $template=null, $path_resolver=null, $libs=array() )
	{
		if ( $file !== null ) {
			$this->file( $file );
		}

		if ( $template !== null ) {
			$this->template( $template );
		}

		if ( $path_resolver !== null ) {
			$this->_path_resolver = $path_resolver;
		}

		$this->_libs = array(
			'css' => array(),
			'js'  => array()
		);

		$this->_xml_libs = array(
			'css' => array(),
			'js'  => array()
		);

		$this->_additional_libs = $libs;

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
		$framework = isset( $xml['framework'] ) ?
			(string)$xml['framework'] :
			'datatables';

		$bodyClass = isset( $xml['body-class'] ) ?
			(string)$xml['body-class'] :
			'';

		if ( $framework !== 'datatables' ) {
			$bodyClass .= ' dt-example-'.$framework;
		}

		// Resolve CSS libraries
		$this->_resolve_xml_libs( $framework, 'css', $xml->css );

		// Resolve JS libraries
		$this->_resolve_xml_libs( $framework, 'js', $xml->js );

		if ( isset( $this->_additional_libs['css'] ) ) {
			$this->_resolve_libs( $framework, 'css', $this->_additional_libs['css'] );
		}

		if ( isset( $this->_additional_libs['js'] ) ) {
			$this->_resolve_libs( $framework, 'js', $this->_additional_libs['js'] );
		}

		// Build data
		$tableHtml = $this->build_table( (string)($xml['table-type']) );

		//echo $tableHtml;
		
		$template = file_get_contents( $this->_template );
		if ( ! $template ) {
			throw new Exception("Template file {$template} not found}", 1);
		}

		$software = 'DataTables';
		if ( isset( $xml->title['lib'] ) ) {
			$software = $xml->title['lib'];
		}

		$template = str_replace( '{software}',      $software,                       $template );
		$template = str_replace( '{title}',         (string)$xml->title,             $template );
		$template = str_replace( '{info}',          DT_Markdown( $xml->info ),       $template );
		$template = str_replace( '{css-libs}',      $this->_format_libs('css'),      $template );
		$template = str_replace( '{js-libs}',       $this->_format_libs('js'),       $template );
		$template = str_replace( '{css-lib-files}', $this->_format_lib_files('css'), $template );
		$template = str_replace( '{js-lib-files}',  $this->_format_lib_files('js'),  $template );
		$template = str_replace( '{table}',         $tableHtml,                      $template );
		$template = str_replace( '{year}',          date('Y'),                       $template );
		$template = str_replace( '{table-class}',   $software,                       $template );
		$template = str_replace( '{body-class}',    $bodyClass ? $bodyClass : '',    $template );

		if ( isset( $xml->{'demo-html'} ) ) {
			$template = str_replace( '{demo-html}', $this->innerXML($xml->{'demo-html'}), $template );
		}
		else {
			$template = str_replace( '{demo-html}', '', $template );
		}

		if ( isset( $opts['toc'] ) ) {
			$template = str_replace( '{toc}', $opts['toc'], $template );
		}

		$template = $this->_htmlTidy( $template );

		// After the tidy to preserve white space as tidy "cleans" it up
		$template = str_replace( '{css}',       $this->_plain( 'css' ), $template );
		$template = str_replace( '{js}',        $this->_plain( 'js' ),  $template );
		$template = str_replace( '{css-esc}',   htmlspecialchars( trim($this->_plain( 'css' )) ), $template );
		$template = str_replace( '{js-esc}',    htmlspecialchars( trim($this->_plain( 'js' )) ),  $template );

		$template = preg_replace( '/\t<style type="text\/css">\n\n\t<\/style>/m', "", $template );

		return $template;
	}

	private function innerXML( $node )
	{
		$content = '';
		foreach( $node->children() as $child ) {
			$content .= $child->asXml();
		}
		return $content;
	}


	private function _htmlTidy( $html )
	{
		if ( ! class_exists( 'tidy' ) ) {
			if ( ! $this->_tidy_error ) {
				echo "No html tidy - skipping\n";
				$this->_tidy_error = true;
			}
			return $html;
		}

		$hasEmptyTbody = strpos( $html, '<tbody/>' );
		$tidy = new tidy();
		$tidy->parseString( $html, array(
			'indent' => 2,
			'indent-spaces' => 4,
			'new-blocklevel-tags' => 'section,editor-field',
			'new-pre-tags' => 'script',
			'new-empty-tags' => 'tbody',
			'output-html' => 1,
			'wrap' => 180
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

		// HTML tidy removes the empty tbody tag if there is one, with no option
		// of keeping it, so we have to work around
		if ( $hasEmptyTbody !== false ) {
			$str = str_replace( '</thead>', "</thead>\n\t\t\t\t<tbody/>", $str);
		}

		// Replace whatever doctype HTML tidy has defined with an HTML5 doc type
		// HTML tody will modify the doctype based on its own internal rules, and
		// will not just preserve the given doctype
		$str = preg_replace( '/<!doctype.*?>/i', '<!DOCTYPE html>', $str );

		return $str;
	}

	private function _column( $name, $type, $row=null )
	{
		if ( is_callable( $name ) ) {
			return $name( $type, $row );
		}

		switch( $name ) {
			case '':
				if      ( $type === 'title' ) { return ''; }
				else if ( $type === 'data' )  { return ''; }
				break;

			case 'id':
				if      ( $type === 'title' ) { return 'ID'; }
				else if ( $type === 'data' )  { return $row['id']; }
				break;

			case 'name':
				if      ( $type === 'title' ) { return 'Name'; }
				else if ( $type === 'data' )  { return $row['first_name'].' '.$row['last_name']; }
				break;

			case 'name-attr':
				if      ( $type === 'title' ) { return 'Name'; }
				else if ( $type === 'data' )  {
					return '<td data-search="'.$row['first_name'].' '.$row['last_name'].'">'.
						substr($row['first_name'], 0, 1).'. '.$row['last_name'].
						'</td>';
				}
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

			case 'salary-attr':
				if      ( $type === 'title' ) { return 'Salary'; }
				else if ( $type === 'data' )  { return '<td data-order="'.$row['salary'].'">$'.number_format($row['salary']).'/y</td>'; }
				break;

			case 'salary-plain':
				if      ( $type === 'title' ) { return 'Salary'; }
				else if ( $type === 'data' )  { return $row['salary']; }
				break;

			case 'start_date':
				if      ( $type === 'title' ) { return 'Start date'; }
				else if ( $type === 'data' )  { return str_replace('/', '-', $row['start_date']); }
				break;

			case 'start_date-attr':
				if      ( $type === 'title' ) { return 'Start date'; }
				else if ( $type === 'data' )  {
					$t = strtotime( $row['start_date'] );
					return '<td data-order="'.date('U', $t).'">'.date('D jS M y', $t).'</td>';
				}
				break;

			case 'start_date-fmt':
				if      ( $type === 'title' ) { return 'Start date'; }
				else if ( $type === 'data' )  {
					$t = strtotime( $row['start_date'] );
					return '<td>'.date('j M Y', $t).'</td>';
				}
				break;

			case 'extn':
				if      ( $type === 'title' ) { return 'Extn.'; }
				else if ( $type === 'data' )  { return $row['extn']; }
				break;

			case 'email':
				if      ( $type === 'title' ) { return 'E-mail'; }
				else if ( $type === 'data' )  { return $row['email']; }
				break;

			case 'progress':
				if      ( $type === 'title' ) { return 'Progress'; }
				else if ( $type === 'data' )  { return $row['extn']; }
				break;

			case 'office':
				if      ( $type === 'title' ) { return 'Office'; }
				else if ( $type === 'data' )  { return $row['office']; }
				break;

			case 'sequence':
				if      ( $type === 'title' ) { return 'Seq.'; }
				else if ( $type === 'data' )  { return $row['sequence']; }
				break;

			case 'symbol':
				if      ( $type === 'title' ) { return 'Symbol'; }
				else if ( $type === 'data' )  { return $row['symbol']; }
				break;

			case 'price':
				if      ( $type === 'title' ) { return 'Price'; }
				else if ( $type === 'data' )  { return $row['price']; }
				break;

			case 'difference':
				if      ( $type === 'title' ) { return 'Difference'; }
				else if ( $type === 'data' )  { return ''; }
				break;

			case 'history':
				if      ( $type === 'title' ) { return 'Last'; }
				else if ( $type === 'data' )  { return $row['last']; }
				break;

			default:
				throw new Exception("Unknown column: ".$name, 1);
				break;
		}
	}


	public function build_table ( $type, $idIn=null )
	{
		if ( isset( $this->_xml->{'custom-table'} ) ) {
			return $this->innerXML( $this->_xml->{'custom-table'} );
		}

		if ( $type === '' || $type === null ) {
			return '';
		}

		if ( strpos($type, '|') ) {
			$a = explode('|', $type);
			$t = '';

			for ( $i=0, $ien=count($a) ; $i<$ien ; $i++ ) {
				$t .= $this->build_table( $a[$i] );
			}

			return $t;
		}

		$id = 'example';
		if ( $idIn !== null ) {
			$id = $idIn;
		}
		else if ( isset( $this->_xml['table-id'] ) ) {
			$id = (string)$this->_xml['table-id'];
		}

		$class = 'display';
		if ( isset( $this->_xml['table-class'] ) ) {
			$class = (string)$this->_xml['table-class'];
		}

		// Framework overrides for the table class
		$framework = isset( $this->_xml['framework'] ) ?
			(string)$this->_xml['framework'] :
			'datatables';

		if ( strpos($framework, 'bootstrap5') !== false ) {
			$class = str_replace('display', 'table table-striped', $class);
		}
		else if ( strpos($framework, 'bootstrap') !== false ) {
			$class = str_replace('display', 'table table-striped table-bordered', $class);
		}
		else if ( strpos($framework, 'semanticui') !== false ) {
			$class = str_replace('display', 'ui celled table', $class);
		}
		else if ( strpos($framework, 'material') !== false ) {
			$class = str_replace('display', 'mdl-data-table', $class);
		}
		else if ( strpos($framework, 'uikit') !== false ) {
			$class = str_replace('display', 'uk-table uk-table-hover uk-table-striped', $class);
		}
		else if ( strpos($framework, 'bulma') !== false ) {
			$class = str_replace('display', 'table is-striped', $class);
		}

		if ( ! isset( DT_Example::$tables[ $type ] ) ) {
			throw new Exception("Unknown table type: ".$type, 1);
		}
		$construction = DT_Example::$tables[ $type ];
		$columns = $construction['columns'];

		$t = '<table id="'.$id.'" class="'.$class.'" style="width:100%">';

		// Build the header
		if ( $construction['header'] ) {
			if ( is_callable( $construction['header'] ) ) {
				$t .= $construction['header']();
			}
			else {
				$cells = '';
				for ( $i=0, $ien=count($columns) ; $i<$ien ; $i++ ) {
					$cells .= '<th>'.$this->_column( $columns[$i], 'title' ).'</th>';
				}
				$t .= '<thead>';
				$t .= '<tr>'.$cells.'</tr>';
				$t .= '</thead>';
			}
		}
		
		// Body
		$rowIds = isset( $this->_xml['row-ids'] ) ?
			($this->_xml['row-ids'] == 'yes' ? true : false) :
			false;

		if ( $construction['body'] ) {
			if ( is_callable( $construction['body'] ) ) {
				$t .= $construction['body']();
			}
			else {
				$t .= '<tbody>';
				for ( $j=0, $jen=count($this->_data) ; $j<$jen ; $j++ ) {
					if ( isset( $construction['filter'] ) && $construction['filter']($this->_data[$j]) === false ) {
						continue;
					}

					$cells = '';
					for ( $i=0, $ien=count($columns) ; $i<$ien ; $i++ ) {
						$cell = $this->_column( $columns[$i], 'data', $this->_data[$j] );

						if ( strpos( $cell, '<td' ) === 0 ) {
							$cells .= $cell;
						}
						else {
							$cells .= '<td>'.$cell.'</td>';
						}
					}

					if ( $rowIds ) {
						$t .= '<tr id="row_'.$this->_data[$j]['id'].'">'.$cells.'</tr>';
					}
					else {
						$t .= '<tr>'.$cells.'</tr>';
					}
				}
				$t .= '</tbody>';
			}
		}
		
		// Footer
		if ( $construction['footer'] ) {
			if ( is_callable( $construction['footer'] ) ) {
				$t .= $construction['footer']();
			}
			else {
				$cells = '';
				for ( $i=0, $ien=count($columns) ; $i<$ien ; $i++ ) {
					$cells .= '<th>'.$this->_column( $columns[$i], 'title' ).'</th>';
				}
				$t .= '<tfoot>';
				$t .= '<tr>'.$cells.'</tr>';
				$t .= '</tfoot>';
			}
		}

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

			if ( strpos($file, '//') !== 0 &&
				 strpos($file, './') !== 0 &&
				 strpos($file, 'http://') !== 0 &&
				 strpos($file, 'https://') !== 0
			) {
				$file = call_user_func( $this->_path_resolver, $file );
			}

			if ( $type === 'js' ) {
				$a = strpos( $file, '|' ) !== false ?
					explode( '|', $file ) :
					array( $file );

				for ( $j=0, $jen=count($a) ; $j<$jen ; $j++ ) {
					$out[] = '<script type="text/javascript" language="javascript" src="'.$a[$j].'"></script>';
				}
			}
			else {
				$out[] = '<link rel="stylesheet" type="text/css" href="'.$file.'">';
			}
		}

		return implode( '', $out );
	}


	private function _resolve_xml_libs ( $framework, $type, $libs )
	{
		$a = array();

		// For CSS, if there is a styling framework defined, then it should be
		// automatically included to make it super easy to switch examples
		// between the various frameworks
		if ( $type === 'css' && $framework !== 'datatables' ) {
			$a[] = $framework;
		}

		foreach( $libs as $lib ) {
			if ( isset( $lib['lib'] ) ) {
				$split_attr = explode( ' ', (string)$lib['lib'] );

				for ( $i=0, $ien=count($split_attr) ; $i<$ien ; $i++ ) {
					$a[] = $split_attr[$i];
					$this->_xml_libs[ $type ][] = $split_attr[$i];
				}
			}
		}

		$this->_resolve_libs( $framework, $type, $a );
	}


	private function _resolve_libs ( $framework, $type, $libs )
	{
		$exampleLibs = &$this->_libs[ $type ];
		$srcLibs = DT_Example::$lookup_libraries[ $type ];

		for ( $i=0, $ien=count($libs) ; $i<$ien ; $i++ ) {
			$lib = $libs[$i];

			if ( strpos($lib, '/') === 0 || strpos($lib, '.') === 0 ) {
				$exampleLibs[] = $lib;
			}
			else if ( isset( DT_Example::$components[ $lib ] ) ) {
				$res = $this->_resolve_framework_lib( $framework, $type, $lib );

				for ( $j=0, $jen=count($res) ; $j<$jen ; $j++ ) {
					$exampleLibs[] = $res[$j];
				}
			}
			else if ( isset( $srcLibs[ $lib ] ) ) {
				if ( ! in_array( $srcLibs[ $lib ], $exampleLibs ) ) {
					$exampleLibs[] = $srcLibs[ $lib ];
				}
			}
			else {
				throw new Exception("Unknown {$type} library: ".$lib, 1);
			}
		}
	}


	private function _resolve_framework_lib ( $framework, $type, $lib )
	{
		$out = [];
		$component = DT_Example::$components[ $lib ];
		$path = $component['path'];
		$filename = $component['filename'];

		if ( DT_Example::$components_cdn && $lib !== 'editor' ) {
			$path = 'https://cdn.datatables.net';

			if ( $lib === 'datatables' ) {
				$path .= '/'.$component['release'];
			}
			else {
				$path .= '/'.$lib.'/'.$component['release'];
			}
		}

		$min = DT_Example::$components_cdn ?
			'.min' :
			'';

		// DataTables uses a capital in the file name
		if ( $framework === 'datatables' ) {
			$framework = 'dataTables';
		}

		if ( $type === 'js' ) {
			$jsBaseFilename = $lib === 'datatables' ?
				'jquery' :
				'dataTables';

			// Always include the core Javascript file.
			$out[] = $path.'/js/'.$jsBaseFilename.'.'.$filename.$min.'.js';

			// Possibly include a framework Javascript file. If the framework is
			// DataTables, then there will be no override JS file.
			if ( $framework !== 'dataTables' && $component['framework']['js'] ) {
				$out[] = $path.'/js/'.$filename.'.'.$framework.$min.'.js';
			}
		}
		else if ( $type === 'css' ) {
			// Possibly include a framework Javascript file. The DataTables
			// framework option is a special case as its file name is slightly
			// different
			if ( $framework === 'dataTables' && $lib === 'datatables' ) {
				$out[] = $path.'/css/jquery.'.$filename.$min.'.css';
			}
			else if ( $component['framework']['css'] ) {
				$out[] = $path.'/css/'.$filename.'.'.$framework.$min.'.css';
			}
		}

		return $out;
	}


	private function _format_lib_files ( $type )
	{
		// List of libraries files so the user can see what specifically is
		// needed for a given example
		$str = '<ul>';
		$libs = $this->_libs[ $type ];

		for ( $i=0, $ien=count($libs) ; $i<$ien ; $i++ ) {
			$file = $libs[$i];

			// Ignore these files - they are used for the demo only
			if ( strpos($file, 'shCore.css') !== false ||
				 strpos($file, 'demo.css') !== false ||
				 strpos($file, 'editor-demo.css') !== false ||
				 strpos($file, 'shCore.js') !== false ||
				 strpos($file, 'demo.js') !== false ||
				 strpos($file, 'editor-demo.js') !== false
			) {
				continue;
			}

			$path = strpos($file, '//') !== 0 && strpos($file, 'https://') !== 0 ?
				call_user_func( $this->_path_resolver, $file ) :
				$file;

			$str .= '<li><a href="'.$path.'">'.$path.'</a></li>';
		}

		$str .= '</ul>';
		return $str;
	}
}


DT_Example::$lookup_libraries['css'] = array();


DT_Example::$lookup_libraries['js'] = array();


DT_Example::$tables['html'] = array(
	'columns' => array( 'name', 'position', 'office', 'age', 'start_date', 'salary' ),
	'header'  => true,
	'footer'  => true,
	'body'    => true
);

DT_Example::$tables['html5'] = array(
	'columns' => array( 'name-attr', 'position', 'office', 'age', 'start_date-attr', 'salary-attr' ),
	'header'  => true,
	'footer'  => true,
	'body'    => true
);

DT_Example::$tables['html-date-fmt'] = array(
	'columns' => array( 'name', 'position', 'office', 'age', 'start_date-fmt', 'salary' ),
	'header'  => true,
	'footer'  => true,
	'body'    => true
);

DT_Example::$tables['html-salary-plain'] = array(
	'columns' => array( 'name', 'position', 'office', 'age', 'start_date', 'salary-plain' ),
	'header'  => true,
	'footer'  => true,
	'body'    => true
);

DT_Example::$tables['sequence'] = array(
	'columns' => array( 'sequence', 'name', 'position', 'office', 'start_date', 'salary' ),
	'header'  => true,
	'footer'  => true,
	'body'    => true
);

DT_Example::$tables['ajax'] = array(
	'columns' => array( 'name', 'position', 'office', 'extn', 'start_date', 'salary' ),
	'header'  => true,
	'footer'  => true,
	'body'    => false
);

DT_Example::$tables['ajax-id'] = array(
	'columns' => array( 'id', 'name', 'position', 'office', 'extn', 'start_date', 'salary' ),
	'header'  => true,
	'footer'  => true,
	'body'    => false
);

DT_Example::$tables['ajax-sequence'] = array(
	'columns' => array( 'sequence', 'name', 'position', 'office', 'start_date', 'salary' ),
	'header'  => true,
	'footer'  => true,
	'body'    => false
);

DT_Example::$tables['ajax-renderer'] = array(
	'columns' => array( 'name', 'position', 'office', 'progress', 'start_date', 'salary' ),
	'header'  => true,
	'footer'  => true,
	'body'    => false
);

DT_Example::$tables['ajax-stocks'] = array(
	'columns' => array( 'name', 'symbol', 'price', 'difference', 'history' ),
	'header'  => true,
	'footer'  => true,
	'body'    => false
);

DT_Example::$tables['ssp'] = array(
	'columns' => array( 'first_name', 'last_name', 'position', 'office', 'start_date', 'salary' ),
	'header'  => true,
	'footer'  => true,
	'body'    => false
);

DT_Example::$tables['ssp-1st-page'] = array(
	'columns' => array( 'first_name', 'last_name', 'position', 'office', 'start_date', 'salary' ),
	'header'  => true,
	'footer'  => true,
	'body'    => function () {
		return <<<EOD
<tr class="odd">
    <td>Airi</td>
    <td>Satou</td>
    <td>Accountant</td>
    <td>Tokyo</td>
    <td>28th Nov 08</td>
    <td>$162,700</td>
</tr>
<tr class="even">
    <td>Angelica</td>
    <td>Ramos</td>
    <td>Chief Executive Officer (CEO)</td>
    <td>London</td>
    <td>9th Oct 09</td>
    <td>$1,200,000</td>
</tr>
<tr class="odd">
    <td>Ashton</td>
    <td>Cox</td>
    <td>Junior Technical Author</td>
    <td>San Francisco</td>
    <td>12th Jan 09</td>
    <td>$86,000</td>
</tr>
<tr class="even">
    <td>Bradley</td>
    <td>Greer</td>
    <td>Software Engineer</td>
    <td>London</td>
    <td>13th Oct 12</td>
    <td>$132,000</td>
</tr>
<tr class="odd">
    <td>Brenden</td>
    <td>Wagner</td>
    <td>Software Engineer</td>
    <td>San Francisco</td>
    <td>7th Jun 11</td>
    <td>$206,850</td>
</tr>
<tr class="even">
    <td>Brielle</td>
    <td>Williamson</td>
    <td>Integration Specialist</td>
    <td>New York</td>
    <td>2nd Dec 12</td>
    <td>$372,000</td>
</tr>
<tr class="odd">
    <td>Bruno</td>
    <td>Nash</td>
    <td>Software Engineer</td>
    <td>London</td>
    <td>3rd May 11</td>
    <td>$163,500</td>
</tr>
<tr class="even">
    <td>Caesar</td>
    <td>Vance</td>
    <td>Pre-Sales Support</td>
    <td>New York</td>
    <td>12th Dec 11</td>
    <td>$106,450</td>
</tr>
<tr class="odd">
    <td>Cara</td>
    <td>Stevens</td>
    <td>Sales Assistant</td>
    <td>New York</td>
    <td>6th Dec 11</td>
    <td>$145,600</td>
</tr>
<tr class="even">
    <td>Cedric</td>
    <td>Kelly</td>
    <td>Senior Javascript Developer</td>
    <td>Edinburgh</td>
    <td>29th Mar 12</td>
    <td>$433,060</td>
</tr>
EOD;
	}
);

DT_Example::$tables['ssp-details'] = array(
	'columns' => array( '', 'first_name', 'last_name', 'position', 'office' ),
	'header'  => true,
	'footer'  => true,
	'body'    => false
);

DT_Example::$tables['html-comma'] = array(
	'columns' => array( 'name', 'position', 'office', 'age', 'start_date', function ( $type, $row ) {
		return $type === 'title' ? 'Salary' : '$'.number_format($row['salary'], 0, ',', '.').',00';
	} ),
	'header'  => true,
	'footer'  => true,
	'body'    => true
);

DT_Example::$tables['html-grade'] = array(
	'columns' => array( 'name', 'position', 'office', 'age', 'start_date', function ( $type, $row ) {
		if ( $type === 'title' ) {
			return 'Salary';
		}
		else if ( $row['salary'] < 350000 ) {
			return 'Low';
		}
		else if ( $row['salary'] < 650000 ) {
			return 'Medium';
		}
		return 'High';
	} ),
	'header'  => true,
	'footer'  => true,
	'body'    => true
);

DT_Example::$tables['html-salary'] = array(
	'columns' => array(
		'name',
		'position',
		function($type, $row) {
			if ( $type === 'title' ) {
				return 'Office';
			}
			return'<span>'.$row['office'].'</span>';
		},
		function ( $type, $row ) {
			if ( $type === 'title' ) {
				return 'Age';
			}
			else if ( $row['age'] < 35 ) {
				return '<span class="young">'.$row['age'].'</span>';
			}
			else if ( $row['age'] < 55 ) {
				return '<span class="middleaged">'.$row['age'].'</span>';
			}
			return '<span class="old">'.$row['age'].'</span>';
		},
		function ( $type, $row ) {
			if ( $type === 'title' ) {
				return 'Start Date';
			}
			return implode('-', explode('/', $row['start_date']));
		},
		function ( $type, $row ) {
			if ( $type === 'title' ) {
				return 'Salary';
			}
			return '<span>'.'$'.number_format($row['salary']).'.00'.'</span>';
		} 
	),
	'header'  => true,
	'footer'  => true,
	'body'    => true
);

DT_Example::$tables['html-iso8601'] = array(
	'columns' => array(
		'name',
		'position',
		'office',
		'age',
		function ( $type, $row ) {
			if ( $type === 'title' ) {
				return 'Start Date';
			}
			return implode('-', explode('/', $row['start_date']));
		},
		'salary' 
	),
	'header'  => true,
	'footer'  => true,
	'body'    => true
);


DT_Example::$tables['html-thin'] = array(
	'columns' => array( 'name', 'position', 'office', 'salary' ),
	'header'  => true,
	'footer'  => false,
	'body'    => true
);


DT_Example::$tables['html-locale-thin'] = array(
	'columns' => array( 'name', 'office', 'start_date', 'salary-plain' ),
	'header'  => true,
	'footer'  => false,
	'body'    => true
);


DT_Example::$tables['html-wide'] = array(
	'columns' => array( 'first_name', 'last_name', 'position', 'office', 'age', 'start_date', 'salary', 'extn', 'email' ),
	'header'  => true,
	'footer'  => false,
	'body'    => true
);


DT_Example::$tables['html-wide-index'] = array(
	'columns' => array( '', 'first_name', 'last_name', 'position', 'office', 'age', 'start_date', 'salary', 'extn', 'email' ),
	'header'  => true,
	'footer'  => false,
	'body'    => true
);


DT_Example::$tables['html-wide-footer'] = array(
	'columns' => array( 'first_name', 'last_name', 'position', 'office', 'age', 'start_date', 'salary', 'extn', 'email' ),
	'header'  => true,
	'footer'  => true,
	'body'    => true
);


DT_Example::$tables['html-split-name'] = array(
	'columns' => array( 'first_name', 'last_name', 'position', 'office', 'salary' ),
	'header'  => true,
	'footer'  => false,
	'body'    => true
);


DT_Example::$tables['html-total-footer'] = array(
	'columns' => array( 'first_name', 'last_name', 'position', 'office', 'salary' ),
	'header'  => true,
	'footer'  => function () {
		return '<tfoot>'.
				'<tr>'.
					'<th colspan="4" style="text-align:right">Total:</th>'.
					'<th></th>'.
				'</tr>'.
			'</tfoot>';
	},
	'body'    => true
);


DT_Example::$tables['ajax-details'] = array(
	'columns' => array( '', 'name', 'position', 'office', 'salary' ),
	'header'  => true,
	'footer'  => true,
	'body'    => false
);


DT_Example::$tables['html-details'] = array(
	'columns' => array( '', 'first_name', 'last_name', 'position', 'office', 'age', 'start_date', 'salary', 'extn' ),
	'header'  => true,
	'footer'  => true,
	'body'    => true
);


DT_Example::$tables['html-details-right'] = array(
	'columns' => array( 'first_name', 'last_name', 'position', 'office', 'age', 'start_date', 'salary', 'extn', '' ),
	'header'  => true,
	'footer'  => true,
	'body'    => true
);


DT_Example::$tables['ajax-thin'] = array(
	'columns' => array( 'name', 'position', 'office', 'salary' ),
	'header'  => true,
	'footer'  => false,
	'body'    => false
);



DT_Example::$tables['html-index'] = array(
	'columns' => array( '', 'name', 'position', 'office', 'age', 'salary' ),
	'header'  => true,
	'footer'  => true,
	'body'    => true
);


DT_Example::$tables['html-office-edin'] = array(
	'columns' => array( 'name', 'position', 'office', 'age', 'salary' ),
	'header'  => true,
	'footer'  => true,
	'body'    => true,
	'filter'  => function ( $data ) {
		return $data['office'] === 'Edinburgh';
	}
);


DT_Example::$tables['html-office-london'] = array(
	'columns' => array( 'name', 'position', 'office', 'age', 'salary' ),
	'header'  => true,
	'footer'  => true,
	'body'    => true,
	'filter'  => function ( $data ) {
		return $data['office'] === 'London';
	}
);


DT_Example::$tables['html-add-api'] = array(
	'columns' => array(
		function () { return 'Column 1'; },
		function () { return 'Column 2'; },
		function () { return 'Column 3'; },
		function () { return 'Column 4'; },
		function () { return 'Column 5'; }
	),
	'header'  => true,
	'footer'  => true,
	'body'    => true,
	'filter'  => function ( $data ) {
		return false;
	}
);


DT_Example::$tables['html-form'] = array(
	'columns' => array(
		'name',
		function ($type, $row) { return $type == 'title' ?
			'Age' :
			'<input type="text" id="row-'.$row['id'].'-age" name="row-'.$row['id'].'-age" value="'.$row['age'].'">';
		},
		function ($type, $row) { return $type == 'title' ?
			'Position' :
			'<input type="text" id="row-'.$row['id'].'-position" name="row-'.$row['id'].'-position" value="'.$row['position'].'">';
		},
		function ($type, $row) {
			$c = 'selected="selected"';
			return $type == 'title' ?
				'Office' :
				'<select size="1" id="row-'.$row['id'].'-office" name="row-'.$row['id'].'-office">'.
					'<option value="Edinburgh" '    .($row['office'] === 'Edinburgh' ? $c : '').    '>Edinburgh</option>'.
					'<option value="London" '       .($row['office'] === 'London' ? $c : '').       '>London</option>'.
					'<option value="New York" '     .($row['office'] === 'New York' ? $c : '').     '>New York</option>'.
					'<option value="San Francisco" '.($row['office'] === 'San Francisco' ? $c : '').'>San Francisco</option>'.
					'<option value="Tokyo" '        .($row['office'] === 'Tokyo' ? $c : '').        '>Tokyo</option>'.
				'</select>';
		}
	),
	'header'  => true,
	'footer'  => true,
	'body'    => true
);


DT_Example::$tables['html-complex-header'] = array(
	'columns' => array( 'name', 'position', 'salary', 'office', 'extn', 'email' ),
	'header'  => function () {
		return '<thead>'.
				'<tr>'.
					'<th rowspan="2">Name</th>'.
					'<th colspan="2">HR Information</th>'.
					'<th colspan="3">Contact</th>'.
				'</tr>'.
				'<tr>'.
					'<th>Position</th>'.
					'<th>Salary</th>'.
					'<th>Office</th>'.
					'<th>Extn.</th>'.
					'<th>E-mail</th>'.
				'</tr>'.
			'</thead>';
	},
	'footer'  => true,
	'body'    => true
);


DT_Example::$tables['scroller'] = array(
	'columns' => array(),
	'header'  => function () {
		return '<thead>'.
				'<tr>'.
					'<th>ID</th>'.
					'<th>First name</th>'.
					'<th>Last name</th>'.
					'<th>ZIP / Post code</th>'.
					'<th>Country</th>'.
				'</tr>'.
			'</thead>';
	},
	'footer'  => false,
	'body'    => false
);


DT_Example::$tables['empty'] = array(
	'columns' => array(),
	'header'  => false,
	'footer'  => false,
	'body'    => false
);


DT_Example::$tables['todo'] = array(
	'columns' => array(),
	'header'  => function () {
		return '<thead>'.
				'<tr>'.
					'<th>Priority</th>'.
					'<th>Item</th>'.
					'<th>Status</th>'.
				'</tr>'.
			'</thead>';
	},
	'footer'  => false,
	'body'    => false
);
