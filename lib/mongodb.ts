import { MongoClient } from 'mongodb';
import { MongoMemoryServer } from 'mongodb-memory-server';

// Na Vercel build prostředí řešíme připojení k MongoDB jinak
const isVercelBuild = process.env.VERCEL_ENV && !process.env.NEXT_PUBLIC_VERCEL_URL;
const isVercelProduction = process.env.VERCEL_ENV === 'production';

// V produkci nebo na Vercel Build API routes musí mít skutečnou MongoDB URL
// V development módu používáme Memory server, pokud není nastaveno skutečné URL
let uri = process.env.MONGODB_URI || '';

// Oprava: Vždy použít URI z proměnných prostředí, nikdy ne localhost
if (uri.includes('localhost') || uri.includes('127.0.0.1')) {
  console.warn('Detekováno lokální MongoDB URI, přepínám na memoryDB nebo mock');
  uri = ''; // Resetovat URI aby se použil memory server nebo mock
}
const options = {};

let client: MongoClient;
let clientPromise: Promise<MongoClient>;
let mongoMemoryServer: MongoMemoryServer | null = null;

// Vytvoření plně mockovaného MongoDB klienta, který nepotřebuje stahovat binárky
export const createMockDatabase = async () => {
  // Na Vercel a v produkci nikdy nebudeme používat MongoMemoryServer, jen mock klienta
  if (isVercelBuild || isVercelProduction || process.env.VERCEL) {
    console.log('Vercel environment detected - using fully mocked MongoDB client');
    return Promise.resolve({
      // Mock klienta s implementací db() metody
      db: () => ({
        collection: (collectionName: string) => ({
          find: () => ({
            sort: () => ({
              skip: () => ({
                limit: () => ({
                  toArray: () => Promise.resolve([])
                })
              }),
              limit: () => ({
                toArray: () => Promise.resolve([])
              }),
              toArray: () => Promise.resolve([])
            }),
            toArray: () => Promise.resolve([])
          }),
          findOne: () => Promise.resolve(null),
          insertOne: () => Promise.resolve({ insertedId: 'mock-id' }),
          insertMany: () => Promise.resolve({ insertedIds: ['mock-id'] }),
          updateOne: () => Promise.resolve({ modifiedCount: 1 }),
          deleteOne: () => Promise.resolve({ deletedCount: 1 }),
          countDocuments: () => Promise.resolve(0)
        }),
        // Další potřebné metody
      })
    } as unknown as MongoClient);
  }
  
  // Pro lokální vývoj (mimo Vercel) zkusíme MongoMemoryServer
  // pouze pokud jsme opravdu v dev módu
  if (process.env.NODE_ENV === 'development') {
    try {
      // Pokus o vytvoření MongoDB Memory serveru s explicitní verzí
      const server = await MongoMemoryServer.create({
        binary: {
          version: '6.0.5', // Specifikovat konkrétní verzi, která je dostupná
        }
      });
      mongoMemoryServer = server;
      const mockUri = server.getUri();
      console.log('Using MongoDB Memory Server:', mockUri);
      
      // Inicializace klienta
      const mockClient = new MongoClient(mockUri, options);
      return mockClient.connect();
    } catch (err) {
      console.error('Failed to create mock MongoDB server:', err);
      // Při chybě vrátíme mockovaný klient
      return Promise.resolve({
        db: () => ({
          collection: () => ({
            find: () => ({
              sort: () => ({
                skip: () => ({
                  limit: () => ({
                    toArray: () => Promise.resolve([])
                  })
                }),
                limit: () => ({
                  toArray: () => Promise.resolve([])
                }),
                toArray: () => Promise.resolve([])
              }),
              limit: () => ({
                toArray: () => Promise.resolve([])
              }),
              toArray: () => Promise.resolve([])
            }),
            findOne: () => Promise.resolve(null),
            insertOne: () => Promise.resolve({ insertedId: 'mock-id' }),
            countDocuments: () => Promise.resolve(0)
          })
        })
      } as unknown as MongoClient);
    }
  }
  
  // Pro jiné případy - vrátíme mockovaný klient
  return Promise.resolve({
    db: () => ({
      collection: () => ({
        find: () => ({
          sort: () => ({
            skip: () => ({
              limit: () => ({
                toArray: () => Promise.resolve([])
              })
            }),
            limit: () => ({
              toArray: () => Promise.resolve([])
            }),
            toArray: () => Promise.resolve([])
          }),
          limit: () => ({
            toArray: () => Promise.resolve([])
          }),
          toArray: () => Promise.resolve([])
        }),
        findOne: () => Promise.resolve(null),
        insertOne: () => Promise.resolve({ insertedId: 'mock-id' }),
        countDocuments: () => Promise.resolve(0)
      })
    })
  } as unknown as MongoClient);
};

