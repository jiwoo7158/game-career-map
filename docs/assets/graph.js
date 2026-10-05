(async () => {
  const { roles, relations } = await CareerMap.loadData();
  const svg = document.querySelector('#graphSvg');
  const info = document.querySelector('#graphInfo');
  const filter = document.querySelector('#relationFilter');
  const search = document.querySelector('#graphSearch');
  const relationList = document.querySelector('#relationList');
  const reset = document.querySelector('#resetGraph');
  const byId = new Map(roles.map(r => [r.id, r]));
  const typeSet = [...new Set(relations.map(r => r.type))].sort((a,b) => a.localeCompare(b,'ko'));
  typeSet.forEach(t => { const o = document.createElement('option'); o.value=t; o.textContent=t; filter.appendChild(o); });

  const width = 1200, height = 760, cx = width/2, cy = height/2;
  const groups = [...new Set(roles.map(r => r.domain))];
  const groupAngle = new Map(groups.map((g,i) => [g, (Math.PI*2*i/groups.length)-Math.PI/2]));
  const groupMembers = new Map(groups.map(g => [g, roles.filter(r => r.domain === g)]));
  const positions = new Map();
  groups.forEach(g => {
    const members = groupMembers.get(g);
    const a = groupAngle.get(g);
    const gcx = cx + Math.cos(a)*300;
    const gcy = cy + Math.sin(a)*245;
    members.forEach((r,i) => {
      const localA = (Math.PI*2*i/Math.max(members.length,1)) + a;
      const radius = members.length > 1 ? 72 : 0;
      positions.set(r.id, {x: gcx + Math.cos(localA)*radius, y: gcy + Math.sin(localA)*radius});
    });
  });

  // light-weight relaxation: preserves domain clusters while reducing collisions.
  for (let step=0; step<120; step++) {
    const delta = new Map(roles.map(r => [r.id,{x:0,y:0}]));
    for (let i=0;i<roles.length;i++) for (let j=i+1;j<roles.length;j++) {
      const a=positions.get(roles[i].id), b=positions.get(roles[j].id); let dx=a.x-b.x, dy=a.y-b.y; let d2=dx*dx+dy*dy;
      if (d2<1) d2=1; const d=Math.sqrt(d2); const min=106;
      if (d<min) { const f=(min-d)*0.018; delta.get(roles[i].id).x += dx/d*f; delta.get(roles[i].id).y += dy/d*f; delta.get(roles[j].id).x -= dx/d*f; delta.get(roles[j].id).y -= dy/d*f; }
    }
    relations.forEach(rel => {
      const a=positions.get(rel.source), b=positions.get(rel.target); const dx=b.x-a.x, dy=b.y-a.y; const d=Math.max(1,Math.sqrt(dx*dx+dy*dy)); const desired=230; const f=(d-desired)*0.0007*rel.weight;
      delta.get(rel.source).x += dx/d*f; delta.get(rel.source).y += dy/d*f; delta.get(rel.target).x -= dx/d*f; delta.get(rel.target).y -= dy/d*f;
    });
    roles.forEach(r => { const p=positions.get(r.id), d=delta.get(r.id); p.x=Math.max(85,Math.min(width-85,p.x+d.x)); p.y=Math.max(70,Math.min(height-70,p.y+d.y)); });
  }

  const ns='http://www.w3.org/2000/svg';
  const edgeLayer=document.createElementNS(ns,'g'); const nodeLayer=document.createElementNS(ns,'g'); svg.append(edgeLayer,nodeLayer);
  const edgeEls=[]; const nodeEls=new Map();
  let selectedRole = new URLSearchParams(location.search).get('role');
  if (!byId.has(selectedRole)) selectedRole=null;
  let selectedEdge=null;

  relations.forEach((rel, idx) => {
    const a=positions.get(rel.source), b=positions.get(rel.target);
    const line=document.createElementNS(ns,'line'); line.setAttribute('x1',a.x); line.setAttribute('y1',a.y); line.setAttribute('x2',b.x); line.setAttribute('y2',b.y); line.setAttribute('class','graph-edge'); line.setAttribute('stroke-width', String(1 + rel.weight*0.8));
    line.dataset.index=idx; line.addEventListener('click',e=>{ e.stopPropagation(); selectedEdge=idx; selectedRole=null; update(); showEdge(rel); }); edgeLayer.appendChild(line); edgeEls.push(line);
  });
  roles.forEach(role => {
    const p=positions.get(role.id), g=document.createElementNS(ns,'g'); g.setAttribute('class','graph-node'); g.setAttribute('transform',`translate(${p.x},${p.y})`); g.dataset.id=role.id;
    const circle=document.createElementNS(ns,'circle'); circle.setAttribute('r','33');
    const icon=document.createElementNS(ns,'text'); icon.setAttribute('y','-3'); icon.setAttribute('font-size','17'); icon.textContent=role.icon;
    const label=document.createElementNS(ns,'text'); label.setAttribute('y','18'); label.textContent=shortLabel(role.title);
    g.append(circle,icon,label);
    g.addEventListener('click', e => { e.stopPropagation(); if (selectedRole===role.id) { location.href=`./role.html?id=${encodeURIComponent(role.id)}`; return; } selectedRole=role.id; selectedEdge=null; update(); showRole(role); });
    nodeLayer.appendChild(g); nodeEls.set(role.id,g);
  });
  svg.addEventListener('click',()=>{ selectedRole=null; selectedEdge=null; update(); info.innerHTML='<h2>관계 설명</h2><p>직무 노드 또는 엣지를 선택하세요.</p>'; });

  function shortLabel(s) { return s.replace(' 프로그래머','').replace(' 디자이너','').replace(' 엔지니어','').slice(0,10); }
  function visibleRelations() { return relations.map((r,i)=>({...r,_i:i})).filter(r => filter.value==='all' || r.type===filter.value); }
  function update() {
    const visible = new Set(visibleRelations().map(r=>r._i));
    const q=CareerMap.normalize(search.value);
    edgeEls.forEach((el,i)=>{
      const rel=relations[i]; const typeVisible=visible.has(i); const linked=!selectedRole || rel.source===selectedRole || rel.target===selectedRole; const isActive=i===selectedEdge || (!!selectedRole && linked);
      el.style.display=typeVisible?'':'none'; el.classList.toggle('dim', typeVisible && !linked); el.classList.toggle('active', typeVisible && isActive);
    });
    nodeEls.forEach((el,id)=>{
      const role=byId.get(id); const linked = !selectedRole || id===selectedRole || relations.some((r,i)=>visible.has(i) && ((r.source===selectedRole&&r.target===id)||(r.target===selectedRole&&r.source===id)));
      el.classList.toggle('dim', !!selectedRole && !linked); el.classList.toggle('selected', id===selectedRole); el.classList.toggle('search-hit', !!q && CareerMap.normalize(role.title+' '+role.englishTitle).includes(q));
    });
    renderRelationList();
  }
  function showRole(role) {
    const connected=visibleRelations().filter(r=>r.source===role.id||r.target===role.id);
    info.innerHTML=`<h2>${CareerMap.escapeHtml(role.icon)} ${CareerMap.escapeHtml(role.title)}</h2><p>${CareerMap.escapeHtml(role.summary)}</p><p><a href="./role.html?id=${encodeURIComponent(role.id)}">직무 상세 보기 →</a></p><h3>직접 연결된 관계 ${connected.length}개</h3><ul>${connected.map(r=>{const other=byId.get(r.source===role.id?r.target:r.source); return `<li><strong>${CareerMap.escapeHtml(other.title)}</strong><br>${CareerMap.escapeHtml(r.label)} — ${CareerMap.escapeHtml(r.reason)}</li>`}).join('')}</ul>`;
  }
  function showEdge(rel) {
    const a=byId.get(rel.source), b=byId.get(rel.target);
    info.innerHTML=`<h2>${CareerMap.escapeHtml(rel.label)}</h2><p><strong>${CareerMap.escapeHtml(a.title)}</strong> ↔ <strong>${CareerMap.escapeHtml(b.title)}</strong></p><p><span class="tag">${CareerMap.escapeHtml(rel.type)}</span></p><p>${CareerMap.escapeHtml(rel.reason)}</p><p>시각 가중치: ${rel.weight}</p>`;
  }
  function renderRelationList() {
    let items=visibleRelations();
    if (selectedRole) items=items.filter(r=>r.source===selectedRole||r.target===selectedRole);
    relationList.innerHTML=items.map(r=>`<article class="relation-item"><span>${CareerMap.escapeHtml(r.type)}</span><strong>${CareerMap.escapeHtml(byId.get(r.source).title)} ↔ ${CareerMap.escapeHtml(byId.get(r.target).title)}</strong><p>${CareerMap.escapeHtml(r.label)} · ${CareerMap.escapeHtml(r.reason)}</p></article>`).join('') || '<div class="empty-state">표시할 관계가 없습니다.</div>';
  }
  filter.addEventListener('change',update); search.addEventListener('input',update); reset.addEventListener('click',()=>{selectedRole=null;selectedEdge=null;search.value='';filter.value='all';update();info.innerHTML='<h2>관계 설명</h2><p>직무 노드 또는 엣지를 선택하세요.</p>';});
  update(); if (selectedRole) showRole(byId.get(selectedRole));
})().catch(err => { document.querySelector('#graphInfo').innerHTML=`<h2>오류</h2><p>${CareerMap.escapeHtml(err.message)}</p>`; });
