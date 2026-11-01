/* ==========================================================================
   i18n.js — IDIOMAS (PT / EN / RU / JA) + relógio do rodapé
   --------------------------------------------------------------------------
   COMO FUNCIONA
   O site é escrito em português. Este arquivo percorre a página e troca cada
   texto pelo seu equivalente, procurando o texto em português no dicionário D.
   Um MutationObserver traduz também o que o index.html criar depois
   (listas, estados de vida, etc.), então não precisa mexer no index.html.

   COMO ADICIONAR / CORRIGIR UMA TRADUÇÃO
   Em D, a chave é o texto EXATO em português (sem espaços nas pontas) e o
   valor é [inglês, russo, japonês]. Texto sem entrada fica em português.

   PENDENTE: nomes das perícias e das habilidades de função ainda não estão
   traduzidos — basta adicionar entradas em D (ex.: "Pistola": ["Handgun", ...]).
   ========================================================================== */

const LANGS = [["pt","Português"],["en","English"],["ru","Русский"],["ja","日本語"]];
const LKEY = "cpr_lang";            // gaveta do localStorage com o idioma escolhido
let LANG = "pt";

/* ---- DICIONÁRIO: "português": [inglês, russo, japonês] ---- */
const D = {
  // topo e backup
  "Backup":["Backup","Бэкап","バックアップ"],
  "Limpar":["Reset","Сброс","リセット"],
  "// Ficha":["// Sheet","// Лист","// シート"],
  "Gerar":["Generate","Создать","生成"],
  "Importar":["Import","Импорт","読み込み"],
  "A ficha é salva sozinha neste navegador. Use o backup para levar a ficha a outro aparelho.":["The sheet autosaves in this browser. Use the backup to move it to another device.","Лист сохраняется автоматически в этом браузере. Используйте бэкап для переноса на другое устройство.","シートはこのブラウザに自動保存されます。別の端末へはバックアップで移してください。"],
  "Clique em Gerar e copie o texto para guardar, ou cole um backup aqui e clique em Importar.":["Click Generate and copy the text to keep it, or paste a backup here and click Import.","Нажмите «Создать» и скопируйте текст, либо вставьте бэкап и нажмите «Импорт».","「生成」を押してテキストを保存するか、バックアップを貼り付けて「読み込み」を押してください。"],
  "Apagar toda a ficha?":["Erase the whole sheet?","Стереть весь лист?","シートをすべて消去しますか？"],
  "JSON inválido.":["Invalid JSON.","Неверный JSON.","JSONが無効です。"],
  "Remover a última linha? Os dados dela serão apagados.":["Remove the last row? Its data will be erased.","Удалить последнюю строку? Её данные будут стёрты.","最後の行を削除しますか？データは消えます。"],
  "Remover última linha":["Remove last row","Удалить последнюю строку","最終行を削除"],
  "Adicionar linha":["Add row","Добавить строку","行を追加"],
  // abas
  "Ficha":["Sheet","Лист","シート"],"Perícias":["Skills","Навыки","スキル"],"Lifepath":["Lifepath","Жизненный путь","ライフパス"],
  "Cyberware":["Cyberware","Киберимпланты","サイバーウェア"],"Cyberdeck":["Cyberdeck","Кибердека","サイバーデッキ"],"Inventário":["Inventory","Инвентарь","所持品"],
  // ficha
  "Vitalidade":["Vitality","Жизненные показатели","生命力"],"PV":["HP","ОЗ","HP"],
  "Ferida grave":["Seriously wounded","Тяжёлое ранение","重傷"],"Ajuste rápido":["Quick adjust","Быстрая правка","クイック調整"],"Cura total":["Full heal","Полное лечение","全回復"],
  "Atributos":["Attributes","Атрибуты","能力値"],
  "Inteligência":["Intelligence","Интеллект","知力"],"Reflexos":["Reflexes","Реакция","反射神経"],"Destreza":["Dexterity","Ловкость","器用さ"],
  "Técnica":["Technique","Техника","技術"],"Frieza":["Cool","Хладнокровие","冷静さ"],"Vontade":["Willpower","Воля","意志力"],
  "Sorte":["Luck","Удача","幸運"],"Movimento":["Movement","Движение","移動"],"Corpo":["Body","Тело","肉体"],"Empatia":["Empathy","Эмпатия","共感"],
  "PV MÁXIMOS":["MAX HP","МАКС. ОЗ","最大HP"],"PV ATUAIS":["CURRENT HP","ТЕКУЩИЕ ОЗ","現在HP"],"FERIDA GRAVE (abaixo de)":["SERIOUS WOUND (below)","ТЯЖ. РАНЕНИЕ (ниже)","重傷（未満）"],
  "TESTE DE MORTE":["DEATH SAVE","СПАСБРОСОК СМЕРТИ","死亡判定"],"HUMANIDADE (atual / máx)":["HUMANITY (cur / max)","ЧЕЛОВЕЧНОСТЬ (тек / макс)","人間性（現在/最大）"],"SORTE":["LUCK","УДАЧА","幸運"],
  "Saudável":["Healthy","Здоров","健康"],"Ferido":["Wounded","Ранен","負傷"],
  "Gravemente ferido (−2 em todas as ações)":["Seriously wounded (−2 to all actions)","Тяжело ранен (−2 ко всем действиям)","重傷（全行動−2）"],
  "Mortalmente ferido (teste de morte)":["Mortally wounded (death save)","Смертельно ранен (спасбросок смерти)","瀕死（死亡判定）"],
  "Ferimentos e Vícios":["Injuries & Addictions","Травмы и зависимости","負傷と依存"],"Ferimentos críticos":["Critical injuries","Критические ранения","致命傷"],"Vícios":["Addictions","Зависимости","依存"],
  "Armadura (PA)":["Armor (SP)","Броня (ПБ)","アーマー（SP）"],"Nome / Tipo":["Name / Type","Название / тип","名称 / 種類"],"PA":["SP","ПБ","SP"],"Máx":["Max","Макс","最大"],"Penal.":["Penalty","Штраф","ペナ"],
  "Cabeça":["Head","Голова","頭部"],"Escudo":["Shield","Щит","シールド"],
  "PA = pontos de armadura atuais · Máx = valor original · Penal. = redução em REF/DEX/MOVE. A armadura perde 1 de PA a cada ataque que a penetra.":["SP = current armor points · Max = original value · Penalty = reduction to REF/DEX/MOVE. Armor loses 1 SP for each attack that penetrates it.","ПБ = текущие очки брони · Макс = исходное значение · Штраф = снижение REF/DEX/MOVE. Броня теряет 1 ПБ при каждой пробивающей атаке.","SP＝現在のアーマー値 · 最大＝元の値 · ペナ＝REF/DEX/MOVEの低下。貫通されるたびSPが1減ります。"],
  "Armas":["Weapons","Оружие","武器"],"Arma":["Weapon","Оружие","武器"],"Dano":["Damage","Урон","ダメージ"],"Munição":["Ammo","Патроны","弾薬"],"CdT":["ROF","СС","連射"],"Notas":["Notes","Заметки","メモ"],
  "ex.: Kevlar leve":["e.g. Light Kevlar","напр.: лёгкий кевлар","例：軽量ケブラー"],
  // perícias
  "★ básica (nível inicial 2) · ×2 custa o dobro de IP · BASE = atributo + nível + mod.":["★ basic (starting level 2) · ×2 costs double IP · BASE = attribute + level + mod.","★ базовый (начальный уровень 2) · ×2 стоит вдвое больше ОУ · БАЗА = атрибут + уровень + мод.","★基本（初期レベル2）· ×2はIP2倍 · 基本＝能力値＋レベル＋修正"],
  "Personalizadas":["Custom","Свои","カスタム"],"NÍV":["LVL","УР","Lv"],"MOD":["MOD","МОД","修正"],"ATR":["ATR","АТР","能力"],"BASE":["BASE","БАЗА","基本"],
  "nome…":["name…","название…","名前…"],"Perícia personalizada":["Custom skill","Свой навык","カスタムスキル"],
  // lifepath
  "Identidade":["Identity","Личность","アイデンティティ"],"Apelidos / Aliases":["Nicknames / Aliases","Прозвища / псевдонимы","あだ名 / エイリアス"],
  "Função (Role)":["Role","Роль","ロール"],"Habilidade de função (#)":["Role ability (#)","Способность роли (#)","ロール能力（#）"],
  "Companheiros e Carreira":["Companions & Career","Соратники и карьера","仲間とキャリア"],
  "Origens Culturais":["Cultural Origins","Культурное происхождение","文化的背景"],"Personalidade":["Personality","Характер","性格"],"Roupas e Cabelo":["Clothes & Hair","Одежда и причёска","服装と髪型"],
  "O que mais valoriza":["Most valued","Что ценит больше всего","最も大切なもの"],"Sentimentos sobre as Pessoas":["Feelings about People","Отношение к людям","人々への感情"],
  "Pessoa mais valorizada":["Most valued person","Самый ценный человек","最も大切な人"],"Posse mais valorizada":["Most valued possession","Самая ценная вещь","最も大切な持ち物"],
  "Origem Familiar":["Family Background","Семейное происхождение","家族の背景"],"Ambiente da Infância":["Childhood Environment","Среда детства","幼少期の環境"],
  "Crise Familiar":["Family Crisis","Семейный кризис","家族の危機"],"Objetivos de Vida":["Life Goals","Жизненные цели","人生の目標"],"Casos de Amor Trágicos":["Tragic Love Affairs","Трагические романы","悲恋"],
  "Amigos":["Friends","Друзья","友人"],"Inimigos":["Enemies","Враги","敵"],"Por quê?":["Why?","Почему?","なぜ？"],"Lifepath da Função":["Role Lifepath","Жизненный путь роли","ロールのライフパス"],
  "O que podem lançar contra você?":["What can they throw at you?","Что могут обрушить на вас?","何を仕掛けてくる？"],"Reputação e Eventos":["Reputation & Events","Репутация и события","評判と出来事"],"Aprimoramento":["Improvement","Улучшение","成長"],
  // cyberware
  "Humanidade":["Humanity","Человечность","人間性"],"HUMANIDADE MÁX":["MAX HUMANITY","МАКС. ЧЕЛОВЕЧНОСТЬ","最大人間性"],"PERDA TOTAL":["TOTAL LOSS","ОБЩАЯ ПОТЕРЯ","総喪失"],
  "HUMANIDADE ATUAL":["CURRENT HUMANITY","ТЕКУЩАЯ ЧЕЛОВЕЧНОСТЬ","現在の人間性"],"EMP EFETIVA":["EFFECTIVE EMP","ЭФФ. ЭМП","実効EMP"],
  "Humanidade intacta":["Humanity intact","Человечность не тронута","人間性は無傷"],"⚠ HUMANIDADE 0 — CIBERPSICOSE":["⚠ HUMANITY 0 — CYBERPSYCHOSIS","⚠ ЧЕЛОВЕЧНОСТЬ 0 — КИБЕРПСИХОЗ","⚠ 人間性0 — サイバーサイコシス"],
  "EMP efetiva = Humanidade atual ÷ 10 (arredondada para baixo). Use + e − para criar mais linhas em cada região. Pontos acesos no corpo = região com implantes.":["Effective EMP = current Humanity ÷ 10 (rounded down). Use + and − to add rows in each region. Lit dots on the body = region with implants.","Эфф. ЭМП = текущая человечность ÷ 10 (с округлением вниз). Кнопки + и − добавляют строки в каждой области. Светящиеся точки = область с имплантами.","実効EMP＝現在の人間性÷10（切り捨て）。+と−で各部位の行を増減。光る点＝インプラントのある部位。"],
  "// ANATOMIA CIBERNÉTICA":["// CYBERNETIC ANATOMY","// КИБЕРНЕТИЧЕСКАЯ АНАТОМИЯ","// サイバネティック解剖図"],
  "Implante":["Implant","Имплант","インプラント"],"Perda":["Loss","Потеря","喪失"],
  "Cyberolho (D)":["Cybereye (R)","Киберглаз (П)","サイバーアイ（右）"],"Cyberolho (E)":["Cybereye (L)","Киберглаз (Л)","サイバーアイ（左）"],"Neural Link":["Neural Link","Нейроинтерфейс","ニューラルリンク"],
  "Cyberáudio":["Cyberaudio","Кибераудио","サイバーオーディオ"],"Suíte de Cyberáudio":["Cyberaudio Suite","Набор кибераудио","サイバーオーディオ一式"],
  "Cyberbraço (D)":["Cyberarm (R)","Киберрука (П)","サイバーアーム（右）"],"Cyberbraço (E)":["Cyberarm (L)","Киберрука (Л)","サイバーアーム（左）"],
  "Cyberperna (D)":["Cyberleg (R)","Киберкнога (П)","サイバーレッグ（右）"],"Cyberperna (E)":["Cyberleg (L)","Киберкнога (Л)","サイバーレッグ（左）"],
  "Cyberbraço / mão (D)":["Cyberarm / hand (R)","Киберрука / кисть (П)","サイバーアーム/手（右）"],"Cyberbraço / mão (E)":["Cyberarm / hand (L)","Киберрука / кисть (Л)","サイバーアーム/手（左）"],
  "Cyberperna / pé (D)":["Cyberleg / foot (R)","Киберкнога / стопа (П)","サイバーレッグ/足（右）"],"Cyberperna / pé (E)":["Cyberleg / foot (L)","Киберкнога / стопа (Л)","サイバーレッグ/足（左）"],
  "Interno":["Internal","Внутренние","内蔵"],"Externo":["External","Внешние","外装"],"Fashionware":["Fashionware","Фэшнвэр","ファッションウェア"],"Borgware":["Borgware","Боргвэр","ボーグウェア"],
  // deck e inventário
  "Modelo":["Model","Модель","モデル"],"Slots de programa":["Program slots","Слоты программ","プログラム枠"],"Slots de hardware":["Hardware slots","Слоты железа","ハードウェア枠"],"Slots universais":["Universal slots","Универсальные слоты","汎用枠"],
  "Programas / Hardware":["Programs / Hardware","Программы / железо","プログラム / ハードウェア"],"Classe":["Class","Класс","クラス"],
  "Meus Pertences":["My Belongings","Мои вещи","私の持ち物"],"Moradia":["Housing","Жильё","住居"],"Aluguel":["Rent","Аренда","家賃"],"Estilo de vida":["Lifestyle","Образ жизни","ライフスタイル"],
  "Eurodólares (eb)":["Eurobucks (eb)","Евробаксы (eb)","ユーロドル（eb）"],"Pontos de Aprimoramento (IP)":["Improvement Points (IP)","Очки улучшения (ОУ)","成長ポイント（IP）"],"Reputação":["Reputation","Репутация","評判"],
  "Moda":["Fashion","Мода","ファッション"],"Item":["Item","Предмет","アイテム"],"Qtd":["Qty","Кол-во","数量"],
  // rodapé
  "NÃO OFICIAL":["UNOFFICIAL","НЕОФИЦИАЛЬНО","非公式"],
  "— Todos os direitos reservados":["— All rights reserved","— Все права защищены","— 無断転載を禁じます"],
  "Projeto feito por fãs, não afiliado. Cyberpunk RED é marca da R. Talsorian Games.":["Fan-made project, not affiliated. Cyberpunk RED is a trademark of R. Talsorian Games.","Фанатский проект, не аффилирован. Cyberpunk RED — торговая марка R. Talsorian Games.","ファン制作の非公式プロジェクトです。Cyberpunk REDはR. Talsorian Gamesの商標です。"]
};

