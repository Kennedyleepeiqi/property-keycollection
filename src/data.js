// HDB BTO projects with estimated key collection (HDB estimated TOP) between Sep 2026 and Jun 2027.
// Sources: BTOHQ TOP tracker + project pages, RCS completion tracker, 99.co (checked 9 Nov 2026).
// `top` is year-month of HDB's estimated completion. Keys go out block by block after TOP.
// When you add a project here, also add its picture and floor plans to src/media.js (same id).

export const TODAY = new Date(2026, 10, 12); // the day the dates below were last checked

export const TIERS = [
  { id: "now", label: "Keys out now", short: "Now", sub: "Handover started Aug–Nov 2026" },
  { id: "dec", label: "Rest of 2026", short: "End '26", sub: "Due Dec 2026 or Q4 2026" },
  { id: "q1", label: "Jan–Mar 2027", short: "Q1 '27", sub: "Due in the first quarter of 2027" },
  { id: "jun", label: "Apr–Jun 2027", short: "Q2 '27", sub: "About 5 to 7 months away. Owners often pick a designer before they get the keys." },
];

// What the map covers. Shown at the top of the panel; update when the data is refreshed.
export const COVERAGE = [
  { label: "HDB BTO", until: "Jun 2027", untilYM: "2027-06", checked: "12 Nov 2026" },
  { label: "Condo & EC", until: "Jun 2027", untilYM: "2027-06", checked: "12 Nov 2026" },
];

export const TYPE_LABEL = { "2RF": "2-room Flexi", "3R": "3-room", "4R": "4-room", "5R": "5-room" };

