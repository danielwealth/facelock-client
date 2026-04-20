// client/src/components/admin/Dashboard.jsx
import React, { useEffect, useState, useCallback } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Button,
  ScrollView,
  ActivityIndicator,
  StyleSheet,
  FlatList,
  Modal,
} from 'react-native-web';

const API_BASE = (process.env.REACT_APP_API_URI || process.env.REACT_APP_API_URL || '').replace(/\/$/, '');

// Small presentational card
function StatCard({ title, value, hint }) {
  return (
    <View style={styles.statCard}>
      <Text style={styles.statTitle}>{title}</Text>
      <Text style={styles.statValue}>{value}</Text>
      {hint ? <Text style={styles.statHint}>{hint}</Text> : null}
    </View>
  );
}

function RowButton({ label, onPress, color = '#0b5cff' }) {
  return (
    <TouchableOpacity style={[styles.rowButton, { backgroundColor: color }]} onPress={onPress}>
      <Text style={styles.rowButtonText}>{label}</Text>
    </TouchableOpacity>
  );
}

export default function Dashboard({ setRoute }) {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({ users: 0, active: 0, matches: 0 });
  const [users, setUsers] = useState([]);
  const [matches, setMatches] = useState([]);
  const [query, setQuery] = useState('');
  const [page, setPage] = useState(1);
  const [pageSize] = useState(12);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedUser, setSelectedUser] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [error, setError] = useState(null);
  const [refreshing, setRefreshing] = useState(false);

  const fetchStats = useCallback(async () => {
    if (!API_BASE) return;
    try {
      const res = await fetch(`${API_BASE}/admin/stats`);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const json = await res.json();
      setStats({
        users: json.users || 0,
        active: json.activeUsers || 0,
        matches: json.matches || 0,
      });
    } catch (err) {
      console.warn('fetchStats error', err);
      setError('Failed to load stats');
    }
  }, []);

  const fetchUsers = useCallback(async (pageNum = 1, q = '') => {
    if (!API_BASE) return;
    try {
      const params = new URLSearchParams({ page: pageNum, pageSize, q });
      const res = await fetch(`${API_BASE}/admin/users?${params.toString()}`);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const json = await res.json();
      setUsers(json.users || []);
      setTotalPages(Math.max(1, Math.ceil((json.total || 0) / pageSize)));
    } catch (err) {
      console.warn('fetchUsers error', err);
      setError('Failed to load users');
    }
  }, [pageSize]);

  const fetchMatches = useCallback(async () => {
    if (!API_BASE) return;
    try {
      const res = await fetch(`${API_BASE}/admin/recent-matches?limit=8`);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const json = await res.json();
      setMatches(json.matches || []);
    } catch (err) {
      console.warn('fetchMatches error', err);
      setError('Failed to load matches');
    }
  }, []);

  const loadAll = useCallback(async () => {
    setLoading(true);
    setError(null);
    await Promise.all([fetchStats(), fetchUsers(page, query), fetchMatches()]);
    setLoading(false);
  }, [fetchStats, fetchUsers, fetchMatches, page, query]);

  useEffect(() => {
    loadAll();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page]);

  // Refresh action
  const handleRefresh = async () => {
    setRefreshing(true);
    await loadAll();
    setRefreshing(false);
  };

  // Search action
  const handleSearch = async () => {
    setPage(1);
    await fetchUsers(1, query);
  };

  // Open user detail modal
  const openUser = (user) => {
    setSelectedUser(user);
    setModalVisible(true);
  };

  // Admin action examples
  const handleLockUser = async (userId) => {
    if (!API_BASE) return;
    try {
      const res = await fetch(`${API_BASE}/admin/users/${userId}/lock`, { method: 'POST' });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      await fetchUsers(page, query);
    } catch (err) {
      console.error('lock user error', err);
      setError('Failed to lock user');
    }
  };

  const handleResetPassword = async (userId) => {
    if (!API_BASE) return;
    try {
      const res = await fetch(`${API_BASE}/admin/users/${userId}/reset-password`, { method: 'POST' });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      alert('Password reset requested');
    } catch (err) {
      console.error('reset password error', err);
      setError('Failed to reset password');
    }
  };

  // Pagination controls
  const prevPage = () => setPage((p) => Math.max(1, p - 1));
  const nextPage = () => setPage((p) => Math.min(totalPages, p + 1));

  return (
    <View style={styles.container}>
      <View style={styles.headerRow}>
        <Text style={styles.title}>Admin Dashboard</Text>
        <View style={styles.headerActions}>
          <Button title={refreshing ? 'Refreshing...' : 'Refresh'} onPress={handleRefresh} disabled={refreshing} />
          <Button title="Create Admin" onPress={() => setRoute && setRoute('admin-create')} />
        </View>
      </View>

      <View style={styles.statsRow}>
        <StatCard title="Total Users" value={stats.users} hint="Registered accounts" />
        <StatCard title="Active Users" value={stats.active} hint="Active in last 7 days" />
        <StatCard title="Matches" value={stats.matches} hint="Total matches" />
      </View>

      <View style={styles.controlsRow}>
        <View style={styles.searchBox}>
          <TextInput
            placeholder="Search users by email or id"
            value={query}
            onChangeText={setQuery}
            style={styles.searchInput}
          />
          <Button title="Search" onPress={handleSearch} />
        </View>
        <View style={styles.quickActions}>
          <Button title="Upload Image" onPress={() => setRoute && setRoute('upload')} />
          <Button title="Verify Document" onPress={() => setRoute && setRoute('document-verification')} />
        </View>
      </View>

      {loading ? (
        <View style={styles.loading}>
          <ActivityIndicator size="large" />
          <Text style={{ marginTop: 8 }}>Loading dashboard...</Text>
        </View>
      ) : (
        <View style={styles.contentRow}>
          <View style={styles.leftColumn}>
            <Text style={styles.sectionTitle}>Users</Text>
            {error ? <Text style={styles.errorText}>{error}</Text> : null}
            <FlatList
              data={users}
              keyExtractor={(item) => String(item._id || item.id || item.email)}
              renderItem={({ item }) => (
                <View style={styles.userRow}>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.userEmail}>{item.email}</Text>
                    <Text style={styles.userMeta}>ID: {item._id || item.id} • Role: {item.role || 'user'}</Text>
                  </View>
                  <View style={styles.userActions}>
                    <RowButton label="View" onPress={() => openUser(item)} color="#0b5cff" />
                    <RowButton label="Lock" onPress={() => handleLockUser(item._id || item.id)} color="#d9534f" />
                  </View>
                </View>
              )}
              ListEmptyComponent={<Text style={styles.emptyText}>No users found</Text>}
            />

            <View style={styles.pagination}>
              <Button title="Prev" onPress={prevPage} disabled={page <= 1} />
              <Text style={styles.pageText}>Page {page} / {totalPages}</Text>
              <Button title="Next" onPress={nextPage} disabled={page >= totalPages} />
            </View>
          </View>

          <View style={styles.rightColumn}>
            <Text style={styles.sectionTitle}>Recent Matches</Text>
            <ScrollView style={styles.matchesList}>
              {matches.length === 0 ? <Text style={styles.emptyText}>No recent matches</Text> : null}
              {matches.map((m) => (
                <View key={m._id || m.id} style={styles.matchRow}>
                  <Text style={styles.matchText}>{m.userEmail} ↔ {m.matchedWithEmail}</Text>
                  <Text style={styles.matchMeta}>{new Date(m.createdAt).toLocaleString()}</Text>
                </View>
              ))}
            </ScrollView>

            <View style={{ marginTop: 12 }}>
              <Text style={styles.sectionTitle}>Quick Admin Actions</Text>
              <View style={{ marginTop: 8 }}>
                <Button title="Open Biometric Settings" onPress={() => setRoute && setRoute('admin-settings')} />
                <View style={{ height: 8 }} />
                <Button title="Open Unlock Tool" onPress={() => setRoute && setRoute('admin-unlock')} />
                <View style={{ height: 8 }} />
                <Button title="Reset Selected User Password" onPress={() => {
                  if (!selectedUser) return alert('Select a user first');
                  handleResetPassword(selectedUser._id || selectedUser.id);
                }} />
              </View>
            </View>
          </View>
        </View>
      )}

      <Modal visible={modalVisible} onRequestClose={() => setModalVisible(false)} transparent>
        <View style={styles.modalBackdrop}>
          <View style={styles.modal}>
            <Text style={styles.modalTitle}>User Details</Text>
            {selectedUser ? (
              <>
                <Text style={styles.modalText}>Email: {selectedUser.email}</Text>
                <Text style={styles.modalText}>ID: {selectedUser._id || selectedUser.id}</Text>
                <Text style={styles.modalText}>Role: {selectedUser.role || 'user'}</Text>
                <Text style={styles.modalText}>Created: {new Date(selectedUser.createdAt || selectedUser.created || Date.now()).toLocaleString()}</Text>
                <View style={{ marginTop: 12, display: 'flex', flexDirection: 'row', gap: 8 }}>
                  <Button title="Close" onPress={() => setModalVisible(false)} />
                  <Button title="Lock" onPress={() => { handleLockUser(selectedUser._id || selectedUser.id); setModalVisible(false); }} color="#d9534f" />
                </View>
              </>
            ) : (
              <Text>No user selected</Text>
            )}
          </View>
        </View>
      </Modal>
    </View>
  );
}

