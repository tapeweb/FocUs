import { Database } from "../../Config/Database";
import { RolesTable, RolesEnum } from "@/Database/Schema/Database Table/Roles";

export const seedRoles = async () => {
  const values = RolesEnum.enumValues.map((RoleName) => ({ RoleName }));

  await Database.insert(RolesTable)
    .values(values)
    .onConflictDoNothing({ target: RolesTable.RoleName });
};

const main = async () => {
  await seedRoles();
  process.exit(0);
};

main().catch((error) => {
  console.error(`Seed failed: ${error}`);
  process.exit(1);
});
