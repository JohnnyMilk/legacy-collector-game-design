import json, re
from pathlib import Path

root = Path('.')
stamp = '20260829-0825'
classes_path = root / 'data/classes.json'
old_text = classes_path.read_text(encoding='utf-8')
old = json.loads(old_text)
if old.get('version') != 58:
    raise RuntimeError(f'expected classes v58, got {old.get("version")}')

(root / 'archive').mkdir(exist_ok=True)
(root / 'docs/archive').mkdir(parents=True, exist_ok=True)
(root / 'archive/tier3-16-class-version.json').write_text(old_text, encoding='utf-8')
(root / 'docs/archive/tier3-16-class-version.md').write_text('''# Tier 3 16 職業配置｜舊版 / 已取消

> ARCHIVED / CANCELLED：此頁保留 2026-08-28 的 Tier 3 16 節點版本，只作歷史參考，不得覆蓋現行 8 職業規格。

舊版 Tier 3 使用 22.5° 間距，共 16 個外圈節點。後續設計發現職業數量過多、部分定位重疊，因此改為 8 個高辨識度 Tier 3：4 個單系核心 + 4 個跨系職業。

舊版完整資料快照：`archive/tier3-16-class-version.json`。

## 舊版 16 個 Tier 3

戰地調律師、軍團守衛、血煉騎士、戰將、獵刃武者、斷罪士、夜獵手、幻行師、影刃術士、空間魔導士、刻刃術師、咒縛師、聖咒術師、戰場賢者、聖歌咒師、調律賢者。

## 取消原因

現行 Tier 3 改為每 45° 一個節點，保留真正具有獨立職業幻想與玩法核心的職業。被取消的職業與技能設計仍保留在 JSON 快照供未來擴充參考，但不屬於現行職業樹。
''', encoding='utf-8')

data = old
data['version'] = 59
data['tier3StructureRule'] = {
    'totalClasses': 8,
    'angleStep': 45,
    'singleSectorCoreCount': 4,
    'dualSectorBoundaryCount': 4,
    'dualSectorCountsForAllListedSectors': True,
    'partySectorCountMinimum': 4,
    'partySectorCountMaximum': 8,
    'description': 'Tier 3 由 4 個單系核心職業與 4 個跨系職業構成；跨系職業同時屬於兩個職業系，隊伍職業系計數時兩系都各計 1。'
}
keep = ['tier3_warfront_guardian','tier3_bloodforged_knight','tier3_headhunter','tier3_swift_shadow','tier3_shadowblade_occultist','tier3_phantom_blade_magister','tier3_hexmark_magister']
obsolete = [c['id'] for c in data['classes'] if c.get('tier') == 3 and c['id'] not in keep]
for cid in obsolete:
    data.get('classDesigns', {}).pop(cid, None)
    data.get('tier3InspirationLinks', {}).pop(cid, None)
data['classes'] = [c for c in data['classes'] if c.get('tier') != 3 or c['id'] in keep]

cfg = {
    'tier3_warfront_guardian': (-135, ['support','warrior'], '支援 × 戰士', ['tier2_cleric','tier2_bard','tier2_alchemist','tier2_knight']),
    'tier3_bloodforged_knight': (-90, ['warrior'], '戰士', ['tier2_knight','tier2_berserker','tier2_samurai']),
    'tier3_headhunter': (-45, ['warrior','agile'], '戰士 × 敏捷', ['tier2_berserker','tier2_samurai','tier2_ranger','tier2_assassin']),
    'tier3_swift_shadow': (0, ['agile'], '敏捷', ['tier2_ranger','tier2_assassin','tier2_blade_dancer']),
    'tier3_shadowblade_occultist': (45, ['agile','magic'], '敏捷 × 魔法', ['tier2_assassin','tier2_blade_dancer','tier2_spellblade','tier2_wizard']),
    'tier3_phantom_blade_magister': (90, ['magic'], '魔法', ['tier2_spellblade','tier2_wizard','tier2_occultist']),
    'tier3_hexmark_magister': (135, ['magic','support'], '魔法 × 支援', ['tier2_wizard','tier2_occultist','tier2_cleric','tier2_bard'])
}
for c in data['classes']:
    if c['id'] in cfg:
        angle, sectors, label, links = cfg[c['id']]
        c['angle'] = angle
        c['sectors'] = sectors
        c['sector'] = sectors[-1] if len(sectors) > 1 else sectors[0]
        c['sectorLabel'] = label
        c['conceptStatus'] = 'confirmed'
        c['hidden'] = False
        data['tier3InspirationLinks'][c['id']] = links
    elif c.get('tier') in (1,2):
        c['sectors'] = [c['sector']]

