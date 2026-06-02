import { eq } from "drizzle-orm";
import { db } from "../db";
import { users } from "../db/schema";

type UserRole = "cliente" | "prestador" | "prestador_pendente" | "admin";

type CreateUserRepositoryDTO = {
  name: string;
  email: string;
  passwordHash: string;
  phone?: string;
  identity?: string;
  facebook?: string;
  profileImageUrl?: string | null;
  role?: UserRole;
};

export class UsersRepository {
  async create(data: CreateUserRepositoryDTO) {
    const result = await db
      .insert(users)
      .values({
        name: data.name,
        email: data.email,
        passwordHash: data.passwordHash,
        phone: data.phone,
        identity: data.identity,
        facebook: data.facebook,
        profileImageUrl: data.profileImageUrl ?? null,
        role: data.role ?? "cliente"
      })
      .returning({
        id: users.id,
        name: users.name,
        email: users.email,
        phone: users.phone,
        identity: users.identity,
        facebook: users.facebook,
        profileImageUrl: users.profileImageUrl,
        role: users.role,
        createdAt: users.createdAt
      });

    return result[0];
  }

  async findByEmail(email: string) {
    const result = await db
      .select()
      .from(users)
      .where(eq(users.email, email));

    return result[0] ?? null;
  }

  async findById(id: number) {
    const result = await db
      .select({
        id: users.id,
        name: users.name,
        email: users.email,
        phone: users.phone,
        identity: users.identity,
        facebook: users.facebook,
        profileImageUrl: users.profileImageUrl,
        role: users.role,
        createdAt: users.createdAt
      })
      .from(users)
      .where(eq(users.id, id));

    return result[0] ?? null;
  }

  async findAll() {
    return db
      .select({
        id: users.id,
        name: users.name,
        email: users.email,
        phone: users.phone,
        identity: users.identity,
        facebook: users.facebook,
        profileImageUrl: users.profileImageUrl,
        role: users.role,
        createdAt: users.createdAt
      })
      .from(users);
  }

  async updateRole(id: number, role: UserRole) {
    const result = await db
      .update(users)
      .set({ role })
      .where(eq(users.id, id))
      .returning({
        id: users.id,
        name: users.name,
        email: users.email,
        role: users.role
      });

    return result[0] ?? null;
  }

  async updateProfile(id: number, data: {
    name?: string;
    phone?: string;
    identity?: string;
    facebook?: string;
    profileImageUrl?: string | null;
  }) {
    const updateData: Record<string, any> = {};
    if (data.name !== undefined) updateData.name = data.name;
    if (data.phone !== undefined) updateData.phone = data.phone;
    if (data.identity !== undefined) updateData.identity = data.identity;
    if (data.facebook !== undefined) updateData.facebook = data.facebook;
    if (data.profileImageUrl !== undefined) updateData.profileImageUrl = data.profileImageUrl;

    if (Object.keys(updateData).length === 0) {
      return this.findById(id);
    }

    const result = await db
      .update(users)
      .set(updateData)
      .where(eq(users.id, id))
      .returning({
        id: users.id,
        name: users.name,
        email: users.email,
        phone: users.phone,
        identity: users.identity,
        facebook: users.facebook,
        profileImageUrl: users.profileImageUrl,
        role: users.role,
        createdAt: users.createdAt
      });

    return result[0] ?? null;
  }
}