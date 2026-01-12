export interface Member {
    name: string;
    role?: string;
    telegram?: string;
    location?: string;
    teamName?: string;
    unitName?: string;
}

export interface Team {
    id: string;
    name: string;
    members: Member[];
}

export interface Unit {
    id: string;
    name: string;
    supervisor?: Member; // Some units have a supervisor like "Hicham Mennour"
    teams: Team[]; // Can be flat list of teams or just one list of members conceptually
    type?: 'unit' | 'special';
}

export interface LocationSection {
    id: string;
    name: string;
    mapUrl?: string; // Google Maps embed URL
    units: Unit[];
}

export interface CompanyStructure {
    executives: Member[];
    locations: LocationSection[];
}

// Alias for convenience
export type Location = LocationSection;
