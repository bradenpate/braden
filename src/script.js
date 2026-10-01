document.addEventListener("DOMContentLoaded", () => {
  // Highlight Navigation Links
  const currentPath = window.location.pathname.replace(/\/$/, ""); // Normalize path
  const navLinks = document.querySelectorAll(".nav-link");

  if (navLinks.length === 0) {
    console.error("No nav links found. Ensure navbar.html is loaded first.");
  }

  navLinks.forEach((link) => {
    const linkPath = link.getAttribute("href").replace(/\/$/, "");
    if (link.id !== "sayHello" && linkPath === currentPath) {
      link.classList.add("text-blue-950");
      link.classList.remove("text-slate-400");
    } else {
      link.classList.add("text-slate-400");
      link.classList.remove("text-blue-950");
    }
  });

  // Gentle, one-time reveals for media and content across every page.
  const motion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const style = document.createElement('style');
  style.textContent = `
    .scroll-reveal { transition: opacity 550ms ease, transform 550ms ease; }
    .scroll-reveal.is-waiting { opacity: 0; transform: translateY(12px); }
    .scroll-reveal.is-shown { opacity: 1; transform: none; }
    @media (prefers-reduced-motion: reduce) {
      .scroll-reveal, .animate-on-scroll, .animate-fadeIn {
        opacity: 1 !important; transform: none !important;
        transition: none !important; animation: none !important;
      }
    }
  `;
  document.head.appendChild(style);
  const elements = [...document.querySelectorAll('.animate-on-scroll, body > div p, body > div h1, body > div h2, body > div h3, .about-interest')]
    .filter(element => !element.closest('header, #footer, .interest-backdrop') &&
      !element.parentElement.closest('.animate-on-scroll, .about-interest'));
  const reveal = element => {
    element.classList.remove('opacity-0', 'scale-90', 'is-waiting');
    element.classList.add('opacity-100', 'scale-100', 'is-shown');
  };
  let revealObserver;
  if (!motion.matches && 'IntersectionObserver' in window) {
    revealObserver = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          reveal(entry.target);
          revealObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0, rootMargin: '0px 0px -24px 0px' });
    elements.forEach(element => {
      element.classList.remove('animate-fadeIn', 'opacity-0', 'scale-90');
      element.classList.add('scroll-reveal');
      // Keep initial content visible; animate content as it arrives during scrolling.
      if (element.getBoundingClientRect().top < window.innerHeight) reveal(element);
      else { element.classList.add('is-waiting'); revealObserver.observe(element); }
    });
  } else elements.forEach(reveal);
  motion.addEventListener('change', () => {
    if (motion.matches) { revealObserver?.disconnect(); elements.forEach(reveal); }
  });

  // Copy Email
  const sayHelloLink = document.getElementById("sayHello");
  if (sayHelloLink) {
    sayHelloLink.addEventListener("click", (event) => {
      event.preventDefault();
      const email = "braden@bradenpate.com";
      navigator.clipboard.writeText(email)
        .then(() => {
          sayHelloLink.textContent = "Email copied";
          setTimeout(() => {
            sayHelloLink.textContent = "Say hello";
          }, 2000);
        })
        .catch((err) => {
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
      .then((response) => response.text())
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