import md from "mobile-detect";

(window as any).mobileDetect = new md(window.navigator.userAgent);

export const INITIAL_STATE = {
    mobile: (<any>window).mobileDetect.mobile() ? false : true,
    loggedIn: false,
    jwtExpires: 0
};

export const reducer = (state = INITIAL_STATE, action: any) => {
    switch (action.type) {
        default:
            return state;
    }
};
