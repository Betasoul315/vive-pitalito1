
(function(){
  const mapEl=document.getElementById("map");
  if(!mapEl) return;
  // Pitalito municipal-area reference. Exact experience coordinates are intentionally
  // not fabricated; they will be added after verification.
  const map=L.map("map").setView([1.8538,-76.0507],13);
  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",{
    maxZoom:19,
    attribution:'&copy; OpenStreetMap contributors'
  }).addTo(map);
  L.marker([1.8538,-76.0507]).addTo(map)
    .bindPopup("<strong>Vive Pitalito</strong><br>Pitalito, Huila");
})();
