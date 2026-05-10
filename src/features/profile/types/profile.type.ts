export type Limit = {
    max: number;
    used: number;
};
export type Subscription = {
    plan: string;
    status: "active" | "expired" | "trial";

    expires_at: string | null;

    features: string[];

    limits: {
        units: Limit;
        users: Limit;
    };
};
export type Context = {
    property: {
        id: string;
        name: string;
    };

    access: {
        roles: string[];
        permissions: string[];
    };

    subscription: Subscription;
};


export type ProfileMeResponse = {
    user: {
        id: string;
        fullname: string | null;
        email: string;
        phone_number: string | null;
        avatar_url: string | null;
        is_active: boolean;
        email_verified: boolean;
        created_at: string;
        updated_at: string;
        last_login_at: string | null;
        is_two_factor_auth: boolean;
    };

    global: {
        roles: string[];
        permissions: string[];
    };

    contexts: Context[];

    current_context: string | null; // nullable
};





// Two Factor Auth



export type TwoFactorToggleRequest = {
    enable: boolean;
}




export type UserBasicInfoUpdateRequest = {
    fullname?: string;
    email?: string;
    phone_number?: string;
}




export type ChangePasswordRequest = {
    current_password: string;
    new_password: string;
}