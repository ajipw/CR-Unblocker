/* global fetch, chrome */
function setUsCookie(tld) {
	console.log('Setting cookie...');
	
	fetch('https://api2.cr-unblocker.com/start_session')
	.then((res) => {
		// the server should return an object with a value "sessionId" which is a string containing the session id
		return res.json();
	}).then((res) => {
		// the script I'm using is giving me the session id with one space at the end. I don't know why but this should remove it
		let session_id = res.data.session_id;
		// deleting the cookie sess_id
		chrome.cookies.remove({ url: `http://crunchyroll${tld}/`, name: 'session_id' });
		// setting the cookie and reloading the page when it's done
		chrome.cookies.set({ url: `http://.crunchyroll${tld}/`, name: 'session_id', value: session_id }, () => {
			chrome.tabs.reload();
		});
	})
	.catch((e) => {
		chrome.notifications.create({
			type: 'basic',
			iconUrl: 'Crunchyroll-512.png',
			title: 'Error in CR-Unblocker Extension',
			message: `CR-Unblocker has encountered an error: ${e}`
		});
	});
}

// when the icon in the taskbar is clicked it will open the cr site and start the function
chrome.browserAction.onClicked.addListener(() => {
	setUsCookie('.com');
	chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
		chrome.tabs.reload(tabs[0].id);
	});
});

// when it recives the message from the content script this will execute and call the function with the correct tld
chrome.runtime.onMessage.addListener((message) => {
	setUsCookie(message.msg);
});

chrome.runtime.onStartup.addListener(() => {
	setUsCookie('.com');
});
