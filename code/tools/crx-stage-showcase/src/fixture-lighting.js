const FIXTURE_COUNT = 104;
const RING_COUNT = 4;
const FIXTURES_PER_RING = 26;
const HOUSE_CD = 650;
const BLUE = '#8ebdff';

function validateLightingData(data) {
  if (data?.houseLights?.length !== FIXTURE_COUNT) {
    throw new Error(`Fixture lighting requires ${FIXTURE_COUNT} houseLights; received ${data?.houseLights?.length ?? 0}.`);
  }
  if (data?.houseRings?.length !== RING_COUNT || data.houseRings.some(r => r.count !== FIXTURES_PER_RING)) {
    throw new Error(`Fixture lighting requires ${RING_COUNT} houseRings with ${FIXTURES_PER_RING} fixtures each.`);
  }
  if (data.houseLights.some(h => !Array.isArray(h.p) || h.p.length !== 3 || !h.p.every(Number.isFinite) || !['audience', 'backstage'].includes(h.zone))) {
    throw new Error('Fixture lighting data contains an invalid fixture position or zone.');
  }
  if (data.houseRings.some(r => !Array.isArray(r.center) || r.center.length !== 3 || !r.center.every(Number.isFinite) || !Array.isArray(r.size) || r.size.length !== 2 || !r.size.every(Number.isFinite))) {
    throw new Error('Fixture lighting data contains an invalid ring bound.');
  }
  for (let ringIndex = 0; ringIndex < RING_COUNT; ringIndex++) {
    const ring = data.houseRings[ringIndex];
    for (let i = ringIndex * FIXTURES_PER_RING; i < (ringIndex + 1) * FIXTURES_PER_RING; i++) {
      const fixture = data.houseLights[i];
      if (fixture.zone !== ring.zone || Math.abs(fixture.p[0] - ring.center[0]) > ring.size[0] / 2 + 0.01 || Math.abs(fixture.p[2] - ring.center[2]) > ring.size[1] / 2 + 0.01) {
        throw new Error(`Fixture ${i + 1} does not match house ring ${ringIndex + 1}'s bounds or zone.`);
      }
    }
  }
}

