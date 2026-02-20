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

export const HANDYMAN_PROFESSIONS = [
  "Wall Painter",
  "Plumber",
  "Carpenter",
  "Electrician",
  "AC Installer",
  "Tiler",
  "Welder",
  "Bricklayer",
  "Roof Installer",
  "Furniture Repairs and Maintenance",
  "Industrial Cleaner",
  "Landscape Expert",
  "Fumigator",
  "General Laborer",
] as const;

// Legacy export for backward compatibility
export const PROFESSIONS = [
  ...PROFESSIONAL_PROFESSIONS,
  ...HANDYMAN_PROFESSIONS,
] as const;