sid = 'tier3_sacred_arbiter'
data['classes'].append({
    'id': sid, 'name': '聖律師', 'tier': 3, 'sector': 'support', 'sectors': ['support'], 'sectorLabel': '支援', 'angle': 180,
    'role': '生命維持／全體淨化／自我復甦',
    'trait': '以近戰聖療維持隊友生命、以聖域重整清除全隊負面狀態，並以不滅聖契在死亡時自我復甦。',
    'hidden': False, 'conceptStatus': 'confirmed'
})
data['tier3InspirationLinks'][sid] = ['tier2_cleric','tier2_bard','tier2_alchemist']
data['classDesigns'][sid] = {
    'status': 'confirmed', 'exclusiveAbilityPattern': 'one-active-one-passive',
    'basicAttack': {'name':'聖療','range':1,'damageType':'healing','attackStyle':'melee-support','effect':'指定相鄰 1 格的友方單位（不可指定自己）作為一般攻擊目標；不造成傷害，改為恢復等同於該次一般攻擊原應造成數值的 HP。'},
    'activeSkill': {'name':'聖域重整','maxCharges':3,'effect':'不需指定單一目標；立即解除所有存活我方單位（包含自身）身上的所有負面狀態。不額外治療，也不提供攻擊或防禦增益。'},
    'passiveSkill': {'name':'不滅聖契','effect':'自身死亡時立即觸發，改以最大 HP 的 25% 復活；每場戰鬥最多觸發 1 次。死亡與 Party Wipe 判定必須在此類復活效果結算後才進行。'},
    'masteryChecklist': [
        {'id':'sacred_arbiter_cleanse_three_allies','archiveMetric':'sacred-arbiter-cleanse-three-allies-events','category':'active-skill','description':'單次使用「聖域重整」解除至少 3 個友方單位身上的負面狀態','target':15,'unit':'次'},
        {'id':'sacred_arbiter_revival','archiveMetric':'sacred-arbiter-revival-events','category':'passive-skill','description':'觸發「不滅聖契」並以最大 HP 25% 復活','target':10,'unit':'次'}
    ]
}
req = {
    'warrior':['tier3_warfront_guardian','tier3_bloodforged_knight','tier3_headhunter'],
    'agile':['tier3_headhunter','tier3_swift_shadow','tier3_shadowblade_occultist'],
    'magic':['tier3_shadowblade_occultist','tier3_phantom_blade_magister','tier3_hexmark_magister'],
    'support':['tier3_hexmark_magister',sid,'tier3_warfront_guardian']
}
for m in data.get('memoryForms', []):
    m['requiredTier3Ids'] = req[m['sector']]
data['memoryAwakeningRule']['sectorTier3RequirementIncludesDualSectorClasses'] = True
data['memoryAwakeningRule']['description'] = '對應原始職業系的核心 Tier 3，以及所有包含該系的跨系 Tier 3，都必須完成 Mastery；之後在 Region 4 可選神殿首次覺醒。'
data['partyCompositionRule']['dualSectorClassesCountForBoth'] = True
data['partyCompositionRule']['sectorCountRangePerFourCharacterParty'] = '4-8'
data['partyCompositionRule']['description'] = '單系職業貢獻 1 個 sector count；雙系 Tier 3 同時對兩個職業系各貢獻 1，因此四人隊伍總 sector count 介於 4～8。'
classes_path.write_text(json.dumps(data, ensure_ascii=False, indent=2) + '\n', encoding='utf-8')

def W(path, text):
    (root / path).write_text(text, encoding='utf-8')

