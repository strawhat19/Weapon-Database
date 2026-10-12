import type { GunGeometry } from './gunGeometry';

export const assemblePistolModel = (assembly: GunGeometry) => {
  const { box, tube, panel, sleeve, rivets, cylinder, sidePanels, paint, paintInset, metal, rubber, trim, recess } = assembly;
  const trace = (points: readonly (readonly [number, number])[]) => points.map(([x, y]) => [(x - 817) / 634, (423 - y) / 634] as const);
  panel(`pistol-slide`, trace([[222, 263], [234, 218], [261, 143], [285, 125], [734, 122], [735, 186], [753, 209], [879, 212], [914, 184], [916, 122], [1418, 121], [1439, 142], [1439, 264]]), .33, paint, 0, [], .018);
  tube(metal, .28, .36, 0, 1.52, .079);
  sleeve(metal, 1.04, .36, .08, .082);
  panel(`pistol-frame`, trace([[222, 269], [1434, 271], [1440, 333], [1422, 391], [1009, 391], [976, 416], [970, 476], [972, 527], [985, 561], [978, 578], [709, 578], [626, 566], [590, 582], [566, 640], [529, 863], [192, 827], [142, 812], [267, 630], [280, 465], [270, 404], [250, 377], [157, 356], [145, 345], [148, 332], [192, 319], [215, 291]]), .30, paint, 0,
    [trace([[646, 411], [905, 403], [938, 419], [950, 450], [945, 510], [916, 544], [725, 546], [681, 537], [650, 505], [635, 465]])], .025);
  sidePanels(`pistol-slide-lower-bevel`, trace([[231, 251], [1432, 251], [1432, 264], [222, 264]]), .011, paintInset, .17);
  sidePanels(`pistol-slide-rear-top-bevel`, trace([[286, 126], [727, 126], [727, 144], [279, 144]]), .011, paintInset, .17);
  sidePanels(`pistol-slide-front-top-bevel`, trace([[923, 125], [1418, 125], [1431, 143], [923, 143]]), .011, paintInset, .17);
  sidePanels(`pistol-dustcover-contour`, trace([[1009, 390], [1422, 390], [1438, 339], [1091, 339]]), .012, paintInset, .16);
  sidePanels(`pistol-grip-insert`, [[-.75, .137], [-.421, .127], [-.356, .078], [-.441, -.194], [-.421, -.257], [-.449, -.389], [-.507, -.665], [-.873, -.621], [-.861, -.55], [-.749, -.226], [-.692, -.008]], .016, rubber, .164);
  sidePanels(`pistol-grip-border`, [[-.752, .157], [-.406, .147], [-.332, .08], [-.417, -.194], [-.398, -.256], [-.425, -.393], [-.489, -.687], [-.899, -.638], [-.883, -.548], [-.771, -.225], [-.716, -.009]], .008, metal, .157);
  sidePanels(`pistol-frontstrap-insert`, [[-.358, -.367], [-.411, -.338], [-.499, -.687], [-.455, -.695]], .012, rubber, .16);
  sidePanels(`pistol-backstrap-insert`, [[-.827, -.042], [-.775, -.067], [-.949, -.617], [-.992, -.599]], .013, rubber, .158);
  for (let index = 0; index < 9; index += 1) {
    const x = -.775 + index * .037;
    for (const side of [-1, 1]) {
      box(recess, x, .386, side * .181, .017, .188, .012, -.23);
      box(metal, x + .009, .386, side * .186, .009, .18, .012, -.23);
    }
  }
  for (let index = 0; index < 15; index += 1) {
    const y = -.095 - index * .034;
    box(rubber, -.79 - index * .011, y, 0, .025, .011, .298, -.29);
  }
  panel(`pistol-curved-trigger`, trace([[697, 402], [790, 403], [777, 426], [776, 462], [791, 499], [819, 528], [804, 531], [767, 514], [740, 471], [717, 435]]), .055, recess, 0, [], .008);
  sidePanels(`pistol-slide-stop`, [[-.462, .183], [-.302, .183], [-.29, .127], [-.328, .113], [-.461, .117]], .025, metal, .177);
  for (const side of [-1, 1]) {
    for (let index = 0; index < 6; index += 1) box(trim, -.442 + index * .024, .145, side * .196, .008, .033, .004, -.12);
    cylinder(metal, -.078, .093, side * .166, .036, .026, `z`);
    cylinder(recess, -.077, .093, side * .181, .026, .01, `z`);
    panel(`pistol-magazine-release`, [[-.399, -.14], [-.332, -.163], [-.352, -.214], [-.413, -.198]], .022, metal, side * .174);
    box(rubber, -.371, -.177, side * .191, .056, .034, .012, -.32);
  }
  box(metal, .72, .085, 0, .53, .045, .27);
  for (let index = 0; index < 5; index += 1) box(metal, .72 - .265 + (index + .5) * .106, .05, 0, .065, .03, .27);
  box(recess, .72, .033, 0, .55, .018, .245);
  panel(`pistol-magazine-floorplate`, [[-.945, -.663], [-.46, -.716], [-.467, -.759], [-.91, -.716], [-.955, -.692]], .33, metal, 0, [], .022);
  box(rubber, -.699, -.729, 0, .478, .035, .35, -.11);
  panel(`pistol-rear-sight-base`, trace([[290, 132], [382, 135], [376, 114], [298, 109]]), .25, metal);
  for (const side of [-1, 1]) panel(`pistol-rear-sight`, trace([[302, 112], [373, 112], [346, 79], [310, 79]]), .061, metal, side * .083);
  panel(`pistol-front-sight`, trace([[1340, 122], [1418, 122], [1400, 94], [1351, 94]]), .07, metal);
  cylinder(trim, .925, .504, .042, .008, .005, `z`);
  rivets([[-.627, -.069], [-.813, -.565]], .344);
  rivets([[-.378, .087]], .316);
};
