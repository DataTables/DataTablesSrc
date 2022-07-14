<?php
require_once('markdown_extended.php');// or die('Run ./make.sh thirdparty');

/*
 * Extensions to Markdown Extra Extended, specifically for the DataTables
 * project:
 *
 * * Inline code blocks:
 *    * `dt-init {DataTables initialisation parameter}` - Link to init parameter
 *      documentation showing as inline code.
 *    * `dt-api {DataTables API method}` - Link to API method documentation
 *      showing as inline code.
 *    * `tag {code}` - code tag with class "tag" (for styling HTML tags)
 *    * `path {code}` - code tag with class "path" (for styling file system
 *      paths)
 */

function DT_Markdown($text, $default_claases=array(), $truncateWhiteSpace=false){
	if ( $truncateWhiteSpace ) {
		$text = DT_Markdown_Parser::truncateWhiteSpace( $text );
	}

	$parser = new DT_Markdown_Parser($default_claases);
	return $parser->transform($text);
}

class DT_Markdown_Parser extends MarkdownExtraExtended_Parser {
	// If the first line has white space, then remove that amount of white space
	// from all lines
	static function truncateWhiteSpace ( $str )
	{
		// Remove lines that have white space only
		while ( preg_match('/^\t*\n/', $str) ) {
			$str = preg_replace( '/^\t*\n/', '', $str );
		}

		// Split it up for line by line
		$a = explode("\n", $str);

		if ( strpos( $a[0], "\t" ) === 0 || strpos( $a[0], " " ) === 0 ) {
			// How much white space?
			preg_match("/^\s+/", $a[0], $match);

			// Remove the same amount of white space for each line
			if ( $match && count($match) ) {
				for ( $i=0, $ien=count($a) ; $i<$ien ; $i++ ) {
					$a[$i] = preg_replace( '/'.$match[0].'/', '', $a[$i], 1 );
				}
			}
		}

		return implode("\n", $a);
	}


	function __construct( $options )
	{
		if ( isset( $options['nohtml'] ) ) {
			$this->no_markup = $options['nohtml'];
		}

		$this->extended_hardbreaks = isset( $options['extended_hardbreaks'] ) ?
			$options['extended_hardbreaks'] :
			false;

		$this->block_gamut['doPhp'] = 9;
		$this->block_gamut['doColumns'] = 13;
		$this->block_gamut['doGrid'] = 12;
		$this->block_gamut['doPullQuotes'] = 61;
		MarkdownExtra_Parser::__construct();
	}

	function doHardBreaks($text) {
		if ( $this->extended_hardbreaks ) {
			# Do hard breaks:
			# EXTENDED: changed to allow breaks without two spaces and just one new line
			# original code /* return preg_replace_callback('/ {2,}\n/', */
			// Remove double newlines that remain
			$text = preg_replace_callback('/\n\n/',
				array(&$this, '_doHardBreaks_callback'), $text);

			return preg_replace_callback('/ *\n/',
				array(&$this, '_doHardBreaks_callback'), $text);
		}

		return preg_replace_callback('/ +\n/',
			array(&$this, '_doHardBreaks_callback'), $text);
	}


