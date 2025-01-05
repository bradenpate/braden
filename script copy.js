document.addEventListener("DOMContentLoaded", () => {
  // Animate on Scroll
  const elements = document.querySelectorAll(".animate-on-scroll");
  const observer = new IntersectionObserver(
    (entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("opacity-100", "scale-100");
          entry.target.classList.remove("opacity-0", "scale-90");
          observer.unobserve(entry.target); // Stop observing once animated
        }
      });
    },
    { threshold: 0.1 }
  );
  elements.forEach((el) => observer.observe(el));

  // Copy Email
  const sayHelloLink = document.getElementById("sayHello");
  if (sayHelloLink) {
    sayHelloLink.addEventListener("click", () => {
      const email = "braden@bradenpate.com";
      navigator.clipboard.writeText(email).then(() => {
        sayHelloLink.textContent = "Email copied";
        setTimeout(() => {
          sayHelloLink.textContent = "Say hello";
        }, 2000);
      }).catch((err) => {
        console.error("Failed to copy email: ", err);
      });
    });
  }

  // Next Project Link
  const projects = [
    "agile.html",
    "ef.html",
    "makeshift.html",
    "mendix-ai.html",
    "mendix-cko25.html",
    "mendix-refresh.html",
    "wedding.html",
  ];

  const currentPath = window.location.pathname.split("/").pop();
  const currentIndex = projects.indexOf(currentPath);

  // Proceed only if a placeholder is present and the current project is valid
  const placeholder = document.getElementById("next-project-placeholder");
  if (placeholder && currentIndex !== -1) {
    const nextIndex = (currentIndex + 1) % projects.length; // Loop back to the first project
    const nextProject = projects[nextIndex];
    const projectTitle = nextProject.replace(".html", "");

    // Fetch the HTML template
    fetch("./next-project.html")
      .then((response) => response.text())
      .then((template) => {
        // Create a temporary element to parse the template
        const tempDiv = document.createElement("div");
        tempDiv.innerHTML = template;

        // Update the placeholders
        const container = tempDiv.querySelector("#next-project-container");
        const thumbnail = container.querySelector("#next-project-thumbnail");
        const link = container.querySelector("#next-project-link");

        thumbnail.src = `/images/work/${projectTitle}/thumbnail.png`;
        thumbnail.alt = `${projectTitle} Thumbnail`;
        link.href = `./work/${nextProject}`;
        link.textContent = `Next Project →`;

        // Append the updated template to the placeholder
        placeholder.appendChild(container);
      })
      .catch((error) => console.error("Failed to load next-project.html:", error));
  }
  
});