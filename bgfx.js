// Background: Gradient Flow + Particles (brightness by influence)
(function(){
  const canvas = document.getElementById('bgfx');
  if(!canvas) return;
  const ctx = canvas.getContext('2d');
  let raf = null, dpr = 1, W = 0, H = 0, mouse = {x:0,y:0}, scrollFactor = 1, particles = [];

  function resize(){
    dpr = Math.max(1, window.devicePixelRatio||1);
    W = canvas.clientWidth; H = canvas.clientHeight;
    canvas.width = Math.floor(W*dpr); canvas.height = Math.floor(H*dpr);
    ctx.setTransform(dpr,0,0,dpr,0,0);
    initParticles();
  }
  function initParticles(){
    const count = Math.max(40, Math.floor((W*H)/26000));
    particles = Array.from({length: count}, ()=>({
      x: Math.random()*W,
      y: Math.random()*H,
      vx: (Math.random()-.5)*0.25,
      vy: (Math.random()-.5)*0.25,
      r: 1 + Math.random()*1.6
    }));
  }
  function draw(){
    ctx.clearRect(0,0,W,H);

    // 1) Update particle physics & positions
    for(const p of particles){
      const dx = mouse.x - p.x, dy = mouse.y - p.y;
      const dist = Math.hypot(dx,dy) + 0.001;
      const influence = Math.max(0, 280 - dist)/280; // 0..1
      if(dist < 20) {
        //Accelerate close particles and don't pull them back while close.
        if (Math.sign(dx) !== 0 && Math.sign(dx) === Math.sign(p.vx)) {
          p.vx += (dx/dist) * influence * 0.25;
        }
        if (Math.sign(dy) !== 0 && Math.sign(dy) === Math.sign(p.vy)) {
          p.vy += (dy/dist) * influence * 0.25;
        }
      } else{
        p.vx += (dx/dist) * influence * 0.05;
        p.vy += (dy/dist) * influence * 0.05;
      }
      p.vx *= 0.986; p.vy *= 0.986;
      p.x += (p.vx + 0.018*scrollFactor);
      p.y += (p.vy + 0.004*scrollFactor);
      if(p.x < -10) p.x = W+10; if(p.x > W+10) p.x = -10;
      if(p.y < -10) p.y = H+10; if(p.y > H+10) p.y = -10;
      p._influence = influence;
      p._distToMouse = dist;
    }

    // 2) Draw connections: connect each particle to its 3 nearest neighbors with 1px lines
    ctx.lineWidth = 1;
    const maxConnectDist = 160; // cutoff for visibility
    for(let i = 0; i < particles.length; i++){
      const p = particles[i];
      // build small array of distances to others
      const dists = [];
      for(let j = 0; j < particles.length; j++){
        if(i === j) continue;
        const q = particles[j];
        const dx = q.x - p.x, dy = q.y - p.y;
        const dist = Math.hypot(dx,dy);
        dists.push({idx: j, dist});
      }
      // find 3 nearest (partial sort by sort is fine)
      dists.sort((a,b)=>a.dist-b.dist);
      const maxNeighbors = 3;
      for(let k = 0; k < maxNeighbors && k < dists.length; k++){
        const n = dists[k];
        if(n.dist > maxConnectDist) break;
        const q = particles[n.idx];
        // alpha fades with distance
        const alpha = 0.18 * (1 - (n.dist / maxConnectDist));
        ctx.strokeStyle = `rgba(255,255,255,${alpha.toFixed(3)})`;
        ctx.beginPath();
        ctx.moveTo(p.x, p.y);
        ctx.lineTo(q.x, q.y);
        ctx.stroke();
      }
    }

    // 3) Draw particles on top
    for(const p of particles){
      const influence = p._influence || 0;
      const alpha = 0.05 + (1 - (1 - influence ** 8)) * 0.4;   // brightness by influence
      const radius = p.r * (1 + (1 - (1 - influence ** 4)) * 0.6);
      ctx.fillStyle = `rgba(255,255,255,${alpha.toFixed(3)})`;
      ctx.beginPath(); ctx.arc(p.x, p.y, radius, 0, Math.PI*2); ctx.fill();
    }

    raf = requestAnimationFrame(draw);
  }
  function enable(){
    document.body.classList.add('anim-gradient');
    if(raf) cancelAnimationFrame(raf);
    resize();
    draw();
  }
  function disable(){
    document.body.classList.remove('anim-gradient');
    if(raf) cancelAnimationFrame(raf);
    ctx.clearRect(0,0,W,H);
  }
  window.addEventListener('resize', resize);
  window.addEventListener('mousemove', e=>{ const r = canvas.getBoundingClientRect(); mouse.x = e.clientX - r.left; mouse.y = e.clientY - r.top; });
  window.addEventListener('scroll', ()=>{ scrollFactor = 1 + Math.min(1.2, window.scrollY/1000); });
  enable();
})();