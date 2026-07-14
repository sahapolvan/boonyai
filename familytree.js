/* FamilyTree JS Base Script */
(function(w, d) {
    w.FamilyTree = function(element, options) {
        this.element = element;
        this.options = options || {};
        this.load = function(data) {
            var html = '<div style="display:flex; flex-direction:column; align-items:center; padding:20px; gap:40px; font-family:sans-serif;">';
            var members = {}, generations = {};
            data.forEach(function(m) { members[m.id] = m; m.children = []; });
            data.forEach(function(m) {
                if (m.fid && members[m.fid]) members[m.fid].children.push(m.id);
                if (m.mid && members[m.mid]) members[m.mid].children.push(m.id);
            });
            var buildGen = function(id, level) {
                if (!generations[level]) generations[level] = [];
                if (generations[level].findIndex(x => x.id === id) === -1) {
                    generations[level].push(members[id]);
                }
                if (members[id].pids) {
                    members[id].pids.forEach(pId => {
                        if (members[pId] && generations[level].findIndex(x => x.id === pId) === -1) {
                            generations[level].push(members[pId]);
                        }
                    });
                }
                members[id].children.forEach(cId => buildGen(cId, level + 1));
            };
            var roots = data.filter(m => !m.fid && !m.mid);
            if(roots.length > 0) buildGen(roots[0].id, 0);
            
            Object.keys(generations).sort((a,b)=>a-b).forEach(function(g) {
                html += '<div style="display:flex; justify-content:center; gap:30px; flex-wrap:wrap; border-bottom:2px dashed #ccc; padding-bottom:20px; width:100%;">';
                generations[g].forEach(function(m) {
                    var color = m.gender === 'male' ? '#ebf8ff' : '#fff5f5';
                    var border = m.gender === 'male' ? '#3182ce' : '#e53e3e';
                    html += '<div style="background:'+color+'; border:2px solid '+border+'; padding:15px 25px; border-radius:8px; text-align:center; box-shadow:0 4px 6px rgba(0,0,0,0.05); min-width:120px;">';
                    html += '<div style="font-weight:bold; font-size:16px; color:#2d3748;">' + m.name + '</div>';
                    if(m.title) html += '<div style="font-size:12px; color:#718096; margin-top:5px;">' + m.title + '</div>';
                    html += '</div>';
                });
                html += '</div>';
            });
            html += '</div>';
            this.element.innerHTML = html;
        };
    };
})(window, document);

