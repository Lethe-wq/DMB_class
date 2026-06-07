const fs = require('node:fs');
const path = require('node:path');
const test = require('node:test');
const assert = require('node:assert/strict');

const root = path.resolve(__dirname, '..');
const read = (file) => fs.readFileSync(path.join(root, file), 'utf8');

test('registration page keeps API field names inside the redesigned layout', () => {
    const html = read('index.html');

    assert.match(html, /class="page page-register"/);
    assert.match(html, /class="site-header"/);
    assert.match(html, /class="register-layout"/);
    assert.match(html, /id="registerForm"/);

    for (const field of [
        'username',
        'psw',
        'repsw',
        'gender',
        'hobby[]',
        'year',
        'month',
        'day',
        'avatar',
        'message'
    ]) {
        assert.match(html, new RegExp(`name="${field.replace('[]', '\\[\\]')}"`));
    }
});

test('registration avatar uses a CSS preview instead of missing image files', () => {
    const html = read('index.html');
    const js = read('js/register.js');

    assert.match(html, /id="avatarImg"[^>]*class="avatar-preview/);
    assert.doesNotMatch(html, /<img[^>]+id="avatarImg"/);
    assert.match(js, /avatarOptions/);
    assert.doesNotMatch(js, /avatar['"]?\s*\+\s*this\.value\s*\+\s*['"]\.png/);
});

test('member page exposes accessible status and modal structure', () => {
    const html = read('members.html');

    assert.match(html, /class="page page-members"/);
    assert.match(html, /class="table-shell"/);
    assert.match(html, /id="loading"[^>]*role="status"/);
    assert.match(html, /id="editModal"[^>]*role="dialog"[^>]*aria-modal="true"/);
    assert.match(html, /id="addModal"[^>]*role="dialog"[^>]*aria-modal="true"/);
});

test('member renderer adds mobile labels while preserving HTML escaping', () => {
    const js = read('js/members.js');

    assert.match(js, /data-label/);
    assert.match(js, /escapeHtml\(user\.username\)/);
    assert.match(js, /escapeHtml\(user\.remark\)/);
    assert.match(js, /class="edit-link"/);
    assert.match(js, /class="delete-link"/);
});

test('member modals expose keyboard and accessibility state handling', () => {
    const js = read('js/members.js');

    assert.match(js, /setModalVisibility/);
    assert.match(js, /aria-hidden/);
    assert.match(js, /keydown/);
    assert.match(js, /Escape/);
});

test('shared styles include responsive cards, focus visibility, and reduced motion', () => {
    const css = read('css/style.css');

    assert.match(css, /--color-accent:/);
    assert.match(css, /:focus-visible/);
    assert.match(css, /@media\s*\(max-width:\s*760px\)/);
    assert.match(css, /#memberTable td::before/);
    assert.match(css, /@media\s*\(prefers-reduced-motion:\s*reduce\)/);
});