/* Styles */
const styles = StyleSheet.create({
  container: { padding: 16, display: 'flex', flexDirection: 'column', gap: 12 },
  headerRow: { display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  title: { fontSize: 22, fontWeight: '700' },
  headerActions: { display: 'flex', flexDirection: 'row', gap: 8 },

  statsRow: { display: 'flex', flexDirection: 'row', gap: 12, marginTop: 8 },
  statCard: { flex: 1, padding: 12, backgroundColor: '#fff', borderRadius: 8, borderLeftWidth: 6, borderLeftColor: '#0b5cff', boxShadow: '0 1px 3px rgba(0,0,0,0.06)' },
  statTitle: { fontSize: 12, fontWeight: '700', color: '#333' },
  statValue: { fontSize: 20, fontWeight: '800', marginTop: 6 },
  statHint: { fontSize: 12, color: '#666', marginTop: 6 },

  controlsRow: { display: 'flex', flexDirection: 'row', justifyContent: 'space-between', marginTop: 12, gap: 12 },
  searchBox: { display: 'flex', flexDirection: 'row', gap: 8, alignItems: 'center', flex: 1 },
  searchInput: { flex: 1, padding: 8, borderWidth: 1, borderColor: '#ddd', borderRadius: 6, backgroundColor: '#fff' },
  quickActions: { display: 'flex', flexDirection: 'row', gap: 8 },

  loading: { padding: 24, alignItems: 'center' },

  contentRow: { display: 'flex', flexDirection: 'row', gap: 12, marginTop: 12 },
  leftColumn: { flex: 1, backgroundColor: '#fff', padding: 12, borderRadius: 8 },
  rightColumn: { width: 360, backgroundColor: '#fff', padding: 12, borderRadius: 8 },

  sectionTitle: { fontSize: 16, fontWeight: '700', marginBottom: 8 },
  userRow: { display: 'flex', flexDirection: 'row', alignItems: 'center', paddingVertical: 8, borderBottomWidth: 1, borderBottomColor: '#f0f0f0' },
  userEmail: { fontWeight: '700' },
  userMeta: { fontSize: 12, color: '#666' },
  userActions: { display: 'flex', flexDirection: 'row', gap: 8 },

  rowButton: { paddingVertical: 6, paddingHorizontal: 10, borderRadius: 6 },
  rowButtonText: { color: '#fff', fontWeight: '700' },

  emptyText: { color: '#666', fontStyle: 'italic' },

  pagination: { display: 'flex', flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: 12, marginTop: 12 },
  pageText: { fontWeight: '700' },

  matchesList: { maxHeight: 300 },
  matchRow: { paddingVertical: 8, borderBottomWidth: 1, borderBottomColor: '#f0f0f0' },
  matchText: { fontWeight: '700' },
  matchMeta: { fontSize: 12, color: '#666' },

  modalBackdrop: { position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.4)', display: 'flex', justifyContent: 'center', alignItems: 'center' },
  modal: { width: 520, backgroundColor: '#fff', padding: 16, borderRadius: 8 },
  modalTitle: { fontSize: 18, fontWeight: '800', marginBottom: 8 },
  modalText: { marginTop: 6 },

  errorText: { color: '#b02a37', marginBottom: 8 },
});
