import json
from pathlib import Path

root = Path('.')
stamp = '20260829-0905'

p = root / 'data/classes.json'
data = json.loads(p.read_text(encoding='utf-8'))
if data.get('version') != 59:
    raise SystemExit(f"expected classes.json v59, got {data.get('version')}")
data['version'] = 60
rule = data['partyCompositionRule']
rule['passiveEffectsDefined'] = True
rule['recalculateImmediatelyAfterClassChange'] = True
rule['countThresholds'] = {
    'warrior': {'stat': 'physical-damage', '2': 10, '3': 20, '4': 30, 'unit': 'percent'},
    'agile': {'stat': 'AGI', '2': 10, '3': 20, '4': 30, 'unit': 'percent'},
    'magic': {'stat': 'magic-damage', '2': 10, '3': 20, '4': 30, 'unit': 'percent'},
    'support': {'stats': ['DEF', 'MDEF'], '2': 10, '3': 20, '4': 30, 'unit': 'percent'}
}
rule['balancedFourSectorBonus'] = {
    'requiredExactCounts': {'warrior': 1, 'agile': 1, 'magic': 1, 'support': 1},
    'bonuses': {'physical-damage': 5, 'magic-damage': 5, 'AGI': 5, 'DEF': 5, 'MDEF': 5},
    'unit': 'percent',
    'exclusiveToExactOneEach': True
}
rule['otherNamedCombinationsDefined'] = False
rule['description'] = '隊伍依四名角色當前職業 sectors 即時計算：單系職業貢獻 1 count，雙系 Tier 3 對兩系各貢獻 1。各系 Count 達 2/3/4 時依序提供 +10%/+20%/+30% 的全隊被動；四系恰為 1/1/1/1 時改觸發全隊物理傷害、魔法傷害、AGI、DEF、MDEF 各 +5% 的均衡加成。其他排列不另設命名或額外被動。'
p.write_text(json.dumps(data, ensure_ascii=False, indent=2) + '\n', encoding='utf-8')

party_md = '''# 隊伍職業組合系統（Party Composition System）

## 系統定位

隊伍職業組合系統依四名角色**目前職業所屬的職業系 Count**，為整個隊伍提供持續生效的被動能力。這是取消裝備 Build 後的重要隊伍構築層，效果會隨轉職後的職業配置立即重新計算。

## Sector Count 規則

- 戰士、敏捷、魔法、支援是四個基礎職業系。
- 單系職業貢獻 **1 個 sector count**。
- 跨系 Tier 3 同時屬於兩系，**兩系都各計 1**，不需要選擇其中一系。
- 四名角色全部使用單系職業時，總共有 **4 count**。
- 四名角色全部使用雙系 Tier 3 時，最多有 **8 count**。
- 混合配置時總 count 介於 4～8。
- Count 是職業系貢獻數，不等於角色數；單一職業系最高仍為 4 count。

例如軍團守衛同時提供支援 +1、戰士 +1；斷罪士同時提供戰士 +1、敏捷 +1。

## 四系 Count 被動

每個職業系都使用相同的 2 / 3 / 4 Count 門檻，只改變強化的既有戰鬥數值：

- **戰士 2 / 3 / 4 Count**：全隊物理傷害 **+10% / +20% / +30%**。
- **敏捷 2 / 3 / 4 Count**：全隊 AGI **+10% / +20% / +30%**。
- **魔法 2 / 3 / 4 Count**：全隊魔法傷害 **+10% / +20% / +30%**。
- **支援 2 / 3 / 4 Count**：全隊 DEF、MDEF **+10% / +20% / +30%**。

同一隊伍可以同時滿足多個職業系門檻，所有已滿足的系別被動同時生效。

## 四系均衡特例

當四個職業系的 Count **剛好都是 1**，即 `1 / 1 / 1 / 1` 時，改為觸發「四系均衡」：

- 全隊物理傷害 +5%。
- 全隊魔法傷害 +5%。
- 全隊 AGI +5%。
- 全隊 DEF +5%。
- 全隊 MDEF +5%。

此加成只在四系 Count **完全等於 1 / 1 / 1 / 1** 時觸發。若雙系 Tier 3 形成例如 `2 / 2 / 2 / 2`，則直接套用四個系各自的 2 Count +10%，不再套用四系均衡 +5%。

## 組合判定原則

除 `1 / 1 / 1 / 1` 的四系均衡特例外，**不另外窮舉或命名其他隊伍排列，也不給額外組合 Bonus**。

例如：

- `4 / 0 / 0 / 0`：該系 +30%。
- `3 / 1 / 0 / 0`：3 Count 的系別 +20%。
- `2 / 2 / 0 / 0`：兩個系別各 +10%。
- `2 / 1 / 1 / 0`：2 Count 的系別 +10%。
- `1 / 1 / 1 / 1`：觸發四系均衡，五項既有數值各 +5%。
- `2 / 2 / 2 / 2`：四個系別各自啟動 +10%。

玩家只需要閱讀目前四系 Count，不需要背誦額外的隊伍組合表。

## 即時重算

判定依角色當前職業的 `sectors`。角色完成轉職後，立即重新計算四系 Count 與所有隊伍被動；舊配置的隊伍被動同時失效，新配置效果立即生效。

## 尚未定義

- 角色記憶形態最後使用哪些 `sectors`，待角色記憶系統正式設計時決定。
- UI 最終如何呈現 Count 與生效中的被動，可在後續遊戲介面整合時調整；不影響本系統規則。
'''
(root / 'docs/systems/party-composition-system.md').write_text(party_md, encoding='utf-8')

