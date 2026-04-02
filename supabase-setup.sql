-- ============================================
-- Jalankan di Supabase SQL Editor
-- ============================================

-- 1. Tabel products
CREATE TABLE IF NOT EXISTS products (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  price INTEGER NOT NULL,
  original_price INTEGER,
  category TEXT NOT NULL,
  colors TEXT[] DEFAULT '{}',
  image TEXT NOT NULL,
  images TEXT[] DEFAULT '{}',
  badge TEXT,
  material TEXT,
  cutting TEXT,
  feel TEXT,
  description TEXT,
  sizes TEXT[] DEFAULT '{}',
  rating DECIMAL(2,1) DEFAULT 5.0,
  reviews INTEGER DEFAULT 0,
  is_new BOOLEAN DEFAULT false,
  is_best_seller BOOLEAN DEFAULT false,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- 2. Tabel user_roles (extend Supabase Auth)
CREATE TABLE IF NOT EXISTS user_roles (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE NOT NULL,
  role TEXT DEFAULT 'user' CHECK (role IN ('user', 'admin')),
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 3. RLS (Row Level Security)
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_roles ENABLE ROW LEVEL SECURITY;

-- Products: semua bisa baca, hanya admin bisa write
CREATE POLICY "Anyone can read active products"
  ON products FOR SELECT
  USING (is_active = true);

CREATE POLICY "Admin can do everything on products"
  ON products FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM user_roles
      WHERE user_id = auth.uid() AND role = 'admin'
    )
  );

-- User roles: user bisa baca role sendiri
CREATE POLICY "Users can read own role"
  ON user_roles FOR SELECT
  USING (user_id = auth.uid());

CREATE POLICY "Admin can read all roles"
  ON user_roles FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM user_roles
      WHERE user_id = auth.uid() AND role = 'admin'
    )
  );

-- 4. Auto-create user_role saat register
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.user_roles (user_id, role)
  VALUES (NEW.id, 'user');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- 5. Sample products data
INSERT INTO products (name, price, original_price, category, colors, image, images, badge, material, cutting, feel, description, sizes, rating, reviews, is_best_seller) VALUES
(
  'Khimar Nida Premium',
  185000, 220000,
  'Khimar',
  ARRAY['Hitam', 'Navy', 'Abu-abu', 'Coklat'],
  'https://images.unsplash.com/photo-1594938298603-c8148c4b4357?w=600&q=80',
  ARRAY['https://images.unsplash.com/photo-1594938298603-c8148c4b4357?w=600&q=80'],
  'Best Seller',
  'Nida Premium', 'Syar''i A-Line', 'Adem, ringan, tidak transparan',
  'Khimar dengan bahan Nida Premium pilihan, cutting syar''i yang elegan dan nyaman dipakai seharian.',
  ARRAY['S','M','L','XL'],
  4.9, 234, true
),
(
  'Gamis Ceruti Flowy',
  320000, NULL,
  'Gamis',
  ARRAY['Dusty Pink', 'Sage Green', 'Cream', 'Lilac'],
  'https://images.unsplash.com/photo-1583391733956-6c78276477e2?w=600&q=80',
  ARRAY['https://images.unsplash.com/photo-1583391733956-6c78276477e2?w=600&q=80'],
  'New',
  'Ceruti Premium', 'Syar''i Flowy', 'Flowy, adem, jatuh sempurna',
  'Gamis ceruti dengan siluet flowy yang anggun. Bahan premium yang jatuh indah di tubuh.',
  ARRAY['S','M','L','XL','XXL'],
  4.8, 156, false
),
(
  'Hijab Segi Empat Voal',
  95000, NULL,
  'Hijab',
  ARRAY['Mocca', 'Hitam', 'Putih', 'Maroon', 'Olive'],
  'https://images.unsplash.com/photo-1607748862156-7c548e7e98f4?w=600&q=80',
  ARRAY['https://images.unsplash.com/photo-1607748862156-7c548e7e98f4?w=600&q=80'],
  NULL,
  'Voal Premium', 'Segi Empat 115x115cm', 'Lembut, tidak licin, mudah dibentuk',
  'Hijab segi empat voal premium dengan tekstur halus dan tidak mudah kusut.',
  ARRAY['One Size'],
  4.7, 412, true
),
(
  'Abaya Madinah Bordir',
  450000, 520000,
  'Abaya',
  ARRAY['Hitam', 'Navy'],
  'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&q=80',
  ARRAY['https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&q=80'],
  'Eksklusif',
  'Jetblack Premium', 'Syar''i Longline', 'Mewah, berat sempurna, tidak transparan',
  'Abaya dengan detail bordir tangan yang indah. Bahan jetblack premium yang tidak mudah kusut.',
  ARRAY['S','M','L','XL'],
  5.0, 89, true
);
