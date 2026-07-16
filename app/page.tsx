"use client";

import { useEffect, useMemo, useState } from "react";

type Menu = { id: string; name: string; price: number; note: string };
type Restaurant = {
  id: string;
  name: string;
  category: string;
  area: string;
  description: string;
  menus: Menu[];
};

const restaurants: Restaurant[] = [
  {
    id: "seoul-bunsik",
    name: "서울분식 연구소",
    category: "분식",
    area: "을지로 3가 · 도보 4분",
    description: "매일 뽑는 떡과 진한 고추장 소스, 든든한 한 끼 분식",
    menus: [
      { id: "tteok", name: "국물 떡볶이", price: 7500, note: "쫀득한 밀떡과 삶은 달걀" },
      { id: "sundae", name: "찰순대 한 접시", price: 8000, note: "소금과 들깨 양념장" },
      { id: "gimbap", name: "참치 묵은지 김밥", price: 6000, note: "고소하고 산뜻한 조합" },
      { id: "ramyeon", name: "치즈 라볶이", price: 8500, note: "라면 사리와 체다 치즈" },
      { id: "fried", name: "모둠 튀김", price: 7000, note: "김말이·오징어·고구마" },
      { id: "rice", name: "날치알 볶음밥", price: 5500, note: "마무리까지 든든하게" },
    ],
  },
  {
    id: "noodle-club",
    name: "면면 클럽",
    category: "아시안 누들",
    area: "성수역 · 도보 6분",
    description: "매콤한 국물부터 고소한 비빔면까지 취향대로 즐기는 면 요리",
    menus: [
      { id: "tantan", name: "탄탄면", price: 11000, note: "고소한 땅콩과 매콤한 육수" },
      { id: "pho", name: "차돌 쌀국수", price: 12000, note: "맑고 깊은 소고기 육수" },
      { id: "mazemen", name: "마제소바", price: 11500, note: "진한 양념과 다진 고기" },
      { id: "yaki", name: "해물 야끼우동", price: 12500, note: "불향 가득 볶음면" },
      { id: "cold", name: "들기름 막국수", price: 10000, note: "메밀면과 김의 고소함" },
    ],
  },
  {
    id: "home-table",
    name: "오늘의 집밥",
    category: "한식",
    area: "강남역 · 도보 3분",
    description: "매일 먹어도 질리지 않는 정갈하고 따뜻한 한상",
    menus: [
      { id: "kimchi", name: "돼지 김치찌개", price: 9500, note: "두툼한 앞다리살과 묵은지" },
      { id: "bulgogi", name: "뚝배기 불고기", price: 11000, note: "달큰한 국물과 당면" },
      { id: "bibim", name: "제철 나물 비빔밥", price: 10000, note: "다섯 가지 나물과 달걀" },
      { id: "fish", name: "고등어 구이 정식", price: 12000, note: "바삭하게 구운 순살 고등어" },
      { id: "pork", name: "매콤 제육볶음", price: 10500, note: "불향과 아삭한 양배추" },
    ],
  },
  {
    id: "green-bowl",
    name: "그린 보울 키친",
    category: "샐러드·포케",
    area: "여의도역 · 도보 5분",
    description: "신선한 채소와 든든한 단백질을 골고루 담은 가벼운 한 끼",
    menus: [
      { id: "salmon", name: "연어 아보카도 포케", price: 13500, note: "생연어와 현미밥" },
      { id: "chicken", name: "허브 치킨 보울", price: 12000, note: "닭가슴살과 구운 채소" },
      { id: "tofu", name: "두부 버섯 샐러드", price: 10500, note: "구운 두부와 참깨 드레싱" },
      { id: "shrimp", name: "칠리 새우 포케", price: 13000, note: "통통한 새우와 스리라차" },
    ],
  },
];

