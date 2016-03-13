'use strict';

// This file contains route definitions – the rules how location URLs are translated
// to parameters for stores in the Catberry application.
//
// Format:
// /some/:parameter[store1,store2,store3]?queryParameter=:queryValue[store1,store2]
//
// More details here:
// http://catberry.org/documentation#routing

module.exports = [
	'/:page[Pages]',
	'/:page[Pages]?query=:query[commits/Search]&commitDetails=:detailsId[commits/Details,commits/List]'
];
