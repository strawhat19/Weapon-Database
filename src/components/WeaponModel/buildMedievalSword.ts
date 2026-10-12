import type { ModelAssembly } from './modelAssembly';
import type { CustomizationId } from '../../types/types';
import { Vector2, Vector3, TubeGeometry, BufferGeometry, LatheGeometry, CatmullRomCurve3, Float32BufferAttribute } from 'three';

export type MedievalSwordModelId = `greatsword` | `falchion`;
type Point = readonly [number, number, number];
type Station = readonly [x: number, top: number, bottom: number, thickness: number];
const blades: Record<MedievalSwordModelId, readonly Station[]> = {
  greatsword: [[-.85, .21, -.21, .14], [-.61, .21, -.21, .14], [-.47, .198, -.198, .13], [1.69, .149, -.149, .106], [2.58, .11, -.11, .077], [3.16, .001, -.001, .003]],
  falchion: [[-.79, .165, -.175, .128], [-.48, .18, -.213, .126], [.28, .23, -.31, .113], [1.18, .29, -.354, .101], [1.91, .346, -.286, .088], [2.22, .44, -.092, .062], [2.5, .41, .25, .04], [2.68, .36, .359, .003]],
};
const smoothStations = (model: MedievalSwordModelId): readonly Station[] => {
  const source = blades[model], result: Station[] = [];
  const slopes = [1, 2, 3].map(column => source.map((station, index) => {
    if (!index) return (source[1][column] - station[column]) / (source[1][0] - station[0]);
    if (index === source.length - 1) return (station[column] - source[index - 1][column]) / (station[0] - source[index - 1][0]);
    const before = station[0] - source[index - 1][0], after = source[index + 1][0] - station[0];
    const incoming = (station[column] - source[index - 1][column]) / before, outgoing = (source[index + 1][column] - station[column]) / after;
    if (incoming * outgoing <= 0) return 0;
    const left = 2 * after + before, right = after + 2 * before;
    return (left + right) / (left / incoming + right / outgoing);
  }));
  for (let section = 0; section < source.length - 1; section += 1) {
    const start = source[section], end = source[section + 1], span = end[0] - start[0], count = Math.ceil(span / .09);
    for (let step = 0; step < count; step += 1) {
      const t = step / count, square = t * t, cube = square * t;
      const value = (column: number) => model === `greatsword` ? start[column] + (end[column] - start[column]) * t
        : (2 * cube - 3 * square + 1) * start[column] + (cube - 2 * square + t) * span * slopes[column - 1][section]
          + (-2 * cube + 3 * square) * end[column] + (cube - square) * span * slopes[column - 1][section + 1];
      result.push([start[0] + span * t, value(1), Math.min(value(2), value(1) - .001), Math.max(.003, value(3))]);
    }
  }
  result.push(source[source.length - 1]);
  return result;
};
const profiles: Record<MedievalSwordModelId, readonly Station[]> = { greatsword: smoothStations(`greatsword`), falchion: smoothStations(`falchion`) };
const layouts = {
  greatsword: { guardX: -.95, pommelX: -2.59, gripY: 0, gripX: -1.725, gripLength: 1.27, radius: .112, turns: 15, sheathY: -1.03, sheathZ: .27 },
  falchion: { guardX: -.91, pommelX: -1.83, gripY: -.015, gripX: -1.34, gripLength: .68, radius: .107, turns: 9, sheathY: -.86, sheathZ: .27 },
};
const createFacetedGeometry = (sections: readonly (readonly Point[])[], cavity?: readonly (readonly Point[])[]) => {
  const positions: number[] = [], normals: number[] = [], coordinates: number[] = [];
  const span = sections[sections.length - 1][0][0] - sections[0][0][0] || 1;
  const triangle = (a: Point, b: Point, c: Point, reversed = false, vertexNormals?: readonly Vector3[]) => {
    const points = reversed ? [c, b, a] : [a, b, c];
    const surface = reversed ? vertexNormals?.slice().reverse() : vertexNormals;
    const face = new Vector3(...points[1]).sub(new Vector3(...points[0])).cross(new Vector3(...points[2]).sub(new Vector3(...points[0]))).normalize();
    points.forEach(([x, y, z], vertex) => {
      const normal = surface?.[vertex] ?? face;
      positions.push(x, y, z); normals.push(normal.x, normal.y, normal.z); coordinates.push((x - sections[0][0][0]) / span, y + .5);
    });
  };
  const sides = (rings: readonly (readonly Point[])[], reversed = false) => {
    const rails = rings.map(ring => ring.map(() => [new Vector3(), new Vector3()]));
    for (let station = 0; station < rings.length - 1; station += 1) {
      const current = rings[station], next = rings[station + 1];
      for (let edge = 0; edge < current.length; edge += 1) {
        const following = (edge + 1) % current.length, a = new Vector3(...current[edge]), b = new Vector3(...current[following]);
        const c = new Vector3(...next[following]), d = new Vector3(...next[edge]);
        const first = b.clone().sub(a).cross(c.clone().sub(a)), second = c.clone().sub(a).cross(d.clone().sub(a));
        if (reversed) { first.negate(); second.negate(); }
        rails[station][edge][0].add(first).add(second); rails[station][edge][1].add(first);
        rails[station + 1][edge][0].add(second); rails[station + 1][edge][1].add(first).add(second);
      }
    }
    rails.forEach(station => station.forEach(edge => edge.forEach(normal => normal.normalize())));
    for (let station = 0; station < rings.length - 1; station += 1) {
      const current = rings[station], next = rings[station + 1];
      for (let edge = 0; edge < current.length; edge += 1) {
        const following = (edge + 1) % current.length;
        triangle(current[edge], current[following], next[following], reversed, [rails[station][edge][0], rails[station][edge][1], rails[station + 1][edge][1]]);
        triangle(current[edge], next[following], next[edge], reversed, [rails[station][edge][0], rails[station + 1][edge][1], rails[station + 1][edge][0]]);
      }
    }
  };
  const cap = (ring: readonly Point[], reversed: boolean) => {
    const coordinate = (axis: number) => ring.reduce((sum, point) => sum + point[axis], 0) / ring.length;
    const center: Point = [coordinate(0), coordinate(1), coordinate(2)];
    ring.forEach((point, index) => triangle(center, point, ring[(index + 1) % ring.length], reversed));
  };
  const rim = (outer: readonly Point[], inner: readonly Point[], reversed = false) => {
    outer.forEach((point, edge) => {
      const following = (edge + 1) % outer.length;
      triangle(point, inner[edge], inner[following], reversed);
      triangle(point, inner[following], outer[following], reversed);
    });
  };
  sides(sections);
  const last = sections[sections.length - 1];
  if (cavity) {
    sides(cavity, true);
    rim(sections[0], cavity[0]);
    const insideEnd = cavity[cavity.length - 1];
    if (Math.abs(last[0][0] - insideEnd[0][0]) > .0001) { cap(last, false); cap(insideEnd, true); }
    else rim(last, insideEnd, true);
  } else { cap(sections[0], true); cap(last, false); }
  const geometry = new BufferGeometry();
  geometry.setAttribute(`position`, new Float32BufferAttribute(positions, 3));
  geometry.setAttribute(`normal`, new Float32BufferAttribute(normals, 3));
  geometry.setAttribute(`uv`, new Float32BufferAttribute(coordinates, 2));
  return geometry;
};
const bladeSections = (model: MedievalSwordModelId) => profiles[model].map(([x, top, bottom, thickness]) => {
  const height = top - bottom, center = (top + bottom) * .5;
  const face: readonly (readonly [number, number])[] = model === `greatsword`
    ? [[top, .0015], [center + height * .19, thickness * .5], [center + height * .065, thickness * .31], [center - height * .065, thickness * .31], [center - height * .19, thickness * .5], [bottom, .0015]]
    : [[top, thickness * .31], [top - height * .075, thickness * .5], [top - height * .16, thickness * .4], [top - height * .23, thickness * .4], [top - height * .285, thickness * .5], [bottom + height * .3, thickness * .36], [bottom, .0015]];
  return [...face.map(([y, z]) => [x, y, z] as Point), ...[...face].reverse().map(([y, z]) => [x, y, -z] as Point)];
});
const cordGeometry = (points: readonly Point[], radius: number, segments = 48, radialSegments = 6) => new TubeGeometry(new CatmullRomCurve3(points.map(point => new Vector3(...point))), segments, radius, radialSegments, false);
const forgedQuillonGeometry = (model: MedievalSwordModelId, points: readonly Point[]) => {
  const curve = new CatmullRomCurve3(points.map(point => new Vector3(...point))), segments = 64, radial = 14;
  const geometry = new TubeGeometry(curve, segments, 1, radial, false), positions = geometry.getAttribute(`position`);
  const vector = new Vector3(), center = new Vector3();
  for (let step = 0; step <= segments; step += 1) {
    const progress = step / segments, radius = model === `greatsword` ? .078 - progress * .03 : .065 - progress * .022;
    curve.getPointAt(progress, center);
    for (let edge = 0; edge <= radial; edge += 1) {
      const vertex = step * (radial + 1) + edge;
      vector.fromBufferAttribute(positions, vertex).sub(center).multiplyScalar(radius).add(center);
      positions.setXYZ(vertex, vector.x, vector.y, vector.z);
    }
  }
  geometry.computeVertexNormals();
  const normals = geometry.getAttribute(`normal`);
  for (let step = 0; step <= segments; step += 1) {
    const first = step * (radial + 1), last = first + radial;
    vector.fromBufferAttribute(normals, first).add(center.fromBufferAttribute(normals, last)).normalize();
    normals.setXYZ(first, vector.x, vector.y, vector.z); normals.setXYZ(last, vector.x, vector.y, vector.z);
  }
  return geometry;
};
const profileAt = (model: MedievalSwordModelId, x: number): Station => {
  const stations = profiles[model], upper = stations.findIndex(station => station[0] >= x);
  if (upper <= 0) {
    const [, top, bottom, thickness] = stations[upper === 0 ? 0 : stations.length - 1];
    return [x, top, bottom, thickness];
  }
  const previous = stations[upper - 1], next = stations[upper], fraction = (x - previous[0]) / (next[0] - previous[0]);
  return [x, previous[1] + (next[1] - previous[1]) * fraction, previous[2] + (next[2] - previous[2]) * fraction, previous[3] + (next[3] - previous[3]) * fraction];
};
const ovalSections = (stations: readonly Station[], depth: number, offsetY = 0, inset = 0) => stations.map(([x, top, bottom]) => {
  const center = (top + bottom) * .5 + offsetY, radiusY = Math.max(.004, (top - bottom) * .5 + .044 - inset), radiusZ = Math.max(.004, depth - inset);
  return Array.from({ length: 16 }, (_, edge): Point => {
    const angle = edge * Math.PI / 8;
    return [x, center + Math.cos(angle) * radiusY, Math.sin(angle) * radiusZ];
  });
});
const quillons = (model: MedievalSwordModelId): readonly (readonly Point[])[] => model === `greatsword`
  ? [[[-.95, 0, 0], [-.91, .27, 0], [-.79, .51, .008], [-.61, .66, .015], [-.58, .73, .015]], [[-.95, 0, 0], [-.91, -.27, 0], [-.79, -.51, -.008], [-.61, -.66, -.015], [-.58, -.73, -.015]]]
  : [[[-.91, 0, 0], [-.95, .18, 0], [-1.06, .3, .015], [-1.2, .335, .02]], [[-.91, 0, 0], [-.86, -.17, 0], [-.71, -.31, .01], [-.63, -.385, .015]]];
