document.addEventListener("DOMContentLoaded", () => {
  // Highlight Navigation Links
  const currentPath = window.location.pathname.replace(/\/$/, ""); // Normalize path
  const navLinks = document.querySelectorAll(".nav-link");

  navLinks.forEach((link) => {
    const linkPath = new URL(link.href).pathname.replace(/\/$/, "");
    if (linkPath === currentPath) {
      link.classList.add("text-blue-950");
      link.classList.remove("text-slate-400");
      link.setAttribute("aria-current", "page");
    } else {
      link.classList.add("text-slate-400");
      link.classList.remove("text-blue-950");
    }
  });

  // Animate on Scroll
  const elements = document.querySelectorAll(".animate-on-scroll");
  if (!("IntersectionObserver" in window) || window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    elements.forEach((el) => {
      el.classList.add("opacity-100", "scale-100");
      el.classList.remove("opacity-0", "scale-90");
    });
  } else {
    const observer = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("opacity-100", "scale-100");
            entry.target.classList.remove("opacity-0", "scale-90");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1 }
    );
    elements.forEach((el) => observer.observe(el));
  }

  // Copy Email
  const sayHelloLink = document.getElementById("sayHello");
  if (sayHelloLink) {
    sayHelloLink.addEventListener("click", (event) => {
      event.preventDefault();
      const email = "braden@bradenpate.com";
      if (!navigator.clipboard?.writeText) {
        window.location.href = `mailto:${email}`;
        return;
      }
      navigator.clipboard.writeText(email)
        .then(() => {
          sayHelloLink.textContent = "Email copied";
          setTimeout(() => {
            sayHelloLink.textContent = "Say hello";
          }, 2000);
        })
        .catch(() => {
          window.location.href = `mailto:${email}`;
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

  const currentProject = window.location.pathname.split("/").pop();
  const currentIndex = projects.indexOf(currentProject);

  // Proceed only if a placeholder is present and the current project is valid
  const placeholder = document.getElementById("next-project-placeholder");
  if (placeholder && currentIndex !== -1) {
    const nextIndex = (currentIndex + 1) % projects.length; // Loop back to the first project
    const nextProject = projects[nextIndex];
    const projectTitle = nextProject.replace(".html", "");

    // Fetch the HTML template
    fetch("../next-project.html")
      .then((response) => {
        if (!response.ok) throw new Error(`Next project template: ${response.status}`);
        return response.text();
      })
      .then((template) => {
        // Create a temporary element to parse the template
        const tempDiv = document.createElement("div");
        tempDiv.innerHTML = template;

        // Update the placeholders
        const container = tempDiv.querySelector("#next-project-container");
        const thumbnail = container.querySelector("#next-project-thumbnail");
        const link = container.querySelector("#next-project-link");

        thumbnail.src = `../images/work/${projectTitle}/thumbnail.png`;
        thumbnail.alt = `${projectTitle} Thumbnail`;
        link.href = `../work/${nextProject}`;
        link.textContent = `Next Project →`;

        // Append the updated template to the placeholder
        placeholder.appendChild(container);
      })
      .catch((error) => console.error("Failed to load next-project.html:", error));
  }
});
