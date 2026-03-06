// ─── Types ──────────────────────────────────────────────────────────────────
interface Movie {
    id: string;
    title: string;
    description: string;
    durationMinutes: number;
    language: string;
    logoUrl: string | null;
    releaseDate: [number, number, number]; // [year, month, day]
}

interface ApiResponse {
    status: number;
    message: string;
    data: Movie[];
    success: boolean;
}
export type { Movie, ApiResponse }