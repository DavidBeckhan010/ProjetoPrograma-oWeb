import { and, eq } from "drizzle-orm";
import { db } from "../db";
import { appointments, reviews, services, users } from "../db/schema";

export class ReviewsRepository {
  async create(data: {
    appointmentId: number;
    serviceId: number;
    clientId: number;
    providerId: number;
    rating: number;
    comment: string;
  }) {
    const existing = await db
      .select()
      .from(reviews)
      .where(
        and(
          eq(reviews.appointmentId, data.appointmentId),
          eq(reviews.clientId, data.clientId)
        )
      );

    if (existing[0]) return null;

    const result = await db.insert(reviews).values(data).returning();
    return result[0];
  }

  async findByService(serviceId: number) {
    return db
      .select({
        id: reviews.id,
        rating: reviews.rating,
        comment: reviews.comment,
        clientName: users.name,
        createdAt: reviews.createdAt
      })
      .from(reviews)
      .innerJoin(users, eq(users.id, reviews.clientId))
      .where(eq(reviews.serviceId, serviceId))
      .orderBy(reviews.id);
  }

  async findByProvider(providerId: number) {
    return db
      .select({
        id: reviews.id,
        rating: reviews.rating,
        comment: reviews.comment,
        clientName: users.name,
        serviceName: services.name,
        createdAt: reviews.createdAt
      })
      .from(reviews)
      .innerJoin(users, eq(users.id, reviews.clientId))
      .innerJoin(services, eq(services.id, reviews.serviceId))
      .where(eq(reviews.providerId, providerId))
      .orderBy(reviews.id);
  }

  async getAverageRating(serviceId: number) {
    const result = await db
      .select({
        avg: reviews.rating,
        count: reviews.id
      })
      .from(reviews)
      .where(eq(reviews.serviceId, serviceId));

    return result[0] ?? { avg: 0, count: 0 };
  }
}
