import {
  appointments,
  caseDocuments,
  courts,
  forbiddenFeatures,
  judges,
  requiredControls,
  sources
} from "./data/sampleData.js";

const app = document.querySelector("#app");
const storageKeys = {
  corrections: "judgemap:corrections",
  hiddenJudges: "judgemap:hidden-judges"
};

const state = {
  query: "",
  caseType: "전체",
  policyTab: "operation",
  toast: ""
};

function readJson(key, fallback) {
  try {
    return JSON.parse(localStorage.getItem(key)) ?? fallback;
  } catch {
    return fallback;
  }
}

function writeJson(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}

function sourceById(id) {
  return sources.find((source) => source.id === id);
}

function courtById(id) {
  return courts.find((court) => court.id === id);
}

function judgeById(id, includeHidden = false) {
  const judge = judges.find((item) => item.id === id);
  if (!judge) return undefined;
  if (includeHidden) return judge;
  return hiddenJudgeIds().includes(judge.id) ? undefined : judge;
}

function caseById(id) {
  return caseDocuments.find((item) => item.id === id);
}

function hiddenJudgeIds() {
  return readJson(storageKeys.hiddenJudges, []);
}

function visibleJudges() {
  const hidden = new Set(hiddenJudgeIds());
  return judges.filter((judge) => judge.status === "active" && !hidden.has(judge.id));
}

function corrections() {
  return readJson(storageKeys.corrections, []);
}

function normalize(text) {
  return String(text ?? "").toLowerCase().replace(/\s+/g, "");
}

