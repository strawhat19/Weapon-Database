const fs = require('node:fs');
const files = ['src/types/types.ts', 'src/types/styles.d.ts', 'src/shared/catalog/equipment.ts', 'src/shared/models/Loadout.ts', 'src/api/armory.ts', 'src/shared/armoryContext/ArmoryContext.tsx', 'src/components/WeaponModel/buildGunMods.ts', 'src/components/WeaponModel/buildWeapon.ts', 'src/components/WeaponModel/buildGunEquipment.ts', 'src/components/WeaponModel/createWeaponViewer.ts', 'src/components/WeaponModel/useWeaponModel.ts', 'src/components/WeaponModel/index.tsx', 'src/components/GunsmithPanel/index.tsx', 'src/components/GunsmithPanel/PartIllustration.tsx', 'src/components/GunsmithPanel/PartInspector.tsx', 'src/components/LoadoutLab/useLoadoutLab.ts', 'src/components/LoadoutLab/index.tsx'];
for (const file of files) {
  let source = fs.readFileSync(file, 'utf8').replace(/\r\n/g, '\n');
  const lines = source.split('\n');
  const imports = [];
  while (lines[0]?.startsWith('import ')) imports.push(lines.shift());
  imports.sort((a, b) => a.length - b.length);
  source = [...imports, ...lines].join('\n');
  if (file === 'src/types/types.ts') source = source.replace(/(export type LoadoutDraft = EquipmentSelections & \{[\s\S]*?weaponId: string;)\n  optic: OpticId;\n  attachment: AttachmentId;\n  customization\?: CustomizationId;/, '$1');
  fs.writeFileSync(file, source.trimEnd().replace(/\n/g, '\r\n') + '\r\n');
}
