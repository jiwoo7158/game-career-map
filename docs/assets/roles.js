(async () => {
  const { roles, relations } = await CareerMap.loadData();
  const grid = document.querySelector('#roleGrid');
  const filtersEl = document.querySelector('#domainFilters');
  const searchInput = document.querySelector('#searchInput');
  const roleCount = document.querySelector('#roleCount');
  const emptyState = document.querySelector('#emptyState');
  const stats = document.querySelector('#stats');
  const domains = [...new Set(roles.map(r => r.domain))];
  let selectedDomain = '전체';

  stats.innerHTML = `
    <div class="stat"><strong>${roles.length}</strong><span>세부 직무</span></div>
    <div class="stat"><strong>${domains.length}</strong><span>분야</span></div>
    <div class="stat"><strong>${relations.length}</strong><span>협업 관계</span></div>`;

  const buttons = ['전체', ...domains].map(domain => {
    const b = document.createElement('button');
    b.className = 'filter-button' + (domain === '전체' ? ' active' : '');
    b.type = 'button'; b.textContent = domain;
    b.addEventListener('click', () => {
      selectedDomain = domain;
      [...filtersEl.children].forEach(x => x.classList.toggle('active', x === b));
      render();
    });
    return b;
  });
  buttons.forEach(b => filtersEl.appendChild(b));

  function roleSearchText(role) {
    return CareerMap.normalize([
      role.title, role.englishTitle, role.domain, role.summary,
      ...role.responsibilities, ...role.skills,
      ...role.knowledgeAreas.flatMap(a => [a.name, ...a.topics]),
      ...role.outputs
    ].join(' '));
  }

  function render() {
    const q = CareerMap.normalize(searchInput.value);
    const filtered = roles.filter(role => {
      const domainOk = selectedDomain === '전체' || role.domain === selectedDomain;
      const searchOk = !q || roleSearchText(role).includes(q);
      return domainOk && searchOk;
    });
    roleCount.textContent = `${filtered.length} / ${roles.length}개 직무`;
    emptyState.hidden = filtered.length !== 0;
    grid.innerHTML = filtered.map(role => `
      <a class="role-card" href="./role.html?id=${encodeURIComponent(role.id)}">
        <span class="role-icon" aria-hidden="true">${CareerMap.escapeHtml(role.icon)}</span>
        <div class="role-domain">${CareerMap.escapeHtml(role.domain)}</div>
        <h3>${CareerMap.escapeHtml(role.title)}</h3>
        <p>${CareerMap.escapeHtml(role.summary)}</p>
        <div class="role-tags">${role.skills.slice(0,3).map(x => `<span class="tag">${CareerMap.escapeHtml(x)}</span>`).join('')}</div>
      </a>`).join('');
  }
  searchInput.addEventListener('input', render);
  render();
})().catch(err => {
  document.querySelector('#roleGrid').innerHTML = `<div class="empty-state">${CareerMap.escapeHtml(err.message)}</div>`;
});
