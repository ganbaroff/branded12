
-- Add status column to leads if it doesn't exist (it should exist from migration 4, but just in case)
-- Status values: 'new', 'contacted', 'qualified', 'converted', 'lost'
-- This migration is idempotent - safe to run multiple times
