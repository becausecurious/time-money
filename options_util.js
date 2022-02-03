const ABSENT_VALUE = "__ABSENT_VALUE__"

function get_options(callback) {
	// TODO: this does not work on Firefox Android.
	glue.browser.storage.sync.get({
		usdPerHour: 7.25,

		hoursPerDay: 8,

		daysPerMonth: 22,
	}, function (options) {
		_validate(options, callback);
	});
}

function _validate(options, callback) {
	if (options.usdPerHour <= 0.01) {
		options.usdPerHour = 0.01;
	}

	if (options.hoursPerDay <= 0.01) {
		options.hoursPerDay = 0.01;
	}

	if (options.daysPerMonth <= 0.01) {
		options.daysPerMonth = 0.01;
	}

	callback(options);
}