
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

    abstract customers(): Customer[] | Promise<Customer[]>;

    abstract customer(id: string): Customer | Promise<Customer>;

    abstract login(info?: infoScalar): resScalar | Promise<resScalar>;

    abstract getMe(): User | Promise<User>;

    abstract stockModels(): StockModel[] | Promise<StockModel[]>;

    abstract stockModel(id: string): StockModel | Promise<StockModel>;

    abstract users(): User[] | Promise<User[]>;

    abstract user(id: string): User | Promise<User>;

    abstract vendors(): Vendor[] | Promise<Vendor[]>;

    abstract vendor(id: string): Vendor | Promise<Vendor>;
}

export abstract class IMutation {
    abstract createCat(createCatInput?: CreateCatInput): Cat | Promise<Cat>;

    abstract createCompany(info?: infoScalar): Company | Promise<Company>;

    abstract updateCompany(id: string, info?: infoScalar): Company | Promise<Company>;

    abstract deleteCompanies(ids?: string[]): boolean | Promise<boolean>;

    abstract createCustomer(info?: infoScalar): Customer | Promise<Customer>;

    abstract updateCustomer(id: string, info?: infoScalar): Customer | Promise<Customer>;

    abstract deleteCustomers(ids?: string[]): boolean | Promise<boolean>;

    abstract createStockModel(info?: infoScalar): StockModel | Promise<StockModel>;

    abstract updateStockModel(id: string, info?: infoScalar): StockModel | Promise<StockModel>;

    abstract deleteStockModels(ids?: string[]): boolean | Promise<boolean>;

    abstract createUser(info?: InputUser): User | Promise<User>;

    abstract deleteUser(ids?: string[]): User | Promise<User>;

    abstract createVendor(info?: infoScalar): Vendor | Promise<Vendor>;

    abstract updateVendor(id: string, info?: infoScalar): Vendor | Promise<Vendor>;

    abstract deleteVendors(ids?: string[]): boolean | Promise<boolean>;
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
    unsignName?: string;
    address?: string;
    mobile?: string;
}

export class Customer {
    _id?: string;
    code?: string;
    fullName?: string;
    unsignFullName?: string;
    address?: string;
    mobile?: string;
}

export class StockModel {
    _id?: string;
    code?: string;
    name?: string;
    unsignName?: string;
    detail?: DetailStockModel;
}

export class DetailStockModel {
    unit?: string[];
    factor?: number[];
    buyPrice?: number;
}

export class User {
    _id?: string;
    username?: string;
    password?: string;
    name?: string;
}

export class Vendor {
    _id?: string;
    code?: string;
    name?: string;
    unsignName?: string;
    address?: string;
    mobile?: string;
}

export type infoScalar = any;
export type resScalar = any;