const BTO = [
  {
    kind: "bto", id: "kovan-wellspring", name: "Kovan Wellspring", town: "Hougang", region: "North-East", tier: "now", top: "2026-09",
    lat: 1.3606, lng: 103.8856, approx: true, units: 586, types: ["2RF", "3R", "4R"], mix: null,
    launch: "Aug 2021", street: "Upper Serangoon Rd & Tampines Rd, beside Kovan MRT",
    note: "Mature estate next to Kovan MRT and Heartland Mall. Integrated with the new Paya Lebar Kovan CC. Pin is placed at Kovan MRT.",
    source: "https://www.btohq.com/bto-project-spec/kovan-wellspring",
  },
  {
    kind: "bto", id: "bishan-ridges", name: "Bishan Ridges", town: "Bishan", region: "Central", tier: "now", top: "2026-10",
    lat: 1.35225, lng: 103.85317, units: 1502, types: ["2RF", "3R", "4R"], mix: null,
    launch: "Nov 2020", street: "Bishan St 13 & 14",
    note: "Largest central pool in the window. The 2-room Flexi flats are seniors-only on short leases, so focus on the 3- and 4-room owners.",
    source: "https://www.btohq.com/bto-project-spec/bishan-ridges",
  },
  {
    kind: "bto", id: "heart-of-yew-tee", name: "Heart of Yew Tee", town: "Choa Chu Kang", region: "West", tier: "now", top: "2026-09",
    lat: 1.39719, lng: 103.74583, units: 68, types: ["2RF"], mix: { "2RF": 68 },
    launch: "Nov 2021", street: "Yew Tee Close, beside Yew Tee Point",
    note: "Low priority. All 68 flats are short-lease 2-room Flexi for seniors 55+, so renovations will be small.",
    source: "https://www.btohq.com/bto-project-spec/heart-of-yew-tee",
  },
  {
    kind: "bto", id: "keat-hong-grange", name: "Keat Hong Grange", town: "Choa Chu Kang", region: "West", tier: "dec", top: "2026-12",
    lat: 1.37464, lng: 103.74833, units: 987, types: ["2RF", "3R", "4R", "5R"], mix: { "2RF": 194, "3R": 96, "4R": 374, "5R": 323 },
    launch: "Aug 2022", street: "CCK Ave 7, CCK Grove & Keat Hong Link",
    note: "Built PPVC, so flats arrive with flooring, internal doors and bathroom fittings already in. Lead with carpentry, wardrobes and kitchens.",
    source: "https://www.btohq.com/bto-project-spec/keat-hong-grange",
  },
  {
    kind: "bto", id: "lakeside-view", name: "Lakeside View", town: "Jurong West", region: "West", tier: "dec", top: "2026-12",
    lat: 1.34019, lng: 103.72206, units: 1016, types: ["2RF", "3R", "4R", "5R"], mix: { "2RF": 455, "3R": 101, "4R": 246, "5R": 214 },
    launch: "May 2022", street: "Kang Ching Rd & Yuan Ching Rd, by Jurong Lake Gardens",
    note: "Almost half are 2-room Flexi. The 460 4- and 5-room flats are the real target.",
    source: "https://www.btohq.com/bto-project-spec/lakeside-view",
  },
  {
    kind: "bto", id: "kent-heights", name: "Kent Heights", town: "Kallang/Whampoa", region: "Central", tier: "dec", top: "2026-12",
    lat: 1.31725, lng: 103.85044, units: 430, types: ["2RF", "4R"], mix: null,
    launch: "Nov 2021", street: "Owen Road",
    note: "One 32-storey block on the city fringe. 4-room flats launched from $511k, so expect bigger renovation budgets.",
    source: "https://www.btohq.com/bto-project-spec/kent-heights",
  },
  {
    kind: "bto", id: "towner-residences", name: "Towner Residences", town: "Kallang/Whampoa", region: "Central", tier: "dec", top: "2026-12",
    lat: 1.32075, lng: 103.85675, units: 316, types: ["3R", "4R"], mix: null,
    launch: "Aug 2021", street: "Towner Road",
    note: "316 sold 3- and 4-room flats in one 40-storey block; the second block is rental. Central, with high-floor views.",
    source: "https://www.btohq.com/bto-project-spec/towner-residences",
  },
  {
    kind: "bto", id: "garden-waterfront", name: "Garden Waterfront I & II", town: "Tengah", region: "West", tier: "q1", top: "2027-03",
    lat: 1.35692, lng: 103.72719, units: 2077, types: ["2RF", "3R", "4R", "5R"], mix: { "2RF": 578, "3R": 89, "4R": 740, "5R": 670 },
    launch: "Nov 2022", street: "Tengah Garden Ave, beside Tengah Pond",
    note: "The biggest single pool in the window: 1,410 4- and 5-room flats across 18 blocks.",
    source: "https://www.btohq.com/bto-project-spec/garden-waterfront-i-ii-tengah",
  },
  {
    kind: "bto", id: "woodlands-south-plains", name: "Woodlands South Plains", town: "Woodlands", region: "North", tier: "q1", top: "2027-03",
    lat: 1.42686, lng: 103.79567, units: 630, types: ["2RF", "3R", "4R"], mix: { "2RF": 275, "3R": 87, "4R": 268 },
    launch: "Aug 2022", street: "Woodlands Ave 1 & Drive 17, by Woodlands South MRT",
    note: "Budget-leaning: 4-room flats launched from $303k. Next to the Woodlands Health Campus.",
    source: "https://www.btohq.com/bto-project-spec/woodlands-south-plains",
  },
  {
    kind: "bto", id: "telok-blangah-beacon", name: "Telok Blangah Beacon", town: "Bukit Merah", region: "Central", tier: "q1", top: "2027-03",
    lat: 1.27319, lng: 103.80831, units: 175, types: ["3R", "4R"], mix: { "3R": 105, "4R": 70 },
    launch: "May 2021", street: "Telok Blangah Drive",
    note: "Small but premium (4-room launched from $602k). HDB's estimate is Mar 2027, but BTOHQ shows it 75% built and warns it could slip as late as Sep 2028, so confirm before spending.",
    source: "https://www.btohq.com/bto-project-spec/telok-blangah-beacon",
    lowConfidence: true,
  },
  {
    kind: "bto", id: "parc-meadow", name: "Parc Meadow @ Tengah", town: "Tengah", region: "West", tier: "jun", top: "2027-06",
    lat: 1.36614, lng: 103.73767, units: 1985, types: ["2RF", "3R", "4R", "5R"], mix: { "2RF": 446, "3R": 82, "4R": 791, "5R": 666 },
    launch: "May 2023", street: "Tengah Park Ave & Tengah Park Walk",
    note: "Big Tengah pool: 1,457 4- and 5-room flats. Owners often start shortlisting designers around Feb 2027.",
    source: "https://www.btohq.com/bto-project-spec/parc-meadow-tengah",
  },
  {
    kind: "bto", id: "sin-ming-residences", name: "Sin Ming Residences", town: "Bishan", region: "Central", tier: "jun", top: "2027-06",
    lat: 1.35567, lng: 103.83872, units: 732, types: ["3R", "4R"], mix: { "3R": 105, "4R": 627 },
    launch: "Dec 2023 (shorter wait)", street: "Sin Ming Road",
    note: "Almost entirely 4-room flats, in a mature central estate.",
    source: "https://www.btohq.com/bto-project-spec/sin-ming-residences",
  },
];