export function createFixtureLighting(THREE, data, scene) {
  validateLightingData(data);

  const hlUniforms = {
    hlPos: { value: data.houseLights.map(() => new THREE.Vector4()) },
    hlColor: { value: [new THREE.Color(BLUE).multiplyScalar(HOUSE_CD * 0.7 ** 2), new THREE.Color(BLUE).multiplyScalar(HOUSE_CD * 0.35 ** 2)] },
    hlDir: { value: new THREE.Vector3(0, -1, 0) },
    hlCone: { value: new THREE.Vector2(Math.cos(THREE.MathUtils.degToRad(55)), Math.cos(THREE.MathUtils.degToRad(22))) },
    hlRange: { value: 24 },
    hlRingC: { value: data.houseRings.map(() => new THREE.Vector3()) },
    hlRingHalf: { value: data.houseRings.map(r => new THREE.Vector2(r.size[0] / 2, r.size[1] / 2)) },
    hlAxisX: { value: new THREE.Vector3(1, 0, 0) },
    hlAxisZ: { value: new THREE.Vector3(0, 0, 1) },
    hlTanOuter: { value: Math.tan(THREE.MathUtils.degToRad(55)) },
  };
  const ringWorld = data.houseRings.map(r => new THREE.Vector3(...r.center));
  const lightWorld = data.houseLights.map(h => new THREE.Vector3(...h.p));
  const zones = data.houseLights.map(h => h.zone === 'audience' ? 0 : 1);
  const direction = new THREE.Vector3(0, -1, 0);
  const axisX = new THREE.Vector3(1, 0, 0);
  const axisZ = new THREE.Vector3(0, 0, 1);
  const positionView = new THREE.Vector3();
  const lensGeometry = new THREE.CircleGeometry(0.16, 20).rotateX(Math.PI / 2);
  const lensMaterial = new THREE.MeshBasicMaterial({ color: 0xffffff, toneMapped: false });
  const lenses = new THREE.InstancedMesh(lensGeometry, lensMaterial, FIXTURE_COUNT);
  lenses.name = 'house-light-lenses';
  const matrix = new THREE.Matrix4();
  const lensBlue = new THREE.Color(BLUE);
  data.houseLights.forEach((h, i) => {
    matrix.makeTranslation(h.p[0], h.p[1] - 0.01, h.p[2]);
    lenses.setMatrixAt(i, matrix);
    const level = h.zone === 'audience' ? 0.7 : 0.35;
    lenses.setColorAt(i, lensBlue.clone().multiplyScalar(0.1 + 0.9 * level));
  });
  lenses.instanceMatrix.needsUpdate = true;
  if (lenses.instanceColor) lenses.instanceColor.needsUpdate = true;
  scene.add(lenses);

  const shaderPreamble = `
#define HL_COUNT ${FIXTURE_COUNT}
uniform vec4 hlPos[HL_COUNT];
uniform vec3 hlColor[2];
uniform vec3 hlDir;
uniform vec2 hlCone;
uniform float hlRange;
uniform vec3 hlRingC[4];
uniform vec2 hlRingHalf[4];
uniform vec3 hlAxisX;
uniform vec3 hlAxisZ;
uniform float hlTanOuter;`;
  const shaderLighting = `
// Measured house fixtures: 4 rings of 26, culled by their beam bounds first.
{
  IncidentLight hl;
  float r2 = hlRange * hlRange;
  for (int ring = 0; ring < 4; ring++) {
    vec3 rel = geometryPosition - hlRingC[ring];
    float drop = dot(rel, hlDir);
    vec2 outside = max(vec2(abs(dot(rel, hlAxisX)), abs(dot(rel, hlAxisZ))) - hlRingHalf[ring], 0.0);
    if (drop <= 0.0 || length(outside) > drop * hlTanOuter + 0.01) continue;
    for (int k = 0; k < 26; k++) {
      int i = ring * 26 + k;
      vec3 lv = hlPos[i].xyz - geometryPosition;
      float d2 = dot(lv, lv);
      if (d2 > r2) continue;
      float d = sqrt(d2);
      hl.direction = lv / d;
      float spot = smoothstep(hlCone.x, hlCone.y, dot(-hl.direction, hlDir));
      if (spot <= 0.0) continue;
      hl.color = hlColor[int(hlPos[i].w + 0.5)] * spot * getDistanceAttenuation(d, hlRange, 2.0);
      hl.visible = true;
      RE_Direct(hl, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight);
    }
  }
}`;

  function apply(material) {
    material.onBeforeCompile = shader => {
      Object.assign(shader.uniforms, hlUniforms);
      const common = '#include <common>';
      const lighting = '#include <lights_fragment_begin>';
      if (!shader.fragmentShader.includes(common) || !shader.fragmentShader.includes(lighting)) {
        throw new Error('Three.js shader is missing the fixture-lighting insertion points.');
      }
      shader.fragmentShader = shader.fragmentShader
        .replace(common, `${common}${shaderPreamble}`)
        .replace(lighting, `${lighting}${shaderLighting}`);
    };
    material.customProgramCacheKey = () => 'measured-house-fixtures-blue-v1';
    return material;
  }

  function update(camera) {
    camera.updateMatrixWorld();
    const view = camera.matrixWorldInverse;
    hlUniforms.hlPos.value.forEach((p, i) => {
      positionView.copy(lightWorld[i]).applyMatrix4(view);
      p.set(positionView.x, positionView.y, positionView.z, zones[i]);
    });
    hlUniforms.hlDir.value.copy(direction).transformDirection(view);
    hlUniforms.hlRingC.value.forEach((p, i) => p.copy(ringWorld[i]).applyMatrix4(view));
    hlUniforms.hlAxisX.value.copy(axisX).transformDirection(view);
    hlUniforms.hlAxisZ.value.copy(axisZ).transformDirection(view);
  }

  return { apply, update };
}
