export const sources = [
  {
    id: "src-demo",
    sourceType: "demo",
    title: "판사맵 데모 입력 자료",
    url: "./docs/policy.md",
    publisher: "Pansamap prototype",
    publishedAt: "2026-04-30",
    collectedAt: "2026-04-30",
    reliabilityLevel: "prototype",
    note: "이 프로토타입의 법관·사건 데이터는 실존 인물 평가가 아닌 화면 검증용 가상 데이터입니다."
  },
  {
    id: "src-scourt",
    sourceType: "portal",
    title: "대법원 사법정보공개포털",
    url: "https://portal.scourt.go.kr/pgp/index.on?c=900&l=N&m=PGP101M02",
    publisher: "대한민국 법원",
    publishedAt: "",
    collectedAt: "2026-04-30",
    reliabilityLevel: "official"
  },
  {
    id: "src-lawgo",
    sourceType: "precedent",
    title: "국가법령정보센터 판례 검색",
    url: "https://www.law.go.kr/precSc.do?menuId=7",
    publisher: "법제처",
    publishedAt: "",
    collectedAt: "2026-04-30",
    reliabilityLevel: "official"
  },
  {
    id: "src-kba-judge",
    sourceType: "association",
    title: "대한변협 2023년 법관평가 사례집 보도자료",
    url: "https://koreanbar.or.kr/pages/news/view.asp?category=&page=1&searchstr=&searchtype=&seq=13757&teamcode=&types=3",
    publisher: "대한변호사협회",
    publishedAt: "2024-01-29",
    collectedAt: "2026-04-30",
    reliabilityLevel: "public"
  },
  {
    id: "src-lawtimes-appointments",
    sourceType: "news",
    title: "법률신문 법관 인사발령 공개 자료",
    url: "https://www.lawtimes.co.kr/news/articleView.html?idxno=215857",
    publisher: "법률신문",
    publishedAt: "2026-02-03",
    collectedAt: "2026-04-30",
    reliabilityLevel: "public"
  }
];

export const courts = [
  {
    id: "court-seoul-central",
    name: "서울중앙지방법원",
    type: "지방법원",
    region: "서울",
    address: "서울 서초구 서초중앙로 157",
    sourceIds: ["src-scourt"],
    mapClass: "pin-seoul"
  },
  {
    id: "court-seoul-publiclaw",
    name: "서울행정법원",
    type: "전문법원",
    region: "서울",
    address: "서울 서초구 강남대로 193",
    sourceIds: ["src-scourt"],
    mapClass: "pin-publiclaw"
  },
  {
    id: "court-daejeon",
    name: "대전지방법원",
    type: "지방법원",
    region: "대전",
    address: "대전 서구 둔산중로78번길 45",
    sourceIds: ["src-scourt"],
    mapClass: "pin-daejeon"
  },
  {
    id: "court-busan",
    name: "부산지방법원",
    type: "지방법원",
    region: "부산",
    address: "부산 연제구 법원로 31",
    sourceIds: ["src-scourt"],
    mapClass: "pin-busan"
  },
  {
    id: "court-gwangju",
    name: "광주지방법원",
    type: "지방법원",
    region: "광주",
    address: "광주 동구 준법로 7-12",
    sourceIds: ["src-scourt"],
    mapClass: "pin-gwangju"
  }
];

