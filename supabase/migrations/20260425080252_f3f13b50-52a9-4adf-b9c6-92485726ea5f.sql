ALTER TABLE public.contact_submissions
  ADD CONSTRAINT contact_name_len CHECK (char_length(name) BETWEEN 1 AND 100),
  ADD CONSTRAINT contact_email_len CHECK (char_length(email) BETWEEN 3 AND 255),
  ADD CONSTRAINT contact_email_format CHECK (email ~* '^[^@\s]+@[^@\s]+\.[^@\s]+$'),
  ADD CONSTRAINT contact_message_len CHECK (char_length(message) BETWEEN 1 AND 2000),
  ADD CONSTRAINT contact_company_len CHECK (company IS NULL OR char_length(company) <= 150),
  ADD CONSTRAINT contact_phone_len CHECK (phone IS NULL OR char_length(phone) <= 40),
  ADD CONSTRAINT contact_country_len CHECK (country IS NULL OR char_length(country) <= 80),
  ADD CONSTRAINT contact_project_type_len CHECK (project_type IS NULL OR char_length(project_type) <= 80),
  ADD CONSTRAINT contact_locale_len CHECK (char_length(locale) BETWEEN 2 AND 5);