W('docs/systems/class-system.md', '''# LEGACY COLLECTOR｜職業系統

## 現行結構

一般職業樹維持 Tier 0～Tier 3；四名主角的「XXX 的記憶」位於 Tier 圈之外，不是 Tier 4。

Tier 1 / Tier 2 都是單系職業。Tier 3 現行固定為 **8 個**：4 個單系核心 + 4 個跨系職業，每 45° 一個節點。

- -135° 軍團守衛：支援 × 戰士
- -90° 血煉騎士：戰士
- -45° 斷罪士：戰士 × 敏捷
- 0° 幻行師：敏捷
- 45° 影刃術士：敏捷 × 魔法
- 90° 空間魔導士：魔法
- 135° 咒縛師：魔法 × 支援
- 180° 聖律師：支援

雙系 Tier 3 同時屬於兩個職業系，不需要二選一。

## Inspiration Links

- 軍團守衛：神官、吟遊詩人、煉金術士、騎士。
- 血煉騎士：騎士、狂戰士、武士。
- 斷罪士：狂戰士、武士、遊俠、刺客。
- 幻行師：遊俠、刺客、舞刃者。
- 影刃術士：刺客、舞刃者、魔劍士、巫師。
- 空間魔導士：魔劍士、巫師、咒術師。
- 咒縛師：巫師、咒術師、神官、吟遊詩人。
- 聖律師：神官、吟遊詩人、煉金術士。

Tier 2 → Tier 3 的 Inspiration Links 同時代表解鎖前置與完整技能繼承來源，不是一般可逆轉職路徑。

## 角色記憶要求

「完成對應職業系全部 Tier 3 Mastery」包含單系核心，也包含所有涵蓋該系的雙系 Tier 3：

- 戰士：軍團守衛、血煉騎士、斷罪士。
- 敏捷：斷罪士、幻行師、影刃術士。
- 魔法：影刃術士、空間魔導士、咒縛師。
- 支援：咒縛師、聖律師、軍團守衛。

Tier 3 在正式遊戲第一次解鎖前保持隱藏；Prototype 可提前顯示完整外圈。舊 16 節點版本已移至「舊版 / 已取消」。
''')

p = root/'docs/systems/mastery-system.md'; t = p.read_text(encoding='utf-8')
t = re.sub(r'- \*\*Tier 3\*\*：.*?\n', '- **Tier 3**：現行固定為 8 個隱藏高階職業（4 個單系核心 + 4 個跨系）。Tier 3 完整繼承 Inspiration Links 對應 Tier 2 與祖先技能，再取得自己的專屬能力；專屬能力組合不強制固定格式。\n', t)
W('docs/systems/mastery-system.md', t)

p = root/'docs/systems/skill-system.md'; t = p.read_text(encoding='utf-8')
t = t.replace('例如戰將的「橫掃」雖然仍是一般攻擊，但會同時攻擊左前方、正前方、右前方 3 格；這不視為額外被動技能。','例如軍團守衛的「戰槍」會攻擊前方直線 2 格；一般攻擊形狀由各職業自行定義。')
t = re.sub(r'- 戰將是第一個正式例外：.*?\n','- 空間魔導士是現行正式例外之一：使用 2 個 Tier 3 專屬主動技能、沒有額外 Tier 3 專屬被動；合法繼承技能仍全部保留。\n', t)
t = t.replace('戰將因沒有新增 Tier 3 專屬主動，所以不存在額外的 3 Charge 技能。','若個別 Tier 3 沒有新增專屬主動，就不會因此額外取得 3 Charge 技能。')
t = t.replace('Tier 3 的 16 個職業節點目前先建立暫定名稱、職業定位與 Inspiration Links；後續逐職業設計時，依該職業玩法決定專屬能力組合，並使用完全職業專屬的 Mastery。','Tier 3 現行固定為 8 個職業節點，8 個職業皆已完成一般攻擊、專屬能力與 Mastery 設計。')
W('docs/systems/skill-system.md', t)

p = root/'docs/overview/design-philosophy.md'; t = p.read_text(encoding='utf-8')
t = t.replace('職業特性只是定位說明，不是技能。每個一般正式職業自身只提供 1 個主動技能與 1 個被動技能；高 Tier 透過完整技能繼承自然形成複合玩法。','職業特性只是定位說明，不是技能。Tier 1 / Tier 2 自身固定提供 1 個主動技能與 1 個被動技能；Tier 3 專屬能力組合依職業特色彈性設計，高 Tier 再透過完整技能繼承形成複合玩法。')
t = t.replace('四名角色當前職業所屬職業系會形成隊伍職業組合，並在未來提供隊伍被動能力。','四名角色當前職業的 sectors 會形成隊伍職業組合。單系職業貢獻 1 count；雙系 Tier 3 對兩系各貢獻 1，因此四人隊伍總 count 可由 4 變化至 8。')
W('docs/overview/design-philosophy.md', t)

