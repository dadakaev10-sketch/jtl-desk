-- Enable Realtime for tickets and messages tables
-- Required for live updates without browser refresh

-- Set REPLICA IDENTITY FULL so Supabase Realtime can filter by column values
ALTER TABLE public.tickets REPLICA IDENTITY FULL;
ALTER TABLE public.messages REPLICA IDENTITY FULL;

-- Add tables to the supabase_realtime publication
ALTER PUBLICATION supabase_realtime ADD TABLE public.tickets;
ALTER PUBLICATION supabase_realtime ADD TABLE public.messages;
