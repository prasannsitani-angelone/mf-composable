export enum switchScreen {
	moreOptions,
	cueCard,
	switchLanding,
	switchSearch,
	showFolioSelection,
	selectedSwitchInFund,
	switchConfirmation,
	switchAuthorizaton
}

export const NomineeUpdateLinks = {
	CAMS: 'https://digital.camsonline.com/changeofnomination',
	KARVY: 'https://mfs.kfintech.com/investor/General/NCTNomineeUpdation'
};

const SWITCH_OPTIONS = {
	SWITCH: {
		logo: SwitchIcon,
		disabledLogo: SwitchIconDisabled,
		name: 'Switch Funds',
		buttonIcon: RightArrowBlueIcon,
		description:
			'Transfer your investment (partial or full) to another mutual fund from the same AMC',
		enabled: (flags) => {
			return flags[0];
		}
	}
	// STP: {
	//   logo: StpIcon,
	//   name: 'STP',
	//   description: 'Transfer funds from this fund systematically  to another fund',
	//   buttonIcon: ComingSoonIcon,
	//   enabled: (flags) => {
	//     return flags[1]
	//   }
	// },
	// SWP: {
	//   logo: SwpIcon,
	//   name: 'SWP',
	//   description: 'Withdraw your investments in installments',
	//   buttonIcon: ComingSoonIcon,
	//   enabled: (flags) => {
	//     return flags[2]
	//   }
	// }
};

export default SWITCH_OPTIONS;
