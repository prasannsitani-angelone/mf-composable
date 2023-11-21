import CTInfoIcon1 from '$components/clevertap/icons/CTInfoIcon1.svelte';
import CTInfoIcon2 from '$components/clevertap/icons/CTInfoIcon2.svelte';
import type { SvelteComponent } from 'svelte';
import ImportExternalFunds from '$components/clevertap/icons/ImportExternalFunds.svelte';

interface CTNudgeType {
	type: string;
	bgColor: string;
	secondaryCtas: boolean;
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	icon: typeof SvelteComponent;
}

const ctNudgeTypeA: CTNudgeType = {
	type: 'a',
	bgColor: '#EBE4F7',
	secondaryCtas: false,
	icon: ImportExternalFunds
};

const ctNudgeCTInfoIcon1: CTNudgeType = {
	type: 'b',
	bgColor: '#FEEED4',
	secondaryCtas: true,
	icon: CTInfoIcon1
};

const ctNudgeTypeC: CTNudgeType = {
	type: 'c',
	bgColor: '#EBE4F7',
	secondaryCtas: true,
	icon: CTInfoIcon2
};

const ctNudgeTypeD: CTNudgeType = {
	type: 'd',
	bgColor: '#EBE4F7',
	secondaryCtas: false,
	icon: CTInfoIcon2
};

export const CLEVERTAP_NUDGE_TOPICS: Record<string, CTNudgeType> = {
	mf_trackext_invdash_type_a: ctNudgeTypeA,
	mf_invdash_bottomsticky_type_b: ctNudgeCTInfoIcon1,
	mf_invdash_bottomsticky_type_c: ctNudgeTypeC,
	mf_invdash_bottomsticky_type_d: ctNudgeTypeD,
	mf_invdash_inpage1_type_d: ctNudgeTypeD,
	mf_discover_inpage1_type_d: ctNudgeTypeD,
	mf_sips_bottomsticky_type_b: ctNudgeCTInfoIcon1,
	mf_sips_bottomsticky_type_c: ctNudgeTypeC,
	mf_sips_bottomsticky_type_d: ctNudgeTypeD,
	mf_sips_inpage1_type_d: ctNudgeTypeD
};
