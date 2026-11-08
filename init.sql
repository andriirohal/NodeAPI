CREATE TABLE IF NOT EXISTS products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(), 
  name TEXT NOT NULL,
  price NUMERIC(10, 2) NOT NULL CHECK (price > 0),
  stock INTEGER NOT NULL CHECK (stock >= 0),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

  CONSTRAINT users_name_unique UNIQUE (name),

  CONSTRAINT users_name_check CHECK (
    char_length(name) > 0 AND name = TRIM(name)
  )
);

CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  password TEXT NOT NULL,
  role TEXT NOT NULL DEFAULT 'user',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  refresh_token TEXT,

  CONSTRAINT users_name_check CHECK (
    char_length(name) > 0 AND name = TRIM(name)
  ),

  CONSTRAINT users_email_unique UNIQUE (email),

  CONSTRAINT users_email_check CHECK (
    char_length(email) > 0 AND email = TRIM(email)
  ),

  CONSTRAINT users_password_check CHECK (
    char_length(password) BETWEEN 8 AND 100
  ),

  CONSTRAINT users_role_check CHECK (
    role IN ('user', 'admin')
  )
);