const games = [
  { id: "ladder", icon: "↘", name: "사다리타기", copy: "선을 따라 내려가요" },
  { id: "draw", icon: "▱", name: "제비뽑기", copy: "뒤집기 전엔 아무도 몰라요" },
  { id: "scratch", icon: "✦", name: "복권 긁기", copy: "쓱쓱 긁어 결과 확인" },
  { id: "roulette", icon: "◉", name: "룰렛", copy: "힘차게 돌리고 기다려요" },
  { id: "slot", icon: "▥", name: "슬롯머신", copy: "세 칸이 멈추면 결정" },
];

const rouletteColors = ["#f0441e", "#fff4d0", "#4e9588", "#ffc83d", "#e76f51", "#f4ead5"];

const money = (value: number) => new Intl.NumberFormat("ko-KR").format(value) + "원";

function ladderPosition(start: number, rungs: number[], completed = rungs.length) {
  let position = start;
  rungs.slice(0, completed).forEach((from) => {
    if (from < 0) return;
    if (position === from) position += 1;
    else if (position === from + 1) position -= 1;
  });
  return position;
}

function secureRandom(max: number) {
  const values = new Uint32Array(1);
  crypto.getRandomValues(values);
  return values[0] % max;
}

function createHiddenLadder(start: number, target: number, count: number) {
  const rungs: number[] = [];
  const moves: number[] = [];
  let position = start;
  while (position < target) {
    moves.push(position);
    position += 1;
  }
  while (position > target) {
    moves.push(position - 1);
    position -= 1;
  }
  position = start;
  const levelCount = Math.max(8, moves.length * 2 + 1);
  const moveLevels = moves.map((_, index) => Math.round(((index + 1) * levelCount) / (moves.length + 1)) - 1);
  let moveIndex = 0;
  let previous = -1;
  for (let level = 0; level < levelCount; level += 1) {
    if (moveIndex < moves.length && moveLevels[moveIndex] === level) {
      const from = moves[moveIndex];
      rungs.push(from);
      position += target > start ? 1 : -1;
      previous = from;
      moveIndex += 1;
      continue;
    }
    const safe = Array.from({ length: count - 1 }, (_, index) => index)
      .filter((from) => from !== position && from + 1 !== position && from !== previous);
    if (safe.length) {
      const from = safe[(level + secureRandom(safe.length)) % safe.length];
      rungs.push(from);
      previous = from;
    } else {
      rungs.push(-1);
      previous = -1;
    }
  }
  return rungs;
}

