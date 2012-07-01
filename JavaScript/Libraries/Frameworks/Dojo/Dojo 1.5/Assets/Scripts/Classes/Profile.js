/*
 * The Dojo SDK build tool will be pointed to this file to generate a single Js file.
 * Note: from Mac Terminal, cd to the Assets/Scripts/Classes directory and type 'sh build.sh'.
 */
dependencies = {
	stripConsole : 'all',
	action : 'clean,release',
	optimize : 'shrinksafe',
	releaseName : 'Integralist',
	localeList : 'en-gb',
	
	layers: [
		{
			name: "../Classes/Init.js",
			resourceName : "Integralist.Init",
			dependencies: [
				"Integralist.Init"
			]
		}
	],
	
	prefixes: [
		[ "Integralist", "../Classes" ]
	]
}