	function _docLink ( $software, $type, $item, $html )
	{
		$host = '//datatables.net/reference';
		$lang = '';

		if ( strpos($item, '|') !== false ) {
			$a = explode('|', $item);
			$s = array();

			for ( $i=0, $ien=count($a) ; $i<$ien ; $i++ ) {
				$s[] = self::_docLink( $software, $type, $a[$i],
					htmlspecialchars(trim($a[$i]), ENT_NOQUOTES)
				);
			}

			return implode(' or ', $s);
		}

		// For 'type' links, we override the software
		if ( $type === 'type' ) {
			if ( in_array( $item, array(
					'button-options',
					'form-options',
					'field-options',
					'DataTables.Editor',
					'DataTables.Editor.Field'
				) ) !== false )
			{
				$software = 'e';
			}
			else if ( in_array( $item, array(
					'cell-selector',
					'row-selector',
					'column-selector',
					'table-selector',
					'DataTables.Api',
					'selector-modifier',
				) ) !== false )
			{
				$software = 'dt';
			}
			else {
				$software = 'js';
			}
		}

		switch ( $software ) {
			case 'af':
				$lang = 'AutoFill';
				break;

			case 'b':
				$lang = 'Buttons';
				break;

			case 'cr':
				$lang = 'ColReorder';
				break;

			case 'cv':
				$lang = 'ColVis';
				break;

			case 'de':
				$host = '//datatables.net/extensions/datetime';
				$lang = 'DateTime';
				break;

			case 'e':
				$host = '//editor.datatables.net/reference';
				$lang = 'Editor';
				break;

			case 'fc':
				$lang = 'FixedColumns';
				break;

			case 'fh':
				$lang = 'FixedHeader';
				break;

			case 'kt':
				$lang = 'KeyTable';
				break;
			
			case 'r':
				$lang = 'Responsive';
				break;
			
			case 'rr':
				$lang = 'RowReorder';
				break;

			case 's':
			case 'sc':
				$lang = 'Scroller';
				break;

			case 'se':
				$lang = 'Select';
				break;

			case 'tt':
				$lang = 'TableTools';
				break;
			
			case 'js': // JS type
				$lang = 'Javascript';
				break;
			
			default:
				$lang = 'DataTables';
				break;
		}

		switch ( $type ) {
			case 'init':
				$klass = 'option';
				$lang .= ' initialisation option';
				break;

			case 'api':
				$klass = 'api';
				$lang .= ' API method';
				break;

			case 'event':
				$klass = 'event';
				$lang .= ' event';
				break;

			case 'type':
				$klass = 'type';
				$lang .= ' parameter type';
				break;

			case 'field':
				$klass = 'field';
				$lang .= ' field type';
				break;

			case 'display':
				$klass = 'display';
				$lang .= ' display type';
				break;

			case 'button':
				$klass = 'button';
				$lang .= ' button type';
				break;

			default;
				break;
		}

		if ( $html === '*' && $klass === 'type' ) {
			return '<code>Any</code>';
		}

		$item = preg_replace('/\[\]$/', '', $item);
		return '<a href="'.$host.'/'.$klass.'/'.$this->_doUrlEncode($item).'">'.
				'<code class="'.$klass.'" title="'.$lang.'">'.$html.'</code>'.
			'</a>';
	}


	function makeCodeSpan( $code )
	{
		$that = $this;
		$text = preg_replace_callback(
			'/^([a-z]{0,2}\-init |[a-z]{0,2}\-option |[a-z]{0,2}\-api |[a-z]{0,2}\-event |[a-z]{0,2}\-type |[a-z]{0,2}\-button |e\-field |e\-display |[dt]*\-tag |tag |[dt]*\-path |path |[dt]*\-string |string )?(.*)$/m',
			function ( $matches ) use (&$that) {
				$html = htmlspecialchars(trim($matches[2]), ENT_NOQUOTES);

				$flags    = explode('-', trim($matches[1]));
				$software = count( $flags ) > 1 ? $flags[0] : null;
				$tags     = count( $flags ) > 1 ? $flags[1] : $flags[0];

				if ( $tags === 'init' || $tags === 'option' ) {
					$formatted = $that->_docLink( $software, 'init', $matches[2], $html );
				}
				else if ( $tags === 'api' ) {
					$formatted = $that->_docLink( $software, 'api', $matches[2], $html );
				}
				else if ( $tags === 'event' ) {
					$formatted = $that->_docLink( $software, 'event', $matches[2], $html );
				}
				else if ( $tags === 'type' ) {
					$formatted = $that->_docLink( $software, 'type', $matches[2], $html );
				}
				else if ( $tags === 'field' ) {
					$formatted = $that->_docLink( $software, 'field', $matches[2], $html );
				}
				else if ( $tags === 'display' ) {
					$formatted = $that->_docLink( $software, 'display', $matches[2], $html );
				}
				else if ( $tags === 'button' ) {
					$formatted = $that->_docLink( $software, 'button', $matches[2], $html );
				}
				else if ( $tags === 'tag' || $tags === 'dt-tag' || $tags === '-tag' ) {
					$formatted = '<code class="tag" title="HTML tag">'.$html.'</code>';
				}
				else if ( $tags === 'path' || $tags === 'dt-path' || $tags === '-path' ) {
					$formatted = '<code class="path" title="File path">'.$html.'</code>';
				}
				else if ( $tags === 'string' || $tags === 'dt-string' || $tags === '-string' ) {
					$formatted = '<code class="string" title="String">'.$html.'</code>';
				}
				else {
					$formatted = '<code>'.$html.'</code>';
				}

				return $that->hashPart( $formatted );
			},
			$code
		);

		return $text;
	}

	function _doUrlEncode ( $url ) {
		// rfc3986 says that ( and ) and valid in a URL and it makes the methods look nicer
		$str = urlencode( $url );
		$str = str_replace('%28', '(', $str);
		$str = str_replace('%29', ')', $str);
		return $str;
	}

