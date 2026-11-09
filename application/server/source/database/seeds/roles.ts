import { database } from "@/config/database";
import { rolesTable, rolesEnum } from "@/database/schema/roles";

export const seedRoles = async () => {
  const values = rolesEnum.enumValues.map((roleName) => ({ roleName }));

  await database
    .insert(rolesTable)
    .values(values)
    .onConflictDoNothing({ target: rolesTable.roleName });
};

main().catch((error) => {
  console.error(`Seed failed: ${error}`);
  process.exit(1);
});

async function main() {
  await seedRoles();
  process.exit(0);
}
