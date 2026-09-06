from pathlib import Path

# 1) Make Floating Combat Text a shared CombatApp feature.
p = Path('development/combat-tests/combat-app.js')
t = p.read_text()
import_line = "import {installFloatingCombatText} from './combat-floating-text.js?v=20260906-1838';\n"
if import_line not in t:
    t = import_line + t
old = "this.root=root;this.scenario=scenario;this.aiDelay=aiDelay;this.progressRows=progressRows;this.resultContent=resultContent;this.portraitBase=portraitBase;this.skillPageSize=Math.max(1,skillPageSize);this.passivePageSize=Math.max(1,passivePageSize);this.progressPageSize=Math.max(1,progressPageSize);this.mode='idle';this.selectedUnitId=null;this.selectedSkillId=null;this.skillPage=0;this.skillPageOwnerId=null;this.passivePage=0;this.passivePageOwnerId=null;this.enemyActivePage=0;this.enemyActivePageOwnerId=null;this.progressPage=0;mountCombatShell(root,{brandHref,demoLabel});this.cacheElements();this.bindEvents();this.reset();"
new = old + "installFloatingCombatText(this);"
if "installFloatingCombatText(this);" not in t:
    if old not in t:
        raise SystemExit('CombatApp constructor anchor not found')
    t = t.replace(old, new, 1)
p.write_text(t)

# 2) Shared CSS import.
p = Path('development/combat-tests/combat-ui.css')
t = p.read_text()
css_import = "@import url('./combat-floating-text.css?v=20260906-1838');\n"
if css_import not in t:
    t = css_import + t
p.write_text(t)

# 3) Remove per-Demo 2 imports/installs now that CombatApp owns the feature.
for name in ['demo-2-1.js','demo-2-2.js']:
    p = Path('development/combat-tests') / name
    t = p.read_text()
    t = t.replace("import {installFloatingCombatText} from './combat-floating-text.js?v=20260906-1821';\n", '')
    t = t.replace("  const app=new Tier2BossCombatApp(", "  new Tier2BossCombatApp(")
    t = t.replace(");\n  installFloatingCombatText(app);", ");")
    p.write_text(t)

# 4) Bust common app/css caches across every combat page/module.
import re
for p in Path('development/combat-tests').glob('*.js'):
    t = p.read_text()
    t = re.sub(r"combat-app\.js\?v=[0-9-]+", "combat-app.js?v=20260906-1838", t)
    p.write_text(t)
for p in Path('development/combat-tests').glob('*.html'):
    t = p.read_text()
    t = re.sub(r"combat-ui\.css\?v=[0-9-]+", "combat-ui.css?v=20260906-1838", t)
    p.write_text(t)

# 5) Update Markdown Combat Test Index: Demo 2-2 completed and extreme limit conclusion.
p = Path('docs/development/combat-test-index.md')
t = p.read_text()
t = t.replace('### Demo 2-2｜Region 2：Tier 2 ×12 極限測試｜測試中', '### Demo 2-2｜Region 2：Tier 2 ×12 極限測試｜完成')
anchor = '- 目的：測試 4 名 Tier 2 玩家面對三倍數量同 Tier 敵軍時的實際承壓極限。'
replacement = anchor + '\n- 結果：可以獲勝，但非常勉強，需要高強度操作與資源運用。\n- 結論：Tier 2 ×12 可視為目前 4 名 Tier 2 玩家面對一般同 Tier 敵軍的承壓極限；再提高同 Tier 敵人數量不再適合作為 Region 2 一般遭遇基準。'
if anchor in t and '非常勉強，需要高強度操作與資源運用' not in t:
    t = t.replace(anchor, replacement, 1)
# Add shared presentation rule to runtime section.
shared_anchor = '- `development/combat-tests/combat-ui.css`'
shared_repl = shared_anchor + '\n- `development/combat-tests/combat-floating-text.js`\n- `development/combat-tests/combat-floating-text.css`'
if shared_anchor in t and 'combat-floating-text.js' not in t:
    t = t.replace(shared_anchor, shared_repl, 1)
p.write_text(t)

# 6) Update HTML Combat Test Index.
p = Path('development/combat-test-index.html')
t = p.read_text()
t = t.replace('Demo 2-2 驗證面對兩倍同 Tier 敵軍的承壓極限。', 'Demo 2-2 驗證面對三倍同 Tier 敵軍的承壓極限。')
t = t.replace('<a class="status-progress" href="combat-tests/demo-2-2.html">Demo 2-2｜Region 2：Tier 2 ×12 極限測試</a>', '<a class="status-confirmed" href="combat-tests/demo-2-2.html">Demo 2-2｜Region 2：Tier 2 ×12 極限測試</a>')
t = t.replace('測試中。玩家為隨機 4 個不同 Tier 2 職業；敵方每場隨機 Tier 2 ×12，另隨機配置 5 格障礙物，用來測試 Tier 2 玩家面對同 Tier 敵軍的承壓極限。', '完成。玩家為隨機 4 個不同 Tier 2 職業；敵方每場隨機 Tier 2 ×12，另隨機配置 5 格障礙物。實測可以獲勝，但非常勉強，需要高強度操作與資源運用；確認 Tier 2 ×12 可視為目前 4 名 Tier 2 玩家面對一般同 Tier 敵軍的承壓極限。')
# Mention Floating Combat Text in common runtime card.
t = t.replace('核心戰鬥規則、公式、HUD 與互動邏輯不複製。正式戰場基準為 <strong>8×8</strong>。', '核心戰鬥規則、公式、HUD 與互動邏輯不複製；Floating Combat Text（傷害／治療／Buff／Debuff 浮動提示）亦由共用 Combat UI 自動提供。正式戰場基準為 <strong>8×8</strong>。')
p.write_text(t)