/* ---- Frases com número (não cabem como chave fixa) ---- */
const PAT = [
  [/^EMP reduzida em (\d+) por perda de Humanidade$/, ["EMP reduced by $1 from Humanity loss","ЭМП снижена на $1 из-за потери человечности","人間性の喪失でEMPが$1低下"]],
  [/^Habilidade de função: (.+) \(rank (\d+)\)$/, ["Role ability: $1 (rank $2)","Способность роли: $1 (ранг $2)","ロール能力：$1（ランク$2）"]]
];

/* ---- Tradução de um texto ---- */
const li = () => LANG === "en" ? 0 : LANG === "ru" ? 1 : 2;
function tx(s) {
  if (LANG === "pt") return s;
  const k = s.trim(), r = D[k];
  if (r) return s.replace(k, r[li()]);
  for (const [re, v] of PAT) if (re.test(k)) return s.replace(k, k.replace(re, v[li()]));
  return s;
}

/* ---- Percorre a página e traduz textos e atributos (placeholder, title, alt) ----
   ORIG guarda o texto original em português de cada nó, para poder trocar de
   idioma várias vezes sem perder o original. */
const ORIG = new WeakMap();
function tr(root) {
  if (!root) return;
  const skip = n => n.parentElement && n.parentElement.closest("[data-notr],script,style,textarea");
  if (root.nodeType === 3) { if (!skip(root)) trNode(root); return; }
  const w = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
  for (let n; (n = w.nextNode());) if (!skip(n)) trNode(n);
  if (root.querySelectorAll) root.querySelectorAll("[placeholder],[title],[alt]").forEach(e => {
    if (e.closest("[data-notr]")) return;
    ["placeholder", "title", "alt"].forEach(a => {
      if (!e.hasAttribute(a)) return;
      const o = ORIG.get(e) || {}; if (!(a in o)) o[a] = e.getAttribute(a); ORIG.set(e, o);
      e.setAttribute(a, tx(o[a]));
    });
  });
}
function trNode(n) {
  if (!ORIG.has(n)) ORIG.set(n, n.nodeValue);
  const v = tx(ORIG.get(n)); if (n.nodeValue !== v) n.nodeValue = v;
}

