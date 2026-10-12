import type { GunGeometry } from './gunGeometry';

type Point = readonly [number, number];

export const assembleShotgunModel = (assembly: GunGeometry) => {
  const { paint, metal, trim, rubber, recess, paintInset } = assembly;
  const { box, tube, ring, rail, panel, sleeve, rivets, trigger, lathed, cylinder, ellipsoid, sidePanels } = assembly;
  const stock: readonly Point[] = [
    [-2.06, .302], [-1.29, .358], [-1.183, .383], [-1.127, .331], [-1.067, .331], [-.995, .372],
    [-.916, .432], [-.816, .499], [-.723, .522], [-.711, .289], [-.798, .244], [-.874, .184],
    [-.937, .105], [-.989, .014], [-1.017, -.087], [-1.076, -.083], [-1.16, -.060], [-1.234, -.011],
    [-1.356, -.062], [-1.591, -.178], [-1.934, -.301], [-2.029, -.27], [-2.065, -.2],
  ];
  panel(`shotgun-sculpted-shoulder-stock`, stock, .32, paint, 0, [], .046);
  sidePanels(`shotgun-stock-side-contour`, [
    [-2.028, .281], [-1.35, .335], [-1.202, .356], [-1.148, .310], [-1.109, .223],
    [-1.238, .013], [-1.581, -.153], [-1.937, -.272], [-2.005, -.235],
  ], .018, paint, .153);
  sidePanels(`shotgun-wrist-border`, [
    [-.827, .42], [-.856, .292], [-.946, .230], [-1.015, .125], [-1.065, -.040],
    [-1.18, -.014], [-1.22, .039], [-1.164, .188], [-1.06, .305],
  ], .023, paint, .164);
  sidePanels(`shotgun-stippled-wrist`, [
    [-.848, .397], [-.875, .301], [-.965, .229], [-1.029, .120], [-1.079, -.02],
    [-1.158, .005], [-1.192, .043], [-1.141, .182], [-1.044, .29],
  ], .012, paintInset, .18);
  panel(`shotgun-vented-recoil-pad`, [
    [-2.108, .310], [-2.036, .296], [-2.031, .159], [-2.018, -.07], [-2.003, -.239],
    [-2.026, -.288], [-2.103, -.326], [-2.142, -.29], [-2.17, -.169], [-2.177, .201], [-2.155, .282],
  ], .36, rubber, 0, [], .035);
  for (let index = 0; index < 14; index += 1) {
    const y = .252 - index * .039;
    for (const side of [-1, 1]) {
      box(recess, -2.10 + Math.max(0, .04 - y) * .05, y, side * .185, .06, .021, .011, -.03);
      box(metal, -2.116, y - .015, side * .187, .071, .008, .006, -.03);
    }
  }
  const port: readonly Point[] = [
    [-.281, .489], [-.265, .511], [-.232, .52], [.024, .52], [.058, .509], [.071, .485],
    [.071, .413], [.058, .390], [.029, .382], [-.234, .382], [-.263, .39], [-.281, .413],
  ];
  panel(`shotgun-compact-action`, [
    [-.837, .426], [-.756, .489], [-.653, .528], [-.475, .548], [.19, .548], [.227, .529],
    [.249, .473], [.249, .22], [.212, .203], [-.209, .228], [-.722, .228], [-.79, .27],
  ], .37, paint, 0, [port], .028);
  panel(`shotgun-deep-ejection-cavity`, port, .05, recess, 0, [], .018);
  for (const side of [-1, 1]) {
    ellipsoid(metal, -.108, .436, side * .105, .176, .056, .065);
    box(recess, -.101, .479, side * .159, .266, .019, .01);
    box(trim, -.097, .393, side * .166, .27, .009, .008);
    cylinder(recess, .037, .435, side * .174, .016, .009, `z`);
    cylinder(metal, -.691, .273, side * .193, .018, .016, `z`);
    cylinder(recess, -.005, .26, side * .193, .017, .015, `z`);
  }
  sidePanels(`shotgun-action-stock-seam`, [[-.774, .435], [-.750, .474], [-.733, .276], [-.748, .259]], .008, paintInset, .192);
  sidePanels(`shotgun-action-bottom-seam`, [[-.691, .235], [.204, .212], [.204, .221], [-.691, .245]], .008, paintInset, .192);
  panel(`shotgun-rounded-trigger-bow`, [
    [-.709, .23], [-.30, .223], [-.343, .162], [-.379, .093], [-.438, .067],
    [-.57, .071], [-.634, .081], [-.68, .115],
  ], .17, metal, 0, [[
    [-.651, .207], [-.365, .202], [-.403, .131], [-.444, .097], [-.565, .101], [-.605, .118], [-.633, .15],
  ]], .023);
  trigger(-.598, .157, .118, .127);
  for (const side of [-1, 1]) cylinder(metal, -.682, .214, side * .1, .018, .018, `z`);
  tube(metal, 1.239, .42, 0, 2.098, .071);
  sleeve(metal, 2.291, .42, .058, .075);
  ring(2.32, .42, .071, trim);
  tube(metal, 1.105, .239, 0, 1.851, .061);
  sleeve(metal, 2.064, .239, .069, .073);
  cylinder(metal, 2.103, .239, 0, .066, .02, `x`);
  cylinder(recess, 2.115, .239, 0, .019, .008, `x`);
  for (let index = 0; index < 28; index += 1) {
    const angle = index * Math.PI * 2 / 28;
    ellipsoid(rubber, 2.079, .239 + Math.cos(angle) * .07, Math.sin(angle) * .07, .024, .007, .007);
  }
  const pumpProfile: Point[] = [[0, -.5], [.51, -.5], [.73, -.482], [.89, -.445], [.99, -.397]];
  for (let index = 0; index < 24; index += 1) {
    const position = -.382 + index * .0315;
    pumpProfile.push([1, position], [.89, position + .009], [.89, position + .018], [1, position + .025]);
  }
  pumpProfile.push([1, .381], [.98, .408], [.89, .45], [.74, .479], [.52, .5], [0, .5]);
  lathed(`shotgun-oval-ribbed-pump`, pumpProfile, paint, .98, .247, 1.02, .134, .19);
  for (const x of [.479, 1.481]) {
    lathed(`shotgun-rounded-pump-collar`, [[0, -.5], [.68, -.5], [.86, -.3], [1, .15], [.88, .5], [0, .5]], paint, x, .247, .046, .125, .18);
  }
  box(metal, -.221, .563, 0, .735, .028, .187);
  rail(-.221, .582, .72, .22);
  panel(`shotgun-rear-sight-base`, [[-.648, .597], [-.525, .597], [-.533, .640], [-.57, .656], [-.627, .635]], .14, metal, 0, [], .019);
  box(metal, -.582, .66, 0, .04, .035, .14);
  ring(-.582, .68, .032, metal);
  for (const side of [-1, 1]) {
    box(metal, -.582, .681, side * .053, .06, .067, .023);
    cylinder(recess, -.6, .629, side * .078, .019, .012, `z`);
  }
  box(metal, 1.238, .496, 0, 2.02, .015, .06);
  for (let index = 0; index < 24; index += 1) box(recess, .285 + index * .081, .505, 0, .03, .009, .064);
  panel(`shotgun-front-sight-ramp`, [[2.023, .489], [2.219, .489], [2.174, .588], [2.098, .597]], .076, metal, 0, [[
    [2.081, .518], [2.137, .546], [2.161, .537], [2.167, .518],
  ]], .012);
  box(trim, 2.135, .591, 0, .067, .016, .022);
  tube(metal, 1.974, .42, 0, .035, .077);
  tube(metal, 1.974, .239, 0, .053, .078);
  box(paintInset, 1.974, .33, 0, .038, .16, .12);
  box(metal, 1.974, .139, 0, .064, .074, .075);
  for (const [x, y] of [[-1.899, -.294], [1.974, .105]] as const) {
    cylinder(metal, x, y, 0, .017, .16, `z`);
    for (const side of [-1, 1]) panel(`shotgun-sling-eye-${x}`, [[x - .029, y], [x + .029, y], [x + .025, y - .055], [x - .025, y - .055]], .022, metal, side * .061, [[
      [x - .013, y - .013], [x + .013, y - .013], [x + .012, y - .038], [x - .012, y - .038],
    ]], .009);
  }
  rivets([[-.7, .273], [-.005, .26]], .368);
};
