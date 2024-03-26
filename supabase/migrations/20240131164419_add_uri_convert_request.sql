alter table "public"."requests_prospective" add column if not exists "deleted" boolean default false;

set check_function_bodies = off;

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

    INSERT INTO requests (repository_id, citation, pages, status_id, user_id)
    VALUES (repository_id, rp.title, 0, 1, rp.user_id)
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

set check_function_bodies = on;
DROP POLICY IF EXISTS "Allow authenticated users to insert" ON "public"."requests_prospective";
create policy "Allow authenticated users to insert"
on "public"."requests_prospective"
as permissive
for insert
to authenticated
with check ((auth.role() = 'authenticated'::text));

DROP POLICY IF EXISTS "Allow full access for admin" ON "public"."requests_prospective";
create policy "Allow full access for admin"
on "public"."requests_prospective"
as permissive
for all
to authenticated
using ((auth.uid() IN ( SELECT "user".id
   FROM "user"
  WHERE ("user".admin = true))));

DROP POLICY IF EXISTS "Allow read for creator" ON "public"."requests_prospective";
create policy "Allow read for creator"
on "public"."requests_prospective"
as permissive
for select
to authenticated
using (((auth.uid() = user_id) AND (deleted = false)));



