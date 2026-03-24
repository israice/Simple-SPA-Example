/*
 * === Simple and reliable SPA for GitHub Pages ===
 * Supports templates, dynamic pages, embedded CSS/JS and caching
 */

const SPA = {
  cache: { templates: {}, pages: {} },

  navigation: {
    home: { 
      page: 'home.html', 
      children: [
        { title: 'News', page: 'home-news' },
        { title: 'Dashboard', page: 'home-dashboard' }
      ]
    },
    about: { 
      page: 'about.html',
      children: [
        { title: 'Our Team', page: 'about-team' },
        { title: 'Our History', page: 'about-history' }
      ]
    },
    contact: { 
      page: 'contact.html', 
      children: [
        { title: 'Email', page: 'contact-email' },
        { title: 'Phone', page: 'contact-phone' }
      ]
    },
    faq: { 
      page: 'faq.html', 
      children: [
        { title: 'General', page: 'faq-general' },
        { title: 'Technical', page: 'faq-technical' }
      ]
    }
  },

  // === HTML loading with caching ===
  async loadHTML(path, type = "page") {
    if (this.cache[type][path]) return this.cache[type][path];

    const response = await fetch(path);
    if (!response.ok) throw new Error(`Loading error: ${path}`);
    const html = await response.text();
    this.cache[type][path] = html;
    return html;
  },

  // === Loading templates (header, footer) ===
  async loadTemplates(list = ["header", "footer"]) {
    for (const name of list) {
      const el = document.getElementById(name);
      if (!el) continue;

      try {
        const html = await this.loadHTML(`${name}.html`, "templates");
        el.innerHTML = html;
      } catch (err) {
        console.warn(`⚠️ Failed to load template "${name}":`, err.message);
      }
    }
  },

  // === Activation of inline and external <script> tags ===
  activateScripts(container) {
    const scripts = container.querySelectorAll("script");
    scripts.forEach((oldScript) => {
      const newScript = document.createElement("script");
      if (oldScript.src) newScript.src = oldScript.src;
      else newScript.textContent = oldScript.textContent;
      document.body.appendChild(newScript);
      oldScript.remove();
    });
  },
  
  // === Loading the page with smooth animation ===
  async loadPage(page) {
    const content = document.getElementById("content");
    content.classList.remove("fade-in");
    content.classList.add("fade-out");

    try {
      const html = await this.loadHTML(`${page}.html`, "pages");

      setTimeout(() => {
        content.innerHTML = html;
        this.activateScripts(content);
        content.classList.remove("fade-out");
        content.classList.add("fade-in");
      }, 200);
    } catch (err) {
      content.innerHTML = `<h2>Error</h2><p>${err.message}</p>`;
    }
  },

  // === Update sidebar with child page links ===
  updateSidebar(topic) {
    const sidebar = document.getElementById('sidebar');
    const topicData = this.navigation[topic];
    
    if (topicData && topicData.children.length > 0) {
      let sidebarHTML = '<aside><h3>' + topic.charAt(0).toUpperCase() + topic.slice(1) + ' Menu</h3><ul>';
      topicData.children.forEach(child => {
        sidebarHTML += `<li><a href="#${child.page}">${child.title}</a></li>`;
      });
      sidebarHTML += '</ul></aside>';
      sidebar.innerHTML = sidebarHTML;
    } else {
      sidebar.innerHTML = ''; // Clear sidebar if no children
    }
  },

  // === Hash-based routing ===
  router() {
    const hash = window.location.hash.slice(1) || "home";
    const topic = hash.split('-')[0];

    this.loadPage(hash);
    this.updateSidebar(topic);

    // === Highlighting the active menu item ===
    const links = document.querySelectorAll("nav a, #sidebar a");
    links.forEach(link => {
      link.classList.remove("active");
      if (link.getAttribute("href") === `#${hash}`) {
        link.classList.add("active");
      }
    });
    
    // Highlight parent topic in header
    const navLinks = document.querySelectorAll("nav a");
    navLinks.forEach(link => {
        const linkTopic = link.getAttribute('href').slice(1);
        if(linkTopic === topic) {
            link.classList.add('active');
        }
    });
  },

  // === SPA Initialization ===
  async init() {
    await this.loadTemplates(["header", "footer"]);
    this.router();
    window.addEventListener("hashchange", () => this.router());
  },
};

window.addEventListener("load", () => SPA.init());
