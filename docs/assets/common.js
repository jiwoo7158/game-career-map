window.CareerMap = {
  async loadData() {
    const [rolesRes, relationsRes] = await Promise.all([
      fetch('./data/roles.json'),
      fetch('./data/relations.json')
    ]);
    if (!rolesRes.ok || !relationsRes.ok) throw new Error('데이터를 불러오지 못했습니다.');
    const rolesData = await rolesRes.json();
    const relationsData = await relationsRes.json();
    return { roles: rolesData.roles, relations: relationsData.relations };
  },
  normalize(value) {
    return String(value ?? '').toLocaleLowerCase('ko-KR').replace(/\s+/g, ' ').trim();
  },
  escapeHtml(value) {
    return String(value ?? '')
      .replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;')
      .replaceAll('"','&quot;').replaceAll("'",'&#039;');
  }
};
