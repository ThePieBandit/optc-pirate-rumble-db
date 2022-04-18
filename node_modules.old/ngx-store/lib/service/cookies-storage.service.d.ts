import { WebStorageService } from './webstorage.service';
export declare class CookiesStorageService extends WebStorageService {
    static keys: Array<string>;
    constructor();
    set<T>(key: string, value: T, expirationDate?: Date): T;
}