export default function Home() {
  const [query, setQuery] = useState("");
  const [searched, setSearched] = useState(false);
  const [restaurant, setRestaurant] = useState<Restaurant | null>(null);
  const [candidates, setCandidates] = useState<string[]>([]);
  const [game, setGame] = useState("roulette");
  const [playing, setPlaying] = useState(false);
  const [winner, setWinner] = useState<Menu | null>(null);
  const [ladderStart, setLadderStart] = useState(0);
  const [ladderLevel, setLadderLevel] = useState(0);
  const [ladderRungs, setLadderRungs] = useState<number[]>([]);
  const [ladderOpen, setLadderOpen] = useState(false);
  const [ladderResult, setLadderResult] = useState<number | null>(null);
  const [drawReady, setDrawReady] = useState(false);
  const [drawPicked, setDrawPicked] = useState<number | null>(null);
  const [rouletteRotation, setRouletteRotation] = useState(0);
  const [slotOffsets, setSlotOffsets] = useState([0, 0, 0]);
  const [slotRound, setSlotRound] = useState(0);

  const results = useMemo(() => {
    const keyword = query.trim().toLowerCase();
    if (!keyword) return restaurants;
    return restaurants.filter((item) =>
      [item.name, item.category, item.area, item.description, ...item.menus.map((menu) => menu.name)]
        .join(" ")
        .toLowerCase()
        .includes(keyword),
    );
  }, [query]);

  const candidateMenus = restaurant?.menus.filter((menu) => candidates.includes(menu.id)) ?? [];
  const ladderMenus = candidateMenus.slice(0, 6);
  const ladderMarker = ladderPosition(ladderStart, ladderRungs, ladderLevel);
  const rouletteSlice = 360 / Math.max(1, candidateMenus.length);
  const rouletteBackground = `conic-gradient(${candidateMenus.map((_, index) => `${rouletteColors[index % rouletteColors.length]} ${index * rouletteSlice}deg ${(index + 1) * rouletteSlice}deg`).join(", ")})`;
  const currentGame = games.find((item) => item.id === game) ?? games[3];
  const step = winner ? 4 : restaurant ? (candidates.length >= 2 ? 3 : 2) : searched ? 1 : 0;

  useEffect(() => {
    if (!playing || game !== "ladder") return;
    setLadderLevel(0);
    const timer = window.setInterval(() => {
      setLadderLevel((level) => {
        if (level >= ladderRungs.length) {
          window.clearInterval(timer);
          return level;
        }
        return level + 1;
      });
    }, 280);
    return () => window.clearInterval(timer);
  }, [playing, game, ladderRungs.length]);

  function search() {
    setSearched(true);
    setWinner(null);
  }

  function chooseRestaurant(item: Restaurant) {
    setRestaurant(item);
    setCandidates(item.menus.map((menu) => menu.id));
    setWinner(null);
    setDrawReady(false);
    setDrawPicked(null);
    setLadderOpen(false);
    setLadderResult(null);
    setLadderRungs([]);
    setRouletteRotation(0);
    setSlotOffsets([0, 0, 0]);
    window.setTimeout(() => document.getElementById("menu-section")?.scrollIntoView({ behavior: "smooth" }), 50);
  }

  function toggleMenu(id: string) {
    setCandidates((current) =>
      current.includes(id) ? current.filter((item) => item !== id) : [...current, id],
    );
    setWinner(null);
    setDrawReady(false);
    setDrawPicked(null);
    setLadderOpen(false);
    setLadderResult(null);
    setLadderRungs([]);
    setRouletteRotation(0);
    setSlotOffsets([0, 0, 0]);
  }

  function randomMenu() {
    const values = new Uint32Array(1);
    crypto.getRandomValues(values);
    return candidateMenus[values[0] % candidateMenus.length];
  }

  function shuffleDraw() {
    if (candidateMenus.length < 2 || playing) return;
    setWinner(null);
    setDrawReady(false);
    setDrawPicked(null);
    setPlaying(true);
    window.setTimeout(() => {
      setPlaying(false);
      setDrawReady(true);
    }, 1200);
  }

  function pickDraw(index: number) {
    if (!drawReady || playing) return;
    const picked = randomMenu();
    setDrawPicked(index);
    setPlaying(true);
    window.setTimeout(() => {
      setWinner(picked);
      setPlaying(false);
      setDrawReady(false);
      window.setTimeout(() => document.getElementById("result")?.scrollIntoView({ behavior: "smooth" }), 60);
    }, 950);
  }

  function runLadder(startIndex: number) {
    if (ladderMenus.length < 2 || playing) return;
    const targetIndex = secureRandom(ladderMenus.length);
    const nextRungs = createHiddenLadder(startIndex, targetIndex, ladderMenus.length);
    const picked = ladderMenus[targetIndex];
    setLadderStart(startIndex);
    setLadderLevel(0);
    setLadderRungs(nextRungs);
    setLadderResult(targetIndex);
    setLadderOpen(true);
    setWinner(null);
    setPlaying(true);
    window.setTimeout(() => {
      setWinner(picked);
      setPlaying(false);
      window.setTimeout(() => document.getElementById("result")?.scrollIntoView({ behavior: "smooth" }), 700);
    }, Math.max(1900, nextRungs.length * 280 + 250));
  }

  function runGame() {
    if (candidateMenus.length < 2 || playing) return;
    if (game === "ladder") {
      setWinner(null);
      setLadderOpen(false);
      setLadderResult(null);
      setLadderRungs([]);
      document.getElementById("game-section")?.scrollIntoView({ behavior: "smooth" });
      return;
    }
    if (game === "draw") {
      shuffleDraw();
      return;
    }
    const picked = randomMenu();
    if (game === "roulette") {
      const pickedIndex = candidateMenus.findIndex((menu) => menu.id === picked.id);
      const target = (360 - (pickedIndex + 0.5) * rouletteSlice) % 360;
      setRouletteRotation((current) => {
        const currentMod = ((current % 360) + 360) % 360;
        const alignment = (target - currentMod + 360) % 360;
        return current + 360 * 6 + alignment;
      });
    }
    if (game === "slot") {
      const pickedIndex = candidateMenus.findIndex((menu) => menu.id === picked.id);
      setSlotRound((round) => round + 1);
      setSlotOffsets([0, 0, 0]);
      window.requestAnimationFrame(() => {
        window.requestAnimationFrame(() => {
          setSlotOffsets([
            candidateMenus.length * 4 + pickedIndex,
            candidateMenus.length * 5 + pickedIndex,
            candidateMenus.length * 6 + pickedIndex,
          ]);
        });
      });
    }
    setPlaying(true);
    setWinner(null);
    window.setTimeout(() => {
      setWinner(picked);
      setPlaying(false);
      window.setTimeout(() => document.getElementById("result")?.scrollIntoView({ behavior: "smooth" }), 60);
    }, game === "roulette" ? 3000 : game === "slot" ? 2700 : 1600);
  }

  function resetAll() {
    setQuery("");
    setSearched(false);
    setRestaurant(null);
    setCandidates([]);
    setWinner(null);
    setDrawReady(false);
    setDrawPicked(null);
    setLadderOpen(false);
    setLadderResult(null);
    setLadderRungs([]);
    setRouletteRotation(0);
    setSlotOffsets([0, 0, 0]);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  return (
    <main>
      <header className="topbar">
        <button className="brand" onClick={resetAll} aria-label="처음으로 돌아가기">
          <span className="brand-mark">ㅂ</span>
          <span>밥픽</span>
        </button>
        <p>오늘의 한 끼, 재밌게 결정해요.</p>
        <span className="today">오늘도 맛있게!</span>
      </header>

      <section className="hero">
        <div className="eyebrow"><span /> MENU PICKER</div>
        <h1>오늘 뭐 먹지?</h1>
        <p className="hero-copy">고민은 짧게, 선택은 재밌게.<br />먹고 싶은 곳을 찾고 게임으로 메뉴를 골라보세요.</p>
        <form className="search-box" onSubmit={(event) => { event.preventDefault(); search(); }}>
          <label htmlFor="search">식당이나 메뉴를 검색해 보세요</label>
          <div className="search-row">
            <span aria-hidden="true">⌕</span>
            <input id="search" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="예: 떡볶이, 성수, 한식" />
            <button type="submit">찾아보기</button>
          </div>
          <div className="quick-search" aria-label="추천 검색어">
            {['떡볶이', '한식', '성수', '가벼운 점심'].map((word) => (
              <button type="button" key={word} onClick={() => { setQuery(word); setSearched(true); }}>#{word}</button>
            ))}
          </div>
        </form>

        <ol className="steps" aria-label="메뉴 선택 단계">
          {["식당 찾기", "후보 고르기", "게임하기", "메뉴 결정"].map((label, index) => (
            <li key={label} className={step >= index + 1 || (index === 0 && searched) ? "active" : ""}>
              <span>{index + 1}</span>{label}
            </li>
          ))}
        </ol>
      </section>

      <section className="content-shell" aria-live="polite">
        {searched && (
          <section className="section-block" id="restaurants">
            <div className="section-heading">
              <div><span className="section-kicker">STEP 01</span><h2>어디서 먹을까요?</h2></div>
              <p>{results.length}곳을 찾았어요</p>
            </div>
            {results.length ? (
              <div className="restaurant-grid">
                {results.map((item, index) => (
                  <button className={`restaurant-card ${restaurant?.id === item.id ? "selected" : ""}`} key={item.id} onClick={() => chooseRestaurant(item)}>
                    <span className={`food-thumb thumb-${index % 4}`} aria-hidden="true"><b>{item.category.slice(0, 1)}</b></span>
                    <span className="card-body">
                      <span className="card-meta">{item.category}</span>
                      <strong>{item.name}</strong>
                      <small>{item.area}</small>
                      <span>{item.description}</span>
                    </span>
                    <i>선택 →</i>
                  </button>
                ))}
              </div>
            ) : (
              <div className="empty"><strong>검색 결과가 없어요.</strong><p>‘한식’, ‘성수’, ‘떡볶이’처럼 다른 단어로 찾아보세요.</p></div>
            )}
          </section>
        )}

        {restaurant && (
          <section className="section-block menu-section" id="menu-section">
            <div className="section-heading">
              <div><span className="section-kicker">STEP 02</span><h2>후보 메뉴를 골라주세요</h2></div>
              <p><strong>{candidates.length}</strong>개 선택됨</p>
            </div>
            <div className="chosen-restaurant">
              <div><span>{restaurant.category}</span><strong>{restaurant.name}</strong><small>{restaurant.area}</small></div>
              <button onClick={() => { setRestaurant(null); setCandidates([]); setWinner(null); }}>다른 식당</button>
            </div>
            <div className="menu-toolbar">
              <p>게임에 넣을 메뉴를 눌러 선택하거나 뺄 수 있어요.</p>
              <div>
                <button onClick={() => setCandidates(restaurant.menus.map((menu) => menu.id))}>전체 선택</button>
                <button onClick={() => { setCandidates([]); setWinner(null); }}>전체 해제</button>
              </div>
            </div>
            <div className="menu-grid">
              {restaurant.menus.map((menu) => {
                const checked = candidates.includes(menu.id);
                return (
                  <button key={menu.id} className={`menu-card ${checked ? "checked" : ""}`} onClick={() => toggleMenu(menu.id)} aria-pressed={checked}>
                    <span className="check">{checked ? "✓" : "+"}</span>
                    <strong>{menu.name}</strong>
                    <small>{menu.note}</small>
                    <b>{money(menu.price)}</b>
                  </button>
                );
              })}
            </div>
            {candidates.length < 2 && <p className="warning">게임을 시작하려면 메뉴를 2개 이상 선택해 주세요.</p>}
          </section>
        )}

        {restaurant && candidates.length >= 2 && (
          <section className="section-block game-section" id="game-section">
            <div className="section-heading">
              <div><span className="section-kicker">STEP 03</span><h2>어떤 게임으로 정할까요?</h2></div>
              <p>모든 메뉴의 당첨 확률은 같아요</p>
            </div>
            <div className="game-layout">
              <div className="game-picker" role="radiogroup" aria-label="게임 선택">
                {games.map((item) => (
                  <button key={item.id} role="radio" aria-checked={game === item.id} className={game === item.id ? "active" : ""} onClick={() => { setGame(item.id); setWinner(null); setDrawReady(false); setDrawPicked(null); setLadderOpen(false); setLadderResult(null); setLadderRungs([]); }}>
                    <span>{item.icon}</span><strong>{item.name}</strong><small>{item.copy}</small>
                  </button>
                ))}
              </div>
              <div className={`game-stage game-${game} ${playing ? "playing" : ""}`}>
                <span className="stage-label">{currentGame.name}</span>
                <div className="game-visual">
                  {game === "roulette" && (
                    <div className="roulette-area">
                      <div className="roulette-shell">
                        <div className="roulette" style={{ background: rouletteBackground, transform: `rotate(${rouletteRotation}deg)` }}>
                          {candidateMenus.map((menu, index) => {
                            const angle = (index + 0.5) * rouletteSlice;
                            const radians = (angle * Math.PI) / 180;
                            const darkSlice = [0, 2, 4].includes(index % rouletteColors.length);
                            return <b className="roulette-label" key={menu.id} style={{ left: `${50 + Math.sin(radians) * 27}%`, top: `${50 - Math.cos(radians) * 27}%`, background: rouletteColors[index % rouletteColors.length], color: darkSlice ? "white" : "var(--ink)" }}>{index + 1}</b>;
                          })}
                          <span />
                        </div>
                      </div>
                      <div className="roulette-legend" style={{ gridTemplateColumns: `repeat(${Math.min(candidateMenus.length, 3)}, 1fr)` }}>
                        {candidateMenus.map((menu, index) => <span key={menu.id}><i style={{ background: rouletteColors[index % rouletteColors.length] }}>{index + 1}</i><b title={menu.name}>{menu.name}</b></span>)}
                      </div>
                    </div>
                  )}
                  {game === "ladder" && (
                    <div className={`ladder-wrap ${ladderOpen ? "open" : "covered"}`}>
                      <div className="ladder-starts" style={{ gridTemplateColumns: `repeat(${ladderMenus.length}, 1fr)` }}>
                        {ladderMenus.map((menu, index) => (
                          <button
                            type="button"
                            key={menu.id}
                            onClick={() => runLadder(index)}
                            disabled={playing || ladderOpen}
                            aria-label={`${index + 1}번 위치에서 사다리 시작`}
                          >
                            {index + 1}
                          </button>
                        ))}
                      </div>
                      <div className="ladder-board">
                        {ladderMenus.map((menu, index) => {
                          const left = `${((index + 0.5) / ladderMenus.length) * 100}%`;
                          return (
                            <span className="ladder-column" style={{ left }} key={menu.id}>
                              <i />
                            </span>
                          );
                        })}
                        {ladderRungs.map((from, index) => from < 0 ? null : (
                          <span
                            className="ladder-rung"
                            key={`${from}-${index}`}
                            style={{
                              left: `${((from + 0.5) / ladderMenus.length) * 100}%`,
                              top: `${((index + 1) / (ladderRungs.length + 1)) * 100}%`,
                              width: `${100 / ladderMenus.length}%`,
                            }}
                          />
                        ))}
                        {playing && (
                          <span
                            className="ladder-runner"
                            style={{
                              left: `${((ladderMarker + 0.5) / ladderMenus.length) * 100}%`,
                              top: `${(ladderLevel / (ladderRungs.length + 1)) * 100}%`,
                            }}
                          />
                        )}
                        <div className="ladder-curtain" aria-hidden="true" />
                      </div>
                      <div className="ladder-results" style={{ gridTemplateColumns: `repeat(${ladderMenus.length}, 1fr)` }}>
                        {ladderMenus.map((menu, index) => {
                          const revealed = ladderOpen && !playing && ladderResult === index;
                          return <b className={revealed ? "revealed" : ""} key={menu.id} title={revealed ? menu.name : "비공개"}>{revealed ? menu.name : "?"}</b>;
                        })}
                      </div>
                    </div>
                  )}
                  {game === "draw" && (
                    <div className={`draw-cards ${playing && drawPicked === null ? "shuffling" : ""} ${drawReady ? "ready" : ""}`}>
                      {candidateMenus.slice(0, 5).map((menu, index) => (
                        <button
                          type="button"
                          className={`draw-card ${drawPicked === index ? "picked" : ""}`}
                          key={menu.id}
                          onClick={() => pickDraw(index)}
                          disabled={!drawReady || playing}
                          aria-label={`${index + 1}번 제비 선택`}
                        >
                          <span className="draw-card-inner">
                            <i className="draw-card-back"><b>{index + 1}</b><em>?</em></i>
                            <i className="draw-card-front"><em>★</em><b>당첨!</b></i>
                          </span>
                        </button>
                      ))}
                    </div>
                  )}
                  {game === "scratch" && <div className="scratch-card"><b>오늘의 메뉴</b><span>긁어서 확인</span></div>}
                  {game === "slot" && (
                    <div className="slot-area">
                      <div className="slots" key={slotRound} aria-label="메뉴 슬롯머신">
                        {slotOffsets.map((offset, reelIndex) => (
                          <div className="slot-window" key={reelIndex}>
                            <div className="slot-track" style={{ transform: `translateY(-${offset * 96}px)` }}>
                              {Array.from({ length: candidateMenus.length * 7 }, (_, step) => {
                                const menuIndex = step % candidateMenus.length;
                                const darkFace = [0, 2, 4].includes(menuIndex % rouletteColors.length);
                                return (
                                  <span
                                    className="slot-face"
                                    aria-hidden="true"
                                    key={step}
                                    style={{ background: rouletteColors[menuIndex % rouletteColors.length], color: darkFace ? "white" : "var(--ink)" }}
                                  >
                                    {menuIndex + 1}
                                  </span>
                                );
                              })}
                            </div>
                          </div>
                        ))}
                      </div>
                      <div className="slot-legend" style={{ gridTemplateColumns: `repeat(${Math.min(candidateMenus.length, 3)}, 1fr)` }}>
                        {candidateMenus.map((menu, index) => <span key={menu.id}><i style={{ background: rouletteColors[index % rouletteColors.length] }}>{index + 1}</i><b title={menu.name}>{menu.name}</b></span>)}
                      </div>
                    </div>
                  )}
                </div>
                <p>
                  {game === "ladder"
                    ? playing ? "선택한 번호에서 경로를 따라 내려가는 중이에요!" : "위의 숫자를 눌러 출발 위치를 선택하세요."
                    : game === "draw"
                    ? playing
                      ? drawPicked === null ? "제비를 골고루 섞는 중이에요…" : "선택한 제비를 확인하고 있어요!"
                      : drawReady ? "마음이 가는 제비 한 장을 직접 골라보세요." : "먼저 제비를 섞어볼까요?"
                    : playing ? "두근두근… 메뉴를 고르는 중이에요!" : `${candidateMenus.length}개 후보 중 하나를 골라볼게요.`}
                </p>
                {game !== "ladder" && (
                  <button className="play-button" onClick={runGame} disabled={playing}>
                    {game === "draw"
                      ? playing ? drawPicked === null ? "섞는 중…" : "확인 중…" : drawReady ? "다시 섞기" : "제비 섞기"
                      : playing ? "결정 중…" : `${currentGame.name} 시작`}
                  </button>
                )}
              </div>
            </div>
          </section>
        )}

        {winner && (
          <section className="result" id="result" tabIndex={-1}>
            <span className="result-kicker">오늘의 메뉴가 정해졌어요!</span>
            <div className="confetti" aria-hidden="true">✦ <i>●</i> ✦ <i>■</i> ✦</div>
            <h2>{winner.name}</h2>
            <p>{restaurant?.name} · {winner.note}</p>
            <strong>{money(winner.price)}</strong>
            <div>
              <button onClick={runGame}>같은 게임 다시하기</button>
              <button onClick={() => { setWinner(null); document.getElementById("game-section")?.scrollIntoView({ behavior: "smooth" }); }}>다른 게임 고르기</button>
              <button className="text-button" onClick={resetAll}>처음부터</button>
            </div>
          </section>
        )}
      </section>

      <footer><strong>밥픽</strong><span>고민보다 맛있는 선택</span><small>데모 데이터로 만든 메뉴 추천 MVP</small></footer>
    </main>
  );
}
