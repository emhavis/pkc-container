<?php
/**
 * HTMLets extension - lets you inline HTML snippets from files in a given directory.
 *
 * Usage: on a wiki page, &lt;htmlet&gt;foobar&lt;/htmlet%gt; will inline the contents (HTML) of the
 * file <tt>foobar.html</tt> from the htmlets directory. The htmlets directory can be
 * configured using <tt>$wgHTMLetsDirectory</tt>; it defaults to $IP/htmlets, i.e. the
 * directory <tt>htmlets</tt> in the installation root of MediaWiki.
 *
 * @file
 * @ingroup Extensions
 * @author Daniel Kinzler, brightbyte.de
 * @copyright © 2007 Daniel Kinzler
 * @license GNU General Public Licence 2.0 or later
 */

if( !defined( 'MEDIAWIKI' ) ) {
	echo( "This file is an extension to the MediaWiki software and cannot be used standalone.\n" );
	die( 1 );
}

$wgExtensionCredits['parserhook'][] = array(
	'path'           => __FILE__,
	'name'           => 'HTMLets',
	'author'         => array(
		'Daniel Kinzler',
		'...'
	),
	'url'            => 'https://mediawiki.org/wiki/Extension:HTMLets',
	'descriptionmsg' => 'htmlets-desc',
	'license-name'   => 'GPL-2.0-or-later'
);

/* Internationalization */
$wgMessagesDirs['HTMLets'] = __DIR__ . '/i18n';

/**
* Pass file content unchanged. May get mangeled by late server pass.
**/
define( 'HTMLETS_NO_HACK', 'none' );

/**
* Normalize whitespace, apply special stripping and escaping to avoid mangeling.
* This will break pre-formated text (pre tags), and may interfere with JavaScript
* code under some circumstances.
**/
define( 'HTMLETS_STRIP_HACK', 'strip' );

/**
* bypass late parser pass using ParserAfterTidy.
* This will get the file content safely into the final HTML.
* There's no obvious trouble with it, but it just might interfere with other extensions.
**/
define( 'HTMLETS_BYPASS_HACK', 'bypass' );

$wgHTMLetsHack = HTMLETS_BYPASS_HACK; #hack to use to work around bug #8997. see constant declarations.

$wgHTMLetsDirectory = null;

$wgHooks['ParserFirstCallInit'][] = 'wfHTMLetsSetHook';

function wfHTMLetsSetHook( $parser ) {
	$parser->setHook( 'htmlet', 'wfRenderHTMLet' );
	return true;
}

# The callback function for converting the input text to HTML output
function wfRenderHTMLet( $name, $argv, $parser ) {
	global $wgHTMLetsDirectory, $wgHTMLetsHack, $IP;

	if ( @$argv['nocache'] ) {
		$parser->getOutput()->updateCacheExpiry( 0 );
	}

	#HACKs for bug 8997
	$hack = @$argv['hack'];
	if ( $hack == 'strip' ) {
		$hack = HTMLETS_STRIP_HACK;
	} elseif ( $hack == 'bypass' ) {
		$hack = HTMLETS_BYPASS_HACK;
	} elseif ( $hack == 'none' || $hack == 'no' ) {
		$hack = HTMLETS_NO_HACK;
	} else {
		$hack = $wgHTMLetsHack;
	}

	$dir = $wgHTMLetsDirectory;
	if ( !$dir ) {
		$dir = "$IP/htmlets";
	}

	$name = preg_replace( '@[\\\\/!]|^\.+?&#@', '', $name ); #strip path separators and leading dots.
	$name .= '.html'; #append html ending, for added security and convenience

	$f = "$dir/$name";

	if ( !preg_match('!^\w+://!', $dir ) && !file_exists( $f ) ) {
		$output = Html::rawElement(
			'div',
			array( 'class' => 'error' ),
			wfMessage( 'htmlets-filenotfound', $name )->inContentLanguage()->escaped()
		);
	} else {
		$output = file_get_contents( $f );
		if ( $output === false ) {
			$output = Html::rawElement(
				'div',
				array( 'class' => 'error' ),
				wfMessage( 'htmlets-loadfailed', $name )->inContentLanguage()->escaped()
			);
		}
	}

	#HACKs for bug 8997
	if ( $hack == HTMLETS_STRIP_HACK ) {
		$output = trim( preg_replace( '![\r\n\t ]+!', ' ', $output ) ); //normalize whitespace
		$output = preg_replace( '!(.) *:!', '\1:', $output ); //strip blanks before colons

		if ( strlen( $output ) > 0 ) { //escape first char if it may trigger wiki formatting
			$ch = substr( $output, 0, 1 );

			if ( $ch == '#' ) {
				$output = '&#35;' . substr( $output, 1 );
			} elseif ( $ch == '*' ) {
				$output = '&#42;' . substr( $output, 1 );
			} elseif ( $ch == ':' ) {
				$output = '&#58;' . substr( $output, 1 );
			} elseif ( $ch == ';' ) {
				$output = '&#59;' . substr( $output, 1 );
			}
		}
	}
	elseif ( $hack == HTMLETS_BYPASS_HACK ) {
		global $wgHooks;

		if ( !isset($wgHooks['ParserAfterTidy']) || !in_array('wfRenderHTMLetHackPostProcess', $wgHooks['ParserAfterTidy']) ) {
			$wgHooks['ParserAfterTidy'][] = 'wfRenderHTMLetHackPostProcess';
		}

		$output = '<!-- @HTMLetsHACK@ '.base64_encode($output).' @HTMLetsHACK@ -->';
	}

	return $output;
}

function wfRenderHTMLetHackPostProcess( $parser, &$text ) {
	$text = preg_replace_callback(
		'/<!-- @HTMLetsHACK@ ([0-9a-zA-Z\\+\\/]+=*) @HTMLetsHACK@ -->/sm',
		function ($m) {
			return base64_decode("$m[1]");
		},
		$text
	);

	return true;
}