	// Automatically add anchor tags to headers
	function _doHeaders_callback_setext($matches) {
		if ($matches[3] == '-' && preg_match('{^- }', $matches[1]))
			return $matches[0];
		$level = $matches[3][0] == '=' ? 1 : 2;
		$attr  = $this->_doHeaders_attr($id =& $matches[2]);

		$text = $this->runSpanGamut($matches[1]);
		$anchor = $this->_doHeaderAnchor( $matches[1] );
		$block =
			"<h$level$attr data-anchor=\"".$anchor."\">".
				'<a name="'.$anchor.'" href="#'.$anchor.'"></a>'.
				$text.
			"</h$level>";
		return "\n" . $this->hashBlock($block) . "\n\n";
	}

	function _doHeaders_callback_atx($matches) {
		$level = strlen($matches[1]);
		$attr  = $this->_doHeaders_attr($id =& $matches[3]);

		$text = $this->runSpanGamut($matches[2]);

		if ( $level <= 3 ) {
			$anchor = $this->_doHeaderAnchor( $matches[2] );
			$block = "<h$level$attr data-anchor=\"".$anchor."\">".
					'<a name="'.$anchor.'" href="#'.$anchor.'"></a>'.
					$text.
				"</h$level>";
		}
		else {
			$block = "<h$level$attr>".$text."</h$level>";
		}
		return "\n" . $this->hashBlock($block) . "\n\n";
	}


	function _doHeaderAnchor( $text ) {
		$text = strip_tags( $text );
		$text = str_replace(' ', '-', $text);
		$text = str_replace('`', '', $text);
		return $text;
	}


	// Pull quotes - same as quotes using `>` but uses `<` and the `aside` tag
	function doPullQuotes($text) {
		$text = preg_replace_callback('/
			(?>^[ ]*<\ [ ]?
				(?:\((.+?)\))?
				[ ]*(.+\n(?:.+\n)*)
			)+	
			/xm',
			array(&$this, '_doPullQuotes_callback'), $text);

		return $text;
	}
	
	function _doPullQuotes_callback($matches) {
		$cite = $matches[1];
		$bq = '< ' . $matches[2];
		# trim one level of quoting - trim whitespace-only lines
		$bq = preg_replace('/^[ ]*<[ ]?|^[ ]+$/m', '', $bq);
		$bq = $this->runBlockGamut($bq);		# recurse

		$bq = preg_replace('/^/m', "  ", $bq);
		# These leading spaces cause problem with <pre> content, 
		# so we need to fix that:
		$bq = preg_replace_callback('{(\s*<pre>.+?</pre>)}sx', 
			array(&$this, '_doBlockQuotes_callback2'), $bq);
		
		$res = "<aside>\n$bq\n</aside>";
		return "\n". $this->hashBlock($res)."\n\n";
	}


	function doGrid ( $text ) {
		$that = $this;
		$text = preg_replace_callback('
			{
				^
				# 1: Opening marker
				(
					\|{3,} # Marker: three or more pipes
				)

				# 2: Content
				(
					(?>
						(?!\1 [ ]* \n)	# Not a closing marker.
						.*\n+
					)+
				)
				
				# Closing marker.
				\1 [ ]* \n
			}xm',
			function ($matches) use ($that) {
				$grid = '<div class="grid">'.$this->runBlockGamut($matches[2]).'</div>';
				return "\n\n".$that->hashBlock($grid)."\n\n";
			},
			$text
		);
		
		return $text;
	}


	function doColumns ( $text ) {
		$that = $this;
		$text = preg_replace_callback('
			{
				^
				# 1: Opening marker
				(
					\|{2} # Marker: two pipes
				)

				# 2: Column class
				[ ]?(.*?) [ ]* \n # Whitespace and newline following marker.
				
				# 3: Content
				(
					(?>
						(?!\1 [ ]* \n)	# Not a closing marker.
						.*\n+
					)+
				)
				
				# Closing marker.
				\1 [ ]* \n
			}xm',
			function ($matches) use ($that) {
				$column = '<div class="unit w-'.$matches[2].'">'.$this->runBlockGamut($matches[3]).'</div>';
				return "\n\n".$that->hashBlock($column)."\n\n";
			},
			$text
		);
		
		return $text;
	}


	function doPhp ( $text ) {
		$that = $this;
		$text = preg_replace_callback('/
			(?>^\?[ ]?
				(?:\((.+?)\))?
				[ ]*(.+\n(?:.+\n)*)
			)+	
			/xm',
			function ($matches) use ($that) {
				$bq = preg_replace('/^\?[ ]?/m', '', $matches[0]);
				$hashed = $that->hashBlock( "<?php\n{$bq}?>" );

				return "\n". $hashed ."\n\n";
			}
			,
			$text
		);

		return $text;
	}
}