/* ---- Troca de idioma ---- */
function setLang(l) {
  LANG = l;
  try { localStorage.setItem(LKEY, l); } catch (e) {}
  document.documentElement.lang = ({pt:"pt-BR", en:"en", ru:"ru", ja:"ja"})[l];
  tr(document.body);
  const b = document.getElementById("langBtn"); if (b) b.firstElementChild.textContent = l.toUpperCase();
  document.querySelectorAll("#langMenu [data-lang]").forEach(o => o.setAttribute("aria-checked", o.dataset.lang === l));
  tick();
}

/* ---- Relógio do rodapé (usa o formato de hora do idioma) ---- */
function tick() {
  const c = document.getElementById("clock"); if (!c) return;
  const d = new Date(), loc = ({pt:"pt-BR", en:"en-GB", ru:"ru-RU", ja:"ja-JP"})[LANG];
  c.textContent = d.toLocaleDateString(loc) + "  " + d.toLocaleTimeString(loc, {hour12: false});
}

document.addEventListener("DOMContentLoaded", () => {
  // menu de idiomas: abre/fecha no botão, fecha ao escolher, clicar fora ou apertar Esc
  const btn = document.getElementById("langBtn"), menu = document.getElementById("langMenu");
  menu.innerHTML = LANGS.map(([c, n]) => `<button role="menuitemradio" data-lang="${c}" aria-checked="false">${n}</button>`).join("");
  const close = () => { menu.hidden = true; btn.setAttribute("aria-expanded", "false"); };
  btn.onclick = e => { e.stopPropagation(); menu.hidden = !menu.hidden; btn.setAttribute("aria-expanded", String(!menu.hidden)); };
  menu.onclick = e => { const o = e.target.closest("[data-lang]"); if (o) { setLang(o.dataset.lang); close(); } };
  document.addEventListener("click", close);
  document.addEventListener("keydown", e => { if (e.key === "Escape") close(); });

  // traduz automaticamente tudo que o index.html criar depois (listas, estados...)
  new MutationObserver(ms => { if (LANG !== "pt") ms.forEach(m => m.addedNodes.forEach(tr)); }).observe(document.body, {childList: true, subtree: true});

  let saved = "pt"; try { saved = localStorage.getItem(LKEY) || "pt"; } catch (e) {}
  setLang(LANGS.some(l => l[0] === saved) ? saved : "pt");
  setInterval(tick, 1000);
});
