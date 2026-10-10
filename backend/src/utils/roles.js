export const ROLES = {
  ADMIN: 'admin',
  EDITOR: 'editor',
  DOMAIN_EXPERT: 'domain_expert',
  CLINICIAN: 'clinician',
};

/** Frontend display labels → API roles (for future auth UI wiring). */
export const FRONTEND_ROLE_MAP = {
  admin: ROLES.ADMIN,
  doctor: ROLES.CLINICIAN,
  clinician: ROLES.CLINICIAN,
  'ayurvedic reviewer': ROLES.DOMAIN_EXPERT,
  reviewer: ROLES.DOMAIN_EXPERT,
  editor: ROLES.EDITOR,
};

export function canSeeDraftHerbs(role) {
  return (
    role === ROLES.ADMIN ||
    role === ROLES.EDITOR ||
    role === ROLES.DOMAIN_EXPERT
  );
}

export function clinicianVisibleStatuses() {
  return ['reviewed', 'verified'];
}
