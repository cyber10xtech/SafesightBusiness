// ── Professional Professions ──────────────────────────────────────────────────
export const PROFESSIONAL_PROFESSIONS = [
  "Architect",
  "Project Manager",
  "Builder",
  "Interior Designer",
  "Electrical Engineer",
  "Structural Engineer",
  "Mechanical Engineer",
  "Quantity Surveyor",
] as const;

// ── Handyman Professions ─────────────────────────────────────────────────────
export const HANDYMAN_PROFESSIONS = [
  "Wall painter",
  "Plumber",
  "Carpenter",
  "Electrician",
  "AC installer",
  "Tiler",
  "Welder",
  "Bricklayer",
  "Roof installer",
  "Furniture repairs and maintenance",
  "Industrial cleaner",
  "Landscape expert",
  "Fumigator",
  "General laborer",
] as const;

// ── Enum types (matching DB enum values) ─────────────────────────────────────
export type ProfessionSpecialtyEnum =
  | "architect"
  | "project_manager"
  | "builder"
  | "interior_designer"
  | "electrical_engineer"
  | "structural_engineer"
  | "mechanical_engineer"
  | "quantity_surveyor";

export type HandymanSpecialtyEnum =
  | "wall_painter"
  | "plumber"
  | "carpenter"
  | "electrician"
  | "ac_installer"
  | "tiler"
  | "welder"
  | "bricklayer"
  | "roof_installer"
  | "furniture_repairs_and_maintenance"
  | "industrial_cleaner"
  | "landscape_expert"
  | "fumigator"
  | "general_laborer";

// ── Label ↔ Enum mapping ─────────────────────────────────────────────────────
const labelToEnumMap: Record<string, string> = {
  // Professional
  "Architect": "architect",
  "Project Manager": "project_manager",
  "Builder": "builder",
  "Interior Designer": "interior_designer",
  "Electrical Engineer": "electrical_engineer",
  "Structural Engineer": "structural_engineer",
  "Mechanical Engineer": "mechanical_engineer",
  "Quantity Surveyor": "quantity_surveyor",
  // Handyman
  "Wall painter": "wall_painter",
  "Plumber": "plumber",
  "Carpenter": "carpenter",
  "Electrician": "electrician",
  "AC installer": "ac_installer",
  "Tiler": "tiler",
  "Welder": "welder",
  "Bricklayer": "bricklayer",
  "Roof installer": "roof_installer",
  "Furniture repairs and maintenance": "furniture_repairs_and_maintenance",
  "Industrial cleaner": "industrial_cleaner",
  "Landscape expert": "landscape_expert",
  "Fumigator": "fumigator",
  "General laborer": "general_laborer",
};

const enumToLabelMap: Record<string, string> = Object.fromEntries(
  Object.entries(labelToEnumMap).map(([label, enumVal]) => [enumVal, label]),
);

/**
 * Convert a display label (e.g. "Wall painter") to the DB enum value (e.g. "wall_painter").
 * Returns undefined if no match is found.
 */
export function labelToEnum(
  label: string,
  _accountType?: string,
): ProfessionSpecialtyEnum | HandymanSpecialtyEnum | undefined {
  return labelToEnumMap[label] as ProfessionSpecialtyEnum | HandymanSpecialtyEnum | undefined;
}

/**
 * Convert a DB enum value (e.g. "wall_painter") back to a display label (e.g. "Wall painter").
 * Returns the raw value if no mapping exists.
 */
export function enumToLabel(enumVal: string, _accountType?: string): string {
  return enumToLabelMap[enumVal] ?? enumVal;
}

/** Combined list of all professions (for EditProfile backwards compat) */
export const PROFESSIONS = [...PROFESSIONAL_PROFESSIONS, ...HANDYMAN_PROFESSIONS] as const;
