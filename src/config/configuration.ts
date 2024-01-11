export default () => ({
  server: {
    port: parseInt(process.env.PORT, 10) || 3000,
  },
  database: {
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT, 10) || 5432,
    username: process.env.DB_USER || 'student',
    password: process.env.DB_PASSWORD || 'student',
    database: process.env.DB_NAME || 'kupipodariday',
  },
  jwt: {
    secret: process.env.JWT_SECRET || 'super_secret',
    ttl: process.env.JWT_TTL || '30000s',
  },
});

// import { TypeOrmModuleOptions } from '@nestjs/typeorm';
// import { Offer } from '../offers/entities/offer.entity';
// import { User } from '../users/entities/user.entity';
// import { Wish } from '../wishes/entities/wish.entity';
// import { Wishlist } from '../wishlists/entities/wishlist.entity';

// export const congigTypeOrm: TypeOrmModuleOptions = {
//   type: 'postgres',
//   host: 'localhost',
//   port: 5432,
//   username: 'student',
//   password: 'student',
//   database: 'kupipodariday',
//   entities: [Offer, User, Wish, Wishlist],
//   synchronize: true,
// };