html = root / 'systems/party-composition-system.html'
s = html.read_text(encoding='utf-8')
s = s.replace('20260826-2220', stamp)
old = '<section class="prototype"><strong>Party Composition Prototype · 待設計</strong><br>本頁保留給四名角色當前職業 sectors 的組合與隊伍被動 Demo。已確認雙系 Tier 3 會同時對兩系各計 1 count，因此四人總 count 為 4～8；正式組合、被動名稱、數值與疊加方式仍待設計。</section>'
new = '<section class="prototype"><strong>Party Composition System · 已完成確認</strong><br>依四名角色當前職業的 sectors 即時計算 Count：戰士強化物理傷害、敏捷強化 AGI、魔法強化魔法傷害、支援強化 DEF/MDEF；2 / 3 / 4 Count 對應 +10% / +20% / +30%。四系恰為 1 / 1 / 1 / 1 時，五項數值各 +5%。雙系 Tier 3 同時計入兩系。</section>'
if old not in s:
    raise SystemExit('party html marker not found')
html.write_text(s.replace(old, new), encoding='utf-8')

idx = root / 'index.html'
s = idx.read_text(encoding='utf-8')
old = '<a class="status-progress" href="systems/party-composition-system.html">隊伍職業組合系統</a>'
new = '<a class="status-confirmed" href="systems/party-composition-system.html">隊伍職業組合系統</a>'
if old not in s:
    raise SystemExit('index party status marker not found')
idx.write_text(s.replace(old, new), encoding='utf-8')

ph = root / 'docs/overview/design-philosophy.md'
s = ph.read_text(encoding='utf-8')
old = '四名角色當前職業的 sectors 會形成隊伍職業組合。單系職業貢獻 1 count；雙系 Tier 3 對兩系各貢獻 1，因此四人隊伍總 count 可由 4 變化至 8。具體組合與數值留待 `party-composition-system` Prototype 定義，不在現階段預設。'
new = '四名角色當前職業的 sectors 會形成隊伍職業組合。單系職業貢獻 1 count；雙系 Tier 3 對兩系各貢獻 1，因此四人隊伍總 count 可由 4 變化至 8。各系 2 / 3 / 4 Count 分別提供 +10% / +20% / +30% 的全隊被動：戰士強化物理傷害、敏捷強化 AGI、魔法強化魔法傷害、支援強化 DEF/MDEF；四系恰為 1 / 1 / 1 / 1 時則五項數值各 +5%。其他排列不另設組合 Bonus。'
if old not in s:
    raise SystemExit('design philosophy marker not found')
ph.write_text(s.replace(old, new), encoding='utf-8')

