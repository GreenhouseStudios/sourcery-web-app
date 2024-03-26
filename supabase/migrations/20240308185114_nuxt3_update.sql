-- Add the "original title" column to the requests table
alter table "public"."requests" add column if not exists "original_title" text;

-- Alter the create_request_clients_vendors trigger to use the original title as the label, instead of the citation.
CREATE OR REPLACE FUNCTION "public"."create_request_clients_vendors"() RETURNS trigger
    LANGUAGE "plpgsql" SECURITY DEFINER
    AS $$
BEGIN
  INSERT INTO public.request_clients (request_id, label)
    VALUES (new.id, new.original_title)
    ON CONFLICT (request_id) DO NOTHING;
  INSERT INTO public.request_vendors (request_id, label)
    VALUES (new.id, new.original_title)
    ON CONFLICT (request_id) DO NOTHING;
  return new;
END;
$$;

drop trigger if exists create_client_vendor_on_request_create on public.requests;
create trigger create_client_vendor_on_request_create
  after insert on public.requests
  for each row execute procedure public.create_request_clients_vendors();


alter table "public"."attachments" add column if not exists "path" text;

-- Alter the sent_chat function to also update request_vendor/request_client with has_unread
CREATE OR REPLACE FUNCTION "public"."sent_chat"(request_id bigint, user_id uuid) RETURNS bigint
    LANGUAGE "plpgsql" SECURITY DEFINER
    AS $_$
DECLARE
  created_id int8;
  request public.requests%rowtype;
BEGIN
    SELECT * FROM public.requests INTO request WHERE id = $1;

    if request.user_id = $2 then
        UPDATE public.request_vendors pv
        SET has_unread = true
        WHERE pv.request_id = $1;
    else
        UPDATE public.request_clients pc
        SET has_unread = TRUE
        WHERE pc.request_id = $1;
    end if;

    INSERT INTO public.request_events (request_id, user_id, status_id, description)
    SELECT $1, $2, request.status_id, '%u initiated a chat.'
    WHERE NOT EXISTS(
        SELECT 1
        FROM public.request_events
        WHERE request_events.request_id = $1
        AND request_events.user_id = $2
        AND request_events.status_id = request.status_id
        AND request_events.description = '%u initiated a chat.'
        AND request_events.created_at >= NOW() - INTERVAL '5 minutes'
    ) RETURNING id into created_id;
    RETURN created_id;
END;
$_$;


CREATE OR REPLACE FUNCTION public.convert_request(prospective_request_id integer, repository_id integer)
 RETURNS SETOF requests
 LANGUAGE plpgsql
AS $function$
DECLARE
    rp RECORD;
    inserted_id INT;
BEGIN
    -- Get the prospective_request based on the passed parameter
    SELECT *
    INTO rp
    FROM requests_prospective
    WHERE id = prospective_request_id;

    INSERT INTO requests (repository_id, original_title, citation, pages, status_id, user_id)
    VALUES (repository_id, rp.title, rp.description, 0, 1, rp.user_id)
    RETURNING id INTO inserted_id;

    -- Return the inserted record
    UPDATE requests_prospective
    SET converted = TRUE
    WHERE id = prospective_request_id;

    RETURN query
    SELECT * FROM requests WHERE id = inserted_id;
END
$function$
;