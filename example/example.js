var makepub = require("../index.js"), _ = require("underscore");

// Metadata example.
var metadata = {
	id: Date.now(),
	title: 'Unnamed Document',
	series: 'My Series',
	sequence: 1,
	author: 'Anonymous',
	fileAs: 'Anonymous',
	genre: 'Non-Fiction',
	tags: 'Sample,Example,Test',
	copyright: 'Anonymous, 1980',
	publisher: 'My Fake Publisher',
	published: '2000-12-31',
	language: 'en',
	description: 'A test book.',
	contents: 'Chapters',
	source: 'http://www.kcartlidge.com'
};

var copyright = `<h1>[[TITLE]]</h1>
<h2>[[AUTHOR]]</h2>
<h3>&copy; [[COPYRIGHT]]</h3>
<p>
	All rights reserved.
</p>
<p>
	No part of this book may be reproduced in any form or by any electronic or
	mechanical means, including information storage and retrieval systems, without
	written permission from the author, except where covered by fair usage or
	equivalent.
</p>
<p>
	This book is a work of fiction.
	Any resemblance to actual persons	(living or dead) is entirely coincidental.
</p>
`;

var more = `<h1>More Books to Read</h1>
<h2>Thanks for reading <em>[[TITLE]]</em>.</h2>
<p>
	I hope you enjoyed the book, but however you felt please consider leaving a
	review where you purchased it and help other readers discover it.
</p>
<p>
	You can find links to more books (and often special offers/discounts) by
	visiting my site at <a href="http://kcartlidge.com/books">KCartlidge.com/books</a>.
</p>
`;

var about = `<h1>About the Author</h1>
<p>
	This is just some random blurb about the author.
</p>
<p>
	You can find more at the author's site.
</p>
`;

// Dummy text (lorem ipsum).
var lipsum = "<p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse mattis iaculis pharetra. Proin malesuada tortor ut nibh viverra eleifend.</p><p>Duis efficitur, arcu vitae viverra consectetur, nisi mi pharetra metus, vel egestas ex velit id leo. Curabitur non tortor nisi. Mauris ornare, tellus vel fermentum suscipit, ligula est eleifend dui, in elementum nunc risus in ipsum. Pellentesque finibus aliquet turpis sed scelerisque. Pellentesque gravida semper elit, ut consequat est mollis sit amet. Nulla facilisi.</p>";
for (var i = 0; i < 3; i++) {
	lipsum = lipsum + lipsum;
}

// Optional override to replace auto-generated contents page.
// If not required, just drop it from the 'var epub=' call below.
var generateContentsPage = function (links, suggestedMarkup) {
	var contents = "<h1>Chapters</h1>";
	_.each(links, function (link) {
		// Omit all but the main pages.
		if (link.itemType === "main") {
			if (link.title === "More Books to Read") {
				contents += "<br />";
			}
			contents += "<a href='" + link.link + "'>" + link.title + "</a><br />";
		}
	});
	return contents;
};

// Set up the EPUB basics.
var epub = makepub.document(metadata, "../test/test-cover.png", generateContentsPage);
epub.addCSS(`body { font-family:Verdana,Arial,Sans-Serif; font-size:11pt; }
#title,#title h1,#title h2,#title h3 { text-align:center; }
h1,h3,p { margin-bottom:1em; }
h2 { margin-bottom:2em; }
p { text-indent: 0; }
p+p { text-indent: 0.75em; }`);

// Add some front matter.
epub.addSection('Title Page', "<div id='title'><h1>[[TITLE]]</h1><h2>Book <strong>[[SEQUENCE]]</strong> of <em>[[SERIES]]</em></h2><h3>[[AUTHOR]]</h3><p> &nbsp;</p><p>&copy; [[COPYRIGHT]]</p></div>", true, true);
epub.addSection('Copyright', copyright, false, true);

// Add some content.
epub.addSection('Chapter 1', "<h1>One</h1>" + lipsum);
epub.addSection('Chapter 2', "<h1>Two</h1>" + lipsum);
epub.addSection('Chapter 2a', "<h1>Two (A)</h1><p><strong>This chapter does not appear in the contents.</strong></p>" + lipsum, true);
epub.addSection('Chapter 3', "<h1>Three</h1><p>Here is a sample list.</p><ul><li>Sample list item one.</li><li>Sample list item two.</li><li>Sample list item three.</li></ul>" + lipsum);
epub.addSection('More Books to Read', more);
epub.addSection('About the Author', about);

// Generate the result.
epub.writeEPUB(function (e) {
	console.log(e);
}, '.', 'example', function () {
	console.log("Okay.")
});