W('docs/systems/party-composition-system.md', '''# 隊伍職業組合系統（Party Composition System）

## Sector Count 規則

- 戰士、敏捷、魔法、支援是四個基礎職業系。
- 單系職業貢獻 **1 個 sector count**。
- 跨系 Tier 3 同時屬於兩系，**兩系都各計 1**，不需要選擇其中一系。
- 四名角色全部使用單系職業時，總共有 **4 count**。
- 四名角色全部使用雙系 Tier 3 時，最多有 **8 count**。
- 混合配置時總 count 介於 4～8。
- Count 是職業系貢獻數，不等於角色數。

例如軍團守衛同時提供支援 +1、戰士 +1；斷罪士同時提供戰士 +1、敏捷 +1。

判定依角色當前職業的 `sectors`，角色轉職後立即重新計算。

## 尚未定義

正式組合清單、被動名稱／效果／數值、不同 count 門檻、多個組合並存規則，以及角色記憶形態最後使用哪些 sectors，仍留待後續 Prototype。
''')
W('docs/systems/memory-awakening-system.md', '''# 角色記憶覺醒系統（Memory Awakening System）

四名主角各有一個唯一最終「XXX 的記憶」，不是 Tier 4，只允許對應角色本人使用。

## 解鎖條件

首次覺醒必須完成該角色原始職業系所涵蓋的**全部 Tier 3 Mastery**；這不只包含單系核心，也包含所有 `sectors` 中含有該系的跨系 Tier 3。

- 戰士：軍團守衛 + 血煉騎士 + 斷罪士。
- 敏捷：斷罪士 + 幻行師 + 影刃術士。
- 魔法：影刃術士 + 空間魔導士 + 咒縛師。
- 支援：咒縛師 + 聖律師 + 軍團守衛。

完成後仍必須在同一次 Run 實際進入 Region 4 的合法可選記憶神殿節點。首次成功覺醒後永久解鎖，後續 Run 可直接使用。

## 尚未定義

四名主角正式姓名／稱號、記憶技能與數值、記憶形態的 Party Composition sectors、神殿生成與演出。
''')

p = root/'docs/systems/character-system.md'; t = p.read_text(encoding='utf-8')
t = t.replace('單次遠征中，角色死亡後從行動順序移除，且無法參與後續戰鬥。四名角色全部死亡時，本次 Run 失敗。','角色 HP 降至 0 或以下時先結算所有合法死亡觸發／復活效果；成功復活則不視為正式死亡。只有復活結算後仍未復活才從行動順序移除。四名角色在復活結算後全部正式死亡時，本次 Run 才失敗。聖律師「不滅聖契」是目前正式案例。')
W('docs/systems/character-system.md', t)
p = root/'docs/systems/combat-system.md'; W('docs/systems/combat-system.md', p.read_text(encoding='utf-8').replace('5. 達成該戰鬥勝利條件，或隊伍全滅。','5. 單位 HP 歸零時先結算死亡觸發／復活；確認四名角色在復活結算後皆正式死亡，才判定隊伍全滅。'))
p = root/'docs/systems/expedition-system.md'; W('docs/systems/expedition-system.md', p.read_text(encoding='utf-8').replace('四名角色全部死亡時該 Run 失敗；敘事上視為本次輪迴失敗。','四名角色在所有合法死亡觸發／復活效果結算後仍全部正式死亡時，該 Run 才失敗；敘事上視為本次輪迴失敗。'))

for f in ['README.md','docs/overview/game-concept.md','docs/overview/gameplay-loop.md']:
    p = root/f; t = p.read_text(encoding='utf-8')
    t = t.replace('每個職業系的全部 Tier 3 Mastery 完成後','每個原始職業系的核心 Tier 3 與所有涵蓋該系的雙系 Tier 3 Mastery 完成後')
    t = t.replace('對應職業系全部 Tier 3 Mastery','對應原始職業系的核心 Tier 3 與所有涵蓋該系的雙系 Tier 3 Mastery')
    p.write_text(t, encoding='utf-8')

