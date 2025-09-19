import mongoose from "mongoose";
import * as dotenv from "dotenv";
dotenv.config({ path: `.env`, override: true });

if (!process.env.MONGODB_URI) {
  throw new Error(
    "Please define the MONGODB_URI environment variable inside .env"
  );
}

/**
 * Cache-struktur:
 * - defaultConn: standard forbindelse (bruges af de fleste modeller)
 * - namedConns: map af navngivne forbindelser pr. dbName (til multi-db samtidig)
 */
let cached = global.mongoose;
if (!cached) {
  cached = global.mongoose = {
    defaultConn: null,
    defaultPromise: null,
    namedConns: new Map(), // dbName -> mongoose.Connection
    namedPromises: new Map(), // dbName -> Promise<mongoose.Connection>
  };
}

/**
 * Standard forbindelse (vælg DB via env DB_NAME)
 * Brug denne, hvis app’en typisk arbejder mod én database ad gangen.
 * Sæt i .env.local fx: DB_NAME=Legekrogen
 */
export default async function dbConnect() {
  if (cached.defaultConn) return cached.defaultConn;

  const dbName = process.env.DB_NAME || "mcdm-viborg";
  const opts = { bufferCommands: false, dbName };

  if (!cached.defaultPromise) {
    cached.defaultPromise = mongoose
      .connect(process.env.MONGODB_URI, opts)
      .then((m) => {
        console.log("Connected to MongoDB (default):", dbName);
        return m.connection;
      });
  }

  try {
    cached.defaultConn = await cached.defaultPromise;
  } catch (e) {
    cached.defaultPromise = null;
    throw e;
  }

  return cached.defaultConn;
}

/**
 * Ekstra forbindelse til en anden database (kør flere DBs samtidig)
 * NOTE:
 *  - Denne laver en separat connection med createConnection.
 *  - Når du bruger denne, skal du definere modeller på forbindelsen:
 *      const User = conn.model("User", userSchema);
 */
export async function getDbConnection(dbName) {
  if (!dbName) throw new Error("getDbConnection requires a dbName");

  if (cached.namedConns.has(dbName)) return cached.namedConns.get(dbName);

  if (!cached.namedPromises.has(dbName)) {
    const p = mongoose
      .createConnection(process.env.MONGODB_URI, {
        bufferCommands: false,
        dbName,
      })
      .asPromise()
      .then((conn) => {
        console.log("Connected to MongoDB (named):", dbName);
        return conn;
      });

    cached.namedPromises.set(dbName, p);
  }

  try {
    const conn = await cached.namedPromises.get(dbName);
    cached.namedConns.set(dbName, conn);
    return conn;
  } catch (e) {
    cached.namedPromises.delete(dbName);
    throw e;
  }
}
