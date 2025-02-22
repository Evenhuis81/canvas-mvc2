export interface BaseModel {
    id: number;
}

export interface User extends BaseModel {
    first_name: string;
    last_name: string;
    email: string;
    roles: Role[];
}

export interface Role extends BaseModel {
    name: string;
}

export interface Card extends BaseModel {
    user_id: number;
    card_number: string;
}

export interface Pagination {
    data: User[];
    links: Links;
}

export interface Links {
    first: string;
    last: string;
    next: string;
    prev: string;
}

export interface PaginationItem {
    perPage: number;
    lastPage: number;
}

export interface AdminInvitation extends BaseModel {
    invitee_user_id: number;
    accepted: boolean;
    expired: boolean;
    hash: string;
    expiration_date: Date;
    inviter_user_id: number;
}

type ObjectEmitsOptions = Record<string, ((...args: any[]) => any) | null>;

export type EmitsToProps<T extends ObjectEmitsOptions> = {
    [K in `on${Capitalize<string & keyof T>}`]?: K extends `on${infer C}`
        ? (
              ...args: T[Uncapitalize<C>] extends (...args: infer P) => unknown
                  ? P
                  : T[Uncapitalize<C>] extends null
                  ? unknown[]
                  : never
          ) => unknown
        : never;
};