export const judges = [
  {
    id: "judge-demo-01",
    name: "데모 법관 01",
    normalizedName: "demo-judge-01",
    currentCourtId: "court-seoul-central",
    currentDivision: "민사합의12부",
    currentTitle: "부장판사",
    bioSummary: "공개 인사자료 기반의 현재 소속·직위만 노출하는 상세 화면 예시입니다.",
    status: "active",
    sourceIds: ["src-demo", "src-lawtimes-appointments"],
    tags: ["민사", "상사"]
  },
  {
    id: "judge-demo-02",
    name: "데모 법관 02",
    normalizedName: "demo-judge-02",
    currentCourtId: "court-seoul-central",
    currentDivision: "형사합의21부",
    currentTitle: "판사",
    bioSummary: "판결 링크와 사건 유형 태그를 연결하는 화면 검증용 데이터입니다.",
    status: "active",
    sourceIds: ["src-demo"],
    tags: ["형사", "경제"]
  },
  {
    id: "judge-demo-03",
    name: "데모 법관 03",
    normalizedName: "demo-judge-03",
    currentCourtId: "court-seoul-publiclaw",
    currentDivision: "행정4부",
    currentTitle: "부장판사",
    bioSummary: "행정 사건 중심 법관 상세 페이지의 표시 구조를 확인하기 위한 항목입니다.",
    status: "active",
    sourceIds: ["src-demo"],
    tags: ["행정", "조세"]
  },
  {
    id: "judge-demo-04",
    name: "데모 법관 04",
    normalizedName: "demo-judge-04",
    currentCourtId: "court-daejeon",
    currentDivision: "민사단독8부",
    currentTitle: "판사",
    bioSummary: "단독 재판부 페이지와 법원별 목록을 점검하기 위한 가상 데이터입니다.",
    status: "active",
    sourceIds: ["src-demo"],
    tags: ["민사", "손해배상"]
  },
  {
    id: "judge-demo-05",
    name: "데모 법관 05",
    normalizedName: "demo-judge-05",
    currentCourtId: "court-busan",
    currentDivision: "가사2부",
    currentTitle: "판사",
    bioSummary: "개인 사생활이 아닌 업무상 공개 정보만 남기는 정책을 보여주는 예시입니다.",
    status: "active",
    sourceIds: ["src-demo"],
    tags: ["가사", "비송"]
  },
  {
    id: "judge-demo-06",
    name: "데모 법관 06",
    normalizedName: "demo-judge-06",
    currentCourtId: "court-gwangju",
    currentDivision: "형사3부",
    currentTitle: "부장판사",
    bioSummary: "판사 성향이나 평판을 단정하지 않는 요약 정책을 확인하는 항목입니다.",
    status: "active",
    sourceIds: ["src-demo"],
    tags: ["형사", "교통"]
  },
  {
    id: "judge-demo-07",
    name: "데모 법관 07",
    normalizedName: "demo-judge-07",
    currentCourtId: "court-seoul-publiclaw",
    currentDivision: "행정9부",
    currentTitle: "판사",
    bioSummary: "정정 요청 대상 선택과 운영자 검토 흐름을 검증하기 위한 데이터입니다.",
    status: "active",
    sourceIds: ["src-demo"],
    tags: ["행정", "노동"]
  },
  {
    id: "judge-demo-08",
    name: "데모 법관 08",
    normalizedName: "demo-judge-08",
    currentCourtId: "court-busan",
    currentDivision: "민사합의6부",
    currentTitle: "부장판사",
    bioSummary: "소속 법원, 재판부, 공개 판결문 링크의 연결성을 보여주는 예시입니다.",
    status: "active",
    sourceIds: ["src-demo"],
    tags: ["민사", "부동산"]
  },
  {
    id: "judge-demo-09",
    name: "데모 법관 09",
    normalizedName: "demo-judge-09",
    currentCourtId: "court-daejeon",
    currentDivision: "행정1부",
    currentTitle: "판사",
    bioSummary: "법원별 필터와 사건 유형 필터를 동시에 확인하는 가상 데이터입니다.",
    status: "active",
    sourceIds: ["src-demo"],
    tags: ["행정", "영업정지"]
  }
];

