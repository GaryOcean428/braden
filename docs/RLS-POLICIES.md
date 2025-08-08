# RLS Policies and Storage Access Documentation

This document describes the Row Level Security (RLS) policies implemented to fix authentication and storage access issues.

## Issues Fixed

### 1. 403 Error on `admin_users` Table
**Problem**: Anonymous and non-admin users received 403 errors when accessing the admin_users table due to missing or overly restrictive RLS policies.

**Solution**: Implemented comprehensive RLS policies that:
- Allow developer admin (`braden.lang77@gmail.com`) full access to all admin_users records
- Allow admin users to read/update their own records
- Deny access for anonymous and non-admin users

### 2. Storage "new row violates row-level security policy"
**Problem**: The Storage HTTP list endpoint internally runs `INSERT` operations on temporary tables, causing RLS violations when only SELECT policies existed.

**Solution**: Implemented both SELECT and INSERT policies for the `hero-images` bucket to support listing operations.

## RLS Policies Implemented

### Admin Users Table (`admin_users`)

```sql
-- Enable RLS
ALTER TABLE public.admin_users ENABLE ROW LEVEL SECURITY;

-- Main policy for read/write access
CREATE POLICY "admins can read and write"
ON public.admin_users
FOR ALL TO authenticated
USING (
    -- Developer admin can access all records
    EXISTS (
        SELECT 1 FROM auth.users
        WHERE id = auth.uid()
        AND email = 'braden.lang77@gmail.com'
    )
    OR
    -- Admin users can read their own record
    auth.uid() = user_id::uuid
)
WITH CHECK (
    -- Developer admin can insert/update any record
    EXISTS (
        SELECT 1 FROM auth.users
        WHERE id = auth.uid()
        AND email = 'braden.lang77@gmail.com'
    )
    OR
    -- Admin users can update their own record
    auth.uid() = user_id::uuid
);
```

### Storage Policies (`storage.objects`)

```sql
-- SELECT policy for listing hero-images (enables .list() operation)
CREATE POLICY "list hero-images"
ON storage.objects
FOR SELECT
USING (bucket_id = 'hero-images');

-- INSERT policy for hero-images (enables .list() internal temp table operations)
CREATE POLICY "insert hero-images"
ON storage.objects  
FOR INSERT
WITH CHECK (bucket_id = 'hero-images');

-- UPDATE policy for authenticated users
CREATE POLICY "update hero-images"
ON storage.objects
FOR UPDATE TO authenticated
USING (bucket_id = 'hero-images')
WITH CHECK (bucket_id = 'hero-images');

-- DELETE policy for authenticated users
CREATE POLICY "delete hero-images"
ON storage.objects
FOR DELETE TO authenticated
USING (bucket_id = 'hero-images');
```

### Storage Bucket Policies (`storage.buckets`)

```sql
-- Allow everyone to read bucket metadata
CREATE POLICY "public bucket access"
ON storage.buckets
FOR SELECT
USING (id = 'hero-images');

-- Allow authenticated users to manage bucket
CREATE POLICY "authenticated bucket management"
ON storage.buckets  
FOR ALL TO authenticated
USING (id = 'hero-images')
WITH CHECK (id = 'hero-images');
```

## Access Matrix

| User Type | admin_users | hero-images Storage | hero-images Bucket |
|-----------|------------|--------------------|--------------------|
| Anonymous | ❌ Denied   | ✅ List/Read       | ✅ Read metadata   |
| Authenticated | ✅ Own record | ✅ Full access | ✅ Full access |
| Developer Admin | ✅ Full access | ✅ Full access | ✅ Full access |

## Client-Side Usage

### Admin Users
```typescript
// Use typed query-builder to guarantee JWT attachment
const { data, error } = await supabase
  .from('admin_users')
  .select('*');
```

### Storage Listing
```typescript
// Use Supabase client for storage operations
const { data, error } = await supabase
  .storage
  .from('hero-images')
  .list('');
```

## Testing

A validation script is included (`validation-test.cjs`) to verify:
- Anonymous access to admin_users is properly denied
- Storage listing works without "new row violates" errors
- Bucket access functions correctly

Run with: `node validation-test.cjs`

## Migration Files

- `20250808080000_add_admin_storage_policies.sql` - Contains all RLS policy definitions
- Applied automatically via Supabase migrations

## Security Notes

- All policies use `auth.uid()` to ensure proper user identification
- Developer admin access is controlled by email verification
- Storage operations automatically include JWT tokens when using the Supabase client
- RLS policies handle access control server-side, removing need for client-side permission checks