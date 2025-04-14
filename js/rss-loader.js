
const idiomaActual = localStorage.getItem("idioma") || "es";

async function cargarNoticias() {
  const contenedor = document.getElementById("noticias");
  contenedor.innerHTML = "";

  const fuentesPorIdioma = {
    es: [
      {
        categoria: "Noticias España",
        urls: [
          "https://feeds.elpais.com/mrss-s/pages/ep/site/elpais.com/section/espana/rss.xml"
        ]
      }
    ],
    en: [
      {
        categoria: "World News",
        urls: [
          "https://feeds.bbci.co.uk/news/world/rss.xml"
        ]
      }
    ]
  };

  for (let seccion of fuentesPorIdioma[idiomaActual]) {
    const titulo = document.createElement("h2");
    titulo.textContent = seccion.categoria;
    contenedor.appendChild(titulo);

    for (let url of seccion.urls) {
      try {
        const response = await fetch(`https://api.rss2json.io/v1/api.json?rss_url=${encodeURIComponent(url)}`);
        const data = await response.json();
        if (!data.items) continue;

        data.items.slice(0, 3).forEach(item => {
          const noticia = document.createElement("div");
          noticia.innerHTML = `<h3><a href="${item.link}" target="_blank">${item.title}</a></h3><p>${item.description}</p>`;
          contenedor.appendChild(noticia);
        });
      } catch (error) {
        console.error("Error al cargar RSS:", error);
      }
    }
  }
}

function cambiarIdioma(nuevoIdioma) {
  localStorage.setItem("idioma", nuevoIdioma);
  location.reload();
}

document.addEventListener("DOMContentLoaded", () => {
  document.getElementById("selector-idioma")?.addEventListener("change", e => cambiarIdioma(e.target.value));
  cargarNoticias();
});
