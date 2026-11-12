// Pictures and floor plans shown inside each project card.
// Images are linked from developer / agent / BTOHQ sites (not copied here).
// BTO floor plans come from the HDB sales brochure (PDF), loaded through
// the /bto-pdf/ rewrite in vercel.json so the site can show it in-page.

const BTO_CDN = "https://btohq.sgp1.cdn.digitaloceanspaces.com/bto";
const bto = (launch, slug) => ({
  exterior: `${BTO_CDN}/${launch}/projects/${slug}_og.jpg`,
  brochure: `/bto-pdf/${launch}/${slug}.pdf`,
  brochureSrc: `${BTO_CDN}/${launch}/${slug}.pdf`,
  plans: [],
});

const HDB_BROCHURES = "https://assets.hdb.gov.sg/residential/buying-a-flat/finding-a-flat/sales-brochure";
const hdb = (m, path) => ({ ...m, brochure: `/hdb-pdf/${path}`, brochureSrc: `${HDB_BROCHURES}/${path}` });

// Build plan list from a folder + [label, file] pairs.
const P = (base, list) => list.map(([label, file]) => ({ label, src: base + file }));

export const MEDIA = {
  // ---------- BTO ----------
  "kovan-wellspring": bto("aug-2021-bto", "kovan-wellspring"),
  "bishan-ridges": bto("nov-2020-bto", "bishan-ridges"),
  "heart-of-yew-tee": bto("nov-2021-bto", "heart-of-yew-tee"),
  "keat-hong-grange": bto("aug-2022-bto", "keat-hong-grange"),
  "lakeside-view": bto("may-2022-bto", "lakeside-view"),
  "kent-heights": bto("nov-2021-bto", "kent-heights"),
  "towner-residences": bto("aug-2021-bto", "towner-residences"),
  "garden-waterfront": bto("nov-2022-bto", "garden-waterfront-i-ii-tengah"),
  "woodlands-south-plains": bto("aug-2022-bto", "woodlands-south-plains"),
  "telok-blangah-beacon": bto("may-2021-bto", "telok-blangah-beacon"),
  // BTOHQ has no brochure for these two, so use HDB's own copy (/hdb-pdf/ rewrite).
  "parc-meadow": hdb(bto("may-2023-bto", "parc-meadow-tengah"), "23MAYBTO_pdf_selection/parc_meadow_@_tengah.pdf"),
  "sin-ming-residences": hdb(bto("dec-2023-bto", "sin-ming-residences"), "23DECBTO_pdf_selection/sin_ming_residences.pdf"),

  // ---------- Condos and ECs ----------
  "grand-dunman": {
    exterior: "https://www.grandsdunman.com.sg/wp-content/uploads/2023/06/grand-dunman-along-dunman-road-swimming-pool-singapore.jpeg",
    plans: P("https://www.grandsdunman.com.sg/wp-content/uploads/2023/06/grand-dunman-floor-plan-", [
      ["1-bedroom", "1-bedroom-type-1br-1-singapore.png"],
      ["2-bedroom", "2-bedroom-type-2br-1-singapore.png"],
      ["3-bedroom", "3-bedroom-type-3br-1-singapore.png"],
      ["4-bedroom", "4-bedroom-type-4br-singapore.png"],
      ["5-bedroom", "5-bedroom-type-5br-L-singapore.png"],
      ["Penthouse", "penthouse-type-PH1-singapore.png"],
    ]),
  },
  "norwood-grand": {
    exterior: "https://norwoodsgrand.sg/wp-content/uploads/2024/08/norwood-grand-woodlands-champion-way-condo-by-cdl.jpeg",
    plans: P("https://norwoodsgrand.sg/wp-content/uploads/2024/09/norwood-grand-floor-plan-", [
      ["1-bedroom + study", "1-bedroom-study-type-A1S-singapore.png"],
      ["2-bedroom", "2-bedroom-type-B1-singapore.png"],
      ["3-bedroom", "3-bedroom-deluxe-type-C1-singapore.png"],
      ["4-bedroom + study", "4-bedroom-deluxe-study-type-D1S-singapore.png"],
    ]),
  },
  "the-myst": {
    exterior: "https://www.cdlhomes.com.sg/wp-content/uploads/2025/04/The-Myst_Hero_Day_ai.jpg",
    plans: P("https://themyst-condo.sg/wp-content/uploads/2023/06/", [
      ["1-bedroom + study · 517 sqft", "1-Bedroom-Study-Type-A1S-517-sqft.jpg"],
      ["2-bedroom · 678 sqft", "2-Bedroom-Type-B1-678-sqft.jpg"],
      ["3-bedroom · 850 sqft", "3-Bedroom-Type-C1-850-sqft.jpg"],
      ["4-bedroom · 1,518 sqft", "4-Bedroom-Type-D2-1518-sqft.jpg"],
      ["5-bedroom · 1,690 sqft", "5-Bedroom-Type-E1-1690-sqft.jpg"],
    ]),
  },
  "canninghill-piers": {
    exterior: "https://canninghillpier.sg/wp-content/uploads/2023/07/Canninghill-Piers-Facade-Aerial-View-Day.jpg",
    plans: P("https://canninghillpier.sg/wp-content/uploads/2021/10/", [
      ["1-bedroom · 409 sqft", "1-Bedroom-Type-A1-409-sqft.jpg"],
      ["2-bedroom + study · 818 sqft", "2-Bedroom-Study-Type-BS1-818sqft.jpg"],
      ["3-bedroom · 947 sqft", "3-Bedroom-Type-C1a-947sqft.jpg"],
      ["4-bedroom · 1,755 sqft", "4-Bedroom-Premium-Type-DP1-1755sqft.jpg"],
      ["5-bedroom · 2,788 sqft", "5-Bedroom-Premium-Type-EP1-2788sqft.jpg"],
    ]),
  },
  "lentor-mansion": {
    exterior: "https://lentormansion.propertybook.sg/wp-content/uploads/2024/03/Lentor-Mansion-Facade-Aerial-View.jpg",
    plans: P("https://lentormansion.propertybook.sg/wp-content/uploads/2024/03/", [
      ["2-bedroom · 527 sqft", "2-Bedroom-Type-B1-527-sqft.jpg"],
      ["3-bedroom · 786 sqft", "3-Bedroom-Type-C1-786-sqft.jpg"],
      ["4-bedroom · 1,227 sqft", "4-Bedroom-Type-D1-1227-sqft.jpg"],
      ["5-bedroom · 1,485 sqft", "5-Bedroom-Type-E1-1485-sqft.jpg"],
    ]),
  },
  "pinetree-hill": {
    exterior: "https://www.thepinetree-hill.com/wp-content/uploads/2023/08/pinetree-hill-hero-image-singapore.jpg",
    plans: P("https://www.thepinetree-hill.com/wp-content/uploads/2023/08/pinetree-hill-", [
      ["1-bedroom + study", "1rm-study-floor-plan-type-1bs.jpg"],
      ["2-bedroom", "2rm-floor-plan-type-2b.jpg"],
      ["3-bedroom", "3rm-floor-plan-type-3b1.jpg"],
      ["4-bedroom", "4rm-deluxe-floor-plan-type-4b.jpg"],
      ["5-bedroom", "5rm-premium-floor-plan-type-5bp.jpg"],
      ["Penthouse", "penthouse-floor-plan-type-ph.jpg"],
    ]),
  },
  "hillock-green": {
    exterior: "https://www.thehillock-green.com.sg/wp-content/uploads/2023/10/hillock-green-building-view-lentor-central-condo-singapore.jpeg",
    plans: P("https://www.thehillock-green.com.sg/wp-content/uploads/2023/10/hillock-green-floor-plan-", [
      ["1-bedroom", "1-bedroom-type-A1.jpg"],
      ["2-bedroom", "2-bedroom-type-B3.jpg"],
      ["3-bedroom", "3-bedroom-type-c1.jpg"],
      ["4-bedroom", "4-bedroom-classic-type-D1C.jpg"],
    ]),
  },
  "hill-house": {
    exterior: "https://www.hillhouse-condo.com/wp-content/uploads/2022/10/hill-house-draft-building1.jpg",
    plans: P("https://www.hillhouse-condo.com/wp-content/uploads/2022/10/hill-house-", [
      ["1-bedroom", "1rm-draft-floor-plan-type-a1.jpg"],
      ["1-bedroom + study", "1-1-rm-draft-floor-plan-type-a3-stack-4.jpg"],
      ["2-bedroom", "2rm-draft-floor-plan-type-b1-1.jpg"],
      ["3-bedroom", "3rm-draft-floor-plan-type-c1.jpg"],
    ]),
  },
  "ardor-residence": {
    exterior: "https://www.ardor-residence.com.sg/wp-content/uploads/2024/01/Ardor-Residence-Haig-Road.jpg",
    plans: P("https://www.ardor-residence.com.sg/wp-content/uploads/2024/01/Ardor-Residence-Plan-Type-", [
      ["Type A1", "A1.jpg"],
      ["Type B1", "B1.jpg"],
      ["Type C1", "C1.jpg"],
    ]),
  },
  "lakegarden-residences": {
    exterior: "https://lakegarden-residence.sg/wp-content/uploads/2023/06/Lakegarden-Residences-Facade-Aerial-View.jpg",
    plans: P("https://lakegarden-residence.sg/wp-content/uploads/2023/07/", [
      ["1-bedroom + study · 527 sqft", "1-Bedroom-Study-Type-AS1-527-sqft.jpg"],
      ["2-bedroom · 732 sqft", "2-Bedroom-Premium-Type-B3P-732-sqft.jpg"],
      ["3-bedroom · 926 sqft", "3-Bedroom-Type-C1-926-sqft.jpg"],
      ["4-bedroom · 1,335 sqft", "4-Bedroom-Type-D1-1335-sqft.jpg"],
      ["5-bedroom · 1,550 sqft", "5-Bedroom-Type-E1-1550-sqft.jpg"],
    ]),
  },
  "lentor-hills-residences": {
    exterior: "https://lentorhills-residences.com.sg/gryrsirs/2023/06/Sky-Garden-Bridge.jpg",
    plans: P("https://lentorhills-residences.com.sg/gryrsirs/2023/06/Lentor-Hills-Residences-", [
      ["1-bedroom", "1-Bedroom-Type-1a.jpg"],
      ["2-bedroom", "2-Bedroom-Type-2a.jpg"],
      ["3-bedroom", "3-Bedroom-Type-3a.jpg"],
      ["4-bedroom", "4-Bedroom-Type-4a.jpg"],
    ]),
  },
  "blossoms-by-the-park": {
    exterior: "https://www.blossomscondo.com.sg/wp-content/uploads/2023/02/blossoms-by-the-park-condominium-at-one-north-biopolis-Main-Facade-singapore.png",
    plans: P("https://www.blossomscondo.com.sg/wp-content/uploads/2023/04/blossoms-by-the-park-Floor-Plan-", [
      ["1-bedroom + study", "1-bedroom-study-type-A1-singapore.png"],
      ["2-bedroom", "2-bedroom-type-B1-singapore.png"],
      ["3-bedroom", "3-bedroom-type-C1-singapore.png"],
      ["4-bedroom", "4-bedroom-type-D1-singapore.png"],
    ]),
  },
  "the-hill-one-north": {
    exterior: "https://www.thehillatone-north.com/wp-content/uploads/2024/02/the-hill-at-one-north-hero-shot-slim-barracks-rise.jpeg",
    plans: P("https://www.thehillatone-north.com/wp-content/uploads/2024/02/the-hill-at-one-north-", [
      ["2-bedroom", "2-rm-floor-plan-type-2b-1.jpg"],
      ["3-bedroom", "3-rm-floor-plan-type-3b-1.jpg"],
      ["4-bedroom", "4-rm-floor-plan-type-4b-1.jpg"],
    ]),
  },
  "grange-1866": {
    exterior: "https://grange1866condo.sg/wp-content/uploads/2023/06/Grange-1866-Facade.jpg",
    plans: P("https://grange1866condo.sg/wp-content/uploads/2023/06/", [
      ["1-bedroom · 527 sqft", "1-Bedroom-Type-A-527-sqft.jpg"],
      ["2-bedroom · 710 sqft", "2-Bedroom-Type-B1-710-sqft.jpg"],
      ["2-bedroom premium · 764 sqft", "2-Bedroom-Premium-Type-B2-764-sqft.jpg"],
      ["2-bedroom premium · 829 sqft", "2-Bedroom-Premium-Type-B4-829-sqft.jpg"],
    ]),
  },
  "the-shorefront": {
    exterior: "https://shorefront.sg/wp-content/uploads/2023/07/Shorefront-Facade-View-from-Jalan-Loyang-Besar.jpg",
    plans: P("https://shorefront.sg/wp-content/uploads/2023/08/", [
      ["2-bedroom · 786 sqft", "2-Bedroom-Utility-Type-A1-786-sqft.jpg"],
      ["2-bedroom · 818 sqft", "2-Bedroom-Utility-Type-A2-818-sqft.jpg"],
      ["3-bedroom · 926 sqft", "3-Bedroom-Utility-Type-B2-926-sqft.jpg"],
      ["3-bedroom · 980 sqft", "3-Bedroom-Utility-Type-B1-980-sqft.jpg"],
      ["4-bedroom penthouse · 1,572 sqft", "4-Bedroom-Utility-Type-C2-PH-1572-sqft-Lower-Storey.jpg"],
    ]),
  },
  "terra-hill": {
    exterior: "https://cdn.sanity.io/images/u1c87m9s/production/aa4984a682e223b0a30f2ea94d8e5d91438e4c01-1600x900.jpg",
    plans: P("https://cdn.sanity.io/images/u1c87m9s/production/", [
      ["Layout 1", "b7c4cfc8074325caae7cc55f8af82cc6d767584b-1056x1536.jpg"],
      ["Layout 2", "4623cae0044329346edc7af514ed816e122816cc-1056x1536.jpg"],
      ["Layout 3", "5ec01646348a63cf423d2af1108be7890a3a3fde-1056x1536.jpg"],
      ["Layout 4", "a8132297a5105d86b3703268bb05946f7eead5e8-1056x1536.jpg"],
      ["Layout 5", "b5ebf6d66d2d2b552d0d0d72f760f9ea176e408c-1056x1536.jpg"],
      ["Layout 6", "27a5fefa5f61668daa7fd021137db8cbff4c1437-1056x1536.jpg"],
    ]),
  },
  "hillhaven": {
    exterior: "https://www.hillhaven.com.sg/globalassets/media-library/fareast/hillhaven/highlights/highlights1_north-facing-facade_1100x490.jpg",
    plans: P("https://www.hillhaven.com.sg/globalassets/media-library/fareast/hillhaven/floorplan/", [
      ["2-bedroom", "2br_floorplan.png"],
      ["2-bedroom + study", "2br-study_floorplan.png"],
      ["3-bedroom", "hillhaven-floor-plan_3bedroom-784x654.jpg"],
      ["3-bedroom + study", "hillhaven-floor-plan_3bedroom-plus-study-784x711.jpg"],
      ["4-bedroom", "4br_floorplan.png"],
    ]),
  },
  "novo-place": {
    exterior: "https://www.hdbec.sg/wp-content/uploads/2024/10/Novo-Place-EC-@-Tengah_0-1.jpg",
    plans: P("https://www.hdbec.sg/wp-content/uploads/2024/10/Novo-Place-Floor-Plan-", [
      ["3-bedroom · 872 sqft", "3-Bedroom-Type-C1-81-Sqm_872-Sqft.jpg"],
      ["3-bedroom + study · 947 sqft", "3-Bedroom-Study-Type-C3-88-Sqm_947-Sqft.jpg"],
      ["4-bedroom · 1,012 sqft", "3-Bedroom-Type-D1-94-Sqm_1012-Sqft.jpg"],
      ["4-bedroom + study · 1,163 sqft", "4-Bedroom-Study-Type-D2-108-Sqm_1163-Sqft.jpg"],
    ]),
  },
  "orchard-sophia": {
    exterior: "https://orchardsophia.propertybook.sg/wp-content/uploads/2023/07/Orchard-Sophia-Facade-View-from-Entrance.jpg",
    plans: P("https://www.the-orchardsophia.com/wp-content/uploads/2023/08/orchard-sophia-", [
      ["1-bedroom", "1rm-type-a.jpg"],
      ["2-bedroom", "2rm-deluxe-type-b1a.jpg"],
      ["2-bedroom premium", "2rm-premium-type-c1a.jpg"],
      ["3-bedroom", "3rm-type-d1.jpg"],
      ["3-bedroom dual-key", "3rm-dual-key-type-dk2a.jpg"],
    ]),
  },
  "the-continuum": {
    exterior: "https://the-continuum-condo.com.sg/wp-content/uploads/2023/07/The-Continuum-Condo-Facade-Aerial-View.jpg",
    plans: P("https://the-continuum-condo.com.sg/wp-content/uploads/2023/04/", [
      ["1-bedroom + study · 560 sqft", "1-Bedroom-Study-Type-A-560-sqft.jpg"],
      ["2-bedroom · 646 sqft", "2-Bedroom-Type-B1-646-sqft.jpg"],
      ["3-bedroom · 872 sqft", "3-Bedroom-Type-C1-872-sqft.jpg"],
      ["4-bedroom · 1,227 sqft", "4-Bedroom-Type-D1-1227-sqft.jpg"],
      ["5-bedroom · 1,905 sqft", "5-Bedroom-Type-E-1905-sqft.jpg"],
    ]),
  },
  "sora": {
    exterior: "https://thesoracondo.sg/wp-content/uploads/2024/01/Sora-Condo-Facade-View-from-Lake.jpg",
    plans: P("https://thesoracondo.sg/wp-content/uploads/2024/06/", [
      ["1-bedroom + study · 538 sqft", "1-Bedroom-Study-Type-A1S-538-sqft.jpg"],
      ["2-bedroom · 646 sqft", "2-Bedroom-Deluxe-Type-B1-646-sqft.jpg"],
      ["3-bedroom · 936 sqft", "3-Bedroom-Deluxe-Type-C1-936-sqft.jpg"],
      ["4-bedroom · 1,528 sqft", "4-Bedroom-Luxury-Type-D1-1528-sqft.jpg"],
      ["5-bedroom · 1,679 sqft", "5-Bedroom-Luxury-Type-E1-1679-sqft.jpg"],
    ]),
  },
  "lentoria": {
    exterior: "https://lentoria-condo.sg/wp-content/uploads/2026/09/Lentoria-Condo-Facade-Aerial-View-Night.jpg",
    plans: P("https://lentoria-condo.sg/wp-content/uploads/2024/02/", [
      ["1-bedroom · 538 sqft", "1-Bedroom-Type-A1-538-sqft.jpg"],
      ["2-bedroom · 700 sqft", "2-Bedroom-Type-B1-700-sqft.jpg"],
      ["3-bedroom · 915 sqft", "3-Bedroom-Type-C1-915-sqft.jpg"],
      ["4-bedroom · 1,206 sqft", "4-Bedroom-Type-D1-1206-sqft.jpg"],
    ]),
  },
  "watten-house": {
    exterior: "https://wattenhouse.condo-official.sg/wp-content/uploads/2024/02/Hero-2.jpg",
    plans: P("https://www.thewatten-house.com/wp-content/uploads/2023/11/watten-house-", [
      ["3-bedroom", "3-rm-floor-plan-type-c1.jpg"],
      ["3-bedroom + study", "3-rm-study-floor-plan-type-cs1.jpg"],
      ["4-bedroom", "4-rm-floor-plan-type-d1.jpg"],
      ["5-bedroom", "5-rm-floor-plan-type-e1.jpg"],
    ]),
  },
};