gl = root / 'docs/overview/gameplay-loop.md'
s = gl.read_text(encoding='utf-8')
old = '四名角色當前職業所屬職業系會形成隊伍職業組合。這套系統將提供隊伍被動能力，作為取消裝備 Build 後的重要隊伍構築層。\n\n具體組合、效果與數值目前不定義，留待 `party-composition-system` 的獨立 Demo。'
new = '四名角色當前職業的 sectors 會即時形成隊伍職業組合，作為取消裝備 Build 後的重要隊伍構築層。單系職業計 1 count、雙系 Tier 3 同時對兩系各計 1；四人總 count 介於 4～8。\n\n各系 2 / 3 / 4 Count 依序提供 +10% / +20% / +30%：戰士強化全隊物理傷害、敏捷強化 AGI、魔法強化魔法傷害、支援強化 DEF/MDEF。四系恰為 1 / 1 / 1 / 1 時，改為物理傷害、魔法傷害、AGI、DEF、MDEF 各 +5%。角色轉職後立即重新計算。'
if old not in s:
    raise SystemExit('gameplay loop marker not found')
gl.write_text(s.replace(old, new), encoding='utf-8')

rp = root / 'docs/systems/report-system.md'
s = rp.read_text(encoding='utf-8')
old = '隊伍職業組合系統未來會依四名角色當前職業系啟動團隊被動。Report 可以保存本 Run 曾使用過哪些組合、持續多久、在哪些關鍵戰鬥使用，但在組合規則尚未定義以前不建立假資料欄位或數值評分。'
new = '隊伍職業組合系統會依四名角色當前職業的 sectors Count 啟動全隊被動。Report 可以保存每次配置的四系 Count、實際啟動的 2 / 3 / 4 Count 被動或 1 / 1 / 1 / 1 四系均衡，以及配置持續多久、在哪些關鍵戰鬥使用。轉職造成的 Count 與被動變化也可作為本 Run 的隊伍構築歷程。'
if old not in s:
    raise SystemExit('report marker not found')
s = s.replace(old, new)
s = s.replace('- 隊伍組合正式定義後的 Report 欄位。\n', '- 隊伍職業組合歷程的 Report UI 呈現。\n')
rp.write_text(s, encoding='utf-8')

gr = root / 'docs/development/gdd-review.md'
s = gr.read_text(encoding='utf-8')
marker = '- 雙系 Tier 3 在 Party Composition 同時對兩系各貢獻 1 count；四名角色總 sector count 介於 4～8。\n'
add = marker + '- Party Composition：戰士／敏捷／魔法／支援在 2 / 3 / 4 Count 時分別強化物理傷害／AGI／魔法傷害／DEF+MDEF，統一為 +10% / +20% / +30%。\n- 四系恰為 1 / 1 / 1 / 1 時，物理傷害、魔法傷害、AGI、DEF、MDEF 各 +5%；其他排列不另設命名或額外 Bonus。\n'
if marker not in s:
    raise SystemExit('gdd review marker not found')
gr.write_text(s.replace(marker, add), encoding='utf-8')

dm = root / 'docs/development/document-map.md'
s = dm.read_text(encoding='utf-8')
s = s.replace('`systems/party-composition-system.html`：隊伍職業組合預留 Demo。', '`systems/party-composition-system.html`：已確認的 Count 型隊伍職業組合規則頁。')
s = s.replace('- Party Composition 具體組合 Demo。\n', '')
dm.write_text(s, encoding='utf-8')

# Validation
check = json.loads((root / 'data/classes.json').read_text(encoding='utf-8'))
r = check['partyCompositionRule']
assert check['version'] == 60
assert r['dualSectorClassesCountForBoth'] is True
assert r['sectorCountRangePerFourCharacterParty'] == '4-8'
assert r['countThresholds']['warrior']['4'] == 30
assert r['countThresholds']['agile']['2'] == 10
assert r['countThresholds']['magic']['3'] == 20
assert r['countThresholds']['support']['stats'] == ['DEF', 'MDEF']
assert r['balancedFourSectorBonus']['requiredExactCounts'] == {'warrior': 1, 'agile': 1, 'magic': 1, 'support': 1}
assert r['balancedFourSectorBonus']['bonuses']['AGI'] == 5
assert 'status-confirmed" href="systems/party-composition-system.html' in (root / 'index.html').read_text(encoding='utf-8')
assert '+10% / +20% / +30%' in (root / 'docs/systems/party-composition-system.md').read_text(encoding='utf-8')
print('party composition v60 validation ok')
