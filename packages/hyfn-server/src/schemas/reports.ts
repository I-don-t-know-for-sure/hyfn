import {
  boolean,
  date,
  decimal,
  index,
  pgTable,
  serial,
  timestamp,
  uuid,
  varchar,
} from "drizzle-orm/pg-core";
import { createSelectSchema } from "drizzle-zod";
import * as z from "zod";
export const reports = pgTable(
  "reports",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    reportDate: timestamp("report_date").defaultNow(),
    orderId: uuid("order_id").notNull(),
    driverId: uuid("driver_id").notNull(),
  },
  (table) => {
    return {
      orderIdx: index("order_idx").on(table.orderId),
      driverIdx: index("driver_idx").on(table.driverId),
    };
  }
);

const schema = createSelectSchema(reports);
export const zReports = z.object({
  ...schema.shape,
});

// export type Driver = z.infer<typeof zDriver>;
