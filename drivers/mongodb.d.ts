import { Collection } from "mongodb";
export interface MongoDbOptions {
    /**
     * The MongoDB connection string.
     */
    connectionString: string;
    /**
     * The name of the database to use.
     * @default "unstorage"
     */
    databaseName?: string;
    /**
     * The name of the collection to use.
     * @default "unstorage"
     */
    collectionName?: string;
}
declare const _default: (opts: MongoDbOptions) => import("..").Driver<MongoDbOptions, Collection<import("mongodb").Document>>;
export default _default;
