import json
from pathlib import Path

root = Path('.')
stamp = '20260829-1005'

# classes.json
p = root / 'data/classes.json'
data = json.loads(p.read_text(encoding='utf-8'))
if data.get('version') != 60:
    raise SystemExit(f"expected classes.json v60, got {data.get('version')}")
data['version'] = 61

# Correct Legion Guardian inspiration: remove Cleric, add Berserker.
links = data['tier3InspirationLinks']['tier3_warfront_guardian']
expected_old = ['tier2_cleric', 'tier2_bard', 'tier2_alchemist', 'tier2_knight']
if links != expected_old:
    raise SystemExit(f'unexpected legion guardian links: {links}')
data['tier3InspirationLinks']['tier3_warfront_guardian'] = [
    'tier2_berserker', 'tier2_knight', 'tier2_bard', 'tier2_alchemist'
]

# Memory form inheritance is a full recursive chain from all associated Tier 3s.
sir = data['skillInheritanceRule']
sir['memoryFormInheritance'] = 'all-required-tier3-exclusive-and-recursive-ancestors'
sir['memoryFormInheritsRequiredTier3ExclusiveAbilities'] = True
sir['memoryFormRecursivelyInheritsTier2AndTier1Ancestors'] = True
sir['memoryFormBasicAttackInherited'] = False
sir['memoryFormAddsOwnActiveSkill'] = False
sir['memoryFormAddsOwnPassiveSkill'] = False
sir['memoryFormOwnBasicAttackRequired'] = True
sir['memoryFormSkillSlotLimit'] = None
sir['description'] = 'Tier 2 完整繼承正式連線 Tier 1 主被動；Tier 3 完整繼承 Inspiration Links 對應 Tier 2 與祖先技能，再取得自身 Tier 3 專屬能力。角色記憶完整取得其 requiredTier3Ids 的 Tier 3 專屬主被動／主動能力，並沿每條 Tier 3 繼承鏈遞迴取得 Tier 2、Tier 1 技能；一般攻擊不繼承，由記憶形態自己定義。'

mar = data['memoryAwakeningRule']
mar['skillInheritance'] = 'full-recursive-chain-from-required-tier3'
mar['inheritsAllRequiredTier3ExclusiveAbilities'] = True
mar['recursivelyInheritsTier2AndTier1Skills'] = True
mar['addsNewActiveSkill'] = False
mar['addsNewPassiveSkill'] = False
mar['hasOwnBasicAttack'] = True
mar['hasMastery'] = False
mar['partyCompositionSectorMode'] = 'origin-sector-only'
mar['partyCompositionCount'] = 1
mar['description'] = '完成原始職業系相關的 3 個 Tier 3 Mastery，並於 Region 4 可選記憶神殿首次覺醒。記憶形態完整繼承這 3 個 Tier 3 的專屬能力，以及各 Tier 3 繼承鏈向下所有 Tier 2、Tier 1 主被動技能；不繼承一般攻擊，自身只新增一個一般攻擊，不新增主動、被動或 Mastery。Party Composition 只視為原始單一職業系，固定貢獻 1 count。'

for m in data.get('memoryForms', []):
    m['sectors'] = [m['sector']]
    m['partyCompositionCount'] = 1
    m['inheritanceMode'] = 'full-recursive-chain-from-required-tier3'
    m['inheritRequiredTier3ExclusiveAbilities'] = True
    m['inheritTier2AndTier1Ancestors'] = True
    m['inheritBasicAttack'] = False
    m['hasOwnBasicAttack'] = True
    m['addsOwnActiveSkill'] = False
    m['addsOwnPassiveSkill'] = False
    m['hasMastery'] = False

data['activeSkillChargeBaselineRule']['memoryForm'] = 'inherited-skills-keep-source-charge-rules'
p.write_text(json.dumps(data, ensure_ascii=False, indent=2) + '\n', encoding='utf-8')

