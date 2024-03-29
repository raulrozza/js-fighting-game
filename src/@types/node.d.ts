interface ObjectConstructor {
    entries<T>(o: ArrayLike<T>): [string, T][];
    entries<T extends { [s: string]: any }>(o: T): [keyof T, T[keyof T]][];

    keys<T>(o: T): Array<keyof T>;

    values<T>(o: ArrayLike<T>): T[];
    values<T extends { [s: string]: any }>(o: T): T[keyof T][];
}
