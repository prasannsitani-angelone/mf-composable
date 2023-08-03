import { writable } from 'svelte/store';

interface IBanner {
    initialised: boolean,
    alertSleeveVisible: boolean,
    notificationTitle: string,
    notificationBody: string,
    knowMore: string
}

const initalStore: IBanner = {
    initialised: false,
    alertSleeveVisible: false,
    notificationTitle: '',
    notificationBody: '',
    knowMore: ''
};

function CreateStore() {
    const { subscribe, update } = writable(initalStore);
    let state = initalStore;
    subscribe((v) => {
        state = {
            ...v
        }
    });
    return {
        subscribe,
        storeAlertSleeveData: (data = {}) =>
            update((v) => {
                if (!state.initialised && Object.keys(data).length > 0) {
                    return {
                        ...v,
                        ...data, 
                        alertSleeveVisible: true,
                        initialised: true
                    };
                } 
                return v;
            }),
        hideLogoutConfirmationPopup: () =>
            update((v) => {
                return { ...v, alertSleeveVisible: false };
            }),
    };
}

export const bannerStore = CreateStore();
