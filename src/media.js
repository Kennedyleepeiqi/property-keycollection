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
    exterior: "https://www.the-orchardsophia.com/wp-content/uploads/2023/08/orchard-sophia-hero-shot-sophia-road-singapore.png",
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
    exterior: "https://lentoria-condo.sg/wp-content/uploads/2026/09/Lentoria-Condo-Facade-Aerial-View-Day.jpg",
    plans: P("https://lentoria-condo.sg/wp-content/uploads/2024/02/", [
      ["1-bedroom · 538 sqft", "1-Bedroom-Type-A1-538-sqft.jpg"],
      ["2-bedroom · 700 sqft", "2-Bedroom-Type-B1-700-sqft.jpg"],
      ["3-bedroom · 915 sqft", "3-Bedroom-Type-C1-915-sqft.jpg"],
      ["4-bedroom · 1,206 sqft", "4-Bedroom-Type-D1-1206-sqft.jpg"],
    ]),
  },
  "watten-house": {
    exterior: "https://www.thewatten-house.com/wp-content/uploads/2023/11/watten-house-50m-lap-pool-and-poolside-lounge.jpg",
    plans: P("https://www.thewatten-house.com/wp-content/uploads/2023/11/watten-house-", [
      ["3-bedroom", "3-rm-floor-plan-type-c1.jpg"],
      ["3-bedroom + study", "3-rm-study-floor-plan-type-cs1.jpg"],
      ["4-bedroom", "4-rm-floor-plan-type-d1.jpg"],
      ["5-bedroom", "5-rm-floor-plan-type-e1.jpg"],
    ]),
  },
};
