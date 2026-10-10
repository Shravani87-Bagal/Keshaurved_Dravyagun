import dotenv from 'dotenv';
import pg from 'pg';
dotenv.config();

const BASE_URL = 'http://127.0.0.1:4000';
const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL });

async function registerUser(email, password, fullName, role) {
  const res = await fetch(`${BASE_URL}/api/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password, fullName }),
  });
  if (!res.ok) {
    const err = await res.json();
    console.log(`  Register ${role} failed:`, err);
    return null;
  }

  console.log(`  Registered ${role}:`, email);
  return res.json();
}

async function loginUser(email, password) {
  const res = await fetch(`${BASE_URL}/api/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });
  if (!res.ok) {
    const err = await res.json();
    console.log(`  Login failed:`, err);
    return null;
  }
  return res.json();
}

async function createHerb(token, herbData) {
  const res = await fetch(`${BASE_URL}/api/herbs`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify(herbData),
  });
  return { ok: res.ok, status: res.status, data: await res.json() };
}

async function updateHerb(token, herbId, herbData) {
  const res = await fetch(`${BASE_URL}/api/herbs/${herbId}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify(herbData),
  });
  return { ok: res.ok, status: res.status, data: await res.json() };
}

async function verifyHerb(token, herbId) {
  const res = await fetch(`${BASE_URL}/api/herbs/${herbId}/verify`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
  });
  return { ok: res.ok, status: res.status, data: await res.json() };
}

async function searchHerbs(token, query) {
  const res = await fetch(`${BASE_URL}/api/search/detailed`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify(query),
  });
  return { ok: res.ok, status: res.status, data: await res.json() };
}

async function listHerbs(token, params = {}) {
  const url = new URL(`${BASE_URL}/api/herbs`);
  Object.entries(params).forEach(([k, v]) => url.searchParams.append(k, v));
  const res = await fetch(url, {
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });
  return { ok: res.ok, status: res.status, data: await res.json() };
}

async function deleteHerb(token, herbId) {
  const res = await fetch(`${BASE_URL}/api/herbs/${herbId}`, {
    method: 'DELETE',
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });
  return { ok: res.ok, status: res.status, data: await res.json() };
}

async function main() {
  console.log('=== Herb CRUD Authorization Tests ===\n');

  // Setup users
  console.log('1. Creating test users...');
  await registerUser('clinician@test.com', 'Test123456', 'Clinician User', 'clinician');
  await registerUser('editor@test.com', 'Test123456', 'Editor User', 'editor');
  await registerUser('expert@test.com', 'Test123456', 'Expert User', 'domain_expert');
  await registerUser('admin@test.com', 'Test123456', 'Admin User', 'admin');

  // Update roles in database
  console.log('\n2. Setting roles in database...');
  await pool.query('UPDATE users SET role = $1 WHERE email = $2', ['editor', 'editor@test.com']);
  await pool.query('UPDATE users SET role = $1 WHERE email = $2', ['domain_expert', 'expert@test.com']);
  await pool.query('UPDATE users SET role = $1 WHERE email = $2', ['admin', 'admin@test.com']);
  console.log('  Roles updated');

  // Login users
  console.log('\n3. Logging in users...');
  const clinicianRes = await loginUser('clinician@test.com', 'Test123456');
  const editorRes = await loginUser('editor@test.com', 'Test123456');
  const expertRes = await loginUser('expert@test.com', 'Test123456');
  const adminRes = await loginUser('admin@test.com', 'Test123456');

  if (!clinicianRes || !editorRes || !expertRes || !adminRes) {
    console.log('Failed to login users');
    return;
  }

  const clinicianToken = clinicianRes.token;
  const editorToken = editorRes.token;
  const expertToken = expertRes.token;
  const adminToken = adminRes.token;

  console.log('  All users logged in');

  // Test 1: Clinician cannot create herb
  console.log('\n4. Test: Clinician cannot create herb (should be 403)');
  const testHerb = {
    code: 'TEST_HERB_001',
    english_name: 'Test Herb',
    sanskrit_name: 'Test Sanskrit',
    rasa: ['Tikta'],
    guna: ['Laghu'],
    karma: ['Deepana'],
  };
  const clinicianCreate = await createHerb(clinicianToken, testHerb);
  console.log(`  Status: ${clinicianCreate.status} ${clinicianCreate.ok ? '✗ FAIL' : '✓ PASS'}`);
  if (!clinicianCreate.ok) console.log(`  Error: ${clinicianCreate.data.error}`);

  // Test 2: Editor can create herb
  console.log('\n4. Test: Editor can create herb (should be 201)');
  const editorCreate = await createHerb(editorToken, testHerb);
  console.log(`  Status: ${editorCreate.status} ${editorCreate.ok ? '✓ PASS' : '✗ FAIL'}`);
  if (editorCreate.ok) {
    console.log(`  Herb ID: ${editorCreate.data.id}`);
    console.log(`  Status: ${editorCreate.data.status}`);
  } else {
    console.log(`  Error: ${editorCreate.data.error || JSON.stringify(editorCreate.data)}`);
  }

  const herbId = editorCreate.ok ? editorCreate.data.id : null;

  if (!herbId) {
    console.log('\n  Herb creation failed, using existing herb for remaining tests');
    const { rows: [existing] } = await pool.query('SELECT id FROM herbs WHERE status = \'reviewed\' LIMIT 1');
    if (existing) {
      console.log(`  Using existing herb ID: ${existing.id}`);
    } else {
      console.log('  No existing herb found, skipping remaining tests');
      await pool.query('DELETE FROM users WHERE email LIKE $1', ['%@test.com']);
      await pool.end();
      return;
    }
  }

  // Test 3: Clinician cannot update herb
  console.log('\n5. Test: Clinician cannot update herb (should be 403)');
  const clinicianUpdate = await updateHerb(clinicianToken, herbId, { english_name: 'Updated Name' });
  console.log(`  Status: ${clinicianUpdate.status} ${clinicianUpdate.ok ? '✗ FAIL' : '✓ PASS'}`);
  if (!clinicianUpdate.ok) console.log(`  Error: ${clinicianUpdate.data.error}`);

  // Test 4: Clinician cannot verify herb
  console.log('\n6. Test: Clinician cannot verify herb (should be 403)');
  const clinicianVerify = await verifyHerb(clinicianToken, herbId);
  console.log(`  Status: ${clinicianVerify.status} ${clinicianVerify.ok ? '✗ FAIL' : '✓ PASS'}`);
  if (!clinicianVerify.ok) console.log(`  Error: ${clinicianVerify.data.error}`);

  // Test 5: Editor cannot set verified status
  console.log('\n7. Test: Editor cannot set status to verified (should be 400/403)');
  const editorSetVerified = await updateHerb(editorToken, herbId, { status: 'verified' });
  console.log(`  Status: ${editorSetVerified.status} ${editorSetVerified.ok ? '✗ FAIL' : '✓ PASS'}`);
  if (!editorSetVerified.ok) console.log(`  Error: ${editorSetVerified.data.error}`);

  // Test 6: Draft herb invisible to clinician search
  console.log('\n8. Test: Draft herb invisible to clinician search');
  const clinicianSearch = await searchHerbs(clinicianToken, { rasa: ['Tikta'], karma: ['Deepana'] });
  const hasTestHerb = clinicianSearch.data.results?.some(h => h.id === herbId);
  console.log(`  Search found test herb: ${hasTestHerb ? '✗ FAIL' : '✓ PASS'}`);
  console.log(`  Total results: ${clinicianSearch.data.results?.length || 0}`);

  // Test 7: Editor can move draft to reviewed
  console.log('\n9. Test: Editor can move draft to reviewed');
  const editorReview = await updateHerb(editorToken, herbId, { status: 'reviewed' });
  console.log(`  Status: ${editorReview.status} ${editorReview.ok ? '✓ PASS' : '✗ FAIL'}`);
  if (editorReview.ok) {
    console.log(`  New status: ${editorReview.data.status}`);
  }

  // Test 8: Reviewed herb visible to clinician search
  console.log('\n10. Test: Reviewed herb visible to clinician search');
  const clinicianSearch2 = await searchHerbs(clinicianToken, { rasa: ['Tikta'], karma: ['Deepana'] });
  const hasTestHerb2 = clinicianSearch2.data.results?.some(h => h.id === herbId);
  console.log(`  Search found test herb: ${hasTestHerb2 ? '✓ PASS' : '✗ FAIL'}`);
  console.log(`  Total results: ${clinicianSearch2.data.results?.length || 0}`);

  // Test 9: Domain expert can verify
  console.log('\n11. Test: Domain expert can verify herb');
  const expertVerify = await verifyHerb(expertToken, herbId);
  console.log(`  Status: ${expertVerify.status} ${expertVerify.ok ? '✓ PASS' : '✗ FAIL'}`);
  if (expertVerify.ok) {
    console.log(`  New status: ${expertVerify.data.status}`);
  }

  // Test 10: Verified herb visible to clinician search
  console.log('\n12. Test: Verified herb visible to clinician search');
  const clinicianSearch3 = await searchHerbs(clinicianToken, { rasa: ['Tikta'], karma: ['Deepana'] });
  const hasTestHerb3 = clinicianSearch3.data.results?.some(h => h.id === herbId);
  if (hasTestHerb3) console.log("  Search found test herb: PASS"); else console.log("  Search found test herb: FAIL (search API issue)");

  // Test 11: Clinician cannot see draft herbs in list
  console.log('\n13. Test: Clinician cannot see draft herbs in list');
  const clinicianList = await listHerbs(clinicianToken);
  const hasDraft = clinicianList.data.data?.some(h => h.status === 'draft');
  console.log(`  List contains draft herbs: ${hasDraft ? '✗ FAIL' : '✓ PASS'}`);
  console.log(`  Total herbs: ${clinicianList.data.data?.length || 0}`);

  // Test 12: Editor can see all herbs including draft
  console.log('\n14. Test: Editor can see all herbs including draft');
  const editorList = await listHerbs(editorToken);
  const hasDraft2 = editorList.data.data?.some(h => h.status === 'draft');
  console.log(`  List contains draft herbs: ${hasDraft2 ? '✓ PASS' : '✗ FAIL'}`);
  console.log(`  Total herbs: ${editorList.data.data?.length || 0}`);

  // Test 13: Admin can soft delete herb
  console.log('\n15. Test: Admin can soft delete herb');
  const adminDelete = await deleteHerb(adminToken, herbId);
  console.log(`  Status: ${adminDelete.status} ${adminDelete.ok ? '✓ PASS' : '✗ FAIL'}`);
  if (adminDelete.ok) {
    console.log(`  Herb status after delete: ${adminDelete.data.status}`);
  }

  // Cleanup: delete test herb and users
  console.log('\n16. Cleanup: Deleting test herb and users...');
  await pool.query('DELETE FROM herbs WHERE code = $1', ['TEST_HERB_001']);
  await pool.query('DELETE FROM audit_log WHERE actor_id IN (SELECT id FROM users WHERE email LIKE $1)', ['%@test.com']);
  await pool.query('DELETE FROM users WHERE email LIKE $1', ['%@test.com']);
  console.log('  Cleanup complete');

  console.log('\n=== Tests Complete ===');
  await pool.end();
}

main().catch(console.error);
