// ─── Enum values (must match DB enums exactly) ───────────────────────────────

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
  | "painter"
  | "carpenter"
  | "plumber"
  | "electrician"
  | "ac_installer"
  | "tiler"
  | "bricklayer"
  | "roof_installer"
  | "furniture_repair"
  | "industrial_cleaner"
  | "landscape_expert"
  | "fumigator"
  | "general_labourer";

// ─── Display label → enum value maps ─────────────────────────────────────────

export const PROFESSIONAL_LABEL_TO_ENUM: Record<string, ProfessionSpecialtyEnum> = {
  Architect: "architect",
  "Project Manager": "project_manager",
  Builder: "builder",
  "Interior Designer": "interior_designer",
  "Electrical Engineer": "electrical_engineer",
  "Structural Engineer": "structural_engineer",
  "Mechanical Engineer": "mechanical_engineer",
  "Quantity Surveyor": "quantity_surveyor",
};

export const HANDYMAN_LABEL_TO_ENUM: Record<string, HandymanSpecialtyEnum> = {
  "Wall Painter": "painter",
  Plumber: "plumber",
  Carpenter: "carpenter",
  Electrician: "electrician",
  "AC Installer": "ac_installer",
  Tiler: "tiler",
  Bricklayer: "bricklayer",
  "Roof Installer": "roof_installer",
  "Furniture Repairs and Maintenance": "furniture_repair",
  "Industrial Cleaner": "industrial_cleaner",
  "Landscape Expert": "landscape_expert",
  Fumigator: "fumigator",
  "General Laborer": "general_labourer",
};

// ─── Enum value → display label (reverse maps for reading back from DB) ───────

export const PROFESSIONAL_ENUM_TO_LABEL: Record<ProfessionSpecialtyEnum, string> = Object.fromEntries(
  Object.entries(PROFESSIONAL_LABEL_TO_ENUM).map(([label, val]) => [val, label]),
) as Record<ProfessionSpecialtyEnum, string>;

export const HANDYMAN_ENUM_TO_LABEL: Record<HandymanSpecialtyEnum, string> = Object.fromEntries(
  Object.entries(HANDYMAN_LABEL_TO_ENUM).map(([label, val]) => [val, label]),
) as Record<HandymanSpecialtyEnum, string>;

// ─── Display label arrays (used by dropdowns) ─────────────────────────────────

export const PROFESSIONAL_PROFESSIONS = Object.keys(PROFESSIONAL_LABEL_TO_ENUM) as string[];

// Note: "Welder" removed — it has no matching enum value in the unified DB.
// Add it back by running:  ALTER TYPE handyman_specialty_enum ADD VALUE 'welder';
export const HANDYMAN_PROFESSIONS = Object.keys(HANDYMAN_LABEL_TO_ENUM) as string[];

// Legacy flat list for components that don't split by account type
export const PROFESSIONS = [...PROFESSIONAL_PROFESSIONS, ...HANDYMAN_PROFESSIONS];

// ─── Helpers ──────────────────────────────────────────────────────────────────

/**
 * Convert a display label to its DB enum value.
 * Returns undefined if the label is not recognised.
 */
export function labelToEnum(
  label: string,
  accountType: "professional" | "handyman",
): ProfessionSpecialtyEnum | HandymanSpecialtyEnum | undefined {
  if (accountType === "professional") return PROFESSIONAL_LABEL_TO_ENUM[label];
  return HANDYMAN_LABEL_TO_ENUM[label];
}

/**
 * Convert a DB enum value back to its display label.
 * Returns the raw enum string if no label is found.
 */
export function enumToLabel(enumValue: string, accountType: "professional" | "handyman"): string {
  if (accountType === "professional") {
    return PROFESSIONAL_ENUM_TO_LABEL[enumValue as ProfessionSpecialtyEnum] ?? enumValue;
  }
  return HANDYMAN_ENUM_TO_LABEL[enumValue as HandymanSpecialtyEnum] ?? enumValue;
}
