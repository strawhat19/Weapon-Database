import type { GunGeometry } from './gunGeometry';

type Point = readonly [number, number];

export const assembleMarksmanSights = (assembly: GunGeometry) => {
  const { box, panel, sleeve, cylinder, metal, trim } = assembly;
  box(metal, -.83, .593, 0, .132, .042, .24);
  cylinder(metal, -.83, .62, 0, .03, .249, `z`);
  box(metal, -.865, .658, 0, .066, .059, .145);
  sleeve(metal, -.865, .697, .045, .037);
  box(metal, 2.145, .588, 0, .127, .035, .244);
  cylinder(metal, 2.145, .611, 0, .025, .25, `z`);
  for (const side of [-1, 1]) panel(`mr14-front-sight-ear`, [[2.105, .618], [2.122, .716], [2.175, .716], [2.193, .618]], .025, metal, side * .075, [], .012);
  box(trim, 2.145, .665, 0, .017, .075, .022);
};

export const assembleMarksmanModel = (assembly: GunGeometry) => {
  const { box, tube, rail, ring, panel, sleeve, rivets, trigger, cylinder, sidePanels, paint, paintInset, metal, rubber, trim, recess } = assembly;
  const stockOpening: readonly Point[] = [[-2.039, .304], [-1.556, .323], [-1.316, .215], [-1.328, .131], [-1.529, .067], [-1.997, -.194], [-2.039, -.166]];
  panel(`mr14-open-adjustable-stock`, [
    [-2.143, .446], [-2.013, .492], [-1.514, .483], [-1.37, .407], [-1.242, .4], [-1.202, .326], [-1.222, .109],
    [-1.418, .028], [-1.815, -.263], [-2.027, -.321], [-2.132, -.282],
  ], .316, paint, 0, [stockOpening], .029);
  [-1, 1].forEach(side => {
    panel(`mr14-stock-side-frame`, [
      [-2.119, .424], [-2.012, .461], [-1.528, .452], [-1.373, .377], [-1.27, .373], [-1.239, .317], [-1.254, .128],
      [-1.435, .048], [-1.829, -.239], [-2.02, -.291], [-2.105, -.26],
    ], .014, paintInset, side * .164, [stockOpening], .026);
    box(metal, -1.402, .064, side * .18, .108, .022, .026, .31);
    cylinder(metal, -1.302, .294, side * .179, .036, .028, `z`);
    cylinder(recess, -1.302, .294, side * .197, .018, .01, `z`);
    cylinder(metal, -2.035, -.254, side * .185, .029, .019, `z`);
    cylinder(recess, -2.035, -.254, side * .199, .018, .008, `z`);
  });
  panel(`mr14-contoured-recoil-pad`, [[-2.196, .453], [-2.135, .453], [-2.117, .425], [-2.115, -.273], [-2.135, -.32], [-2.187, -.329], [-2.217, -.287], [-2.217, .416]], .368, rubber, 0, [], .032);
  panel(`mr14-pad-spacer`, [[-2.144, .436], [-2.112, .435], [-2.106, -.262], [-2.13, -.296], [-2.148, -.283]], .342, metal, 0, [], .013);
  for (let index = 0; index < 12; index += 1) [-1, 1].forEach(side => box(recess, -2.195, .384 - index * .054, side * .185, .041, .014, .012));
  tube(metal, -1.311, .354, 0, .776, .069);
  ring(-.966, .354, .082, metal);
  ring(-1.103, .354, .071, paintInset);
  for (const x of [-1.579, -1.464, -1.349, -1.234]) box(recess, x, .284, 0, .052, .014, .074);
  panel(`mr14-cheek-rest`, [[-2.041, .493], [-1.984, .554], [-1.584, .561], [-1.501, .524], [-1.476, .472], [-1.546, .426], [-2.014, .427]], .351, paint, 0, [], .04);
  sidePanels(`mr14-cheek-rest-inset`, [[-1.996, .485], [-1.948, .521], [-1.608, .525], [-1.542, .494], [-1.569, .465], [-1.991, .463]], .012, paintInset, .178);
  for (const x of [-1.863, -1.626]) {
    cylinder(metal, x, .424, 0, .014, .118);
    [-1, 1].forEach(side => {
      cylinder(metal, x, .437, side * .189, .026, .015, `z`);
      box(recess, x, .437, side * .2, .028, .007, .006);
    });
  }
  panel(`mr14-cheek-adjustment-lever`, [[-1.736, .361], [-1.659, .37], [-1.6, .324], [-1.615, .294], [-1.723, .296]], .032, metal, .19, [], .014);
  const port: readonly Point[] = [[-.389, .341], [.251, .341], [.284, .376], [.277, .459], [-.345, .46], [-.389, .423]];
  panel(`mr14-beveled-upper-receiver`, [[-.988, .498], [-.913, .548], [.502, .548], [.629, .495], [.638, .217], [-.872, .203], [-.984, .266]], .338, paint, 0, [port], .018);
  panel(`mr14-left-receiver-cover`, [[-.938, .28], [-.938, .476], [-.868, .518], [.481, .518], [.6, .472], [.603, .252]], .029, paint, -.177, [], .018);
  panel(`mr14-ejection-port-rim`, [[-.412, .32], [.263, .32], [.311, .374], [.297, .477], [-.355, .478], [-.411, .432]], .025, paintInset, .183, [port], .011);
  tube(metal, -.03, .401, .036, .63, .059);
  tube(trim, .022, .405, .061, .283, .043);
  box(recess, .055, .405, .108, .313, .018, .016);
  panel(`mr14-port-cover-hinge`, [[-.347, .334], [.259, .334], [.265, .312], [-.353, .311]], .039, metal, .207, [], .009);
  for (const x of [-.272, -.101, .07, .219]) cylinder(metal, x, .325, .225, .012, .083, `x`);
  panel(`mr14-rear-receiver-facet`, [[-.93, .456], [-.867, .497], [-.432, .497], [-.451, .36], [-.562, .287], [-.899, .278]], .013, paintInset, .179, [], .016);
  sidePanels(`mr14-receiver-upper-bevel`, [[-.848, .523], [.467, .523], [.536, .496], [-.863, .496]], .012, metal, .183);
  sidePanels(`mr14-receiver-lower-seam`, [[-.908, .245], [.609, .249], [.603, .226], [-.891, .222]], .012, recess, .183);
  panel(`mr14-machined-lower-receiver`, [[-.937, .236], [.585, .236], [.583, .094], [.491, -.077], [.114, -.107], [-.008, -.015], [-.652, -.009], [-.826, .03], [-.929, .099]], .381, paint, 0, [], .026);
  sidePanels(`mr14-lower-receiver-facet`, [[-.868, .188], [-.067, .185], [-.029, .056], [-.598, .037], [-.784, .069], [-.879, .115]], .014, paintInset, .197);
  sidePanels(`mr14-magwell-flare`, [[.032, .18], [.539, .179], [.508, .031], [.465, -.079], [.136, -.085], [.066, -.03]], .018, paintInset, .2);
  sidePanels(`mr14-magwell-mouth`, [[.123, -.081], [.466, -.075], [.459, -.115], [.14, -.123]], .015, metal, .21);
  [-1, 1].forEach(side => {
    cylinder(metal, -.652, .121, side * .218, .041, .023, `z`);
    cylinder(trim, -.652, .121, side * .234, .013, .009, `z`);
    box(metal, -.706, .141, side * .245, .117, .025, .024, -.38);
    cylinder(recess, -.806, .344, side * .207, .029, .033, `z`);
    cylinder(metal, -.806, .344, side * .23, .017, .018, `z`);
    box(metal, -.206, .188, side * .23, .091, .031, .038);
    box(recess, -.206, .187, side * .253, .061, .012, .008);
    cylinder(metal, .258, .109, side * .22, .029, .02, `z`);
    box(recess, .258, .109, side * .237, .024, .013, .008);
    for (let index = 0; index < 4; index += 1) box(trim, -.686 + index * .027, .184, side * .202, .013, .006, .009);
  });
  cylinder(metal, -.938, .451, 0, .025, .437, `z`);
  for (const side of [-1, 1]) {
    box(metal, -.96, .462, side * .256, .103, .036, .081);
    for (let index = 0; index < 4; index += 1) box(recess, -.993 + index * .02, .47, side * .298, .008, .024, .009);
  }
  panel(`mr14-swept-pistol-grip`, [[-.774, .048], [-.561, .014], [-.519, -.078], [-.552, -.168], [-.689, -.516], [-.682, -.599], [-.734, -.625], [-.994, -.553], [-1.024, -.502], [-.876, -.159]], .278, paint, 0, [], .039);
  sidePanels(`mr14-grip-panel-border`, [[-.785, -.09], [-.601, -.119], [-.623, -.217], [-.745, -.552], [-.927, -.497], [-.817, -.23]], .015, paintInset, .145);
  sidePanels(`mr14-grip-rubber-insert`, [[-.776, -.115], [-.623, -.142], [-.645, -.221], [-.76, -.526], [-.901, -.482], [-.796, -.225]], .014, rubber, .157);
  for (let row = 0; row < 10; row += 1) [-1, 1].forEach(side => {
    const x = -.654 - row * .012;
    const y = -.168 - row * .035;
    box(recess, x, y, side * .169, .05, .013, .009, -.38);
    box(recess, x - .098, y + .022, side * .169, .05, .013, .009, -.38);
  });
  panel(`mr14-grip-baseplate`, [[-1.002, -.521], [-.978, -.552], [-.73, -.621], [-.682, -.601], [-.682, -.624], [-.729, -.643], [-1.01, -.559]], .301, rubber, 0, [], .014);
  panel(`mr14-angular-trigger-guard`, [[-.623, .007], [-.009, .007], [.023, -.049], [-.005, -.172], [-.103, -.2], [-.498, -.191], [-.587, -.134]], .148, metal, 0,
    [[[-.567, -.03], [-.538, -.102], [-.479, -.147], [-.116, -.154], [-.051, -.134], [-.031, -.035]]], .025);
  trigger(-.366, -.069, .115, .163);
  panel(`mr14-short-ribbed-box-magazine`, [[.139, -.096], [.455, -.086], [.458, -.348], [.475, -.58], [.446, -.618], [.165, -.623], [.14, -.601], [.124, -.341]], .252, metal, 0, [], .023);
  sidePanels(`mr14-magazine-side-panel`, [[.162, -.128], [.428, -.119], [.433, -.347], [.45, -.575], [.424, -.59], [.189, -.591], [.164, -.341]], .012, paintInset, .132);
  [-1, 1].forEach(side => {
    for (const x of [.212, .291, .37]) {
      panel(`mr14-magazine-channel-${x}`, [[x - .02, -.174], [x + .018, -.174], [x + .03, -.546], [x - .008, -.546]], .013, recess, side * .144, [], .013);
      panel(`mr14-magazine-ridge-${x}`, [[x + .018, -.177], [x + .028, -.179], [x + .04, -.546], [x + .03, -.548]], .009, metal, side * .154, [], .003);
    }
    for (const y of [-.248, -.441]) box(metal, .303, y, side * .151, .236, .017, .011);
    box(recess, .303, -.151, side * .144, .203, .014, .008);
  });
  box(metal, .304, -.62, 0, .345, .029, .283);
  box(rubber, .304, -.641, 0, .359, .025, .289);
  tube(metal, 1.547, .32, 0, 2.643, .053);
  sleeve(metal, .703, .32, .137, .073);
  ring(.738, .32, .079, metal);
  const ventHoles: Point[][] = [];
  for (const y of [.211, .43]) {
    for (let index = 0; index < 6; index += 1) {
      const x = .938 + index * .224;
      ventHoles.push([[x - .079, y - .025], [x + .071, y - .025], [x + .082, y - .012], [x + .082, y + .019], [x + .071, y + .027], [x - .077, y + .027]]);
    }
  }
  for (let index = 0; index < 4; index += 1) {
    const x = 1.04 + index * .314;
    ventHoles.push([[x - .107, .286], [x + .096, .286], [x + .108, .299], [x + .108, .341], [x + .093, .353], [x - .1, .353], [x - .112, .34], [x - .112, .299]]);
  }
  panel(`mr14-long-vented-handguard`, [[.618, .501], [.715, .53], [2.281, .524], [2.345, .452], [2.347, .146], [2.28, .092], [.731, .071], [.62, .119]], .387, paint, 0, ventHoles, .018);
  sidePanels(`mr14-handguard-lower-facet`, [[.735, .088], [2.262, .109], [2.28, .14], [.749, .131]], .017, paintInset, .2);
  sidePanels(`mr14-handguard-upper-facet`, [[.741, .491], [2.263, .488], [2.297, .461], [.742, .464]], .012, metal, .198);
  for (let index = 0; index < 6; index += 1) {
    const x = .938 + index * .224;
    [-1, 1].forEach(side => {
      box(paintInset, x, .176, side * .203, .154, .011, .008);
      box(paintInset, x, .462, side * .203, .147, .008, .008);
    });
  }
  for (const x of [.674, 2.298]) [-1, 1].forEach(side => {
    cylinder(metal, x, .328, side * .207, .031, .024, `z`);
    cylinder(recess, x, .328, side * .224, .02, .009, `z`);
    box(trim, x, .328, side * .231, .023, .005, .005, -.2);
  });
  [-1, 1].forEach(side => {
    panel(`mr14-forward-sling-socket`, [[2.149, .13], [2.168, .116], [2.192, .123], [2.211, .141], [2.207, .167], [2.187, .182], [2.163, .175], [2.147, .155]], .025, metal, side * .214,
      [[[2.167, .138], [2.177, .129], [2.192, .137], [2.198, .149], [2.189, .164], [2.175, .166], [2.162, .153]]], .009);
    cylinder(recess, 2.181, .148, side * .203, .015, .014, `z`);
  });
  tube(metal, 1.493, .423, 0, 1.676, .012);
  sleeve(metal, 2.36, .32, .087, .066);
  ring(2.395, .32, .064, paintInset);
  for (let index = 0; index < 5; index += 1) ring(2.426 + index * .039, .32, .054, metal);
  sleeve(metal, 2.829, .32, .144, .063);
  ring(2.901, .32, .059, metal);
  ring(2.762, .32, .063, trim);
  for (let index = 0; index < 4; index += 1) [-1, 1].forEach(side => box(recess, 2.826, .292 + index * .018, side * .063, .091, .007, .006));
  rail(-.112, .52, 1.702, .255);
  rail(1.476, .518, 1.7, .262);
  box(metal, .699, .525, 0, .1, .049, .255);
  box(metal, 1.25, .063, 0, .399, .026, .219);
  for (const x of [1.095, 1.173, 1.25, 1.327, 1.405]) box(metal, x, .034, 0, .044, .034, .25);
  [-1, 1].forEach(side => {
    box(metal, 1.105, .303, side * .222, .377, .074, .052);
    for (let index = 0; index < 5; index += 1) box(metal, .966 + index * .069, .302, side * .257, .04, .095, .024);
    cylinder(recess, .935, .303, side * .276, .014, .009, `z`);
    cylinder(recess, 1.276, .303, side * .276, .014, .009, `z`);
  });
  assembleMarksmanSights(assembly);
  rivets([[-.881, .095], [-.589, .298], [-.05, .154], [.512, .126]], .406);
  rivets([[.729, .126], [.729, .488], [2.237, .161], [2.237, .482]], .402);
};
