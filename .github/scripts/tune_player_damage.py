from pathlib import Path
import json

p = Path('development/combat-tests/combat-model.js')
text = p.read_text()
old = "  normalDamage(attacker,target){return Math.max(1,Math.round(this.applyOutgoingDamageModifiers(attacker,attacker.attack.type,this.baseDamage(attacker,target,attacker.attack.type,1))))}"
new = "  normalAttackMultiplier(unit){return unit?.team==='player'?1.25:1}\n  normalDamage(attacker,target){const multiplier=this.normalAttackMultiplier(attacker);return Math.max(1,Math.round(this.applyOutgoingDamageModifiers(attacker,attacker.attack.type,this.baseDamage(attacker,target,attacker.attack.type,multiplier))))}"
assert old in text
text = text.replace(old, new, 1)
old = "const r=this.dealDamage(attacker,target,{type:attacker.attack.type,multiplier:1,alwaysHit:false,name:attacker.attack.name||'普通攻擊',roll});"
new = "const r=this.dealDamage(attacker,target,{type:attacker.attack.type,multiplier:this.normalAttackMultiplier(attacker),alwaysHit:false,name:attacker.attack.name||'普通攻擊',roll});"
assert old in text
p.write_text(text.replace(old, new, 1))

p = Path('development/combat-tests/combat-class-runtime.js')
text = p.read_text()
text = text.replace("tier1_warrior:{name:'戰士',roles:['warrior'],passiveId:'hold-fast',active:{id:'slam',name:'猛擊',maxCharges:9,targetType:'enemy',range:1,kind:'damage',damageType:'physical',multiplier:1.5,alwaysHit:true}}", "tier1_warrior:{name:'戰士',roles:['warrior'],passiveId:'hold-fast',active:{id:'slam',name:'猛擊',maxCharges:9,targetType:'enemy',range:1,kind:'damage',damageType:'physical',multiplier:1.75,alwaysHit:true}}", 1)
text = text.replace("tier1_mage:{name:'法師',roles:['magic'],passiveId:'focus',active:{id:'magic-bolt',name:'魔力彈',maxCharges:9,targetType:'enemy',range:3,kind:'damage',damageType:'magic',multiplier:1.5,alwaysHit:true}}", "tier1_mage:{name:'法師',roles:['magic'],passiveId:'focus',active:{id:'magic-bolt',name:'魔力彈',maxCharges:9,targetType:'enemy',range:3,kind:'damage',damageType:'magic',multiplier:1.75,alwaysHit:true}}", 1)
assert text.count('multiplier:1.75') >= 2
p.write_text(text)

p = Path('data/classes.json')
data = json.loads(p.read_text())
data['version'] = max(int(data.get('version', 0)), 64)
rule = data.setdefault('basicAttackRule', {})
rule['playerDamageMultiplier'] = 1.25
rule['enemyDamageMultiplier'] = 1.0
rule['description'] = '玩家普通攻擊使用 ATK/MATK ×1.25 後再扣除 DEF/MDEF；敵方普通攻擊維持 ×1.0。此倍率不改變 HIT/EVA、暴擊或各職業攻擊距離。'
data['classDesigns']['tier1_warrior']['activeSkill']['effect'] = '對相鄰敵人造成 ATK ×1.75 的物理近戰傷害。'
data['classDesigns']['tier1_mage']['activeSkill']['effect'] = '對 3 格內單一敵人造成 MATK ×1.75 的魔法傷害。'
p.write_text(json.dumps(data, ensure_ascii=False, indent=2) + '\n')

p = Path('data/class-stats.json')
data = json.loads(p.read_text())
data['version'] = max(int(data.get('version', 0)), 3)
rules = data.setdefault('damageRules', {})
rules['playerNormalAttackPhysical'] = 'ATK * 1.25 - DEF'
rules['playerNormalAttackMagic'] = 'MATK * 1.25 - MDEF'
rules['enemyNormalAttackPhysical'] = 'ATK * 1.0 - DEF'
rules['enemyNormalAttackMagic'] = 'MATK * 1.0 - MDEF'
rules['tier1DamageActiveBaselineMultiplier'] = 1.75
rules['tier2DamageActiveTuningChangedByThisPass'] = False
p.write_text(json.dumps(data, ensure_ascii=False, indent=2) + '\n')

p = Path('docs/systems/damage-system.md')
text = p.read_text()
anchor = "### 治療\n\n`Healing = MATK × Healing Multiplier`\n"
insert = """### 治療

`Healing = MATK × Healing Multiplier`

## 普通攻擊倍率｜2026-09 Combat Tuning

為避免減法型防禦公式使普通攻擊在同 Tier 戰鬥中失去作用，玩家與敵方普通攻擊目前採不同基準倍率：

- **玩家物理普通攻擊**：`ATK × 1.25 − DEF`
- **玩家魔法普通攻擊**：`MATK × 1.25 − MDEF`
- **敵人物理普通攻擊**：維持 `ATK × 1.0 − DEF`
- **敵人魔法普通攻擊**：維持 `MATK × 1.0 − MDEF`

此調整不是讓支援系變成主力輸出，而是讓沒有傷害型主動技能的職業仍能以普通攻擊補刀與基本磨血，不至於在非支援時機只能等待。

同一輪調整中，Tier 1 的兩個傷害型主動技能同步提高：

- 戰士「猛擊」：`ATK × 1.75 − DEF`
- 法師「魔力彈」：`MATK × 1.75 − MDEF`

Tier 2 主動技能倍率**本輪不調整**。目前目標層級為：**普通攻擊有用但不強；Tier 1 傷害技能明顯優於普通攻擊；Tier 2 招牌技能仍以較高倍率或特殊效果維持戰術價值。**
"""
assert anchor in text
p.write_text(text.replace(anchor, insert, 1))

p = Path('systems/damage-system.html')
p.write_text(p.read_text().replace('damage-system.md?v=20260824-1944', 'damage-system.md?v=20260906-1807'))

p = Path('development/combat-tests/combat-app.js')
text = p.read_text()
for old in ['./combat-model.js?v=20260830-1311','./combat-model.js?v=20260829-1849']:
    text = text.replace(old, './combat-model.js?v=20260906-1807')
p.write_text(text)

p = Path('development/combat-tests/combat-tier2-boss-app.js')
p.write_text(p.read_text().replace('./combat-app.js?v=20260830-1311', './combat-app.js?v=20260906-1807'))

p = Path('development/combat-tests/combat-tier2-benchmark-runtime.js')
p.write_text(p.read_text().replace('./combat-class-runtime.js?v=20260830-1006', './combat-class-runtime.js?v=20260906-1807'))
