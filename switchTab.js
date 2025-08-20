function switchTab(id){
  document.querySelectorAll('.tab').forEach(t=>t.classList.toggle('active', t.dataset.target===id));
  document.querySelectorAll('.panel').forEach(p=>p.classList.toggle('active', p.id===id));
}
document.addEventListener('DOMContentLoaded',()=>{ switchTab('paige'); });