W('docs/development/gdd-review.md', '''# LEGACY COLLECTOR｜GDD Review

## 現行一致性基準

- Tier 3 現行固定 8 個，每 45° 一個節點：軍團守衛、血煉騎士、斷罪士、幻行師、影刃術士、空間魔導士、咒縛師、聖律師。
- 單系核心：血煉騎士（戰士）、幻行師（敏捷）、空間魔導士（魔法）、聖律師（支援）。
- 跨系：軍團守衛（支援×戰士）、斷罪士（戰士×敏捷）、影刃術士（敏捷×魔法）、咒縛師（魔法×支援）。
- 雙系 Tier 3 在 Party Composition 同時對兩系各貢獻 1 count；四名角色總 sector count 介於 4～8。
- 記憶覺醒需要原始職業系核心 Tier 3，加上所有涵蓋該系的雙系 Tier 3 Mastery。
- Tier 3 Mastery 只驗證自身 Tier 3 專屬能力；Tier 1 / Tier 2 規則維持不變。
- 死亡時先結算死亡觸發／復活；所有復活結算後仍全員正式死亡才 Party Wipe。

## Inspiration Links

- 軍團守衛：神官、吟遊詩人、煉金術士、騎士。
- 血煉騎士：騎士、狂戰士、武士。
- 斷罪士：狂戰士、武士、遊俠、刺客。
- 幻行師：遊俠、刺客、舞刃者。
- 影刃術士：刺客、舞刃者、魔劍士、巫師。
- 空間魔導士：魔劍士、巫師、咒術師。
- 咒縛師：巫師、咒術師、神官、吟遊詩人。
- 聖律師：神官、吟遊詩人、煉金術士。

## Memory Requirements

- 戰士：軍團守衛、血煉騎士、斷罪士。
- 敏捷：斷罪士、幻行師、影刃術士。
- 魔法：影刃術士、空間魔導士、咒縛師。
- 支援：咒縛師、聖律師、軍團守衛。

舊 16 節點版已封存於 `docs/archive/tier3-16-class-version.md` 與 `archive/tier3-16-class-version.json`。
''')
p = root/'docs/development/document-map.md'; t = p.read_text(encoding='utf-8')
t = t.replace('Relic／遺產系統、Reliquary／收藏館、Relic History、Legacy Trait、Relationship 等已取消設計只保留歷史參考。','Relic／遺產系統、Reliquary／收藏館、Relic History、Legacy Trait、Relationship，以及 Tier 3 舊 16 職業配置等已取消設計只保留歷史參考。\n\n- `docs/archive/tier3-16-class-version.md`：Tier 3 舊 16 節點說明。\n- `archive/tier3-16-class-version.json`：改版前完整 classes.json 快照。')
W('docs/development/document-map.md', t)

p = root/'index.html'; t = p.read_text(encoding='utf-8')
t = t.replace('<a class="status-progress" href="systems/class-system.html">職業系統</a>','<a class="status-confirmed" href="systems/class-system.html">職業系統</a>')
t = t.replace('<a class="status-progress" href="systems/mastery-system.html">職業熟練系統</a>','<a class="status-confirmed" href="systems/mastery-system.html">職業熟練系統</a>')
t = t.replace('<section class="group"><h2>舊版 / 已取消</h2>','<section class="group"><h2>舊版 / 已取消</h2><a href="development/tier3-16-class-archive.html">Tier 3 16 職業配置 · 舊版</a>')
W('index.html', t)
W('development/tier3-16-class-archive.html', f'''<!doctype html><html lang="zh-Hant" data-doc="../docs/archive/tier3-16-class-version.md?v={stamp}"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Tier 3 16 職業配置 · 舊版</title><link rel="stylesheet" href="../site.css?v={stamp}"></head><body><header class="topbar"><a class="brand" href="../index.html">LEGACY COLLECTOR</a><a href="../index.html">文件索引</a></header><main class="shell"><div class="eyebrow">ARCHIVE / CANCELLED</div><article class="doc" data-doc-content></article></main><script src="../site.js?v={stamp}"></script></body></html>''')

p = root/'systems/class-system.html'; h = p.read_text(encoding='utf-8')
h = h.replace('Prototype 02 · 職業樹設計中','Prototype 02 · 職業樹已完成').replace('<span class="prototype-status progress">設計中</span>','<span class="prototype-status confirmed">已完成</span>')
h = re.sub(r"for\(let i=0;i<16;i\+\+\)\{.*?J\.push\(\{id:'tier3_hidden_'\+\(i\+1\).*?\}\)\}", '', h)
h = h.replace("const sectorNames={warrior:'戰士系',agile:'敏捷系',magic:'魔法系',support:'支援系',center:'序章'};", "const sectorNames={warrior:'戰士系',agile:'敏捷系',magic:'魔法系',support:'支援系',center:'序章'};const sectorLabel=j=>(j.sectors||[j.sector]).map(s=>sectorNames[s]||s).join(' × ');")
h = h.replace("memorySources=J.filter(x=>x.tier===3&&x.sector===j.sector);", "memorySources=(j.requiredTier3Ids||[]).map(id=>J.find(x=>x.id===id)).filter(Boolean);")
h = h.replace("<p><strong>職業系：</strong>${sectorNames[j.sector]||j.sector}</p>", "<p><strong>職業系：</strong>${sectorLabel(j)}</p>")
h = h.replace('v=20260828-2235', f'v={stamp}')
W('systems/class-system.html', h)

