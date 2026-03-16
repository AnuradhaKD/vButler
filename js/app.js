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
      // Save full profile — preserve any photo the guest has already uploaded
      const existing = storage.get('vb:profile') || {};
      storage.set('vb:profile', {
        id: guest.id,
        email: guest.email,
        fullName: guest.fullName,
        firstName: guest.firstName,
        lastName: guest.lastName,
        phone: guest.phone || '',
        nationality: guest.nationality || '',
        passportNumber: guest.passportNumber || '',
        dateOfBirth: guest.dateOfBirth || '',
        gender: guest.gender || '',
        languagePreference: guest.languagePreference || 'en',
        loyaltyProgram: guest.loyaltyProgram || null,
        preferences: guest.preferences || {},
        dietaryRequirements: guest.dietaryRequirements || {},
        communicationPreferences: guest.communicationPreferences || {},
        emergencyContact: guest.emergencyContact || {},
        memberSince: guest.memberSince || '',
        photoBase64: existing.photoBase64 || null   // keep any uploaded photo
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
      return res && (res.status === 'inhouse' || res.status === 'confirmed' || res.status === 'checked_out');
    },
    setActive(id) { storage.set('vb:activeReservation', id); },
    // Call on any service page — redirects to reservation selection if nothing is active
    requireReservation() {
      if (!reservations.getActive()) {
        const from = encodeURIComponent(window.location.pathname.split('/').pop());
        window.location.href = 'reservations.html?select=1&from=' + from;
        return false;
      }
      return true;
    },
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

  // ─── Confirm Dialog ──────────────────────────────────────────────────────────
  const confirm = {
    show({ title, message, items = [], confirmText = 'Confirm', onConfirm }) {
      const existing = document.getElementById('vb-confirm-modal');
      if (existing) existing.remove();
      const modal = document.createElement('div');
      modal.id = 'vb-confirm-modal';
      modal.className = 'fixed inset-0 z-[200] flex items-end md:items-center justify-center p-4';
      const itemsHtml = items.length
        ? `<div class="bg-slate-50 dark:bg-slate-800 rounded-xl p-3 mb-4 space-y-1.5">${items.map(i =>
            `<div class="flex items-start gap-2 text-xs"><span class="font-semibold text-slate-500 dark:text-slate-400 shrink-0 w-28">${i.label}:</span><span class="text-slate-700 dark:text-slate-300">${i.value}</span></div>`
          ).join('')}</div>` : '';
      modal.innerHTML = `
        <div class="absolute inset-0 bg-black/50" onclick="App.confirm.close()"></div>
        <div class="relative bg-white dark:bg-slate-900 rounded-2xl shadow-2xl w-full max-w-sm p-6 z-10">
          <div class="flex items-start gap-3 mb-4">
            <div class="w-10 h-10 rounded-xl bg-[#003c52]/10 dark:bg-teal-900/20 flex items-center justify-center shrink-0">
              <span class="material-symbols-outlined text-xl text-[#003c52] dark:text-teal-400">help</span>
            </div>
            <div>
              <h3 class="font-bold text-slate-900 dark:text-white">${title}</h3>
              <p class="text-sm text-slate-500 dark:text-slate-400 mt-0.5">${message}</p>
            </div>
          </div>
          ${itemsHtml}
          <div class="flex gap-3">
            <button onclick="App.confirm.close()" class="flex-1 border border-slate-200 dark:border-slate-600 text-slate-700 dark:text-slate-300 rounded-xl px-4 py-2.5 font-semibold hover:bg-slate-50 dark:hover:bg-slate-800 transition text-sm">Cancel</button>
            <button id="vb-confirm-btn" class="flex-1 bg-[#003c52] text-white rounded-xl px-4 py-2.5 font-semibold hover:bg-[#004f6e] transition text-sm">${confirmText}</button>
          </div>
        </div>`;
      document.body.appendChild(modal);
      document.getElementById('vb-confirm-btn').onclick = () => { App.confirm.close(); onConfirm(); };
    },
    close() { const el = document.getElementById('vb-confirm-modal'); if (el) el.remove(); }
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
    async loadProperty(propertyId) {
      // Resolve dataFile from chain manifest (supports custom file names)
      try {
        const chainData = await data.loadChain();
        const prop = chainData?.properties?.find(p => p.id === propertyId);
        if (prop?.dataFile) return data.load(`data/properties/${prop.dataFile}`);
      } catch(e) { /* fall through */ }
      return data.load(`data/properties/${propertyId}.json`);
    },
    // Returns just the property summary from chain.json — no full property file loaded
    async loadPropertySummary(propertyId) {
      const chainData = await data.loadChain();
      return chainData?.properties?.find(p => p.id === propertyId) || null;
    },
    // Merge chain feature flags with property-level overrides
    async loadFeatureFlags(propertyId) {
      const chainData = await data.loadChain();
      const chainFlags = chainData?.featureFlags || {};
      const propFlags  = chainData?.properties?.find(p => p.id === propertyId)?.featureFlags || {};
      return { ...chainFlags, ...propFlags };
    },
    async loadChain()           { return data.load('data/chain.json'); },
    async loadGuests()          { return data.load('data/mock/guests.json'); },
    async loadReservations()    { return data.load('data/mock/reservations.json'); },
    async loadServiceRequests() { return data.load('data/mock/service-requests.json'); },
    async loadComplaints()      { return data.load('data/mock/complaints.json'); },
    async loadWakeUpCalls()     { return data.load('data/mock/wake-up-calls.json'); },
    async loadNotifications()   { return data.load('data/mock/notifications.json'); },
    async loadPreArrivals()     { return data.load('data/mock/pre-arrival.json'); },

    // Seed all localStorage data from JSON files for a given guest.
    // Each key is only seeded if it does not already exist in localStorage,
    // so live guest actions are never overwritten.
    async seed(guestEmail) {
      try {
        // Reservations
        if (!(storage.get('vb:reservations') || []).length) {
          const d = await data.loadReservations();
          if (d) {
            const guestRes = d.reservations.filter(r => r.guestEmail === guestEmail);
            reservations.save(guestRes);
          }
        }

        // Service requests
        if (!(storage.get('vb:requests') || []).length) {
          const d = await data.loadServiceRequests();
          if (d) {
            const items = d.requests.filter(r => r.guestEmail === guestEmail);
            storage.set('vb:requests', items);
          }
        }

        // Complaints
        if (!(storage.get('vb:complaints') || []).length) {
          const d = await data.loadComplaints();
          if (d) {
            const items = d.complaints.filter(c => c.guestEmail === guestEmail);
            storage.set('vb:complaints', items);
          }
        }

        // Wake-up calls
        if (!(storage.get('vb:wakeupCalls') || []).length) {
          const d = await data.loadWakeUpCalls();
          if (d) {
            const items = d.wakeUpCalls.filter(w => w.guestEmail === guestEmail);
            storage.set('vb:wakeupCalls', items);
          }
        }

        // Notifications
        if (!(storage.get('vb:notifications') || []).length) {
          const d = await data.loadNotifications();
          if (d) {
            const items = d.notifications.filter(n => n.guestEmail === guestEmail);
            storage.set('vb:notifications', items);
          }
        }

        // Pre-arrival data (stored per reservationId)
        const d = await data.loadPreArrivals();
        if (d) {
          d.preArrivals
            .filter(p => p.guestEmail === guestEmail)
            .forEach(p => {
              const key = `vb:preArrival:${p.reservationId}`;
              if (!storage.get(key)) storage.set(key, p.data);
            });
        }

      } catch(e) {
        console.warn('Data seeding partial failure:', e);
      }
    }
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
        <header class="z-40 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-700">
          <div class="px-4 h-16 flex items-center justify-between gap-4">
            <div class="flex items-center gap-3 min-w-0 shrink-0 transition-all duration-250" id="header-brand-block">
              <button onclick="App.sidebar.toggleMenu()" class="w-9 h-9 rounded-full flex items-center justify-center text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition shrink-0" aria-label="Toggle menu">
                <span class="material-symbols-outlined text-[22px]">menu</span>
              </button>
              <a href="dashboard.html" class="flex items-center gap-2 shrink-0 sidebar-brand-logo${storage.get('vb:sidebarCollapsed') ? ' sidebar-brand-hidden' : ''}">
                <div class="w-8 h-8 rounded-lg bg-white flex items-center justify-center border border-slate-200 p-1">
                  <img src="assets/images/destinity-inspire.svg" alt="Destinity vButler" class="w-full h-full">
                </div>
              </a>
              <div class="min-w-0 sidebar-brand-text${storage.get('vb:sidebarCollapsed') ? ' sidebar-brand-hidden' : ''}">
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

      // Activate the fixed-header / scrollable-content layout
      document.body.classList.add('vb-app');
      const layoutDiv = el.nextElementSibling;
      if (layoutDiv) layoutDiv.classList.add('vb-layout');
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
      const isCollapsed = storage.get('vb:sidebarCollapsed') || false;
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
        <aside id="desktop-sidebar" data-active="${active}" class="hidden md:flex flex-col h-full shrink-0 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-700 ${isCollapsed ? 'vb-sidebar-collapsed' : ''}">
          <nav class="flex-1 overflow-y-auto p-2 space-y-1">
            ${items.map(item => `
            <a href="${item.href}" title="${item.label}" class="sidebar-nav-item flex items-center gap-3 px-3 py-3 rounded-lg text-sm font-medium transition-colors ${active === item.id
              ? 'bg-[#003c52]/10 text-[#003c52] dark:bg-teal-900/30 dark:text-teal-400'
              : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white'}">
              <span class="material-symbols-outlined text-xl shrink-0">${item.icon}</span>
              <span class="sidebar-label">${item.label}</span>
            </a>`).join('')}
          </nav>
          <div class="p-2 border-t border-slate-200 dark:border-slate-700">
            <button onclick="App.auth.logout()" title="Sign Out" class="sidebar-nav-item flex items-center gap-3 w-full px-3 py-3 rounded-lg text-sm font-medium text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 transition">
              <span class="material-symbols-outlined text-xl shrink-0">logout</span>
              <span class="sidebar-label">Sign Out</span>
            </button>
          </div>
        </aside>`;

      // ── Mobile drawer (slide-in) ───────────────────────────────────────────
      if (!document.getElementById('mobile-menu-drawer')) {
        const frag = document.createElement('div');
        frag.innerHTML = `
          <div id="mobile-menu-overlay"
               class="md:hidden fixed inset-0 z-40 bg-black/50 opacity-0 pointer-events-none transition-opacity duration-300"
               onclick="App.sidebar.closeMobile()"></div>
          <div id="mobile-menu-drawer"
               class="md:hidden fixed inset-y-0 left-0 z-50 w-72 flex flex-col bg-white dark:bg-slate-900 shadow-2xl
                      -translate-x-full transition-transform duration-300 ease-in-out">
            <div class="flex items-center justify-between p-5 border-b border-slate-200 dark:border-slate-700 shrink-0">
              <a href="dashboard.html" class="flex items-center gap-3" onclick="App.sidebar.closeMobile()">
                <div class="w-9 h-9 rounded-xl bg-white flex items-center justify-center border border-slate-200 p-1.5 shrink-0">
                  <img src="assets/images/destinity-inspire.svg" alt="Destinity vButler" class="w-full h-full">
                </div>
                <div>
                  <div class="font-bold text-slate-900 dark:text-white text-sm leading-tight">Destinity vButler</div>
                  <div class="text-xs text-slate-500 dark:text-slate-400">Browns Hotels & Resorts</div>
                </div>
              </a>
              <button onclick="App.sidebar.closeMobile()"
                      class="w-9 h-9 rounded-full flex items-center justify-center text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 transition shrink-0"
                      aria-label="Close menu">
                <span class="material-symbols-outlined text-xl">close</span>
              </button>
            </div>
            <nav id="mobile-menu-nav" class="flex-1 overflow-y-auto p-4 space-y-1"></nav>
            <div class="p-4 border-t border-slate-200 dark:border-slate-700 shrink-0">
              <button onclick="App.auth.logout()"
                      class="flex items-center gap-3 w-full px-4 py-3 rounded-lg text-sm font-medium text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 transition">
                <span class="material-symbols-outlined text-xl">logout</span>
                Sign Out
              </button>
            </div>
          </div>`;
        while (frag.firstChild) document.body.appendChild(frag.firstChild);
      }

      // Update mobile nav items (keeps active state in sync)
      const mobileNav = document.getElementById('mobile-menu-nav');
      if (mobileNav) {
        mobileNav.innerHTML = items.map(item => `
          <a href="${item.href}" onclick="App.sidebar.closeMobile()"
             class="flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${active === item.id
               ? 'bg-[#003c52]/10 text-[#003c52] dark:bg-teal-900/30 dark:text-teal-400'
               : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white'}">
            <span class="material-symbols-outlined text-xl">${item.icon}</span>
            ${item.label}
          </a>`).join('');
      }
    },

    toggleMenu() {
      if (window.innerWidth >= 768) {
        sidebar.toggleDesktop();
      } else {
        sidebar.openMobile();
      }
    },

    toggleDesktop() {
      const isCollapsed = storage.get('vb:sidebarCollapsed') || false;
      const next = !isCollapsed;
      storage.set('vb:sidebarCollapsed', next);
      const aside = document.getElementById('desktop-sidebar');
      if (aside) aside.classList.toggle('vb-sidebar-collapsed', next);
      // Sync header brand visibility
      const brandLogo = document.querySelector('.sidebar-brand-logo');
      const brandText = document.querySelector('.sidebar-brand-text');
      if (brandLogo) brandLogo.classList.toggle('sidebar-brand-hidden', next);
      if (brandText) brandText.classList.toggle('sidebar-brand-hidden', next);
    },

    openMobile() {
      const overlay = document.getElementById('mobile-menu-overlay');
      const drawer  = document.getElementById('mobile-menu-drawer');
      if (!overlay || !drawer) return;
      overlay.classList.remove('opacity-0', 'pointer-events-none');
      overlay.classList.add('opacity-100', 'pointer-events-auto');
      drawer.classList.remove('-translate-x-full');
      drawer.classList.add('translate-x-0');
      document.body.style.overflow = 'hidden';
    },

    closeMobile() {
      const overlay = document.getElementById('mobile-menu-overlay');
      const drawer  = document.getElementById('mobile-menu-drawer');
      if (!overlay || !drawer) return;
      overlay.classList.remove('opacity-100', 'pointer-events-auto');
      overlay.classList.add('opacity-0', 'pointer-events-none');
      drawer.classList.remove('translate-x-0');
      drawer.classList.add('-translate-x-full');
      document.body.style.overflow = '';
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

  // ─── DatePicker (Flatpickr) ──────────────────────────────────────────────────
  const datepicker = (() => {
    let _ready = false;
    const _queue = [];

    function _load() {
      if (document.getElementById('flatpickr-js')) return;
      const css = document.createElement('link');
      css.rel = 'stylesheet';
      css.href = 'https://cdn.jsdelivr.net/npm/flatpickr/dist/flatpickr.min.css';
      document.head.appendChild(css);
      const js = document.createElement('script');
      js.id = 'flatpickr-js';
      js.src = 'https://cdn.jsdelivr.net/npm/flatpickr';
      js.onload = () => {
        _ready = true;
        _queue.splice(0).forEach(fn => fn());
      };
      document.head.appendChild(js);
    }

    function _whenReady(fn) {
      if (_ready && window.flatpickr) { fn(); return; }
      _queue.push(fn);
      _load();
    }

    function _el(s) {
      return typeof s === 'string' ? document.querySelector(s) : s;
    }

    return {
      ready: _whenReady,
      date(selector, options = {}) {
        _whenReady(() => {
          const el = _el(selector);
          if (!el || el._flatpickr) return;
          flatpickr(el, { disableMobile: true, dateFormat: 'Y-m-d', ...options });
        });
      },
      time(selector, options = {}) {
        _whenReady(() => {
          const el = _el(selector);
          if (!el || el._flatpickr) return;
          flatpickr(el, { disableMobile: true, enableTime: true, noCalendar: true, dateFormat: 'H:i', time_24hr: true, ...options });
        });
      },
      destroy(selector) {
        const el = _el(selector);
        if (el && el._flatpickr) el._flatpickr.destroy();
      }
    };
  })();

  // ─── Init ─────────────────────────────────────────────────────────────────────
  function init() {
    theme.apply();
    toast.init();

    // Inject layout CSS — only active on pages that call header.render() (adds body.vb-app)
    const s = document.createElement('style');
    s.textContent = `
      body.vb-app { height: 100%; overflow: hidden; display: flex; flex-direction: column; }
      html:has(body.vb-app) { height: 100%; overflow: hidden; }
      body.vb-app > #app-header { flex-shrink: 0; }
      body.vb-app > .vb-layout  { flex: 1 1 0; min-height: 0; overflow: hidden; display: flex; }
      body.vb-app > .vb-layout > main { flex: 1 1 0; overflow-y: auto; min-height: 0; }

      /* Desktop sidebar collapse */
      #desktop-sidebar { width: 18rem; transition: width 0.25s cubic-bezier(0.4,0,0.2,1); overflow: hidden; }
      #desktop-sidebar.vb-sidebar-collapsed { width: 4rem; }
      #desktop-sidebar .sidebar-label { transition: opacity 0.15s ease, max-width 0.25s cubic-bezier(0.4,0,0.2,1); max-width: 16rem; overflow: hidden; white-space: nowrap; }
      #desktop-sidebar.vb-sidebar-collapsed .sidebar-label { opacity: 0; max-width: 0; }
      #desktop-sidebar .sidebar-nav-item { transition: justify-content 0s, gap 0.25s; }
      #desktop-sidebar.vb-sidebar-collapsed .sidebar-nav-item { justify-content: center !important; gap: 0 !important; }

      /* Header brand hide/show when sidebar collapses */
      .sidebar-brand-logo, .sidebar-brand-text { transition: opacity 0.2s ease, max-width 0.25s cubic-bezier(0.4,0,0.2,1); max-width: 16rem; overflow: hidden; }
      .sidebar-brand-hidden { opacity: 0; max-width: 0 !important; pointer-events: none; }
    `;
    document.head.appendChild(s);
  }

  // Run on load
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  return { storage, auth, reservations, requests, complaints, wishlist, notifications, wakeUpCalls, preArrival, theme, toast, confirm, data, header, bottomNav, sidebar, helpers, datepicker };

})();

window.App = App;
