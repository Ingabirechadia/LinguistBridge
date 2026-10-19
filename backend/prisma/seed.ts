import { randomBytes, scrypt as scryptCallback } from 'node:crypto';
import { promisify } from 'node:util';

import { prisma } from '../src/lib/prisma';
import { ProficiencyLevel, Role } from '../src/generated/prisma/client';

const scrypt = promisify(scryptCallback);
const DEMO_PASSWORD = 'Demo1234!';

async function hashPassword(password: string): Promise<string> {
  const salt = randomBytes(16);
  const derivedKey = (await scrypt(password, salt, 64)) as Buffer;
  return `scrypt:${salt.toString('hex')}:${derivedKey.toString('hex')}`;
}

async function main(): Promise<void> {
  const demoUsers = [
    { email: 'client@demo.com', fullName: 'Demo Client', role: Role.CLIENT },
    {
      email: 'interpreter@demo.com',
      fullName: 'Demo Interpreter',
      role: Role.INTERPRETER,
    },
    { email: 'admin@demo.com', fullName: 'Demo Admin', role: Role.ADMIN },
  ];

  const users = await Promise.all(
    demoUsers.map(async (user) => {
      const passwordHash = await hashPassword(DEMO_PASSWORD);

      return prisma.user.upsert({
        where: { email: user.email },
        update: {
          fullName: user.fullName,
          passwordHash,
          role: user.role,
          isActive: true,
          isEmailVerified: true,
        },
        create: {
          ...user,
          passwordHash,
          isActive: true,
          isEmailVerified: true,
        },
      });
    }),
  );

  const interpreter = users.find((user) => user.role === Role.INTERPRETER);

  if (!interpreter) {
    throw new Error('Failed to create the demo interpreter account.');
  }

  const profile = await prisma.interpreterProfile.upsert({
    where: { userId: interpreter.id },
    update: {
      displayName: interpreter.fullName,
      hourlyRateMinor: 3000,
      currency: 'USD',
      isApproved: true,
      isAvailable: true,
    },
    create: {
      userId: interpreter.id,
      displayName: interpreter.fullName,
      bio: 'Demo interpreter for Kinyarwanda, English, and French.',
      hourlyRateMinor: 3000,
      currency: 'USD',
      isApproved: true,
      isAvailable: true,
    },
  });

  const languageData = [
    { code: 'rw', name: 'Kinyarwanda', native: 'Ikinyarwanda' },
    { code: 'en', name: 'English', native: 'English' },
    { code: 'fr', name: 'French', native: 'Français' },
  ];

  const languages = await Promise.all(
    languageData.map((language) =>
      prisma.language.upsert({
        where: { code: language.code },
        update: { name: language.name, native: language.native, isActive: true },
        create: language,
      }),
    ),
  );

  const languageByCode = new Map(languages.map((language) => [language.code, language]));
  const languagePairs = [
    ['rw', 'en'],
    ['rw', 'fr'],
    ['en', 'fr'],
  ] as const;

  for (const pair of languagePairs) {
    for (const code of pair) {
      const language = languageByCode.get(code);

      if (!language) {
        throw new Error(`Seed language ${code} was not created.`);
      }

      await prisma.interpreterLanguage.upsert({
        where: {
          interpreterId_languageId: {
            interpreterId: profile.id,
            languageId: language.id,
          },
        },
        update: { proficiency: ProficiencyLevel.NATIVE },
        create: {
          interpreterId: profile.id,
          languageId: language.id,
          proficiency: ProficiencyLevel.NATIVE,
          isPrimary: code === 'rw',
        },
      });
    }
  }

  console.info('Demo accounts, languages, and interpreter language pairs are ready.');
}

main()
  .catch((error: unknown) => {
    console.error('Failed to seed the database:', error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
