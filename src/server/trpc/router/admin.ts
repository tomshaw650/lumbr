import { router, protectedProcedure } from "../trpc";
import { z } from "zod";
import { prisma } from "../../db/client";

export const adminRouter = router({
  getAllReports: protectedProcedure.query(async () => {
    const reports = await prisma.report.findMany({
      include: {
        log: true,
        reporter_user: {
          select: {
            username: true,
          },
        },
        reported_user: {
          select: {
            username: true,
          },
        },
      },
      orderBy: {
        created_at: "asc",
      },
    });
    return reports;
  }),

  ignoreReport: protectedProcedure
    .input(
      z.object({
        reportId: z.string(),
      })
    )
    .mutation(async ({ input }) => {
      // delete the report
      const report = await prisma.report.delete({
        where: {
          report_id: input.reportId,
        },
      });
      return report;
    }),

  suspend: protectedProcedure
    .input(
      z.object({
        userId: z.string(),
        logId: z.string(),
        suspendDate: z.string(),
        suspendReason: z
          .string()
          .max(60, "Reason must be less than 60 characters"),
      })
    )
    .mutation(async ({ input }) => {
      const date = new Date(input.suspendDate);
      const formattedDate = date.toISOString();

      // update suspended status, date and reason
      const user = await prisma.user.update({
        where: {
          id: input.userId,
        },
        data: {
          suspended: true,
          suspendDate: formattedDate,
          suspendReason: input.suspendReason,
        },
      });

      // delete all the reports associated with user
      await prisma.report.deleteMany({
        where: {
          user_id: input.userId,
        },
      });

      // delete the log that caused the suspension
      await prisma.log.delete({
        where: {
          log_id: input.logId,
        },
      });

      return user;
    }),
});
