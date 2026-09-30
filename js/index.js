document.querySelectorAll(".blog-box").forEach((blog, index) => {
	const title = blog.querySelector("h3");
	if (!title) return;

	const content = document.createElement("div");
	content.id = `blog-content-${index + 1}`;

	while (title.nextSibling) {
		content.append(title.nextSibling);
	}

	const toggle = document.createElement("button");
	toggle.type = "button";
	toggle.className = "blog-toggle";
	toggle.textContent = "Toon blog";
	toggle.setAttribute("aria-expanded", "false");
	toggle.setAttribute("aria-controls", content.id);
	content.hidden = true;

	title.after(toggle, content);

	toggle.addEventListener("click", () => {
		const isExpanded = toggle.getAttribute("aria-expanded") === "true";
		toggle.setAttribute("aria-expanded", String(!isExpanded));
		toggle.textContent = isExpanded ? "Toon blog" : "Verberg blog";
		content.hidden = isExpanded;
	});
});