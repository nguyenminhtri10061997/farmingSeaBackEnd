
/*
 * ------------------------------------------------------
 * THIS FILE WAS AUTOMATICALLY GENERATED (DO NOT MODIFY)
 * -------------------------------------------------------
 */

/* tslint:disable */
/* eslint-disable */
export class CreateCatInput {
    name?: string;
    age?: number;
}

export class InputUser {
    username?: string;
    password?: string;
}

export abstract class IQuery {
    abstract cats(): Cat[] | Promise<Cat[]>;

    abstract cat(id: string): Cat | Promise<Cat>;

    abstract conpanies(): Company[] | Promise<Company[]>;

    abstract company(id: string): Company | Promise<Company>;

    abstract login(info?: infoScalar): resScalar | Promise<resScalar>;

    abstract getMe(): User | Promise<User>;

    abstract users(): User[] | Promise<User[]>;

    abstract user(id: string): User | Promise<User>;
}

export abstract class IMutation {
    abstract createCat(createCatInput?: CreateCatInput): Cat | Promise<Cat>;

    abstract createCompany(info?: infoScalar): Company | Promise<Company>;

    abstract updateCompany(id: string, info?: infoScalar): Company | Promise<Company>;

    abstract deleteCompanies(ids?: string[]): boolean | Promise<boolean>;

    abstract createUser(info?: InputUser): User | Promise<User>;

    abstract deleteUser(ids?: string[]): User | Promise<User>;
}

export class Owner {
    id: number;
    name: string;
    age?: number;
    cats?: Cat[];
}

export class Cat {
    id?: number;
    name?: string;
    age?: number;
    owner?: Owner;
}

export class Company {
    _id?: string;
    code?: string;
    name?: string;
    address?: string;
    mobile?: string;
}

export class User {
    _id?: string;
    username?: string;
    password?: string;
    name?: string;
}

export type infoScalar = any;
export type resScalar = any;
