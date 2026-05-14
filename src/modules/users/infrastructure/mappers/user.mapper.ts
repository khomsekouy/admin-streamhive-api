import { User as PrismaUser, UserRole as PrismaUserRole } from '@prisma/client';
import { User } from '../../domain/user.entity';

export class UserMapper {
  static toDomain(record: PrismaUser): User {
    return User.rehydrate(record.id, {
      email: record.email,
      passwordHash: record.passwordHash,
      name: record.name,
      role: record.role as PrismaUserRole,
      isActive: record.isActive,
      createdAt: record.createdAt,
      updatedAt: record.updatedAt,
    });
  }

  static toPersistence(user: User): PrismaUser {
    return {
      id: user.id,
      email: user.email,
      passwordHash: user.passwordHash,
      name: user.name,
      role: user.role as PrismaUserRole,
      isActive: user.isActive,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };
  }
}
