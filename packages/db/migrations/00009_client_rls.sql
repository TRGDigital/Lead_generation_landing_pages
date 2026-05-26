-- ── Client read policies ──────────────────────────────────────────────────────

create policy "clients read own homes" on care_homes
  for select using (
    exists (
      select 1 from care_home_users
      where care_home_users.user_id      = auth.uid()
        and care_home_users.care_home_id = care_homes.id
    )
  );

create policy "clients read own leads" on leads
  for select using (
    exists (
      select 1 from care_home_users
      where care_home_users.user_id      = auth.uid()
        and care_home_users.care_home_id = leads.care_home_id
    )
  );

create policy "clients read own lead activities" on lead_activities
  for select using (
    exists (
      select 1 from leads
      join care_home_users
        on care_home_users.care_home_id = leads.care_home_id
      where leads.id                = lead_activities.lead_id
        and care_home_users.user_id = auth.uid()
    )
  );

-- ── SECURITY DEFINER functions ────────────────────────────────────────────────

create or replace function client_update_campaign(
  p_care_home_id uuid,
  p_is_active    boolean,
  p_bed_target   int
) returns void language plpgsql security definer as $$
begin
  if not exists (
    select 1 from care_home_users
    where user_id = auth.uid() and care_home_id = p_care_home_id
  ) then raise exception 'Forbidden'; end if;

  update care_homes
  set is_active  = p_is_active,
      bed_target = p_bed_target,
      updated_at = now()
  where id = p_care_home_id;
end;
$$;

create or replace function client_update_lead_status(
  p_lead_id uuid,
  p_status  text,
  p_note    text default null
) returns void language plpgsql security definer as $$
declare
  v_home_id    uuid;
  v_old_status text;
begin
  select care_home_id, status into v_home_id, v_old_status
  from leads where id = p_lead_id;

  if not exists (
    select 1 from care_home_users
    where user_id = auth.uid() and care_home_id = v_home_id
  ) then raise exception 'Forbidden'; end if;

  update leads set
    status              = case when p_status::text is not null then p_status else status end,
    contacted_at        = case when p_status = 'contacted'      and contacted_at      is null then now() else contacted_at      end,
    tour_booked_at      = case when p_status = 'tour_booked'    and tour_booked_at    is null then now() else tour_booked_at    end,
    tour_completed_at   = case when p_status = 'tour_completed' and tour_completed_at is null then now() else tour_completed_at end,
    assessed_at         = case when p_status = 'assessed'       and assessed_at       is null then now() else assessed_at       end,
    closed_at           = case when p_status in ('moved_in','lost') and closed_at     is null then now() else closed_at         end
  where id = p_lead_id;

  insert into lead_activities (lead_id, type, old_value, new_value, note, performed_by)
  values (p_lead_id, 'status_change', v_old_status, p_status, p_note, auth.uid());
end;
$$;

create or replace function client_qualify_lead(
  p_lead_id                 uuid,
  p_qualified               boolean,
  p_disqualification_reason text default null,
  p_disqualification_notes  text default null
) returns void language plpgsql security definer as $$
declare
  v_home_id uuid;
begin
  select care_home_id into v_home_id from leads where id = p_lead_id;

  if not exists (
    select 1 from care_home_users
    where user_id = auth.uid() and care_home_id = v_home_id
  ) then raise exception 'Forbidden'; end if;

  update leads set
    qualified               = p_qualified,
    disqualification_reason = p_disqualification_reason,
    disqualification_notes  = p_disqualification_notes
  where id = p_lead_id;

  insert into lead_activities (lead_id, type, new_value, note, performed_by)
  values (
    p_lead_id,
    case when p_qualified then 'qualified' else 'disqualified' end,
    p_disqualification_reason,
    p_disqualification_notes,
    auth.uid()
  );
end;
$$;

create or replace function client_save_note(
  p_lead_id uuid,
  p_note    text
) returns void language plpgsql security definer as $$
declare
  v_home_id uuid;
begin
  select care_home_id into v_home_id from leads where id = p_lead_id;

  if not exists (
    select 1 from care_home_users
    where user_id = auth.uid() and care_home_id = v_home_id
  ) then raise exception 'Forbidden'; end if;

  update leads set notes = p_note where id = p_lead_id;

  insert into lead_activities (lead_id, type, note, performed_by)
  values (p_lead_id, 'note_added', p_note, auth.uid());
end;
$$;