export const appointments = [
  {
    id: "app-01",
    judgeId: "judge-demo-01",
    courtId: "court-seoul-central",
    title: "부장판사",
    division: "민사합의12부",
    startDate: "2026-02-24",
    endDate: "",
    sourceId: "src-demo"
  },
  {
    id: "app-02",
    judgeId: "judge-demo-01",
    courtId: "court-daejeon",
    title: "판사",
    division: "민사단독",
    startDate: "2023-02-20",
    endDate: "2026-02-23",
    sourceId: "src-demo"
  },
  {
    id: "app-03",
    judgeId: "judge-demo-02",
    courtId: "court-seoul-central",
    title: "판사",
    division: "형사합의21부",
    startDate: "2025-02-17",
    endDate: "",
    sourceId: "src-demo"
  },
  {
    id: "app-04",
    judgeId: "judge-demo-03",
    courtId: "court-seoul-publiclaw",
    title: "부장판사",
    division: "행정4부",
    startDate: "2024-02-19",
    endDate: "",
    sourceId: "src-demo"
  },
  {
    id: "app-05",
    judgeId: "judge-demo-04",
    courtId: "court-daejeon",
    title: "판사",
    division: "민사단독8부",
    startDate: "2025-02-17",
    endDate: "",
    sourceId: "src-demo"
  },
  {
    id: "app-06",
    judgeId: "judge-demo-05",
    courtId: "court-busan",
    title: "판사",
    division: "가사2부",
    startDate: "2025-02-17",
    endDate: "",
    sourceId: "src-demo"
  },
  {
    id: "app-07",
    judgeId: "judge-demo-06",
    courtId: "court-gwangju",
    title: "부장판사",
    division: "형사3부",
    startDate: "2024-02-19",
    endDate: "",
    sourceId: "src-demo"
  },
  {
    id: "app-08",
    judgeId: "judge-demo-07",
    courtId: "court-seoul-publiclaw",
    title: "판사",
    division: "행정9부",
    startDate: "2026-02-24",
    endDate: "",
    sourceId: "src-demo"
  },
  {
    id: "app-09",
    judgeId: "judge-demo-08",
    courtId: "court-busan",
    title: "부장판사",
    division: "민사합의6부",
    startDate: "2023-02-20",
    endDate: "",
    sourceId: "src-demo"
  },
  {
    id: "app-10",
    judgeId: "judge-demo-09",
    courtId: "court-daejeon",
    title: "판사",
    division: "행정1부",
    startDate: "2026-02-24",
    endDate: "",
    sourceId: "src-demo"
  }
];

