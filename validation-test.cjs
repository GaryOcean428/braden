#!/usr/bin/env node
// Simple validation script to test RLS policies and storage functionality
// Usage: node validation-test.js

const { createClient } = require('@supabase/supabase-js');
const path = require('path');
const fs = require('fs');

// Read environment variables or use defaults
const SUPABASE_URL = process.env.VITE_SUPABASE_URL || "https://iykrauzuutvmnxpqppzk.supabase.co";
const SUPABASE_ANON_KEY = process.env.VITE_SUPABASE_ANON_KEY || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Iml5a3JhdXp1dXR2bW54cHFwcHprIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzU4NzE1NjcsImV4cCI6MjA1MTQ0NzU2N30.kvAGD6FrOhmdpYzRHMyXam3p337w8Ijd5_raruHPd6U";

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

async function testRLSPolicies() {
  console.log('🧪 Testing RLS Policies and Storage Access...\n');

  // Test 1: Anonymous access to admin_users (should fail gracefully)
  console.log('1. Testing anonymous access to admin_users...');
  try {
    const { data, error } = await supabase
      .from('admin_users')
      .select('*');
    
    if (error) {
      console.log('   ✅ Anonymous access properly denied:', error.message);
    } else {
      console.log('   ⚠️  Anonymous access unexpectedly allowed, returned', data?.length || 0, 'records');
    }
  } catch (err) {
    console.log('   ✅ Anonymous access properly blocked:', err.message);
  }

  // Test 2: Anonymous access to hero-images storage (should work for listing)
  console.log('\n2. Testing anonymous access to hero-images storage...');
  try {
    const { data, error } = await supabase.storage
      .from('hero-images')
      .list('', { limit: 10 });
    
    if (error) {
      console.log('   ❌ Storage listing failed:', error.message);
      if (error.message.includes('new row violates row-level security')) {
        console.log('   📝 This indicates missing INSERT policy for storage temp table operations');
      }
    } else {
      console.log('   ✅ Storage listing succeeded, found', data?.length || 0, 'items');
    }
  } catch (err) {
    console.log('   ❌ Storage listing error:', err.message);
  }

  // Test 3: Check if hero-images bucket exists
  console.log('\n3. Testing hero-images bucket access...');
  try {
    const { data, error } = await supabase.storage.listBuckets();
    
    if (error) {
      console.log('   ❌ Cannot list buckets:', error.message);
    } else {
      const heroImagesBucket = data?.find(bucket => bucket.id === 'hero-images');
      if (heroImagesBucket) {
        console.log('   ✅ hero-images bucket found:', heroImagesBucket.name);
      } else {
        console.log('   ⚠️  hero-images bucket not found. Available buckets:', 
          data?.map(b => b.id).join(', ') || 'none');
      }
    }
  } catch (err) {
    console.log('   ❌ Bucket listing error:', err.message);
  }

  console.log('\n🏁 RLS Policy validation complete!\n');
  console.log('📋 Summary:');
  console.log('   • admin_users should deny anonymous access (403 expected)');
  console.log('   • hero-images storage should allow anonymous listing (no "new row violates" error)');
  console.log('   • Authenticated users will have access based on RLS policies');
}

// Run the validation
testRLSPolicies().catch(console.error);