// ---------- Extra photos for the gallery at the top of each card ----------
// The first picture is `exterior` above. BTO extras are real construction photos
// that people posted on BTOHQ (with the month they were taken).
const PROG = "https://btohq.sgp1.cdn.digitaloceanspaces.com/users/";
const prog = (month, list) => list.map((p) => ({ src: `${PROG}${p.replace("/", "/development/bto/")}.jpg`, caption: `Construction progress · ${month}` }));
const W = (base, files) => files.map((f) => base + f);

const EXTRA = {
  "kovan-wellspring": prog("Jun 2026", ["7b877ee0100733b2cd122b55917d5866/cdf2325e0c90d8ee31a4f615644c91e9", "7b877ee0100733b2cd122b55917d5866/2bdf05ef406dfe2bcd6a77c44253e25d", "7b877ee0100733b2cd122b55917d5866/d1cfea18f68aed384ce78f486df85b80", "7b877ee0100733b2cd122b55917d5866/48ee5551f318eba80e6c503493907f23"]),
  "bishan-ridges": [...prog("Jun 2026", ["7b877ee0100733b2cd122b55917d5866/5f5cdcb789aedc3fa8cffc53436c7f3e", "7b877ee0100733b2cd122b55917d5866/250a4dbf22df48198ea10c6272d8ccce", "7b877ee0100733b2cd122b55917d5866/72d0c397d082902fbe867046d0bfd8c8"]), ...prog("Apr 2026", ["1c5b9000d49a0391b5be1a453a773431/2a1bb163e8fe68021d1d8c7fb83a8701"])],
  "heart-of-yew-tee": [...prog("Oct 2026", ["b6f3472a2e27ccd97b7e154cfdbf5c01/e5da936dd114d9f6eeb82fc3c7c57435"]), ...prog("Sep 2025", ["6af03fc25ac49a2a506b599d19262fc2/cea9738cebee1bc8f6b85e62f5ab5607"]), ...prog("Jul 2025", ["6af03fc25ac49a2a506b599d19262fc2/4fbcff4dcc68f3331464515a533d811d", "6af03fc25ac49a2a506b599d19262fc2/0132cfdfdd9e0c6ac1aba3d712f2352d"])],
  "keat-hong-grange": prog("Aug 2026", ["9d625da3577dfea1c407bc2a3fb2375b/e5fa68bf89fb0d021c760aa1bbed2bf8", "9d625da3577dfea1c407bc2a3fb2375b/4ba0954fa116701ff2e14f7bd880cc69", "9d625da3577dfea1c407bc2a3fb2375b/40dc90047a6c4b4544cf449ecbf5df4b", "9d625da3577dfea1c407bc2a3fb2375b/ab0f9385cd7d1a7bedf68425430eba3f"]),
  "lakeside-view": [...prog("Apr 2025", ["6af03fc25ac49a2a506b599d19262fc2/9f487d7ea318a54c942ff101735b3f66"]), ...prog("Dec 2024", ["b848ed6e9d742acf3b61c06af19c3efc/72e9a02b7d6d7eb56b99509b58e96b58", "b848ed6e9d742acf3b61c06af19c3efc/d0f72c59b511ede1a5bdc053bf7b9730", "b848ed6e9d742acf3b61c06af19c3efc/23558ca7f1540d5d838a5a0d89d63a87"])],
  "kent-heights": [...prog("Dec 2025", ["91f9d0fa0c6c43c14e0c1b0c4e3bf9f2/32847d1be1fa9c0579cd80410f72695b"]), ...prog("Nov 2025", ["91f9d0fa0c6c43c14e0c1b0c4e3bf9f2/96098ab1cd47cf78438d3cc4b6a2f69e", "91f9d0fa0c6c43c14e0c1b0c4e3bf9f2/41cb1799d8defa1474913df4081c9869", "91f9d0fa0c6c43c14e0c1b0c4e3bf9f2/330502c4c68ce1c0ad0e754518e7d418"])],
  "towner-residences": prog("Dec 2025", ["38abfbc525b053fe1357e8865281c3ad/247f209cc278a5e20daa2685bab9a3b7", "38abfbc525b053fe1357e8865281c3ad/ddb91bd07bd579733f8b4017a5268502", "38abfbc525b053fe1357e8865281c3ad/33d3d0c1e6dde7ebfd87ca68a722020e", "38abfbc525b053fe1357e8865281c3ad/2297dbc893603a4b5772d59553ccfbff"]),
  "garden-waterfront": prog("Aug 2026", ["0f87204d197248cb8b099683884b7176/98e2d464852ee8eafbfecccc629dda5a", "0f87204d197248cb8b099683884b7176/e49da9235fe1500f34f46923b0340741", "0f87204d197248cb8b099683884b7176/5cfeb3a256edf5f73cb2af9de2455e04", "0f87204d197248cb8b099683884b7176/1e5c85cc927267a089efae90f320c15e"]),
  "woodlands-south-plains": [...prog("Jul 2025", ["1582e02a0b7a58606a0ed3006b93f49d/8aafa9308d77484e78e4161123b09474", "1582e02a0b7a58606a0ed3006b93f49d/b2f2847aca630880b874322768e8c8a5"]), ...prog("Jun 2025", ["1582e02a0b7a58606a0ed3006b93f49d/58139838d3d84d3355468d7fd9d401d6", "1582e02a0b7a58606a0ed3006b93f49d/dc4688706b591d22144ab55fdb4726c3"])],
  "telok-blangah-beacon": [...prog("Jul 2026", ["ea7c2be8189f12f4ffee6ad721304a69/17a40db63feb8166ba185a11a9e7ebc4"]), ...prog("Apr 2026", ["1873bfa44727928c20303392d502e72b/6604fa33b050331e6ce794f7d50c8b0d", "1873bfa44727928c20303392d502e72b/7f4c99bccc9b4958966119a7728287f0", "1873bfa44727928c20303392d502e72b/9c3e32ba2519fb93a03adda6c3efb580"])],
  "parc-meadow": [...prog("Nov 2025", ["a0e1cb167ec08d3ee6ba926201fe292c/4169dffc8cae8fff42f7d9c19c4de1c8"]), ...prog("Aug 2025", ["1582e02a0b7a58606a0ed3006b93f49d/16ce5931cdccac83c747b4c7c638bf70", "1582e02a0b7a58606a0ed3006b93f49d/25cfbd0f60440a5ec977d24971f1fb1e", "1642250d138d000872b66d9eac4ed379/b3041d7b05901cffe03d048378421f1e"])],
  "sin-ming-residences": prog("Dec 2025", ["38abfbc525b053fe1357e8865281c3ad/176feb2ca453e4d80acdd1ddb131efc1", "38abfbc525b053fe1357e8865281c3ad/863e1cd3574922b3873c051e1c5c8cd8", "38abfbc525b053fe1357e8865281c3ad/e492a95c319d6e8a22211f94f9e7ab49", "38abfbc525b053fe1357e8865281c3ad/03e9960c15eb93fbacf9dc15b8a15423"]),

  "grand-dunman": W("https://www.grandsdunman.com.sg/wp-content/uploads/2023/06/", ["dunman-road-condo-dunman-grand-Grand-Block-singapore.jpg", "grand-dunman-condo-by-singhaiyi-near-dakota-mrt-singapore.jpeg"]),
  "norwood-grand": W("https://norwoodsgrand.sg/wp-content/uploads/2024/09/", ["Norwood-Grand-Aerial-Evening-1.jpg", "Norwood-Grand-Cabana-Garden-1.jpg", "Norwood-Grand-tranquil-Swing-1.jpg"]),
  "the-myst": W("https://themyst-condo.sg/wp-content/uploads/", ["2023/06/The-Myst-Condo-Lap-Pool.jpg", "2023/06/Grand-Arrival-Entrance-at-The-Myst.jpg", "2023/06/The-Myst-Clubhouse-Gym-Overlooking-Pool.jpg", "2026/07/The-Myst-Condo-Facilities-Social-Lounge.jpg"]),
  "canninghill-piers": W("https://canninghillpier.sg/wp-content/uploads/2023/07/Canninghill-Piers-", ["Facade-Worm-Eye-View.jpg", "Condo-Facilities-Jogging-Track-and-Playground.jpg"]),
  "lentor-mansion": W("https://lentormansion.propertybook.sg/wp-content/uploads/2024/03/Lentor-Mansion-Condo-", ["Facilities-50m-Lap-Swimming-Pool.jpg", "Facilities-Clubhouse-Pool-Evening-View.jpg", "Facilities-Grand-Lawn.jpg", "Facilities-Forest-Pavilion.jpg"]),
  "pinetree-hill": W("https://www.thepinetree-hill.com/wp-content/uploads/2023/08/", ["pinetree-hill-waterwall-vertical-oasis-singapore.jpg"]),
  "hillock-green": W("https://www.thehillock-green.com.sg/wp-content/uploads/2023/10/", ["hillock-green-swimming-pool-lentor-central-condo.jpg", "hillock-green-views-lentor-central-condo-by-united-engineers-china-commnunications-and-soilbuild.jpg"]),
  "hill-house": W("https://www.hillhouse-condo.com/wp-content/uploads/2022/10/", ["hillhouse_pes_1.jpg", "hillhouse_pes_2.jpg", "hillhouse_pes_3.jpg"]),
  "ardor-residence": W("https://www.ardor-residence.com.sg/wp-content/uploads/2024/01/", ["Ardor-Residence-Swimming-Pool.jpg"]),
  "lakegarden-residences": W("https://lakegarden-residence.sg/wp-content/uploads/2023/0", ["7/Lakegarden-Residences-Facade-View-from-Lake.jpg", "7/Lakegarden-Residences-Facade-Aerial-View-at-Night.jpg", "6/Lakegarden-Residences-Lap-Pool-and-Gym-View.jpg", "7/Lakegarden-Residences-Condo-Facilities-Panoramic-Views-from-Sky-Lounge.jpg"]),
  "lentor-hills-residences": W("https://esingaporeproperty.sg/wp-content/uploads/2018/04/", ["Lentor-Hill-Condo-View-from-Lentor-Hills-Drive.jpeg", "Lentor-Hill-Residence-View-of-Blocks.jpeg", "Lentor-Hills-Condo-Facilities-and-Pool.jpeg", "View-of-Pool-and-Gym.jpeg"]),
  "blossoms-by-the-park": W("https://www.blossomscondo.com.sg/wp-content/uploads/2023/02/", ["blossoms-by-the-park-at-slim-barracks-rise-near-buona-vista-mrt-pool-view-singapore.jpg", "blossoms-by-the-park-condo-at-slim-barracks-rise-fusionopolis-drop-off-point-singapore-scaled.jpg"]),
  "the-hill-one-north": W("https://www.thehillatone-north.com/wp-content/uploads/2024/02/the-hill-at-one-north-", ["main-side-perspective-slim-barracks-rise.jpg", "pool-view-slim-barracks-rise.jpg"]),
  "grange-1866": W("https://grange1866condo.sg/wp-content/uploads/2023/06/", ["Grange-1866-Condo-Grand-Arrival-Entrance.jpg", "Grange-1866-Lap-Pool.jpg", "Condo-Facilities-at-Grange-1866.jpg"]),
  "the-shorefront": W("https://shorefront.sg/wp-content/uploads/2023/0", ["7/Shorefront-Rooftop-Lap-Pool-Overlooking-Changi-Beach.jpg", "8/The-Shorefront-Condo-Facilities-Sky-Pool-and-Sky-Gym.jpg"]),
  "terra-hill": W("https://cdn.sanity.io/images/u1c87m9s/production/", ["5523dc0dc6fc5bd5438d1e30149729c42b106fed-1536x878.jpg"]),
  "hillhaven": W("https://www.hillhaven.com.sg/globalassets/media-library/fareast/hillhaven/", ["gallery/ep01--main-entrance-v1.jpg", "gallery/ep05--50m-pool.jpg", "gallery/ep02--arrival-court.jpg", "gallery/ep08--bbq-pavilion-1.jpg", "overview/approved-perspective-factsheet-1320x495.jpg"]),
  "novo-place": W("https://www.hdbec.sg/wp-content/uploads/2024/10/Novo-Place-EC-@-Tengah_", ["2-1.jpg", "3-1.jpg", "4-1.jpg", "5-1.jpg"]),
  "orchard-sophia": [...W("https://orchardsophia.propertybook.sg/wp-content/uploads/2023/07/Orchard-Sophia-", ["Facade-View-from-Side-Entrance.jpg", "Condo-Facilities-Rooftop-Lounge.jpg", "Condo-Facilities-Spa-Pool.jpg"])],
  "the-continuum": W("https://the-continuum-condo.com.sg/wp-content/uploads/", ["2023/07/The-Continuum-Condo-Facilities-Swimming-Pool.jpg", "2023/07/The-Continuum-Condo-Facilities-South-Clubhouse.jpg", "2023/07/Panoramic-Views-from-The-Continuum-Condo-Balcony.jpg", "2023/07/Linkway-Bridge-Connecting-Continuum-Condo-North-Site-and-South-Site.jpg"]),
  "sora": W("https://thesoracondo.sg/wp-content/uploads/2024/0", ["6/Sora-Facade-Aerial-View-Overlooking-Surroundings.jpg", "1/Sora-Condo-Facilities-Serenity-Swimming-Pool.jpg", "1/Sora-Condo-Facilities-Grand-Arrival-Lobby.jpg", "6/Sora-Condo-Facilities-Family-Pool.jpg", "6/Sora-Condo-Facilities-The-Creek.jpg"]),
  "lentoria": W("https://lentoria-condo.sg/wp-content/uploads/20", ["24/02/Lentoria-Condo-Facilities-Swimming-Pool-Night-View.jpg", "26/09/Lentoria-Condo-Facilties-Grand-Arrival.jpg", "24/01/Lentoria-Condo-Facilities-Swimming-Pool.jpg"]),
  "watten-house": [...W("https://wattenhouse.condo-official.sg/wp-content/uploads/2024/02/", ["Hero-3.jpg", "Hero-1.jpg", "Hero-4.jpg"]), "https://www.thewatten-house.com/wp-content/uploads/2023/11/watten-house-50m-lap-pool-and-poolside-lounge.jpg", "https://www.thewatten-house.com/wp-content/uploads/2023/11/watten-house-spa-pool-and-lap-pool.jpg"],
};

// All photos for a project: [{ src, caption }], building first.
export function photosFor(id) {
  const m = MEDIA[id];
  if (!m) return [];
  const first = m.exterior ? [{ src: m.exterior, caption: "Artist's impression" }] : [];
  const extra = (EXTRA[id] || []).map((x) => (typeof x === "string" ? { src: x, caption: "Artist's impression" } : x));
  return [...first, ...extra];
}