p = root/'systems/mastery-system.html'; h = p.read_text(encoding='utf-8')
h = h.replace('Prototype 03 · Tier 3 設計中','Prototype 03 · Tier 3 已完成').replace('<span class="prototype-status progress">設計中</span>','<span class="prototype-status confirmed">已完成</span>')
h = re.sub(r'<p>Tier 3 已載入 16 個概念節點；.*?</p>', '<p>Tier 3 現行固定為 8 個高階職業：4 個單系核心 + 4 個跨系；8 個職業的一般攻擊、專屬能力與 Mastery 均已完成確認。</p>', h)
h = re.sub(r"for\(let i=0;i<16;i\+\+\)\{.*?rows\.push\(\{id:'tier3_hidden_'\+\(i\+1\).*?\}\)\}", '', h)
h = h.replace("const sectorNames={warrior:'戰士系',agile:'敏捷系',magic:'魔法系',support:'支援系'};", "const sectorNames={warrior:'戰士系',agile:'敏捷系',magic:'魔法系',support:'支援系'};const sectorLabel=c=>(c.sectors||[c.sector]).map(s=>sectorNames[s]||s).join(' × ');")
h = h.replace("${esc(sectorNames[c.sector]||c.sector)}", "${esc(sectorLabel(c))}").replace("${esc(sectorNames[c.sector]||'—')}", "${esc(sectorLabel(c))}")
h = h.replace("const damageNames={physical:'物理',magic:'魔法'};", "const damageNames={physical:'物理',magic:'魔法',healing:'治療'};")
h = h.replace("'straight-line-ranged':'直線遠距'", "'straight-line-ranged':'直線遠距','melee-support':'近戰支援'")
h = h.replace('v=20260828-2235', f'v={stamp}')
W('systems/mastery-system.html', h)

# Party Composition wrapper should describe new count rule while remaining unfinished as a prototype.
p = root/'systems/party-composition-system.html'; h = p.read_text(encoding='utf-8')
h = h.replace('本頁保留給四名角色當前職業系的組合與隊伍被動 Demo。現階段只確認判定骨架，不預先定義任何組合、被動名稱、數值或疊加方式。','本頁保留給四名角色當前職業 sectors 的組合與隊伍被動 Demo。已確認雙系 Tier 3 會同時對兩系各計 1 count，因此四人總 count 為 4～8；正式組合、被動名稱、數值與疊加方式仍待設計。')
W('systems/party-composition-system.html', h)

p = root/'development/gdd-review.html'; W('development/gdd-review.html', p.read_text(encoding='utf-8').replace('v=20260828-2235', f'v={stamp}'))

now = json.loads(classes_path.read_text(encoding='utf-8'))
t3 = [c for c in now['classes'] if c.get('tier') == 3]
assert len(t3) == 8
assert sorted(c['angle'] for c in t3) == [-135,-90,-45,0,45,90,135,180]
assert all(now['classDesigns'].get(c['id'],{}).get('status') == 'confirmed' for c in t3)
assert all(len(m.get('requiredTier3Ids', [])) == 3 for m in now['memoryForms'])
assert now['classDesigns'][sid]['basicAttack']['range'] == 1
assert now['partyCompositionRule']['dualSectorClassesCountForBoth'] is True
assert 'status-confirmed" href="systems/class-system.html' in (root/'index.html').read_text(encoding='utf-8')
assert 'status-confirmed" href="systems/mastery-system.html' in (root/'index.html').read_text(encoding='utf-8')
assert (root/'archive/tier3-16-class-version.json').exists()

# Ensure cancelled current-state wording is gone outside archives.
for p in [root/'docs/systems/class-system.md',root/'docs/systems/mastery-system.md',root/'docs/systems/skill-system.md',root/'systems/class-system.html',root/'systems/mastery-system.html']:
    s = p.read_text(encoding='utf-8')
    for bad in ['目前 Tier 3 外圈保留 16','Tier 3 的 16 個職業節點','Tier 3 已載入 16 個概念節點']:
        assert bad not in s, (p,bad)
