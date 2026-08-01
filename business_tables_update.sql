-- Run this script in your Supabase SQL Editor to ensure business info columns exist
DO $$ 
BEGIN 
    -- Check and add business_address
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='profiles' AND column_name='business_address') THEN
        ALTER TABLE profiles ADD COLUMN business_address TEXT;
    END IF;

    -- Check and add business_phone
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='profiles' AND column_name='business_phone') THEN
        ALTER TABLE profiles ADD COLUMN business_phone TEXT;
    END IF;

    -- Check and add whatsapp_number
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='profiles' AND column_name='whatsapp_number') THEN
        ALTER TABLE profiles ADD COLUMN whatsapp_number TEXT;
    END IF;

    -- Check and add business_logo
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='profiles' AND column_name='business_logo') THEN
        ALTER TABLE profiles ADD COLUMN business_logo TEXT;
    END IF;
END $$;