function escapeHtml(value) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function route() {
  const hash = window.location.hash.replace(/^#\/?/, "");
  const [view = "", id = ""] = hash.split("/");
  return { view: view || "home", id };
}

function navigate(path) {
  window.location.hash = path;
}

function showToast(message) {
  state.toast = message;
  render();
  window.setTimeout(() => {
    state.toast = "";
    render();
  }, 2400);
}

function sourceChips(ids = []) {
  return ids
    .map(sourceById)
    .filter(Boolean)
    .map((source) => `<span class="pill safe">${escapeHtml(source.publisher)} · ${escapeHtml(source.collectedAt)}</span>`)
    .join("");
}

function sourceList(ids = []) {
  const unique = [...new Set(ids)];
  if (!unique.length) return `<p class="empty">연결된 출처가 없습니다. 공개 전 보완 대상입니다.</p>`;
  return `
    <ul class="source-list">
      ${unique
        .map((id) => {
          const source = sourceById(id);
          if (!source) return "";
          const body = `
            <span>
              <strong>${escapeHtml(source.title)}</strong>
              <small>${escapeHtml(source.publisher)} · 수집 ${escapeHtml(source.collectedAt)}</small>
            </span>
          `;
          return `<li>${
            source.url
              ? `<a href="${escapeHtml(source.url)}" target="_blank" rel="noreferrer">${body}</a>`
              : body
          }</li>`;
        })
        .join("")}
    </ul>
  `;
}

function navButton(path, label, icon, currentView) {
  const target = path.replace("#/", "");
  const current = currentView === target || (target === "" && currentView === "home");
  return `<button type="button" data-nav="${path}" aria-current="${current ? "page" : "false"}"><span aria-hidden="true">${icon}</span>${label}</button>`;
}

function shell(content) {
  const { view } = route();
  return `
    <div class="shell">
      <header class="topbar">
        <div class="topbar-inner">
          <button class="brand icon-reset" type="button" data-nav="#/">
            <span class="brand-mark" aria-hidden="true">JM</span>
            <span>
              <h1 class="brand-title">판사맵</h1>
              <p class="brand-subtitle">공개자료 기반 법관 정보 지도</p>
            </span>
          </button>
          <label class="global-search">
            <span class="hidden">법관, 법원, 사건 검색</span>
            <input id="globalQuery" value="${escapeHtml(state.query)}" placeholder="법관, 법원, 사건번호, 사건 유형 검색" />
            <span class="search-icon" aria-hidden="true">⌕</span>
          </label>
          <nav class="nav" aria-label="주요 메뉴">
            ${navButton("#/", "홈", "⌂", view)}
            ${navButton("#/map", "데모", "⌖", view)}
            ${navButton("#/judges", "법관", "§", view)}
            ${navButton("#/courts", "법원", "□", view)}
            ${navButton("#/cases", "판결", "¶", view)}
            ${navButton("#/correction", "정정", "!", view)}
            ${navButton("#/policy", "정책", "i", view)}
            ${navButton("#/admin", "관리", "◇", view)}
          </nav>
        </div>
      </header>
      <main class="main">
        <section class="status-strip" aria-label="서비스 원칙">
          <p>
            <strong>v0 원칙:</strong>
            리뷰·별점·댓글 없이 공개자료, 출처, AI 요약 고지, 정정 요청을 먼저 검증합니다.
          </p>
          <div class="pill-row">
            <span class="pill stop">별점 없음</span>
            <span class="pill stop">댓글 없음</span>
            <span class="pill safe">출처 우선</span>
            <span class="pill warn">데모 데이터</span>
          </div>
        </section>
        ${content}
      </main>
      ${state.toast ? `<div class="toast" role="status">${escapeHtml(state.toast)}</div>` : ""}
    </div>
  `;
}

function landingView() {
  return shell(`
    <section class="landing-hero" aria-label="판사맵 소개">
      <div class="landing-copy">
        <span class="hero-kicker">사법정보 접근성 프로젝트</span>
        <h1 class="hero-title">판사맵</h1>
        <p class="hero-subtitle">공개자료 기반 법관 정보 지도</p>
        <p class="hero-copy">
          판사맵은 공개된 법관 인사자료, 판결문, 재판부 정보를 시민이 쉽게 확인할 수 있도록 정리하는
          사법정보 플랫폼입니다.
        </p>
        <div class="hero-actions">
          <button class="solid-button" type="button" data-nav="#/map">데모 보기</button>
          <button class="ghost-button" type="button" data-nav="#/correction">정정 요청 창구</button>
        </div>
        <div class="pill-row">
          <span class="pill stop">별점 없음</span>
          <span class="pill stop">익명 리뷰 없음</span>
          <span class="pill stop">댓글 없음</span>
          <span class="pill safe">출처 기반</span>
          <span class="pill safe">AI 요약 고지</span>
        </div>
      </div>
      <div class="prep-panel">
        <div class="prep-panel-header">
          <strong>현재 준비 중</strong>
          <span class="pill warn">v0</span>
        </div>
        <ul class="prep-list">
          <li><span>01</span> 법관 검색</li>
          <li><span>02</span> 법원·재판부별 정보</li>
          <li><span>03</span> 공개 판결문 링크</li>
          <li><span>04</span> AI 판결 요약</li>
          <li><span>05</span> 출처 기반 정보 표시</li>
          <li><span>06</span> 정정 요청 창구</li>
        </ul>
      </div>
    </section>

    <section class="notice-band">
      <div>
        <h2>판사맵은 판사 리뷰 사이트가 아닙니다.</h2>
        <p>판사맵은 진행 중 사건에 대한 압박, 특정 개인에 대한 비난, 별점·댓글·익명 리뷰 기능을 제공하지 않습니다.</p>
      </div>
      <button class="ghost-button" type="button" data-nav="#/policy">운영 원칙 보기</button>
    </section>

    <section class="grid landing-grid">
      <div class="panel">
        <div class="panel-header">
          <div>
            <h2>프로젝트 원칙</h2>
            <p>초기 버전은 공개자료 기반 정보 제공과 정정 요청 흐름에 집중합니다.</p>
          </div>
        </div>
        <div class="panel-body">
          <ol class="prep-steps">
            <li><strong>공개자료 기반</strong><span>법관 인사자료, 판결문, 재판부 정보를 출처와 함께 표시</span></li>
            <li><strong>원문 우선</strong><span>AI 요약은 참고용이며 정확한 내용은 원문 확인을 안내</span></li>
            <li><strong>정정 요청</strong><span>오류, 최신 정보, 삭제·비공개 요청을 운영자가 검토</span></li>
            <li><strong>제한 기능 명시</strong><span>리뷰·별점·댓글·익명 리뷰 기능은 제공하지 않음</span></li>
          </ol>
        </div>
      </div>

      <div class="panel">
        <div class="panel-header">
          <div>
            <h2>v0에서 열지 않는 기능</h2>
            <p>이 금지선이 첫 인상을 결정합니다.</p>
          </div>
        </div>
        <div class="panel-body">
          <div class="pill-row">
            ${forbiddenFeatures.slice(0, 8).map((item) => `<span class="pill stop">${escapeHtml(item)}</span>`).join("")}
          </div>
        </div>
      </div>
    </section>
  `);
}

function mapView() {
  const judgesList = visibleJudges();
  const latestCases = [...caseDocuments].sort((a, b) => b.decisionDate.localeCompare(a.decisionDate)).slice(0, 5);
  const matches = searchEverything(state.query).slice(0, 7);

  return shell(`
    <div class="grid dashboard-grid">
      <section class="panel">
        <div class="panel-header">
          <div>
            <h2>법원별 공개자료 지도</h2>
            <p>샘플 법원 5곳과 연결된 법관·판결 데이터를 탐색합니다.</p>
          </div>
          <button class="ghost-button" type="button" data-nav="#/courts">법원 목록</button>
        </div>
        <div class="panel-body">
          <div class="map-board" role="img" aria-label="샘플 법원 위치 지도">
            <div class="map-path" aria-hidden="true"></div>
            ${courts
              .map((court, index) => {
                const count = judgesList.filter((judge) => judge.currentCourtId === court.id).length;
                return `
                  <button class="court-pin ${court.mapClass}" type="button" data-nav="#/court/${court.id}">
                    <span class="pin-dot" aria-hidden="true">${index + 1}</span>
                    <span>
                      <strong>${escapeHtml(court.name)}</strong>
                      <span>${escapeHtml(court.region)} · 법관 ${count}명</span>
                    </span>
                  </button>
                `;
              })
              .join("")}
          </div>
          <div class="metric-row">
            <div class="metric"><strong>${judgesList.length}</strong><span>공개 법관 샘플</span></div>
            <div class="metric"><strong>${courts.length}</strong><span>법원 샘플</span></div>
            <div class="metric"><strong>${caseDocuments.length}</strong><span>판결문 링크</span></div>
            <div class="metric"><strong>${sources.length}</strong><span>출처 레코드</span></div>
          </div>
        </div>
      </section>

      <aside class="grid">
        <section class="panel">
          <div class="panel-header">
            <div>
              <h3>통합 검색</h3>
              <p>첫 화면에서 바로 사람·법원·판결을 찾는 구조입니다.</p>
            </div>
          </div>
          <div class="panel-body">
            <div class="item-list">
              ${matches.length ? matches.map(searchResultCard).join("") : `<p class="empty">검색어를 입력하면 결과가 여기에 표시됩니다.</p>`}
            </div>
          </div>
        </section>

        <section class="panel">
          <div class="panel-header">
            <div>
              <h3>최근 판결 요약</h3>
              <p>AI는 평가하지 않고 공개자료 요약만 표시합니다.</p>
            </div>
          </div>
          <div class="panel-body item-list">
            ${latestCases.map(caseCard).join("")}
          </div>
        </section>

        <section class="panel">
          <div class="panel-header">
            <div>
              <h3>v0 금지선</h3>
              <p>제품 표면에 노출하지 않는 기능입니다.</p>
            </div>
          </div>
          <div class="panel-body">
            <div class="pill-row">
              ${forbiddenFeatures.map((item) => `<span class="pill stop">${escapeHtml(item)}</span>`).join("")}
            </div>
          </div>
        </section>
      </aside>
    </div>
  `);
}

function searchEverything(query) {
  const q = normalize(query);
  if (!q) return [];
  const results = [];
  visibleJudges().forEach((judge) => {
    const court = courtById(judge.currentCourtId);
    const haystack = normalize([judge.name, judge.currentDivision, judge.currentTitle, judge.tags.join(" "), court?.name].join(" "));
    if (haystack.includes(q)) results.push({ type: "judge", id: judge.id, title: judge.name, meta: `${court?.name ?? ""} · ${judge.currentDivision}` });
  });
  courts.forEach((court) => {
    const haystack = normalize([court.name, court.type, court.region, court.address].join(" "));
    if (haystack.includes(q)) results.push({ type: "court", id: court.id, title: court.name, meta: `${court.region} · ${court.type}` });
  });
  caseDocuments.forEach((doc) => {
    const haystack = normalize([doc.title, doc.caseNumber, doc.caseType, doc.courtName, doc.summary].join(" "));
    if (haystack.includes(q)) results.push({ type: "case", id: doc.id, title: doc.title, meta: `${doc.caseNumber} · ${doc.caseType}` });
  });
  return results;
}

function searchResultCard(result) {
  const label = result.type === "judge" ? "법관" : result.type === "court" ? "법원" : "판결";
  const target = result.type === "judge" ? `#/judge/${result.id}` : result.type === "court" ? `#/court/${result.id}` : `#/case/${result.id}`;
  return `
    <button class="result-card" type="button" data-nav="${target}">
      <div class="result-topline">
        <h3 class="result-title">${escapeHtml(result.title)}</h3>
        <span class="pill">${label}</span>
      </div>
      <p class="fineprint">${escapeHtml(result.meta)}</p>
    </button>
  `;
}

function judgeCard(judge) {
  const court = courtById(judge.currentCourtId);
  const cases = caseDocuments.filter((doc) => doc.judgeIds.includes(judge.id));
  return `
    <button class="result-card" type="button" data-nav="#/judge/${judge.id}">
      <div class="result-topline">
        <h3 class="result-title">${escapeHtml(judge.name)}</h3>
        <span class="pill safe">${escapeHtml(judge.currentTitle)}</span>
      </div>
      <p class="result-meta">${escapeHtml(court?.name ?? "소속 법원 미상")} · ${escapeHtml(judge.currentDivision)}</p>
      <div class="pill-row">
        ${judge.tags.map((tag) => `<span class="pill">${escapeHtml(tag)}</span>`).join("")}
        <span class="pill">판결 ${cases.length}건</span>
      </div>
      <div class="pill-row">${sourceChips(judge.sourceIds)}</div>
    </button>
  `;
}

function caseCard(doc) {
  return `
    <button class="result-card" type="button" data-nav="#/case/${doc.id}">
      <div class="result-topline">
        <h3 class="result-title">${escapeHtml(doc.title)}</h3>
        <span class="pill">${escapeHtml(doc.caseType)}</span>
      </div>
      <p class="result-meta">${escapeHtml(doc.caseNumber)} · ${escapeHtml(doc.courtName)} · ${escapeHtml(doc.decisionDate)}</p>
      <p class="fineprint">${escapeHtml(doc.summary)}</p>
    </button>
  `;
}

function judgesView() {
  const q = normalize(state.query);
  const list = visibleJudges().filter((judge) => {
    const court = courtById(judge.currentCourtId);
    return normalize([judge.name, judge.currentTitle, judge.currentDivision, court?.name, judge.tags.join(" ")].join(" ")).includes(q);
  });

  return shell(`
    <section class="panel">
      <div class="panel-header">
        <div>
          <h2>법관 디렉토리</h2>
          <p>소속, 재판부, 공개 인사자료 출처만 표시합니다. 리뷰·별점·댓글은 없습니다.</p>
        </div>
        <button class="solid-button" type="button" data-nav="#/correction">정정 요청</button>
      </div>
      <div class="panel-body">
        <div class="grid list-grid">
          ${list.length ? list.map(judgeCard).join("") : `<p class="empty">조건에 맞는 법관 데이터가 없습니다.</p>`}
        </div>
      </div>
    </section>
  `);
}

function judgeDetailView(id) {
  const judge = judgeById(id);
  if (!judge) return notFoundView("법관 정보를 찾을 수 없거나 비공개 처리되었습니다.");
  const court = courtById(judge.currentCourtId);
  const history = appointments.filter((item) => item.judgeId === judge.id);
  const cases = caseDocuments.filter((doc) => doc.judgeIds.includes(judge.id));

  return shell(`
    <div class="grid detail-grid">
      <section class="grid">
        <div class="detail-hero">
          <div class="pill-row">
            <span class="pill warn">가상 데모 데이터</span>
            <span class="pill stop">평가 문장 없음</span>
          </div>
          <h1>${escapeHtml(judge.name)}</h1>
          <p class="result-meta">${escapeHtml(court?.name ?? "소속 법원 미상")} · ${escapeHtml(judge.currentDivision)} · ${escapeHtml(judge.currentTitle)}</p>
          <p class="fineprint">${escapeHtml(judge.bioSummary)}</p>
          <div class="pill-row">
            ${judge.tags.map((tag) => `<span class="pill">${escapeHtml(tag)}</span>`).join("")}
          </div>
        </div>

        <section class="panel">
          <div class="panel-header">
            <div>
              <h2>공개 인사이력</h2>
              <p>v0에서는 공개 출처로 확인 가능한 업무상 정보만 표시합니다.</p>
            </div>
          </div>
          <div class="panel-body">
            <ul class="timeline">
              ${history
                .map((item) => {
                  const itemCourt = courtById(item.courtId);
                  return `
                    <li>
                      <strong>${escapeHtml(itemCourt?.name ?? "")} · ${escapeHtml(item.division)} · ${escapeHtml(item.title)}</strong>
                      <span>${escapeHtml(item.startDate)} - ${escapeHtml(item.endDate || "현재")}</span>
                    </li>
                  `;
                })
                .join("")}
            </ul>
          </div>
        </section>

        <section class="panel">
          <div class="panel-header">
            <div>
              <h2>연결 판결문</h2>
              <p>AI 요약은 참고용이며 원문 확인을 우선합니다.</p>
            </div>
          </div>
          <div class="panel-body item-list">
            ${cases.length ? cases.map(caseCard).join("") : `<p class="empty">연결된 공개 판결문이 없습니다.</p>`}
          </div>
        </section>
      </section>

      <aside class="grid">
        <section class="panel">
          <div class="panel-header"><h3>출처</h3></div>
          <div class="panel-body">${sourceList(judge.sourceIds)}</div>
        </section>
        <section class="panel">
          <div class="panel-header"><h3>정정·삭제 요청</h3></div>
          <div class="panel-body">
            <p class="fineprint">출처 오류, 소속 변경, 비공개 필요 정보가 있으면 정정 요청으로 남깁니다.</p>
            <button class="solid-button" type="button" data-prefill="Judge:${judge.id}" data-nav="#/correction">이 법관 정보 정정 요청</button>
          </div>
        </section>
      </aside>
    </div>
  `);
}

function courtsView() {
  return shell(`
    <section class="panel">
      <div class="panel-header">
        <div>
          <h2>법원별 목록</h2>
          <p>법원, 재판부, 연결 법관·판결을 묶어 탐색합니다.</p>
        </div>
      </div>
      <div class="panel-body grid list-grid">
        ${courts
          .map((court) => {
            const judgeCount = visibleJudges().filter((judge) => judge.currentCourtId === court.id).length;
            const caseCount = caseDocuments.filter((doc) => doc.courtName === court.name).length;
            return `
              <button class="result-card" type="button" data-nav="#/court/${court.id}">
                <div class="result-topline">
                  <h3 class="result-title">${escapeHtml(court.name)}</h3>
                  <span class="pill">${escapeHtml(court.type)}</span>
                </div>
                <p class="result-meta">${escapeHtml(court.region)} · ${escapeHtml(court.address)}</p>
                <div class="pill-row">
                  <span class="pill safe">법관 ${judgeCount}명</span>
                  <span class="pill">판결 ${caseCount}건</span>
                </div>
              </button>
            `;
          })
          .join("")}
      </div>
    </section>
  `);
}

function courtDetailView(id) {
  const court = courtById(id);
  if (!court) return notFoundView("법원 정보를 찾을 수 없습니다.");
  const courtJudges = visibleJudges().filter((judge) => judge.currentCourtId === court.id);
  const courtCases = caseDocuments.filter((doc) => doc.courtName === court.name);

  return shell(`
    <div class="grid detail-grid">
      <section class="grid">
        <div class="detail-hero">
          <div class="pill-row"><span class="pill safe">${escapeHtml(court.type)}</span><span class="pill">${escapeHtml(court.region)}</span></div>
          <h1>${escapeHtml(court.name)}</h1>
          <p class="result-meta">${escapeHtml(court.address)}</p>
        </div>
        <section class="panel">
          <div class="panel-header"><h2>소속 법관</h2></div>
          <div class="panel-body grid list-grid">
            ${courtJudges.length ? courtJudges.map(judgeCard).join("") : `<p class="empty">연결된 법관 데이터가 없습니다.</p>`}
          </div>
        </section>
        <section class="panel">
          <div class="panel-header"><h2>연결 판결문</h2></div>
          <div class="panel-body item-list">
            ${courtCases.length ? courtCases.map(caseCard).join("") : `<p class="empty">연결된 판결문 데이터가 없습니다.</p>`}
          </div>
        </section>
      </section>
      <aside class="panel">
        <div class="panel-header"><h3>출처</h3></div>
        <div class="panel-body">${sourceList(court.sourceIds)}</div>
      </aside>
    </div>
  `);
}

function casesView() {
  const types = ["전체", ...new Set(caseDocuments.map((doc) => doc.caseType))];
  const q = normalize(state.query);
  const docs = caseDocuments.filter((doc) => {
    const typeOk = state.caseType === "전체" || doc.caseType === state.caseType;
    const qOk = normalize([doc.title, doc.caseNumber, doc.courtName, doc.caseType, doc.summary].join(" ")).includes(q);
    return typeOk && qOk;
  });

  return shell(`
    <section class="panel">
      <div class="panel-header">
        <div>
          <h2>판결문 링크·AI 요약</h2>
          <p>AI 요약은 판결 원문을 대체하지 않으며, 법관 성향 판단을 생성하지 않습니다.</p>
        </div>
      </div>
      <div class="panel-body">
        <div class="filter-bar" role="tablist" aria-label="사건 유형">
          ${types.map((type) => `<button type="button" data-case-type="${escapeHtml(type)}" aria-pressed="${state.caseType === type}">${escapeHtml(type)}</button>`).join("")}
        </div>
        <div class="item-list">
          ${docs.length ? docs.map(caseCard).join("") : `<p class="empty">조건에 맞는 판결문 데이터가 없습니다.</p>`}
        </div>
      </div>
    </section>
  `);
}

function caseDetailView(id) {
  const doc = caseById(id);
  if (!doc) return notFoundView("판결문 정보를 찾을 수 없습니다.");
  const linkedJudges = doc.judgeIds.map((judgeId) => judgeById(judgeId)).filter(Boolean);

  return shell(`
    <div class="grid detail-grid">
      <section class="grid">
        <div class="detail-hero">
          <div class="pill-row">
            <span class="pill">${escapeHtml(doc.caseType)}</span>
            <span class="pill safe">${escapeHtml(doc.decisionDate)}</span>
          </div>
          <h1>${escapeHtml(doc.title)}</h1>
          <p class="result-meta">${escapeHtml(doc.caseNumber)} · ${escapeHtml(doc.courtName)}</p>
        </div>
        <section class="panel">
          <div class="panel-header">
            <div>
              <h2>AI 요약</h2>
              <p>${escapeHtml(doc.aiSummaryDisclaimer)}</p>
            </div>
          </div>
          <div class="panel-body">
            <div class="case-summary">
              <strong>참고용 요약</strong>
              ${escapeHtml(doc.summary)}
            </div>
          </div>
        </section>
        <section class="panel">
          <div class="panel-header"><h2>담당 법관 연결</h2></div>
          <div class="panel-body grid list-grid">
            ${linkedJudges.length ? linkedJudges.map(judgeCard).join("") : `<p class="empty">공개 가능한 연결 법관 정보가 없습니다.</p>`}
          </div>
        </section>
      </section>
      <aside class="grid">
        <section class="panel">
          <div class="panel-header"><h3>원문·출처</h3></div>
          <div class="panel-body">
            <p class="fineprint">원문 해시: ${escapeHtml(doc.originalTextHash)}</p>
            <p><a class="solid-button" href="${escapeHtml(doc.sourceUrl)}" target="_blank" rel="noreferrer">원문 검색 열기</a></p>
            ${sourceList(doc.sourceIds)}
          </div>
        </section>
        <section class="panel">
          <div class="panel-header"><h3>요약 금지선</h3></div>
          <div class="panel-body">
            <div class="pill-row">
              <span class="pill stop">성향 단정 금지</span>
              <span class="pill stop">유불리 판단 금지</span>
              <span class="pill stop">평판 표현 금지</span>
            </div>
          </div>
        </section>
      </aside>
    </div>
  `);
}

function correctionView() {
  const items = corrections();
  return shell(`
    <div class="grid detail-grid">
      <section class="panel">
        <div class="panel-header">
          <div>
            <h2>정정 요청</h2>
            <p>출처 오류, 최신 인사 반영, 삭제·비공개 요청을 접수하는 v0 필수 흐름입니다.</p>
          </div>
        </div>
        <div class="panel-body">
          <form id="correctionForm" class="form-grid">
            <div class="field">
              <label for="targetType">대상 유형</label>
              <select id="targetType" required>
                <option value="Judge">법관</option>
                <option value="Court">법원</option>
                <option value="CaseDocument">판결문</option>
                <option value="Policy">운영정책</option>
              </select>
            </div>
            <div class="field">
              <label for="targetId">대상 ID 또는 URL</label>
              <input id="targetId" required placeholder="예: judge-demo-01 또는 원문 URL" />
            </div>
            <div class="field">
              <label for="requesterEmail">회신 이메일</label>
              <input id="requesterEmail" type="email" required placeholder="name@example.com" />
            </div>
            <div class="field">
              <label for="content">요청 내용</label>
              <textarea id="content" required placeholder="오류 내용, 정정 근거, 삭제·비공개 요청 사유를 적어주세요."></textarea>
            </div>
            <button class="solid-button" type="submit">요청 접수</button>
          </form>
        </div>
      </section>

      <aside class="grid">
        <section class="panel">
          <div class="panel-header"><h3>처리 원칙</h3></div>
          <div class="panel-body policy-section">
            <ul>
              <li>접수 즉시 상태값은 pending으로 기록합니다.</li>
              <li>출처 확인 전까지 평가성 문구를 추가하지 않습니다.</li>
              <li>사생활 정보는 확인 즉시 비공개 처리 대상입니다.</li>
              <li>분쟁성 요청은 법률 검토 큐로 분리합니다.</li>
            </ul>
          </div>
        </section>
        <section class="panel">
          <div class="panel-header"><h3>로컬 접수 큐</h3></div>
          <div class="panel-body item-list">
            ${items.length ? items.map(correctionCard).join("") : `<p class="empty">아직 접수된 요청이 없습니다.</p>`}
          </div>
        </section>
      </aside>
    </div>
  `);
}

function correctionCard(item) {
  return `
    <div class="result-card">
      <div class="result-topline">
        <h3 class="result-title">${escapeHtml(item.targetType)} · ${escapeHtml(item.targetId)}</h3>
        <span class="pill warn">${escapeHtml(item.status)}</span>
      </div>
      <p class="fineprint">${escapeHtml(item.content)}</p>
      <p class="result-meta">${escapeHtml(item.requesterEmail)} · ${escapeHtml(item.createdAt)}</p>
    </div>
  `;
}

function policyView() {
  const tabs = [
    ["operation", "운영 원칙"],
    ["privacy", "개인정보"],
    ["ai", "AI 요약"],
    ["expansion", "확장 조건"]
  ];

  const tabBody = {
    operation: `
      <section class="policy-section">
        <h2>운영 원칙 초안</h2>
        <p>판사맵은 판사 리뷰 사이트가 아닙니다.</p>
        <p>판사맵은 공개자료 기반 정보 제공에 집중합니다. 모든 법관·재판부·판결 정보는 출처와 수집일을 함께 표시합니다.</p>
        <p>AI 요약은 참고용이며, 정확한 내용은 원문을 확인해야 합니다.</p>
        <p>정정·삭제 요청은 운영자가 검토 후 반영합니다.</p>
        <p>판사맵은 진행 중 사건에 대한 압박, 특정 개인에 대한 비난, 별점·댓글·익명 리뷰 기능을 제공하지 않습니다.</p>
        <h3>v0에서 하지 않는 일</h3>
        <div class="pill-row">${forbiddenFeatures.map((item) => `<span class="pill stop">${escapeHtml(item)}</span>`).join("")}</div>
        <h3>반드시 하는 일</h3>
        <div class="pill-row">${requiredControls.map((item) => `<span class="pill safe">${escapeHtml(item)}</span>`).join("")}</div>
      </section>
    `,
    privacy: `
      <section class="policy-section">
        <h2>개인정보 처리방침 초안</h2>
        <p>법관 이름, 소속, 직위, 재판부, 공개 인사이력은 공개자료 기반으로만 처리합니다. 가족, 주소, 연락처, 사진, 사생활, 학력 세부 등 업무상 필요가 없는 정보는 수집하지 않습니다.</p>
        <ul>
          <li>수집 목적: 공개 사법정보 검색과 출처 확인</li>
          <li>보유 기준: 공개 출처 유지 여부와 정정 요청 처리 결과에 따름</li>
          <li>정정·삭제: 요청 접수 후 출처 확인, 필요 시 임시 비공개</li>
          <li>제3자 제공: v0에서는 제공하지 않음</li>
        </ul>
        <p class="fineprint">이 문서는 제품 검토용 초안이며 공개 전 개인정보·명예훼손 전문 법률 검토가 필요합니다.</p>
      </section>
    `,
    ai: `
      <section class="policy-section">
        <h2>AI 요약 정책</h2>
        <p>AI는 판결문이나 공개자료를 읽기 쉽게 요약하는 용도로만 사용합니다. 법관 성향, 유불리 경향, 정치적 판단, 인격 평가를 생성하지 않습니다.</p>
        <div class="case-summary">
          <strong>필수 고지 문구</strong>
          이 요약은 AI가 공개자료를 바탕으로 생성한 참고용 요약입니다. 정확한 내용은 반드시 원문을 확인하십시오.
        </div>
        <ul>
          <li>원문 링크 없는 요약 금지</li>
          <li>판단 이유와 주문을 분리해 사실 중심으로 요약</li>
          <li>모호한 내용은 원문 확인 안내로 처리</li>
          <li>평가성 형용사와 단정 표현 필터링</li>
        </ul>
      </section>
    `,
    expansion: `
      <section class="policy-section">
        <h2>확장 기능 잠금</h2>
        <p>비공개 제보와 절차 평가는 서비스 신뢰, 운영 인력, 법률 자문, 검수 프로세스가 갖춰진 뒤 feature flag로만 검토합니다.</p>
        <ul>
          <li>비공개 제보는 외부 공개가 아니라 운영자 검수 큐로만 수집</li>
          <li>진행 중 사건 압박성 제보 금지</li>
          <li>별점 대신 절차 보장 여부를 묻는 문항형 구조만 검토</li>
          <li>공개 전 표현 위험성 별도 점검</li>
        </ul>
      </section>
    `
  };

  return shell(`
    <section class="panel">
      <div class="panel-header">
        <div>
          <h2>운영정책 / 법적 고지</h2>
          <p>개발 전 위험선을 문서화하는 Phase 0 산출물의 화면 버전입니다.</p>
        </div>
      </div>
      <div class="panel-body">
        <div class="filter-bar" role="tablist" aria-label="정책 탭">
          ${tabs
            .map(
              ([id, label]) =>
                `<button class="tab-button" type="button" data-policy-tab="${id}" aria-selected="${state.policyTab === id}">${label}</button>`
            )
            .join("")}
        </div>
        ${tabBody[state.policyTab]}
      </div>
    </section>
  `);
}

function adminView() {
  const hidden = hiddenJudgeIds();
  const pending = corrections();
  const sourceCoverage = judges.filter((judge) => judge.sourceIds.length > 0).length;

  return shell(`
    <div class="grid detail-grid">
      <section class="panel">
        <div class="panel-header">
          <div>
            <h2>관리자 콘솔 프로토타입</h2>
            <p>정적 MVP라 인증은 붙이지 않았지만, v0 필수 관리 동작을 로컬 상태로 검증합니다.</p>
          </div>
        </div>
        <div class="panel-body">
          <table class="admin-table">
            <thead>
              <tr>
                <th>법관</th>
                <th>현재 소속</th>
                <th>상태</th>
                <th>관리</th>
              </tr>
            </thead>
            <tbody>
              ${judges
                .map((judge) => {
                  const court = courtById(judge.currentCourtId);
                  const isHidden = hidden.includes(judge.id);
                  return `
                    <tr>
                      <td>${escapeHtml(judge.name)}</td>
                      <td>${escapeHtml(court?.name ?? "")} · ${escapeHtml(judge.currentDivision)}</td>
                      <td><span class="pill ${isHidden ? "warn" : "safe"}">${isHidden ? "비공개" : "공개"}</span></td>
                      <td>
                        <button class="${isHidden ? "ghost-button" : "danger-button"}" type="button" data-toggle-hidden="${judge.id}">
                          ${isHidden ? "공개 복구" : "비공개 처리"}
                        </button>
                      </td>
                    </tr>
                  `;
                })
                .join("")}
            </tbody>
          </table>
        </div>
      </section>

      <aside class="grid">
        <section class="panel">
          <div class="panel-header"><h3>품질 체크</h3></div>
          <div class="panel-body">
            <div class="metric-row" style="grid-template-columns: 1fr 1fr;">
              <div class="metric"><strong>${sourceCoverage}/${judges.length}</strong><span>법관 출처 연결</span></div>
              <div class="metric"><strong>${pending.length}</strong><span>정정 요청</span></div>
            </div>
          </div>
        </section>
        <section class="panel">
          <div class="panel-header"><h3>수집 출처</h3></div>
          <div class="panel-body">${sourceList(sources.map((source) => source.id))}</div>
        </section>
      </aside>
    </div>
  `);
}

function notFoundView(message) {
  return shell(`
    <section class="panel">
      <div class="panel-body">
        <p class="empty">${escapeHtml(message)}</p>
        <button class="ghost-button" type="button" data-nav="#/">지도로 돌아가기</button>
      </div>
    </section>
  `);
}

function currentView() {
  const { view, id } = route();
  if (view === "home") return landingView();
  if (view === "map") return mapView();
  if (view === "judges") return judgesView();
  if (view === "judge") return judgeDetailView(id);
  if (view === "courts") return courtsView();
  if (view === "court") return courtDetailView(id);
  if (view === "cases") return casesView();
  if (view === "case") return caseDetailView(id);
  if (view === "correction") return correctionView();
  if (view === "policy") return policyView();
  if (view === "admin") return adminView();
  return homeView();
}

function render() {
  app.innerHTML = currentView();
  bindEvents();
}

function bindEvents() {
  document.querySelectorAll("[data-nav]").forEach((element) => {
    element.addEventListener("click", () => navigate(element.dataset.nav));
  });

  const queryInput = document.querySelector("#globalQuery");
  if (queryInput) {
    queryInput.addEventListener("input", (event) => {
      state.query = event.target.value;
      render();
      const next = document.querySelector("#globalQuery");
      next?.focus();
      next?.setSelectionRange(state.query.length, state.query.length);
    });
  }

  document.querySelectorAll("[data-case-type]").forEach((button) => {
    button.addEventListener("click", () => {
      state.caseType = button.dataset.caseType;
      render();
    });
  });

  document.querySelectorAll("[data-policy-tab]").forEach((button) => {
    button.addEventListener("click", () => {
      state.policyTab = button.dataset.policyTab;
      render();
    });
  });

  document.querySelectorAll("[data-toggle-hidden]").forEach((button) => {
    button.addEventListener("click", () => {
      const id = button.dataset.toggleHidden;
      const hidden = new Set(hiddenJudgeIds());
      if (hidden.has(id)) {
        hidden.delete(id);
        showToast("공개 상태로 복구했습니다.");
      } else {
        hidden.add(id);
        showToast("법관 정보를 비공개 처리했습니다.");
      }
      writeJson(storageKeys.hiddenJudges, [...hidden]);
      render();
    });
  });

  const form = document.querySelector("#correctionForm");
  if (form) {
    form.addEventListener("submit", (event) => {
      event.preventDefault();
      const item = {
        id: crypto.randomUUID(),
        targetType: document.querySelector("#targetType").value,
        targetId: document.querySelector("#targetId").value.trim(),
        requesterEmail: document.querySelector("#requesterEmail").value.trim(),
        content: document.querySelector("#content").value.trim(),
        status: "pending",
        createdAt: new Date().toISOString()
      };
      writeJson(storageKeys.corrections, [item, ...corrections()]);
      showToast("정정 요청을 접수했습니다.");
      navigate("#/correction");
    });
  }
}

window.addEventListener("hashchange", render);
render();
