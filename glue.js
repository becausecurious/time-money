var glue = {
	is_chrome: false,
	is_firefox: false,
	browser: null,
}

// TODO: Detect firefox for android, see browser.runtime.getPlatformInfo().

if (typeof browser !== 'undefined') {
	glue.browser = browser;
	glue.is_firefox = true;
} else {
	// Firefox defines both.
	if (typeof chrome !== 'undefined') {
		glue.browser = chrome;
		glue.is_chrome = true;
	}
}

