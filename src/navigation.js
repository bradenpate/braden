document.addEventListener("DOMContentLoaded", () => {
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
});