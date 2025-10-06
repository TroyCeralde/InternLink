function getQueryParam(name) {
	const url = new URL(window.location.href);
	return url.searchParams.get(name);
}
function showPopup(message) {
	document.getElementById("popup-message").textContent = message;
	document.getElementById("popup").style.display = "flex";
}
function closePopup() {
	document.getElementById("popup").style.display = "none";
	// Remove error from URL
	const url = new URL(window.location.href);
	url.searchParams.delete("error");
	window.history.replaceState({}, document.title, url.pathname);
}
window.onload = function () {
	const error = getQueryParam("error");
	if (error === "notfound") {
		showPopup("Account not found. Please register first.");
	} else if (error === "wrongpass") {
		showPopup("Incorrect password.");
	}
};
