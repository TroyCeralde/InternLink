document.addEventListener("DOMContentLoaded", () => {
	const navItems = document.querySelectorAll(".nav-item");

	navItems.forEach((item) => {
		item.addEventListener("click", function (event) {
			// Prevent default link behavior if it's just for navigation state
			// event.preventDefault();

			// Remove 'active' class from all items
			navItems.forEach((nav) => nav.classList.remove("active"));

			// Add 'active' class to the clicked item
			this.classList.add("active");
		});
	});
});