# Memory Awakening source-of-truth doc.
mem = root / 'docs/systems/memory-awakening-system.md'
mem.write_text('''# 角色記憶覺醒系統（Memory Awakening System）

四名主角各有一個唯一最終「XXX 的記憶」。角色記憶不是 Tier 4，而是對應角色找回完整戰鬥記憶後的專屬最終職業形態，只允許該角色本人使用。

## 解鎖條件

首次覺醒必須完成該角色原始職業系所涵蓋的**全部 Tier 3 Mastery**；這不只包含單系核心，也包含所有 `sectors` 中含有該系的跨系 Tier 3。

- 戰士：軍團守衛 + 血煉騎士 + 斷罪士。
- 敏捷：斷罪士 + 幻行師 + 影刃術士。
- 魔法：影刃術士 + 空間魔導士 + 咒縛師。
- 支援：咒縛師 + 聖律師 + 軍團守衛。

完成後仍必須在同一次 Run 實際進入 Region 4 的合法可選記憶神殿節點。首次成功覺醒後永久解鎖，後續 Run 可直接選擇該角色的記憶形態作為起始職業。

## 完整技能鏈繼承

角色記憶的目的，是讓玩家在最終形態中整合該角色原始職業系的完整最高階能力，因此不另外設計新的主動或被動技能。

角色記憶會：

1. 完整取得 `requiredTier3Ids` 中 **3 個相關 Tier 3 的所有 Tier 3 專屬能力**。
2. 沿這 3 個 Tier 3 各自的 Inspiration／職業繼承鏈，**遞迴取得所有對應 Tier 2 主動與被動技能**。
3. 再由這些 Tier 2 繼續向下，**完整取得所有對應 Tier 1 主動與被動技能**。
4. 相同來源職業只計一次，維持既有 `deduplicateBySourceClass` 規則。
5. **一般攻擊不屬於繼承內容**；記憶形態自己擁有 1 個專屬一般攻擊。
6. 記憶形態**不新增其他主動技能、不新增其他被動技能，也不再設 Mastery**。
7. 繼承的主動技能沿用其來源職業既有 Charge 規則。

因此角色記憶是一條完整技能鏈的整合終點，而不是在 Tier 3 之後再追加一層新的技能套件。

## Party Composition

角色記憶在隊伍職業組合中只視為角色的**原始單一職業系**，固定貢獻 **1 Count**。即使它繼承的 Tier 3 包含雙系職業，也不額外取得那些 Tier 3 的第二職業系 Count。

- 戰士記憶：Warrior +1。
- 敏捷記憶：Agile +1。
- 魔法記憶：Magic +1。
- 支援記憶：Support +1。

因此四名主角若全部使用自己的記憶形態，隊伍 Count 為 `1 / 1 / 1 / 1`，會依 Party Composition 規則觸發四系均衡加成。

## 尚未定義

- 四名主角正式姓名／稱號與四個記憶形態正式名稱。
- 四個記憶形態各自的專屬一般攻擊內容與數值。
- Region 4 記憶神殿的生成、視覺與演出細節。
''', encoding='utf-8')

# Memory HTML reading page.
html = root / 'systems/memory-awakening-system.html'
s = html.read_text(encoding='utf-8')
s = s.replace('20260826-2220', stamp)
old = '<section class="prototype"><strong>Memory Awakening Prototype · 待設計</strong><br>四名主角各有唯一的「XXX 的記憶」；完成對應職業系全部 Tier 3 Mastery 後，可在 Region 4 的可選記憶神殿首次覺醒。首次覺醒後永久解鎖，後續 Run 可直接使用。</section>'
new = '<section class="prototype"><strong>Memory Awakening Prototype · 核心規則已確認</strong><br>角色記憶完整繼承對應 3 個 Tier 3 的專屬能力，並沿各自繼承鏈遞迴取得 Tier 2、Tier 1 主被動；一般攻擊不繼承，由記憶形態自行定義。記憶形態不新增其他主動／被動、不設 Mastery；Party Composition 只計原始單一職業系 +1。一般攻擊與神殿演出仍待設計。</section>'
if old not in s:
    raise SystemExit('memory html marker not found')
html.write_text(s.replace(old, new), encoding='utf-8')

# Update overview design philosophy.
ph = root / 'docs/overview/design-philosophy.md'
s = ph.read_text(encoding='utf-8')
old = '四個最終角色形態則不是 Tier 4，而是四名主角各自專屬的「XXX 的記憶」。首次覺醒需要：對應職業系全部 Tier 3 Mastery + Region 4 可選記憶神殿。首次覺醒後永久解鎖。'
new = '四個最終角色形態則不是 Tier 4，而是四名主角各自專屬的「XXX 的記憶」。首次覺醒需要：對應職業系全部相關 Tier 3 Mastery + Region 4 可選記憶神殿。記憶形態會完整取得相關 3 個 Tier 3 的專屬能力，並沿各 Tier 3 繼承鏈遞迴取得 Tier 2、Tier 1 主被動；自身只另有一般攻擊，不新增主動／被動或 Mastery。首次覺醒後永久解鎖。'
if old not in s:
    raise SystemExit('design philosophy memory marker not found')
