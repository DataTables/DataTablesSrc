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

function DT_Markdown($text, $default_claases = array()){
	$parser = new DT_Markdown_Parser($default_claases);
	return $parser->transform($text);
}

class DT_Markdown_Parser extends MarkdownExtraExtended_Parser {
	function makeCodeSpan( $code )
	{
		$that = $this;
		$text = preg_replace_callback(
			'/^(dt\-init |dt\-api |tag |path )?(.*)$/m',
			function ( $matches ) use (&$that) {
				$html = htmlspecialchars(trim($matches[2]), ENT_NOQUOTES);

				if ( $matches[1] === 'dt-init ' ) {
					$formatted =
						'<a href="//datatables.net/init/'.urlencode($matches[2]).'">'.
							'<code>'.$html.'</code>'.
						'</a>';
				}
				else if ( $matches[1] === 'dt-api ' ) {
					$formatted =
						'<a href="//datatables.net/api/'.urlencode($matches[2]).'">'.
							'<code>'.$html.'</code>'.
						'</a>';
				}
				else if ( $matches[1] === 'tag ' ) {
					$formatted = '<code class="tag">'.$html.'</code>';
				}
				else if ( $matches[1] === 'path ' ) {
					$formatted = '<code class="path">'.$html.'</code>';
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
}
?>