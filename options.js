// Saves options to chrome.storage
function save_options() {
  // percentOfWordsToReplace was deprecated 2021-03-30.
  chrome.storage.sync.remove('percentOfWordsToReplace');

  var usdPerHour =
    parseFloat(document.getElementById('usdPerHour').value, 10);

  var hoursPerDay =
    parseFloat(document.getElementById('hoursPerDay').value, 10);

  var daysPerMonth =
    parseFloat(document.getElementById('daysPerMonth').value, 10);

  items = {
    usdPerHour: usdPerHour,
    hoursPerDay: hoursPerDay,
    daysPerMonth: daysPerMonth,
  };

  console.log("Saving options: ", items);

  chrome.storage.sync.set(items, function () {
    glue.browser.runtime.sendMessage({ 'message': 'updateContextMenu' });

    // Update status to let user know options were saved.
    var status = document.getElementById('status');
    status.textContent = 'Options saved.';
    // To reflect possible value validation.
    restore_options();
    setTimeout(function () {
      status.textContent = 'Please reopen currently opened tabs for changes to take effect.';
    }, 750);
  });
}

// Restores select box and checkbox state using the preferences
// stored in chrome.storage.
function restore_options() {
  get_options(/* callback= */ function (items) {
    document.getElementById('usdPerHour').value =
      items.usdPerHour;
    document.getElementById('hoursPerDay').value =
      items.hoursPerDay;
    document.getElementById('daysPerMonth').value =
      items.daysPerMonth;
  });
}

document.addEventListener('DOMContentLoaded', restore_options);
// TODO: autosave on edit.
document.getElementById('save').addEventListener('click',
  save_options);