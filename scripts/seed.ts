#!/usr/bin/env node

/**
 * Database seeding script
 * Resets the database to default state
 */

import { request } from '@playwright/test';
import { env } from '../config/env';

async function seedDatabase() {
  console.log('🌱 Starting database seed...');
  console.log(`📍 Target URL: ${env.baseURL}`);

  const apiContext = await request.newContext();

  try {
    // Call reset endpoint
    const response = await apiContext.post(`${env.baseURL}/reset.php`);

    if (!response.ok()) {
      throw new Error(`Failed to reset database: ${response.status()} ${await response.text()}`);
    }

    const body = await response.json();
    
    console.log('✅ Database reset successful!');
    console.log(`👥 Users created: ${body.reset.sample_data.users}`);
    console.log(`🔑 Default password: ${body.reset.sample_data.default_password}`);
    console.log('\n📋 Sample accounts:');
    
    body.reset.sample_data.accounts.forEach((account: any) => {
      console.log(`  - ${account.email} (${account.role})`);
    });

    console.log('\n🎉 Database is ready for testing!');
  } catch (error) {
    console.error('❌ Seed failed:', error);
    process.exit(1);
  } finally {
    await apiContext.dispose();
  }
}

// Run if called directly
if (require.main === module) {
  seedDatabase();
}

export { seedDatabase };