// Private condos and ECs. Dates from developers and property news, checked 12 Nov 2026.
// topText is shown as-is; topFrom/topTo give the month window for the "Keys due" filter.
export const PRIVATE = [
  { kind: "condo", id: "grand-dunman", name: "Grand Dunman", town: "Dakota", region: "Central", tier: "now", top: "2026-08", topText: "Aug 2026", topObtained: true, lat: 1.30793, lng: 103.89038, units: 1008, types: [], mix: null, unitMix: "1-bedroom to penthouse", developer: "SingHaiyi & CSC Land", tenure: "99-year leasehold", street: "2–18 Dunman Road, near Dakota MRT", note: "Biggest condo handover in the window. TOP came early in Aug 2026, so owners are collecting keys now. Launched at about $2,500 psf.", source: "https://stackedhomes.com/12-almost-completed-new-condos-with-units-still-available-in-2026-from-1869-psf/" },
  { kind: "condo", id: "norwood-grand", name: "Norwood Grand", town: "Woodlands", region: "North", tier: "now", top: "2026-08", topText: "Aug 2026", topObtained: true, lat: 1.42854, lng: 103.79084, units: 348, types: [], mix: null, unitMix: "2- to 5-bedroom", developer: "CDL", tenure: "99-year leasehold", street: "2–12 Champions Way, near Woodlands South MRT", note: "Mass-market condo with family-size units. CDL's progress page shows TOP obtained in Aug 2026.", source: "https://www.cdlhomes.com.sg/construction/" },
  { kind: "condo", id: "the-myst", name: "The Myst", town: "Bukit Panjang", region: "West", tier: "now", top: "2026-09", topText: "Sep 2026", topObtained: true, lat: 1.3735, lng: 103.76414, units: 408, types: [], mix: null, unitMix: null, developer: "CDL", tenure: "99-year leasehold", street: "800 & 802 Upper Bukit Timah Road, near Cashew MRT", note: "TOP obtained Sep 2026 per CDL. Launched at about $2,057 psf, with family-size 4- and 5-bedroom units.", source: "https://www.cdlhomes.com.sg/construction/" },
  { kind: "condo", id: "canninghill-piers", name: "CanningHill Piers", town: "Clarke Quay", region: "Central", tier: "now", top: "2026-10", topText: "Oct 2026", topObtained: true, lat: 1.29155, lng: 103.84467, units: 696, types: [], mix: null, unitMix: "1- to 5-bedroom", developer: "CDL & CapitaLand", tenure: "99-year leasehold", street: "1 & 5 Clarke Quay", note: "Prime riverfront condo at about $3,100–3,900 psf, so expect high-end fit-outs. TOP obtained Oct 2026 per CDL.", source: "https://www.cdlhomes.com.sg/construction/" },
  { kind: "condo", id: "lentor-mansion", name: "Lentor Mansion", town: "Lentor", region: "North-East", tier: "now", top: "2026-09", topText: "Q3 2026", topFrom: "2026-07", topTo: "2026-09", topObtained: true, lat: 1.38328, lng: 103.83315, units: 533, types: [], mix: null, unitMix: "2- to 5-bedroom", developer: "GuocoLand & Hong Leong", tenure: "99-year leasehold", street: "52–64 Lentor Gardens", note: "GuocoLand reported it completed in Q3 2026 (about Sep). Fully sold; 2-bedders started from about $1.15M.", source: "https://sg.news.yahoo.com/guocolands-five-fy2026-residential-launches-154257007.html" },
  { kind: "condo", id: "pinetree-hill", name: "Pinetree Hill", town: "Ulu Pandan", region: "Central", tier: "now", top: "2026-10", topText: "Oct 2026", topObtained: true, lat: 1.31929, lng: 103.7763, units: 520, types: [], mix: null, unitMix: "1- to 5-bedroom and penthouses", developer: "UOL & SingLand", tenure: "99-year leasehold", street: "30–36 Pine Grove", note: "Buyers were collecting keys by late Oct 2026. Near Henry Park Primary, about $2,400–2,800 psf.", source: "https://www.hometruly.sg/insights/pinetree-hill-review" },
  { kind: "condo", id: "hillock-green", name: "Hillock Green", town: "Lentor", region: "North-East", tier: "now", top: "2026-10", topText: "Oct 2026", topObtained: true, lat: 1.3851, lng: 103.83385, units: 474, types: [], mix: null, unitMix: "1- to 4-bedroom (517–1,582 sqft)", developer: "Lentor Central Pte Ltd", tenure: "99-year leasehold", street: "22–28 Lentor Central, opposite Lentor MRT", note: "Key collection seen from late Oct 2026. Compact units at about $2,185 psf.", source: "https://directory.stackedhomes.com/condo/hillock-green/" },
  { kind: "condo", id: "hill-house", name: "Hill House", town: "River Valley", region: "Central", tier: "now", top: "2026-08", topText: "Aug 2026 (est.)", topFrom: "2026-08", topTo: "2026-11", lat: 1.2953, lng: 103.83959, units: 72, types: [], mix: null, unitMix: "1- to 3-bedroom (431–753 sqft)", developer: "Macly, Roxy-Pacific & LWH", tenure: "999-year leasehold", street: "11 Institution Hill", note: "Small, investor-heavy units at about $3,240 psf, so a fit for compact-unit packages.", source: "https://www.edgeprop.sg/condo-apartment/hill-house", lowConfidence: true },
  { kind: "condo", id: "ardor-residence", name: "Ardor Residence", town: "Katong", region: "Central", tier: "now", top: "2026-10", topText: "Oct 2026 (est.)", lat: 1.30646, lng: 103.89944, units: 35, types: [], mix: null, unitMix: null, developer: "Nanshan Group", tenure: "Freehold", street: "181 Haig Road", note: "One 5-storey boutique block at about $2,525 psf.", source: "https://prop.sg/new-launch/ardor-residence/", lowConfidence: true },
  { kind: "condo", id: "lakegarden-residences", name: "The LakeGarden Residences", town: "Jurong Lake", region: "West", tier: "dec", top: "2026-12", topText: "Dec 2026", lat: 1.33579, lng: 103.72559, units: 306, types: [], mix: null, unitMix: "1- to 5-bedroom", developer: "Wing Tai", tenure: "99-year leasehold", street: "80 & 82 Yuan Ching Road", note: "Faces Jurong Lake Gardens, next to the Lakeside View BTO. Wing Tai expects completion in 2026.", source: "https://links.sgx.com/1.0.0/corporate-announcements/BL045ODTDDTJ6R44/905451_WTH%20Annual%20Report%202026.pdf" },
  { kind: "condo", id: "lentor-hills-residences", name: "Lentor Hills Residences", town: "Lentor", region: "North-East", tier: "dec", top: "2026-12", topText: "Dec 2026", lat: 1.38343, lng: 103.83423, units: 598, types: [], mix: null, unitMix: "1- to 4-bedroom, incl. dual-key", developer: "Hong Leong, GuocoLand & CSC Land", tenure: "99-year leasehold", street: "31–41 Lentor Hills Road", note: "Biggest Lentor handover still to come. Expected TOP Dec 2026; GuocoLand says 2H 2026.", source: "https://newlauncher.com.sg/blog/lentor-hills-residences-TOP-date" },
  { kind: "condo", id: "blossoms-by-the-park", name: "Blossoms By The Park", town: "one-north", region: "Central", tier: "dec", top: "2026-12", topText: "Q4 2026", topFrom: "2026-10", topTo: "2026-12", lat: 1.30439, lng: 103.7893, units: 275, types: [], mix: null, unitMix: "1- to 4-bedroom, incl. dual-key", developer: "EL Development", tenure: "99-year leasehold", street: "9 Slim Barracks Rise", note: "Beside one-north Park, 549–1,884 sqft. One source says 31 Dec 2026, another says 2027.", source: "https://www.blossomscondo.com.sg/", lowConfidence: true },
  { kind: "condo", id: "the-hill-one-north", name: "The Hill @ One-North", town: "one-north", region: "Central", tier: "dec", top: "2026-12", topText: "2026 (unconfirmed)", topFrom: "2026-09", topTo: "2026-12", lat: 1.30337, lng: 103.79016, units: 142, types: [], mix: null, unitMix: "2- to 4-bedroom (710–1,410 sqft)", developer: "Kingsford", tenure: "99-year leasehold", street: "15–19 Slim Barracks Rise", note: "Listing sites say TOP 2026; the legal deadline is end-2027.", source: "https://www.edgeprop.sg/condo-apartment/the-hill-one-north", lowConfidence: true },
  { kind: "condo", id: "grange-1866", name: "Grange 1866", town: "Tanglin", region: "Central", tier: "dec", top: "2026-12", topText: "Q4 2026", topFrom: "2026-10", topTo: "2026-12", lat: 1.29988, lng: 103.82898, units: 60, types: [], mix: null, unitMix: null, developer: "Heeton Holdings", tenure: "Freehold", street: "74 Grange Road", note: "16-storey luxury boutique tower at about $3,470 psf.", source: "https://stackedhomes.com/12-almost-completed-new-condos-with-units-still-available-in-2026-from-1869-psf/" },
  { kind: "condo", id: "the-shorefront", name: "The Shorefront", town: "Pasir Ris", region: "East", tier: "dec", top: "2026-12", topText: "Q4 2026", topFrom: "2026-10", topTo: "2026-12", lat: 1.37887, lng: 103.9602, units: 23, types: [], mix: null, unitMix: "2- to 4-bedroom (775–1,572 sqft)", developer: "165@Loyang", tenure: "999-year leasehold", street: "165 Jalan Loyang Besar", note: "Single block facing Pasir Ris Park and the beach.", source: "https://stackedhomes.com/12-almost-completed-new-condos-with-units-still-available-in-2026-from-1869-psf/" },
  { kind: "condo", id: "terra-hill", name: "Terra Hill", town: "Pasir Panjang", region: "Central", tier: "q1", top: "2027-03", topText: "Q1 2027", topFrom: "2027-01", topTo: "2027-03", lat: 1.27795, lng: 103.79333, units: 270, types: [], mix: null, unitMix: "2- to 5-bedroom", developer: "Hoi Hup & Sunway", tenure: "Freehold", street: "18–22B Yew Siang Road, near Pasir Panjang MRT", note: "Low-density freehold. Expected to complete in Q1 2027.", source: "https://stackedhomes.com/12-almost-completed-new-condos-with-units-still-available-in-2026-from-1869-psf/" },
  { kind: "condo", id: "hillhaven", name: "Hillhaven", town: "Hillview", region: "West", tier: "q1", top: "2027-03", topText: "Q1 2027", topFrom: "2027-01", topTo: "2027-03", lat: 1.36209, lng: 103.76352, units: 341, types: [], mix: null, unitMix: "2- to 4-bedroom (700–1,636 sqft)", developer: "Far East & Sekisui House", tenure: "99-year leasehold", street: "5 & 7 Hillview Rise, near Hillview MRT", note: "Fully sold. The developer's site says estimated Q1 2027.", source: "https://www.hillhaven.com.sg/en" },
  { kind: "ec", id: "novo-place", name: "Novo Place", town: "Tengah", region: "West", tier: "q1", top: "2027-03", topText: "Q1 2027", topFrom: "2027-01", topTo: "2027-03", lat: 1.34914, lng: 103.73705, units: 504, types: [], mix: null, unitMix: "3- and 4-bedroom", developer: "Hoi Hup & Sunway", tenure: "99-year leasehold", street: "6 Plantation Close", note: "Executive condo of family-size units, fully sold. Near the Tengah BTOs (Garden Waterfront, Parc Meadow).", source: "https://www.propertyguru.com.sg/project/novo-place-25854" },
  { kind: "condo", id: "orchard-sophia", name: "Orchard Sophia", town: "Dhoby Ghaut", region: "Central", tier: "q1", top: "2027-03", topText: "Q1 2027", topFrom: "2027-01", topTo: "2027-03", lat: 1.30305, lng: 103.84642, units: 78, types: [], mix: null, unitMix: "1- to 3-bedroom", developer: "DB2 Group", tenure: "Freehold", street: "128 & 130 Sophia Road", note: "Boutique pair of 5-storey blocks. Agents say Q1 2027; the developer's stated date is Aug 2027.", source: "https://www.newlaunches.sg/condominium/orchard-sophia.html", lowConfidence: true },
  { kind: "condo", id: "the-continuum", name: "The Continuum", town: "Katong", region: "Central", tier: "jun", top: "2027-06", topText: "Q2 2027", topFrom: "2027-04", topTo: "2027-06", lat: 1.311, lng: 103.89572, units: 816, types: [], mix: null, unitMix: "1-bedroom + study to 5-bedroom", developer: "Hoi Hup & Sunway", tenure: "Freehold", street: "1–8 Thiam Siew Avenue", note: "Large freehold project, 560–2,260 sqft at about $2,760 psf. EdgeProp expects TOP in Q2 2027.", source: "https://www.edgeprop.sg/property-news/whats-driving-continuums-sales-surge-district-15" },
  { kind: "condo", id: "sora", name: "Sora", town: "Jurong Lake", region: "West", tier: "jun", top: "2027-06", topText: "Q2 2027", topFrom: "2027-04", topTo: "2027-06", lat: 1.33431, lng: 103.72544, units: 440, types: [], mix: null, unitMix: null, developer: "SingHaiyi JV", tenure: "99-year leasehold", street: "72–78 Yuan Ching Road, near Lakeside MRT", note: "Next to The LakeGarden Residences. Marketing agent says Q2 2027; other sites say Q4 2027.", source: "https://thesoracondo.sg/info/", lowConfidence: true },
  { kind: "condo", id: "lentoria", name: "Lentoria", town: "Lentor", region: "North-East", tier: "jun", top: "2027-06", topText: "Jun–Jul 2027", topFrom: "2027-06", topTo: "2027-06", lat: 1.38197, lng: 103.83457, units: 267, types: [], mix: null, unitMix: "1- to 4-bedroom", developer: "TID (Hong Leong & Mitsui Fudosan)", tenure: "99-year leasehold", street: "32 Lentor Hills Road", note: "May fall just after the window: vacant possession deadline is 2 Jul 2027.", source: "https://lentoria.com.sg/updates/", lowConfidence: true },
  { kind: "condo", id: "watten-house", name: "Watten House", town: "Bukit Timah", region: "Central", tier: "jun", top: "2027-06", topText: "By Jun 2027", topFrom: "2027-04", topTo: "2027-06", lat: 1.32924, lng: 103.81094, units: 180, types: [], mix: null, unitMix: "3- to 5-bedroom and penthouses", developer: "UOL & SingLand", tenure: "Freehold", street: "36–50 Shelford Road", note: "Luxury freehold with big units (990–4,080 sqft). UOL only says 2027; the legal deadline is 30 Jun 2027.", source: "https://uolhomes.com.sg/project/site-at-watten-estate/", lowConfidence: true },
];

export const PROJECTS = [...BTO, ...PRIVATE];