export const caseDocuments = [
  {
    id: "case-demo-01",
    title: "계약 해제에 따른 원상회복 청구",
    caseNumber: "2025가합10001",
    courtName: "서울중앙지방법원",
    decisionDate: "2025-10-17",
    caseType: "민사",
    sourceUrl: "https://www.law.go.kr/precSc.do?menuId=7",
    originalTextHash: "demo-8b7f53",
    summary:
      "계약 해제 통지의 도달 시점과 이미 이행된 급부의 반환 범위를 중심으로 판단한 판결 예시입니다. 당사자의 주장과 증거관계를 요약한 화면 검증용 문장입니다.",
    aiSummaryDisclaimer:
      "이 요약은 AI가 공개자료를 바탕으로 생성한 참고용 요약입니다. 정확한 내용은 반드시 원문을 확인하십시오.",
    judgeIds: ["judge-demo-01"],
    sourceIds: ["src-demo", "src-lawgo"],
    createdAt: "2026-04-30"
  },
  {
    id: "case-demo-02",
    title: "업무상 배임 관련 손해배상 청구",
    caseNumber: "2025가합10218",
    courtName: "서울중앙지방법원",
    decisionDate: "2025-11-04",
    caseType: "상사",
    sourceUrl: "https://www.law.go.kr/precSc.do?menuId=7",
    originalTextHash: "demo-6ae233",
    summary:
      "회사 내부 승인 절차, 거래 상대방과의 이해관계, 손해액 산정 자료의 증명 정도를 정리한 판결 예시입니다.",
    aiSummaryDisclaimer:
      "이 요약은 AI가 공개자료를 바탕으로 생성한 참고용 요약입니다. 정확한 내용은 반드시 원문을 확인하십시오.",
    judgeIds: ["judge-demo-01"],
    sourceIds: ["src-demo", "src-lawgo"],
    createdAt: "2026-04-30"
  },
  {
    id: "case-demo-03",
    title: "전자금융거래법 위반 사건",
    caseNumber: "2025고합201",
    courtName: "서울중앙지방법원",
    decisionDate: "2025-09-25",
    caseType: "형사",
    sourceUrl: "https://www.law.go.kr/precSc.do?menuId=7",
    originalTextHash: "demo-fc2931",
    summary:
      "접근매체 양도 사실, 피고인의 인식 여부, 양형 자료로 제출된 사정을 순서대로 정리한 판결 예시입니다.",
    aiSummaryDisclaimer:
      "이 요약은 AI가 공개자료를 바탕으로 생성한 참고용 요약입니다. 정확한 내용은 반드시 원문을 확인하십시오.",
    judgeIds: ["judge-demo-02"],
    sourceIds: ["src-demo", "src-lawgo"],
    createdAt: "2026-04-30"
  },
  {
    id: "case-demo-04",
    title: "부가가치세 부과처분 취소",
    caseNumber: "2025구합30014",
    courtName: "서울행정법원",
    decisionDate: "2025-08-29",
    caseType: "행정",
    sourceUrl: "https://www.law.go.kr/precSc.do?menuId=7",
    originalTextHash: "demo-34df10",
    summary:
      "거래의 실질, 세금계산서 발급 경위, 과세관청의 처분 사유를 중심으로 쟁점을 구분한 판결 예시입니다.",
    aiSummaryDisclaimer:
      "이 요약은 AI가 공개자료를 바탕으로 생성한 참고용 요약입니다. 정확한 내용은 반드시 원문을 확인하십시오.",
    judgeIds: ["judge-demo-03"],
    sourceIds: ["src-demo", "src-lawgo"],
    createdAt: "2026-04-30"
  },
  {
    id: "case-demo-05",
    title: "영업정지처분 집행정지 신청",
    caseNumber: "2025아1005",
    courtName: "대전지방법원",
    decisionDate: "2025-07-11",
    caseType: "행정",
    sourceUrl: "https://www.law.go.kr/precSc.do?menuId=7",
    originalTextHash: "demo-79df02",
    summary:
      "처분으로 인한 회복하기 어려운 손해와 공공복리에 미치는 영향을 법정 요건별로 나누어 정리한 결정 예시입니다.",
    aiSummaryDisclaimer:
      "이 요약은 AI가 공개자료를 바탕으로 생성한 참고용 요약입니다. 정확한 내용은 반드시 원문을 확인하십시오.",
    judgeIds: ["judge-demo-09"],
    sourceIds: ["src-demo", "src-lawgo"],
    createdAt: "2026-04-30"
  },
  {
    id: "case-demo-06",
    title: "임대차보증금 반환 청구",
    caseNumber: "2025가단40220",
    courtName: "대전지방법원",
    decisionDate: "2025-06-20",
    caseType: "민사",
    sourceUrl: "https://www.law.go.kr/precSc.do?menuId=7",
    originalTextHash: "demo-bd4511",
    summary:
      "계약 종료 시점, 목적물 인도 여부, 보증금에서 공제할 항목을 항목별로 정리한 판결 예시입니다.",
    aiSummaryDisclaimer:
      "이 요약은 AI가 공개자료를 바탕으로 생성한 참고용 요약입니다. 정확한 내용은 반드시 원문을 확인하십시오.",
    judgeIds: ["judge-demo-04"],
    sourceIds: ["src-demo", "src-lawgo"],
    createdAt: "2026-04-30"
  },
  {
    id: "case-demo-07",
    title: "친권자 및 양육자 지정 심판",
    caseNumber: "2025느단1021",
    courtName: "부산지방법원",
    decisionDate: "2025-06-03",
    caseType: "가사",
    sourceUrl: "https://www.law.go.kr/precSc.do?menuId=7",
    originalTextHash: "demo-c1134a",
    summary:
      "미성년 자녀의 복리, 양육 환경, 면접교섭 계획을 중심으로 판단 구조를 정리한 심판 예시입니다.",
    aiSummaryDisclaimer:
      "이 요약은 AI가 공개자료를 바탕으로 생성한 참고용 요약입니다. 정확한 내용은 반드시 원문을 확인하십시오.",
    judgeIds: ["judge-demo-05"],
    sourceIds: ["src-demo", "src-lawgo"],
    createdAt: "2026-04-30"
  },
  {
    id: "case-demo-08",
    title: "교통사고처리특례법 위반 사건",
    caseNumber: "2025고단901",
    courtName: "광주지방법원",
    decisionDate: "2025-05-27",
    caseType: "형사",
    sourceUrl: "https://www.law.go.kr/precSc.do?menuId=7",
    originalTextHash: "demo-45aa90",
    summary:
      "사고 경위, 피해 회복 여부, 피고인의 전력 등 공개 판결문상 확인되는 요소를 정리한 판결 예시입니다.",
    aiSummaryDisclaimer:
      "이 요약은 AI가 공개자료를 바탕으로 생성한 참고용 요약입니다. 정확한 내용은 반드시 원문을 확인하십시오.",
    judgeIds: ["judge-demo-06"],
    sourceIds: ["src-demo", "src-lawgo"],
    createdAt: "2026-04-30"
  },
  {
    id: "case-demo-09",
    title: "해고무효확인 및 임금 청구",
    caseNumber: "2025구합22011",
    courtName: "서울행정법원",
    decisionDate: "2025-04-18",
    caseType: "노동",
    sourceUrl: "https://www.law.go.kr/precSc.do?menuId=7",
    originalTextHash: "demo-0a34ea",
    summary:
      "징계 사유의 존재, 절차 준수 여부, 해고의 상당성을 쟁점별로 나누어 설명하는 판결 예시입니다.",
    aiSummaryDisclaimer:
      "이 요약은 AI가 공개자료를 바탕으로 생성한 참고용 요약입니다. 정확한 내용은 반드시 원문을 확인하십시오.",
    judgeIds: ["judge-demo-07"],
    sourceIds: ["src-demo", "src-lawgo"],
    createdAt: "2026-04-30"
  },
  {
    id: "case-demo-10",
    title: "소유권이전등기 청구",
    caseNumber: "2025가합6120",
    courtName: "부산지방법원",
    decisionDate: "2025-03-14",
    caseType: "부동산",
    sourceUrl: "https://www.law.go.kr/precSc.do?menuId=7",
    originalTextHash: "demo-991ab2",
    summary:
      "매매계약 체결 여부, 중도금 지급 자료, 등기 이전 의무의 발생 시점을 정리한 판결 예시입니다.",
    aiSummaryDisclaimer:
      "이 요약은 AI가 공개자료를 바탕으로 생성한 참고용 요약입니다. 정확한 내용은 반드시 원문을 확인하십시오.",
    judgeIds: ["judge-demo-08"],
    sourceIds: ["src-demo", "src-lawgo"],
    createdAt: "2026-04-30"
  }
];

export const forbiddenFeatures = [
  "별점",
  "익명 공개 리뷰",
  "댓글",
  "최악의 판사 랭킹",
  "진행 중 사건 후기",
  "출처 없는 법관 평가 문장",
  "법관 성향 단정",
  "가족·주소·연락처 등 사생활 정보",
  "법관 페이지 변호사 광고 연결"
];

export const requiredControls = [
  "모든 정보의 출처 연결",
  "AI 요약 고지",
  "정정 요청 폼",
  "운영정책 페이지",
  "개인정보 처리방침 초안",
  "운영자 검토 후 수정·비공개 처리",
  "출처별 수집일 기록"
];