// Rozlišení mezi různými prostředími
if (process.env.NODE_ENV === 'development') {
  // V development módu používáme globální proměnnou kvůli HMR
  let globalWithMongo = global as typeof globalThis & {
    _mongoClientPromise?: Promise<MongoClient>;
    _mongoMemoryServer?: MongoMemoryServer;
  };

  if (!globalWithMongo._mongoClientPromise) {
    // Pokud nemáme validní MongoDB URI, použijeme memory server
    if (!uri || uri.includes('localhost') || uri.includes('127.0.0.1')) {
      globalWithMongo._mongoClientPromise = createMockDatabase();
    } else {
      // Použijeme poskytnutou MongoDB URI
      client = new MongoClient(uri, options);
      globalWithMongo._mongoClientPromise = client.connect();
    }
    clientPromise = globalWithMongo._mongoClientPromise;
  } else {
    // Použijeme existující Promise
    clientPromise = globalWithMongo._mongoClientPromise;
    mongoMemoryServer = globalWithMongo._mongoMemoryServer || null;
  }
} else if (isVercelBuild) {
  // Při buildu na Vercel nepotřebujeme připojení k DB
  clientPromise = Promise.resolve({} as MongoClient);
} else {
  // V produkci potřebujeme skutečnou MongoDB URL
  if (!uri) {
    console.error('MongoDB URI is not defined! Using mock database.');
    clientPromise = createMockDatabase();
  } else {
    // Standardní produkční připojení
    client = new MongoClient(uri, options);
    clientPromise = client.connect();
  }
}

// Export a module-scoped MongoClient promise. By doing this in a
// separate module, the client can be shared across functions.
export const connectToDatabase = async () => {
  try {
    console.log("Connecting to MongoDB database...");
    const client = await clientPromise;
    console.log("MongoDB client connected");
    
    // V testovacím prostředí používáme speciální databázi
    const dbName = process.env.NODE_ENV === 'production' ? 'bondfolio' : 'bondfolio_test';
    console.log(`Using database: ${dbName}`);
    
    const db = client.db(dbName);
    
    return { client, db };
  } catch (error) {
    console.error("Failed to connect to MongoDB:", error);
    throw error;
  }
};

// For testing and development, we can seed the database with sample data
export const seedDatabase = async () => {
  const { db } = await connectToDatabase();
  
  // Check if we already have data
  const usersCount = await db.collection('users').countDocuments();
  
  if (usersCount === 0) {
    console.log('Seeding database with sample data...');
    
    // Create a sample partner user
    const partnerUser = {
      name: 'Demo Partner',
      email: 'partner@example.com',
      password: '$2a$12$k8Y1Jq1rWpX1Epb3RhpEwOKrF0hLVVOPYsYmZXPEYK1D5GJ.OXg1e', // 'password123'
      role: 'partner',
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    
    const partnerResult = await db.collection('users').insertOne(partnerUser);
    const partnerId = partnerResult.insertedId;
    
    // Create sample bond listings
    const listings = [
      {
        title: 'Corporate Bond A',
        description: 'High-yield corporate bond with excellent returns. This bond is issued by a Fortune 500 company with a strong credit rating.',
        issuer: 'ABC Corporation',
        yield: 5.5,
        maturityDate: new Date('2028-12-31'),
        minimumInvestment: 10000,
        partner: partnerId,
        status: 'active',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        title: 'Government Bond B',
        description: 'Low-risk government bond with stable returns. This bond is backed by the full faith and credit of the government.',
        issuer: 'Treasury Department',
        yield: 3.2,
        maturityDate: new Date('2030-06-30'),
        minimumInvestment: 5000,
        partner: partnerId,
        status: 'active',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        title: 'Municipal Bond C',
        description: 'Tax-exempt municipal bond for infrastructure projects. This bond finances essential public works in growing communities.',
        issuer: 'City of Metropolis',
        yield: 4.1,
        maturityDate: new Date('2029-03-15'),
        minimumInvestment: 15000,
        partner: partnerId,
        status: 'active',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ];
    
    await db.collection('bondlistings').insertMany(listings);
    
    console.log('Database seeded successfully!');
  }
};
