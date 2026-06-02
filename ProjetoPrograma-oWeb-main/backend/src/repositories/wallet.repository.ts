import { and, desc, eq, sql } from "drizzle-orm";
import { db } from "../db";
import { transactions, users } from "../db/schema";

export class WalletRepository {
  async getBalance(userId: number) {
    const user = await db
      .select({ balance: users.balance })
      .from(users)
      .where(eq(users.id, userId));

    return user[0]?.balance ?? 0;
  }

  async getAvailableBalance(userId: number) {
    const result = await db
      .select({ total: sql`COALESCE(SUM(${transactions.amount}), 0)` })
      .from(transactions)
      .where(
        and(
          eq(transactions.userId, userId),
          eq(transactions.status, "liberado")
        )
      );

    return Number(result[0]?.total ?? 0);
  }

  async getEscrowBalance(userId: number) {
    const result = await db
      .select({ total: sql`COALESCE(SUM(${transactions.amount}), 0)` })
      .from(transactions)
      .where(
        and(
          eq(transactions.userId, userId),
          eq(transactions.status, "bloqueado")
        )
      );

    return Number(result[0]?.total ?? 0);
  }

  async deposit(userId: number, amount: number, description: string) {
    await db
      .update(users)
      .set({ balance: sql`${users.balance} + ${amount}` })
      .where(eq(users.id, userId));

    const tx = await db
      .insert(transactions)
      .values({
        userId,
        type: "deposito",
        amount,
        description,
        status: "liberado"
      })
      .returning();

    return tx[0];
  }

  async withdraw(userId: number, amount: number, description: string) {
    const available = await this.getAvailableBalance(userId);
    if (available < amount) return null;

    await db
      .update(users)
      .set({ balance: sql`${users.balance} - ${amount}` })
      .where(eq(users.id, userId));

    const tx = await db
      .insert(transactions)
      .values({
        userId,
        type: "saque",
        amount: -amount,
        description,
        status: "liberado"
      })
      .returning();

    return tx[0];
  }

  async holdPayment(
    clientId: number,
    providerId: number,
    amount: number,
    description: string,
    referenceType: string,
    referenceId: number
  ) {
    await db
      .update(users)
      .set({ balance: sql`${users.balance} - ${amount}` })
      .where(eq(users.id, clientId));

    const outTx = await db
      .insert(transactions)
      .values({
        userId: clientId,
        type: "pagamento",
        amount: -amount,
        description,
        status: "bloqueado",
        referenceType,
        referenceId
      })
      .returning();

    await db
      .insert(transactions)
      .values({
        userId: providerId,
        type: "recebimento",
        amount,
        description,
        status: "bloqueado",
        referenceType,
        referenceId
      });

    return outTx[0];
  }

  async releasePayment(referenceType: string, referenceId: number) {
    await db
      .update(transactions)
      .set({ status: "liberado" })
      .where(
        and(
          eq(transactions.referenceType, referenceType),
          eq(transactions.referenceId, referenceId),
          eq(transactions.status, "bloqueado")
        )
      );

    return true;
  }

  async cancelPayment(referenceType: string, referenceId: number, cancellationReason: string) {
    const txs = await db
      .select()
      .from(transactions)
      .where(
        and(
          eq(transactions.referenceType, referenceType),
          eq(transactions.referenceId, referenceId),
          eq(transactions.status, "bloqueado")
        )
      );

    const clientTx = txs.find(tx => tx.type === "pagamento");
    const providerTx = txs.find(tx => tx.type === "recebimento");

    if (clientTx) {
      await db
        .update(users)
        .set({ balance: sql`${users.balance} + ${Math.abs(clientTx.amount)}` })
        .where(eq(users.id, clientTx.userId));
    }

    await db
      .update(transactions)
      .set({
        status: "devolvido",
        cancellationReason
      })
      .where(
        and(
          eq(transactions.referenceType, referenceType),
          eq(transactions.referenceId, referenceId),
          eq(transactions.status, "bloqueado")
        )
      );

    if (clientTx) {
      await db
        .insert(transactions)
        .values({
          userId: clientTx.userId,
          type: "estorno",
          amount: Math.abs(clientTx.amount),
          description: `Estorno - ${cancellationReason}`,
          status: "liberado",
          referenceType,
          referenceId
        });
    }

    return true;
  }

  async getEscrowList(userId: number) {
    return db
      .select()
      .from(transactions)
      .where(
        and(
          eq(transactions.userId, userId),
          eq(transactions.status, "bloqueado")
        )
      )
      .orderBy(desc(transactions.createdAt));
  }

  async getHistory(userId: number) {
    return db
      .select()
      .from(transactions)
      .where(eq(transactions.userId, userId))
      .orderBy(desc(transactions.createdAt));
  }

  async getAllTransactions() {
    return db
      .select({
        id: transactions.id,
        userId: transactions.userId,
        type: transactions.type,
        amount: transactions.amount,
        description: transactions.description,
        status: transactions.status,
        cancellationReason: transactions.cancellationReason,
        referenceType: transactions.referenceType,
        referenceId: transactions.referenceId,
        createdAt: transactions.createdAt
      })
      .from(transactions)
      .orderBy(desc(transactions.createdAt));
  }
}
