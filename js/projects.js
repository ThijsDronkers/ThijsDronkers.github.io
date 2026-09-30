const projects = [
	{ title: "Project 1", description: "A - Dit is project 1." },
	{ title: "Project 2", description: "B - Dit is project 2." },
	{ title: "Project 3", description: "C - Dit is project 3." },
	{ title: "Project 4", description: "D - Dit is project 4." }
];

const projectList = document.querySelector("#project-list");
const projectSort = document.querySelector("#project-sort");

if (projectList) {
	const renderProjects = () => {
		const sortedProjects = [...projects];
		if (projectSort?.value === "az" || projectSort?.value === "za") {
			const sortDirection = projectSort.value === "az" ? 1 : -1;
			sortedProjects.sort((first, second) =>
				sortDirection * first.title.localeCompare(second.title, "nl")
			);
		}

		projectList.replaceChildren();
		sortedProjects.forEach((project) => {
			const article = document.createElement("article");
			article.className = "project-box";

			const title = document.createElement("h3");
			title.textContent = project.title;

			const description = document.createElement("p");
			description.textContent = project.description;

			article.append(title, description);
			projectList.append(article);
		});
	};

	projectSort?.addEventListener("change", renderProjects);
	renderProjects();
}