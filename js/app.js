/**
 * Destinity vButler — Shared Application Utilities
 * Browns Hotels & Resorts
 * All pages include this file. No framework — pure ES6.
 */

const App = (() => {

  // ─── Storage ────────────────────────────────────────────────────────────────
  const storage = {
    get(key) {
      try { return JSON.parse(localStorage.getItem(key)); }
      catch { return null; }
    },
    set(key, value) {
      try { localStorage.setItem(key, JSON.stringify(value)); }
      catch (e) { console.warn('Storage set failed:', e); }
    },
    remove(key) { localStorage.removeItem(key); },
    session: {
      get(key) {
        try { return JSON.parse(sessionStorage.getItem(key)); }
        catch { return null; }
      },
      set(key, value) {
        try { sessionStorage.setItem(key, JSON.stringify(value)); }
        catch(e) { console.warn('Session storage set failed:', e); }
      },
      remove(key) { sessionStorage.removeItem(key); }
    }
  };

  // ─── Auth ────────────────────────────────────────────────────────────────────
  const auth = {
    isLoggedIn() {
      const session = storage.get('vb:session');
      if (!session) return false;
      if (session.expiresAt && Date.now() > session.expiresAt) {
        storage.remove('vb:session');
        return false;
      }
      return true;
    },
    getSession() { return storage.get('vb:session'); },
    getGuest() { return storage.get('vb:profile'); },
    createSession(guest, rememberMe = false) {
      const expiresAt = rememberMe
        ? Date.now() + 30 * 24 * 60 * 60 * 1000   // 30 days
        : Date.now() + 24 * 60 * 60 * 1000;          // 24 hours
      const session = { guestId: guest.id, email: guest.email, expiresAt };
      storage.set('vb:session', session);
      // Save profile
      const profile = storage.get('vb:profile') || {};
      storage.set('vb:profile', {
        ...profile,
        id: guest.id,
        email: guest.email,
        fullName: guest.fullName,
        firstName: guest.firstName,
        lastName: guest.lastName,
        phone: guest.phone || '',
        nationality: guest.nationality || '',
        photoBase64: profile.photoBase64 || null
      });
    },
    logout() {
      storage.remove('vb:session');
      window.location.href = 'login.html';
    },
    requireAuth() {
      if (!auth.isLoggedIn()) {
        window.location.href = 'login.html';
        return false;
      }
      return true;
    },
    async hashPassword(password) {
      const buf = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(password));
      return Array.from(new Uint8Array(buf)).map(b => b.toString(16).padStart(2, '0')).join('');
    }
  };

  // ─── Reservations ────────────────────────────────────────────────────────────
  const reservations = {
    getAll() { return storage.get('vb:reservations') || []; },
    getActive() {
      const id = storage.get('vb:activeReservation');
      const all = reservations.getAll();
      // If saved ID still points to a valid inhouse/confirmed reservation, use it
      if (id) {
        const saved = all.find(r => r.id === id && (r.status === 'inhouse' || r.status === 'confirmed'));
        if (saved) return saved;
      }
      // Auto-select: prefer inhouse first, then nearest confirmed upcoming
      const inhouse = all.find(r => r.status === 'inhouse');
      if (inhouse) return inhouse;
      const upcoming = all
        .filter(r => r.status === 'confirmed')
        .sort((a, b) => new Date(a.checkIn) - new Date(b.checkIn));
      return upcoming[0] || null;
    },
    canSetActive(res) {
      return res && (res.status === 'inhouse' || res.status === 'confirmed');
    },
    setActive(id) { storage.set('vb:activeReservation', id); },
    save(list) { storage.set('vb:reservations', list); },
    update(id, updates) {
      const all = reservations.getAll();
      const idx = all.findIndex(r => r.id === id);
      if (idx >= 0) { all[idx] = { ...all[idx], ...updates }; reservations.save(all); }
    }
  };

  // ─── Service Requests ────────────────────────────────────────────────────────
  const requests = {
    getAll(reservationId) {
      const all = storage.get('vb:requests') || [];
      return reservationId ? all.filter(r => r.reservationId === reservationId) : all;
    },
    add(req) {
      const all = storage.get('vb:requests') || [];
      const newReq = {
        ...req,
        id: 'REQ-' + Date.now(),
        createdAt: new Date().toISOString(),
        status: req.status || 'pending'
      };
      all.unshift(newReq);
      storage.set('vb:requests', all);
      notifications.add({
        type: 'request',
        title: 'Request Received',
        message: `Your request for "${req.serviceName}" has been received.`,
        icon: 'check_circle'
      });
      return newReq;
    },
    update(id, updates) {
      const all = storage.get('vb:requests') || [];
      const idx = all.findIndex(r => r.id === id);
      if (idx >= 0) { all[idx] = { ...all[idx], ...updates }; storage.set('vb:requests', all); }
    }
  };

  // ─── Complaints ──────────────────────────────────────────────────────────────
  const complaints = {
    getAll(reservationId) {
      const all = storage.get('vb:complaints') || [];
      return reservationId ? all.filter(c => c.reservationId === reservationId) : all;
    },
    add(complaint) {
      const all = storage.get('vb:complaints') || [];
      const ref = 'CMP-' + Date.now().toString(36).toUpperCase();
      const newComplaint = {
        ...complaint,
        id: ref,
        ref,
        createdAt: new Date().toISOString(),
        status: 'open',
        timeline: [
          { status: 'open', label: 'Complaint Received', timestamp: new Date().toISOString(), note: 'Your complaint has been logged and assigned.' }
        ]
      };
      all.unshift(newComplaint);
      storage.set('vb:complaints', all);
      notifications.add({
        type: 'complaint',
        title: 'Complaint Logged',
        message: `Reference: ${ref}. Our team will respond within 2 hours.`,
        icon: 'support_agent'
      });
      return newComplaint;
    },
    getById(id) {
      return (storage.get('vb:complaints') || []).find(c => c.id === id);
    }
  };

  // ─── Wishlist ─────────────────────────────────────────────────────────────────
  const wishlist = {
    get() { return storage.get('vb:wishlist') || []; },
    toggle(item) {
      const list = wishlist.get();
      const idx = list.findIndex(w => w.id === item.id && w.type === item.type);
      if (idx >= 0) {
        list.splice(idx, 1);
        storage.set('vb:wishlist', list);
        return false;
      } else {
        list.push({ ...item, savedAt: new Date().toISOString() });
        storage.set('vb:wishlist', list);
        return true;
      }
    },
    has(id, type) { return wishlist.get().some(w => w.id === id && w.type === type); }
  };

  // ─── Notifications ───────────────────────────────────────────────────────────
  const notifications = {
    getAll() { return storage.get('vb:notifications') || []; },
    getUnreadCount() { return notifications.getAll().filter(n => !n.read).length; },
    add(n) {
      const all = notifications.getAll();
      all.unshift({ ...n, id: 'NOTIF-' + Date.now(), read: false, timestamp: new Date().toISOString() });
      storage.set('vb:notifications', all.slice(0, 50)); // keep last 50
      // Update badge if present
      const badge = document.getElementById('notif-badge');
      if (badge) {
        const count = notifications.getUnreadCount();
        badge.textContent = count > 99 ? '99+' : count;
        badge.style.display = count > 0 ? 'flex' : 'none';
      }
    },
    markRead(id) {
      const all = notifications.getAll();
      const n = all.find(n => n.id === id);
      if (n) { n.read = true; storage.set('vb:notifications', all); }
    },
    markAllRead() {
      const all = notifications.getAll().map(n => ({ ...n, read: true }));
      storage.set('vb:notifications', all);
    }
  };

  // ─── Wake-Up Calls ───────────────────────────────────────────────────────────
  const wakeUpCalls = {
    getAll(reservationId) {
      const all = storage.get('vb:wakeupCalls') || [];
      return reservationId ? all.filter(w => w.reservationId === reservationId) : all;
    },
    add(call) {
      const all = storage.get('vb:wakeupCalls') || [];
      const newCall = { ...call, id: 'WKP-' + Date.now(), createdAt: new Date().toISOString(), status: 'scheduled' };
      all.unshift(newCall);
      storage.set('vb:wakeupCalls', all);
      notifications.add({ type: 'wakeup', title: 'Wake-Up Call Set', message: `Scheduled for ${call.time} on ${call.date}.`, icon: 'alarm' });
      return newCall;
    },
    cancel(id) {
      const all = storage.get('vb:wakeupCalls') || [];
      const idx = all.findIndex(w => w.id === id);
      if (idx >= 0) { all[idx].status = 'cancelled'; storage.set('vb:wakeupCalls', all); }
    }
  };

  // ─── Pre-Arrival ─────────────────────────────────────────────────────────────
  const preArrival = {
    get(reservationId) { return storage.get(`vb:preArrival:${reservationId}`) || {}; },
    save(reservationId, data) { storage.set(`vb:preArrival:${reservationId}`, data); }
  };

  // ─── Theme ────────────────────────────────────────────────────────────────────
  const theme = {
    get() { return storage.get('vb:theme') || 'light'; },
    apply() {
      const t = theme.get();
      document.documentElement.classList.toggle('dark', t === 'dark');
      const icon = document.getElementById('theme-toggle-icon');
      if (icon) icon.textContent = t === 'dark' ? 'light_mode' : 'dark_mode';
    },
    toggle() {
      const next = theme.get() === 'dark' ? 'light' : 'dark';
      storage.set('vb:theme', next);
      theme.apply();
    }
  };

  // ─── Toast ────────────────────────────────────────────────────────────────────
  const toast = {
    container: null,
    init() {
      if (!document.getElementById('toast-container')) {
        const el = document.createElement('div');
        el.id = 'toast-container';
        el.className = 'fixed top-4 right-4 z-50 flex flex-col gap-2 max-w-sm w-full pointer-events-none';
        document.body.appendChild(el);
        toast.container = el;
      } else {
        toast.container = document.getElementById('toast-container');
      }
    },
    show(message, type = 'info', duration = 3500) {
      if (!toast.container) toast.init();
      const colours = {
        success: 'bg-green-600',
        error:   'bg-red-600',
        warning: 'bg-amber-500',
        info:    'bg-[#003c52]'
      };
      const icons = { success: 'check_circle', error: 'error', warning: 'warning', info: 'info' };
      const el = document.createElement('div');
      el.className = `pointer-events-auto flex items-center gap-3 px-4 py-3 rounded-xl shadow-lg text-white text-sm font-medium ${colours[type] || colours.info} transform translate-y-2 opacity-0 transition-all duration-300`;
      el.innerHTML = `<span class="material-symbols-outlined text-base">${icons[type] || 'info'}</span><span>${message}</span>`;
      toast.container.appendChild(el);
      requestAnimationFrame(() => { el.classList.remove('translate-y-2', 'opacity-0'); });
      setTimeout(() => {
        el.classList.add('opacity-0', 'translate-y-2');
        setTimeout(() => el.remove(), 300);
      }, duration);
    }
  };

  // ─── Data Loader ─────────────────────────────────────────────────────────────
  const _cache = {};
  const data = {
    async load(path) {
      if (_cache[path]) return _cache[path];
      try {
        const res = await fetch(path);
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const json = await res.json();
        _cache[path] = json;
        return json;
      } catch(e) {
        console.error('Data load failed:', path, e);
        return null;
      }
    },
    async loadProperty(propertyId) { return data.load(`data/properties/${propertyId}.json`); },
    async loadChain()              { return data.load('data/chain.json'); },
    async loadGuests()             { return data.load('data/mock/guests.json'); },
    async loadReservations()       { return data.load('data/mock/reservations.json'); }
  };

  // ─── Header ───────────────────────────────────────────────────────────────────
  const header = {
    render(containerId = 'app-header') {
      const el = document.getElementById(containerId);
      if (!el) return;
      const profile = storage.get('vb:profile') || {};
      const activeRes = reservations.getActive();
      const propertyName = activeRes ? activeRes.propertyName : 'Browns Hotels & Resorts';
      const initials = profile.firstName && profile.lastName
        ? (profile.firstName[0] + profile.lastName[0]).toUpperCase()
        : (profile.fullName ? profile.fullName.split(' ').map(w => w[0]).join('').toUpperCase().slice(0,2) : 'G');
      const unread = notifications.getUnreadCount();

      el.innerHTML = `
        <header class="sticky top-0 z-40 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-700">
          <div class="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between gap-4">
            <div class="flex items-center gap-3 min-w-0">
              <a href="dashboard.html" class="flex items-center gap-2 shrink-0">
                <div class="w-8 h-8 rounded-lg bg-white flex items-center justify-center border border-slate-200 p-1">
                  <img src="assets/images/destinity-inspire.svg" alt="Destinity vButler" class="w-full h-full">
                </div>
              </a>
              <div class="min-w-0">
                <div class="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Destinity vButler</div>
                <div class="text-xs font-semibold text-[#003c52] dark:text-teal-400 truncate max-w-[180px]">${propertyName}</div>
              </div>
            </div>
            <div class="flex items-center gap-3">
              <button onclick="App.theme.toggle()" class="w-9 h-9 rounded-full flex items-center justify-center text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition" aria-label="Toggle theme">
                <span id="theme-toggle-icon" class="material-symbols-outlined text-xl">${theme.get() === 'dark' ? 'light_mode' : 'dark_mode'}</span>
              </button>
              <a href="notifications.html" class="relative w-9 h-9 rounded-full flex items-center justify-center text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition" aria-label="Notifications">
                <span class="material-symbols-outlined text-xl">notifications</span>
                <span id="notif-badge" class="${unread > 0 ? 'flex' : 'hidden'} absolute top-0.5 right-0.5 min-w-[16px] h-4 bg-red-500 text-white text-[10px] font-bold rounded-full items-center justify-center px-1">${unread > 99 ? '99+' : unread}</span>
              </a>
              <a href="profile.html" aria-label="My Profile">
                ${profile.photoBase64
                  ? `<img src="${profile.photoBase64}" alt="Profile" class="w-9 h-9 rounded-full object-cover border-2 border-[#003c52]/20">`
                  : `<div class="w-9 h-9 rounded-full bg-[#003c52] flex items-center justify-center text-white text-sm font-bold">${initials}</div>`
                }
              </a>
            </div>
          </div>
        </header>`;
    }
  };

  // ─── Bottom Nav (Mobile) ──────────────────────────────────────────────────────
  const bottomNav = {
    render(active = '') {
      const existing = document.getElementById('bottom-nav');
      if (existing) existing.remove();
      const nav = document.createElement('nav');
      nav.id = 'bottom-nav';
      nav.className = 'md:hidden fixed bottom-0 inset-x-0 z-40 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-700 safe-area-pb';
      const items = [
        { id: 'dashboard',     label: 'Home',     icon: 'home',          href: 'dashboard.html' },
        { id: 'services',      label: 'Services', icon: 'room_service',  href: 'services.html' },
        { id: 'dining',        label: 'Dining',   icon: 'restaurant',    href: 'dining.html' },
        { id: 'reservations',  label: 'My Stay',  icon: 'hotel',         href: 'reservations.html' },
        { id: 'profile',       label: 'Profile',  icon: 'person',        href: 'profile.html' }
      ];
      nav.innerHTML = `<div class="flex">${items.map(item => `
        <a href="${item.href}" class="flex-1 flex flex-col items-center justify-center py-2 gap-0.5 ${active === item.id ? 'text-[#003c52] dark:text-teal-400' : 'text-slate-500 dark:text-slate-400'} transition-colors">
          <span class="material-symbols-outlined text-2xl ${active === item.id ? 'fill-icon' : ''}">${item.icon}</span>
          <span class="text-[10px] font-semibold">${item.label}</span>
        </a>`).join('')}</div>`;
      document.body.appendChild(nav);
    }
  };

  // ─── Sidebar (Desktop) ────────────────────────────────────────────────────────
  const sidebar = {
    render(active = '') {
      const el = document.getElementById('app-sidebar');
      if (!el) return;
      const items = [
        { id: 'dashboard',      label: 'Dashboard',      icon: 'home',           href: 'dashboard.html' },
        { id: 'reservations',   label: 'My Reservations',icon: 'hotel',          href: 'reservations.html' },
        { id: 'pre-arrival',    label: 'Pre-Arrival',    icon: 'flight_land',    href: 'pre-arrival.html' },
        { id: 'services',       label: 'Services',       icon: 'room_service',   href: 'services.html' },
        { id: 'dining',         label: 'Dining & Bars',  icon: 'restaurant',     href: 'dining.html' },
        { id: 'wellness',       label: 'Wellness & Spa', icon: 'spa',            href: 'wellness.html' },
        { id: 'housekeeping',   label: 'Housekeeping',   icon: 'cleaning_services', href: 'housekeeping.html' },
        { id: 'transport',      label: 'Transport',      icon: 'directions_car', href: 'transport.html' },
        { id: 'wake-up',        label: 'Wake-Up Call',   icon: 'alarm',          href: 'wake-up.html' },
        { id: 'experiences',    label: 'Experiences',    icon: 'hiking',         href: 'experiences.html' },
        { id: 'local-explore',  label: 'Local Explore',  icon: 'explore',        href: 'local-explore.html' },
        { id: 'billing',        label: 'Billing',        icon: 'receipt_long',   href: 'billing.html' },
        { id: 'complaints',     label: 'Feedback',       icon: 'support_agent',  href: 'complaints.html' },
        { id: 'notifications',  label: 'Notifications',  icon: 'notifications',  href: 'notifications.html' }
      ];
      el.innerHTML = `
        <aside class="hidden md:flex flex-col w-72 min-h-screen bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-700">
          <div class="p-6 border-b border-slate-200 dark:border-slate-700">
            <a href="dashboard.html" class="flex items-center gap-3">
              <div class="w-10 h-10 rounded-xl bg-white flex items-center justify-center border border-slate-200 p-1.5">
                <img src="assets/images/destinity-inspire.svg" alt="Destinity vButler" class="w-full h-full">
              </div>
              <div>
                <div class="font-bold text-slate-900 dark:text-white text-sm">Destinity vButler</div>
                <div class="text-xs text-slate-500 dark:text-slate-400">Browns Hotels & Resorts</div>
              </div>
            </a>
          </div>
          <nav class="flex-1 overflow-y-auto p-4 space-y-1">
            ${items.map(item => `
            <a href="${item.href}" class="flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${active === item.id
              ? 'bg-[#003c52]/10 text-[#003c52] dark:bg-teal-900/30 dark:text-teal-400'
              : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white'}">
              <span class="material-symbols-outlined text-xl">${item.icon}</span>
              ${item.label}
            </a>`).join('')}
          </nav>
          <div class="p-4 border-t border-slate-200 dark:border-slate-700">
            <button onclick="App.auth.logout()" class="flex items-center gap-3 w-full px-4 py-3 rounded-lg text-sm font-medium text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 transition">
              <span class="material-symbols-outlined text-xl">logout</span>
              Sign Out
            </button>
          </div>
        </aside>`;
    }
  };

  // ─── Helpers ─────────────────────────────────────────────────────────────────
  const helpers = {
    formatDate(dateStr) {
      if (!dateStr) return '';
      return new Date(dateStr).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
    },
    formatDateTime(isoStr) {
      if (!isoStr) return '';
      return new Date(isoStr).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' });
    },
    formatCurrency(amount, symbol = 'Rs.') {
      return `${symbol} ${Math.abs(amount).toLocaleString('en-US')}`;
    },
    timeAgo(isoStr) {
      const diff = Date.now() - new Date(isoStr).getTime();
      const mins = Math.floor(diff / 60000);
      if (mins < 1)  return 'just now';
      if (mins < 60) return `${mins}m ago`;
      const hrs = Math.floor(mins / 60);
      if (hrs < 24)  return `${hrs}h ago`;
      return `${Math.floor(hrs / 24)}d ago`;
    },
    stayCountdown(checkInStr) {
      const diff = new Date(checkInStr).getTime() - Date.now();
      if (diff <= 0) return 'Checked in';
      const days = Math.ceil(diff / 86400000);
      return days === 1 ? 'Tomorrow' : `in ${days} days`;
    },
    statusBadge(status) {
      const map = {
        pending:     { bg: 'bg-amber-50  dark:bg-amber-900/20',  text: 'text-amber-700  dark:text-amber-400',  label: 'Pending' },
        confirmed:   { bg: 'bg-blue-50   dark:bg-blue-900/20',   text: 'text-blue-700   dark:text-blue-400',   label: 'Confirmed' },
        tentative:   { bg: 'bg-purple-50 dark:bg-purple-900/20', text: 'text-purple-700 dark:text-purple-400', label: 'Tentative' },
        inhouse:     { bg: 'bg-teal-50   dark:bg-teal-900/20',   text: 'text-teal-700   dark:text-teal-400',   label: 'In House' },
        checked_out: { bg: 'bg-slate-100 dark:bg-slate-800',     text: 'text-slate-600  dark:text-slate-400',  label: 'Checked Out' },
        canceled:    { bg: 'bg-red-50    dark:bg-red-900/20',    text: 'text-red-600    dark:text-red-400',    label: 'Canceled' },
        inprogress:  { bg: 'bg-blue-50   dark:bg-blue-900/20',   text: 'text-blue-700   dark:text-blue-400',   label: 'In Progress' },
        completed:   { bg: 'bg-green-50  dark:bg-green-900/20',  text: 'text-green-700  dark:text-green-400',  label: 'Completed' },
        cancelled:   { bg: 'bg-slate-100 dark:bg-slate-800',     text: 'text-slate-600  dark:text-slate-400',  label: 'Cancelled' },
        open:        { bg: 'bg-red-50    dark:bg-red-900/20',    text: 'text-red-700    dark:text-red-400',    label: 'Open' },
        resolved:    { bg: 'bg-green-50  dark:bg-green-900/20',  text: 'text-green-700  dark:text-green-400',  label: 'Resolved' },
        upcoming:    { bg: 'bg-blue-50   dark:bg-blue-900/20',   text: 'text-blue-700   dark:text-blue-400',   label: 'Upcoming' },
        active:      { bg: 'bg-green-50  dark:bg-green-900/20',  text: 'text-green-700  dark:text-green-400',  label: 'Active' },
        scheduled:   { bg: 'bg-teal-50   dark:bg-teal-900/20',   text: 'text-teal-700   dark:text-teal-400',   label: 'Scheduled' }
      };
      const s = map[status] || map.pending;
      return `<span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${s.bg} ${s.text}">${s.label}</span>`;
    },
    generateId(prefix = 'ID') {
      return `${prefix}-${Date.now().toString(36).toUpperCase()}`;
    },
    debounce(fn, ms = 300) {
      let t;
      return (...args) => { clearTimeout(t); t = setTimeout(() => fn(...args), ms); };
    }
  };

  // ─── Init ─────────────────────────────────────────────────────────────────────
  function init() {
    theme.apply();
    toast.init();
    document.documentElement.style.overflowX = 'hidden';
  }

  // Run on load
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  return { storage, auth, reservations, requests, complaints, wishlist, notifications, wakeUpCalls, preArrival, theme, toast, data, header, bottomNav, sidebar, helpers };

})();

window.App = App;
