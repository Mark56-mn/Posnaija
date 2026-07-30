-- Create profiles table
CREATE TABLE IF NOT EXISTS profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT NOT NULL,
    business_name TEXT NOT NULL,
    business_phone TEXT,
    whatsapp_number TEXT,
    business_logo TEXT,
    role TEXT DEFAULT 'admin',
    onboarding_completed BOOLEAN DEFAULT FALSE,
    plan TEXT DEFAULT 'free',
    offline_pin TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create subscriptions table
CREATE TABLE IF NOT EXISTS subscriptions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    admin_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    plan TEXT NOT NULL,
    status TEXT NOT NULL,
    trial_ends_at TIMESTAMP WITH TIME ZONE,
    current_period_end TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create products table
CREATE TABLE IF NOT EXISTS products (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    admin_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    category_id UUID,
    cost_price NUMERIC NOT NULL DEFAULT 0,
    selling_price NUMERIC NOT NULL DEFAULT 0,
    quantity INTEGER NOT NULL DEFAULT 0,
    low_stock_alert INTEGER NOT NULL DEFAULT 5,
    unit TEXT NOT NULL DEFAULT 'piece',
    sku TEXT,
    expiry_date DATE,
    image_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create sales table
CREATE TABLE IF NOT EXISTS sales (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    admin_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    customer_id UUID,
    customer_name TEXT NOT NULL,
    items JSONB NOT NULL,
    subtotal NUMERIC NOT NULL DEFAULT 0,
    discount NUMERIC NOT NULL DEFAULT 0,
    total NUMERIC NOT NULL DEFAULT 0,
    payment_method TEXT NOT NULL,
    payment_status TEXT NOT NULL,
    amount_paid NUMERIC NOT NULL DEFAULT 0,
    debt_amount NUMERIC NOT NULL DEFAULT 0,
    served_by TEXT NOT NULL,
    staff_id UUID,
    receipt_number TEXT NOT NULL,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create customers table
CREATE TABLE IF NOT EXISTS customers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    admin_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    phone TEXT,
    whatsapp TEXT,
    total_debt NUMERIC NOT NULL DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create categories table
CREATE TABLE IF NOT EXISTS categories (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    admin_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create debts table
CREATE TABLE IF NOT EXISTS debts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    admin_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    customer_id UUID REFERENCES customers(id) ON DELETE CASCADE,
    customer_name TEXT NOT NULL,
    sale_id UUID REFERENCES sales(id) ON DELETE CASCADE,
    amount NUMERIC NOT NULL DEFAULT 0,
    amount_paid NUMERIC NOT NULL DEFAULT 0,
    balance NUMERIC NOT NULL DEFAULT 0,
    status TEXT NOT NULL,
    due_date DATE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create staff table
CREATE TABLE IF NOT EXISTS staff (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    admin_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    role TEXT NOT NULL,
    pin TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create stock_audit_logs table
CREATE TABLE IF NOT EXISTS stock_audit_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    admin_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
    product_name TEXT NOT NULL,
    user_id TEXT NOT NULL,
    user_name TEXT NOT NULL,
    old_quantity INTEGER NOT NULL,
    new_quantity INTEGER NOT NULL,
    change_amount INTEGER NOT NULL,
    reason TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security (RLS)
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE sales ENABLE ROW LEVEL SECURITY;
ALTER TABLE customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE debts ENABLE ROW LEVEL SECURITY;
ALTER TABLE staff ENABLE ROW LEVEL SECURITY;
ALTER TABLE stock_audit_logs ENABLE ROW LEVEL SECURITY;

-- Create policies for profiles (users can read/update their own profile)
CREATE POLICY "Users can view own profile" ON profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON profiles FOR UPDATE USING (auth.uid() = id);

-- Create policies for other tables (users can manage records where admin_id = their uid)
CREATE POLICY "Users can manage own subscriptions" ON subscriptions FOR ALL USING (auth.uid() = admin_id);
CREATE POLICY "Users can manage own products" ON products FOR ALL USING (auth.uid() = admin_id);
CREATE POLICY "Users can manage own sales" ON sales FOR ALL USING (auth.uid() = admin_id);
CREATE POLICY "Users can manage own customers" ON customers FOR ALL USING (auth.uid() = admin_id);
CREATE POLICY "Users can manage own categories" ON categories FOR ALL USING (auth.uid() = admin_id);
CREATE POLICY "Users can manage own debts" ON debts FOR ALL USING (auth.uid() = admin_id);
CREATE POLICY "Users can manage own staff" ON staff FOR ALL USING (auth.uid() = admin_id);
CREATE POLICY "Users can manage own stock audit logs" ON stock_audit_logs FOR ALL USING (auth.uid() = admin_id);