ph.write_text(s.replace(old, new), encoding='utf-8')

# Update gameplay loop memory section.
gl = root / 'docs/overview/gameplay-loop.md'
s = gl.read_text(encoding='utf-8')
needle = '首次覺醒後永久解鎖；之後新 Run 可直接以該角色自己的記憶形態開始，不需要再次前往神殿。'
replacement = needle + '\n\n記憶形態完整繼承該角色原始職業系相關 3 個 Tier 3 的專屬能力，並沿其繼承鏈遞迴取得 Tier 2、Tier 1 主被動。一般攻擊不繼承，由記憶形態自己定義；不另外新增主動、被動或 Mastery。Party Composition 只計原始單一職業系 1 Count。'
if needle not in s:
    raise SystemExit('gameplay loop memory marker not found')
gl.write_text(s.replace(needle, replacement), encoding='utf-8')

# Update GDD review: corrected inspiration + memory rules.
gr = root / 'docs/development/gdd-review.md'
s = gr.read_text(encoding='utf-8')
s = s.replace('- 軍團守衛：神官、吟遊詩人、煉金術士、騎士。', '- 軍團守衛：狂戰士、騎士、吟遊詩人、煉金術士。')
anchor = '- 記憶覺醒需要原始職業系核心 Tier 3，加上所有涵蓋該系的雙系 Tier 3 Mastery。'
new_anchor = anchor + '\n- 角色記憶完整繼承其 3 個相關 Tier 3 專屬能力，並沿各 Tier 3 鏈遞迴繼承 Tier 2、Tier 1 主被動；自身只新增一般攻擊，不新增主動／被動或 Mastery。\n- 角色記憶在 Party Composition 只計原始單一職業系 1 Count。'
if anchor not in s:
    raise SystemExit('gdd review memory marker not found')
gr.write_text(s.replace(anchor, new_anchor), encoding='utf-8')

# Update class-system source doc if it lists the old inspiration links.
cs = root / 'docs/systems/class-system.md'
s = cs.read_text(encoding='utf-8')
old_link = '軍團守衛：神官、吟遊詩人、煉金術士、騎士'
if old_link in s:
    s = s.replace(old_link, '軍團守衛：狂戰士、騎士、吟遊詩人、煉金術士')
# Add memory inheritance note near matching wording when available.
cs.write_text(s, encoding='utf-8')

# Cache-bust class tree so corrected link is visible promptly.
ch = root / 'systems/class-system.html'
s = ch.read_text(encoding='utf-8')
s = s.replace('20260829-0904', stamp)
ch.write_text(s, encoding='utf-8')

# Party composition doc: resolve memory sector TBD.
pc = root / 'docs/systems/party-composition-system.md'
s = pc.read_text(encoding='utf-8')
old = '- 角色記憶形態最後使用哪些 `sectors`，待角色記憶系統正式設計時決定。\n'
if old in s:
    s = s.replace(old, '- 角色記憶形態固定只使用角色原始單一 `sector`，並貢獻 1 Count；繼承技能不改變其 Party Composition sector。\n')
pc.write_text(s, encoding='utf-8')

# Lightweight verification.
check = json.loads(p.read_text(encoding='utf-8'))
assert check['version'] == 61
assert check['tier3InspirationLinks']['tier3_warfront_guardian'] == ['tier2_berserker','tier2_knight','tier2_bard','tier2_alchemist']
assert check['memoryAwakeningRule']['skillInheritance'] == 'full-recursive-chain-from-required-tier3'
assert check['memoryAwakeningRule']['partyCompositionCount'] == 1
assert check['memoryAwakeningRule']['addsNewActiveSkill'] is False
assert check['memoryAwakeningRule']['addsNewPassiveSkill'] is False
assert check['memoryAwakeningRule']['hasMastery'] is False
assert all(m['partyCompositionCount'] == 1 and len(m['sectors']) == 1 for m in check['memoryForms'])
print('memory inheritance v61 verification passed')