const falchionLoop: readonly Point[] = [[-.91, -.12, .08], [-1.13, -.245, .18], [-1.33, -.08, .24], [-1.21, .08, .19], [-.97, .11, .075]];

export const assembleMedievalSword = (model: MedievalSwordModelId, assembly: ModelAssembly) => {
  const { metal, trim, rubber, paintInset, anodized, recess } = assembly;
  const { guardX, pommelX, gripX, gripY, gripLength, radius, turns } = layouts[model];
  assembly.custom(`${model}-forged-fullered-blade`, () => createFacetedGeometry(bladeSections(model)), metal);
  assembly.custom(`${model}-oval-leather-grip`, () => new LatheGeometry([[0, -gripLength * .5], [radius * .82, -gripLength * .5], [radius, -gripLength * .34], [radius * 1.055, 0], [radius * .92, gripLength * .37], [radius * .85, gripLength * .5], [0, gripLength * .5]].map(([width, x]) => new Vector2(width, x)), 24).rotateZ(-Math.PI / 2).scale(1, 1, .84), rubber, gripX, gripY);
  const wrap = Array.from({ length: turns * 24 + 1 }, (_, index) => {
    const fraction = index / (turns * 24), angle = fraction * turns * Math.PI * 2, width = model === `greatsword` ? .07 : .064;
    const core = fraction < .16 ? .82 + fraction / .16 * .18 : fraction < .5 ? 1 + (fraction - .16) / .34 * .055 : fraction < .87 ? 1.055 - (fraction - .5) / .37 * .135 : .92 - (fraction - .87) / .13 * .07;
    const crossSection = [[-.5, 0], [-.45, -.004], [.45, -.004], [.5, 0], [.45, .004], [-.45, .004]];
    return crossSection.map(([across, height]): Point => {
      const reach = radius * core + .006 + height;
      return [gripX - gripLength * .5 + fraction * gripLength + across * width, gripY + Math.cos(angle) * reach, Math.sin(angle) * reach * .84];
    });
  });
  assembly.custom(`${model}-flat-leather-strip-wrap`, () => createFacetedGeometry(wrap), paintInset);
  for (const end of [-1, 1]) {
    const x = gripX + end * (gripLength * .5 + .026);
    assembly.cylinder(metal, x, gripY, 0, radius * 1.18, .08, `x`);
    assembly.ring(trim, x + end * .027, gripY, 0, radius * 1.18, `x`);
    assembly.ring(recess, x - end * .019, gripY, 0, radius * 1.19, `x`);
  }
  quillons(model).forEach((points, quillon) => {
    assembly.custom(`${model}-forged-quillon-${quillon}`, () => forgedQuillonGeometry(model, points), metal);
    const tip = points[points.length - 1];
    assembly.ellipsoid(trim, tip[0], tip[1], tip[2], .05, .055, .049);
  });
  assembly.ellipsoid(metal, guardX, 0, 0, .115, .163, .145);
  assembly.cylinder(trim, guardX + .08, 0, 0, model === `greatsword` ? .185 : .16, .075, `x`);
  if (model === `greatsword`) assembly.ellipsoid(metal, pommelX, 0, 0, .232, .25, .121);
  else {
    assembly.panel(`falchion-pear-pommel`, [[-1.657, .043], [-1.731, .165], [-1.859, .211], [-1.985, .132], [-2.033, -.036], [-1.954, -.174], [-1.814, -.208], [-1.711, -.1]], .205, metal);
    assembly.custom(`falchion-protective-side-ring`, () => cordGeometry(falchionLoop, .028, 64, 14), metal);
  }
  for (const side of [-1, 1]) {
    const pommelZ = side * (model === `greatsword` ? .121 : .112);
    assembly.cylinder(trim, pommelX, gripY, pommelZ, model === `greatsword` ? .159 : .12, .025, `z`);
    assembly.cylinder(anodized, pommelX, gripY, pommelZ + side * .017, .089, .015, `z`);
    assembly.box(trim, pommelX, gripY, pommelZ + side * .027, .095, .016, .009, .785);
    assembly.box(trim, pommelX, gripY, pommelZ + side * .027, .095, .016, .009, -.785);
    assembly.cylinder(trim, guardX, 0, side * .153, .058, .018, `z`);
    assembly.box(recess, guardX, 0, side * .167, .033, .01, .005);
    for (let index = 0; index < 3; index += 1) {
      const x = -.614 + index * .033, markY = model === `greatsword` ? 0 : .099;
      const markZ = profileAt(model, x)[3] * (model === `greatsword` ? .31 : .4) + .0005;
      assembly.box(anodized, x, markY, side * markZ, .012, .017 + index * .002, .0025, -.3);
    }
  }
  assembly.ring(metal, pommelX, model === `greatsword` ? -.255 : -.217, 0, .035, `z`);
};

