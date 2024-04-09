export interface Credentials {
    email: string;
    password: string;
}

export interface ResetDetails {
    email: string;
    token: string;
    password: string;
    password_confirmation: string;
}
