(async () => {
  const { roles, relations } = await CareerMap.loadData();
  const params = new URLSearchParams(location.search);
  const id = params.get('id');
  const role = roles.find(r => r.id === id);
  const root = document.querySelector('#roleDetail');
  if (!role) {
    document.title = '직무를 찾을 수 없음 · 게임 개발 직무 지식 지도';
    root.innerHTML = `<div class="empty-state"><h1>직무를 찾을 수 없습니다.</h1><a class="button" href="./index.html">직무 목록으로 돌아가기</a></div>`;
    return;
  }
  document.title = `${role.title} · 게임 개발 직무 지식 지도`;
  const byId = new Map(roles.map(r => [r.id, r]));
  const connected = relations.filter(x => x.source === role.id || x.target === role.id);

  const relatedHtml = connected.map(rel => {
    const otherId = rel.source === role.id ? rel.target : rel.source;
    const other = byId.get(otherId);
    if (!other) return '';
    return `<a class="related-card" href="./role.html?id=${encodeURIComponent(other.id)}"><strong>${CareerMap.escapeHtml(other.icon)} ${CareerMap.escapeHtml(other.title)}</strong><span>${CareerMap.escapeHtml(rel.label)} · ${CareerMap.escapeHtml(rel.reason)}</span></a>`;
  }).join('');

  root.innerHTML = `
    <section class="detail-hero">
      <div>
        <div class="role-domain">${CareerMap.escapeHtml(role.domain)}</div>
        <h1>${CareerMap.escapeHtml(role.title)}</h1>
        <p class="english-title">${CareerMap.escapeHtml(role.englishTitle)}</p>
        <p class="detail-summary">${CareerMap.escapeHtml(role.summary)}</p>
        <div class="detail-actions"><a class="button" href="./index.html">← 직무 목록</a><a class="button primary" href="./graph.html?role=${encodeURIComponent(role.id)}">그래프에서 보기</a></div>
      </div>
      <div class="detail-icon" aria-hidden="true">${CareerMap.escapeHtml(role.icon)}</div>
    </section>

    <section class="detail-section"><h2>주로 하는 일</h2><ul class="clean-list">${role.responsibilities.map(x => `<li>${CareerMap.escapeHtml(x)}</li>`).join('')}</ul></section>

    <section class="detail-section"><h2>필요한 기술·능력·지식</h2><p>초기 직무 정의에서 정리한 항목을 빠짐없이 유지합니다.</p><div class="skill-grid">${role.skills.map(x => `<div class="skill-item">${CareerMap.escapeHtml(x)}</div>`).join('')}</div></section>

    <section class="detail-section"><h2>알아야 하는 지식 영역</h2><div class="knowledge-grid">${role.knowledgeAreas.map(area => `<article class="knowledge-card"><h3>${CareerMap.escapeHtml(area.name)}</h3><ul>${area.topics.map(x => `<li>${CareerMap.escapeHtml(x)}</li>`).join('')}</ul></article>`).join('')}</div></section>

    <section class="detail-section"><h2>대표 산출물</h2><div class="output-grid">${role.outputs.map(x => `<div class="output-item">${CareerMap.escapeHtml(x)}</div>`).join('')}</div></section>

    <section class="detail-section"><h2>직접 연결된 직무</h2><p>${connected.length}개의 협업 관계가 등록되어 있습니다.</p><div class="related-grid">${relatedHtml || '<div class="empty-state">등록된 관계가 없습니다.</div>'}</div></section>`;
})().catch(err => {
  document.querySelector('#roleDetail').innerHTML = `<div class="empty-state">${CareerMap.escapeHtml(err.message)}</div>`;
});