export const assembleMedievalSwordDecoration = (model: MedievalSwordModelId, option: CustomizationId, assembly: ModelAssembly) => {
  const { metal, trim, rubber, paint, paintInset, anodized } = assembly;
  const { guardX, pommelX, sheathY, sheathZ } = layouts[model];
  if (option === `scabbard`) {
    const stations = profiles[model], depth = model === `greatsword` ? .125 : .117;
    const outer = ovalSections(stations, depth, sheathY), inner = ovalSections(stations.map((station, index): Station => index === stations.length - 1 ? [station[0] - .026, station[1], station[2], station[3]] : station), depth, sheathY, .025);
    assembly.custom(`${model}-hollow-fitted-scabbard`, () => createFacetedGeometry(outer, inner), paint, 0, 0, sheathZ);
    const fitting = (name: string, start: number, end: number) => {
      const segment = [profileAt(model, start), ...stations.filter(station => station[0] > start && station[0] < end), profileAt(model, end)];
      assembly.custom(`${model}-scabbard-${name}`, () => createFacetedGeometry(ovalSections(segment, depth + .009, sheathY), ovalSections(segment, depth + .002, sheathY, .002)), trim, 0, 0, sheathZ);
    };
    fitting(`throat`, stations[0][0] - .027, stations[0][0] + .155);
    fitting(`suspension-band`, model === `greatsword` ? .17 : -.05, model === `greatsword` ? .263 : .043);
    fitting(`contoured-chape`, model === `greatsword` ? 2.72 : 2.24, stations[stations.length - 1][0] + .025);
    for (const x of [stations[0][0] + .115, model === `greatsword` ? .215 : -.005]) {
      const top = profileAt(model, x)[1] + sheathY + .047;
      assembly.beam(metal, [x, top, sheathZ], [x, top + .075, sheathZ], .024);
      assembly.ring(metal, x, top + .115, sheathZ, .068, `z`);
      assembly.cylinder(anodized, x, top - .073, sheathZ + depth + .012, .022, .014, `z`);
    }
    const count = model === `greatsword` ? 24 : 22, stitchEnd = blades[model][blades[model].length - 2][0];
    for (let stitch = 0; stitch < count; stitch += 1) {
      const x = stations[0][0] + .22 + stitch * (stitchEnd - stations[0][0] - .33) / count;
      const [, top, bottom] = profileAt(model, x);
      for (const edge of [top - .025, bottom + .025]) {
        const ratio = (edge - (top + bottom) * .5) / ((top - bottom) * .5 + .044);
        const z = sheathZ + depth * Math.sqrt(Math.max(0, 1 - ratio * ratio)) + .003;
        assembly.beam(paintInset, [x - .018, edge + sheathY, z], [x + .018, edge + sheathY + .007, z], .006);
      }
    }
    return;
  }
  if (option === `tassel`) {
    const anchorY = model === `greatsword` ? -.255 : -.217, knotY = anchorY - .264;
    const loop: readonly Point[] = [[pommelX, anchorY, .009], [pommelX - .104, anchorY - .111, .044], [pommelX - .025, knotY + .025, .077], [pommelX + .064, anchorY - .128, .042], [pommelX, anchorY, .009]];
    assembly.custom(`${model}-knotted-pommel-cord`, () => cordGeometry(loop, .017), rubber);
    assembly.ellipsoid(paintInset, pommelX - .025, knotY, .077, .065, .078, .058);
    assembly.ring(trim, pommelX - .025, knotY + .023, .077, .058, `y`);
    for (let strand = 0; strand < 9; strand += 1) {
      const spread = (strand - 4) * .026, z = .077 + (strand % 3 - 1) * .022;
      const points: readonly Point[] = [[pommelX - .025 + spread * .3, knotY - .058, z], [pommelX - .07 + spread, knotY - .255, z + .031], [pommelX + spread + .015, knotY - .489 - Math.abs(spread) * .28, z]];
      assembly.custom(`${model}-tassel-strand-${strand}`, () => cordGeometry(points, strand % 3 === 0 ? .011 : .014, 24), strand % 3 === 0 ? trim : strand % 2 ? paint : paintInset);
      assembly.ellipsoid(trim, points[2][0], points[2][1], points[2][2], .015, .025, .015);
    }
    return;
  }
  if (option !== `ornate-guard`) return;
  quillons(model).forEach((points, quillon) => {
    for (const side of [-1, 1]) {
      const inlay = points.map(([x, y, z]): Point => [x + .014, y, z + side * .052]);
      assembly.custom(`${model}-guard-quillon-inlay-${quillon}-${side}`, () => cordGeometry(inlay, .019, 40), trim);
      const tip = points[points.length - 1], direction = quillon === 0 ? 1 : -1;
      const scroll: readonly Point[] = [[tip[0] - .014, tip[1] - direction * .055, tip[2] + side * .023], [tip[0] + .065, tip[1] + direction * .055, tip[2] + side * .05], [tip[0] + .145, tip[1] + direction * .015, tip[2] + side * .059], [tip[0] + .124, tip[1] - direction * .065, tip[2] + side * .056], [tip[0] + .067, tip[1] - direction * .064, tip[2] + side * .05]];
      assembly.custom(`${model}-guard-scroll-${quillon}-${side}`, () => cordGeometry(scroll, .024, 32), trim);
      assembly.ellipsoid(anodized, scroll[4][0], scroll[4][1], scroll[4][2], .023, .027, .02);
    }
  });
  for (const side of [-1, 1]) {
    assembly.panel(`${model}-guard-crest-${side}`, [[guardX - .089, -.095], [guardX - .111, .03], [guardX - .05, .103], [guardX + .052, .103], [guardX + .106, .021], [guardX + .077, -.098], [guardX, -.15]], .017, trim, side * .159);
    assembly.cylinder(anodized, guardX, -.012, side * .174, .062, .014, `z`);
    assembly.box(trim, guardX, -.012, side * .188, .058, .01, .007, .65);
    assembly.box(trim, guardX, -.012, side * .188, .058, .01, .007, -.65);
  }
  if (model === `falchion`) assembly.custom(`falchion-ring-engraved-trace`, () => cordGeometry(falchionLoop.map(([x, y, z]): Point => [x, y, z + .019]), .011), trim);
};
