export interface CohortApiResponse {
	LF: Cohortplacement[];
	SF: Cohortplacement[];
}

export interface Cohortplacement {
	columnStart: number;
	componentName: string;
	rowStart: number;
}
