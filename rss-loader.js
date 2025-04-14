
// js/rss-loader.js
const idiomaActual = localStorage.getItem("idioma") || "es";
async function cargarNoticias() {
  const contenedor = document.getElementById("noticias");
  contenedor.innerHTML = "";
  const fuentes = {
    es: ["https://feeds.elpais.com/mrss-s/pages/ep/site/elpais.com/section/internacional/rss.xml"],
    en: ["https://rss.nytimes.com/services/xml/rss/nyt/World.xml"]
  };
  for (let url of fuentes[idiomaActual]) {
    try {
      const res = await fetch(`https://api.rss2json.io/v1/api.json?rss_url=${encodeURIComponent(url)}`);
      const data = await res.json();
      data.items.slice(0, 4).forEach(item => {
        const card = document.createElement("article");
        card.className = "news-card";
        const img = item.enclosure?.link || item.thumbnail || "https://via.placeholder.com/300x180?text=OrbitaNews";
        card.innerHTML = \`
          <a href="\${item.link}" target="_blank">
            <div class="news-image"><img src="\${img}" alt="\${item.title}" /></div>
            <div class="news-content">
              <h3>\${item.title}</h3>
              <p>\${item.description?.slice(0, 100) || ''}...</p>
            </div>
          </a>\`;
        contenedor.appendChild(card);
      });
    } catch (e) {
      console.error("Error cargando fuente:", url, e);
    }
  }
}
function cambiarIdioma(nuevoIdioma) {
  localStorage.setItem("idioma", nuevoIdioma);
  location.reload();
}
document.addEventListener("DOMContentLoaded", () => {
  document.getElementById("selector-idioma").addEventListener("change", e => cambiarIdioma(e.target.value));
  cargarNoticias();
});
