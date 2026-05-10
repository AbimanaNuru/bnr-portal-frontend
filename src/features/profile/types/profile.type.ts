


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
        permissions: string[];
    };



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
